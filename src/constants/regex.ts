// frontend-architecture.md §9.2 — 정규식 상수
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^01[016-9]\d{7,8}$/,
} as const
