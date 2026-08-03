// 대금청구상세(부대조달) - '대금신청업체 정보' 탭 콘텐츠 (MUI-WM-01-T10). 설계서 slide48, 52.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { SbsdPrcmPymtClmDtl } from '@/types/wm'

export interface SbsdPrcmPymtClmDtl_PymtBzentyProps {
  detail: SbsdPrcmPymtClmDtl
}

export function SbsdPrcmPymtClmDtl_PymtBzenty({ detail }: SbsdPrcmPymtClmDtl_PymtBzentyProps) {
  // ── 대금신청업체정보 (dmt_pymtAplyBzentyInfo, slide52 1.3) ────────────────
  const bzentyRows: TableRow[] = [
    { label: '상호(업체명)', value: detail.bzentyNm },
    { label: '대표명', value: detail.rprsvNm },
    { label: '청구인성명', value: detail.clmtNm },
    { label: '연락처', value: detail.clmtTelno },
    { label: '주소', value: detail.bzentyAddr },
  ]

  return (
    <Accordion type="multiple" defaultValue={['bzenty']} className="w-full">
      <AccordionSection value="bzenty" title="대금신청업체 정보" borderTop={false}>
        <Table rows={bzentyRows} />
      </AccordionSection>
    </Accordion>
  )
}
SbsdPrcmPymtClmDtl_PymtBzenty.displayName = 'SbsdPrcmPymtClmDtl_PymtBzenty'
