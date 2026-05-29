// Figma m_date_input 1:1 — 단일 날짜 입력 컴포지트.
// 페이지 입장: <DateInput value={x} onChange={setX} label="..." /> 한 줄만.
// 내부: Label + DateInputBox(트리거, readOnly) + helper text + BottomSheet { 시트 내 DateInputBox(편집) + Calendar + 확인 버튼 }.
// 동기화 정책: 시트 내부는 tempValue 로 격리 → 확인 클릭 시에만 onChange. 외부 클릭/Esc 시 변경 폐기.
import * as React from 'react'
import dayjs from 'dayjs'

import { Button } from '@/ui/common/base/Button'
import { Calendar } from '@/ui/common/base/Calendar'
import { DateInputBox } from '@/ui/common/base/DateInputBox'
import { Label } from '@/ui/common/base/Label'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { cn } from '@/utils/cn'

export interface DateInputProps {
  /** controlled value — 'YYYY-MM-DD' */
  value?: string
  onChange?: (value: string) => void
  label?: React.ReactNode
  /** 라벨 옆 필수 표시 */
  required?: boolean
  /** 하단 안내 메시지 (error 가 true 면 빨강) */
  helperText?: React.ReactNode
  error?: boolean
  disabled?: boolean
  /** 트리거 placeholder */
  placeholder?: string
  /** 시트 타이틀. 기본 "일자 선택" */
  sheetTitle?: React.ReactNode
  /** 시트 캘린더의 공휴일 fetcher (Calendar prop 그대로 전달) */
  fetchHolidays?: (year: number, month: number) => Promise<string[]>
  /** 캘린더 선택 가능 최소/최대 날짜 */
  minDate?: string
  maxDate?: string
  className?: string
  id?: string
}

const DATE_FORMAT = 'YYYY-MM-DD'

function isValidDateString(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  return dayjs(s, DATE_FORMAT, true).isValid()
}

const DateInput = ({
  value,
  onChange,
  label,
  required,
  helperText,
  error = false,
  disabled = false,
  placeholder = '일자를 선택해주세요.',
  sheetTitle = '일자 선택',
  fetchHolidays,
  minDate,
  maxDate,
  className,
  id,
}: DateInputProps) => {
  const [open, setOpen] = React.useState(false)
  const [temp, setTemp] = React.useState<string>(value ?? '')
  const [tempError, setTempError] = React.useState(false)

  // 시트 열릴 때마다 외부 value 로 temp 초기화
  React.useEffect(() => {
    if (open) {
      setTemp(value ?? '')
      setTempError(false)
    }
  }, [open, value])

  const openSheet = () => {
    if (disabled) return
    setOpen(true)
  }

  const handleSheetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setTemp(v)
    // 입력 중에는 에러 상태 즉시 갱신하지 않고, 10자 완성 시에만 검증
    if (v.length === 10) setTempError(!isValidDateString(v))
    else if (v.length === 0) setTempError(false)
  }

  const handleCalendarChange = (v: string | { start: string | null; end: string | null }) => {
    if (typeof v === 'string') {
      setTemp(v)
      setTempError(false)
    }
  }

  const handleClearTemp = () => {
    setTemp('')
    setTempError(false)
  }

  const handleConfirm = () => {
    if (temp && !isValidDateString(temp)) {
      setTempError(true)
      return
    }
    onChange?.(temp)
    setOpen(false)
  }

  return (
    <div className={cn('flex w-full flex-col gap-krds-4', className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}

      <DateInputBox
        id={id}
        value={value ?? ''}
        readOnly
        onClick={openSheet}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openSheet()
          }
        }}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(!disabled && 'cursor-pointer')}
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
          <DateInputBox
            value={temp}
            onChange={handleSheetInput}
            onClear={handleClearTemp}
            error={tempError}
            placeholder={placeholder}
            maxLength={10}
            autoFocus
          />
          <Calendar
            mode="single"
            value={isValidDateString(temp) ? temp : null}
            onChange={handleCalendarChange}
            fetchHolidays={fetchHolidays}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      </BottomSheet>
    </div>
  )
}
DateInput.displayName = 'DateInput'

export { DateInput }
