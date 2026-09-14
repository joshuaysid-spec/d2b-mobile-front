// 국외 입찰참가신청서 작성(MUI-BD-04-M71) 탭별 폼 스키마 (react-hook-form + zod).
// 구조(2026-09-14 사용자 확정): 탭마다 RHF — 각 탭이 자기 스키마로 [다음으로] 때 현재 탭만 검증, 페이지는 확정값만 보관.
// 규칙 근거: 설계서 v1.88 slide449~452 항목표(필수 Y/N·자릿수). [다음으로]/[신청하기] 검증 문구는 설계서 미기재라
//   아래 문구는 프로젝트 관례(TaskCldrReg 등 "…해주세요.")로 정함(사용자 확정 2026-09-14).
// zod v4: 에러 메시지는 { error: '...' }.
import { z } from 'zod'

// ── T71 서약서동의 목록 — 필수 서약서(청렴 계약 이행 서약서) 동의 체크 필수(목록 [필수] 태그 기준, 설계서 미기재) ──
export const ovsWrotAgreSchema = (requiredIds: string[]) =>
  z.object({
    /** 동의 완료된 서약서 id 목록(AgreementList checked). */
    wrotChecked: z
      .array(z.string())
      .refine((ids) => requiredIds.every((id) => ids.includes(id)), {
        error: '서약서에 동의해주세요.',
      }),
  })
export type OvsWrotAgreValues = z.infer<ReturnType<typeof ovsWrotAgreSchema>>

// ── T73 업체정보(dm_splyInfo) — 업체코드(splyBzentyCd, E/Y, 5) 만 편집 ──────────────
export const ovsSplyInfoSchema = z.object({
  /** 입찰업체 업체코드(splyBzentyCd) — 필수, 5자리(설계서 자릿수). */
  splyBzentyCd: z
    .string()
    .min(1, { error: '업체코드를 입력해주세요.' })
    .max(5, { error: '업체코드는 5자리 이내로 입력해주세요.' }),
})
export type OvsSplyInfoValues = z.infer<typeof ovsSplyInfoSchema>

// ── T74 입찰보증금 — 구분(비면제/면제) + 사업별(dl_bizList / dl_bizExmptnList) 편집 항목 ──
/** 입찰보증금 구분 — ⚠️ 값 항목명 설계서 미정의(이벤트 sbx_depositType 파생 임시 키). */
export const DEPOSIT_TYPE = { nonExmptn: 'nonExmptn', exmptn: 'exmptn' } as const
/** 보증금납부방법(grntePayMth, 1) — 보증보험/전자보증서. */
export const PAY_METHOD = { insurance: 'insurance', eGuarantee: 'eGuarantee' } as const

/** 사업 1건 폼 값 — R 항목(prchsDmndNo·bidGrnteAmt)은 검증 비교용으로 함께 보관. */
const bizGrnteRowSchema = z.object({
  /** 구매요청번호(prchsDmndNo, R) — 행 식별. */
  prchsDmndNo: z.string(),
  /** 입찰보증금(bidGrnteAmt, R, 달러금액) — 확인입력 일치 비교 대상. */
  bidGrnteAmt: z.string(),
  /** 입찰보증금(확인입력)(chckBidGrnteAmt, E/Y, 25) — 비면제만 편집(면제는 R, 사용자 확정). */
  chckBidGrnteAmt: z.string(),
  /** 보증금납부방법(grntePayMth, E/Y, 1). */
  grntePayMth: z.string(),
  /** 보증금증권번호(wtgrNo, E/Y, 30) — 전자보증서면 P75 적용값. */
  wtgrNo: z.string(),
  /** 보증기관명(grnteInstNm, E/Y, 200) — 전자보증서면 P75 적용값. */
  grnteInstNm: z.string(),
  /** 입찰보증금납부서 파일명(grntePyslDocNo, E/N, 38) — 선택. */
  grntePyslDocNo: z.string(),
  /** 연대보증서 파일명(gurnAgreDocNo, E/Y, 38) — 면제 전용 필수. */
  gurnAgreDocNo: z.string(),
  /** 지급각서 파일명(giveWrtprmDocNo, E/Y, 38) — 면제 전용 필수. */
  giveWrtprmDocNo: z.string(),
})
export type OvsBizGrnteRow = z.infer<typeof bizGrnteRowSchema>

/** 달러금액 문자열 → 숫자(통화기호·콤마 제거). 비교 실패는 NaN. */
export const toAmountNumber = (s: string) => Number(s.replace(/[^\d.]/g, ''))

export const ovsBidGrnteSchema = z
  .object({
    depositType: z.enum([DEPOSIT_TYPE.nonExmptn, DEPOSIT_TYPE.exmptn]),
    bizList: z.array(bizGrnteRowSchema),
  })
  .superRefine((v, ctx) => {
    const issue = (i: number, key: keyof OvsBizGrnteRow, message: string) =>
      ctx.addIssue({ code: 'custom', path: ['bizList', i, key], message })
    v.bizList.forEach((row, i) => {
      if (v.depositType === DEPOSIT_TYPE.exmptn) {
        // 면제(dl_bizExmptnList): 연대보증서·지급각서 파일 필수.
        if (!row.gurnAgreDocNo) issue(i, 'gurnAgreDocNo', '연대보증서 파일을 첨부해주세요.')
        if (!row.giveWrtprmDocNo) issue(i, 'giveWrtprmDocNo', '지급각서 파일을 첨부해주세요.')
        return
      }
      // 비면제(dl_bizList): 확인입력 필수 + 입찰보증금과 일치(사용자 확정) · 납부방법·증권번호·보증기관명 필수.
      if (!row.chckBidGrnteAmt) issue(i, 'chckBidGrnteAmt', '입찰보증금을 확인 입력해주세요.')
      else if (toAmountNumber(row.chckBidGrnteAmt) !== toAmountNumber(row.bidGrnteAmt))
        issue(i, 'chckBidGrnteAmt', '입찰보증금과 일치하지 않습니다.')
      if (!row.grntePayMth) issue(i, 'grntePayMth', '보증금납부방법을 선택해주세요.')
      else if (row.grntePayMth === PAY_METHOD.eGuarantee) {
        // 전자보증서: 입력 비활성 — [보증서선택]으로 적용해야 채워짐.
        if (!row.wtgrNo || !row.grnteInstNm) issue(i, 'wtgrNo', '보증서를 선택해주세요.')
      } else {
        if (!row.wtgrNo) issue(i, 'wtgrNo', '보증금증권번호를 입력해주세요.')
        if (!row.grnteInstNm) issue(i, 'grnteInstNm', '보증기관명을 입력해주세요.')
      }
    })
  })
export type OvsBidGrnteValues = z.infer<typeof ovsBidGrnteSchema>
