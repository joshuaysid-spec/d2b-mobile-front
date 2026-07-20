// 신청정보입력(MUI-CM-04-M12) 폼 스키마 — react-hook-form + zod (프로젝트 폼 표준).
// 항목명은 설계서 dm_prfmncPrdocAplyInptInfo(slide266 1.3) 그대로.
// ⚠️ usePrpsCd: 방위사업청 계약 = 사용목적 / 부대 계약 = 제출유형 값이 담긴다.
//   (제출유형은 설계서에 영문 항목명 미정의 — 확정 시 별도 필드로 분리)
import { z } from 'zod'

export const aplyInptSchema = z
  .object({
    /** 신청인 연락처 (필수) */
    entlno: z.string().min(1, { error: '신청인 연락처를 입력해주세요.' }),
    /** 발급수량 — 1통~10통 선택 (필수) */
    dmndQty: z.string().min(1, { error: '발급수량을 선택해주세요.' }),
    /** 제출처 (필수) */
    submOrgn: z.string().min(1, { error: '제출처를 입력해주세요.' }),
    /** 사용목적(방위사업청) 또는 제출유형(부대) (필수) */
    usePrpsCd: z.string().min(1, { error: '선택해주세요.' }),
    /** 상세 내용 — 사용목적 '기타'일 경우만 입력 */
    etcUsePrps: z.string().optional(),
  })
  .refine((v) => v.usePrpsCd !== '기타' || !!v.etcUsePrps?.trim(), {
    error: '기타 내용을 입력해주세요.',
    path: ['etcUsePrps'],
  })

export type AplyInptForm = z.infer<typeof aplyInptSchema>

export const APLY_INPT_DEFAULTS: AplyInptForm = {
  entlno: '',
  dmndQty: '',
  submOrgn: '',
  usePrpsCd: '',
  etcUsePrps: '',
}
