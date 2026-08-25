// 업체정보 상세 - '국내소재상사' 탭 콘텐츠 (MUI-CM-01-T04, 설계서 slide127~128 / 문서 P126~127).
// 아코디언(영업정보·FSC Codes·법인/개인 구분·해외관련 업체정보) with 테이블 + 제출서류 안내(Infobox).
// ⚠️ 설계서에 T04 데이터영역(항목명 영문) 표가 없다 → 필드명은 화면 표기 기준 잠정 영문키(types/cm.ts DmsAgt* ⚠️).
//    API 연동 시 실제 데이터영역 매핑 확인 필요. 데이터는 목업(설계서 화면 예시값 그대로).
import type {
  MockDmsAgtSaleInfo,
  MockDmsAgtFscCode,
  MockDmsAgtCorpInfo,
  MockDmsAgtOvsBzenty,
} from '@/types/mock/cm'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// ── 영업정보 — 설계서 slide127 예시값 (⚠️ 잠정 영문키) ────────────────────────
const SALE_INFO: MockDmsAgtSaleInfo = {
  anlSaleAmt: 300000000,
  astScl: 0,
  lncLmt: 0,
  mnTrnsBankNm: '한국외환은행',
  brnchNm: '계동',
  mlsplyFrstPtcpYmd: '2020-01-01',
  trnsPrdFrom: '2020',
  trnsPrdTo: '2023',
  dunsNo: '123-45-67890',
}

// ── FSC Codes — 설계서 slide127 예시값 (⚠️ 잠정) ──────────────────────────────
const FSC_CODES: MockDmsAgtFscCode[] = [{ fscCd: '1111', gunGrdNm: '기타 항공기 부수품' }]

// ── 법인/개인 구분 — 설계서 slide127 예시값 (⚠️ 잠정 영문키) ──────────────────
const CORP_INFO: MockDmsAgtCorpInfo = {
  corpIndvSe: 'corp',
  corpRgstOrgnNm: '방위사업청',
  corpRgstYmd: '2020-01-01',
  corpRgstPrps: '개업',
  bzrnoRgstOrgnNm: '방위사업청',
  hdlItemNm: '무기',
  bzstatNm: '제조',
  scrtMsrUnitNm: '보안부대',
  scrtMsrYmd: '2020-01-01',
  scrtMsrScr: 90,
}

// ── 해외관련 업체정보 — 설계서 slide128 예시값 (⚠️ 잠정) ──────────────────────
const OVS_BZENTY_LIST: MockDmsAgtOvsBzenty[] = [
  { ovsBzentyCd: '1111', ovsBzentyNm: 'Test Corp', ovsNtnNm: '프랑스', ovsTelno: '+33-1-34-88-30-00' },
]

// 천원 단위 금액 표기 — 천단위 콤마 + ' 천원'.
const won1000 = (v: number) => `${v.toLocaleString()} 천원`

function saleRows(d: MockDmsAgtSaleInfo): TableRow[] {
  return [
    { label: '연간매출액', value: won1000(d.anlSaleAmt), type: 'number' },
    { label: '자산규모', value: won1000(d.astScl), type: 'number' },
    { label: '여신한도', value: won1000(d.lncLmt), type: 'number' },
    { label: '주거래은행', value: d.mnTrnsBankNm },
    { label: '지점', value: d.brnchNm },
    { label: '군납최초 참여일', value: d.mlsplyFrstPtcpYmd },
    { label: '거래기간(F)', value: d.trnsPrdFrom },
    { label: '거래기간(T)', value: d.trnsPrdTo },
    { label: "Dun's Number", value: d.dunsNo },
  ]
}

function fscRows(d: MockDmsAgtFscCode): TableRow[] {
  return [
    { label: 'FSC', value: d.fscCd },
    { label: '군급명', value: d.gunGrdNm },
  ]
}

function corpRows(d: MockDmsAgtCorpInfo): TableRow[] {
  return [
    { label: '법인/개인 구분', value: d.corpIndvSe === 'corp' ? '법인' : '개인' },
    { label: '법인등기기관', value: d.corpRgstOrgnNm },
    { label: '법인등기일자', value: d.corpRgstYmd },
    { label: '법인등기목적', value: d.corpRgstPrps },
    { label: '사업자등록기관', value: d.bzrnoRgstOrgnNm },
    { label: '취급품목', value: d.hdlItemNm },
    { label: '업태', value: d.bzstatNm },
    { label: '보안측정부대', value: d.scrtMsrUnitNm },
    { label: '보안측정일자', value: d.scrtMsrYmd },
    { label: '보안측정점수', value: String(d.scrtMsrScr), type: 'number' },
  ]
}

function ovsRows(d: MockDmsAgtOvsBzenty): TableRow[] {
  return [
    { label: '업체코드', value: d.ovsBzentyCd },
    { label: '업체명', value: d.ovsBzentyNm },
    { label: '국적', value: d.ovsNtnNm },
    { label: '전화번호', value: d.ovsTelno },
  ]
}

export function BzentyGnrlInfoDtl_DmsAgt() {
  return (
    <>
      <Accordion type="multiple" defaultValue={['sale', 'fsc', 'corp', 'ovs']} className="w-full">
        <AccordionSection value="corp" title="법인/개인 구분" borderTop={false}>
          <Table rows={corpRows(CORP_INFO)} />
        </AccordionSection>

        <AccordionSection value="fsc" title="FSC Codes (Federal Supply Classification Codes)">
          <div className="flex flex-col gap-krds-8">
            {FSC_CODES.map((f) => (
              <Table key={f.fscCd} rows={fscRows(f)} />
            ))}
          </div>
        </AccordionSection>

        <AccordionSection value="sale" title="영업정보">
          <Table rows={saleRows(SALE_INFO)} />
        </AccordionSection>

        <AccordionSection value="ovs" title="해외관련 업체정보">
          <div className="flex flex-col gap-krds-8">
            {OVS_BZENTY_LIST.map((o) => (
              <Table key={o.ovsBzentyCd} rows={ovsRows(o)} />
            ))}
          </div>
        </AccordionSection>
      </Accordion>

      {/* 국내소재상사 제출서류 안내 (설계서 slide128) — 하단 여백도 좌우(16px)와 동일하게. */}
      <div className="px-4 py-4">
        <Infobox title="국내소재상사 제출서류" collapsible={false} items={['보안측정결과서 - 1부']} />
      </div>
    </>
  )
}
BzentyGnrlInfoDtl_DmsAgt.displayName = 'BzentyGnrlInfoDtl_DmsAgt'
