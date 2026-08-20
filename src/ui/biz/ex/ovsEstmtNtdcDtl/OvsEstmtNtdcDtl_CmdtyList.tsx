// 견적통보서상세 - '물품목록' 탭 콘텐츠 (MUI-EX-02-T74). 설계서 04.이행 v0.83 slide60~63.
// 요약 정보(품목수/변경 품목수/총 금액, dm_itemCntInfo) + 품목 Table 반복(dl_estmtNtdcItem) + 더보기.
import { useState } from 'react'

import { exQueries } from '@/queries/bds/ex/exQueries'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsEstmtNtdcDtl, OvsEstmtNtdcItemRow } from '@/types/ex'

export interface OvsEstmtNtdcDtl_CmdtyListProps {
  /** 조회 대상 견적통보서 식별자 — 페이지(navigate state id)가 주입. */
  id: string
  /** 요약 정보(품목수/변경품목수/총금액) — 페이지 조회(detail)에서 주입. */
  detail: OvsEstmtNtdcDtl
}

// 품목 1건 → 표 행 (dl_estmtNtdcItem, slide61~62 1.2 순서).
function itemRows(it: OvsEstmtNtdcItemRow): TableRow[] {
  return [
    { label: '번호', value: String(it.no) },
    { label: '재고번호', value: it.invtNo },
    { label: '부품번호', value: it.itemNo },
    { label: '적용장비', value: it.aplcnEqpmntCd },
    { label: '단가', value: it.clmUntprc.toLocaleString(), type: 'number' },
    { label: '운송구분', value: it.trnsMthdCd },
    { label: '납품가능일자', value: it.dlvgdsRqtYmd },
    { label: 'Serial No', value: it.rcptNo },
    { label: '품명', value: it.itemNm },
    { label: '단위', value: it.unitNm },
    { label: '금액', value: it.clmAmt.toLocaleString(), type: 'number' },
    { label: '수량', value: it.clmQty.toLocaleString(), type: 'number' },
    { label: 'MISSING 구분', value: it.estmtChgSeCd || '-' },
    { label: '비고', value: it.rmrkCn || '-' },
  ]
}

export function OvsEstmtNtdcDtl_CmdtyList({ id, detail }: OvsEstmtNtdcDtl_CmdtyListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: items = [] } = exQueries.useSelectEstmtNtdcDtlList(id)

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = items.slice(0, loaded)

  // 요약 정보 (dm_itemCntInfo, slide62 1.3)
  const summaryRows: TableRow[] = [
    { label: '품목수', value: detail.titemCnt.toLocaleString(), type: 'number' },
    { label: '변경 품목수', value: detail.chgItemCnt.toLocaleString(), type: 'number' },
    { label: '총 금액', value: detail.gramt.toLocaleString(), type: 'number' },
  ]

  return (
    <section className="flex flex-col gap-krds-7 pb-6">
      {/* 요약 정보 (slide60 1]) */}
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
OvsEstmtNtdcDtl_CmdtyList.displayName = 'OvsEstmtNtdcDtl_CmdtyList'
