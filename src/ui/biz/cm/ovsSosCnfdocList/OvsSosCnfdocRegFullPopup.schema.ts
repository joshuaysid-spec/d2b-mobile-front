// 국외조달원등록증신청(MUI-CM-04-P22) 폼 스키마 — react-hook-form + zod (폼 표준).
// 항목명은 설계서 dm_ovsSosAplyInfo·dm_ovsSosAplyDataInfo(slide335) 그대로.
// 편집 필드만 포함(회사명 bzentyNm·성명 empNm 은 readonly 자동완성 — 폼 밖).
import { z } from 'zod'

export const ovsSosRegSchema = z.object({
  /** 직위(급) (필수) */
  aplcntJbgdNm: z.string().min(1, { error: '직위(급)을 입력해주세요.' }),
  /** 연락처 (필수) */
  aplcntEntlno: z.string().min(1, { error: '연락처를 입력해주세요.' }),
  /** 업체명 (필수) — 조달업체선택(P23)으로 선택. */
  bzentyNm1: z.string().min(1, { error: '업체를 선택해주세요.' }),
  /** 발급신청사유 (필수) */
  aplyRsn: z.string().min(1, { error: '발급신청사유를 입력해주세요.' }),
})

export type OvsSosRegForm = z.infer<typeof ovsSosRegSchema>

export const OVS_SOS_REG_DEFAULTS: OvsSosRegForm = {
  aplcntJbgdNm: '',
  aplcntEntlno: '',
  bzentyNm1: '',
  aplyRsn: '',
}
