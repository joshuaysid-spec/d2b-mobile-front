// 검사및납품조서상세(중앙조달) - '물품목록' 탭 콘텐츠 (MUI-EX-01-T02). 설계서 04.이행 v0.83 slide19~20.
// "물품 목록 - 총 N건" 헤더 + 물품 1건 = Table 반복(조달요구번호/재고번호/품명/단위/계약수량/
// 기 작성수량/금번 납품수량 — dlt_CmdtyList 순서 그대로). 데이터는 exQueries.useSelectInspDlvdocCmdtys 조회.
import { exQueries } from '@/queries/bds/ex/exQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { InspDlvdocCmdtyItem } from '@/types/ex'

export interface InspDlvdocDtl_CmdtyListProps {
  /** 조회 대상 조서 식별자 — 페이지(navigate state id)가 주입. */
  id: string
}

// 물품 1건 → 표 행 (dlt_CmdtyList, slide20 1.2 순서).
function cmdtyRows(it: InspDlvdocCmdtyItem): TableRow[] {
  return [
    { label: '조달요구번호', value: it.prcmRqtNo },
    { label: '재고번호', value: it.invtNo },
    { label: '품명', value: it.itemNm },
    { label: '단위', value: it.unitCd },
    { label: '계약수량', value: it.ctrtQty.toLocaleString(), type: 'number' },
    { label: '기 작성수량', value: it.acmlWrtQty.toLocaleString(), type: 'number' },
    { label: '금번 납품수량', value: it.tstmDlvgdsQty.toLocaleString(), type: 'number' },
  ]
}

export function InspDlvdocDtl_CmdtyList({ id }: InspDlvdocDtl_CmdtyListProps) {
  const { data: items = [] } = exQueries.useSelectInspDlvdocCmdtys(id)

  return (
    <section className="flex flex-col gap-krds-7 pb-6">
      <SectionTitle as="h3" info={`총 ${items.length}건`}>
        물품 목록
      </SectionTitle>
      <div className="flex flex-col gap-krds-7 px-4">
        {items.map((it) => (
          <Table key={it.id} rows={cmdtyRows(it)} />
        ))}
      </div>
    </section>
  )
}
InspDlvdocDtl_CmdtyList.displayName = 'InspDlvdocDtl_CmdtyList'
