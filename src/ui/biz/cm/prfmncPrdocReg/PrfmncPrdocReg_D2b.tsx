// 실적정보(방위사업청) — MUI-CM-04-T12 (실적증명서 신청 화면 – 방위사업청). 설계서 slide289.
// 항목명은 dm_prfmncPrdocAplyInptInfo 1.4(slide267) 그대로. 불러온 정보 기반으로 채워지며 수정 가능.
// 사용목적별 노출 규칙(slide289 — API 연동/상세설계 시 반영, 목업 '기타'=1~7 전부 표시):
//   세무서제출-당해(납품)=납품·정산·납품일자 / 당해(선금)=선금·납품일자 / 당해(착수금)=착수금·납품일자 /
//   당해(중도금)=중도금·납품일자 / 예정(납품금)=납품·정산·납품일자 /
//   보증회사제출-당해·예정(납품금)=납품·정산·보증보험번호·확인요청사항·정산일자 /
//   적격심사제출·입찰참가용=납품·납품일자 / 기타=전부.
// 검증 규칙 미정("상세설계 기간에 작성 예정") → 입력 UI 만 구성, 값 수집은 저장/신청 스텁에서.
import { useState, type ReactNode } from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { DateInput } from '@/ui/common/composites/DateInput'
import { YearInput } from '@/ui/common/composites/YearInput'
import type { PrfmncPrdocAplyInptInfo } from '@/types/mock/cm'

// 금액 콤마 포맷(InputBox numeric 필터 뒤 적용)
const fmtComma = (filtered: string) => (filtered ? Number(filtered).toLocaleString() : '')

// 목업 초기값 — slide289 표시값(불러온 정보 기반). API 연동 시 조회값으로 교체.
const MOCK_PRFMNC: PrfmncPrdocAplyInptInfo = {
  entlno: '',
  dmndQty: '',
  submOrgn: '',
  usePrpsCd: '',
  prfmncYr: '2025',
  prfmncIdntyAmt: 1000000,
  prpamtIdntyAmt: 1000000,
  clclnAmt: 1000000,
  otstDmndAmt: 1000000,
  mdwyDmndAmt: 1000000,
  grnteInsrncNo: '123456',
  idntyDmndMttr: '',
  clclnYmd: '2025-12-13',
}

// 필드 래퍼 — 라벨 + 컨트롤
function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-krds-5">
      <InputLabel>{label}</InputLabel>
      {children}
    </div>
  )
}

// 금액 입력 — numeric+콤마 + 우측 '원' 단위(slide290 "입력 시 단위 표시")
function AmountField({
  label,
  value,
  onChange,
}: {
  label: ReactNode
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Field label={label}>
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
        <span className="shrink-0 text-[17px] text-krds-text-ink">원</span>
      </div>
    </Field>
  )
}

export function PrfmncPrdocReg_D2b() {
  // 입력 상태 — 항목명(설계서) 그대로. 검증 미정 → 저장/신청(부모 footer)은 스텁.
  const [prfmncYr, setPrfmncYr] = useState(MOCK_PRFMNC.prfmncYr ?? '')
  const [prfmncIdntyAmt, setPrfmncIdntyAmt] = useState(fmtComma(String(MOCK_PRFMNC.prfmncIdntyAmt ?? '')))
  const [prpamtIdntyAmt, setPrpamtIdntyAmt] = useState(fmtComma(String(MOCK_PRFMNC.prpamtIdntyAmt ?? '')))
  const [clclnAmt, setClclnAmt] = useState(fmtComma(String(MOCK_PRFMNC.clclnAmt ?? '')))
  const [otstDmndAmt, setOtstDmndAmt] = useState(fmtComma(String(MOCK_PRFMNC.otstDmndAmt ?? '')))
  const [mdwyDmndAmt, setMdwyDmndAmt] = useState(fmtComma(String(MOCK_PRFMNC.mdwyDmndAmt ?? '')))
  const [grnteInsrncNo, setGrnteInsrncNo] = useState(MOCK_PRFMNC.grnteInsrncNo ?? '')
  const [idntyDmndMttr, setIdntyDmndMttr] = useState(MOCK_PRFMNC.idntyDmndMttr ?? '')
  const [clclnYmd, setClclnYmd] = useState(MOCK_PRFMNC.clclnYmd ?? '')

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-[17px] leading-normal text-krds-text-ink">
        실적 정보를 입력해주시길 바랍니다.
      </p>
      <h3 className="text-[19px] font-bold leading-normal text-krds-text-ink">실적정보</h3>

      {/* 납품/지출년도 — 연도 선택(YearInput 휠 시트) */}
      <YearInput
        label="납품/지출년도"
        value={prfmncYr}
        onChange={setPrfmncYr}
        placeholder="선택해주세요."
      />

      <AmountField label="납품금액" value={prfmncIdntyAmt} onChange={setPrfmncIdntyAmt} />
      <AmountField label="선금금액" value={prpamtIdntyAmt} onChange={setPrpamtIdntyAmt} />
      <AmountField label="정산금액" value={clclnAmt} onChange={setClclnAmt} />
      <AmountField label="착수금액" value={otstDmndAmt} onChange={setOtstDmndAmt} />
      <AmountField label="중도금액" value={mdwyDmndAmt} onChange={setMdwyDmndAmt} />

      <Field label="보증보험번호">
        <InputBox
          placeholder="입력해주세요."
          value={grnteInsrncNo}
          onChange={(e) => setGrnteInsrncNo(e.target.value)}
          onClear={() => setGrnteInsrncNo('')}
        />
      </Field>

      <Field label="확인요청사항">
        <InputBox
          placeholder="입력해주세요."
          value={idntyDmndMttr}
          onChange={(e) => setIdntyDmndMttr(e.target.value)}
          onClear={() => setIdntyDmndMttr('')}
        />
      </Field>

      {/* 납품일자(clclnYmd — 사용목적에 따라 정산일자로 바뀌기도 함, slide267) */}
      <DateInput
        label="납품일자"
        value={clclnYmd}
        onChange={setClclnYmd}
        placeholder="선택해주세요."
      />
    </div>
  )
}
PrfmncPrdocReg_D2b.displayName = 'PrfmncPrdocReg_D2b'
