// Design Ref: search-filter.design.md §2.1 (v2) — config 의 field.type 을 common 컴포넌트로 매핑하는 디스패처.
// 도메인 무관: 어떤 도메인 문자열/타입도 하드코딩하지 않는다. common/(base·composites)만 사용 — raw 직접 import 금지.
import * as React from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { SelectionFieldBox } from '@/ui/common/base/SelectionFieldBox'
import { DateInput } from '@/ui/common/composites/DateInput'
import { DateRangeInput } from '@/ui/common/composites/DateRangeInput'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import type {
  DateRangeValue,
  SearchFilterField as FieldDef,
  SearchFilterFieldValue,
} from '@/types/search-filter'

export interface SearchFilterFieldProps {
  field: FieldDef
  value: SearchFilterFieldValue | undefined
  onChange: (value: SearchFilterFieldValue) => void
}

const EMPTY_RANGE: DateRangeValue = { start: '', end: '' }

// 라벨(있으면) + 컨트롤. Figma 폼 필드 라벨 = m_input_label(17 Bold). gap-8.
function Field({
  label,
  required,
  children,
}: {
  label?: React.ReactNode
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-krds-5">
      {label != null && <InputLabel required={required ?? false}>{label}</InputLabel>}
      {children}
    </div>
  )
}

const SearchFilterField = ({ field, value, onChange }: SearchFilterFieldProps) => {
  switch (field.type) {
    // 검색유형 — 세로 라디오
    case 'radio':
      return (
        <Field label={field.label} required={field.required}>
          <RadioButtonGroup
            direction="vertical"
            value={(value as string) ?? ''}
            onValueChange={(v) => onChange(v)}
            items={field.options}
            showIndicator={field.showIndicator}
          />
        </Field>
      )

    // 업무구분 등 — 다중 선택(가로). 이번 사이클 미구현(빈 영역) → 자리만.
    case 'checkbox':
      return (
        <Field label={field.label} required={field.required}>
          {/* TODO: 체크박스 다중선택 + 가로 스와이프(m_button_arrow_swiper) */}
          <p className="text-krds-body-sm text-krds-text-subtle">준비 중입니다.</p>
        </Field>
      )

    // 일자 설정 — 기간(빠른설정 칩 내장). TODO: 월 단위(YYYY-MM) 피커 — date-input 개선 시
    case 'dateRange':
      return (
        <Field label={field.label} required={field.required}>
          <DateRangeInput
            value={(value as DateRangeValue) ?? EMPTY_RANGE}
            onChange={(r) => onChange(r)}
            showPresets={field.showPresets}
          />
        </Field>
      )

    // 단일 날짜
    case 'date':
      return (
        <Field label={field.label} required={field.required}>
          <DateInput
            value={(value as string) ?? ''}
            onChange={(s) => onChange(s)}
            placeholder={field.placeholder}
          />
        </Field>
      )

    // 제목/판단번호/담당자 등 — 자유 입력
    case 'text':
      return (
        <Field label={field.label} required={field.required}>
          <InputBox
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            onClear={() => onChange('')}
          />
        </Field>
      )

    // 대표품명/발주기관 등 — 선택 트리거(`>`), 클릭 시 공통팝업(자리만, 팝업 TODO)
    case 'selectionField':
      return (
        <Field label={field.label} required={field.required}>
          <SelectionFieldBox
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onClick={() => {
              // TODO: 공통팝업 연계(품목별 검색 MUI-OP-01-P71 / 발주부서 검색 MUI-BD-01-P04)
            }}
            onClear={() => onChange('')}
          />
        </Field>
      )

    // 구분설정 — 드롭다운
    case 'select':
      return (
        <Field label={field.label} required={field.required}>
          <SelectBox
            value={(value as string) ?? ''}
            onValueChange={(v) => onChange(v)}
            items={field.options}
            placeholder={field.placeholder}
          />
        </Field>
      )

    default: {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('[SearchFilterField] 알 수 없는 field.type:', field)
      }
      return null
    }
  }
}
SearchFilterField.displayName = 'SearchFilterField'

export { SearchFilterField }
