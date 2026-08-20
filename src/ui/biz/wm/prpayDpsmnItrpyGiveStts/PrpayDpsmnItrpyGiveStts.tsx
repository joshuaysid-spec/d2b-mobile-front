// 지급상태 — MUI-WM-01-T23 PrpayDpsmnItrpyGiveStts. 설계서 05.대금청구및사후 v0.83 slide36~37.
// 선금(M02)/착·중도금(M03)/사후정산(M13) 상세의 공용 '지급상태' 탭 콘텐츠 — 페이지가 id 를 주입.
// 지급 건 1건 = Table 반복(신청년도/계약번호/신청차수/신청금액/진행상태 — dlt_prgrsSttsList 순서).
import { wmQueries } from '@/queries/bds/wm/wmQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { GiveSttsItem } from '@/types/wm'

export interface PrpayDpsmnItrpyGiveSttsProps {
  /** 조회 대상 신청 식별자 — 상세 페이지(navigate state id)가 주입. */
  id: string
}

// 지급 1건 → 표 행 (slide37 1.1 순서).
function sttsRows(it: GiveSttsItem): TableRow[] {
  return [
    { label: '신청년도', value: it.rqstYr },
    { label: '계약번호', value: it.ctrtNo },
    { label: '신청차수', value: it.ctrtCycl },
    { label: '신청금액', value: `${it.giveClmAmt.toLocaleString()} 원`, type: 'number' },
    { label: '진행상태', value: it.expndStcd },
  ]
}

export function PrpayDpsmnItrpyGiveStts({ id }: PrpayDpsmnItrpyGiveSttsProps) {
  const { data: items = [] } = wmQueries.useSelectGiveStts(id)

  return (
    <section className="flex flex-col gap-krds-7 pb-6">
      <SectionTitle as="h3" info={`총 ${items.length}건`}>
        지급상태
      </SectionTitle>
      <div className="flex flex-col gap-krds-7 px-4">
        {items.map((it) => (
          <Table key={it.id} rows={sttsRows(it)} />
        ))}
      </div>
    </section>
  )
}
PrpayDpsmnItrpyGiveStts.displayName = 'PrpayDpsmnItrpyGiveStts'
