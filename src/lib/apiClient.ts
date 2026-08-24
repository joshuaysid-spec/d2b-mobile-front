import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { STORAGE_KEYS } from '@/constants/storage'
import { USE_MOCK } from '@/lib/env'
import { useAuthStore } from '@/stores/authStore'
import type { ApiError } from '@/types/api'

// frontend-architecture.md §6.1 — axios 인스턴스 + 인터셉터
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// 요청 body 를 { data: ... } 봉투로 감쌀 수 있는 값인지 — 순수 JSON(객체/배열)만.
// FormData(파일 multipart)·Blob·URLSearchParams 등 바이너리/특수 body 는 감싸면 깨지므로 제외.
const isWrappableBody = (body: unknown): boolean =>
  body != null &&
  typeof body === 'object' &&
  !(body instanceof FormData) &&
  !(body instanceof Blob) &&
  !(body instanceof URLSearchParams) &&
  !(body instanceof ArrayBuffer)

// 백엔드 2원화 — URL 시스템 프리픽스로 요청별 서버 분기(서비스 함수는 무수정).
// 기본(A서버) = VITE_API_BASE_URL, 아래 프리픽스로 시작하는 요청만 B서버(VITE_API_BASE_URL_B)로.
// ⚠️ 프리픽스↔서버 매핑 잠정 — 백엔드 확정 시 이 배열만 수정.
const B_SERVER_PREFIXES = ['/cbs', '/tss']

// 요청 인터셉터 — ① 인증 토큰 자동 첨부 ② body 를 { data } 봉투로 래핑(개발계 실규격 확인:
// 요청은 { data } 만, metadata 는 응답 전용(requestId/timestamp/status — 서버가 채움).
// 페이징 등 부가정보도 data 안의 명명 맵(dll_*_paging)으로 들어간다).
// 서비스는 봉투 없이 알맹이만 보낸다(응답 언래핑과 동일 원칙).
// ③ B서버 프리픽스면 이 요청만 baseURL 교체(env 미설정 시 A서버로 폴백 — 동작 무변).
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const baseUrlB = import.meta.env.VITE_API_BASE_URL_B
  if (baseUrlB && B_SERVER_PREFIXES.some((p) => config.url?.startsWith(p))) {
    config.baseURL = baseUrlB
  }
  if (isWrappableBody(config.data)) {
    config.data = { data: config.data }
  }
  return config
})

// 응답 인터셉터 — 백엔드 공통 봉투 { metadata: { status }, data } 처리.
// ① metadata.status.success === false 면 ApiError 로 reject(서비스 catch 로 감).
// ② 성공이면 data 알맹이만 반환(서비스는 봉투를 몰라도 됨).
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const body = response.data
    const status = body?.metadata?.status
    // ① HTTP 200 이라도 success:false 면 업무 에러 → reject
    if (status && status.success === false) {
      const apiError: ApiError = {
        code: status.code ?? null,
        message: status.message ?? null,
        details: status.details ?? [],
      }
      return Promise.reject(apiError)
    }
    // ② 봉투가 있으면 data 만, 아니면(blob 등) 원문 그대로
    if (body && typeof body === 'object' && 'data' in body) {
      return body.data
    }
    return body
  },
  (error: AxiosError) => {
    // 세션 만료(401) — 토큰/유저 초기화 후 로그인 화면으로 하드 이동(라우터 비의존 최소 구현).
    // TODO(백엔드 확정): refresh 토큰 재발급 플로우 — 백엔드 스펙 확정 시 재발급 시도 후 실패 시 로그아웃으로 확장.
    if (!USE_MOCK && error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)
