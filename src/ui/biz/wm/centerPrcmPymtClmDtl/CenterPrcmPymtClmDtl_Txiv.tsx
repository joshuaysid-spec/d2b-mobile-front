// 대금청구 상세(중앙조달) - '세금계산서' 탭 콘텐츠 (MUI-WM-01-T08). 설계서 05.대금청구및사후 v0.83 slide42, 44.
// 세금계산서번호 + 품목 정보(dlt_txBllList) Table 반복.
// 세금계산서 선택(txivChcYn='Y')인 경우에만 내용 노출(slide38 탭 영역) — 미선택이면 안내 문구.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCenterPrcmPymtClmDtl, MockTxBllItem } from '@/types/mock/wm'

export interface CenterPrcmPymtClmDtl_TxivProps {
  detail: MockCenterPrcmPymtClmDtl
}

// 품목 1건 → 표 행 (slide42 목업 순서).
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

export function CenterPrcmPymtClmDtl_Txiv({ detail }: CenterPrcmPymtClmDtl_TxivProps) {
  // 세금계산서 미선택 — 내용 없음 안내(선택한 경우에만 노출, slide38).
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
CenterPrcmPymtClmDtl_Txiv.displayName = 'CenterPrcmPymtClmDtl_Txiv'
