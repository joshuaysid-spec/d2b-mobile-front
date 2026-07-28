// 물품총액/단가계약서상세 - '특수조건' 탭 콘텐츠 (MUI-CT-01-T15 총액제 / T18 단가제 공용). 설계서 slide54.
// 특수조건(spclCnd) 본문 표시 — 세로 제한 없는 본문 박스(M06 수정계약서 특수조건과 동일 데이터영역).
// 총액제(T15)와 단가제(T18)는 같은 spclCnd 조회결과를 쓰므로 공용 컴포넌트(gramt 페이지 type 무관).
import { useParams } from 'react-router-dom'

import { useCtrtSpclCnd } from '@/queries/ct'
import { SectionTitle } from '@/ui/common/base/SectionTitle'

export function CmdtyGramtCtrdocDtl_Spcl() {
  const { id = '' } = useParams()
  const { data } = useCtrtSpclCnd(id)

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
CmdtyGramtCtrdocDtl_Spcl.displayName = 'CmdtyGramtCtrdocDtl_Spcl'
