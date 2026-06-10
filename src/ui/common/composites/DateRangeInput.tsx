// Figma m_date_range_input 1:1 — 기간(시작~종료) 입력 컴포지트.
// 페이지 입장: <DateRangeInput value={{start, end}} onChange={setRange} /> 한 줄.
// 내부: Label + 프리셋 칩(1주일/1개월/3개월/기간검색) + DateRangeInputBox(트리거) + helper + BottomSheet { 시트 내 DateRangeInputBox(편집) + Calendar(range) + 확인 }.
// 동기화 정책: 시트 내부는 tempRange 격리 → 확인 클릭 시에만 onChange.
import * as React from 'react'
import dayjs from 'dayjs'

import { Button } from '@/ui/common/base/Button'
import { Calendar, type DateRangeValue } from '@/ui/common/base/Calendar'
import { DateRangeInputBox } from '@/ui/common/base/DateRangeInputBox'
import { Label } from '@/ui/common/base/Label'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { cn } from '@/utils/cn'

export interface DateRange {
  start: string
  end: string
}

export type DateRangePreset =
  | { label: string; days: number } // end = today, start = today - days
  | { label: string; months: number } // end = today, start = today - months
  | { label: string; custom: true } // 사용자가 직접 캘린더에서 선택

export interface DateRangeInputProps {
  value?: DateRange
  onChange?: (value: DateRange) => void
  label?: React.ReactNode
  required?: boolean
  helperText?: React.ReactNode
  error?: boolean
  disabled?: boolean
  /** 프리셋 칩 — 기본: 1주일 / 1개월 / 3개월 / 기간검색 */
  presets?: DateRangePreset[]
  /** 프리셋 칩(빠른 선택 버튼) UI 표시 여부. 기본 true. false 면 트리거 박스만 노출. */
  showPresets?: boolean
  sheetTitle?: React.ReactNode
  fetchHolidays?: (year: number, month: number) => Promise<string[]>
  minDate?: string
  maxDate?: string
  /** 캘린더 상단 년/월 선택 UI — 'wheel'(기본, 휠) | 'select'(SelectBox). Calendar 로 전달. */
  yearMonthMode?: 'wheel' | 'select'
  className?: string
  id?: string
}

const DATE_FORMAT = 'YYYY-MM-DD'

const DEFAULT_PRESETS: DateRangePreset[] = [
  { label: '1주일', days: 7 },
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '기간검색', custom: true },
]

function isValidDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  return dayjs(s, DATE_FORMAT, true).isValid()
}

function computePresetRange(preset: DateRangePreset): DateRange {
  if ('custom' in preset) return { start: '', end: '' }
  const today = dayjs()
  if ('days' in preset) {
    return {
      start: today.subtract(preset.days, 'day').format(DATE_FORMAT),
      end: today.format(DATE_FORMAT),
    }
  }
  // months
  return {
    start: today.subtract(preset.months, 'month').format(DATE_FORMAT),
    end: today.format(DATE_FORMAT),
  }
}

const EMPTY_RANGE: DateRange = { start: '', end: '' }

const DateRangeInput = ({
  value,
  onChange,
  label,
  required,
  helperText,
  error = false,
  disabled = false,
  presets = DEFAULT_PRESETS,
  showPresets = true,
  sheetTitle = '기간 선택',
  fetchHolidays,
  minDate,
  maxDate,
  yearMonthMode = 'wheel',
  className,
  id,
}: DateRangeInputProps) => {
  const [open, setOpen] = React.useState(false)
  const [temp, setTemp] = React.useState<DateRange>(value ?? EMPTY_RANGE)
  const [tempError, setTempError] = React.useState(false)
  const [activePresetIdx, setActivePresetIdx] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (open) {
      setTemp(value ?? EMPTY_RANGE)
      setTempError(false)
      // activePresetIdx 는 여기서 초기화하지 않는다 — 시트 취소 시 이전 선택 칩이 풀리지 않도록.
    }
  }, [open, value])

  const openSheet = () => {
    if (disabled) return
    setOpen(true)
  }

  const handleSheetInputChange = (next: DateRange) => {
    setTemp(next)
    setActivePresetIdx(null)
    setTempError(false)
  }

  const handleClearSide = (side: 'start' | 'end') => {
    setTemp((cur) => ({ ...cur, [side]: '' }))
    setActivePresetIdx(null)
  }

  // 페이지 트리거 옆 프리셋 칩 클릭 — 시트 안 열고 즉시 onChange (UX 가속용)
  const handlePagePresetClick = (idx: number) => {
    if (disabled) return
    const preset = presets[idx]
    if ('custom' in preset) {
      openSheet()
      return
    }
    onChange?.(computePresetRange(preset))
    setActivePresetIdx(idx)
  }

  const handleCalendarChange = (v: string | DateRangeValue) => {
    if (typeof v === 'string') return
    setTemp({ start: v.start ?? '', end: v.end ?? '' })
    setActivePresetIdx(null)
    setTempError(false)
  }

  const handleConfirm = () => {
    const startOk = !temp.start || isValidDate(temp.start)
    const endOk = !temp.end || isValidDate(temp.end)
    const orderOk = !(temp.start && temp.end) || temp.start <= temp.end
    if (!startOk || !endOk || !orderOk) {
      setTempError(true)
      return
    }
    onChange?.(temp)
    // 시트에서 직접 기간을 고른 것 = 'custom'(기간검색) 선택 → 해당 프리셋 칩 활성화.
    const customIdx = presets.findIndex((p) => 'custom' in p)
    setActivePresetIdx(customIdx >= 0 ? customIdx : null)
    setOpen(false)
  }

  const calendarValue: DateRangeValue = {
    start: isValidDate(temp.start) ? temp.start : null,
    end: isValidDate(temp.end) ? temp.end : null,
  }

  return (
    <div className={cn('flex w-full flex-col gap-krds-4', className)}>
      {label && <Label htmlFor={id} required={required}>{label}</Label>}

      {/* 프리셋 빠른 선택 — 라디오 버튼 그룹(원형 없는 pill, showIndicator 기본 false). showPresets 로 on/off */}
      {showPresets && (
        <RadioButtonGroup
          direction="horizontal"
          value={activePresetIdx != null ? presets[activePresetIdx].label : ''}
          onValueChange={(label) => {
            const idx = presets.findIndex((p) => p.label === label)
            if (idx >= 0) handlePagePresetClick(idx)
          }}
          disabled={disabled}
          // flex-nowrap: 프리셋 칩들은 한 줄 유지(아래로 안 떨어짐).
          className="flex-nowrap"
          // 칩이 내용 너비를 확보(텍스트 넘침 X)한 뒤 grow 로 행을 꽉 채움 → 버튼 행 너비 = 아래 input 과 동일.
          //  - min-w-0: base 의 min-w-[74px] 바닥 제거(작은 칩이 행을 input 보다 넓게 밀어내던 원인) — 직접 width 미지정.
          //  - px-krds-5: 패딩 살짝 축소해 4칩이 컨테이너(320) 안에 들어오게.
          //  - flex-[1_0_auto]: 줄지 않고(텍스트 보존) 남는 폭만큼 늘어 행을 채움.
          itemClassName="flex-[1_0_auto] min-w-0 whitespace-nowrap px-krds-5"
          items={presets.map((p) => ({ value: p.label, label: p.label }))}
        />
      )}

      {/* 트리거 박스 */}
      <DateRangeInputBox
        value={value ?? EMPTY_RANGE}
        error={error}
        disabled={disabled}
        inputProps={{
          readOnly: true,
          onClick: openSheet,
          onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openSheet()
            }
          },
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
        }}
      />

      {helperText && (
        <p
          className={cn(
            'text-krds-body-sm',
            error ? 'text-krds-feedback-danger' : 'text-krds-text-subtle',
          )}
        >
          {helperText}
        </p>
      )}

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title={sheetTitle}
        footer={
          <Button className="w-full" onClick={handleConfirm}>
            확인
          </Button>
        }
      >
        <div className="flex flex-col gap-krds-8">
          <DateRangeInputBox
            value={temp}
            onChange={handleSheetInputChange}
            onClear={handleClearSide}
            error={tempError}
          />
          <Calendar
            mode="range"
            value={calendarValue}
            onChange={handleCalendarChange}
            fetchHolidays={fetchHolidays}
            minDate={minDate}
            maxDate={maxDate}
            yearMonthMode={yearMonthMode}
          />
        </div>
      </BottomSheet>
    </div>
  )
}
DateRangeInput.displayName = 'DateRangeInput'

export { DateRangeInput }
