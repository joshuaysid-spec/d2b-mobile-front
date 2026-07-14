// MUI-CM-03-P11 금융인증서 본인확인 폼 검증 스키마 — 이 폼 전용이라 옆에 co-locate.
// zod 스키마 = 검증 규칙 + 타입(z.infer)의 단일 진실원천. (zod v4 — 에러는 { error })
//
// TODO(설계서 확인): 금융인증 본인확인 항목(아이디/휴대폰번호/생년월일)의 영문 항목 ID 는
//   설계서(slide51) 데이터영역에 미제공 — 임시로 userId / mobileNo / birthDate 사용.
//   금융인증 SDK · 백엔드 본인확인 API 스펙 확정 시 키만 교체.
import { z } from 'zod'

import { phoneSchema } from '@/utils/validators'

export const fnstCertSchema = z.object({
  // 아이디 (Figma placeholder '예) 홍길동' — 실명/아이디 자유 입력)
  userId: z.string().min(1, { error: '아이디를 입력해주세요' }),
  // 휴대폰번호 — formatPhoneInput 출력(하이픈) 기준 공용 규칙 재사용.
  mobileNo: phoneSchema,
  // 생년월일 — YYYY/MM/DD (Figma placeholder '예) 1900/01/31' — 슬래시 구분).
  birthDate: z
    .string()
    .min(1, { error: '생년월일을 입력해주세요' })
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, { error: '올바른 생년월일 형식이 아닙니다.' }),
})

export type FnstCertForm = z.infer<typeof fnstCertSchema>
