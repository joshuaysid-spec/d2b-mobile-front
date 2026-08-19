// 공사전자계약진행상세 - '계약업체' 탭 콘텐츠 (MUI-CT-01-T10). 설계서 slide40·44(1.2).
// 물품(T02)과 동일 구조에 공사 확장 필드(계약유형·전자서명여부·전화번호·법인번호·주소) 추가.
// 생산공장 섹션 없음(물품 전용). 데이터: ctQueries.useSelectCtrtBzentys 재사용.
import { ctQueries } from '@/queries/bds/ct/queries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CtrtBzenty } from '@/types/ct'

// 업체 1건 → 표 행(slide40 목업 순서).
function bzentyRows(b: CtrtBzenty): TableRow[] {
  return [
    // '계약유형'(대표/구성) — 항목표 미정의 임시 키(bzentySeCd, M73 재사용). slide40 첫 행.
    { label: '계약유형', value: b.bzentySeCd ?? '-' },
    { label: '계약업체명', value: b.bzentyNm },
    { label: '사업자등록번호', value: b.brno },
    { label: '대표자', value: b.rprsvNm },
    { label: '금융기관', value: b.fnstCd },
    { label: '예금주', value: b.dpstrNm },
    { label: '전자서명', value: b.signYn ?? '-' },
    { label: '보증금납부방법', value: b.depsPayMthdCd },
    { label: '보증금액', value: `${b.grnteAmt.toLocaleString()} 원`, type: 'number' },
    { label: '전화번호', value: b.telno ?? '-' },
    { label: '법인번호', value: b.crno ?? '-' },
    { label: '주소', value: b.lctnAddr ?? '-' },
    { label: '계좌번호', value: b.acnutNo },
    { label: '계좌실명번호', value: b.enacno },
  ]
}

export function CstrnElctrCtrtPrgrsDtl_Artcl({ id }: { id: string }) {
  const { data } = ctQueries.useSelectCtrtBzentys(id)
  const bzentys = data?.bzentys ?? []

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      {/* 계약업체 — 여러 업체 정보가 반복 표시(slide40) */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${bzentys.length}건`}>
          계약업체
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {bzentys.map((b) => (
            <Table key={b.id} rows={bzentyRows(b)} />
          ))}
        </div>
      </section>
    </div>
  )
}
CstrnElctrCtrtPrgrsDtl_Artcl.displayName = 'CstrnElctrCtrtPrgrsDtl_Artcl'
