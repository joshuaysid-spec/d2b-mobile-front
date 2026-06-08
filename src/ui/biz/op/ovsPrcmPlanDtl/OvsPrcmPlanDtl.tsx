// 국외 조달계획 상세 - '집행계획상세' 탭 콘텐츠 (MUI-OP-01-M73, ovsPrcmPlanDtl).
// 국내 상세내용(M03)과 일부 중복되나 군수/해외조달(USD·재고번호·부품번호 등) 기준.
// 데이터는 목업 — 추후 API(opService.getOverseasPlanDetail)로 대체.
import { PageTitle } from '@/ui/common/base/PageTitle'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// ── 집행계획 (목업 — 국외/연간조달 항목 기준) ───────────────────────────────
const EXEC_ROWS: TableRow[] = [
  { label: '지시년도', value: '2026' },
  { label: '군구분', value: '육군' },
  { label: '조달요구번호', value: 'A-2026-0001' },
  { label: '재고번호', value: '152302089999' },
  { label: '부품번호', value: '502323-12542-032' },
  { label: '품명', value: 'NIGHT VISION GOGGLE' },
  { label: '수량', value: '120', type: 'number' },
  { label: '지시단가(USD)', value: '$ 4,500.00', type: 'number' },
  { label: '지시예산(USD)', value: '$ 540,000.00', type: 'number' },
]

// ── 판단내역 (목업) ────────────────────────────────────────────────────────
const DECISION_ROWS: TableRow[] = [
  { label: '계약방법', value: '일반경쟁' },
  { label: '품질등급', value: 'A' },
  { label: '생산자부호', value: '00001' },
  { label: '규격번호', value: 'MIL-PRF-49425' },
  { label: '장비명', value: 'AN/PVS-7' },
]

// ── 문의처 (목업) ──────────────────────────────────────────────────────────
const CONTACT_ROWS: TableRow[] = [
  { label: '기관', value: '방위사업청' },
  { label: '담당자', value: '홍길동 주무관' },
  { label: '연락처', value: '02-1234-5678' },
]

export function OvsPrcmPlanDtl() {
  return (
    <>
      <PageTitle as="h2">집행계획상세</PageTitle>
      <Accordion type="multiple" defaultValue={['exec', 'decision', 'contact']} className="w-full">
        <AccordionSection value="exec" title="집행계획" borderTop={false}>
          <Table rows={EXEC_ROWS} />
        </AccordionSection>
        <AccordionSection value="decision" title="판단내역">
          <Table rows={DECISION_ROWS} />
        </AccordionSection>
        <AccordionSection value="contact" title="문의처">
          <Table rows={CONTACT_ROWS} />
        </AccordionSection>
      </Accordion>
    </>
  )
}
OvsPrcmPlanDtl.displayName = 'OvsPrcmPlanDtl'
