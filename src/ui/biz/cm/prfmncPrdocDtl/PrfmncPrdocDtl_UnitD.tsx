// 실적증명서 확인(상세) — 신청정보 탭 · unitD(T05, MUI-CM-04-T05). 계약구분 부대+시설공사.
// 제출유형 "4. 건설폐기물처리용역이행 실적증명서 [건설폐기물처리용역 적격업체 평가기준/환경부]".
// 설계서 00.공통 v0.84 slide259~260(화면) · 항목 설명 slide278(1.15 신청인·1.16 수집운반·1.17 중간처리).
// 표/필드는 데이터 구동. 제출유형에 따라 하단 표시 정보 변경(신청도 동일) — API 연동 시 반영.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type {
  PrfmncPrdocAplcntInfo,
  PrfmncPrdocClctCnvncInfo,
  PrfmncPrdocMdPrcsLbsvcInfo,
} from '@/types/mock/cm'

// 계약금액·기성실적 단위는 설계서 표기 그대로 천원
const twon = (v?: number) => (v == null ? '-' : `${v.toLocaleString()} 천원`)
const SBMSN_TYPE =
  '4. 건설폐기물처리용역이행 실적증명서 [건설폐기물처리용역 적격업체 평가기준/환경부]'

// ── 목업 (설계서 표시값 그대로 — API 연동 시 교체) ───────────────────────────
const APLCNT: PrfmncPrdocAplcntInfo = {
  bzentyNm: 'A 업체',
  lcnsNoVl: '11111 11111',
  rprsvNm: '홍길동',
  lctnAddr: '서울특별시 종로구…',
  prdocUsgCn: '은행 제출용',
}

const CLCT: PrfmncPrdocClctCnvncInfo = {
  clctCnvncLbsvcNm: '국방 건설',
  clctCnvncCtrtYmd: '2010-01-10',
  clctCnvncCtrtBgngYmd: '2012-01-10',
  clctCnvncCndspKndNm: '건전지',
  clctCnvncCnsgnQtyCn: '10 톤',
  clctCnvncCtrtAmt: 10000,
  clctCnvncPxcndPrfmncAmt: undefined,
  clctCnvncRmrkCn: '-',
}

const MDPRCS: PrfmncPrdocMdPrcsLbsvcInfo = {
  mdPrcsLbsvcNm: '국방 건설',
  mdPrcsCtrtYmd: '2010-01-10',
  mdPrcsCtprCn: '2012-01-10',
  mdPrcsCndspKndNm: '건전지',
  mdPrcsCnSgnQtyCn: '10 톤',
  mdPrcsCtrtAmt: 10000,
  mdPrcsPxCndPrfmncAmt: undefined,
  mdPrcsRmrkCn: '-',
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
  { label: '허가번호', value: APLCNT.lcnsNoVl ?? '-' },
  { label: '대표자', value: APLCNT.rprsvNm ?? '-' },
  { label: '소재지', value: APLCNT.lctnAddr ?? '-' },
  { label: '증명서용도', value: APLCNT.prdocUsgCn ?? '-' },
]

const CLCT_ROWS: TableRow[] = [
  { label: '용역명', value: CLCT.clctCnvncLbsvcNm ?? '-' },
  { label: '계약일자', value: CLCT.clctCnvncCtrtYmd ?? '-' },
  { label: '계약기간', value: CLCT.clctCnvncCtrtBgngYmd ?? '-' },
  { label: '건설폐기물의 종류', value: CLCT.clctCnvncCndspKndNm ?? '-' },
  { label: '위탁량(톤)', value: CLCT.clctCnvncCnsgnQtyCn ?? '-' },
  { label: '계약금액', value: twon(CLCT.clctCnvncCtrtAmt), type: 'number' },
  { label: '기성실적', value: twon(CLCT.clctCnvncPxcndPrfmncAmt), type: 'number' },
  { label: '비고', value: CLCT.clctCnvncRmrkCn ?? '-' },
]

const MDPRCS_ROWS: TableRow[] = [
  { label: '용역명', value: MDPRCS.mdPrcsLbsvcNm ?? '-' },
  { label: '계약일자', value: MDPRCS.mdPrcsCtrtYmd ?? '-' },
  { label: '계약기간', value: MDPRCS.mdPrcsCtprCn ?? '-' },
  { label: '건설폐기물의 종류', value: MDPRCS.mdPrcsCndspKndNm ?? '-' },
  { label: '위탁량(톤)', value: MDPRCS.mdPrcsCnSgnQtyCn ?? '-' },
  { label: '계약금액', value: twon(MDPRCS.mdPrcsCtrtAmt), type: 'number' },
  { label: '기성실적', value: twon(MDPRCS.mdPrcsPxCndPrfmncAmt), type: 'number' },
  { label: '비고', value: MDPRCS.mdPrcsRmrkCn ?? '-' },
]

export function PrfmncPrdocDtl_UnitD() {
  return (
    <div className="flex w-full flex-col pb-6">
      <Accordion type="multiple" defaultValue={['aply', 'aplcnt', 'clct', 'mdprcs']}>
        <AccordionSection value="aply" title="신청정보" borderTop={false}>
          <Table rows={APLY_ROWS} />
        </AccordionSection>
        <AccordionSection value="aplcnt" title="신청인">
          <Table rows={APLCNT_ROWS} />
        </AccordionSection>
        <AccordionSection value="clct" title="건설폐기물 수집/운반용역 이행실적">
          <Table rows={CLCT_ROWS} />
        </AccordionSection>
        <AccordionSection value="mdprcs" title="건설폐기물 중간처리용역 이행실적">
          <Table rows={MDPRCS_ROWS} />
        </AccordionSection>
      </Accordion>
    </div>
  )
}
PrfmncPrdocDtl_UnitD.displayName = 'PrfmncPrdocDtl_UnitD'
