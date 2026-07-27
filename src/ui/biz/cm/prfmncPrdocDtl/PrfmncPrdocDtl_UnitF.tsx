// 실적증명서 확인(상세) — 신청정보 탭 · unitF(T07, MUI-CM-04-T07). 계약구분 부대+시설공사.
// 제출유형 "7. 소방시설공사 실적증명서 [소방시설공사업법 시행에 관한 규정/소방시설협회]".
// 설계서 00.공통 v0.84 slide262~263(화면) · 항목 설명 slide280(1.20 신청인·1.21 공사내역)·
//   slide281(1.22 공사실적 금액)·slide282(1.23 복합공종 실적내용). 표/필드는 데이터 구동.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type {
  PrfmncPrdocAplcntInfo,
  PrfmncPrdocFrsvcCstrnDsctnInfo,
  PrfmncPrdocFrsvcCstrnPrfmncInfo,
} from '@/types/cm'

const twon = (v?: number) => (v == null ? '-' : `${v.toLocaleString()} 천원`)
const SBMSN_TYPE = '7. 소방시설공사 실적증명서 [소방시설공사업법 시행에 관한 규정/소방시설협회]'

// 복합공종(타 공종 포함) 실적내용 1행(dm_prfmncPrdocAplyMltCstrnInfo 1.23) — 파일 내부 로컬 타입.
interface MltCstrnRow {
  cstrnNm?: string // 공사(종)명
  ctrcAmt?: number // 도급금액
  prvyrPxcndAmt?: number // 전년도까지 기성액
  thsyrPxcndAmt?: number // 금년도 기성액
  nestblAmt?: number // 미기성액
}

// ── 목업 (설계서 표시값 그대로 — API 연동 시 교체) ───────────────────────────
const APLCNT: PrfmncPrdocAplcntInfo = {
  bzentyNm: 'A 업체',
  rprsvNm: '홍길동',
  entlno: '02-1234-5678',
  lctnAddr: '서울특별시 종로구…',
}

const CSTRN: PrfmncPrdocFrsvcCstrnDsctnInfo = {
  cstrnNm: '공사 명칭 표시 영역',
  tpbizNm: '업종 표시영역',
  cstrnGrndsAddr: '경기도 과천시… 정부청사',
  cstrnRgnNm: '방위사업청',
  orderInstNm: '방위사업청',
  orgctrNm: '군부대',
  ctrtYmd: '2010-01-01',
  bgncstYmd: '2012-01-01',
  cmcnYmd: '2012-01-01',
  ctrtMthdNm: '제한경쟁',
  ctrcKndNm: '원도급',
  cstrnKndNm: '경보설비',
}

const PRFMNC: PrfmncPrdocFrsvcCstrnPrfmncInfo = {
  ctrcTctrtAmt: 1000,
  thyrCtrtAmt: 1000,
  thyrPxcndAmt: 1000,
  thyrNestblAmt: 1000,
  prvyrPxcndActotAmt: 1000,
  prvyrNestblAmt: 1000,
  sbctrBzentyNm: 'A 업체',
  sbctrRegNo: '123456-7890123',
  sbctrAmt: 1000,
}

const MLT_ROWS: MltCstrnRow[] = [
  { cstrnNm: 'A 업체', ctrcAmt: 1000, prvyrPxcndAmt: 1000, thsyrPxcndAmt: 1000, nestblAmt: 1000 },
]

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
  { label: '전화번호', value: APLCNT.entlno ?? '-' },
  { label: '영업소 소재지', value: APLCNT.lctnAddr ?? '-' },
]

const CSTRN_ROWS: TableRow[] = [
  { label: '공사명', value: CSTRN.cstrnNm ?? '-' },
  { label: '업종', value: CSTRN.tpbizNm ?? '-' },
  { label: '공사현장', value: CSTRN.cstrnGrndsAddr ?? '-' },
  { label: '공사지역', value: CSTRN.cstrnRgnNm ?? '-' },
  { label: '발주자', value: CSTRN.orderInstNm ?? '-' },
  { label: '원도급자', value: CSTRN.orgctrNm ?? '-' },
  { label: '계약체결일', value: CSTRN.ctrtYmd ?? '-' },
  { label: '착공일', value: CSTRN.bgncstYmd ?? '-' },
  { label: '준공일', value: CSTRN.cmcnYmd ?? '-' },
  { label: '계약방법', value: CSTRN.ctrtMthdNm ?? '-' },
  { label: '도급종류', value: CSTRN.ctrcKndNm ?? '-' },
  { label: '공사종류', value: CSTRN.cstrnKndNm ?? '-' },
]

// 소방시설 공사실적 금액(단위: 천원, 부가세포함)
const PRFMNC_ROWS: TableRow[] = [
  { label: '총 도급계약금액', value: twon(PRFMNC.ctrcTctrtAmt), type: 'number' },
  { label: '해당연도 계약액', value: twon(PRFMNC.thyrCtrtAmt), type: 'number' },
  { label: '해당연도 기성액', value: twon(PRFMNC.thyrPxcndAmt), type: 'number' },
  { label: '해당연도 미기성액', value: twon(PRFMNC.thyrNestblAmt), type: 'number' },
  { label: '전년까지의 누계 기성액', value: twon(PRFMNC.prvyrPxcndActotAmt), type: 'number' },
  { label: '전년까지의 미기성액', value: twon(PRFMNC.prvyrNestblAmt), type: 'number' },
  { label: '하도급 업체명', value: PRFMNC.sbctrBzentyNm ?? '-' },
  { label: '하도급 등록번호', value: PRFMNC.sbctrRegNo ?? '-' },
  { label: '하도급 금액', value: twon(PRFMNC.sbctrAmt), type: 'number' },
]

export function PrfmncPrdocDtl_UnitF() {
  return (
    <div className="flex w-full flex-col pb-6">
      <Accordion type="multiple" defaultValue={['aply', 'aplcnt', 'cstrn', 'prfmnc']}>
        <AccordionSection value="aply" title="신청정보" borderTop={false}>
          <Table rows={APLY_ROWS} />
        </AccordionSection>
        <AccordionSection value="aplcnt" title="신청인">
          <Table rows={APLCNT_ROWS} />
        </AccordionSection>
        <AccordionSection value="cstrn" title="소방시설 공사내역">
          <Table rows={CSTRN_ROWS} />
        </AccordionSection>
        <AccordionSection value="prfmnc" title="소방시설 공사실적 금액 (단위: 천원, 부가세포함)">
          <Table rows={PRFMNC_ROWS} />
        </AccordionSection>
      </Accordion>

      {/* 복합공종(타 공종 포함) 실적내용 — 공사(종)명별 반복(단위: 천원, 부가세포함) */}
      <Accordion type="multiple" defaultValue={MLT_ROWS.map((_, i) => `mlt-${i}`)}>
        {MLT_ROWS.map((r, i) => (
          <AccordionSection
            key={`mlt-${i}`}
            value={`mlt-${i}`}
            title={`복합공종 실적내용 : ${r.cstrnNm ?? '-'}`}
          >
            <Table
              rows={[
                { label: '도급금액', value: twon(r.ctrcAmt), type: 'number' },
                { label: '전년도까지 기성액', value: twon(r.prvyrPxcndAmt), type: 'number' },
                { label: '금년도 기성액', value: twon(r.thsyrPxcndAmt), type: 'number' },
                { label: '미기성액', value: twon(r.nestblAmt), type: 'number' },
              ]}
            />
          </AccordionSection>
        ))}
      </Accordion>
    </div>
  )
}
PrfmncPrdocDtl_UnitF.displayName = 'PrfmncPrdocDtl_UnitF'
