// 이행/적격심사결과 - '심사결과' 탭 (MUI-BD-10-T18 기술용역, 설계서 02입찰 v1.83 slide265 / 데이터영역 slide266).
// 심사결과(dmt_srngRslt) 표 — "내 업체 정보만 표시". 데이터는 목업(추후 API: scwin.getImpltElgbSrngRsltDtlInfo).
// 기술용역(TechLbsvc)은 데이터영역 srngScr1~8 = 표시 순서 그대로(이행실적~결격여부). A군 flat 표 — 레퍼런스 [[Implt]].
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { ImpltElgbSrngScoreSet } from '@/types/mock/bd'

// 심사결과 목업 (설계서 slide265 값·slide266 항목명 srngScr1~8) — 추후 API 매핑.
const MOCK_RESULT: ImpltElgbSrngScoreSet = {
  srngScr1: '00',
  srngScr2: '000',
  srngScr3: '0000 0000',
  srngScr4: '0000',
  srngScr5: '0000 0000 0000',
  srngScr6: '0000 0000 0000',
  srngScr7: '9,800,000.00 원',
  srngScr8: '0000 0000 0000',
  tscr: '00.00 점',
  jgmtRsltNm: '적격',
}

const resultRows = (it: ImpltElgbSrngScoreSet): TableRow[] => [
  { label: '이행실적', value: it.srngScr1, type: 'number' },
  { label: '기술능력', value: it.srngScr2, type: 'number' },
  { label: '수행능력', value: it.srngScr3 },
  { label: '경영상태', value: it.srngScr4 },
  { label: '신인도', value: it.srngScr5 },
  { label: '소계', value: it.srngScr6 },
  { label: '입찰가격', value: it.srngScr7, type: 'number' },
  { label: '결격여부', value: it.srngScr8 },
  { label: '점수총계', value: it.tscr, type: 'number' },
  { label: '판정결과', value: it.jgmtRsltNm },
]

export function ImpltElgblRslt_TechLbsvc() {
  return (
    <Accordion type="multiple" defaultValue={['result']} className="w-full">
      <AccordionSection value="result" title="심사결과" borderTop={false}>
        <Table rows={resultRows(MOCK_RESULT)} />
      </AccordionSection>
    </Accordion>
  )
}
ImpltElgblRslt_TechLbsvc.displayName = 'ImpltElgblRslt_TechLbsvc'
