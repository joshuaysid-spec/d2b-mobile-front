// 연도 선택 피커 — 트리거(readonly InputBox) → BottomSheet(단일 컬럼 연도 휠 WheelPicker) → 확인 시 commit.
// DateInput 패턴의 연도 전용 축소판. value 는 'YYYY' 문자열.
// 동기화 정책: 시트 내부는 temp 로 격리 → 확인 클릭 시에만 onChange.
import * as React from 'react'
import dayjs from 'dayjs'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { Label } from '@/ui/common/base/Label'
import { WheelPicker } from '@/ui/common/base/WheelPicker'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { cn } from '@/utils/cn'

export interface YearInputProps {
  /** 'YYYY' */
  value?: string
  onChange?: (value: string) => void
  label?: React.ReactNode
  required?: boolean
  placeholder?: string
  disabled?: boolean
  sheetTitle?: React.ReactNode
  /** 선택 가능 연도 범위. 기본 현재-10 ~ 현재+10 */
  minYear?: number
  maxYear?: number
  className?: string
  id?: string
}

const YearInput = ({
  value,
  onChange,
  label,
  required,
  placeholder = '연도를 선택하세요.',
  disabled = false,
  sheetTitle = '연도 선택',
  minYear,
  maxYear,
  className,
  id,
}: YearInputProps) => {
  const now = dayjs().year()
  const min = minYear ?? now - 10
  const max = maxYear ?? now + 10
  const years = React.useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  )

  const [open, setOpen] = React.useState(false)
  const [temp, setTemp] = React.useState<number>(Number(value) || now)

  const openSheet = () => {
    if (disabled) return
    setTemp(Number(value) || now) // 열 때 현재 값으로 초기화
    setOpen(true)
  }

  const handleConfirm = () => {
    onChange?.(String(temp))
    setOpen(false)
  }

  return (
    <div className={cn('flex w-full flex-col gap-krds-4', className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}

      {/* 트리거 — 읽기전용 박스, 클릭 시 시트. combobox 패턴(input 에 aria-haspopup/expanded). */}
      <InputBox
        id={id}
        value={value ? `${value}년` : ''}
        readOnly
        onClick={openSheet}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openSheet()
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        role="combobox"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(!disabled && 'cursor-pointer')}
      />

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
        <WheelPicker
          columns={[
            {
              key: 'year',
              ariaLabel: '연도',
              width: 120,
              items: years.map((y) => ({ value: y, label: `${y}년` })),
            },
          ]}
          value={{ year: temp }}
          onChange={(_, v) => setTemp(v)}
        />
      </BottomSheet>
    </div>
  )
}
YearInput.displayName = 'YearInput'

export { YearInput }
