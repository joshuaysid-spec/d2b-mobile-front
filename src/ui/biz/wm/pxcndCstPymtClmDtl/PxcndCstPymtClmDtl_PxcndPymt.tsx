// 대금청구상세(기성대가) - '기성대가 신청금액' 탭 콘텐츠 (MUI-WM-01-T17). 설계서 slide63~64, 67.
// 지급구분·세액여부(과세/면세/영세)·신고구분(확정/예정)별 항목 표기(slide63 1-1~1-3).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { PxcndCstPymtClmDtl } from '@/types/mock/wm'

export interface PxcndCstPymtClmDtl_PxcndPymtProps {
  detail: PxcndCstPymtClmDtl
}

export function PxcndCstPymtClmDtl_PxcndPymt({ detail }: PxcndCstPymtClmDtl_PxcndPymtProps) {
  const won = (n: number) => `${n.toLocaleString()} 원`

  // ── 기성대가 신청 금액 (dmt_PxcndCstAplyAmtInfo, slide67 1.3 순서) ────────
  const pymtRows: TableRow[] = [
    { label: '지급구분', value: detail.giveSecd },
    { label: '세액여부', value: detail.vatSecd },
    { label: '기성금액', value: won(detail.dlvgdsAmt), type: 'number' },
    { label: '공급가액', value: won(detail.dlvgdsSplyEqvl), type: 'number' },
    { label: '세액', value: won(detail.dlvgdsTxamt), type: 'number' },
    { label: '공제금액', value: won(detail.ddcAmt), type: 'number' },
    { label: '공급가액', value: won(detail.ddcSplyEqvl), type: 'number' },
    { label: '세액', value: won(detail.ddcTxamt), type: 'number' },
    { label: '공제내역', value: detail.ddcDsctnNm || '-' },
    { label: '실지급금액', value: won(detail.giveClmAmt), type: 'number' },
    { label: '신고구분', value: detail.cfmtnYn },
    { label: '선급금', value: won(detail.prpamt), type: 'number' },
    { label: '총기성율', value: `${detail.tpxcndRt} %`, type: 'number' },
    { label: '총기성금', value: won(detail.tpxcndAmt), type: 'number' },
    { label: '선금정산액', value: won(detail.prpayClclnAmt), type: 'number' },
    { label: '금회정산액', value: won(detail.tstmClclnAmt), type: 'number' },
    { label: '비고', value: detail.birqRmrkCn || '-' },
  ]

  return (
    <Accordion type="multiple" defaultValue={['pymt']} className="w-full">
      <AccordionSection value="pymt" title="기성대가 신청 금액" borderTop={false}>
        <Table rows={pymtRows} />
      </AccordionSection>
    </Accordion>
  )
}
PxcndCstPymtClmDtl_PxcndPymt.displayName = 'PxcndCstPymtClmDtl_PxcndPymt'
