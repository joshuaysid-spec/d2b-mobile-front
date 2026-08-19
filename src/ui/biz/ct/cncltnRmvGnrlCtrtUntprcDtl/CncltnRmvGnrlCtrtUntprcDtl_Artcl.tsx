// 해지/해제 일반단가제계약 상세 - '계약명세서' 탭 콘텐츠 (MUI-CT-03-T08). 설계서 slide125·128~129.
// 계약 명세 정보: 부서명/조달판단번호 헤더 + 예산구분 그룹 품목 블록 반복.
// 컬럼은 총액제(T05)와 동일(공동계약업체~예산항목, slide125). 데이터: ctQueries.useSelectCncltnRmvGnrlCtrtDtst(id, 'untprc').
import { ctQueries } from '@/queries/bds/ct/queries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CtrtDtstGroup, CtrtDtstGroupItem } from '@/types/ct'

// 품목 1건 → 표 행(slide125·128 공동계약업체~예산항목).
function itemRows(it: CtrtDtstGroupItem): TableRow[] {
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

function DtstGroup({ group }: { group: CtrtDtstGroup }) {
  return (
    <div className="flex flex-col gap-krds-5">
      <p className="text-krds-body-md font-bold text-krds-text-ink">예산구분 - {group.bgtCd}</p>
      <div className="flex flex-col gap-krds-7">
        {group.items.map((it) => (
          <Table key={it.id} rows={itemRows(it)} />
        ))}
      </div>
    </div>
  )
}

export function CncltnRmvGnrlCtrtUntprcDtl_Artcl({ id }: { id: string }) {
  const { data } = ctQueries.useSelectCncltnRmvGnrlCtrtDtst(id, 'untprc')
  const groups = data?.groups ?? []

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider>
          계약 명세 정보
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          <Table
            rows={[
              { label: '부서명', value: data?.deptCd ?? '-' },
              { label: '조달판단번호', value: data?.prcmNo ?? '-' },
            ]}
          />
          {groups.map((g) => (
            <DtstGroup key={g.id} group={g} />
          ))}
        </div>
      </section>
    </div>
  )
}
CncltnRmvGnrlCtrtUntprcDtl_Artcl.displayName = 'CncltnRmvGnrlCtrtUntprcDtl_Artcl'
