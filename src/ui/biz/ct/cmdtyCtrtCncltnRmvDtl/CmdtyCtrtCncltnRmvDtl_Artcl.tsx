// 해지/해제 물품일반계약 상세 - '계약업체' 탭 콘텐츠 (MUI-CT-03-T02). 설계서 slide110·113.
// 화면목록(slide10)상 명칭은 '세부항목'이나, 레이아웃(slide110)은 계약업체(여러 업체 반복) 표시.
// 데이터: ctQueries.useSelectCmdtyCncltnRmvBzentys — 목업/실연동은 ctService(USE_MOCK)가 전환.
import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCtrtBzenty } from '@/types/mock/ct'

// 업체 1건 → 표 행(slide113 1.3 항목 순서).
function bzentyRows(b: MockCtrtBzenty): TableRow[] {
  return [
    { label: '계약업체명', value: b.bzentyNm },
    { label: '사업자등록번호', value: b.brno },
    { label: '대표자', value: b.rprsvNm },
    { label: '금융기관', value: b.fnstCd },
    { label: '예금주', value: b.dpstrNm },
    { label: '전자서명일', value: b.elsgnDt },
    { label: '보증금납부방법', value: b.depsPayMthdCd },
    { label: '보증금액', value: `${b.grnteAmt.toLocaleString()} 원`, type: 'number' },
    { label: '계좌실명번호', value: b.enacno },
    { label: '계좌번호', value: b.acnutNo },
  ]
}

export function CmdtyCtrtCncltnRmvDtl_Artcl({ id }: { id: string }) {
  const { data } = ctQueries.useSelectCmdtyCncltnRmvBzentys(id)
  const bzentys = data ?? []

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
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
CmdtyCtrtCncltnRmvDtl_Artcl.displayName = 'CmdtyCtrtCncltnRmvDtl_Artcl'
