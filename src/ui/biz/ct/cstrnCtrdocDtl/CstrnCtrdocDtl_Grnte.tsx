// 공사계약서상세 - '연대보증' 탭 콘텐츠 (MUI-CT-01-T21). 설계서 slide72·74(1.3).
// 연대보증 블록(상호/금융기관/사업자등록번호/계좌번호/대표자/예금주/주소/전화번호) —
// 추가 내용에 따라 여러 건 반복 표시. 데이터: ctQueries.useSelectCtrtJntGrntes.
import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CtrtJntGrnte } from '@/types/ct'

// 연대보증 1건 → 표 행(slide72 목업 순서).
function grnteRows(g: CtrtJntGrnte): TableRow[] {
  return [
    { label: '순번', value: String(g.rnum), type: 'number' },
    { label: '상호', value: g.bzentyNm },
    { label: '금융기관', value: g.fnstCd },
    { label: '사업자등록번호', value: g.brno },
    { label: '계좌번호', value: g.actno },
    { label: '대표자', value: g.rprsvNm },
    { label: '예금주', value: g.dpstrNm },
    { label: '주소', value: g.bzentyAddr },
    { label: '전화번호', value: g.telno },
  ]
}

export function CstrnCtrdocDtl_Grnte({ id }: { id: string }) {
  const { data: grntes = [] } = ctQueries.useSelectCtrtJntGrntes(id)

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider>
          연대보증
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {grntes.map((g) => (
            <Table key={g.id} rows={grnteRows(g)} />
          ))}
        </div>
      </section>
    </div>
  )
}
CstrnCtrdocDtl_Grnte.displayName = 'CstrnCtrdocDtl_Grnte'
