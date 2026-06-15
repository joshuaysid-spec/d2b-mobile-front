// 폼 검증 공용 zod 규칙 — 여러 폼에서 재사용하는 필드 스키마 조각.
// (단일 폼 전용 규칙은 그 폼 옆 `*.schema.ts` 에 둔다. 공유되는 것만 여기로.)
// zod v4: 에러 메시지는 `message:` 가 아니라 `{ error: ... }` 로 준다.
import { z } from 'zod'

/**
 * 휴대번호 — `formatPhoneInput` 출력(하이픈 포함) 기준.
 * 010-1234-5678(3-4-4) 또는 010-123-4567(3-3-4) 허용.
 */
export const phoneSchema = z
  .string()
  .min(1, { error: '휴대번호를 입력하세요.' })
  .regex(/^01\d-\d{3,4}-\d{4}$/, { error: '올바른 휴대번호 형식이 아닙니다.' })

/** 이메일 — zod v4 권장 형식 검증(빈 값도 형식 에러로 처리). */
export const emailSchema = z.email({ error: '올바른 이메일 형식이 아닙니다.' })
