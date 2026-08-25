// 개인정보 수정 폼 스키마 (MUI-CM-02-M04, 설계서 slide200) — 수정 가능 항목만.
// Dim 항목(아이디/사용자명/사용자 유형/실명인증여부/부서명/업체명)은 수정 불가라 폼에 포함하지 않는다.
// 필수(*): 이메일 주소 · 휴대전화번호 · 전화번호. 팩스번호는 선택.
import { z } from 'zod'

import { emailSchema, phoneSchema } from '@/utils/validators'

export const indvInfoMdfcnSchema = z.object({
  /** 이메일 주소 (emlAddr) — 필수, 형식 검증(공용 emailSchema) */
  emlAddr: emailSchema,
  /** 휴대전화번호 (mblTelno) — 필수, 하이픈 포함 형식(공용 phoneSchema) */
  mblTelno: phoneSchema,
  /** 전화번호 (telno) — 필수 */
  telno: z.string().min(1, { error: '전화번호를 입력해주세요' }),
  /** 팩스번호 (fxno) — 선택 */
  fxno: z.string(),
})

export type IndvInfoMdfcnForm = z.infer<typeof indvInfoMdfcnSchema>
