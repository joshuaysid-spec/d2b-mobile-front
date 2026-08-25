// 실적증명서 확인(상세) — 신청정보 탭 · unitG(T08, MUI-CM-04-T08). 계약구분 부대+시설공사.
// 제출유형 "8. 전기공사 실적증명서 [전기공사업법 시행에 관한 규정/전기공사협회]".
// 설계서 00.공통 v0.84 slide264~266(화면) · 항목 설명 slide283(1.24 신청인·1.25 전기공사내역)·
//   slide284(1.26 실적금액·1.27 하도급·1.28 시공규모)·slide285~287(1.29 복합공사종류 실적명세).
// 표/필드는 데이터 구동. 3개 업체 이상이면 "○○ 외 ○개 업체"로 표기 후 합산(도움말, slide265).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type {
  PrfmncPrdocAplcntInfo,
  PrfmncPrdocEltyCstrnDsctnInfo,
  PrfmncPrdocEltyCstrnPrfmncInfo,
  PrfmncPrdocSbctrDsctnInfo,
  PrfmncPrdocCnstSclInfo,
  PrfmncPrdocMltCstrnRow,
} from '@/types/mock/cm'

const twon = (v?: number) => (v == null ? '-' : `${v.toLocaleString()} 천원`)
const SBMSN_TYPE = '8. 전기공사 실적증명서 [전기공사업법 시행에 관한 규정/전기공사협회]'

// ── 목업 (설계서 표시값 그대로 — API 연동 시 교체) ───────────────────────────
const APLCNT: PrfmncPrdocAplcntInfo = {
  bzentyNm: 'A 업체',
  rprsvNm: '홍길동',
  entlno: '02-1234-5678',
  lctnAddr: '서울특별시 종로구…',
  bldrRegNo: '11111',
}

const CSTRN: PrfmncPrdocEltyCstrnDsctnInfo = {
  cstrnNm: '공사 명칭 표시 영역',
  cstrnKndNm: '발전설비',
  cstrnGrndsNm: '경기도 과천시…',
  orgctrNm: '김길동 주무관',
  orderIntstNm: '방위사업청',
  orgctrRegNo: '111111',
  ctrtYmd: '2010-01-01',
  bgncstYmd8: '2012-01-01',
  cmcnYmd: '2012-01-01',
  prfmncYr: '2023',
  ctrtMthdNm: '일반경쟁입찰',
  ctrcKndNm: '원도급',
}

const PRFMNC: PrfmncPrdocEltyCstrnPrfmncInfo = {
  ctrcTctrtAmt: 1000,
  prvyrCrfwAmt: 1000,
  thyrPxcndAmt: 1000,
  sbctrAmt: 1000,
  thyrNestblAmt: 1000,
  gvspMtrlAmt: 1000,
  prvyrPxcndActotAmt: 1000,
  etcCstrnKndPxcndAmt: 1000,
  thyrCtrtAmt: 1000,
}

const SBCTR: PrfmncPrdocSbctrDsctnInfo[] = [
  { sbctrBzentyNm: 'A 업체', sbctrAmt: 1000, sbctrRegNo: '11111', sbctrRprsvNm: '홍길동' },
]

const CNST_SCL: PrfmncPrdocCnstSclInfo = {
  cnstSclExpln: '내용 표시 영역은 내용에 맞춰 높이를 조정하여 표시',
}

// 복합공사종류(다른 공사 종류 포함) 실적 명세 — 공사(종)명 반복(단위: 천원, 부가세포함)
const MLT_ROWS: PrfmncPrdocMltCstrnRow[] = [
  {
    cstrnKndNm: '전기공사',
    ctrtAmt: 1000,
    bgncstYmd: '2020-01-10',
    cmcnYmd: '2020-01-10',
    prvyrPxcndAmt: 1000,
    thyrPxcndAmt: 1000,
    sbctrAmt: 1000,
    nestblAmt: 1000,
  },
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
  { label: '등록번호', value: APLCNT.bldrRegNo ?? '-' },
]

const CSTRN_ROWS: TableRow[] = [
  { label: '공사명', value: CSTRN.cstrnNm ?? '-' },
  { label: '공사종류', value: CSTRN.cstrnKndNm ?? '-' },
  { label: '공사현장', value: CSTRN.cstrnGrndsNm ?? '-' },
  { label: '원도급자', value: CSTRN.orgctrNm ?? '-' },
  { label: '발주자', value: CSTRN.orderIntstNm ?? '-' },
  { label: '등록번호(원도급자)', value: CSTRN.orgctrRegNo ?? '-' },
  { label: '계약체결일자', value: CSTRN.ctrtYmd ?? '-' },
  { label: '착공일자', value: CSTRN.bgncstYmd8 ?? '-' },
  { label: '준공일자', value: CSTRN.cmcnYmd ?? '-' },
  { label: '실적년도', value: CSTRN.prfmncYr ?? '-' },
  { label: '계약방법', value: CSTRN.ctrtMthdNm ?? '-' },
  { label: '도급종류', value: CSTRN.ctrcKndNm ?? '-' },
]

const PRFMNC_ROWS: TableRow[] = [
  { label: '총 도급계약금액', value: twon(PRFMNC.ctrcTctrtAmt), type: 'number' },
  { label: '전년도 이월액', value: twon(PRFMNC.prvyrCrfwAmt), type: 'number' },
  { label: '해당연도 기성액', value: twon(PRFMNC.thyrPxcndAmt), type: 'number' },
  { label: '하도급 금액', value: twon(PRFMNC.sbctrAmt), type: 'number' },
  { label: '미기성액', value: twon(PRFMNC.thyrNestblAmt), type: 'number' },
  { label: '관급자재액', value: twon(PRFMNC.gvspMtrlAmt), type: 'number' },
  { label: '전년까지의 누계 기성액', value: twon(PRFMNC.prvyrPxcndActotAmt), type: 'number' },
  { label: '기성액(다른공사포함)', value: twon(PRFMNC.etcCstrnKndPxcndAmt), type: 'number' },
  { label: '계약액(추가 또는 변경분)', value: twon(PRFMNC.thyrCtrtAmt), type: 'number' },
]

export function PrfmncPrdocDtl_UnitG() {
  return (
    <div className="flex w-full flex-col pb-6">
      <Accordion type="multiple" defaultValue={['aply', 'aplcnt', 'cstrn', 'prfmnc', 'sbctr']}>
        <AccordionSection value="aply" title="신청정보" borderTop={false}>
          <Table rows={APLY_ROWS} />
        </AccordionSection>
        <AccordionSection value="aplcnt" title="신청인">
          <Table rows={APLCNT_ROWS} />
        </AccordionSection>
        <AccordionSection value="cstrn" title="전기 공사 내역">
          <Table rows={CSTRN_ROWS} />
        </AccordionSection>
        <AccordionSection value="prfmnc" title="전기공사실적 금액 (단위: 천원, 부가세포함)">
          <Table rows={PRFMNC_ROWS} />
        </AccordionSection>

        {/* 하도급내역(원도급자가 작성) — 정보 없으면 숨김 */}
        {SBCTR.map((s, i) => (
          <AccordionSection
            key={`sbctr-${i}`}
            value={`sbctr-${i}`}
            title={`하도급내역 : ${s.sbctrBzentyNm ?? '-'}`}
          >
            <Table
              rows={[
                { label: '하도급업체명', value: s.sbctrBzentyNm ?? '-' },
                { label: '하도금액', value: twon(s.sbctrAmt), type: 'number' },
                { label: '등록번호', value: s.sbctrRegNo ?? '-' },
                { label: '대표자', value: s.sbctrRprsvNm ?? '-' },
              ]}
            />
          </AccordionSection>
        ))}

        {/* 복합공사종류(다른 공사 종류 포함) 실적 명세 — 공사(종)명별 반복 */}
        {MLT_ROWS.map((r, i) => (
          <AccordionSection
            key={`mlt-${i}`}
            value={`mlt-${i}`}
            title={`복합공사종류 실적 명세 : ${r.cstrnKndNm ?? '-'}`}
          >
            <Table
              rows={[
                { label: '계약액', value: twon(r.ctrtAmt), type: 'number' },
                { label: '착공연월일', value: r.bgncstYmd ?? '-' },
                { label: '준공연월일', value: r.cmcnYmd ?? '-' },
                { label: '지난연도 기성액', value: twon(r.prvyrPxcndAmt), type: 'number' },
                { label: '해당연도 기성액', value: twon(r.thyrPxcndAmt), type: 'number' },
                { label: '하도급금액', value: twon(r.sbctrAmt), type: 'number' },
                { label: '미기성금액', value: twon(r.nestblAmt), type: 'number' },
              ]}
            />
          </AccordionSection>
        ))}
      </Accordion>

      {/* 시공규모 — 내용에 맞춰 높이 조정(정보 없으면 숨김) */}
      {CNST_SCL.cnstSclExpln && (
        <div className="flex flex-col gap-2 border-t border-krds-border-divider px-krds-8 py-krds-7">
          <p className="text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
            시공규모
          </p>
          <div className="whitespace-pre-wrap rounded-krds-8 border border-krds-border-field px-krds-7 py-krds-5 text-[17px] leading-normal text-krds-text-ink">
            {CNST_SCL.cnstSclExpln}
          </div>
        </div>
      )}
    </div>
  )
}
PrfmncPrdocDtl_UnitG.displayName = 'PrfmncPrdocDtl_UnitG'
