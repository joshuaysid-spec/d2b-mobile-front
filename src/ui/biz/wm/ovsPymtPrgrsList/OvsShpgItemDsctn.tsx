// 선적품목내역(국외) — MUI-WM-01-P78 OvsShpgItemDsctn. 설계서 05.대금청구및사후 v0.85 slide104~105.
// 대금지급현황(M77) 카드 클릭 → 해당 건(B/L번호)의 선적품목 목록 바텀시트.
// 바텀시트 콘텐츠 전용 — BottomSheet 컨테이너(title/footer)는 부모(M77 페이지)가 소유.
// 세부 목록(카드 클릭) 없음(slide104).
import { useState } from 'react'

import { wmQueries } from '@/queries/cts/wm/wmQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'

/** 외화 금액 표기 — 소수 2자리 + USD(설계서 000,000,000,000.00 USD). */
const fmtAmt = (n: number) =>
  `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`

export interface OvsShpgItemDsctnProps {
  /** 조회 대상 B/L번호 — M77 목록 카드에서 주입. */
  blNo: string
  /** 선택 건 계약번호 — 상단 정보 표기(slide104). */
  ctrtNo: string
  /** 선택 건 INVOICE 번호 — 상단 표시레이블. */
  invcNo: string
  /** 바텀시트 열림 여부 — 열릴 때만 조회(enabled). */
  open: boolean
}

export function OvsShpgItemDsctn({ blNo, ctrtNo, invcNo, open }: OvsShpgItemDsctnProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: items = [], isLoading } = wmQueries.useSelectPackingItemList(blNo, open)

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = items.slice(0, loaded)

  // 카드 매핑 — slide104: 재고번호 + 품명 + 행(부품번호/선적수량/선적단가/선적금액).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    subtitle: `재고번호 ${it.invtNo}`,
    title: it.itemNm,
    rows: [
      { label: '부품번호', value: it.prtsNo },
      { label: '선적수량', value: it.shpgQty.toLocaleString() },
      { label: '선적단가', value: fmtAmt(it.shpgUntprc) },
      { label: '선적금액', value: fmtAmt(it.shpgAmt) },
    ],
  }))

  return (
    <div className="flex flex-col gap-krds-7">
      {/* 선택 건 정보 + 건수(slide104 상단) */}
      <div className="flex flex-col gap-krds-3">
        <Badge>{invcNo}</Badge>
        <p className="text-krds-body-sm text-krds-text-muted">B/L번호 {blNo}</p>
        <p className="text-[17px] font-bold leading-normal text-krds-text-ink">
          계약번호 {ctrtNo}
        </p>
        <p className="text-krds-body-sm text-krds-text-primary-active">총 {total}건</p>
      </div>

      <CardList items={cardItems} loading={isLoading} />

      {/* 더보기 — 모두 노출됐으면 숨김. */}
      {loaded < total && (
        <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
          더보기 ({loaded}/{total}건)
        </Button>
      )}
    </div>
  )
}
OvsShpgItemDsctn.displayName = 'OvsShpgItemDsctn'
