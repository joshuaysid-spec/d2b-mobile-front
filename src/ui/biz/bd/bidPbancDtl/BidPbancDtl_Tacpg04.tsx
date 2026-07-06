// 입찰공고 상세 - '계약특수조건' 탭 (MUI-BD-01-M10, 설계서 slide42).
// 상단 기본정보 테이블 + 계약특수조건 전문(번호별, 축약 없이 전체 표시). 경쟁입찰 중 내용 있을 때만 노출.
// (전용 Figma 노드 미제공 — 설계서 데이터영역 + 상세 탭 공통 패턴으로 구성.) 데이터는 목업.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// 상단 기본정보 (설계서 slide42 데이터영역)
const INFO_ROWS: TableRow[] = [
  { label: '요구년도', value: '2026' },
  { label: '판단번호', value: '56349' },
  { label: '집행예정일', value: '2025-12-22' },
  { label: '계약예정일', value: '2026-01-15' },
  { label: '집행유형', value: '제조' },
  { label: '대표품명', value: '특수작전용대물타격무인항공기' },
]

// 계약특수조건 전문(번호별) — 목업. 실제 전문은 축약 없이 전체 표시.
const TERMS: { no: number; text: string }[] = [
  { no: 1, text: '계약상대자는 계약문서에서 정하는 바에 따라 계약을 성실히 이행하여야 한다.' },
  { no: 2, text: '계약상대자는 납품 전 소요군 검사를 받아야 하며, 검사 불합격 시 재납품하여야 한다.' },
  { no: 3, text: '계약상대자는 품질보증요구사항(QAR)을 준수하여야 한다.' },
  { no: 4, text: '대금은 검사·검수 완료 후 관련 규정에 따라 지급한다.' },
  { no: 5, text: '계약상대자의 귀책사유로 인한 지체 시 지체상금을 부과한다.' },
  { no: 6, text: '기타 본 계약에 명시되지 않은 사항은 관계 법령 및 정부 입찰·계약 집행기준에 따른다.' },
]

export function BidPbancDtl_Tacpg04() {
  return (
    <>
      <Accordion type="multiple" defaultValue={['info', 'terms']} className="w-full">
        <AccordionSection value="info" title="기본정보" borderTop={false}>
          <Table rows={INFO_ROWS} />
        </AccordionSection>
        <AccordionSection value="terms" title="계약특수조건">
          <ol className="flex flex-col gap-krds-5">
            {TERMS.map((t) => (
              <li key={t.no} className="flex gap-2 text-krds-body-md text-krds-text-ink">
                <span className="shrink-0 font-bold">{t.no}.</span>
                <span>{t.text}</span>
              </li>
            ))}
          </ol>
        </AccordionSection>
      </Accordion>
    </>
  )
}
BidPbancDtl_Tacpg04.displayName = 'BidPbancDtl_Tacpg04'
