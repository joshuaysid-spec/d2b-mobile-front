// 물품수정계약서상세 - '수정계약명세서' 탭 콘텐츠 (MUI-CT-01-T23). 설계서 slide78·80~81.
// 수정항목(mdfcnArtclNm) + 품목 수정내역 블록(구분 -을/-으로, 반복). 데이터: useCmdtyMdfcnCtrdocDtst.
import { useParams } from 'react-router-dom'

import { useCmdtyMdfcnCtrdocDtst } from '@/queries/ct'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CtrtMdfcnDtstItem } from '@/types/ct'

// 품목 수정내역 1건 → 표 행(slide78 블록 순서: 조달요구번호~승인일).
function itemRows(it: CtrtMdfcnDtstItem): TableRow[] {
  return [
    { label: '구분', value: it.se },
    { label: '조달요구번호', value: it.prcmRqtNo },
    { label: '재고번호', value: it.invtNo ?? '-' },
    { label: '품목', value: it.fscCd },
    { label: '군구분', value: it.prcmRqtInstCd },
    { label: '예산구분', value: it.bgtCd },
    { label: '예산항목', value: it.bgtSecd ?? '-' },
    { label: '사업명', value: it.biz ?? '-' },
    { label: '승인일', value: it.aprvYmd ?? '-' },
  ]
}

export function CmdtyMdfcnCtrdocDtl_MdfcnCtrt() {
  const { id = '' } = useParams()
  const { data } = useCmdtyMdfcnCtrdocDtst(id)
  const items = data?.items ?? []

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider>
          수정계약명세서
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {/* 수정항목 — slide78 드롭다운 표기(단위/단가/납기/품목추가 등). 조회 전용이라 표 행으로 표시 */}
          <Table rows={[{ label: '수정항목', value: data?.mdfcnArtclNm ?? '-' }]} />
          {items.map((it) => (
            <Table key={it.id} rows={itemRows(it)} />
          ))}
        </div>
      </section>
    </div>
  )
}
CmdtyMdfcnCtrdocDtl_MdfcnCtrt.displayName = 'CmdtyMdfcnCtrdocDtl_MdfcnCtrt'
