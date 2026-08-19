// 상업계약서상세 - '계약명세서' 탭 콘텐츠 (MUI-CT-01-T78 ovsCmbzCtrdocDtl_Ctrt). 설계서 slide180·183.
// GRAND-TOTAL + 명세서 목록(번호/PR.No./Group No./SUB-TOTAL) — 항목 클릭 → P78 상업계약서명세서 팝업.
import { ctQueries } from '@/queries/bds/ct/queries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SelectionFieldBox } from '@/ui/common/base/SelectionFieldBox'
import { Table } from '@/ui/common/composites/Table'

export interface OvsCmbzCtrdocDtl_CtrtProps {
  /** 계약 식별자 — 부모 상세 페이지가 navigate state 에서 받아 전달. */
  id: string
  /** PR.No./Group 클릭 → P78 상업계약서명세서 팝업 열기(컨테이너는 페이지 소유). */
  onOpenDtst: () => void
}

export function OvsCmbzCtrdocDtl_Ctrt({ id, onOpenDtst }: OvsCmbzCtrdocDtl_CtrtProps) {
  const { data } = ctQueries.useSelectOvsCmbzDtst(id)
  const groups = data?.groups ?? []

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      {/* 계약 명세서 — GRAND-TOTAL */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider>
          계약 명세서
        </SectionTitle>
        <div className="px-4">
          <Table rows={[{ label: 'GRAND-TOTAL', value: data?.gramt ?? '-', type: 'number' }]} />
        </div>
      </section>

      {/* 명세서 목록 — 그룹 클릭 시 P78 상세 팝업(slide180·184 그리드-구매요청번호 클릭) */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${groups.length}건`}>
          명세서 목록
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {groups.map((g) => (
            <div key={g.id} className="flex flex-col gap-krds-5">
              <Table
                rows={[
                  { label: '번호', value: String(g.no), type: 'number' },
                  { label: 'PR No. / Group No.', value: `${g.prchsDmndNo} / ${g.groupNo}` },
                  { label: 'SUB-TOTAL', value: g.itemGramt, type: 'number' },
                ]}
              />
              <SelectionFieldBox value="계약명세서 상세" onClick={onOpenDtst} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
OvsCmbzCtrdocDtl_Ctrt.displayName = 'OvsCmbzCtrdocDtl_Ctrt'
