// 입찰서(견적서) 작성 - 품목내역 (MUI-BD-06-M02, Figma 9973-63264 · 설계서 02입찰 slide122·129)
// 입찰서 작성 마법사의 '품목내역' 스텝 탭 콘텐츠. 요약/스텝/탭/하단 액션바는 컨테이너(TndrWrtPage) 소유 —
// 이 컴포넌트는 PageTitle + 섹션(품목 카드 반복) + 더보기만 렌더한다.
// 설계서 slide122: "입찰참가신청서작성 – 품목내역과 같은 구성임" → BidPrtcpAperWrtPage_Stp2 구성을 따름.
// 항목명/형식은 설계서 데이터영역(dlt_itemList, slide129) 그대로.
import { useState } from 'react'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Button } from '@/ui/common/base/Button'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { BidPrgrsItem } from '@/types/bd'

// 품목내역 (설계서 dlt_itemList 항목명 그대로) — BidPrtcpAperWrtPage_Stp2 의 ItemListRow 와 동일 모양.
interface ItemListRow {
  rNum: string // 번호 (조회 번호)
  clsfNo: string // 항목번호 (분류번호, 3자리)
  fscCdNtnItemIdntfNo: string // 재고번호 (군급분류코드+국가품목식별번호, 13자리)
  itemNm: string // 품명 (품목명)
  spcfctNo: string // 규격 (규격번호)
  unitNm: string // 단위 (단위명)
  drctnQty: string // 수량 (지시수량)
  drctnUntprc: string // 단가 (지시단가)
  drctnAmt: string // 금액 (지시금액)
}

// 서버 총건수(품목내역 목록 조회 결과 total) — 상단 총건수·더보기 분모. 추후 API 응답으로 대체.
const TOTAL_COUNT = 100
// 더보기 한 번에 추가로 노출할 건수(페이지 크기).
const PAGE_SIZE = 5

// ── 품목내역 목업 (설계서 dlt_itemList 값/형식 그대로) ─────────────────
const MOCK_ITEMS: ItemListRow[] = [
  {
    rNum: '1',
    clsfNo: '001',
    fscCdNtnItemIdntfNo: '1005-37-000-1234',
    itemNm: '특수작전용대물타격무인항공기 기체',
    spcfctNo: 'SPEC-UAV-001',
    unitNm: 'EA',
    drctnQty: '1',
    drctnUntprc: '619,520,000.00 원',
    drctnAmt: '619,520,000.00 원',
  },
  {
    rNum: '2',
    clsfNo: '002',
    fscCdNtnItemIdntfNo: '1005-37-000-1235',
    itemNm: '특수작전용대물타격무인항공기 지상통제장비',
    spcfctNo: 'SPEC-GCS-002',
    unitNm: 'SET',
    drctnQty: '2',
    drctnUntprc: '312,750,000.00 원',
    drctnAmt: '625,500,000.00 원',
  },
  {
    rNum: '3',
    clsfNo: '003',
    fscCdNtnItemIdntfNo: '1005-37-000-1236',
    itemNm: '특수작전용대물타격무인항공기 정비지원장비',
    spcfctNo: 'SPEC-MNT-003',
    unitNm: 'SET',
    drctnQty: '1',
    drctnUntprc: '184,300,000.00 원',
    drctnAmt: '184,300,000.00 원',
  },
  {
    rNum: '4',
    clsfNo: '004',
    fscCdNtnItemIdntfNo: '1005-37-000-1237',
    itemNm: '특수작전용대물타격무인항공기 대물타격탄',
    spcfctNo: 'SPEC-WHD-004',
    unitNm: 'EA',
    drctnQty: '12',
    drctnUntprc: '27,600,000.00 원',
    drctnAmt: '331,200,000.00 원',
  },
  {
    rNum: '5',
    clsfNo: '005',
    fscCdNtnItemIdntfNo: '1005-37-000-1238',
    itemNm: '특수작전용대물타격무인항공기 데이터링크세트',
    spcfctNo: 'SPEC-DLK-005',
    unitNm: 'SET',
    drctnQty: '2',
    drctnUntprc: '96,400,000.00 원',
    drctnAmt: '192,800,000.00 원',
  },
  {
    rNum: '6',
    clsfNo: '006',
    fscCdNtnItemIdntfNo: '1005-37-000-1239',
    itemNm: '특수작전용대물타격무인항공기 광학감시장비',
    spcfctNo: 'SPEC-EOS-006',
    unitNm: 'EA',
    drctnQty: '3',
    drctnUntprc: '58,900,000.00 원',
    drctnAmt: '176,700,000.00 원',
  },
  {
    rNum: '7',
    clsfNo: '007',
    fscCdNtnItemIdntfNo: '1005-37-000-1240',
    itemNm: '특수작전용대물타격무인항공기 발사대',
    spcfctNo: 'SPEC-LNC-007',
    unitNm: 'EA',
    drctnQty: '1',
    drctnUntprc: '143,200,000.00 원',
    drctnAmt: '143,200,000.00 원',
  },
  {
    rNum: '8',
    clsfNo: '008',
    fscCdNtnItemIdntfNo: '1005-37-000-1241',
    itemNm: '특수작전용대물타격무인항공기 예비추진체',
    spcfctNo: 'SPEC-PRP-008',
    unitNm: 'EA',
    drctnQty: '6',
    drctnUntprc: '18,450,000.00 원',
    drctnAmt: '110,700,000.00 원',
  },
  {
    rNum: '9',
    clsfNo: '009',
    fscCdNtnItemIdntfNo: '1005-37-000-1242',
    itemNm: '특수작전용대물타격무인항공기 지상운용 소프트웨어',
    spcfctNo: 'SPEC-SW-009',
    unitNm: 'EA',
    drctnQty: '1',
    drctnUntprc: '74,800,000.00 원',
    drctnAmt: '74,800,000.00 원',
  },
  {
    rNum: '10',
    clsfNo: '010',
    fscCdNtnItemIdntfNo: '1005-37-000-1243',
    itemNm: '특수작전용대물타격무인항공기 운용요원 교육훈련',
    spcfctNo: 'SPEC-EDU-010',
    unitNm: 'EA',
    drctnQty: '1',
    drctnUntprc: '42,300,000.00 원',
    drctnAmt: '42,300,000.00 원',
  },
]

function itemRows(item: ItemListRow): TableRow[] {
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

export function TndrWrt_Stp2({ detail }: { detail: BidPrgrsItem }) {
  // 더보기 페이징: 현재까지 노출한 건수. 목업이 소진되면(다음 항목 없음) 버튼 숨김(설계서 slide122).
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visibleItems = MOCK_ITEMS.slice(0, visibleCount)
  const hasMore = visibleCount < MOCK_ITEMS.length

  const handleLoadMore = () => {
    console.log('[M02] 품목내역 더보기', detail.pbancNo, visibleCount)
    // 추후 API: bdService.getBidTndrItemList(pbancNo, page) — 다음 페이지를 조회해 목록에 append
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, MOCK_ITEMS.length))
  }

  return (
    <>
      <PageTitle as="h2" className="px-4 pb-2 pt-4">
        품목내역
      </PageTitle>

      <SectionTitle as="h3" topDivider info={`총 ${TOTAL_COUNT}건`}>
        품목내역
      </SectionTitle>

      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {visibleItems.map((item) => (
          <Table key={item.rNum} rows={itemRows(item)} />
        ))}

        {/* 더보기 — 클릭 시 다음 페이지 로드(추후 API). 추가 항목 없으면 숨김. */}
        {hasMore && (
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({visibleItems.length}/{TOTAL_COUNT})
          </Button>
        )}
      </div>
    </>
  )
}
TndrWrt_Stp2.displayName = 'TndrWrt_Stp2'
