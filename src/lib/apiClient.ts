import axios, { type AxiosError, type AxiosResponse } from 'axios'

// 요청 봉투에 metadata 를 실어야 하는 API 용 — 호출 시 config 3번째 인자로 지정.
// 예: apiClient.post<T, T>(url, body, { metadata: { pageNo: 1, pageSize: 10 } })
declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 요청 봉투 metadata(옵션) — 지정 시 body 가 { metadata, data } 로 감싸진다. */
    metadata?: Record<string, unknown>
  }
}
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

// 요청 인터셉터 — ① 인증 토큰 자동 첨부 ② body 를 { data } 봉투로 래핑(백엔드 요청 규격,
// 응답 봉투 { metadata, data } 와 대칭). 서비스는 봉투 없이 알맹이만 보낸다(응답 언래핑과 동일 원칙).
// metadata 가 필요한 API 는 config.metadata 로 지정 → { metadata, data } 로 전송.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.metadata) {
    config.data = { metadata: config.metadata, data: config.data ?? {} }
  } else if (isWrappableBody(config.data)) {
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
