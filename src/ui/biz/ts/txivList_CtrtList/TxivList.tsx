// 세금계산서목록 — MUI-TS-04-P02 TxivList. 설계서 06.업무지원 v0.82 slide23, 26.
// 세금계산서계약목록(M01)에서 계약 카드 클릭 → 해당 계약의 세금계산서 목록 바텀시트.
// 바텀시트 콘텐츠 전용 — BottomSheet 컨테이너(title/footer)는 부모(M01 페이지)가 소유.
// 뱃지 3종(구분/진행상태/수정사유 — 수정사유 없으면 미노출), 세부 선택 시 상세(M03) 이동은 부모 콜백.
import { useState } from 'react'

import { tsQueries } from '@/queries/bds/ts/tsQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import type { TxivItem } from '@/types/ts'

export interface TxivListProps {
  /** 조회 대상 계약번호 — M01 목록 카드에서 주입. */
  ctrtNo: string
  /** 선택 계약건명 — 상단 계약 정보 표기(slide23 1]). */
  rpstItnm: string
  /** 바텀시트 열림 여부 — 열릴 때만 조회(enabled). */
  open: boolean
  /** 세금계산서 카드 클릭 — 상세(M03) 이동은 부모가 담당. */
  onItemClick: (item: TxivItem) => void
}

export function TxivList({ ctrtNo, rpstItnm, open, onItemClick }: TxivListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: items = [], isLoading } = tsQueries.useSelectTxivList(ctrtNo, open)

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = items.slice(0, loaded)

  // 카드 매핑 — slide23 목업: 뱃지(구분/진행상태/수정사유) + 계산서 발행번호 +
  // 행(계약금액/공급가액/발행일자/계약담당자).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.reqDivsNm}</Badge>
        <Badge>{it.txivPrgrsStcd}</Badge>
        {it.txivMdfcnRncd && <Badge>{it.txivMdfcnRncd}</Badge>}
      </>
    ),
    title: `계산서 발행번호 ${it.pblcnNo}`,
    rows: [
      { label: '계약금액', value: `${it.contAmnt.toLocaleString()} 원` },
      { label: '공급가액', value: `${it.splyEqvl.toLocaleString()} 원` },
      { label: '발행일자', value: it.bllPblcnYmd },
      { label: '계약담당자', value: it.userNm },
    ],
    onClick: () => onItemClick(it),
  }))

  return (
    <div className="flex flex-col gap-krds-7">
      {/* 선택 계약 정보 + 건수(slide23 상단) */}
      <div className="flex flex-col gap-krds-3">
        <p className="text-krds-body-sm text-krds-text-muted">계약번호 {ctrtNo}</p>
        <p className="text-[17px] font-bold leading-normal text-krds-text-ink">{rpstItnm}</p>
        <p className="text-krds-body-sm text-krds-text-primary-active">총 {total}건</p>
      </div>

      <CardList items={cardItems} loading={isLoading} />

      {/* 더보기 */}
      {loaded < total && (
        <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
          더보기 ({loaded}/{total}건)
        </Button>
      )}
    </div>
  )
}
TxivList.displayName = 'TxivList'
