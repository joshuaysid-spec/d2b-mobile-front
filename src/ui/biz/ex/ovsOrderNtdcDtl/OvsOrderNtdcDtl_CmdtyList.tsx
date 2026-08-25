// 발주통보서상세 - '물품목록' 탭 콘텐츠 (MUI-EX-02-T78). 설계서 04.이행 v0.83 slide80~82.
// 요약 정보(발주/수락/거부 품목수 + 발주/수락금액, dm_itemCntInfo) + 품목 Table 반복(dl_orderNtdcItem) + 더보기.
import { useState } from 'react'

import { exQueries } from '@/queries/cts/ex/exQueries'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockOvsOrderNtdcDtl, MockOvsOrderNtdcItemRow } from '@/types/mock/ex'

export interface OvsOrderNtdcDtl_CmdtyListProps {
  /** 조회 대상 발주통보서 식별자 — 페이지(navigate state id)가 주입. */
  id: string
  /** 요약 정보(품목수/금액) — 페이지 조회(detail)에서 주입. */
  detail: MockOvsOrderNtdcDtl
}

// 품목 1건 → 표 행 (dl_orderNtdcItem, slide81~82 1.2 순서).
function itemRows(it: MockOvsOrderNtdcItemRow): TableRow[] {
  return [
    { label: '번호', value: String(it.no) },
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
    { label: '납품가능일자', value: it.dlvgdsRqtYmd },
    { label: '수락여부', value: it.acptYn },
  ]
}

export function OvsOrderNtdcDtl_CmdtyList({ id, detail }: OvsOrderNtdcDtl_CmdtyListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: items = [] } = exQueries.useSelectOrderNtdcDtlList(id)

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = items.slice(0, loaded)

  // 요약 정보 (dm_itemCntInfo, slide82 1.3)
  const summaryRows: TableRow[] = [
    { label: '발주품목', value: detail.orderItemCnt.toLocaleString(), type: 'number' },
    { label: '수락품목', value: detail.acptItemCnt.toLocaleString(), type: 'number' },
    { label: '거부품목', value: detail.rjtItemCnt.toLocaleString(), type: 'number' },
    { label: '발주금액', value: detail.orderAmt.toLocaleString(), type: 'number' },
    { label: '수락금액', value: detail.acptAmt.toLocaleString(), type: 'number' },
  ]

  return (
    <section className="flex flex-col gap-krds-7 pb-6">
      <SectionTitle as="h3">요약 정보</SectionTitle>
      <div className="px-4">
        <Table rows={summaryRows} />
      </div>

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
OvsOrderNtdcDtl_CmdtyList.displayName = 'OvsOrderNtdcDtl_CmdtyList'
