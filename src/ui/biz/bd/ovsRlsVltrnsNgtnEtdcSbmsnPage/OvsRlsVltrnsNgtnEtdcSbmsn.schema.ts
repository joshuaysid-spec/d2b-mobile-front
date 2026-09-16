// 국외 공개수의협상 견적서 제출(MUI-BD-12-M74) 탭별 폼 스키마 (react-hook-form + zod).
// 구조(forms.md 스텝 마법사 규칙, 레퍼런스 bd/ovsBidPrtcpAply): 탭마다 RHF — [다음으로] 때 현재 탭만 검증, 페이지는 확정값만 보관.
// ⚠️ 검증 규칙은 설계서 slide541(T76) 에 필수 표기가 없어 잠정(2026-09-16 사용자 지시 "다음 누를 때 검증"):
//   견적단가 필수(0 초과) · 화폐단위 필수 · 품목대체구분 Y 면 수정재고번호·수정부품번호·품목대체첨부문서 필수.
//   응용팀 규칙 확정 시 이 파일만 수정. 문구는 프로젝트 관례("…해주세요.").
import { z } from 'zod'

/** 입찰참여품목 1건 폼 값(dl_bidItemList 편집 항목) — R 항목(frcptlArtclNo)은 행 식별용으로 함께 보관. */
const etdcItemRowSchema = z.object({
  /** 항목번호(frcptlArtclNo, R) — 행 식별. */
  frcptlArtclNo: z.string(),
  /** 품목대체구분(itemSbstSe) — Y/N. */
  itemSbstSe: z.enum(['Y', 'N']),
  /** 품목대체첨부문서 파일명 — ⚠️ 항목명 임시(설계서 미정의). 업로드 GUID 확정 시 교체. */
  itemSbstDocNm: z.string(),
  /** 수정재고번호(mdfcnInvtNo) — 대체 Y 시 필수. */
  mdfcnInvtNo: z.string(),
  /** 수정부품번호(mdfcnPrtsNo) — 대체 Y 시 필수. */
  mdfcnPrtsNo: z.string(),
  /** 견적단가(estmtUntprc) — 필수. */
  estmtUntprc: z.string(),
  /** 화폐단위(crncNm) — 필수(기본값 있음). */
  crncNm: z.string(),
})
export type EtdcItemRow = z.infer<typeof etdcItemRowSchema>

/** 금액 문자열 → 숫자(콤마·통화기호 제거). */
const toAmount = (s: string) => Number(s.replace(/[^\d.]/g, ''))

// ── T76 입찰품목 — 품목 행별 검증(에러 path ['items', i, key] → 카드 안 InputMessage) ──
export const etdcItemsSchema = z
  .object({ items: z.array(etdcItemRowSchema) })
  .superRefine((v, ctx) => {
    v.items.forEach((row, i) => {
      const issue = (key: keyof EtdcItemRow, message: string) =>
        ctx.addIssue({ code: 'custom', path: ['items', i, key], message })
      if (!row.estmtUntprc) issue('estmtUntprc', '견적단가를 입력해주세요.')
      else if (!(toAmount(row.estmtUntprc) > 0))
        issue('estmtUntprc', '견적단가는 0보다 커야 합니다.')
      if (!row.crncNm) issue('crncNm', '화폐단위를 선택해주세요.')
      if (row.itemSbstSe === 'Y') {
        if (!row.mdfcnInvtNo) issue('mdfcnInvtNo', '수정재고번호를 입력해주세요.')
        if (!row.mdfcnPrtsNo) issue('mdfcnPrtsNo', '수정부품번호를 입력해주세요.')
        if (!row.itemSbstDocNm) issue('itemSbstDocNm', '품목대체첨부문서를 첨부해주세요.')
      }
    })
  })
export type EtdcItemsValues = z.infer<typeof etdcItemsSchema>
