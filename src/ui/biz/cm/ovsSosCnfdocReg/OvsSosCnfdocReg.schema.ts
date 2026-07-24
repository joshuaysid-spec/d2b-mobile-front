// 국외조달원등록증신청(MUI-CM-04-M22) 폼 검증 스키마 — 이 폼 전용이라 옆에 co-locate.
// zod 스키마 = 검증 규칙 + 타입(z.infer)의 단일 진실원천.
// 편집 필드만 정의(성명 empNm·회사명 bzentyNm 은 자동완성 readonly 라 폼 밖).
// 항목명(영문)은 설계서 dm_ovsSosAplyInfo·dm_ovsSosAplyDataInfo(00.공통 v0.84 slide341) 그대로.
import { z } from 'zod'

import { phoneSchema } from '@/utils/validators'

export const ovsSosCnfdocRegSchema = z.object({
  // 직위(급) — aplcntJbgdNm (E, 100, 필수)
  aplcntJbgdNm: z
    .string()
    .min(1, { error: '직위(급)를 입력하세요.' })
    .max(100, { error: '직위(급)는 100자 이내로 입력하세요.' }),
  // 연락처 — aplcntEntlno (E, 88, 필수). formatPhoneInput(하이픈) 기준.
  aplcntEntlno: phoneSchema,
  // 업체명1 — bzentyNm1 (E, 100, 필수). 조달업체선택(P23)으로 채움.
  bzentyNm1: z.string().min(1, { error: '업체를 선택하세요.' }),
  // 업체명2 — bzentyNm2 (E, 100, 필수). 조달업체선택(P23)으로 채움.
  bzentyNm2: z.string().min(1, { error: '업체를 선택하세요.' }),
  // 발급신청사유 — aplyRsn (E, 4000, 필수)
  aplyRsn: z
    .string()
    .min(1, { error: '발급신청사유를 입력하세요.' })
    .max(4000, { error: '발급신청사유는 4000자 이내로 입력하세요.' }),
})

export type OvsSosCnfdocRegForm = z.infer<typeof ovsSosCnfdocRegSchema>
