// 이행/적격심사결과상세 - '심사결과' 탭 (MUI-BD-10-M04 물품=Cmdty, 설계서 02입찰 slide169 / 데이터영역 slide170).
// 심사결과(dmt_srngRslt) 표 — "내 업체 정보만 표시". 데이터는 목업(추후 API: scwin.getImpltElgbSrngRsltDtlInfo).
// ⚠️ 물품(Cmdty) 라벨 기준(제조능력=srngScr2, 재무상태=srngScr4). 용역/공사 등 세부구분(M04~M19)은
//    이 목업/라벨만 교체하면 됨(구조 동일).
import { PageTitle } from '@/ui/common/base/PageTitle'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { ImpltElgbSrngResult } from '@/types/bd'

// 심사결과 목업 (설계서 slide169 값·slide170 항목명) — 추후 API 매핑.
const MOCK_RESULT: ImpltElgbSrngResult = {
  srngScr1: '00',
  srngScr2: '000',
  srngScr4: '0000',
  srngScr7: '9,800,000.00 원',
  srngScr5: '0000 0000',
  srngScr8: '0000 0000 0000',
  etc1: '0000 0000 0000',
  etc2: '0000 0000 0000',
  tscr: '00.00 점',
  jgmtRsltNm: '적격',
}

const resultRows = (it: ImpltElgbSrngResult): TableRow[] => [
  { label: '이행실적', value: it.srngScr1, type: 'number' },
  { label: '제조능력', value: it.srngScr2, type: 'number' },
  { label: '재무상태', value: it.srngScr4, type: 'number' },
  { label: '입찰가격', value: it.srngScr7, type: 'number' },
  { label: '신인도', value: it.srngScr5 },
  { label: '결격사유', value: it.srngScr8 },
  { label: '기타1', value: it.etc1 },
  { label: '기타2', value: it.etc2 },
  { label: '점수총계', value: it.tscr, type: 'number' },
  { label: '판정결과', value: it.jgmtRsltNm },
]

export function Implt() {
  return (
    <>
      <PageTitle as="h2">심사결과</PageTitle>
      <Accordion type="multiple" defaultValue={['result']} className="w-full">
        <AccordionSection value="result" title="심사결과" borderTop={false}>
          <Table rows={resultRows(MOCK_RESULT)} />
        </AccordionSection>
      </Accordion>
    </>
  )
}
Implt.displayName = 'Implt'
