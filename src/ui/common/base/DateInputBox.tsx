// Figma m_date_input_box(9052-1579) 1:1 — 5 state(default/filled/focus/error/error_focus).
// 텍스트가 가운데 정렬 (일반 InputBox 는 좌측 정렬) · 숫자만 입력 + YYYY-MM-DD 하이픈 자동 마킹.
// withCalendar 면 input 클릭/focus 시 바로 아래에 단일 모드 Calendar 드롭다운 노출(외부 클릭 시 닫힘).
import * as React from 'react'

import { Calendar } from '@/ui/common/base/Calendar'
import { Icon } from '@/ui/common/base/Icon'
import { Input as RawInput } from '@/ui/raw/input'
import { cn } from '@/utils/cn'
import { formatDateInput } from '@/utils/format'

export interface DateInputBoxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  error?: boolean
  /** clear(X) 버튼 핸들러. 주면 focus 시 X 버튼 노출. */
  onClear?: () => void
  /** true 면 input 클릭/focus 시 바로 아래에 단일 모드 Calendar 드롭다운 노출. */
  withCalendar?: boolean
  /** Calendar 공휴일 fetcher (withCalendar 일 때만 전달). */
  fetchHolidays?: (year: number, month: number) => Promise<string[]>
  className?: string
}

const DateInputBox = React.forwardRef<HTMLInputElement, DateInputBoxProps>(
  (
    {
      className,
      error = false,
      onClear,
      disabled,
      placeholder = '일자를 선택해주세요.',
      value,
      onChange,
      onClick,
      onFocus,
      withCalendar = false,
      fetchHolidays,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)
    const wrapRef = React.useRef<HTMLDivElement>(null)
    const [open, setOpen] = React.useState(false)

    // Calendar 하이라이트용 현재 값 — controlled value 우선, 아니면 입력/선택으로 갱신.
    const [picker, setPicker] = React.useState<string>(
      typeof value === 'string' ? value : '',
    )
    React.useEffect(() => {
      if (typeof value === 'string') setPicker(value)
    }, [value])

    // 숫자만 허용 + YYYY-MM-DD 하이픈 자동 마킹. 비숫자는 제거되어 표시되지 않는다.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = formatDateInput(e.target.value)
      setPicker(e.target.value)
      onChange?.(e)
    }

    // Calendar 날짜 선택 → input 값 반영(onChange 와 동일 경로) + 닫기.
    const handleCalendarSelect = (dateStr: string) => {
      const el = inputRef.current
      if (el) {
        el.value = dateStr
        handleChange({
          target: el,
          currentTarget: el,
        } as React.ChangeEvent<HTMLInputElement>)
      } else {
        setPicker(dateStr)
      }
      setOpen(false)
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

    const openCalendar = () => {
      if (withCalendar && !disabled) setOpen(true)
    }

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
          {/* 좌측 균형 스페이서 — 우측 X 버튼(20px)과 동폭으로 두어 focus 시 input 가운데 정렬 유지 */}
          {onClear && !disabled && (
            <span aria-hidden className="hidden w-5 shrink-0 group-focus-within:block" />
          )}
          <RawInput
            ref={inputRef}
            disabled={disabled}
            inputMode="numeric"
            maxLength={10}
            placeholder={placeholder}
            value={value}
            className={cn(
              'min-w-0 flex-1 border-none bg-transparent p-0 text-center text-krds-body-md text-krds-text-ink shadow-none outline-hidden ring-0 ring-offset-0',
              'focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-krds-text-disabled disabled:cursor-not-allowed',
            )}
            {...props}
            onChange={handleChange}
            onClick={(e) => {
              onClick?.(e)
              openCalendar()
            }}
            onFocus={(e) => {
              onFocus?.(e)
              openCalendar()
            }}
          />
          {onClear && !disabled && (
            <button
              type="button"
              aria-label="입력 내용 지우기"
              onClick={onClear}
              className="hidden shrink-0 text-krds-text-disabled group-focus-within:flex"
            >
              <Icon name="Close" size={20} aria-hidden />
            </button>
          )}
        </div>

        {withCalendar && open && !disabled && (
          <div className="absolute top-full left-0 z-50 mt-1 w-[328px] rounded-krds-lg border border-border bg-background p-3 shadow-krds-2">
            <Calendar
              mode="single"
              value={picker || null}
              onChange={(v) => handleCalendarSelect(v as string)}
              fetchHolidays={fetchHolidays}
            />
          </div>
        )}
      </div>
    )
  },
)
DateInputBox.displayName = 'DateInputBox'

export { DateInputBox }
