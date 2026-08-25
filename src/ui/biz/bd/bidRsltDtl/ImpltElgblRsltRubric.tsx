// 이행/적격심사결과 - '심사결과' 탭 B/C군 공용 루브릭 렌더러 (도메인 조립물, MUI-BD-10-T07~T16·T19~T21).
// 중기청 계열(B군)·공사/용역 계열(C군)은 flat 표가 아니라 심사분야 → 심사항목 → 배점 → 심사평점 채점 루브릭이라
//   유형별 파일은 루브릭 데이터(MockImpltElgbSrngRubric)만 소유하고, 렌더는 이 공용 컴포넌트가 담당한다.
// 조립: AccordionSection(심사분야 1개) + Table(심사항목 행, value=배점/평점 combination) + 총계/판정 섹션.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockImpltElgbSrngRubric } from '@/types/mock/bd'

// 심사항목 1행 → 배점/평점 2열을 value 셀(combination)에 우측 정렬로 표시.
function itemRows(rows: MockImpltElgbSrngRubric['sections'][number]['rows']): TableRow[] {
  return rows.map((r) => ({
    label: r.item,
    type: 'combination',
    value: (
      <div className="flex items-center justify-between gap-krds-6 text-[17px] leading-normal">
        <span className="text-krds-text-muted">배점 {r.allot ?? '-'}</span>
        <span className="tabular-nums text-krds-text-ink">{r.score ?? '-'}</span>
      </div>
    ),
  }))
}

export interface ImpltElgblRsltRubricProps {
  rubric: MockImpltElgbSrngRubric
}

export function ImpltElgblRsltRubric({ rubric }: ImpltElgblRsltRubricProps) {
  // 심사분야 섹션 + (총계/판정 있으면) 판정 섹션. 모두 기본 열림.
  const fieldValues = rubric.sections.map((s) => s.field)
  const defaultValue = [...fieldValues, 'judgment']

  return (
    <Accordion type="multiple" defaultValue={defaultValue} className="w-full">
      {rubric.sections.map((section, i) => (
        <AccordionSection
          key={section.field}
          value={section.field}
          title={section.field}
          titleInfo={section.allot ? `배점 ${section.allot}` : undefined}
          borderTop={i > 0}
        >
          <Table rows={itemRows(section.rows)} />
        </AccordionSection>
      ))}

      {(rubric.tscr || rubric.jgmtRsltNm) && (
        <AccordionSection value="judgment" title="심사결과" borderTop={rubric.sections.length > 0}>
          <Table
            rows={[
              { label: '점수총계', value: rubric.tscr ?? '-', type: 'number' },
              { label: '판정결과', value: rubric.jgmtRsltNm ?? '-' },
            ]}
          />
        </AccordionSection>
      )}
    </Accordion>
  )
}
ImpltElgblRsltRubric.displayName = 'ImpltElgblRsltRubric'
