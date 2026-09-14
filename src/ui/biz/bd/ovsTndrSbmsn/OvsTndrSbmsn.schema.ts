// 국외 입찰서 제출(MUI-BD-06-M71) [신청하기] 검증 스키마 (react-hook-form + zod).
// 행정정보 공동이용 사전동의서 — 국외 입찰서에만 추가(PC 개정 메모 정정분, 2026-09-14 사용자 지시). 국내 입찰서엔 없음.
// 본문 문구는 미확보(문구 수령 시 페이지 상수 ADM_INFO_AGRE_BODY 교체) — 동의 필수 검증은 완성.
import { z } from 'zod'

/** 사전동의서 id — ⚠️ 영문 항목명 설계서 미정의(잠정). */
export const ADM_INFO_AGRE_ID = 'admInfoAgre'

export const ovsTndrAgreSchema = z.object({
  /** 동의 완료된 동의서 id 목록(AgreementList checked) — 사전동의서 필수. */
  agreed: z
    .array(z.string())
    .refine((ids) => ids.includes(ADM_INFO_AGRE_ID), { error: '행정정보 공동이용 사전동의서에 동의해주세요.' }),
})
export type OvsTndrAgreValues = z.infer<typeof ovsTndrAgreSchema>
