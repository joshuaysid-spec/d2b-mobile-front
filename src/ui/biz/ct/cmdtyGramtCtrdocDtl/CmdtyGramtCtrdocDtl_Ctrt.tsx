// 물품총액/단가계약서상세 - '계약명세서' 탭 콘텐츠 (MUI-CT-01-T14/T17 공용). 설계서 slide50·58.
// 계약 명세 정보: 부서명/조달판단번호 헤더 + 예산구분 그룹(장기국채/총계/예산별 소계) 품목 블록 반복.
// 총액제(T14)와 단가제(T17)는 품목 항목 세트가 다름 — 값 있는 필드만 렌더(설계서 '-' 표시).
import { useParams } from 'react-router-dom'

import { useCmdtyCtrdocDtst } from '@/queries/ct'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CtCtrdocType, CtrtDtstGroup, CtrtDtstGroupItem } from '@/types/ct'

export interface CmdtyGramtCtrdocDtl_CtrtProps {
  type: CtCtrdocType
}

// 품목 1건 → 표 행. 총액제(T14): 공동계약업체~예산항목 · 단가제(T17): 항목번호~납지수량.
function itemRows(it: CtrtDtstGroupItem, type: CtCtrdocType): TableRow[] {
  if (type === 'gramt') {
    return [
      { label: '공동계약업체', value: it.bzentyNm ?? '-' },
      { label: '조달요구번호', value: it.prcmRqtNo ?? '-' },
      { label: '재고번호', value: it.invtNo ?? '-' },
      { label: '품명', value: it.fscCd ?? '-' },
      { label: '적용장비', value: it.aplcnEqpmntCd ?? '-' },
      { label: '군구분', value: it.prcmRqtInstCd ?? '-' },
      { label: '예산항목', value: it.bgtSecd ?? '-' },
    ]
  }
  // 단가제(T17) — slide58·61 1.2
  return [
    { label: '항목번호', value: it.clsfNo ?? '-' },
    { label: '재고번호', value: it.invtNo ?? '-' },
    { label: '품명', value: it.fscCd ?? '-' },
    { label: '단위', value: it.unitCd ?? '-' },
    {
      label: '수량(예정)',
      value: it.ctrtQty !== undefined ? it.ctrtQty.toLocaleString() : '-',
      type: 'number',
    },
    {
      label: '단가',
      value: it.ctrtUntprc !== undefined ? `${it.ctrtUntprc.toLocaleString()} 원` : '-',
      type: 'number',
    },
    {
      label: '금액(예정)',
      value: it.itemAmt !== undefined ? `${it.itemAmt.toLocaleString()} 원` : '-',
      type: 'number',
    },
    { label: '도면번호', value: it.flrplnNo ?? '-' },
    { label: '규격번호', value: it.spcfctNo ?? '-' },
    { label: '부품번호', value: it.prtsNo ?? '-' },
    { label: '검사형태', value: it.inspShp ?? '-' },
    { label: '납기', value: it.dudt ?? '-' },
    { label: '납지', value: it.plcdlv ?? '-' },
    {
      label: '납지수량',
      value: it.plcdlvQty !== undefined ? it.plcdlvQty.toLocaleString() : '-',
      type: 'number',
    },
  ]
}

// 예산구분 그룹 1개 — 그룹 라벨(예산구분 - 장기국채/총계/예산별 소계) + 품목 블록.
function DtstGroup({ group, type }: { group: CtrtDtstGroup; type: CtCtrdocType }) {
  return (
    <div className="flex flex-col gap-krds-5">
      <p className="text-krds-body-md font-bold text-krds-text-ink">예산구분 - {group.bgtCd}</p>
      <div className="flex flex-col gap-krds-7">
        {group.items.map((it) => (
          <Table key={it.id} rows={itemRows(it, type)} />
        ))}
      </div>
    </div>
  )
}

export function CmdtyGramtCtrdocDtl_Ctrt({ type }: CmdtyGramtCtrdocDtl_CtrtProps) {
  const { id = '' } = useParams()
  const { data } = useCmdtyCtrdocDtst(id, type)
  const groups = data?.groups ?? []

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider>
          계약 명세 정보
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {/* 부서명/조달판단번호 헤더(slide50·58) */}
          <Table
            rows={[
              { label: '부서명', value: data?.deptCd ?? '-' },
              { label: '조달판단번호', value: data?.prcmNo ?? '-' },
            ]}
          />
          {/* 예산구분 그룹 — 항목이 더 있는 경우 추가 표시 */}
          {groups.map((g) => (
            <DtstGroup key={g.id} group={g} type={type} />
          ))}
        </div>
      </section>
    </div>
  )
}
CmdtyGramtCtrdocDtl_Ctrt.displayName = 'CmdtyGramtCtrdocDtl_Ctrt'
