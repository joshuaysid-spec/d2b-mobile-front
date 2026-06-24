// 입찰결과상세 - '협상결과' 탭 (MUI-BD-09-M04, 설계서 02입찰 slide156).
// 협상결과 목록 — "내 업체 정보만 표시"(설계서). 항목당 표(차수/업체코드/업체명/대표자/견적단가/낙찰률/결과)
// + 더보기(10개씩). 데이터는 목업(추후 bdService.getBidRsltDetail).
import { useState } from 'react'

import { PageTitle } from '@/ui/common/base/PageTitle'
import { Button } from '@/ui/common/base/Button'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'

interface NegoResultRow {
  id: string
  cycle: string // 차수
  bizCode: string // 업체코드
  bizName: string // 업체명
  ceo: string // 대표자
  estPrice: string // 견적단가
  winRate: string // 낙찰률
  result: string // 결과
}

// 설계서 slide156 데이터영역 — 목업(자사 정보, 추후 API 매핑).
const NEGO_BASE: Omit<NegoResultRow, 'id' | 'cycle'> = {
  bizCode: '123',
  bizName: '테스트업체',
  ceo: '홍길동',
  estPrice: '9,800,000.00 원',
  winRate: '98.9796',
  result: '낙찰',
}
const TOTAL = 258
const MOCK_NEGOS: NegoResultRow[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...NEGO_BASE,
  id: String(i + 1),
  cycle: String(i + 1),
}))

const negoRows = (it: NegoResultRow): TableRow[] => [
  { label: '차수', value: it.cycle },
  { label: '업체코드', value: it.bizCode },
  { label: '업체명', value: it.bizName },
  { label: '대표자', value: it.ceo },
  { label: '견적단가', value: it.estPrice, type: 'number' },
  { label: '낙찰률', value: it.winRate, type: 'number' },
  { label: '결과', value: it.result },
]

const PAGE_SIZE = 10

export function BidRsltDtl2() {
  const [page, setPage] = useState(1)
  const total = MOCK_NEGOS.length
  const loaded = Math.min(page * PAGE_SIZE, total)
  const visible = MOCK_NEGOS.slice(0, loaded)

  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[BidRsltDtl] 협상결과 더보기') // 추후 API: bdService.getNegoRslt(page+1)
  }

  return (
    <>
      <PageTitle as="h2">협상결과</PageTitle>
      <Accordion key={loaded} type="multiple" defaultValue={visible.map((it) => it.id)} className="w-full">
        {visible.map((it, i) => (
          <AccordionSection
            key={it.id}
            value={it.id}
            title={`협상결과 (차수 ${it.cycle})`}
            borderTop={i > 0}
          >
            <Table rows={negoRows(it)} />
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
BidRsltDtl2.displayName = 'BidRsltDtl2'
