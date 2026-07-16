// 조달원 확인서 신청(MUI-CM-01-P20) 폼 스키마 — react-hook-form + zod.
// 데이터영역 dm_sosCnfdocAplyInfo(설계서 00.공통 v0.84 slide134): 신청사유(aplyRsn)만 Editable·필수.
//   신청인 성명(aplcntNm)·연락처(aplcntTelno)는 ReadOnly(자동완성)라 폼 검증 대상이 아니다 → 스키마 제외.
import { z } from 'zod'

// zod v4: 에러 메시지는 { error }.
export const dmstSosCnfdocAplySchema = z.object({
  // 신청사유(aplyRsn) — Editable·필수, 4000자. 공백만 입력 방지(trim 후 min 1).
  aplyRsn: z
    .string()
    .trim()
    .min(1, { error: '신청사유를 작성해주세요.' })
    .max(4000, { error: '신청사유는 4000자 이내로 작성해주세요.' }),
})

export type DmstSosCnfdocAplyForm = z.infer<typeof dmstSosCnfdocAplySchema>
