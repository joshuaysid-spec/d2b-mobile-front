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
    .refine((ids) => ids.includes(ADM_INFO_AGRE_ID), {
      error: '행정정보 공동이용 사전동의서에 동의해주세요.',
    }),
})
export type OvsTndrAgreValues = z.infer<typeof ovsTndrAgreSchema>

// ── T72/T73 입찰참여품목 — [다음으로] 검증(2026-09-16 사용자 지시, 탭마다 RHF·페이지는 확정값 보관). ──
//   단가제(T72): 품목마다 입찰단가(bdngTccrUntprc, E) 필수·0 초과. 총액제(T73): 입찰금액(bdngTccrAmt, E) 필수·0 초과.
//   한 스키마에 mode 로 분기 — 탭 컴포넌트가 detail.bidMthdNm 으로 mode 를 정해 defaultValues 에 넣는다.
//   ⚠️ 필수·범위 규칙은 설계서 slide477~478 이벤트(ibx_unitPrice/amountPrice_onchange)만 있고 필수 표기 없어 잠정.
const toAmountNum = (s: string) => Number(s.replace(/[^\d.]/g, ''))

export const ovsTndrItemSchema = z
  .object({
    /** 입찰방식 — 단가제/총액제(임시 항목 bidMthdNm 값 그대로). */
    mode: z.enum(['단가제', '총액제']),
    /** 단가제 품목별 입찰단가 — 행 식별(frcptlArtclNo) + 입력값(콤마 포함 표시 문자열). */
    items: z.array(z.object({ frcptlArtclNo: z.string(), bdngTccrUntprc: z.string() })),
    /** 총액제 입찰금액(콤마 포함 표시 문자열). */
    bdngTccrAmt: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.mode === '총액제') {
      if (!v.bdngTccrAmt)
        ctx.addIssue({ code: 'custom', path: ['bdngTccrAmt'], message: '입찰금액을 입력해주세요.' })
      else if (!(toAmountNum(v.bdngTccrAmt) > 0))
        ctx.addIssue({
          code: 'custom',
          path: ['bdngTccrAmt'],
          message: '입찰금액은 0보다 커야 합니다.',
        })
      return
    }
    v.items.forEach((row, i) => {
      const issue = (message: string) =>
        ctx.addIssue({ code: 'custom', path: ['items', i, 'bdngTccrUntprc'], message })
      if (!row.bdngTccrUntprc) issue('입찰단가를 입력해주세요.')
      else if (!(toAmountNum(row.bdngTccrUntprc) > 0)) issue('입찰단가는 0보다 커야 합니다.')
    })
  })
export type OvsTndrItemValues = z.infer<typeof ovsTndrItemSchema>
