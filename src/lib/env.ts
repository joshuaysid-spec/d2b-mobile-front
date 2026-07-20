// 환경 스위치 — 폐쇄망 반입 전 목업/실연동 전환의 단일 기준점.
// VITE_USE_MOCK !== 'false' 면 목업(안전 기본값 = 목업 ON).
// 폐쇄망 반입 후: .env.production 에서 VITE_USE_MOCK=false + VITE_API_BASE_URL 만 수정하면
// 전 서비스가 실 apiClient 호출로 전환된다. (각 서비스 메서드의 `if (USE_MOCK)` 분기 참조)
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

/** 목업 응답 지연 — 로딩 스피너/스켈레톤 UX 를 실제처럼 확인하기 위한 인위 지연. */
export function mockDelay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}
