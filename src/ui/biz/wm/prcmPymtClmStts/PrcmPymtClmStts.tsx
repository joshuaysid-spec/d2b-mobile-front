// 진행상태 — MUI-WM-01-T24. 설계서 05.대금청구및사후 v0.85 slide80~81 (2026-08-05 화면 추가).
// 대금청구 상세(중앙조달 M05)·사후정산청구상세(M13) 의 공용 '진행상태' 탭 콘텐츠 — 페이지가 id 를 주입.
// 처리 1건 = Table 반복(진행상태/처리일시/처리부대·업체/처리담당자 — dlt_pymtClmPrgrsSttList 순서).
// ⚠️ 설계서 영문 화면 ID 는 PrcmPymtClmSttsPage 지만 탭 콘텐츠라 명명 규칙에 따라 Page 접미사 제외.
// 지급상태(T23 PrpayDpsmnItrpyGiveStts)와는 별개 화면 — 두 탭을 섞어 쓰지 말 것.
import { wmQueries } from '@/queries/cts/wm/wmQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { PymtClmPrgrsSttItem } from '@/types/mock/wm'

export interface PrcmPymtClmSttsProps {
  /** 조회 대상 대금청구 식별자 — 상세 페이지(navigate state id)가 주입. */
  id: string
}

// 처리 1건 → 표 행 (slide80 표 헤더 순서).
function sttsRows(it: PymtClmPrgrsSttItem): TableRow[] {
  return [
    { label: '진행상태', value: it.dlvdocPrgrsSt },
    { label: '처리일시', value: it.prcsDt },
    { label: '처리부대/업체', value: it.prcsUnitBzentyNm },
    { label: '처리담당자', value: it.prcsPicNm },
  ]
}

export function PrcmPymtClmStts({ id }: PrcmPymtClmSttsProps) {
  const { data: items = [] } = wmQueries.useSelectPymtClmPrgrsStts(id)

  return (
    <section className="flex flex-col gap-krds-7 pb-6">
      <SectionTitle as="h3" info={`총 ${items.length}건`}>
        진행상태
      </SectionTitle>
      <div className="flex flex-col gap-krds-7 px-4">
        {items.map((it) => (
          <Table key={it.no} rows={sttsRows(it)} />
        ))}
      </div>
    </section>
  )
}
PrcmPymtClmStts.displayName = 'PrcmPymtClmStts'
