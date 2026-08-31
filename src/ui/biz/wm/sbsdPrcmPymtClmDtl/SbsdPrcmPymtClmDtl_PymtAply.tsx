// 대금청구상세(부대조달) - '대금신청 금액' 탭 콘텐츠 (MUI-WM-01-T11). 설계서 slide49~50, 53.
// 지급구분(선금 등)·세액여부(과세/면세/영세)·신고구분(확정/예정)별 항목 표기(slide49 1-1~1-3).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockSbsdPrcmPymtClmDtl } from '@/types/mock/wm'

export interface SbsdPrcmPymtClmDtl_PymtAplyProps {
  detail: MockSbsdPrcmPymtClmDtl
}

export function SbsdPrcmPymtClmDtl_PymtAply({ detail }: SbsdPrcmPymtClmDtl_PymtAplyProps) {
  const won = (n: number) => `${n.toLocaleString()} 원`

  // ── 대금신청금액 (dmt_pymtAplyAmtInfo, slide53 1.4 순서) ──────────────────
  const pymtRows: TableRow[] = [
    { label: '지급구분', value: detail.giveSecd },
    { label: '세액여부', value: detail.vatSecd },
    { label: '납품(선급)금액', value: won(detail.dlvgdsAmt), type: 'number' },
    { label: '공급가액', value: won(detail.splyEqvl), type: 'number' },
    { label: '세액', value: won(detail.vatAmt), type: 'number' },
    { label: '공제금액', value: won(detail.ddcAmt), type: 'number' },
    { label: '공급가액', value: won(detail.ddcSplyEqvl), type: 'number' },
    { label: '세액', value: won(detail.txamtDdcAmt), type: 'number' },
    { label: '공제내역', value: detail.ddcDsctnNm || '-' },
    { label: '실지급금액', value: won(detail.giveClmAmt), type: 'number' },
    { label: '신고구분', value: detail.cfmtnYn },
    { label: '비고', value: detail.birqRmrkCn || '-' },
  ]

  return (
    <Accordion type="multiple" defaultValue={['pymt']} className="w-full">
      <AccordionSection value="pymt" title="대금신청 금액" borderTop={false}>
        <Table rows={pymtRows} />
      </AccordionSection>
    </Accordion>
  )
}
SbsdPrcmPymtClmDtl_PymtAply.displayName = 'SbsdPrcmPymtClmDtl_PymtAply'
