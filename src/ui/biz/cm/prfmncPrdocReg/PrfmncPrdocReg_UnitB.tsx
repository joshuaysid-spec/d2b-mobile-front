// 실적정보(unitB) — MUI-CM-04-T13 (실적증명서 신청 화면 – 계약 구분 부대+시설공사). 설계서 slide290~294.
// 확인 탭(PrfmncPrdocDtl_UnitB, T03)과 동일 섹션 구성의 **입력판**. 항목명은 dm_* (slide266~270) 그대로.
// 섹션 순서(2026-07-20 사용자 확정): 시공자(대표) → 계약및준공(총공사→금차공사) → 공사성질 →
//   공동도급 여부 → 실적의 종류 → 시공자 (대표)/1/2 → 텍스트 영역 5종 → 하도급 내용(3건 단일 섹션)
//   → 실적증명 발급일 기준 시공내용 → 최저가 적정성심사관련 시공실적자료.
// 제출유형(1/2/5)별 라벨·노출 변경 규칙(slide290·292~293 — API/상세설계 시 반영, 목업 유형 1 기준):
//   [5] 준공일자→준공예정일자 · 중공(준공)금액→계약금액 · 관급금액→도급자설치관급금액 ·
//   [1] 전체공사시공규모 / [2] 전체공사계약규모 · 하도급 [2] 명칭 변경(하도급자 면허 등) ·
//   최저가 자료(slide294)는 [5] 인 경우 표시(정보 3건, 없으면 숨김).
// 검증 규칙 미정 → 입력 UI 만(필수 * 는 계약일자/공사금액 — slide290). 값 수집은 저장/신청 스텁.
import { useState, type ReactNode } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { TextArea } from '@/ui/common/base/TextArea'
import { Table } from '@/ui/common/composites/Table'
import { DateInput } from '@/ui/common/composites/DateInput'
import type { CheckboxGroupItem } from '@/ui/common/composites/CheckboxGroup'
import type { MockPrfmncPrdocAplyRprsInfo } from '@/types/mock/cm'

const fmtComma = (filtered: string) => (filtered ? Number(filtered).toLocaleString() : '')

// ── 체크박스 옵션 (T03 확인 탭과 동일 — slide291) ─────────────────────────────
const CNSTR_DIVS_ITEMS: CheckboxGroupItem[] = [
  { value: '신규공사', label: '신규공사' },
  { value: '확장공사', label: '확장공사' },
  { value: '개보수공사', label: '개보수공사' },
]
const ELTY_DIVS_ITEMS: CheckboxGroupItem[] = [
  { value: '신규공사', label: '신규공사' },
  { value: '증설공사', label: '증설공사' },
  { value: '이설공사', label: '이설공사' },
  { value: '개설공사', label: '개설공사' },
  { value: '보수공사', label: '보수공사' },
]
const JNT_CTRC_ITEMS: CheckboxGroupItem[] = [
  { value: '공동이행방식', label: '공동이행방식' },
  { value: '분담이행방식', label: '분담이행방식' },
  { value: '단독도급', label: '단독도급' },
]
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

// 시공자(대표) — 불러온 정보 표시(dm_prfmncPrdocAplyRprsInfo, slide290)
const RPRS_INFO: MockPrfmncPrdocAplyRprsInfo = {
  bzentyNm: 'A 업체',
  lcnsNoVl: '123456-7890123',
  rprsvNm: '홍길동',
  telno: '02-1234-5678',
  salsLctnAddr: '서울특별시 종로구…',
}

// ── 로컬 입력 조립물 ─────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: ReactNode; required?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-krds-5">
      <InputLabel required={required}>{label}</InputLabel>
      {children}
    </div>
  )
}

// 금액 입력(numeric+콤마+'원' 단위 — slide290 "입력 시 단위 표시")
function AmountInput({ value, onChange, unit = '원' }: { value: string; onChange: (v: string) => void; unit?: string }) {
  return (
    <div className="flex items-center gap-krds-3">
      <InputBox
        className="flex-1"
        inputType="numeric"
        format={fmtComma}
        placeholder="입력해주세요."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClear={() => onChange('')}
      />
      <span className="shrink-0 text-[17px] text-krds-text-ink">{unit}</span>
    </div>
  )
}

// 편집 가능 체크박스 목록 — AgreementList 와 동일 사각 체크박스(box). 다중/단일(single) 지원.
function CheckListInput({
  items,
  value,
  onChange,
  single,
}: {
  items: CheckboxGroupItem[]
  value: string[]
  onChange: (next: string[]) => void
  single?: boolean
}) {
  const toggle = (v: string, checked: boolean) => {
    if (single) {
      onChange(checked ? [v] : [])
      return
    }
    onChange(checked ? [...value, v] : value.filter((x) => x !== v))
  }
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {items.map((it) => (
        <Checkbox
          key={it.value}
          variant="box"
          label={it.label}
          checked={value.includes(it.value)}
          onCheckedChange={(c) => toggle(it.value, c === true)}
        />
      ))}
    </div>
  )
}

// 계약 및 준공 입력 세트 — 총공사/금차공사 공통(총공사만 계약일자·공사금액 필수 *, slide290).
interface CstrnInput {
  ctrtYmd: string
  bgncstYmd: string
  cmcnYmd: string
  cmcnAmt: string
  gvspAmt: string
  cstrnAmt: string
}
const EMPTY_CSTRN: CstrnInput = { ctrtYmd: '', bgncstYmd: '', cmcnYmd: '', cmcnAmt: '', gvspAmt: '', cstrnAmt: '' }

function CstrnFields({
  value,
  onChange,
  required,
}: {
  value: CstrnInput
  onChange: (next: CstrnInput) => void
  required?: boolean
}) {
  const set = (patch: Partial<CstrnInput>) => onChange({ ...value, ...patch })
  return (
    <>
      <DateInput label="계약일자" required={required} value={value.ctrtYmd} onChange={(v) => set({ ctrtYmd: v })} placeholder="선택해주세요." />
      <DateInput label="착공일자" value={value.bgncstYmd} onChange={(v) => set({ bgncstYmd: v })} placeholder="선택해주세요." />
      {/* 제출유형 5 면 '준공예정일자'/'계약금액' 표기(파일 상단 규칙) */}
      <DateInput label="준공일자" value={value.cmcnYmd} onChange={(v) => set({ cmcnYmd: v })} placeholder="선택해주세요." />
      <Field label="준공금액">
        <AmountInput value={value.cmcnAmt} onChange={(v) => set({ cmcnAmt: v })} />
      </Field>
      <Field label="관급금액">
        <AmountInput value={value.gvspAmt} onChange={(v) => set({ gvspAmt: v })} />
      </Field>
      <Field label="공사금액 [준공+관급]" required={required}>
        <AmountInput value={value.cstrnAmt} onChange={(v) => set({ cstrnAmt: v })} />
      </Field>
    </>
  )
}

// 시공자(대표/1/2) 입력 세트 — dm_prfmncPrdocAplyprfmncTypeInfo(slide292). 지분율(%)은 항목 미정의(표시용).
interface CnstBzentyInput {
  cnstBzentyNm: string
  enbrno: string
  rprsvNm: string
  cstrnAmt: string
  cstrnShare: string
  cmcnAmt: string
  cmcnShare: string
  gvspAmt: string
  wholCstrnCnstAmt: string
}
const EMPTY_CNST_BZENTY: CnstBzentyInput = {
  cnstBzentyNm: '',
  enbrno: '',
  rprsvNm: '',
  cstrnAmt: '',
  cstrnShare: '',
  cmcnAmt: '',
  cmcnShare: '',
  gvspAmt: '',
  wholCstrnCnstAmt: '',
}

function CnstBzentyFields({ value, onChange }: { value: CnstBzentyInput; onChange: (n: CnstBzentyInput) => void }) {
  const set = (patch: Partial<CnstBzentyInput>) => onChange({ ...value, ...patch })
  const amtWithShare = (
    amtKey: 'cstrnAmt' | 'cmcnAmt',
    shareKey: 'cstrnShare' | 'cmcnShare',
  ) => (
    <div className="flex items-center gap-krds-3">
      <InputBox
        className="flex-1"
        inputType="numeric"
        format={fmtComma}
        placeholder="입력해주세요."
        value={value[amtKey]}
        onChange={(e) => set({ [amtKey]: e.target.value } as Partial<CnstBzentyInput>)}
      />
      <span className="shrink-0 text-[17px] text-krds-text-ink">원</span>
      <span className="shrink-0 text-[15px] text-krds-text-muted">지분율</span>
      <InputBox
        className="w-[72px]"
        inputType="numeric"
        placeholder="00"
        maxLength={3}
        value={value[shareKey]}
        onChange={(e) => set({ [shareKey]: e.target.value } as Partial<CnstBzentyInput>)}
      />
      <span className="shrink-0 text-[17px] text-krds-text-ink">%</span>
    </div>
  )
  return (
    <>
      <Field label="회사명">
        <InputBox placeholder="입력해주세요." value={value.cnstBzentyNm} onChange={(e) => set({ cnstBzentyNm: e.target.value })} />
      </Field>
      <Field label="사업자등록번호">
        <InputBox placeholder="입력해주세요." value={value.enbrno} onChange={(e) => set({ enbrno: e.target.value })} />
      </Field>
      <Field label="대표자명">
        <InputBox placeholder="입력해주세요." value={value.rprsvNm} onChange={(e) => set({ rprsvNm: e.target.value })} />
      </Field>
      <Field label="공시금액">{amtWithShare('cstrnAmt', 'cstrnShare')}</Field>
      <Field label="준공금액">{amtWithShare('cmcnAmt', 'cmcnShare')}</Field>
      <Field label="관급금액">
        <AmountInput value={value.gvspAmt} onChange={(v) => set({ gvspAmt: v })} />
      </Field>
      <Field label="전체공사 시공금액(관급포함)">
        <AmountInput value={value.wholCstrnCnstAmt} onChange={(v) => set({ wholCstrnCnstAmt: v })} />
      </Field>
    </>
  )
}

// 텍스트 영역 입력 블록(4000자 — 발급일 기준 시공내용 등). 정적 헤딩 + TextArea.
function TextAreaField({
  title,
  value,
  onChange,
}: {
  title: ReactNode
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-krds-border-divider px-krds-8 py-krds-7">
      <p className="text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">{title}</p>
      <TextArea placeholder="입력해주세요." value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
    </div>
  )
}

// 금액 입력 블록 — 정적 헤딩 + 금액 입력(input + '원'). 시공규모/실적공종 5종(2026-07-20 요청).
function AmountBlock({
  title,
  value,
  onChange,
}: {
  title: ReactNode
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-krds-border-divider px-krds-8 py-krds-7">
      <p className="text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">{title}</p>
      <AmountInput value={value} onChange={onChange} />
    </div>
  )
}

// 하도급 입력(3건 — slide293) — dm_prfmncPrdocAplySbctrInfo
interface SbctrInput {
  sbctrSeNm: string
  sbctrCstrnSclCn: string
  sbctrAmt: string
}
const EMPTY_SBCTR: SbctrInput = { sbctrSeNm: '', sbctrCstrnSclCn: '', sbctrAmt: '' }

// 최저가 적정성심사관련 시공실적자료 입력(slide294) — dm_prfmncPrdocAplyLwprcInfo
const LWPRC_FIELDS: { key: string; label: string }[] = [
  { key: 'cnstCn', label: '시공내용' },
  { key: 'useEqpmntNm', label: '사용장비명' },
  { key: 'eqpmntSpcfctCn', label: '장비규격' },
  { key: 'inputCntomCn', label: '투입대수 누계' },
  { key: 'wkqtyActotCn', label: '작업량 누계' },
  { key: 'jobHrActotCn', label: '작업시간 누계' },
  { key: 'ptmWkqtyCn', label: '시간당 작업량' },
  { key: 'etcRefMttr', label: '기타 참고사항' },
]

export function PrfmncPrdocReg_UnitB() {
  // 입력 상태 — 검증 규칙 미정, 저장/신청(부모 footer)은 스텁이라 값 수집만.
  const [wholCstrn, setWholCstrn] = useState<CstrnInput>(EMPTY_CSTRN)
  const [cstrn, setCstrn] = useState<CstrnInput>(EMPTY_CSTRN)
  const [cnstrDivs, setCnstrDivs] = useState<string[]>([])
  const [eltyDivs, setEltyDivs] = useState<string[]>([])
  const [jntCtrcCd, setJntCtrcCd] = useState<string[]>([])
  const [rsltDivs, setRsltDivs] = useState<string[]>([])
  const [cnstBzentyList, setCnstBzentyList] = useState<CnstBzentyInput[]>([
    { ...EMPTY_CNST_BZENTY, cnstBzentyNm: '조달테스트', enbrno: '123-45-67890', rprsvNm: '홍길동' },
    EMPTY_CNST_BZENTY,
    EMPTY_CNST_BZENTY,
  ])
  const [wholCstrnCnstSclExpln, setWholCstrnCnstSclExpln] = useState('')
  const [cnstBcoSclMthdCn, setCnstBcoSclMthdCn] = useState('')
  const [cnstBcoCnstAmtCn, setCnstBcoCnstAmtCn] = useState('')
  const [cnstBcoCmcnAmtCn, setCnstBcoCmcnAmtCn] = useState('')
  const [cnstBcoGvspAmtCn, setCnstBcoGvspAmtCn] = useState('')
  const [cnstCnOnIssueDt, setCnstCnOnIssueDt] = useState('') // 발급일 기준 시공내용(항목명 중복 정의 — T03 주석 참고)
  const [sbctrList, setSbctrList] = useState<SbctrInput[]>([EMPTY_SBCTR, EMPTY_SBCTR, EMPTY_SBCTR])
  const [lwprc, setLwprc] = useState<Record<string, string>>({})

  const setCnstBzenty = (i: number, next: CnstBzentyInput) =>
    setCnstBzentyList((prev) => prev.map((v, idx) => (idx === i ? next : v)))
  const setSbctr = (i: number, patch: Partial<SbctrInput>) =>
    setSbctrList((prev) => prev.map((v, idx) => (idx === i ? { ...v, ...patch } : v)))

  const CNST_BZENTY_TITLES = ['시공자 (대표)', '시공자 1', '시공자 2']

  return (
    <div className="flex w-full flex-col pb-2">
      <p className="px-4 pt-4 text-[17px] leading-normal text-krds-text-ink">
        실적 정보를 입력해주시길 바랍니다.
      </p>

      <Accordion
        type="multiple"
        defaultValue={['rprs', 'wholCstrn', 'cstrn', 'cstrnType', 'jntCtrc', 'prfmncType', '시공자 (대표)', '시공자 1', '시공자 2']}
      >
        {/* 시공자(대표) — 불러온 정보 표시(읽기전용) */}
        <AccordionSection value="rprs" title="시공자(대표)" borderTop={false}>
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

        {/* 계약 및 준공 (총공사 기준) — 장기계속·계속비공사는 총공사기준 작성(slide290 도움말) */}
        <AccordionSection value="wholCstrn" title="계약 및 준공 (총공사 기준)">
          <CstrnFields value={wholCstrn} onChange={setWholCstrn} required />
        </AccordionSection>

        {/* 계약 및 준공 (금차공사 기준) — 항목명 *2(dm_prfmncPrdocAplyCstrnInfo) */}
        <AccordionSection value="cstrn" title="계약 및 준공 (금차공사 기준)">
          <CstrnFields value={cstrn} onChange={setCstrn} />
        </AccordionSection>

        {/* 공사성질 — 계약에 정보가 있으면 정보 기반 완성, 없으면 미선택(slide291) */}
        <AccordionSection value="cstrnType" title="공사성질">
          <div className="flex flex-col gap-1">
            <p className="text-[17px] font-medium leading-normal text-krds-text-muted">건설공사</p>
            <CheckListInput items={CNSTR_DIVS_ITEMS} value={cnstrDivs} onChange={setCnstrDivs} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[17px] font-medium leading-normal text-krds-text-muted">전기/그 밖의</p>
            <CheckListInput items={ELTY_DIVS_ITEMS} value={eltyDivs} onChange={setEltyDivs} />
          </div>
        </AccordionSection>

        {/* 공동도급 여부 — 단일 선택(jntCtrcCd) */}
        <AccordionSection value="jntCtrc" title="공동도급 여부">
          <div className="flex flex-col gap-1">
            <p className="text-[17px] font-medium leading-normal text-krds-text-muted">건설공사</p>
            <CheckListInput items={JNT_CTRC_ITEMS} value={jntCtrcCd} onChange={setJntCtrcCd} single />
          </div>
        </AccordionSection>

        {/* 실적의 종류 — 다중(rsltDivs) */}
        <AccordionSection value="prfmncType" title="실적의 종류">
          <CheckListInput items={RSLT_DIVS_ITEMS} value={rsltDivs} onChange={setRsltDivs} />
        </AccordionSection>

        {/* 시공자(대표)/시공자1/시공자2 — 공동수급체구성원별 구분 작성(slide292 도움말) */}
        {cnstBzentyList.map((b, i) => (
          <AccordionSection key={CNST_BZENTY_TITLES[i]} value={CNST_BZENTY_TITLES[i]} title={CNST_BZENTY_TITLES[i]}>
            <CnstBzentyFields value={b} onChange={(next) => setCnstBzenty(i, next)} />
          </AccordionSection>
        ))}
      </Accordion>

      {/* 시공규모/실적공종 5종 — 금액 입력창(input + '원', 2026-07-20 요청).
          제출유형(1/2/5)별 라벨·노출 변경 규칙은 파일 상단 주석(목업 유형 1). */}
      <AmountBlock title="전체공사 시공규모 : 구체적인 시공물량 표시" value={wholCstrnCnstSclExpln} onChange={setWholCstrnCnstSclExpln} />
      <AmountBlock title="시공회사별 실적공종또는 PQ공종 시공규모, 방법(공법)" value={cnstBcoSclMthdCn} onChange={setCnstBcoSclMthdCn} />
      <AmountBlock title="시공회사별 실적공종 또는 PQ 공종의 금액" value={cnstBcoCnstAmtCn} onChange={setCnstBcoCnstAmtCn} />
      <AmountBlock title="시공회사별 실적공종 또는 PQ 공종의 준공금액" value={cnstBcoCmcnAmtCn} onChange={setCnstBcoCmcnAmtCn} />
      <AmountBlock title="시공회사별 실적공종 또는 PQ공종의 관급금액" value={cnstBcoGvspAmtCn} onChange={setCnstBcoGvspAmtCn} />

      {/* 하도급 내용 — 하도급자별 구분 작성, 3건(slide293). 단일 섹션 안에 3개 입력 그룹. */}
      <Accordion type="multiple" defaultValue={['sbctr']}>
        <AccordionSection value="sbctr" title="하도급 내용">
          {sbctrList.map((s, i) => (
            <div
              key={`sbctr-${i}`}
              className={
                i > 0
                  ? 'flex flex-col gap-krds-8 border-t border-krds-border-divider pt-krds-8'
                  : 'flex flex-col gap-krds-8'
              }
            >
              <Field label="하도급자">
                <InputBox placeholder="입력해주세요." value={s.sbctrSeNm} onChange={(e) => setSbctr(i, { sbctrSeNm: e.target.value })} />
              </Field>
              <Field label="하도급공사 규모 및 내용">
                <InputBox placeholder="입력해주세요." value={s.sbctrCstrnSclCn} onChange={(e) => setSbctr(i, { sbctrCstrnSclCn: e.target.value })} />
              </Field>
              <Field label="하도금금액[준공+관급]">
                <AmountInput value={s.sbctrAmt} onChange={(v) => setSbctr(i, { sbctrAmt: v })} />
              </Field>
            </div>
          ))}
        </AccordionSection>
      </Accordion>

      {/* 실적증명 발급일 기준 시공내용 — 제출유형 2 노출(항목명 설계서 중복 정의 — 확정 시 교체) */}
      <TextAreaField title="실적증명 발급일 기준 시공내용" value={cnstCnOnIssueDt} onChange={setCnstCnOnIssueDt} />

      {/* 최저가 적정성심사관련 시공실적자료 — 제출유형 5 노출, 3건 중 목업 1건(slide294) */}
      <Accordion type="multiple" defaultValue={['lwprc']}>
        <AccordionSection value="lwprc" title="최저가 적정성심사관련 시공실적자료">
          {LWPRC_FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <InputBox
                placeholder="입력해주세요."
                value={lwprc[f.key] ?? ''}
                onChange={(e) => setLwprc((prev) => ({ ...prev, [f.key]: e.target.value }))}
              />
            </Field>
          ))}
        </AccordionSection>
      </Accordion>
    </div>
  )
}
PrfmncPrdocReg_UnitB.displayName = 'PrfmncPrdocReg_UnitB'
