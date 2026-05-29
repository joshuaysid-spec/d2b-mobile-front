import { REGEX } from '@/constants/regex'

// frontend-architecture.md §9.1 — 입력값 검증 순수 함수

export function isEmail(value: string): boolean {
  return REGEX.EMAIL.test(value)
}

export function isPhone(value: string): boolean {
  return REGEX.PHONE.test(value)
}
