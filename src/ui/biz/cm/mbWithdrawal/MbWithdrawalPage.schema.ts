// 회원탈퇴(MUI-CM-02-P10) 폼 스키마 — react-hook-form + zod.
// 단일 필수 항목: 탈퇴 사유(wdrwRsn) — 여러 줄 입력·필수. 공백만 입력 방지(trim 후 min 1).
// ⚠️ 설계서(00.공통 v0.84 slide209)에 탈퇴 사유의 영문 항목ID가 없어 wdrwRsn(withdrawal reason)로 임시 명명 — 확정 시 교체.
import { z } from 'zod'

// zod v4: 에러 메시지는 { error }.
export const mbWithdrawalSchema = z.object({
  // 탈퇴 사유(wdrwRsn) — Editable·필수.
  wdrwRsn: z
    .string()
    .trim()
    .min(1, { error: '탈퇴 사유를 작성해주세요.' })
    .max(4000, { error: '탈퇴 사유는 4000자 이내로 작성해주세요.' }),
})

export type MbWithdrawalForm = z.infer<typeof mbWithdrawalSchema>
