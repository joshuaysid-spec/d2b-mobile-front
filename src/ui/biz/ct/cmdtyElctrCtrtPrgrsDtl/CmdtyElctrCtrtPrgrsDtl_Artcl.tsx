// 물품전자계약진행상세 - '계약업체' 탭 콘텐츠 (MUI-CT-01-T02, Figma 10020-154708). 설계서 slide25·29~30.
// 계약업체(총 N건 — 여러 업체 반복) Table + 생산공장(방위사업청 계약만, 여러 건) Table.
// 데이터: ctQueries.useSelectCtrtBzentys(queries/ct) — 목업/실연동은 ctService(USE_MOCK)가 전환.
import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCtrtBzenty, MockCtrtFctry } from '@/types/mock/ct'

// 업체 1건 → 표 행(slide29 1.3 항목 순서 = Figma 154708).
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

// 생산공장 1건 → 표 행(slide30 1.5).
function fctryRows(f: MockCtrtFctry): TableRow[] {
  return [
    { label: '생산공장', value: f.fctryAddr },
    { label: '위치', value: f.fctryDaddr },
    { label: '우편번호', value: f.fctryOzip },
  ]
}

export function CmdtyElctrCtrtPrgrsDtl_Artcl({ id }: { id: string }) {
  const { data } = ctQueries.useSelectCtrtBzentys(id)
  const bzentys = data?.bzentys ?? []
  const fctrys = data?.fctrys ?? []

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      {/* 계약업체 — 여러 업체 정보가 반복 표시(slide25) */}
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

      {/* 생산공장 — 방위사업청 계약의 경우 표시, 여러 건 가능(slide25) */}
      {fctrys.length > 0 && (
        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3" topDivider>
            생산공장
          </SectionTitle>
          <div className="flex flex-col gap-krds-7 px-4">
            {fctrys.map((f) => (
              <Table key={f.id} rows={fctryRows(f)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
CmdtyElctrCtrtPrgrsDtl_Artcl.displayName = 'CmdtyElctrCtrtPrgrsDtl_Artcl'
