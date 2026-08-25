// 입찰진행상세 - 입찰참가신청조회 품목내역 (MUI-BD-04-T02, 설계서 영문ID BidPrtcpAperDtl_Tab2 · slide184).
// 호스트 페이지(BidPrtcpAperDtlPage)의 '2. 품목내역' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 설계서 처리조건: 총 건수 표시 · 최초 10개 로드 · 더보기로 10건씩 추가 · 추가 항목 없으면 더보기 숨김.
// 품목 목록은 bdQueries.useSelectItemList(bdService.selectItemList) 가 공급 — 작성판(M06)과 같은 조회 훅.
import { useState } from 'react'

import { bdQueries } from '@/queries/bds/bd/bdQueries'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockBidItemListRow, MockBidPrgrsItem } from '@/types/mock/bd'

// 최초 로드/더보기 1회 건수(설계서 slide184).
const PAGE_SIZE = 10

function itemRows(item: MockBidItemListRow): TableRow[] {
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

export function BidPrtcpAperDtl_Tab2({ detail }: { detail: MockBidPrgrsItem }) {
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
BidPrtcpAperDtl_Tab2.displayName = 'BidPrtcpAperDtl_Tab2'
