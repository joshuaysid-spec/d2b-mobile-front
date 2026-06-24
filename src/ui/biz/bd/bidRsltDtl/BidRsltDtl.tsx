// 입찰결과상세 - '입찰결과' 탭 (MUI-BD-09-M03, 설계서 02입찰 slide155).
// 입찰결과 목록 — "내 업체 정보만 표시"(설계서). 항목당 표(순번/차수/업체코드/사업자등록번호/업체명/대표자/
// 결과 + 첨부서류[보기]·서약서[보기]) + 더보기(10개씩). 데이터는 목업(추후 bdService.getBidRsltDetail).
import { useState } from 'react'

import { PageTitle } from '@/ui/common/base/PageTitle'
import { Button } from '@/ui/common/base/Button'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'

interface BidResultRow {
  id: string
  seq: string // 순번
  cycle: string // 차수
  bizCode: string // 업체코드
  bizRegNo: string // 사업자등록번호
  bizName: string // 업체명
  ceo: string // 대표자
  result: string // 결과
}

// 설계서 slide155 데이터영역 — 목업(자사 정보, 추후 API 매핑).
const RESULT_BASE: Omit<BidResultRow, 'id' | 'seq'> = {
  cycle: '01',
  bizCode: '123',
  bizRegNo: '111-11-11111',
  bizName: '테스트',
  ceo: '홍길동',
  result: '1순위',
}
const TOTAL = 258
const MOCK_RESULTS: BidResultRow[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...RESULT_BASE,
  id: String(i + 1),
  seq: String(i + 1),
}))

// 첨부서류·서약서 — '보기' 버튼(스텁). 추후 파일 뷰어/다운로드 연계.
const viewCell = (label: string, onClick: () => void) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-krds-text-subtle">{label}</span>
    <Button size="sm" variant="inner" onClick={onClick}>
      보기
    </Button>
  </div>
)

const resultRows = (it: BidResultRow): TableRow[] => [
  { label: '순번', value: it.seq, type: 'number' },
  { label: '차수', value: it.cycle },
  { label: '업체코드', value: it.bizCode },
  { label: '사업자등록번호', value: it.bizRegNo },
  { label: '업체명', value: it.bizName },
  { label: '대표자', value: it.ceo },
  { label: '결과', value: it.result },
  {
    label: '첨부서류',
    value: viewCell('첨부서류', () => console.log('[BidRsltDtl] 입찰결과 첨부서류 보기', it.id)),
    type: 'combination',
  },
  {
    label: '서약서',
    value: viewCell('서약서', () => console.log('[BidRsltDtl] 입찰결과 서약서 보기', it.id)),
    type: 'combination',
  },
]

const PAGE_SIZE = 10

export function BidRsltDtl() {
  const [page, setPage] = useState(1)
  const total = MOCK_RESULTS.length
  const loaded = Math.min(page * PAGE_SIZE, total)
  const visible = MOCK_RESULTS.slice(0, loaded)

  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[BidRsltDtl] 입찰결과 더보기') // 추후 API: bdService.getBidRslt(page+1)
  }

  return (
    <>
      <PageTitle as="h2">입찰결과</PageTitle>
      <Accordion key={loaded} type="multiple" defaultValue={visible.map((it) => it.id)} className="w-full">
        {visible.map((it, i) => (
          <AccordionSection
            key={it.id}
            value={it.id}
            title={`입찰결과 (순번 ${it.seq})`}
            borderTop={i > 0}
          >
            <Table rows={resultRows(it)} />
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
BidRsltDtl.displayName = 'BidRsltDtl'
