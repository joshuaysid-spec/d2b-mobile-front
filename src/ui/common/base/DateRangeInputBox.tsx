// Figma m_date_range_input_box(9052-1558) 1:1 — 5 state(default/filled/focus/error/error_focus).
// 한 박스 안에 [시작일 input] [~] [종료일 input]. 외곽 border/bg 는 두 input 공통(focus-within 이면 양쪽 어느 한 쪽에 focus 가 있는 상태).
import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { Input as RawInput } from '@/ui/raw/input'
import { cn } from '@/utils/cn'

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
      className,
    },
    ref,
  ) => {
    const handleStart = (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange?.({ start: e.target.value, end: value.end })
    const handleEnd = (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange?.({ start: value.start, end: e.target.value })

    return (
      <div
        ref={ref}
        className={cn(
          'group flex h-12 w-full items-center justify-center gap-krds-5 rounded-krds-8 border px-krds-6 transition-colors',
          error
            ? 'border-krds-border-danger bg-krds-bg-danger-subtle focus-within:border-2'
            : 'border-krds-border-field bg-background focus-within:border-2 focus-within:border-krds-action-primary-active',
          disabled && 'border-krds-border-disabled bg-krds-bg-disabled-soft',
          className,
        )}
      >
        <SideInput
          value={value.start}
          onChange={handleStart}
          onClear={() => onClear?.('start')}
          placeholder={startPlaceholder}
          disabled={disabled}
          inputProps={inputProps}
        />
        <span
          className={cn(
            'shrink-0 text-krds-body-md',
            value.start || value.end ? 'text-krds-text-ink' : 'text-krds-text-ink',
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
          placeholder={endPlaceholder}
          disabled={disabled}
          inputProps={inputProps}
        />
      </div>
    )
  },
)
DateRangeInputBox.displayName = 'DateRangeInputBox'

interface SideInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  placeholder: string
  disabled: boolean
  inputProps?: DateRangeInputBoxProps['inputProps']
}

function SideInput({
  value,
  onChange,
  onClear,
  placeholder,
  disabled,
  inputProps,
}: SideInputProps) {
  const [focused, setFocused] = React.useState(false)
  return (
    <div className="flex min-w-0 flex-1 items-center gap-krds-5">
      <RawInput
        {...inputProps}
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setFocused(true)
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
          'min-w-0 flex-1 border-none bg-transparent p-0 text-center text-krds-body-md text-krds-text-ink shadow-none outline-hidden ring-0',
          'focus-visible:ring-0 placeholder:text-krds-text-disabled disabled:cursor-not-allowed',
        )}
      />
      {focused && value && !disabled && (
        <button
          type="button"
          aria-label="입력 내용 지우기"
          onMouseDown={(e) => e.preventDefault()} // blur 방지 — 클리어 후 input 유지
          onClick={onClear}
          className="shrink-0 text-krds-text-disabled"
        >
          <Icon name="Close" size={20} aria-hidden />
        </button>
      )}
    </div>
  )
}

export { DateRangeInputBox }
