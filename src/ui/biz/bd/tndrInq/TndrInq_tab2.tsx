// 입찰진행상세 - 입찰서(견적서)조회 품목내역 (MUI-BD-06-T02, 설계서 영문ID TndrInq_tab2 · 02입찰 v1.88 slide173).
// 호스트 페이지(TndrInqPage)의 '2. 품목내역' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 설계서 slide173: "입찰서작성중 품목내역(MUI-BD-06-M02) 화면 내용" — 작성판도 조회 표라 구성이 동일하다.
// 품목 목록은 bdQueries.useSelectTndrItemList(bdService.selectTndrItemList) 가 공급 — 목업은 mocks/bd.ts.
import { useState } from 'react'

import { bdQueries } from '@/queries/bds/bd/bdQueries'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockBidItemListRow, MockBidPrgrsItem } from '@/types/mock/bd'

// 서버 총건수(품목내역 목록 조회 결과 total) — 상단 총건수·더보기 분모(설계서 slide173 '더보기 (10/100)').
const TOTAL_COUNT = 100
// 더보기 한 번에 추가로 노출할 건수(페이지 크기).
const PAGE_SIZE = 5

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

export function TndrInq_tab2({ detail }: { detail: MockBidPrgrsItem }) {
  const { data } = bdQueries.useSelectTndrItemList(detail.pbancNo)
  const items = data ?? []
  // 더보기 페이징(클라이언트) — 목업 소진 시 버튼 숨김. 서버 페이징 전환 시 page 파라미터로 이행.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visibleItems = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  return (
    <>
      <SectionTitle as="h3" topDivider info={`총 ${TOTAL_COUNT}건`} className="bg-white">
        품목내역
      </SectionTitle>

      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {visibleItems.map((item) => (
          <Table key={item.rNum} rows={itemRows(item)} />
        ))}

        {hasMore && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, items.length))}
          >
            더보기 ({visibleItems.length}/{TOTAL_COUNT})
          </Button>
        )}
      </div>
    </>
  )
}
TndrInq_tab2.displayName = 'TndrInq_tab2'
