// frontend-architecture.md §9.2 — 백엔드 응답/에러 코드 상수
export const RESPONSE_CODE = {
  SUCCESS: '0000',
  SESSION_EXPIRED: '9001',
  SERVER_ERROR: '9999',
} as const

export type ResponseCode = (typeof RESPONSE_CODE)[keyof typeof RESPONSE_CODE]
