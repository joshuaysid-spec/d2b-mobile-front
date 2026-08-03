// 검사및납품조서결과상세 - '물품목록' 탭 콘텐츠 (MUI-EX-01-T06). 설계서 04.이행 v0.83 slide38~39.
// 부대조달 T04 와 동일 구성("물품 목록 - 총 N건" + Table 반복 + 증명 문구) — 데이터 소스만 M07 조회.
import { useDlvdocRsltCmdtys } from '@/queries/ex'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { DlvdocRsltCmdtyItem } from '@/types/ex'

export interface DlvdocRsltDtl_CmdtyListProps {
  /** 조회 대상 조서 식별자 — 페이지(useParams id)가 주입. */
  id: string
}

// 물품 1건 → 표 행 (dlt_CmdtyList, slide39 1.4 순서).
function cmdtyRows(it: DlvdocRsltCmdtyItem): TableRow[] {
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

export function DlvdocRsltDtl_CmdtyList({ id }: DlvdocRsltDtl_CmdtyListProps) {
  const { data: items = [] } = useDlvdocRsltCmdtys(id)

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
      {/* 증명 문구 (slide38) */}
      <div className="flex flex-col gap-krds-3 px-4 text-krds-body-md text-krds-text-ink">
        <p>위 품목의 검사합격을 증명함</p>
        <p>위 품목이 납품되었음을 증명함</p>
      </div>
    </section>
  )
}
DlvdocRsltDtl_CmdtyList.displayName = 'DlvdocRsltDtl_CmdtyList'
