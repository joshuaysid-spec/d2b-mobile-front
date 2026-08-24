// 발주의뢰서상세 - '물품목록' 탭 콘텐츠 (MUI-EX-02-T76). 설계서 04.이행 v0.83 slide70~72.
// "물품 목록 - 총 N건" + 품목 1건 = Table 반복(dl_orderRqdcItem 순서) + 더보기.
import { useState } from 'react'

import { exQueries } from '@/queries/cts/ex/exQueries'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsOrderRqdcItemRow } from '@/types/ex'

export interface OvsOrderRqdcDtl_CmdtyListProps {
  /** 조회 대상 발주의뢰서 식별자 — 페이지(navigate state id)가 주입. */
  id: string
}

// 품목 1건 → 표 행 (dl_orderRqdcItem, slide71~72 1.2 순서).
function itemRows(it: OvsOrderRqdcItemRow): TableRow[] {
  return [
    { label: '번호', value: String(it.no) },
    { label: '청구번호', value: it.orderClmNo },
    { label: '재고번호', value: it.invtNo },
    { label: 'Serial No', value: it.rcptNo },
    { label: '부품번호', value: it.itemNo },
    { label: '품명', value: it.itemNm },
    { label: '적용장비', value: it.aplcnEqpmntCd },
    { label: '수량', value: it.orderQty.toLocaleString(), type: 'number' },
    { label: '단위', value: it.unitNm },
    { label: '단가', value: it.orderUntprc.toLocaleString(), type: 'number' },
    { label: '금액', value: it.orderAmt.toLocaleString(), type: 'number' },
    { label: '운송구분', value: it.trnsMthdCd },
    { label: '우선순위', value: it.orderSeCd },
    { label: '하자보증유무', value: it.flwGrnteEn },
    { label: 'PriceList 적용년도', value: it.prcAplcnYr },
    { label: '납품요구일자', value: it.dlvgdsRqtYmd },
    { label: '비고', value: it.rmrkCn || '-' },
  ]
}

export function OvsOrderRqdcDtl_CmdtyList({ id }: OvsOrderRqdcDtl_CmdtyListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: items = [] } = exQueries.useSelectOrderRqdcDtlList(id)

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = items.slice(0, loaded)

  return (
    <section className="flex flex-col gap-krds-7 pb-6">
      <SectionTitle as="h3" info={`총 ${total}건`}>
        물품 목록
      </SectionTitle>
      <div className="flex flex-col gap-krds-7 px-4">
        {visibleList.map((it) => (
          <Table key={it.id} rows={itemRows(it)} />
        ))}
      </div>
      {loaded < total && (
        <div className="px-4">
          <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}
    </section>
  )
}
OvsOrderRqdcDtl_CmdtyList.displayName = 'OvsOrderRqdcDtl_CmdtyList'
