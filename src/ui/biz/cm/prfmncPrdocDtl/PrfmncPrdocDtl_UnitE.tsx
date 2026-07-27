// 실적증명서 확인(상세) — 신청정보 탭 · unitE(T06, MUI-CM-04-T06). 계약구분 부대+시설공사.
// 제출유형 "6. 정보통신공사 실적증명서 [정보통신공사업법 시행에 관한 규정/전기공제조합]".
// 설계서 00.공통 v0.84 slide261(화면) · 항목 설명 slide279(1.18 신청인·1.19 공사내역).
// 표/필드는 데이터 구동. 제출유형에 따라 하단 표시 정보 변경(신청도 동일) — API 연동 시 반영.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { PrfmncPrdocAplcntInfo, PrfmncPrdocCstrnDsctnInfoE } from '@/types/cm'

const twon = (v?: number) => (v == null ? '-' : `${v.toLocaleString()} 천원`)
const SBMSN_TYPE = '6. 정보통신공사 실적증명서 [정보통신공사업법 시행에 관한 규정/전기공제조합]'

// ── 목업 (설계서 표시값 그대로 — API 연동 시 교체) ───────────────────────────
const APLCNT: PrfmncPrdocAplcntInfo = {
  bzentyNm: 'A 업체',
  rprsvNm: '홍길동',
  salsLctnAddr: '서울특별시 종로구…',
  lcnsNoVl: '123456-7890123',
}

const CSTRN: PrfmncPrdocCstrnDsctnInfoE = {
  cstrnNm: '공사 명칭 표시 영역',
  ctrtYmd: '2010-01',
  bgncstYmd: '2012-01',
  cmcnYmd: '2012-01',
  prvyrPxcndActotAmt: 10000,
  tctrtAmt: 10000,
  thyrPxcndAmt: 10000,
  prvyrGiveActotAmt: 10000,
  thyrPxcndGiveAmt: 10000,
}

const APLY_ROWS: TableRow[] = [
  {
    label: '제출유형',
    value: <span className="whitespace-pre-wrap">{SBMSN_TYPE}</span>,
    type: 'combination',
  },
  { label: '신청인 연락처', value: '02-1234-5678' },
  { label: '제출처', value: '방위사업청' },
  { label: '발급수량', value: '1부' },
]

const APLCNT_ROWS: TableRow[] = [
  { label: '상호', value: APLCNT.bzentyNm ?? '-' },
  { label: '대표자', value: APLCNT.rprsvNm ?? '-' },
  { label: '소재지', value: APLCNT.salsLctnAddr ?? '-' },
  { label: '등록번호', value: APLCNT.lcnsNoVl ?? '-' },
]

const CSTRN_ROWS: TableRow[] = [
  { label: '공사명', value: CSTRN.cstrnNm ?? '-' },
  { label: '계약연월', value: CSTRN.ctrtYmd ?? '-' },
  { label: '착공연월', value: CSTRN.bgncstYmd ?? '-' },
  { label: '준공연월', value: CSTRN.cmcnYmd ?? '-' },
  { label: '전년도 이월공사액', value: twon(CSTRN.prvyrPxcndActotAmt), type: 'number' },
  { label: '당년도 계약액', value: twon(CSTRN.tctrtAmt), type: 'number' },
  { label: '당년도 기성액', value: twon(CSTRN.thyrPxcndAmt), type: 'number' },
  { label: '당년도 미기성액', value: twon(CSTRN.prvyrGiveActotAmt), type: 'number' },
  { label: '하도급금액', value: twon(CSTRN.thyrPxcndGiveAmt), type: 'number' },
]

export function PrfmncPrdocDtl_UnitE() {
  return (
    <div className="flex w-full flex-col pb-6">
      <Accordion type="multiple" defaultValue={['aply', 'aplcnt', 'cstrn']}>
        <AccordionSection value="aply" title="신청정보" borderTop={false}>
          <Table rows={APLY_ROWS} />
        </AccordionSection>
        <AccordionSection value="aplcnt" title="신청인">
          <Table rows={APLCNT_ROWS} />
        </AccordionSection>
        <AccordionSection value="cstrn" title="공사내역">
          <Table rows={CSTRN_ROWS} />
        </AccordionSection>
      </Accordion>
    </div>
  )
}
PrfmncPrdocDtl_UnitE.displayName = 'PrfmncPrdocDtl_UnitE'
