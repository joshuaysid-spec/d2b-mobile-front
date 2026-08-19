// 검사및납품조서상세(부대조달) - '물품목록' 탭 콘텐츠 (MUI-EX-01-T04). 설계서 04.이행 v0.83 slide23~24.
// "물품 목록 - 총 N건" 헤더 + 물품 1건 = Table 반복(dlt_CmdtyList — 중앙 T02 와 달리 총계약수량 tctrtQty)
// + 하단 증명 문구(slide23: 검사합격/납품 증명). 데이터는 exQueries.useSelectInspDlvdocSbsdCmdtys 조회.
import { exQueries } from '@/queries/bds/ex/queries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { InspDlvdocSbsdCmdtyItem } from '@/types/ex'

export interface InspDlvdocDtlSbsdPrcm_CmdtyListProps {
  /** 조회 대상 조서 식별자 — 페이지(navigate state id)가 주입. */
  id: string
}

// 물품 1건 → 표 행 (dlt_CmdtyList, slide24 1.3 순서).
function cmdtyRows(it: InspDlvdocSbsdCmdtyItem): TableRow[] {
  return [
    { label: '조달요구번호', value: it.prcmRqtNo },
    { label: '재고번호', value: it.invtNo },
    { label: '품명', value: it.itemNm },
    { label: '단위', value: it.unitCd },
    { label: '계약수량', value: it.tctrtQty.toLocaleString(), type: 'number' },
    { label: '기 작성수량', value: it.acmlWrtQty.toLocaleString(), type: 'number' },
    { label: '금번 납품수량', value: it.tstmDlvgdsQty.toLocaleString(), type: 'number' },
  ]
}

export function InspDlvdocDtlSbsdPrcm_CmdtyList({ id }: InspDlvdocDtlSbsdPrcm_CmdtyListProps) {
  const { data: items = [] } = exQueries.useSelectInspDlvdocSbsdCmdtys(id)

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
      {/* 증명 문구 (slide23) */}
      <div className="flex flex-col gap-krds-3 px-4 text-krds-body-md text-krds-text-ink">
        <p>위 품목의 검사합격을 증명함</p>
        <p>위 품목이 납품되었음을 증명함</p>
      </div>
    </section>
  )
}
InspDlvdocDtlSbsdPrcm_CmdtyList.displayName = 'InspDlvdocDtlSbsdPrcm_CmdtyList'
