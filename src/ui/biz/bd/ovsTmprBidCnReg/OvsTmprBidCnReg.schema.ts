// 입찰내역 작성(MUI-BD-01-M76) 탭 본문 폼 스키마 (react-hook-form + zod) — 단가제(T75)/총액제(T76).
// 구조(forms.md 입력 폼 레인): 화면이 자기 useForm 을 갖고 [입찰내역 저장] 이 handleSubmit 을 트리거,
//   실패 시 항목별 InputMessage + 첫 에러 포커스(focusField). 구 useState 수작업 검증 + AlertModal 안내는 폐기(2026-09-16).
// 규칙 근거: 구 handleSave 판정을 그대로 옮긴 것(설계서 slide318 필수 Y · slide319 품목대체 Replace 조건부 필수).
//   ⚠️ 입력값 형식 규칙(0 초과·자릿수 등)은 설계서 미기재라 넣지 않음 — 필수 여부만 판정(구 동작 그대로).
// zod v4: 에러 메시지는 { error: '...' }.
import { z } from 'zod'

// ── T75 단가제(dl_ititbBidCnList) — 행별 편집 항목. R 항목(품목 기본정보)은 폼 밖(조회 결과)에서 표시 ──
/** 입찰내역(단가제) 1행 폼 값 — 항목번호(frcptlArtclNo, R)는 행 식별용으로 함께 보관. */
const ititbBidCnRowSchema = z.object({
  /** 항목번호(frcptlArtclNo, R) — 행 식별. */
  frcptlArtclNo: z.string(),
  /** 품목대체구분(itemSbstSe) — As it is('A') / Replace('R'). */
  itemSbstSe: z.enum(['A', 'R']),
  /** 품목대체첨부문서(itemSbstDocEn) — 목업은 파일명 보관. Replace 시 필수. */
  itemSbstDocEn: z.string(),
  /** 수정재고번호(mdfcnInvtNo) — Replace 시 필수. */
  mdfcnInvtNo: z.string(),
  /** 수정부품번호(mdfcnPrtsNo) — Replace 시 필수. */
  mdfcnPrtsNo: z.string(),
  /** 납기(본조)(bscbgtDudtYmd) — 선택. */
  bscbgtDudtYmd: z.string(),
  /** 납기(당국)(athrtDudtYmd) — 선택. */
  athrtDudtYmd: z.string(),
  /** 납기(장국)(ltbndDudtYmd) — 선택. */
  ltbndDudtYmd: z.string(),
  /** 입찰업체(splyBzentyNm) — 필수. */
  splyBzentyNm: z.string(),
  /** 입찰단가(bdngTccrUntprc) — 필수. 입찰금액/달러단가/달러금액은 이 값에서 파생(폼 값 아님). */
  bdngTccrUntprc: z.string(),
  /** 화폐단위(crncNm) — 필수. 달러환산율은 이 값에서 파생(폼 값 아님). */
  crncNm: z.string(),
})
export type ItitbBidCnRow = z.infer<typeof ititbBidCnRowSchema>

/** 단가제 — 행별 검증(에러 path ['rows', i, key] → 카드 안 InputMessage). */
export const ititbBidCnSchema = z
  .object({ rows: z.array(ititbBidCnRowSchema) })
  .superRefine((v, ctx) => {
    v.rows.forEach((row, i) => {
      const issue = (key: keyof ItitbBidCnRow, message: string) =>
        ctx.addIssue({ code: 'custom', path: ['rows', i, key], message })
      if (!row.splyBzentyNm) issue('splyBzentyNm', '입찰업체를 선택해주세요.')
      if (!row.crncNm) issue('crncNm', '화폐단위를 선택해주세요.')
      if (!row.bdngTccrUntprc) issue('bdngTccrUntprc', '입찰단가를 입력해주세요.')
      // 품목대체구분 = Replace → 품목대체첨부문서·수정재고번호·수정부품번호 필수(설계서 slide319 이벤트).
      if (row.itemSbstSe === 'R') {
        if (!row.itemSbstDocEn) issue('itemSbstDocEn', '품목대체첨부문서를 첨부해주세요.')
        if (!row.mdfcnInvtNo) issue('mdfcnInvtNo', '수정재고번호를 입력해주세요.')
        if (!row.mdfcnPrtsNo) issue('mdfcnPrtsNo', '수정부품번호를 입력해주세요.')
      }
    })
  })
export type ItitbBidCnValues = z.infer<typeof ititbBidCnSchema>

// ── T76 총액제(dl_alonbsBidCnInfo) — 단건 폼. 달러금액/달러환산율은 파생(폼 값 아님) ──
export const alonbsBidCnSchema = z.object({
  /** 입찰업체(splyBzentyNm) — 필수(설계서 slide318 필수 Y). */
  splyBzentyNm: z.string().min(1, { error: '입찰업체를 선택해주세요.' }),
  /** 화폐단위(crncNm) — 필수. */
  crncNm: z.string().min(1, { error: '화폐단위를 선택해주세요.' }),
  /** 입찰금액(bdngTccrAmt) — 필수. */
  bdngTccrAmt: z.string().min(1, { error: '입찰금액을 입력해주세요.' }),
})
export type AlonbsBidCnValues = z.infer<typeof alonbsBidCnSchema>
