// 이행/적격심사결과 - '심사결과' 탭 (MUI-BD-10-T05 물품(구 M04 — v1.83 재편)=Cmdty, 설계서 02입찰 v1.83 slide173 / 데이터영역 slide174).
// 심사결과(dmt_srngRslt) 표 — "내 업체 정보만 표시". 데이터는 목업(추후 API: scwin.getImpltElgbSrngRsltDtlInfo).
// ⚠️ 물품(Cmdty) 표시 라벨 기준(제조능력=srngScr2, 재무상태=srngScr4, 기타1/2=etc1/etc2 — 데이터영역 밖 표시항목).
//    용역(T06)/공사(T17)/기술용역(T18) 등 A군 flat 유형은 라벨만 상이 → ImpltElgblRslt_* 별 파일. 유형 분기는 ImpltPage.renderResultTab.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { ImpltElgbSrngResult } from '@/types/mock/bd'

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
      <Accordion type="multiple" defaultValue={['result']} className="w-full">
        <AccordionSection value="result" title="심사결과" borderTop={false}>
          <Table rows={resultRows(MOCK_RESULT)} />
        </AccordionSection>
      </Accordion>
    </>
  )
}
Implt.displayName = 'Implt'
