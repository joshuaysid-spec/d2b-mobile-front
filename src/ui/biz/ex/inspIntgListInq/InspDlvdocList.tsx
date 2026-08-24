// 검사및납품조서목록 — MUI-EX-01-P11 InspDlvdocList. 설계서 04.이행 v0.83 slide14~16.
// P10 납품통지목록에서 통지 카드 클릭 → 해당 통지의 검사및납품조서 목록 바텀시트.
// 바텀시트 콘텐츠 전용 — BottomSheet 컨테이너(title=선택 계약명, footer)는 부모(P10 풀팝업)가 소유.
// 카드 클릭 시 중앙조달(M02)/부대조달(M03) 상세 분기(sbsdPrcmYn, 임시 키)는 부모 콜백으로 위임.
import { useState } from 'react'

import { exQueries } from '@/queries/cts/ex/exQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import type { InspDlvdocItem } from '@/types/ex'

export interface InspDlvdocListProps {
  /** 조회 대상 계약번호 — P10 에서 주입. */
  ctrtNo: string
  /** 조회 대상 통지번호 — P10 목록에서 선택한 통지. */
  avtsmtNo: string
  /** 바텀시트 열림 여부 — 열릴 때만 조회(enabled). */
  open: boolean
  /** 조서 카드 클릭 — 중앙/부대 상세 분기는 부모가 담당(slide16 이벤트). */
  onItemClick: (item: InspDlvdocItem) => void
}

export function InspDlvdocList({ ctrtNo, avtsmtNo, open, onItemClick }: InspDlvdocListProps) {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const { data: items = [], isLoading } = exQueries.useSelectInspDlvdocList(ctrtNo, avtsmtNo, open)

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = items.slice(0, loaded)

  // 카드 매핑 — slide14 목업: 뱃지(업무구분/예산구분/부대/진행상태) + 계약차수 +
  // title(조서발행번호) + 행(납품금액/작성수량/납지명/지체일수/지체상금).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSecd}</Badge>
        <Badge>{it.bgtSecdNm}</Badge>
        {it.sbsdPrcmYn === 'Y' && <Badge>부대</Badge>}
        <Badge>{it.dlvdocPrgrsStcd}</Badge>
      </>
    ),
    subtitle: `계약차수 ${it.ctrtCycl}`,
    title: `조서발행번호 ${it.recrdPblcnNo}`,
    rows: [
      { label: '납품금액', value: `${it.dlvgdsAmt.toLocaleString()} 원` },
      { label: '작성수량', value: it.wrtQty.toLocaleString() },
      { label: '납지명', value: it.plcdlvNm },
      { label: '지체일수', value: it.arrsDayCnt.toLocaleString() },
      { label: '지체상금', value: `${it.lqdmg.toLocaleString()} 원` },
    ],
    onClick: () => onItemClick(it),
  }))

  return (
    <div className="flex flex-col gap-krds-7">
      {/* 건수·표시개수(slide14 2]) */}
      <ListSectionHeader
        total={total}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      <CardList items={cardItems} loading={isLoading} />

      {/* 더보기 — 표시개수만큼 추가 로드. 모두 노출됐으면 숨김. */}
      {loaded < total && (
        <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
          더보기 ({loaded}/{total}건)
        </Button>
      )}
    </div>
  )
}
InspDlvdocList.displayName = 'InspDlvdocList'
