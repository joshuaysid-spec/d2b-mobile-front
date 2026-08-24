// 국외전자계약진행상세 - '계약명세서' 탭 콘텐츠 (MUI-CT-01-T75 ovsCtrtDtstTab). 설계서 slide164~166.
// 계약 정보(dm_ctrtInfo) + 계약품목 내역(dl_ctrtItemList, 반복) + 품목 단가 합계.
import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsCtrtDtstItem } from '@/types/ct'

// 품목 1건 → 표 행(slide164 계약품목 내역 순서).
function itemRows(it: OvsCtrtDtstItem): TableRow[] {
  return [
    { label: '순번', value: String(it.regSn), type: 'number' },
    { label: '항목번호', value: it.artclNo },
    { label: '조달요구번호', value: it.prcmRqtNo },
    { label: '단위', value: it.unitNm },
    { label: '수량', value: it.itemQty.toLocaleString(), type: 'number' },
    { label: '군급-재고번호', value: it.fscCdInvtNo },
    { label: '부품번호', value: it.prtsNo ?? '-' },
    { label: '적용장비', value: it.aplcnEqpmnt ?? '-' },
    { label: '납지', value: it.plcdlvCd },
    { label: '단가', value: it.itemUntprc.toLocaleString(), type: 'number' },
    { label: '품명', value: it.itemNm },
    { label: '예산구분', value: it.bgtSeCd ?? '-' },
    { label: '납기', value: it.dudtYmd ?? '-' },
    { label: '계약금액원화', value: it.ctrtAmt.toLocaleString(), type: 'number' },
  ]
}

export function OvsCtrtDtstTab({ id }: { id: string }) {
  const { data } = ctQueries.useSelectCtrtDtstList(id)
  const items = data?.items ?? []

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      {/* 계약 정보 (dm_ctrtInfo) */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider>
          계약 정보
        </SectionTitle>
        <div className="px-4">
          <Table
            rows={[
              { label: '계약번호', value: data?.ctrtInfo.ctrtNo ?? '-' },
              { label: '판단번호', value: data?.ctrtInfo.jdgmtNo ?? '-' },
              { label: '발주기관', value: data?.ctrtInfo.orderInstNm ?? '-' },
              { label: '계약명', value: data?.ctrtInfo.crtrNm ?? '-' },
              { label: '집행유형', value: data?.ctrtInfo.bizTypeCd ?? '-' },
              { label: '계약금원화', value: data?.ctrtInfo.ctrtFrcncyAmt ?? '-', type: 'number' },
              { label: '계약금외화', value: data?.ctrtInfo.ctrtAmt ?? '-', type: 'number' },
              { label: '계약금달러', value: data?.ctrtInfo.ctrtUsdAmt ?? '-', type: 'number' },
            ]}
          />
        </div>
      </section>

      {/* 계약품목 내역 (dl_ctrtItemList — 반복) */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${items.length}건`}>
          계약품목 내역
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {items.map((it) => (
            <Table key={it.id} rows={itemRows(it)} />
          ))}
          {/* 품목 단가 합계 금액 */}
          <Table
            rows={[
              {
                label: '품목 단가 합계 금액',
                value: data ? `${data.sumAmt.toLocaleString()} 원` : '-',
                type: 'number',
              },
            ]}
          />
        </div>
      </section>
    </div>
  )
}
OvsCtrtDtstTab.displayName = 'OvsCtrtDtstTab'
