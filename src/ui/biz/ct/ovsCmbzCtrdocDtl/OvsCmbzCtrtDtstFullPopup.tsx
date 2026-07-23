// 상업계약서명세서 풀팝업 — MUI-CT-01-P78 OvsCmbzCtrtDtst. 설계서 slide185~186.
// 계약명세서 탭(T78)의 그룹 클릭 → 그룹 품목 상세(L/I·Stock-No·Part-No 등) 조회.
import { useParams } from 'react-router-dom'

import { useOvsCmbzCtrtDtst } from '@/queries/ct'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsCmbzCtrtDtstResult } from '@/types/ct'

export interface OvsCmbzCtrtDtstFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function OvsCmbzCtrtDtstFullPopup({ open, onOpenChange }: OvsCmbzCtrtDtstFullPopupProps) {
  const { id = '' } = useParams()
  const { data } = useOvsCmbzCtrtDtst(id, open)
  const items = data?.items ?? []

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="계약명세서 상세"
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col gap-8 pb-8">
        {/* 계약정보 (dm_ctrtInfo, slide186 1.1) */}
        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3">계약정보</SectionTitle>
          <div className="px-4">
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
          </div>
        </section>

        {/* 명세서 품목 정보 (dl_ctrtDtst — 반복) + SUB-TOTAL */}
        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3" topDivider info={`총 ${items.length}건`}>
            명세서 품목 정보
          </SectionTitle>
          <div className="flex flex-col gap-krds-7 px-4">
            {items.map((it) => (
              <Table key={it.id} rows={itemRows(it)} />
            ))}
            <Table
              rows={[{ label: 'SUB-TOTAL', value: data?.itemGramt ?? '-', type: 'number' }]}
            />
          </div>
        </section>
      </div>
    </FullPopup>
  )
}
OvsCmbzCtrtDtstFullPopup.displayName = 'OvsCmbzCtrtDtstFullPopup'
