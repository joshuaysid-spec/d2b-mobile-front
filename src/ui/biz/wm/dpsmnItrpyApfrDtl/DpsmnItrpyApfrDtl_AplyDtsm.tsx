// 착·중도금신청서상세 - '세부 신청내역' 탭 콘텐츠 (MUI-WM-01-T04). 설계서 05.대금청구및사후 v0.83 slide31~33.
// 금액구분별 Table 반복 — 선금(T02)과 달리 신청금액·승인된 전 차수 수령금액의 합계(0703 화면수정).
import { wmQueries } from '@/queries/cts/wm/wmQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockDpsmnItrpyAplyDsctnItem } from '@/types/mock/wm'

export interface DpsmnItrpyApfrDtl_AplyDtsmProps {
  /** 조회 대상 신청 식별자 — 페이지(navigate state id)가 주입. */
  id: string
}

// 구분 1건 → 표 행 (slide33 1.4 순서).
function dsctnRows(it: MockDpsmnItrpyAplyDsctnItem): TableRow[] {
  return [
    { label: '대상금액', value: `${it.trgtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '신청금액', value: `${it.aplyAmt.toLocaleString()} 원`, type: 'number' },
    {
      label: '승인된 전 차수 수령금액의 합계',
      value: `${it.aplyStotAmt.toLocaleString()} 원`,
      type: 'number',
    },
    { label: '신청금액의 비율', value: `${it.aplyAmtRt} %`, type: 'number' },
  ]
}

export function DpsmnItrpyApfrDtl_AplyDtsm({ id }: DpsmnItrpyApfrDtl_AplyDtsmProps) {
  const { data: items = [] } = wmQueries.useSelectDpsmnItrpyAplyDsctns(id)

  return (
    <section className="flex flex-col gap-krds-7 pb-6">
      <SectionTitle as="h3">신청내역</SectionTitle>
      <div className="flex flex-col gap-krds-8 px-4">
        {items.map((it) => (
          <div key={it.id} className="flex flex-col gap-krds-5">
            <p className="text-[17px] font-bold leading-normal text-krds-text-ink">
              {it.dpsmnItrpyAplyDsctnSeNm}
            </p>
            <Table rows={dsctnRows(it)} />
          </div>
        ))}
      </div>
    </section>
  )
}
DpsmnItrpyApfrDtl_AplyDtsm.displayName = 'DpsmnItrpyApfrDtl_AplyDtsm'
