// Design Ref: search-filter.design.md §2.1 (v2) — config 의 field.type 을 common 컴포넌트로 매핑하는 디스패처.
// 도메인 무관: 어떤 도메인 문자열/타입도 하드코딩하지 않는다. common/(base·composites)만 사용 — raw 직접 import 금지.
import * as React from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { charFilter } from '@/ui/biz/cm/search/searchFilterSchema'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SegmentedControl } from '@/ui/common/base/SegmentedControl'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { SelectionFieldBox } from '@/ui/common/base/SelectionFieldBox'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { CheckboxGroup } from '@/ui/common/composites/CheckboxGroup'
import { DateInput } from '@/ui/common/composites/DateInput'
import { DateRangeInput } from '@/ui/common/composites/DateRangeInput'
import { MonthRangeInput, type MonthRange } from '@/ui/common/composites/MonthRangeInput'
import { NavigationItemList } from '@/ui/common/composites/NavigationItemList'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { RangeSliderInput } from '@/ui/common/composites/RangeSliderInput'
import { YearInput } from '@/ui/common/composites/YearInput'
import type {
  DateRangeValue,
  PriceRangeValue,
  SearchFilterField as FieldDef,
  SearchFilterFieldValue,
  SelectionFieldDef,
} from '@/types/search-filter'

export interface SearchFilterFieldProps {
  field: FieldDef
  value: SearchFilterFieldValue | undefined
  onChange: (value: SearchFilterFieldValue) => void
  /** selectionField 터치 시 페이지로 위임(자체 팝업). 셸→페이지 콜백. */
  onSelectionClick?: (key: string, current: string, commit: (value: string) => void) => void
  /** 검증 실패 — 셸이 fieldState.error 로 넘김. 지원하는 컨트롤(InputBox·SelectBox·기간·날짜·가격·선택필드)에 빨간 테두리. */
  error?: boolean
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

// 대표품명/발주기관 등 — 선택 트리거(`>`). 터치 시 BottomSheet(슬롯) 안에 NavigationItemList 를
// 조립해 띄운다(A안 슬롯 조합). 목록(sheetItems)은 사용 화면의 schema 에 하드코딩되며, 항목 선택 시
// 그 label 이 필드 값으로 채워진다. sheetItems 미지정 시 추후 커스텀 팝업(P71 등) 연계 자리.
// (open 상태가 필요해 별도 컴포넌트로 분리 — 디스패처 switch 안에서는 hook 불가.)
function SelectionFieldControl({
  field,
  value,
  onChange,
  onSelectionClick,
  error,
}: {
  field: SelectionFieldDef
  value: string
  onChange: (value: string) => void
  onSelectionClick?: (key: string, current: string, commit: (value: string) => void) => void
  error?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const items = field.sheetItems ?? []
  const hasSheet = items.length > 0

  // 우선순위: 내장 바텀시트(sheetItems, 자기완결) > 위임(onSelectionClick — 셸의 공통 검색시트/외부 팝업) > 무동작
  const handleClick = () => {
    if (hasSheet) {
      setOpen(true)
      return
    }
    onSelectionClick?.(field.key, value, (v) => onChange(v))
  }

  return (
    <Field label={field.label} required={field.required}>
      <SelectionFieldBox
        value={value}
        placeholder={field.placeholder}
        error={error}
        onClick={handleClick}
        onClear={() => onChange('')}
      />
      {hasSheet && (
        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          title={field.sheetTitle ?? field.label ?? '선택'}
        >
          <NavigationItemList
            items={items.map((opt) => ({
              id: opt.value,
              label: opt.label,
              onClick: () => {
                onChange(opt.label)
                setOpen(false)
              },
            }))}
          />
        </BottomSheet>
      )}
    </Field>
  )
}

const SearchFilterField = ({
  field,
  value,
  onChange,
  onSelectionClick,
  error,
}: SearchFilterFieldProps) => {
  switch (field.type) {
    // ⚠️ 에러 테두리(error) 미지원 컨트롤: radio·segment·checkbox·monthRange·year — 해당 공통 컴포넌트에 error 프롭이
    //    없어 문구(셸 InputMessage)만 표시된다. 필요 시 공통 컴포넌트에 error 프롭 추가(사용자 확인 후).
    // 라디오 그룹 — 기본 세로(검색유형). field.direction='horizontal' 이면 가로(예: 신기술여부 예/아니오).
    case 'radio':
      return (
        <Field label={field.label} required={field.required}>
          <RadioButtonGroup
            direction={field.direction ?? 'vertical'}
            value={(value as string) ?? ''}
            onValueChange={(v) => onChange(v)}
            items={field.options}
            showIndicator={field.showIndicator}
          />
        </Field>
      )

    // 일자 설정 상단 등 — 세그먼트(택1). 단일 옵션이면 날짜 유형 라벨/지표(발주예정월·접수기간).
    case 'segment':
      return (
        <Field label={field.label} required={field.required}>
          <SegmentedControl
            items={field.options}
            value={(value as string) ?? field.options[0]?.value}
            onValueChange={(v) => onChange(v)}
          />
        </Field>
      )

    // 업무구분 등 — 다중 선택(가로 스와이프). Figma m_checkbox_button + m_button_arrow_swiper.
    case 'checkbox':
      return (
        <Field label={field.label} required={field.required}>
          <CheckboxGroup
            swipeable={field.swipeable ?? true}
            selectAll={field.selectAll}
            value={(value as string[]) ?? []}
            onValueChange={(v) => onChange(v)}
            items={field.options}
          />
        </Field>
      )

    // 일자 설정 — 기간(빠른설정 칩 내장).
    case 'dateRange':
      return (
        <Field label={field.label} required={field.required}>
          <DateRangeInput
            error={error}
            value={(value as DateRangeValue) ?? EMPTY_RANGE}
            onChange={(r) => onChange(r)}
            showPresets={field.showPresets}
            presets={field.presets}
          />
        </Field>
      )

    // 월 범위 — MonthRangeInput(YYYY-MM, 트리거 → 바텀시트 년·월 휠). 조달계획 발주예정월 등.
    case 'monthRange':
      return (
        <Field label={field.label} required={field.required}>
          <MonthRangeInput
            value={(value as MonthRange | undefined) ?? undefined}
            onChange={(r) => onChange(r)}
            showPresets={field.showPresets}
            presets={field.presets}
          />
        </Field>
      )

    // 연도만 선택 — YearInput(트리거 → 바텀시트 연도 휠)
    case 'year':
      return (
        <Field label={field.label} required={field.required}>
          <YearInput
            value={(value as string) ?? ''}
            onChange={(v) => onChange(v)}
            placeholder={field.placeholder}
          />
        </Field>
      )

    // 단일 날짜
    case 'date':
      return (
        <Field label={field.label} required={field.required}>
          <DateInput
            error={error}
            value={(value as string) ?? ''}
            onChange={(s) => onChange(s)}
            placeholder={field.placeholder}
          />
        </Field>
      )

    // 제목/판단번호/담당자 등 — 자유 입력. minLength/maxLength 는 native 속성으로도 전달(maxLength 는 타이핑 차단,
    // 미지정 시 InputBox 기본 100). 실제 검사는 셸의 zod 매핑(buildZodSchema).
    // allowedChars 가 있으면 InputBox format 으로 입력 즉시 비허용 문자 제거(IME 가드 포함) — pattern 은 검색 시점 검사.
    case 'text':
      return (
        <Field label={field.label} required={field.required}>
          <InputBox
            error={error}
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            minLength={field.minLength}
            maxLength={field.maxLength}
            format={field.allowedChars ? charFilter(field.allowedChars) : undefined}
            onChange={(e) => onChange(e.target.value)}
            onClear={() => onChange('')}
          />
        </Field>
      )

    // 대표품명/발주기관 등 — 선택 트리거(`>`). 터치 → 선택 바텀시트(목록은 화면 schema 에 하드코딩)
    case 'selectionField':
      return (
        <SelectionFieldControl
          field={field}
          value={(value as string) ?? ''}
          onChange={onChange}
          onSelectionClick={onSelectionClick}
          error={error}
        />
      )

    // 구분설정 — 드롭다운
    case 'select':
      return (
        <Field label={field.label} required={field.required}>
          <SelectBox
            error={error}
            value={(value as string) ?? ''}
            onValueChange={(v) => onChange(v)}
            items={field.options}
            placeholder={field.placeholder}
          />
        </Field>
      )

    // 추정가격 등 — 가격 범위(공통 RangeSliderInput: min/max 입력 + 듀얼 슬라이더)
    case 'priceRange': {
      const pr = (value as PriceRangeValue | undefined) ?? {
        min: field.rangeMin ?? 0,
        max: field.rangeMax ?? 100_000_000,
      }
      return (
        <Field label={field.label} required={field.required}>
          <RangeSliderInput
            error={error}
            value={pr}
            onChange={onChange}
            min={field.rangeMin ?? 0}
            max={field.rangeMax ?? 100_000_000}
            step={field.step ?? 1_000_000}
            unit={field.unit ?? '원'}
            ariaLabel={typeof field.label === 'string' ? field.label : '가격'}
          />
        </Field>
      )
    }

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
