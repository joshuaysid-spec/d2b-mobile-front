// 실적증명서 확인(상세) — 신청정보 탭 · 계약구분 부대+시설공사(unitB) (MUI-CM-04-T03).
// 설계서 00.공통 v0.84 slide246~250 · 항목 설명 slide266~270. 표/필드는 데이터 구동.
//
// 구성(2026-07-20 사용자 확정 순서 + 공동도급 여부 재추가):
//   신청정보 → 시공자(대표) → 계약 및 준공(총공사) → 계약 및 준공(금차공사) → 공사성질 →
//   공동도급 여부 → 실적의 종류 → 시공자 (대표)/1/2 → 텍스트 영역 5종(전체공사 시공규모 ·
//   시공회사별 실적공종 시공규모,방법 · 금액 · 준공금액 · 관급금액) → 하도급자 ×3 →
//   실적증명 발급일 기준 시공내용 → 최저가 적정성심사관련 시공실적자료.
//   공사성질/공동도급 여부/실적의 종류는 설계서 목업(slide247)대로 사각 체크박스(base Checkbox
//   variant="box" — AgreementList 와 동일 모양, 읽기전용 disabled)로 재현. 값은 콤마 조합
//   문자열을 배열로 변환(toChecked).
//
// 제출유형(unitB): 1.시공실적증명서 / 2.시공실적(기성율)증명서 / 5.실적자료 발주기관 확인서.
// 제출유형별 표기 변경 규칙(slide246·248~249 — API 연동 시 반영, 목업은 유형 1 기준):
//   - [5] 준공일자→준공예정일자, 중공(준공)금액→계약금액, 관급금액→도급자설치 관급금액
//   - [1] 전체공사 시공규모 / [2] 전체공사 계약규모
//   - 텍스트 영역·하도급 섹션은 유형별 노출 다름. "정보가 없는 경우 빈칸을 노출하지 않고 숨김".
import type { ReactNode } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Checkbox } from '@/ui/common/base/Checkbox'
import type { CheckboxGroupItem } from '@/ui/common/composites/CheckboxGroup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type {
  PrfmncPrdocAplyInptInfo,
  PrfmncPrdocAplyWholCstrnInfo,
  PrfmncPrdocAplyCstrnInfo,
  PrfmncPrdocAplyRprsInfo,
  PrfmncPrdocAplyCstrnTypeInfo,
  PrfmncPrdocAplyJntCtrcInfo,
  PrfmncPrdocAplyPrfmncTypeInfo,
  PrfmncPrdocAplySbctrInfo,
  PrfmncPrdocAplyLwprcInfo,
} from '@/types/mock/cm'

const won = (v?: number) => (v == null ? '-' : `${v.toLocaleString()} 원`)

// ── 목업 (설계서 표시값 그대로 — API 연동 시 교체) ───────────────────────────
// 제출유형 — 영문 항목명이 설계서(항목 설명)에 미정의(화면에만 존재) → 도메인 타입에 넣지 않고
// 로컬 상수로 표기. 항목명 확정 시 types/cm.ts 에 추가하고 교체할 것.
const SBMSN_TYPE = '1. 시공실적증명서 [군시설공사 적격심사기준에 관한 훈령/국방부]'

const APLY_INPT: PrfmncPrdocAplyInptInfo = {
  entlno: '02-1234-5678',
  dmndQty: '1',
  submOrgn: '방위사업청',
  usePrpsCd: '기타',
}

const RPRS_INFO: PrfmncPrdocAplyRprsInfo = {
  bzentyNm: 'A 업체',
  lcnsNoVl: '123456-7890123',
  rprsvNm: '홍길동',
  telno: '02-1234-5678',
  salsLctnAddr: '서울특별시 종로구…',
}

const WHOL_CSTRN: PrfmncPrdocAplyWholCstrnInfo = {
  ctrtYmd: '2016-01-02',
  bgncstYmd: '2016-01-02',
  cmcnYmd: '2016-01-02',
  cstrnAmt: 10000000,
  cmcnAmt: 5000000,
  gvspAmt: 5000000,
}

const CSTRN_INFO: PrfmncPrdocAplyCstrnInfo = {
  ctrtYmd2: '2016-01-02',
  bgncstYmd2: '2016-01-02',
  cmcnYmd2: '2016-01-02',
  cstrnAmt2: 10000000,
  cmcnAmt2: 5000000,
  gvspAmt2: 5000000,
}

const CSTRN_TYPE: PrfmncPrdocAplyCstrnTypeInfo = {
  cnstrDivs: '신규공사',
  eltyDivs: '신규공사',
}

const JNT_CTRC: PrfmncPrdocAplyJntCtrcInfo = {
  jntCtrcCd: '공동이행방식',
}

// ── 체크박스 옵션 (slide247 목업 그대로 — 다중 선택 값은 콤마 조합 문자열 가정) ──
// 공사성질 · 건설공사(cnstrDivs = cnstrNewCstrnYn/cnstrExpnCstrnYn/cnstrRmdlCstrnYn)
const CNSTR_DIVS_ITEMS: CheckboxGroupItem[] = [
  { value: '신규공사', label: '신규공사' },
  { value: '확장공사', label: '확장공사' },
  { value: '개보수공사', label: '개보수공사' },
]
// 공사성질 · 전기/그 밖의(eltyDivs = eltyNewCstrnYn/…/eltyRprwrkYn)
const ELTY_DIVS_ITEMS: CheckboxGroupItem[] = [
  { value: '신규공사', label: '신규공사' },
  { value: '증설공사', label: '증설공사' },
  { value: '이설공사', label: '이설공사' },
  { value: '개설공사', label: '개설공사' },
  { value: '보수공사', label: '보수공사' },
]
// 공동도급 여부(jntCtrcCd — 단일 값)
const JNT_CTRC_ITEMS: CheckboxGroupItem[] = [
  { value: '공동이행방식', label: '공동이행방식' },
  { value: '분담이행방식', label: '분담이행방식' },
  { value: '단독도급', label: '단독도급' },
]
// 실적의 종류(rsltDivs = prfmncCncptDesignYn/…/prfmncEtcYn 다중)
const RSLT_DIVS_ITEMS: CheckboxGroupItem[] = [
  { value: '개념설계', label: '개념설계' },
  { value: '기본설계', label: '기본설계' },
  { value: '실시설계', label: '실시설계' },
  { value: '시공', label: '시공' },
  { value: '감리', label: '감리' },
  { value: '품질, 공사관리', label: '품질, 공사관리' },
  { value: '시운전', label: '시운전' },
  { value: '기자재제작설치', label: '기자재제작설치' },
  { value: '기자재설치', label: '기자재설치' },
  { value: '기타', label: '기타' },
]

// 콤마 조합 문자열 → 체크값 배열 (읽기전용 표시용)
const toChecked = (v?: string) => (v ? v.split(',').map((s) => s.trim()) : [])

// 읽기전용 체크박스 목록 — AgreementList 와 동일한 사각 체크박스(base Checkbox variant="box").
// 상세(확인) 화면이라 disabled 로 값만 표시.
function CheckList({ items, checked }: { items: CheckboxGroupItem[]; checked: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {items.map((it) => (
        <Checkbox
          key={it.value}
          variant="box"
          label={it.label}
          checked={checked.includes(it.value)}
          disabled
        />
      ))}
    </div>
  )
}

// 실적의 종류 + 텍스트 영역(dm_prfmncPrdocAplyprfmncTypeInfo).
// 텍스트 영역 값은 목업 placeholder — "내용 표시 영역은 내용에 맞춰 높이를 조정하여 표시"(설계서).
const PRFMNC_TYPE: PrfmncPrdocAplyPrfmncTypeInfo = {
  rsltDivs: '시공',
  wholCstrnCnstSclExpln: '내용 표시 영역은 내용에 맞춰 높이를 조정하여 표시',
  cnstBcoSclMthdCn: '내용 표시 영역은 내용에 맞춰 높이를 조정하여 표시',
  cnstBcoCnstAmtCn: '내용 표시 영역은 내용에 맞춰 높이를 조정하여 표시',
  cnstBcoCmcnAmtCn: '내용 표시 영역은 내용에 맞춰 높이를 조정하여 표시',
  cnstBcoGvspAmtCn: '내용 표시 영역은 내용에 맞춰 높이를 조정하여 표시',
}

// 실적증명 발급일 기준 시공내용 — 항목명은 설계서가 cnstBcoGvspAmtCn 으로 중복 정의(오기 추정,
// slide269 1.11). 확정 시 별도 항목명으로 교체.
const CNST_CN_ON_ISSUE_DT = '내용 표시 영역은 내용에 맞춰 높이를 조정하여 표시'

// 시공자(대표)/시공자 1/시공자 2 — 같은 데이터영역 반복(slide248). 지분율은 금액에 병기.
const CNST_BZENTY_LIST: { title: string; info: PrfmncPrdocAplyPrfmncTypeInfo }[] = [
  {
    title: '시공자 (대표)',
    info: {
      cnstBzentyNm: '조달테스트',
      enbrno: '123-45-67890',
      rprsvNm: '홍길동',
      cstrnAmt: 1000000,
      cmcnAmt: 1000000,
      gvspAmt: 1000000,
      wholCstrnCnstAmt: 1000000,
    },
  },
  {
    title: '시공자 1',
    info: {
      cnstBzentyNm: '업체 1 명칭',
      enbrno: '111-22-33333',
      rprsvNm: '박길동',
      cstrnAmt: 1000000,
      cmcnAmt: 1000000,
      gvspAmt: 1000000,
      wholCstrnCnstAmt: 1000000,
    },
  },
  {
    title: '시공자 2',
    info: {
      cnstBzentyNm: '업체 2 명칭',
      enbrno: '222-33-44444',
      rprsvNm: '김길동',
      cstrnAmt: 1000000,
      cmcnAmt: 1000000,
      gvspAmt: 1000000,
      wholCstrnCnstAmt: 1000000,
    },
  },
]

// 하도급(최대 3건, 없으면 숨김 — slide249). 헤딩 "하도급자 : {명칭}" (설계서 'OOOO 명칭 표시' 자리).
const SBCTR_LIST: PrfmncPrdocAplySbctrInfo[] = [
  { sbctrSeNm: 'OOOO', sbctrCstrnSclCn: '하도급공사 규모 및 내용 표시', sbctrAmt: 1000000 },
  { sbctrSeNm: 'OOOO', sbctrCstrnSclCn: '하도급공사 규모 및 내용 표시', sbctrAmt: 1000000 },
  { sbctrSeNm: 'OOOO', sbctrCstrnSclCn: '하도급공사 규모 및 내용 표시', sbctrAmt: 1000000 },
]

// 최저가 적정성심사관련 시공실적자료(slide250)
const LWPRC_INFO: PrfmncPrdocAplyLwprcInfo = {
  cnstCn: '계단',
  useEqpmntNm: '트럭',
  eqpmntSpcfctCn: '규격',
  inputCntomCn: '1대',
  wkqtyActotCn: '1시간',
  jobHrActotCn: '1시간',
  ptmWkqtyCn: '5',
  etcRefMttr: '없음',
}

// ── 표 행 빌더 (라벨은 설계서 화면 표기 그대로) ──────────────────────────────
// 계약 및 준공 — 총공사/금차공사 공통 형태.
function cstrnRows(v: {
  ctrtYmd?: string
  bgncstYmd?: string
  cmcnYmd?: string
  cmcnAmt?: number
  gvspAmt?: number
  cstrnAmt?: number
}): TableRow[] {
  return [
    { label: '계약일자', value: v.ctrtYmd ?? '-' },
    { label: '착공일자', value: v.bgncstYmd ?? '-' },
    // 제출유형 5(실적자료 발주기관 확인서)면 '준공예정일자'/'계약금액' 표기(파일 상단 규칙 주석)
    { label: '준공일자', value: v.cmcnYmd ?? '-' },
    { label: '준공금액', value: won(v.cmcnAmt), type: 'number' },
    { label: '관급금액', value: won(v.gvspAmt), type: 'number' },
    { label: '공사금액[준공+관급]', value: won(v.cstrnAmt), type: 'number' },
  ]
}

// 시공자 카드(대표/1/2) — 공시금액·준공금액은 지분율 병기(slide248, 지분율 항목 미정의 → 표시만).
function cnstBzentyRows(v: PrfmncPrdocAplyPrfmncTypeInfo): TableRow[] {
  return [
    { label: '회사명', value: v.cnstBzentyNm ?? '-' },
    { label: '사업자등록번호', value: v.enbrno ?? '-' },
    { label: '대표자명', value: v.rprsvNm ?? '-' },
    { label: '공시금액', value: `${won(v.cstrnAmt)} 지분율: 00%`, type: 'number' },
    { label: '준공금액', value: `${won(v.cmcnAmt)} 지분율: 00%`, type: 'number' },
    { label: '관급금액', value: won(v.gvspAmt), type: 'number' },
    { label: '전체공사 시공금액(관급포함)', value: won(v.wholCstrnCnstAmt), type: 'number' },
  ]
}

// 텍스트 영역 블록 — 헤딩(줄바꿈 허용) + 내용 박스(내용에 맞춰 높이 조정, slide248~249).
// 긴 헤딩이 잘리지 않도록 아코디언 대신 정적 블록으로 렌더(정보 없으면 숨김).
function TextAreaBlock({ title, content }: { title: ReactNode; content?: string }) {
  if (!content) return null
  return (
    <div className="flex flex-col gap-2 border-t border-krds-border-divider px-krds-8 py-krds-7">
      <p className="text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
        {title}
      </p>
      <div className="whitespace-pre-wrap rounded-krds-8 border border-krds-border-field px-krds-7 py-krds-5 text-[17px] leading-normal text-krds-text-ink">
        {content}
      </div>
    </div>
  )
}

export function PrfmncPrdocDtl_UnitB() {
  return (
    <div className="flex w-full flex-col pb-6">
      <Accordion
        type="multiple"
        defaultValue={[
          'aply',
          'rprs',
          'wholCstrn',
          'cstrn',
          'cstrnType',
          'jntCtrc',
          'prfmncType',
          '시공자 (대표)',
          '시공자 1',
          '시공자 2',
        ]}
      >
        {/* 1) 신청정보 — 제출유형 + 공통 신청 항목(slide246) */}
        <AccordionSection value="aply" title="신청정보" borderTop={false}>
          <Table
            rows={[
              {
                label: '제출유형',
                value: <span className="whitespace-pre-wrap">{SBMSN_TYPE}</span>,
                type: 'combination',
              },
              { label: '신청인 연락처', value: APLY_INPT.entlno },
              { label: '제출처', value: APLY_INPT.submOrgn },
              { label: '발급수량', value: `${APLY_INPT.dmndQty}부` },
            ]}
          />
        </AccordionSection>

        {/* 2) 시공자(대표) — dm_prfmncPrdocAplyRprsInfo */}
        <AccordionSection value="rprs" title="시공자(대표)">
          <Table
            rows={[
              { label: '회사명', value: RPRS_INFO.bzentyNm },
              { label: '면허번호', value: RPRS_INFO.lcnsNoVl },
              { label: '대표자', value: RPRS_INFO.rprsvNm },
              { label: '전화번호', value: RPRS_INFO.telno },
              { label: '영업소재지', value: RPRS_INFO.salsLctnAddr },
            ]}
          />
        </AccordionSection>

        {/* 3) 계약 및 준공 (총공사 기준) — dm_prfmncPrdocAplyWholCstrnInfo */}
        <AccordionSection value="wholCstrn" title="계약 및 준공 (총공사 기준)">
          <Table rows={cstrnRows(WHOL_CSTRN)} />
        </AccordionSection>

        {/* 4) 계약 및 준공 (금차공사 기준) — dm_prfmncPrdocAplyCstrnInfo (*2) */}
        <AccordionSection value="cstrn" title="계약 및 준공 (금차공사 기준)">
          <Table
            rows={cstrnRows({
              ctrtYmd: CSTRN_INFO.ctrtYmd2,
              bgncstYmd: CSTRN_INFO.bgncstYmd2,
              cmcnYmd: CSTRN_INFO.cmcnYmd2,
              cmcnAmt: CSTRN_INFO.cmcnAmt2,
              gvspAmt: CSTRN_INFO.gvspAmt2,
              cstrnAmt: CSTRN_INFO.cstrnAmt2,
            })}
          />
        </AccordionSection>

        {/* 5) 공사성질 — dm_prfmncPrdocAplyCstrnTypeInfo. 사각 체크박스(box) 재현 */}
        <AccordionSection value="cstrnType" title="공사성질">
          <div className="flex flex-col gap-1">
            <p className="text-[17px] font-medium leading-normal text-krds-text-muted">건설공사</p>
            <CheckList items={CNSTR_DIVS_ITEMS} checked={toChecked(CSTRN_TYPE.cnstrDivs)} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[17px] font-medium leading-normal text-krds-text-muted">
              전기/그 밖의
            </p>
            <CheckList items={ELTY_DIVS_ITEMS} checked={toChecked(CSTRN_TYPE.eltyDivs)} />
          </div>
        </AccordionSection>

        {/* 6) 공동도급 여부 — dm_prfmncPrdocAplyJntCtrcInfo(jntCtrcCd 단일 값). 사각 체크박스 재현 */}
        <AccordionSection value="jntCtrc" title="공동도급 여부">
          <div className="flex flex-col gap-1">
            <p className="text-[17px] font-medium leading-normal text-krds-text-muted">건설공사</p>
            <CheckList items={JNT_CTRC_ITEMS} checked={toChecked(JNT_CTRC.jntCtrcCd)} />
          </div>
        </AccordionSection>

        {/* 7) 실적의 종류 — dm_prfmncPrdocAplyprfmncTypeInfo.rsltDivs(다중). 사각 체크박스 재현 */}
        <AccordionSection value="prfmncType" title="실적의 종류">
          <CheckList items={RSLT_DIVS_ITEMS} checked={toChecked(PRFMNC_TYPE.rsltDivs)} />
        </AccordionSection>

        {/* 8~10) 시공자 (대표)/시공자 1/시공자 2 — 같은 데이터영역 반복(slide248) */}
        {CNST_BZENTY_LIST.map((b) => (
          <AccordionSection key={b.title} value={b.title} title={b.title}>
            <Table rows={cnstBzentyRows(b.info)} />
          </AccordionSection>
        ))}
      </Accordion>

      {/* 10~14) 텍스트 영역 5종 — 긴 헤딩이라 정적 블록(정보 없으면 숨김, slide248~249) */}
      <TextAreaBlock
        title="전체공사 시공규모 : 구체적인 시공물량 표시"
        content={PRFMNC_TYPE.wholCstrnCnstSclExpln}
      />
      <TextAreaBlock
        title="시공회사별 실적공종또는 PQ공종 시공규모, 방법(공법)"
        content={PRFMNC_TYPE.cnstBcoSclMthdCn}
      />
      <TextAreaBlock
        title="시공회사별 실적공종 또는 PQ 공종의 금액"
        content={PRFMNC_TYPE.cnstBcoCnstAmtCn}
      />
      <TextAreaBlock
        title="시공회사별 실적공종 또는 PQ 공종의 준공금액"
        content={PRFMNC_TYPE.cnstBcoCmcnAmtCn}
      />
      <TextAreaBlock
        title="시공회사별 실적공종 또는 PQ공종의 관급금액"
        content={PRFMNC_TYPE.cnstBcoGvspAmtCn}
      />

      {/* 15~17) 하도급자 ×3 — 최대 3건, 정보 없으면 숨김(slide249) */}
      <Accordion type="multiple" defaultValue={SBCTR_LIST.map((_, i) => `sbctr-${i}`)}>
        {SBCTR_LIST.map((s, i) => (
          <AccordionSection
            key={`sbctr-${i}`}
            value={`sbctr-${i}`}
            title={`하도급자 : ${s.sbctrSeNm ?? '-'}`}
          >
            <Table
              rows={[
                { label: '하도급공사 규모 및 내용', value: s.sbctrCstrnSclCn ?? '-' },
                { label: '하도금금액[준공+관급]', value: won(s.sbctrAmt), type: 'number' },
              ]}
            />
          </AccordionSection>
        ))}
      </Accordion>

      {/* 18) 실적증명 발급일 기준 시공내용 — 제출유형 2 노출(항목명 중복 정의 — 파일 상단 주석) */}
      <TextAreaBlock title="실적증명 발급일 기준 시공내용" content={CNST_CN_ON_ISSUE_DT} />

      {/* 19) 최저가 적정성심사관련 시공실적자료 — dm_prfmncPrdocAplyLwprcInfo(slide250) */}
      <Accordion type="multiple" defaultValue={['lwprc']}>
        <AccordionSection value="lwprc" title="최저가 적정성심사관련 시공실적자료">
          <Table
            rows={[
              { label: '시공내용', value: LWPRC_INFO.cnstCn ?? '-' },
              { label: '사용장비명', value: LWPRC_INFO.useEqpmntNm ?? '-' },
              { label: '장비규격', value: LWPRC_INFO.eqpmntSpcfctCn ?? '-' },
              { label: '투입대수 누계', value: LWPRC_INFO.inputCntomCn ?? '-' },
              { label: '작업량 누계', value: LWPRC_INFO.wkqtyActotCn ?? '-' },
              { label: '작업시간 누계', value: LWPRC_INFO.jobHrActotCn ?? '-' },
              { label: '시간당 작업량', value: LWPRC_INFO.ptmWkqtyCn ?? '-' },
              { label: '기타 참고사항', value: LWPRC_INFO.etcRefMttr ?? '-' },
            ]}
          />
        </AccordionSection>
      </Accordion>
    </div>
  )
}
PrfmncPrdocDtl_UnitB.displayName = 'PrfmncPrdocDtl_UnitB'
