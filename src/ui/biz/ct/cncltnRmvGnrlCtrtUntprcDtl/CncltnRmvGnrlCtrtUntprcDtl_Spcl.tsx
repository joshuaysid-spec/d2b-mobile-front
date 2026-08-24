// 해지/해제 일반단가제계약 상세 - '특수조건' 탭 콘텐츠 (MUI-CT-03-T09). 설계서 slide126·129.
// 특수조건(spclCnd) 본문 표시 — 세로 제한 없는 본문 박스. 데이터: ctQueries.useSelectCncltnRmvSpcl.
import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'

export function CncltnRmvGnrlCtrtUntprcDtl_Spcl({ id }: { id: string }) {
  const { data } = ctQueries.useSelectCncltnRmvSpcl(id)

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
CncltnRmvGnrlCtrtUntprcDtl_Spcl.displayName = 'CncltnRmvGnrlCtrtUntprcDtl_Spcl'
