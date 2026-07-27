// 실적정보(unitC~I·AplyInfo) 신청 탭 공통 입력 조립물 — 도메인 전용(공통 base/composite 아님).
// 확인(상세) 탭과 같은 데이터영역을 입력판으로 재현하는 T14~T21 이 공유. 필드 렌더/상태 헬퍼만 제공하고
// 섹션 구성(어떤 필드를 어떤 순서로)은 각 탭이 소유한다. 항목명(키)은 설계서 영문 항목명 그대로 사용.
import { useState, type ReactNode } from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { TextArea } from '@/ui/common/base/TextArea'

/** 금액 콤마 포맷(InputBox numeric 필터 뒤 적용). */
export const fmtComma = (filtered: string) => (filtered ? Number(filtered).toLocaleString() : '')

/** 문자열 키 record 상태 훅 — 저장/신청은 부모 footer 스텁이라 값 수집만. */
export function useFieldRecord(initial: Record<string, string> = {}) {
  const [record, setRecord] = useState<Record<string, string>>(initial)
  const get = (key: string) => record[key] ?? ''
  const set = (key: string) => (value: string) => setRecord((prev) => ({ ...prev, [key]: value }))
  return { record, get, set }
}

/** 라벨 + 컨트롤 래퍼. */
export function Field({
  label,
  required,
  children,
}: {
  label: ReactNode
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-krds-5">
      <InputLabel required={required}>{label}</InputLabel>
      {children}
    </div>
  )
}

/** 일반 텍스트 입력 필드(라벨 포함). disabled=불러온 정보(읽기전용) 표시(InputBox 재사용). */
export function TextField({
  label,
  required,
  value,
  onChange,
  placeholder = '입력해주세요.',
  disabled,
}: {
  label: ReactNode
  required?: boolean
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <Field label={label} required={required}>
      <InputBox
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onClear={disabled ? undefined : () => onChange('')}
      />
    </Field>
  )
}

/** 금액 입력 필드(numeric+콤마 + 우측 단위, 라벨 포함). unit=원/천원/백만원(설계서 단위 표기). */
export function AmountField({
  label,
  required,
  value,
  onChange,
  unit = '원',
}: {
  label: ReactNode
  required?: boolean
  value: string
  onChange: (v: string) => void
  unit?: string
}) {
  return (
    <Field label={label} required={required}>
      <div className="flex items-center gap-krds-3">
        <InputBox
          className="flex-1"
          inputType="numeric"
          format={fmtComma}
          placeholder={`${unit} 단위로 입력해주세요.`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClear={() => onChange('')}
        />
        <span className="shrink-0 text-[17px] text-krds-text-ink">{unit}</span>
      </div>
    </Field>
  )
}

/** 텍스트 영역 입력 필드(그 밖의 사항·시공규모 등, 라벨 포함). */
export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: ReactNode
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <Field label={label}>
      <TextArea
        placeholder="입력해주세요."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
      />
    </Field>
  )
}
