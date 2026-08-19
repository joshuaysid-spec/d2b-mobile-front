// 공사계약서상세 - '하자담보책임' 탭 콘텐츠 (MUI-CT-01-T20). 설계서 slide74(1.2 하자담보책임 데이터 영역).
// 하자담보 책임 블록(공종명/공종별 계약금액/하자보수 보증율/하자담보책임기간) — 여러 건 반복,
// 입력 데이터 출력 전용(등록/수정 불가). M09 공사전자계약진행상세 하자담보(_Flw)와 동일 데이터영역 → ctQueries.useSelectCtrtFlws.
import { ctQueries } from '@/queries/bds/ct/ctQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CtrtCnstpFlw } from '@/types/ct'

// 하자담보 1건 → 표 행(slide74 목업 순서).
function flwRows(f: CtrtCnstpFlw): TableRow[] {
  return [
    { label: '공종명', value: f.cnstpNm },
    { label: '공종별 계약금액', value: `${f.cnstpCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '하자보수 보증율', value: `${f.dfrpGrnteAmtRt} %`, type: 'number' },
    { label: '하자담보책임기간', value: f.wrtrspPrdCn },
  ]
}

export function CstrnCtrdocDtl_Flw({ id }: { id: string }) {
  const { data: flws = [] } = ctQueries.useSelectCtrtFlws(id)

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider>
          하자담보 책임
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {flws.map((f) => (
            <Table key={f.id} rows={flwRows(f)} />
          ))}
        </div>
      </section>
    </div>
  )
}
CstrnCtrdocDtl_Flw.displayName = 'CstrnCtrdocDtl_Flw'
