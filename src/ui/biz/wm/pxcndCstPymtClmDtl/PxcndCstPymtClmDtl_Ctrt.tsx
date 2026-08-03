// 대금청구상세(기성대가) - '계약정보' 탭 콘텐츠 (MUI-WM-01-T16). 설계서 05.대금청구및사후 v0.83 slide62, 67.
// 아코디언 2개(계약정보 · 대금신청 업체정보).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { PxcndCstPymtClmDtl } from '@/types/wm'

export interface PxcndCstPymtClmDtl_CtrtProps {
  detail: PxcndCstPymtClmDtl
}

export function PxcndCstPymtClmDtl_Ctrt({ detail }: PxcndCstPymtClmDtl_CtrtProps) {
  // ── 계약정보 (dmt_ctrtInfo, slide67 1.1) ──────────────────────────────────
  const ctrtRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} - ${detail.ctrtCycl}` },
    { label: '계약명', value: detail.ctrtNm },
  ]

  // ── 대금신청 업체정보 (dmt_pymtAplyBzentyInfo, slide67 1.2) ───────────────
  const bzentyRows: TableRow[] = [
    { label: '상호(업체명)', value: detail.bzentyNm },
    { label: '대표명', value: detail.rprsvNm },
    { label: '청구인성명', value: detail.clmtNm },
    { label: '연락처', value: detail.clmtTelno },
  ]

  return (
    <Accordion type="multiple" defaultValue={['ctrt', 'bzenty']} className="w-full">
      <AccordionSection value="ctrt" title="계약정보" borderTop={false}>
        <Table rows={ctrtRows} />
      </AccordionSection>
      <AccordionSection value="bzenty" title="대금신청 업체정보">
        <Table rows={bzentyRows} />
      </AccordionSection>
    </Accordion>
  )
}
PxcndCstPymtClmDtl_Ctrt.displayName = 'PxcndCstPymtClmDtl_Ctrt'
