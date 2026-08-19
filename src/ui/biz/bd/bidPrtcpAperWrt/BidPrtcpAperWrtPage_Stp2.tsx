// 입찰참가신청서작성 - 품목내역 (MUI-BD-04-M06, 설계서 slide99~).
// 신청서 마법사의 '품목내역' 스텝 탭 콘텐츠. 요약/스텝/탭/하단 액션바는 페이지(BidPrtcpAperWrtPage) 소유 —
// 이 컴포넌트는 섹션(품목 카드 반복) + 더보기만 렌더한다(탭명 반복 타이틀 없음).
// 품목 목록은 bdQueries.useSelectItemList(bdService.selectItemList) 가 공급 — 목업은 mocks/bd.ts(구 인라인 이관).
import { useState } from 'react'

import { bdQueries } from '@/queries/bds/bd/bdQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Button } from '@/ui/common/base/Button'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { BidItemListRow, BidPrgrsItem } from '@/types/bd'

// 더보기 한 번에 추가로 노출할 건수(페이지 크기).
const PAGE_SIZE = 5

function itemRows(item: BidItemListRow): TableRow[] {
  return [
    { label: '항목번호', value: item.clsfNo },
    { label: '재고번호', value: item.fscCdNtnItemIdntfNo },
    { label: '품명', value: item.itemNm },
    { label: '규격', value: item.spcfctNo },
    { label: '단위', value: item.unitNm },
    { label: '수량', value: item.drctnQty, type: 'number' },
    { label: '단가', value: item.drctnUntprc, type: 'number' },
    { label: '금액', value: item.drctnAmt, type: 'number' },
  ]
}

export function BidPrtcpAperWrtPage_Stp2({ detail }: { detail: BidPrgrsItem }) {
  // 품목 목록 조회 — 목업/실연동은 bdService.selectItemList 의 USE_MOCK 분기가 전환.
  const { data } = bdQueries.useSelectItemList(detail.pbancNo)
  const items = data ?? []
  // 더보기 페이징(클라이언트) — 서버 페이징 전환 시 page 파라미터로 이행.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visibleItems = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  return (
    <>
      <SectionTitle as="h3" topDivider info={`총 ${items.length}건`} className="bg-white">
        품목내역
      </SectionTitle>

      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {visibleItems.map((item) => (
          <Table key={item.rNum} rows={itemRows(item)} />
        ))}

        {/* 더보기 — 추가 항목 없으면 숨김. */}
        {hasMore && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, items.length))}
          >
            더보기 ({visibleItems.length}/{items.length})
          </Button>
        )}
      </div>
    </>
  )
}
BidPrtcpAperWrtPage_Stp2.displayName = 'BidPrtcpAperWrtPage_Stp2'
