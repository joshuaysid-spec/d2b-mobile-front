// 사후정산청구상세 - '계약정보' 탭 콘텐츠 (MUI-WM-01-T20). 설계서 05.대금청구및사후 v0.83 slide73, 77~78.
// 아코디언 2개(계약정보 · 공급자 정보).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockEpfcClclnClmDtl } from '@/types/mock/wm'

export interface EpfcClclnClmDtl_CNProps {
  detail: MockEpfcClclnClmDtl
}

export function EpfcClclnClmDtl_CN({ detail }: EpfcClclnClmDtl_CNProps) {
  // ── 계약정보 (dmt_ctrtCnInfo, slide77 1.2) ────────────────────────────────
  const ctrtRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} - ${detail.ctrtCycl}` },
    { label: '계약명', value: detail.ctrtNm },
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '계약금액', value: `${detail.ctrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '납기', value: detail.dudtPrdCn },
    { label: '비고', value: detail.rmrkCn || '-' },
  ]

  // ── 공급자 정보 (slide73 화면 — 상호/작성자 성명/직책/연락처/주소) ─────────
  const splrRows: TableRow[] = [
    { label: '상호(업체명)', value: detail.bzentyNm },
    { label: '작성자 성명', value: detail.wrtrNm },
    { label: '직책', value: detail.wrtrJbttlNm },
    { label: '연락처', value: detail.wrtrEnmtno },
    { label: '주소', value: detail.bzentyAddr },
  ]

  return (
    <Accordion type="multiple" defaultValue={['ctrt', 'splr']} className="w-full">
      <AccordionSection value="ctrt" title="계약정보" borderTop={false}>
        <Table rows={ctrtRows} />
      </AccordionSection>
      <AccordionSection value="splr" title="공급자 정보">
        <Table rows={splrRows} />
      </AccordionSection>
    </Accordion>
  )
}
EpfcClclnClmDtl_CN.displayName = 'EpfcClclnClmDtl_CN'
