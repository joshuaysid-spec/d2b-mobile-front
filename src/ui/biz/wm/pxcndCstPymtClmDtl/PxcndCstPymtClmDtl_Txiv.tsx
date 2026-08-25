// 대금청구상세(기성대가) - '세금계산서' 탭 콘텐츠 (MUI-WM-01-T18). 설계서 slide65, 68 — M05 T08 과 동일 구성.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockPxcndCstPymtClmDtl, MockTxBllItem } from '@/types/mock/wm'

export interface PxcndCstPymtClmDtl_TxivProps {
  detail: MockPxcndCstPymtClmDtl
}

// 품목 1건 → 표 행 (dlt_txivList, slide68 1.5 순서).
function bllRows(it: MockTxBllItem): TableRow[] {
  return [
    { label: '월일', value: it.bllPblcnYmd },
    { label: '품목', value: it.itemNm || '-' },
    { label: '수량', value: it.dlvgdsQty.toLocaleString(), type: 'number' },
    { label: '단가', value: `${it.ctrtUntprc.toLocaleString()} 원`, type: 'number' },
    { label: '공급가액', value: `${it.splyEqvl.toLocaleString()} 원`, type: 'number' },
    { label: '세액', value: `${it.txamt.toLocaleString()} 원`, type: 'number' },
  ]
}

export function PxcndCstPymtClmDtl_Txiv({ detail }: PxcndCstPymtClmDtl_TxivProps) {
  if (detail.txivChcYn !== 'Y') {
    return (
      <p className="px-4 py-10 text-center text-krds-body-md text-krds-text-subtle">
        세금계산서 내역이 없습니다.
      </p>
    )
  }

  return (
    <Accordion type="multiple" defaultValue={['txiv', 'item']} className="w-full">
      <AccordionSection value="txiv" title="세금계산서" borderTop={false}>
        <Table rows={[{ label: '세금계산서번호', value: detail.txivNo }]} />
      </AccordionSection>
      <AccordionSection value="item" title="품목 정보">
        <div className="flex flex-col gap-krds-7">
          {detail.txBlls.map((it) => (
            <Table key={it.id} rows={bllRows(it)} />
          ))}
        </div>
      </AccordionSection>
    </Accordion>
  )
}
PxcndCstPymtClmDtl_Txiv.displayName = 'PxcndCstPymtClmDtl_Txiv'
