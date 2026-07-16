// Figma m_date_range_input_box(9052-1558) 1:1 — 5 state(default/filled/focus/error/error_focus).
// 한 박스 안에 [시작일 input] [~] [종료일 input]. 외곽 border/bg 는 두 input 공통(focus-within).
// withCalendar 면 어느 한 쪽 input 클릭/focus 시 박스 바로 아래에 range 모드 Calendar 드롭다운.
import * as React from 'react'

import {
  Calendar,
  type DateRangeValue as CalendarRangeValue,
} from '@/ui/common/base/Calendar'
import { Icon } from '@/ui/common/base/Icon'
import { Input as RawInput } from '@/ui/raw/input'
import { cn } from '@/utils/cn'
import { formatDateInput } from '@/utils/format'

export interface DateRangeValue {
  start: string
  end: string
}

export interface DateRangeInputBoxProps {
  value?: DateRangeValue
  onChange?: (value: DateRangeValue) => void
  /** 시작/종료 어느 한 쪽 X 버튼 클릭 시 호출. 'start' 또는 'end'. */
  onClear?: (side: 'start' | 'end') => void
  error?: boolean
  disabled?: boolean
  /** placeholder 두 쪽 */
  startPlaceholder?: string
  endPlaceholder?: string
  /** input 요소에 그대로 전달 (autoFocus 등). 양쪽 공통. */
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'placeholder' | 'disabled'
  >
  /** true 면 input 클릭/focus 시 박스 바로 아래에 range 모드 Calendar 드롭다운 노출. */
  withCalendar?: boolean
  /** Calendar 공휴일 fetcher (withCalendar 일 때만 전달). */
  fetchHolidays?: (year: number, month: number) => Promise<string[]>
  className?: string
}

const DateRangeInputBox = React.forwardRef<HTMLDivElement, DateRangeInputBoxProps>(
  (
    {
      value = { start: '', end: '' },
      onChange,
      onClear,
      error = false,
      disabled = false,
      startPlaceholder = '시작일 선택',
      endPlaceholder = '종료일 선택',
      inputProps,
      withCalendar = false,
      fetchHolidays,
      className,
    },
    ref,
  ) => {
    const wrapRef = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => wrapRef.current as HTMLDivElement)
    const [open, setOpen] = React.useState(false)

    // 숫자만 허용 + YYYY-MM-DD 하이픈 자동 마킹 (controlled 라 마스킹 결과가 그대로 반영됨)
    const handleStart = (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange?.({ start: formatDateInput(e.target.value), end: value.end })
    const handleEnd = (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange?.({ start: value.start, end: formatDateInput(e.target.value) })

    const openCalendar = () => {
      if (withCalendar && !disabled) setOpen(true)
    }

    // Calendar(range) 선택 → value 반영. 시작·종료 모두 정해지면 닫기.
    const handleCalendarChange = (v: string | CalendarRangeValue) => {
      if (typeof v === 'string') return
      onChange?.({ start: v.start ?? '', end: v.end ?? '' })
      if (v.start && v.end) setOpen(false)
    }

    // 외부 클릭 시 닫기
    React.useEffect(() => {
      if (!open) return
      const onDocDown = (e: MouseEvent) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', onDocDown)
      return () => document.removeEventListener('mousedown', onDocDown)
    }, [open])

    return (
      <div ref={wrapRef} className={cn('relative', className)}>
        <div
          className={cn(
            'group flex h-12 w-full items-center justify-center gap-krds-5 rounded-krds-8 border px-krds-6 transition-colors',
            error
              ? 'border-krds-border-danger bg-krds-bg-danger-subtle focus-within:border-2'
              : 'border-krds-border-field bg-background focus-within:border-2 focus-within:border-krds-action-primary-active',
            disabled && 'border-krds-border-disabled bg-krds-bg-disabled-soft',
          )}
        >
          <SideInput
            value={value.start}
            onChange={handleStart}
            onClear={() => onClear?.('start')}
            onOpen={openCalendar}
            placeholder={startPlaceholder}
            disabled={disabled}
            inputProps={inputProps}
          />
          <span
            className={cn(
              'shrink-0 text-krds-body-md text-krds-text-ink',
              disabled && 'text-krds-text-disabled',
            )}
            aria-hidden
          >
            ~
          </span>
          <SideInput
            value={value.end}
            onChange={handleEnd}
            onClear={() => onClear?.('end')}
            onOpen={openCalendar}
            placeholder={endPlaceholder}
            disabled={disabled}
            inputProps={inputProps}
          />
        </div>

        {withCalendar && open && !disabled && (
          <div className="absolute top-full left-0 z-50 mt-1 w-[328px] rounded-krds-lg border border-border bg-background p-3 shadow-krds-2">
            <Calendar
              mode="range"
              value={{ start: value.start || null, end: value.end || null }}
              onChange={handleCalendarChange}
              fetchHolidays={fetchHolidays}
            />
          </div>
        )}
      </div>
    )
  },
)
DateRangeInputBox.displayName = 'DateRangeInputBox'

interface SideInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  onOpen: () => void
  placeholder: string
  disabled: boolean
  inputProps?: DateRangeInputBoxProps['inputProps']
}

function SideInput({
  value,
  onChange,
  onClear,
  onOpen,
  placeholder,
  disabled,
  inputProps,
}: SideInputProps) {
  const [focused, setFocused] = React.useState(false)
  return (
    <div className="relative flex min-w-0 flex-1 items-center">
      <RawInput
        {...inputProps}
        value={value}
        onChange={onChange}
        // 내부 캘린더(onOpen)와 함께 inputProps.onClick(예: DateRangeInput 의 BottomSheet openSheet)도 호출한다.
        // (기존엔 onClick={onOpen} 이 inputProps.onClick 을 덮어써, 클릭/탭으로 시트가 안 열리던 버그를 수정)
        onClick={(e) => {
          onOpen()
          inputProps?.onClick?.(e)
        }}
        onFocus={(e) => {
          setFocused(true)
          onOpen()
          inputProps?.onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          inputProps?.onBlur?.(e)
        }}
        disabled={disabled}
        inputMode="numeric"
        maxLength={10}
        placeholder={placeholder}
        className={cn(
          'min-w-0 flex-1 border-none bg-transparent p-0 text-center text-krds-body-md text-krds-text-ink shadow-none outline-hidden ring-0 ring-offset-0',
          'focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-krds-text-disabled disabled:cursor-not-allowed',
        )}
      />
      {focused && value && !disabled && (
        <button
          type="button"
          aria-label="입력 내용 지우기"
          onMouseDown={(e) => e.preventDefault()} // blur 방지 — 클리어 후 input 유지
          onClick={onClear}
          // absolute 오버레이 — 레이아웃 폭을 안 먹어 input 풀폭 유지(텍스트 안 잘림 + 가운데 정렬).
          // top-1/2 -translate-y-1/2 로 수직 중앙 고정.
          className="absolute top-1/2 right-0 flex shrink-0 -translate-y-1/2 items-center text-krds-text-disabled"
        >
          <Icon name="Close" size={20} aria-hidden />
        </button>
      )}
    </div>
  )
}

export { DateRangeInputBox }
