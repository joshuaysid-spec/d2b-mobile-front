// 물품수정계약서상세 - '특수조건' 탭 콘텐츠 (MUI-CT-01-T24). 설계서 slide79·82.
// 특수조건(spclCnd) 본문 표시 — 세로 제한 없는 본문 박스(반송/취소사유 탭과 동일 스타일).
import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'

export function CmdtyMdfcnCtrdocDtl_Spcl({ id }: { id: string }) {
  const { data } = ctQueries.useSelectCtrtSpclCnd(id)

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider>
          특수조건
        </SectionTitle>
        <div className="px-4">
          <div className="whitespace-pre-line rounded-krds-8 border border-krds-border-field p-4 text-krds-body-md text-krds-text-ink">
            {data?.spclCnd ?? '-'}
          </div>
        </div>
      </section>
    </div>
  )
}
CmdtyMdfcnCtrdocDtl_Spcl.displayName = 'CmdtyMdfcnCtrdocDtl_Spcl'
