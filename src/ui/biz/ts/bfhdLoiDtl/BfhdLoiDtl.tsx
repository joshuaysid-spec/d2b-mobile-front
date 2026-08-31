// 사전의향서상세 - '상세내용' 탭 콘텐츠 (MUI-TS-01-T01). 설계서 06.업무지원 v0.82 slide13, 16.
// 아코디언 2개(집행계획 · 문의처) + Table — 데이터(detail)는 페이지가 조회해 주입.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockBfhdLoiDtl as LoiDtl } from '@/types/mock/ts'

export interface BfhdLoiDtlProps {
  detail: LoiDtl
}

export function BfhdLoiDtl({ detail }: BfhdLoiDtlProps) {
  // ── 집행계획 (slide16 1.2) ────────────────────────────────────────────────
  const planRows: TableRow[] = [
    { label: '제목', value: detail.bfhdLoiTtl },
    { label: '접수시작일', value: detail.rcptBgngYmd },
    { label: '접수종료일', value: detail.rcptEndYmd },
  ]

  // ── 문의처 (slide16 1.3) ──────────────────────────────────────────────────
  const cntcRows: TableRow[] = [
    { label: '부서명', value: detail.deptCd },
    { label: '담당자', value: detail.userNm },
    { label: '연락처', value: detail.telNum },
  ]

  return (
    <Accordion type="multiple" defaultValue={['plan', 'cntc']} className="w-full">
      <AccordionSection value="plan" title="집행계획" borderTop={false}>
        <Table rows={planRows} />
      </AccordionSection>
      <AccordionSection value="cntc" title="문의처">
        <Table rows={cntcRows} />
      </AccordionSection>
    </Accordion>
  )
}
BfhdLoiDtl.displayName = 'BfhdLoiDtl'
