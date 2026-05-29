import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { STORAGE_KEYS } from '@/constants/storage'

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

// 응답 인터셉터 — 웹스퀘어 공통 응답 포맷 { code, message, data } 언래핑
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const body = response.data
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
