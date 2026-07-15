import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { STORAGE_KEYS } from '@/constants/storage'
import type { ApiError } from '@/types/api'

// frontend-architecture.md §6.1 — axios 인스턴스 + 인터셉터
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// 요청 인터셉터 — 인증 토큰 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
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
    // TODO: 세션 만료(401) 처리 — 로그인 화면 이동, 토큰 갱신 등
    return Promise.reject(error)
  },
)
