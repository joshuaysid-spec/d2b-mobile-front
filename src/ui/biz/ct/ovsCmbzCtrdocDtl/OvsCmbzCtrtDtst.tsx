// 상업계약서명세서 바텀시트 콘텐츠 — MUI-CT-01-P78 OvsCmbzCtrtDtst. 설계서 slide185~186.
// 계약명세서 탭(T78)의 그룹 클릭 → 그룹 품목 상세(L/I·Stock-No·Part-No 등) 조회.
// 컨테이너(BottomSheet)·타이틀·footer 는 부모 페이지(OvsCmbzCtrdocDtlPage) 소유.
// 시트가 좌우 16px 패딩을 제공하므로 콘텐츠는 자체 px-* 를 두지 않는다(2중 패딩 금지).
import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsCmbzCtrtDtstResult } from '@/types/mock/ct'

export interface OvsCmbzCtrtDtstProps {
  /** 계약 식별자 — 부모 상세 페이지가 navigate state 에서 받아 전달. */
  id: string
  /** 시트 열림 여부 — 열릴 때만 조회. */
  open: boolean
}

// 품목 1건 → 표 행(slide185 목록 데이터 영역 순서 — L/I 항목번호 등 영문 레이블).
function itemRows(it: OvsCmbzCtrtDtstResult['items'][number]): TableRow[] {
  return [
    { label: 'L/I', value: it.artclNo },
    { label: '조달요구번호', value: it.prcmRqtNo },
    { label: 'Stock-No', value: it.invtNo },
    { label: 'Part-No', value: it.prtsNo ?? '-' },
    { label: 'Nomenclature', value: it.itemNm },
    { label: 'Budget', value: it.bgtSeCd ?? '-' },
    { label: 'Unit', value: it.unitNm },
    { label: 'Qnty', value: it.itemQty.toLocaleString(), type: 'number' },
    { label: 'Unit Price', value: it.itemUntprc, type: 'number' },
    { label: 'Total Price', value: it.gramt, type: 'number' },
  ]
}

export function OvsCmbzCtrtDtst({ id, open }: OvsCmbzCtrtDtstProps) {
  const { data } = ctQueries.useSelectOvsCmbzCtrtDtst(id, open)
  const items = data?.items ?? []

  return (
    <div className="flex flex-col">
      {/* 계약정보 (dm_ctrtInfo, slide186 1.1) */}
      <section className="flex flex-col pb-krds-8">
        <SectionTitle as="h3" className="px-0">
          계약정보
        </SectionTitle>
        <Table
          rows={[
            { label: '계약번호', value: data?.ctrtInfo.ctrtNo ?? '-' },
            { label: 'PR.NO.', value: data?.ctrtInfo.prchsDmndNo ?? '-' },
            { label: 'Project', value: data?.ctrtInfo.ctrtNm ?? '-' },
            { label: 'Group NO', value: data?.ctrtInfo.groupNo ?? '-' },
            { label: 'Firm', value: data?.ctrtInfo.ctrtBzentyNm ?? '-' },
            { label: 'Type of Bid', value: data?.ctrtInfo.ctrtMthdNm ?? '-' },
            { label: '화폐단위', value: data?.ctrtInfo.crncCd ?? '-' },
          ]}
        />
      </section>

      {/* 명세서 품목 정보 (dl_ctrtDtst — 반복) + SUB-TOTAL */}
      <section className="flex flex-col pb-krds-8">
        <SectionTitle as="h3" className="px-0">
          명세서 품목 정보
        </SectionTitle>
        <div className="flex flex-col gap-krds-8">
          {items.map((it) => (
            <Table key={it.id} rows={itemRows(it)} />
          ))}
          <Table rows={[{ label: 'SUB-TOTAL', value: data?.itemGramt ?? '-', type: 'number' }]} />
        </div>
      </section>
    </div>
  )
}
OvsCmbzCtrtDtst.displayName = 'OvsCmbzCtrtDtst'
