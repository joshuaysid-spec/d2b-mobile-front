// 입찰참가신청서작성 - 품목내역 (MUI-BD-04-M06, 설계서 slide99~).
// 신청서 마법사의 '품목내역' 스텝 탭 콘텐츠. 요약/스텝/탭/하단 액션바는 페이지(BidPrtcpAperWrtPage) 소유 —
// 이 컴포넌트는 PageTitle + 섹션(품목 카드 반복)만 렌더한다.
// 항목명/형식은 설계서 데이터영역(dlt_itemList) 그대로 — 품목 타입은 BidAbndAperWrt 의 ItemListRow 와 동일 모양 재사용.
import { PageTitle } from '@/ui/common/base/PageTitle'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Button } from '@/ui/common/base/Button'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { BidPrgrsItem } from '@/types/bd'

// 품목내역 (설계서 dlt_itemList 항목명 그대로) — BidAbndAperWrt 의 ItemListRow 와 동일 모양 재사용.
interface ItemListRow {
  rNum: string // 번호
  clsfNo: string // 항목번호
  fscCdNtnItemIdntfNo: string // 재고번호
  itemNm: string // 품명
  spcfctNo: string // 규격
  unitNm: string // 단위
  drctnQty: string // 수량
  drctnUntprc: string // 단가
  drctnAmt: string // 금액
}

// ── 품목내역 목업 (설계서 dlt_itemList 값/형식 그대로) ─────────────────
const MOCK_ITEMS: ItemListRow[] = [
  {
    rNum: '1',
    clsfNo: '000 000 000',
    fscCdNtnItemIdntfNo: '-',
    itemNm: '특수작전용대물타격무인항공기 구성품',
    spcfctNo: '00',
    unitNm: 'EA',
    drctnQty: '1',
    drctnUntprc: '619,520,000.00 원',
    drctnAmt: '619,520,000.00 원',
  },
  {
    rNum: '2',
    clsfNo: '000 000 000',
    fscCdNtnItemIdntfNo: '-',
    itemNm: '특수작전용대물타격무인항공기 지상통제장비',
    spcfctNo: '00',
    unitNm: 'EA',
    drctnQty: '1',
    drctnUntprc: '619,520,000.00 원',
    drctnAmt: '619,520,000.00 원',
  },
  {
    rNum: '3',
    clsfNo: '000 000 000',
    fscCdNtnItemIdntfNo: '-',
    itemNm: '특수작전용대물타격무인항공기 정비지원장비',
    spcfctNo: '00',
    unitNm: 'EA',
    drctnQty: '1',
    drctnUntprc: '619,520,000.00 원',
    drctnAmt: '619,520,000.00 원',
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

export function BidPrtcpAperWrtPage_Stp2({ detail }: { detail: BidPrgrsItem }) {
  return (
    <>
      <PageTitle as="h2" className="px-4 pb-2 pt-4">
        품목내역
      </PageTitle>

      <SectionTitle as="h3" topDivider info={`총 ${MOCK_ITEMS.length}건`}>
        품목내역
      </SectionTitle>

      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {MOCK_ITEMS.map((item) => (
          <Table key={item.rNum} rows={itemRows(item)} />
        ))}

        {/* 더보기 — 클릭 시 다음 페이지 로드(추후 API). */}
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => console.log('[M06] 품목내역 더보기', detail.pbancNo)}
          // 추후 API: bdService.getBidItemList(pbancNo, page)
        >
          더보기 (10/100)
        </Button>
      </div>
    </>
  )
}
BidPrtcpAperWrtPage_Stp2.displayName = 'BidPrtcpAperWrtPage_Stp2'
