// 입찰공고 상세 - '기초예비가격' 탭 (MUI-BD-01-T02(구 M08 — v1.83 재편), Figma 9300-41466).
// 설계서(02.입찰 v1.83) 근거:
//   slide32 — 총액제/단가제 화면 + 노출 조건(수의계약이면 탭 미노출 · 입찰참가자격 'Y' 일 경우 노출 — 컨테이너 제어).
//     업무구분 '물품/용역' × 계약유형 '총액제' → 낙찰하한율·확정비목비율·불확정비목비율 항목 노출.
//     업무구분 '물품/용역' × 계약유형 '단가제' → dlt_BrprcInfoItitb, 항목이 여러 개인 경우 하단으로 테이블 추가 노출.
//   slide33 — 업무구분 '공사' 표시 화면. 상단 '유의사항' 도움말(default 열림 · 닫힘 기능 필요) + dmt_BrprcInfo(공사).
//   slide34 — 기초예비가격(총액제) 데이터 영역(dmt_BrprcInfo) · 기초예비가격(단가제) 데이터 영역(dlt_BrprcInfoItitb).
//   slide35 — 기초예비가격(공사) 데이터 영역(dmt_BrprcInfo).
//   ※ slide32 'Tab 구성 정책' 표에는 공사 업무구분의 기초예비가격 탭이 비어 있으나 slide33 은 공사 화면을 정의 —
//     설계서 내 상충. 탭 노출은 컨테이너(BidPbancDtlPage)가 제어하므로 여기서는 세 변형 모두 데이터로 준비.
// 세 변형(총액제/단가제/공사)은 한 컴포넌트에서 variant 데이터 분기 — 현 목업 단계 대표 케이스는 총액제
// (일반정보 탭 목업의 단가제유형 '총액제' 와 일치). 데이터는 목업(추후 bdService.getDetail).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// ── 변형 구분 — 업무구분(물품·용역/공사) × 계약유형(총액제/단가제) 파생. ⚠️ 잠정 키(설계서에 영문 코드 미표기)
export type BidPbancBrprcVariant = 'totamt' | 'untpc' | 'cnstwk' // 총액제 | 단가제 | 공사

// ── 기초예비가격(총액제) — dmt_BrprcInfo (slide34 1.1) ─────────────────────────
interface BrprcInfoTotamt {
  /** 기초예비가격 (17,2) */
  brprc: string
  /** 사정율(%) 하단 (10,3) */
  assmLlmtRt: string
  /** 사정율(%) 상단 (9,4) — 낙찰하한율 0% 이상이면 "assmLlmtRt ~ brprcCmpttnScpRt" 로 표기(slide34 비고) */
  brprcCmpttnScpRt: string
  /** 낙찰하한율(%) (10,3) */
  scsbdLlmtRt: string
  /** 확정비목비율 (9,2) */
  cfmtnItmexpRt: string
  /** 불확정비목비율 (9,2) */
  indtmnItmexpRt: string
}

const TOTAMT_INFO: BrprcInfoTotamt = {
  brprc: '1,000,000,000 원',
  assmLlmtRt: '97.995 %',
  brprcCmpttnScpRt: '102.005 %',
  scsbdLlmtRt: '87.745 %',
  cfmtnItmexpRt: '-',
  indtmnItmexpRt: '-',
}

const TOTAMT_ROWS: TableRow[] = [
  { label: '기초예비가격', value: TOTAMT_INFO.brprc, type: 'number' },
  // 낙찰하한율이 0% 이상인 경우 "assmLlmtRt ~ brprcCmpttnScpRt" 범위 표기 (slide34 비고)
  {
    label: '사정율(%)',
    value: `${TOTAMT_INFO.assmLlmtRt} ~ ${TOTAMT_INFO.brprcCmpttnScpRt}`,
    type: 'number',
  },
  { label: '낙찰하한율(%)', value: TOTAMT_INFO.scsbdLlmtRt, type: 'number' },
  { label: '확정비목비율', value: TOTAMT_INFO.cfmtnItmexpRt },
  { label: '불확정비목비율', value: TOTAMT_INFO.indtmnItmexpRt },
]

// ── 기초예비가격(단가제) — dlt_BrprcInfoItitb (slide34 1.2) ────────────────────
interface BrprcInfoItitbItem {
  /** 항목번호 (3) */
  clsfNo: string
  /** 재고번호 (4) */
  fscCd: string
  /** 품명 (200) */
  itemNm: string
  /** 규격 (20) */
  spcfctNo: string
  /** 기초예비가격 (17,2) */
  brprc: string
  /** 사정율(%) (10,3) */
  assmLlmtRt: string
  /** 낙찰하한율(%) (10,3) */
  scsbdLlmtRt: string
}

const UNTPC_ITEMS: BrprcInfoItitbItem[] = [
  {
    clsfNo: '1',
    fscCd: '4240-3753116870',
    itemNm: '특수작전용대물타격무인항공기',
    spcfctNo: '-',
    brprc: '500,000,000 원',
    assmLlmtRt: '2.000 %',
    scsbdLlmtRt: '87.745 %',
  },
  {
    clsfNo: '2',
    fscCd: '4240-3753116871',
    itemNm: '무인항공기 지상통제장비',
    spcfctNo: '-',
    brprc: '250,000,000 원',
    assmLlmtRt: '2.000 %',
    scsbdLlmtRt: '87.745 %',
  },
]

function buildUntpcRows(item: BrprcInfoItitbItem): TableRow[] {
  return [
    { label: '항목번호', value: item.clsfNo, type: 'number' },
    { label: '재고번호', value: item.fscCd },
    { label: '품명', value: item.itemNm },
    { label: '규격', value: item.spcfctNo },
    { label: '기초예비가격', value: item.brprc, type: 'number' },
    { label: '사정율(%)', value: item.assmLlmtRt, type: 'number' },
    { label: '낙찰하한율(%)', value: item.scsbdLlmtRt, type: 'number' },
  ]
}

// ── 기초예비가격(공사) — dmt_BrprcInfo (slide35 1.3) ──────────────────────────
interface BrprcInfoCnstwk {
  /** 기초예비가격 (17,2) */
  brprc: string
  /** 하한(%) (9,4) */
  llmtAmtRt: string
  /** 상한(%) (9,4) */
  ulprcRt: string
  /** 낙찰하한율(%) (10,3) */
  scsbdLlmtRt: string
  /** 국민건강보험료 (15) */
  nthtIspm: string
  /** 국민연금보험료 (15) */
  npnIspm: string
  /** 평가기준금액 (17) */
  evlCrtrAmt: string
  /** 토목기초금액 (17) */
  pbwksBscsAmt: string
  /** 건축기초금액 (17) */
  archBscsAmt: string
  /** 노무기준율(%) (10,3) */
  lbcoStdrt: string
  /** 기타경비기준율(%) (10,3) */
  etcEpsStdrt: string
  /** 일반관리비기준비(%) (10,3) */
  gnadcoCrtrRt: string
  /** 이윤기준율(%) (10,3) */
  pfStdrt: string
  /** 적용난이도계수 (10,3) */
  aplcnLvdffCfc: string
  /** 요양보험료 (15) */
  rcprIspm: string
  /** 산업안전보건관리비 (15) */
  oshmco: string
  /** 퇴직급여충당금 (17) */
  rtrmSlryApamt: string
  /** 퇴직공제부금 (15) */
  rmcfe: string
  /** 안전관리비 (15) */
  sftyMnco: string
  /** 재료비 (15) */
  mtco: string
  /** 노무비 (15) */
  lbco: string
  /** 경비 (17) */
  gnadcoUseAmt: string
  /** 부가가치세 (17,2) */
  vatAmt: string
  /** 품질관리비 (15) */
  qltyMnco: string
}

const CNSTWK_INFO: BrprcInfoCnstwk = {
  brprc: '9,500,000,000 원',
  llmtAmtRt: '-2.0000 %',
  ulprcRt: '2.0000 %',
  scsbdLlmtRt: '-', // slide33 목업 표기 '-'
  nthtIspm: '120,000,000 원',
  npnIspm: '95,000,000 원',
  evlCrtrAmt: '9,300,000,000 원',
  pbwksBscsAmt: '5,200,000,000 원',
  archBscsAmt: '3,100,000,000 원',
  lbcoStdrt: '27.000 %',
  etcEpsStdrt: '5.500 %',
  gnadcoCrtrRt: '6.000 %',
  pfStdrt: '15.000 %',
  aplcnLvdffCfc: '-', // slide33 목업 표기 '-'
  rcprIspm: '12,000,000 원',
  oshmco: '86,000,000 원',
  rtrmSlryApamt: '54,000,000 원',
  rmcfe: '21,000,000 원',
  sftyMnco: '35,000,000 원',
  mtco: '3,800,000,000 원',
  lbco: '2,600,000,000 원',
  gnadcoUseAmt: '1,400,000,000 원',
  vatAmt: '863,000,000 원',
  qltyMnco: '48,000,000 원',
}

// 항목 순서 = slide33 목업(좌열 → 우열). 한글명은 slide35 데이터영역 표 기준(slide33 '무가가치세'·'노구기준율' 은 오탈자).
const CNSTWK_ROWS: TableRow[] = [
  { label: '기초예비가격', value: CNSTWK_INFO.brprc, type: 'number' },
  { label: '하한(%)', value: CNSTWK_INFO.llmtAmtRt, type: 'number' },
  { label: '상한(%)', value: CNSTWK_INFO.ulprcRt, type: 'number' },
  { label: '낙찰하한율(%)', value: CNSTWK_INFO.scsbdLlmtRt },
  { label: '국민건강보험료', value: CNSTWK_INFO.nthtIspm, type: 'number' },
  { label: '국민연금보험료', value: CNSTWK_INFO.npnIspm, type: 'number' },
  { label: '평가기준금액', value: CNSTWK_INFO.evlCrtrAmt, type: 'number' },
  { label: '토목기초금액', value: CNSTWK_INFO.pbwksBscsAmt, type: 'number' },
  { label: '건축기초금액', value: CNSTWK_INFO.archBscsAmt, type: 'number' },
  { label: '노무기준율(%)', value: CNSTWK_INFO.lbcoStdrt, type: 'number' },
  { label: '기타경비기준율(%)', value: CNSTWK_INFO.etcEpsStdrt, type: 'number' },
  { label: '일반관리비기준비(%)', value: CNSTWK_INFO.gnadcoCrtrRt, type: 'number' },
  { label: '이윤기준율(%)', value: CNSTWK_INFO.pfStdrt, type: 'number' },
  { label: '적용난이도계수', value: CNSTWK_INFO.aplcnLvdffCfc },
  { label: '요양보험료', value: CNSTWK_INFO.rcprIspm, type: 'number' },
  { label: '산업안전보건관리비', value: CNSTWK_INFO.oshmco, type: 'number' },
  { label: '퇴직급여충당금', value: CNSTWK_INFO.rtrmSlryApamt, type: 'number' },
  { label: '퇴직공제부금', value: CNSTWK_INFO.rmcfe, type: 'number' },
  { label: '안전관리비', value: CNSTWK_INFO.sftyMnco, type: 'number' },
  { label: '재료비', value: CNSTWK_INFO.mtco, type: 'number' },
  { label: '노무비', value: CNSTWK_INFO.lbco, type: 'number' },
  { label: '경비', value: CNSTWK_INFO.gnadcoUseAmt, type: 'number' },
  { label: '부가가치세', value: CNSTWK_INFO.vatAmt, type: 'number' },
  { label: '품질관리비', value: CNSTWK_INFO.qltyMnco, type: 'number' },
]

// 공사 화면 상단 도움말 (slide33 — default 열림 · 닫힘 기능 필요 → collapsible + defaultOpen)
const CNSTWK_NOTE =
  '기획재정부 계약예규 정부 입찰·계약 집행기준 제2조의5(순공사원가 기준 등의 공고) 및 적격심사기준 제7조(심사방법)에 따라 예정가격이 100억원 미만인 공사의 경우 예정가격 중 재료비·노무비·경비 및 이에 대한 부가가치세를 합산한 금액의 100분의 98미만으로 입찰한 자는 낙찰자로 결정하지 않습니다. 〈단서신설 ‘20.4.7.〉'

export interface BidPbancDtl_Tacpg02Props {
  /** 업무구분·계약유형 파생 변형. 목업 단계 기본값 = 총액제(일반정보 탭 목업과 일치). */
  variant?: BidPbancBrprcVariant
}

export function BidPbancDtl_Tacpg02({ variant = 'totamt' }: BidPbancDtl_Tacpg02Props) {
  return (
    <Accordion type="multiple" defaultValue={['brprc']} className="w-full">
      <AccordionSection value="brprc" title="기초예비가격" borderTop={false}>
        {variant === 'totamt' && <Table rows={TOTAMT_ROWS} />}

        {variant === 'untpc' && (
          // 단가제 — 항목이 여러 개인 경우 하단으로 테이블 추가 노출 (slide32)
          <div className="flex flex-col gap-krds-8">
            {UNTPC_ITEMS.map((item) => (
              <Table key={item.clsfNo} rows={buildUntpcRows(item)} />
            ))}
          </div>
        )}

        {variant === 'cnstwk' && (
          <>
            <Infobox title="유의사항" defaultOpen items={[CNSTWK_NOTE]} />
            <Table rows={CNSTWK_ROWS} />
          </>
        )}
      </AccordionSection>
    </Accordion>
  )
}
BidPbancDtl_Tacpg02.displayName = 'BidPbancDtl_Tacpg02'
