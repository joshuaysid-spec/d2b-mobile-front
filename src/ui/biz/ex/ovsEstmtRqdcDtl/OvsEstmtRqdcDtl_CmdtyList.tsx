// 견적의뢰서상세 - '물품목록' 탭 콘텐츠 (MUI-EX-02-T72). 설계서 04.이행 v0.83 slide51~52.
// "물품 목록 - 총 N건" + 품목 1건 = Table 반복(dl_estmtRqdcItem 순서) + 더보기.
import { useState } from 'react'

import { exQueries } from '@/queries/cts/ex/exQueries'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsEstmtRqdcItemRow } from '@/types/mock/ex'

export interface OvsEstmtRqdcDtl_CmdtyListProps {
  /** 조회 대상 견적의뢰서 식별자 — 페이지(navigate state id)가 주입. */
  id: string
}

// 품목 1건 → 표 행 (dl_estmtRqdcItem, slide52 1.2 순서).
function itemRows(it: OvsEstmtRqdcItemRow): TableRow[] {
  return [
    { label: '번호', value: String(it.no) },
    { label: '재고번호', value: it.invtNo },
    { label: '부품번호', value: it.itemNo },
    { label: '적용장비', value: it.aplcnEqpmntCd },
    { label: '운송구분', value: it.trnsMthdCd },
    { label: '납품요구일자', value: it.dlvgdsRqtYmd },
    { label: 'Serial No', value: it.rcptNo },
    { label: '품명', value: it.itemNm },
    { label: '단위', value: it.unitNm },
    { label: '수량', value: it.clmQty.toLocaleString(), type: 'number' },
    { label: '비고', value: it.rmrkCn || '-' },
  ]
}

export function OvsEstmtRqdcDtl_CmdtyList({ id }: OvsEstmtRqdcDtl_CmdtyListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: items = [] } = exQueries.useSelectEstmtRqdcDtlList(id)

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
OvsEstmtRqdcDtl_CmdtyList.displayName = 'OvsEstmtRqdcDtl_CmdtyList'
