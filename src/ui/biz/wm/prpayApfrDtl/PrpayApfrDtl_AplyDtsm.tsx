// 선금신청서상세 - '세부 신청내역' 탭 콘텐츠 (MUI-WM-01-T02). 설계서 05.대금청구및사후 v0.83 slide24~26.
// 금액구분(재료비 수입/국내/간접 · 노무비 직접/간접 · 경비 직접/간접 · 일반관리비 · 기타 · 합계)별
// Table 반복 — 행: 대상금액/신청금액(기사용·사용예정·계)/신청금액의 비율(dmt_aplyDsctnInfo 순서).
import { wmQueries } from '@/queries/cts/wm/wmQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { PrpayAplyDsctnItem } from '@/types/wm'

export interface PrpayApfrDtl_AplyDtsmProps {
  /** 조회 대상 신청 식별자 — 페이지(navigate state id)가 주입. */
  id: string
}

// 구분 1건 → 표 행 (slide24 목업 순서).
function dsctnRows(it: PrpayAplyDsctnItem): TableRow[] {
  return [
    { label: '대상금액', value: `${it.trgtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '신청금액 - 기사용', value: `${it.arusAplyAmt.toLocaleString()} 원`, type: 'number' },
    {
      label: '신청금액 - 사용예정',
      value: `${it.usePrnmntAplyAmt.toLocaleString()} 원`,
      type: 'number',
    },
    { label: '신청금액 - 계', value: `${it.aplySumAmt.toLocaleString()} 원`, type: 'number' },
    { label: '신청금액의 비율', value: `${it.aplyAmtRt} %`, type: 'number' },
  ]
}

export function PrpayApfrDtl_AplyDtsm({ id }: PrpayApfrDtl_AplyDtsmProps) {
  const { data: items = [] } = wmQueries.useSelectPrpayAplyDsctns(id)

  return (
    <section className="flex flex-col gap-krds-7 pb-6">
      <SectionTitle as="h3">세부신청내역</SectionTitle>
      <div className="flex flex-col gap-krds-8 px-4">
        {items.map((it) => (
          <div key={it.id} className="flex flex-col gap-krds-5">
            <p className="text-[17px] font-bold leading-normal text-krds-text-ink">
              {it.prpayAplyDsctnAmtSeNm}
            </p>
            <Table rows={dsctnRows(it)} />
          </div>
        ))}
      </div>
    </section>
  )
}
PrpayApfrDtl_AplyDtsm.displayName = 'PrpayApfrDtl_AplyDtsm'
