// 전자계산서목록(국외) — MUI-WM-01-P73 OvsElcrtTxivList. 설계서 05.대금청구및사후 v0.85 slide91~92.
// 물품수령확인서목록(M71) 카드 클릭 → 해당 계약의 전자계산서(세금계산서) 목록 바텀시트.
// 바텀시트 콘텐츠 전용 — BottomSheet 컨테이너(title/footer)는 부모(M71 페이지)가 소유.
// 카드 클릭 시 전자계산서상세(M74) 이동은 부모 콜백으로 위임(slide93 이벤트).
import { useState } from 'react'

import { wmQueries } from '@/queries/cts/wm/wmQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import type { OvsElcrtTxivItem } from '@/types/mock/wm'

/** 외화 금액 표기 — 소수 2자리 고정(설계서 000,000,000,000.00). */
const fmtAmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export interface OvsElcrtTxivListProps {
  /** 조회 대상 계약번호 — M71 목록 카드에서 주입. */
  ctrtNo: string
  /** 선택 계약 회차 — 상단 계약 정보 표기. */
  ctrtCycl: string
  /** 바텀시트 열림 여부 — 열릴 때만 조회(enabled). */
  open: boolean
  /** 카드 클릭 — 전자계산서상세(M74) 이동은 부모가 담당. */
  onItemClick: (item: OvsElcrtTxivItem) => void
}

export function OvsElcrtTxivList({ ctrtNo, ctrtCycl, open, onItemClick }: OvsElcrtTxivListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: items = [], isLoading } = wmQueries.useSelectOvsElcrtTxivList(ctrtNo, open)

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = items.slice(0, loaded)

  // 카드 매핑 — slide91: 뱃지(구분 billSe / 진행상태 prgrsSttsCd) + 계산서 발행번호 +
  // 행(계약금액/공급금액/발행일자).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.billSe}</Badge>
        <Badge>{it.prgrsSttsCd}</Badge>
      </>
    ),
    subtitle: `계산서 발행번호 ${it.bilPblcnNo}`,
    rows: [
      { label: '계약금액', value: fmtAmt(it.ctrtAmt) },
      { label: '공급금액', value: fmtAmt(it.splyEqvl) },
      { label: '발행일자', value: it.pblcnYmd },
    ],
    onClick: () => onItemClick(it),
  }))

  return (
    <div className="flex flex-col gap-krds-7">
      {/* 선택 계약 정보 + 건수(slide91 상단) — 계약명은 목록(M71) 데이터영역에 없어
          전자계산서 데이터영역(dl_billInfo.ctrtNm)에서 취한다. */}
      <div className="flex flex-col gap-krds-3">
        <p className="text-krds-body-sm text-krds-text-muted">
          계약번호 {ctrtNo} - {ctrtCycl}
        </p>
        <p className="text-[17px] font-bold leading-normal text-krds-text-ink">
          {items[0]?.ctrtNm ?? ''}
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
OvsElcrtTxivList.displayName = 'OvsElcrtTxivList'
