// 입찰결과상세 - '품목정보' 탭 (MUI-BD-09-M02, 설계서 02입찰 slide154).
// 품목 목록(항목번호/재고번호/품명/규격/단위/수량/단가/금액) — 항목당 표 + 더보기(10개씩).
// 데이터는 목업(추후 bdService.getBidRsltDetail). 표/필드는 설계서 기준.
import { useState } from 'react'

import { PageTitle } from '@/ui/common/base/PageTitle'
import { Button } from '@/ui/common/base/Button'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'

interface ProductItem {
  id: string
  itemNo: string // 항목번호
  stockNo: string // 재고번호
  name: string // 품명
  spec: string // 규격
  unit: string // 단위
  qty: string // 수량
  unitPrice: string // 단가
  amount: string // 금액
}

// 설계서 slide154 데이터영역 — 목업(추후 API 매핑).
const PRODUCT_BASE: Omit<ProductItem, 'id' | 'itemNo'> = {
  stockNo: '123-123123',
  name: '테스트품명',
  spec: '111-1111',
  unit: 'EA',
  qty: '10',
  unitPrice: '9,800,000.00 원',
  amount: '9,800,000.00 원',
}
const TOTAL = 258
const MOCK_PRODUCTS: ProductItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...PRODUCT_BASE,
  id: String(i + 1),
  itemNo: String(i + 1).padStart(3, '0'),
}))

const productRows = (it: ProductItem): TableRow[] => [
  { label: '항목번호', value: it.itemNo },
  { label: '재고번호', value: it.stockNo },
  { label: '품명', value: it.name },
  { label: '규격', value: it.spec },
  { label: '단위', value: it.unit },
  { label: '수량', value: it.qty, type: 'number' },
  { label: '단가', value: it.unitPrice, type: 'number' },
  { label: '금액', value: it.amount, type: 'number' },
]

const PAGE_SIZE = 10

export function BidRsltDtlListPage() {
  const [page, setPage] = useState(1)
  const total = MOCK_PRODUCTS.length
  const loaded = Math.min(page * PAGE_SIZE, total)
  const visible = MOCK_PRODUCTS.slice(0, loaded)

  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[BidRsltDtl] 품목정보 더보기') // 추후 API: bdService.getBidRsltItems(page+1)
  }

  return (
    <>
      <PageTitle as="h2">품목정보</PageTitle>
      {/* key={loaded} — 더보기로 추가 로드 시 새 항목도 펼쳐진 상태로 재적용(Accordion defaultValue 는 mount 시 1회) */}
      <Accordion key={loaded} type="multiple" defaultValue={visible.map((it) => it.id)} className="w-full">
        {visible.map((it, i) => (
          <AccordionSection
            key={it.id}
            value={it.id}
            title={`품목정보 (항목번호 ${it.itemNo})`}
            borderTop={i > 0}
          >
            <Table rows={productRows(it)} />
          </AccordionSection>
        ))}
      </Accordion>
      {loaded < total && (
        <div className="px-4 pb-4 pt-krds-7">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}
    </>
  )
}
BidRsltDtlListPage.displayName = 'BidRsltDtlListPage'
