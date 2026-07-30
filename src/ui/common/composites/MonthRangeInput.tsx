// 월 범위(YYYY-MM ~ YYYY-MM) 선택 컴포지트 — 조달계획 발주예정월(월 단위 검색) 등 "일 단위가 필요 없는 기간".
// YearInput(트리거+휠 시트) 패턴 + DateRangeInput 의 프리셋 칩 규칙을 월 단위로 축소한 조합.
//   Label + 프리셋 칩(최근 1/3/6개월 등) + 트리거(readonly InputBox 'YYYY.MM ~ YYYY.MM')
//   + BottomSheet { 시작월/종료월 세그먼트 + 년·월 WheelPicker + 확인 }.
// 칩 활성 = 현재 value 가 프리셋 범위(이번 달 기준)와 정확히 일치할 때만(값 파생, 저장 상태 없음) — DateRangeInput 과 동일 정책.
// 동기화 정책: 시트 내부는 temp 격리 → 확인 클릭 시에만 onChange. 시작월 > 종료월이면 확인 차단 + 에러 문구.
import * as React from 'react'
import dayjs from 'dayjs'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { Label } from '@/ui/common/base/Label'
import { SegmentedControl } from '@/ui/common/base/SegmentedControl'
import { WheelPicker } from '@/ui/common/base/WheelPicker'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { cn } from '@/utils/cn'

export interface MonthRange {
  /** 'YYYY-MM' */
  start: string
  /** 'YYYY-MM' */
  end: string
}

export interface MonthRangePreset {
  label: string
  /** 최근 N개월 — end=이번 달, start=end-(N-1)개월(포함 범위). */
  months: number
}

export interface MonthRangeInputProps {
  value?: MonthRange
  onChange?: (value: MonthRange) => void
  label?: React.ReactNode
  required?: boolean
  disabled?: boolean
  /** 프리셋 칩 — 기본: 최근 1/3/6개월. */
  presets?: MonthRangePreset[]
  /** 프리셋 칩 표시 여부. 기본 true. */
  showPresets?: boolean
  sheetTitle?: React.ReactNode
  /** 선택 가능 연도 범위. 기본 현재-10 ~ 현재+10. */
  minYear?: number
  maxYear?: number
  className?: string
  id?: string
}

const MONTH_FORMAT = 'YYYY-MM'
const EMPTY_RANGE: MonthRange = { start: '', end: '' }

const DEFAULT_PRESETS: MonthRangePreset[] = [
  { label: '최근 1개월', months: 1 },
  { label: '최근 3개월', months: 3 },
  { label: '최근 6개월', months: 6 },
]

/** 최근 N개월 범위 — end=이번 달, start=end-(N-1)개월(포함 N개월). */
function computePresetRange(preset: MonthRangePreset): MonthRange {
  const end = dayjs()
  return {
    start: end.subtract(preset.months - 1, 'month').format(MONTH_FORMAT),
    end: end.format(MONTH_FORMAT),
  }
}

const display = (ym: string) => (ym ? ym.replace('-', '.') : '')

const MonthRangeInput = ({
  value,
  onChange,
  label,
  required,
  disabled = false,
  presets = DEFAULT_PRESETS,
  showPresets = true,
  sheetTitle = '기간 선택',
  minYear,
  maxYear,
  className,
  id,
}: MonthRangeInputProps) => {
  const now = dayjs()
  const min = minYear ?? now.year() - 10
  const max = maxYear ?? now.year() + 10
  const years = React.useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  )

  const [open, setOpen] = React.useState(false)
  const [side, setSide] = React.useState<'start' | 'end'>('start')
  const [temp, setTemp] = React.useState<MonthRange>(value ?? EMPTY_RANGE)
  const [tempError, setTempError] = React.useState(false)

  // 활성 칩 — 현재 value 가 프리셋 범위(이번 달 기준)와 정확히 일치할 때만(값 파생).
  const activeLabel =
    value?.start && value?.end
      ? (presets.find((p) => {
          const r = computePresetRange(p)
          return r.start === value.start && r.end === value.end
        })?.label ?? '')
      : ''

  const openSheet = () => {
    if (disabled) return
    setTemp(value?.start && value?.end ? value : { start: now.format(MONTH_FORMAT), end: now.format(MONTH_FORMAT) })
    setSide('start')
    setTempError(false)
    setOpen(true)
  }

  // 프리셋 칩 클릭 — 시트 안 열고 즉시 onChange (DateRangeInput 과 동일 UX).
  const handlePresetClick = (idx: number) => {
    if (disabled) return
    onChange?.(computePresetRange(presets[idx]))
  }

  // 휠 변경 — 현재 세그먼트(시작월/종료월) 쪽 temp 만 갱신.
  const tempSide = dayjs(`${temp[side] || now.format(MONTH_FORMAT)}-01`)
  const handleWheel = (key: string, v: number) => {
    const cur = tempSide
    const next = key === 'year' ? cur.year(v) : cur.month(v - 1)
    setTemp((prev) => ({ ...prev, [side]: next.format(MONTH_FORMAT) }))
    setTempError(false)
  }

  const handleConfirm = () => {
    if (!temp.start || !temp.end || temp.start > temp.end) {
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

      {/* 프리셋 빠른 선택 — DateRangeInput 과 동일한 pill 그룹(파생 활성) */}
      {showPresets && (
        <RadioButtonGroup
          direction="horizontal"
          value={activeLabel}
          onValueChange={(label) => {
            const idx = presets.findIndex((p) => p.label === label)
            if (idx >= 0) handlePresetClick(idx)
          }}
          disabled={disabled}
          className="flex-nowrap"
          itemClassName="flex-[1_0_auto] min-w-0 whitespace-nowrap px-krds-5"
          items={presets.map((p) => ({ value: p.label, label: p.label }))}
        />
      )}

      {/* 트리거 — 읽기전용 박스. combobox 패턴(YearInput 과 동일). */}
      <InputBox
        id={id}
        value={value?.start || value?.end ? `${display(value.start)} ~ ${display(value.end)}` : ''}
        readOnly
        onClick={openSheet}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openSheet()
          }
        }}
        placeholder="기간을 선택하세요."
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
        <div className="flex flex-col gap-krds-7">
          {/* 시작월/종료월 전환 — 현재 편집 대상 표시 */}
          <SegmentedControl
            value={side}
            onValueChange={(v) => v && setSide(v as 'start' | 'end')}
            itemClassName="flex-1"
            items={[
              { value: 'start', label: `시작월 ${display(temp.start) || '--'}` },
              { value: 'end', label: `종료월 ${display(temp.end) || '--'}` },
            ]}
          />

          <WheelPicker
            columns={[
              {
                key: 'year',
                ariaLabel: '연도',
                width: 120,
                align: 'center',
                items: years.map((y) => ({ value: y, label: `${y}년` })),
              },
              {
                key: 'month',
                ariaLabel: '월',
                width: 100,
                align: 'center',
                items: Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}월` })),
              },
            ]}
            value={{ year: tempSide.year(), month: tempSide.month() + 1 }}
            onChange={handleWheel}
          />

          {tempError && (
            <p className="text-krds-body-sm text-krds-feedback-danger">
              시작월이 종료월보다 늦을 수 없습니다.
            </p>
          )}
        </div>
      </BottomSheet>
    </div>
  )
}
MonthRangeInput.displayName = 'MonthRangeInput'

export { MonthRangeInput }
