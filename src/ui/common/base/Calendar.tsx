// Figma m_date_range_picker_calendar(9052-1421) + m_date_picker_date_select_button(9052-1393, 11 state)
// + m_date_picker_year_month_dropdown(9052-1418) + m_date_picker_today_button(9052-1528) 1:1.
//
// 헤더: [« ‹] [년 ▼ 월 ▼] [› »]  — 4개의 40px round 버튼 + 2개의 작은 드롭다운.
// 셀: 40×40 rounded-full, 15px Medium 텍스트. 11 state.
// 공휴일: fetchHolidays prop 으로 외부 주입 (useQuery 가 ['holidays', year, month] 키로 자동 캐시·refetch).
import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { cva } from 'class-variance-authority'

import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export type CalendarMode = 'single' | 'range'

export interface DateRangeValue {
  start: string | null // 'YYYY-MM-DD'
  end: string | null
}

export interface CalendarProps {
  mode?: CalendarMode
  /** single: 'YYYY-MM-DD' | null · range: { start, end } */
  value?: string | DateRangeValue | null
  onChange?: (value: string | DateRangeValue) => void
  /** 공휴일 fetcher — BottomSheet 오픈 / 월 이동 시 자동 호출. 미주입 시 공휴일 비활성. */
  fetchHolidays?: (year: number, month: number) => Promise<string[]>
  /** 일정 dot(schedule) 표시 날짜들 */
  scheduledDates?: string[]
  minDate?: string
  maxDate?: string
  /** 초기 표시 월 — 마운트 시 1회만 적용 */
  initialMonth?: string
  /** 하단 "오늘" 버튼 표시 여부 (Figma m_date_picker_today_button) */
  showTodayButton?: boolean
  className?: string
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

// Figma m_date_picker_date_select_button — 11 state
type CellState =
  | 'default'
  | 'saturday'
  | 'holiday' // = 일요일도 holiday 색으로 (한국 캘린더 관례)
  | 'otherMonth' // 7×6 그리드 채움용 전월/익월 (Figma disabled 색과 동일하지만 의미 분리)
  | 'disabled'
  | 'today'
  | 'selected'
  | 'rangeStart'
  | 'range'
  | 'rangeEnd'

// Figma 정의 그대로:
//  default      → text #2d2d2d (≈ ink)
//  saturday     → text #0054e9 (primary)
//  holiday      → text #ff265e (danger)
//  otherMonth/disabled → text #b2c2df (text-disabled-soft)
//  today        → bg #ecf1fa (bg-primary-faint) + text #0f316e (action-primary-active)
//  selected     → bg #0f316e + text white + rounded-full
//  rangeStart   → bg #0f316e + text white + rounded-l-full
//  range        → bg #ecf1fa + text #2d2d2d
//  rangeEnd     → bg #0f316e + text white + rounded-r-full
const cellVariants = cva(
  cn(
    'relative inline-flex size-10 items-center justify-center text-[15px] font-medium leading-[1.5]',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
  ),
  {
    variants: {
      state: {
        default: 'text-krds-text-ink rounded-full',
        saturday: 'text-krds-text-primary rounded-full',
        holiday: 'text-krds-feedback-danger rounded-full',
        otherMonth: 'text-krds-text-disabled-soft rounded-full',
        disabled: 'text-krds-text-disabled-soft cursor-not-allowed rounded-full',
        today: 'text-krds-action-primary-active rounded-full',
        selected: 'text-white rounded-full',
        rangeStart: 'text-white rounded-l-full',
        range: 'text-krds-text-ink',
        rangeEnd: 'text-white rounded-r-full',
      },
    },
    defaultVariants: { state: 'default' },
  },
)

// 셀 상태별 배경색 — Tailwind 클래스(bg-krds-*) 가 dev HMR/캐시 등의 이유로 미적용되는 경우를
// 방지하기 위해 인라인 style 로 직접 CSS 변수를 가리킨다. 변수 자체는 :root 에서 항상 정의됨.
function getCellBgStyle(state: CellState): React.CSSProperties | undefined {
  switch (state) {
    case 'today':
    case 'range':
      return { backgroundColor: 'var(--krds-bg-primary-faint)' }
    case 'selected':
    case 'rangeStart':
    case 'rangeEnd':
      return { backgroundColor: 'var(--krds-action-primary-active)' }
    default:
      return undefined
  }
}

function isSingle(v: CalendarProps['value']): v is string {
  return typeof v === 'string'
}
function isRange(v: CalendarProps['value']): v is DateRangeValue {
  return !!v && typeof v === 'object' && 'start' in v
}

// 헤더의 40px round 버튼 — Figma m_button_arrow
function RoundIconButton({
  onClick,
  ariaLabel,
  children,
}: {
  onClick: () => void
  ariaLabel: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full',
        'border border-krds-border-field bg-background',
        'text-krds-text-ink hover:bg-muted/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
      )}
    >
      {children}
    </button>
  )
}

// 년/월 드롭다운 — Figma m_date_picker_year_month_dropdown
// native <select> 를 appearance-none 으로 만들고 chevron 을 별도 렌더.
function YearMonthDropdown({
  value,
  onChange,
  options,
  formatLabel,
  ariaLabel,
}: {
  value: number
  onChange: (v: number) => void
  options: number[]
  formatLabel: (v: number) => string
  ariaLabel: string
}) {
  return (
    <div className="relative inline-flex h-[30px] items-center gap-[2px] rounded-krds-8 px-1">
      <span className="text-[15px] font-bold leading-[1.5] text-krds-text-ink">
        {formatLabel(value)}
      </span>
      <Icon name="ExpandMore" size={14} className="text-krds-text-ink" aria-hidden />
      <select
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        aria-label={ariaLabel}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {formatLabel(o)}
          </option>
        ))}
      </select>
    </div>
  )
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      mode = 'single',
      value,
      onChange,
      fetchHolidays,
      scheduledDates = [],
      minDate,
      maxDate,
      initialMonth,
      showTodayButton = false,
      className,
    },
    ref,
  ) => {
    const [cursor, setCursor] = React.useState<Dayjs>(() => {
      if (initialMonth) return dayjs(initialMonth)
      if (mode === 'single' && isSingle(value)) return dayjs(value)
      if (mode === 'range' && isRange(value) && value.start) return dayjs(value.start)
      return dayjs()
    })

    const year = cursor.year()
    const month = cursor.month() + 1

    const { data: holidays = [] } = useQuery({
      queryKey: ['holidays', year, month],
      queryFn: () => fetchHolidays!(year, month),
      enabled: !!fetchHolidays,
      staleTime: 1000 * 60 * 60,
    })

    const holidaySet = React.useMemo(() => new Set(holidays), [holidays])
    const scheduledSet = React.useMemo(() => new Set(scheduledDates), [scheduledDates])

    const cells = React.useMemo(() => {
      const start = cursor.startOf('month').startOf('week')
      return Array.from({ length: 42 }, (_, i) => start.add(i, 'day'))
    }, [cursor])

    const getState = (d: Dayjs): CellState => {
      const dateStr = d.format('YYYY-MM-DD')
      const dow = d.day()
      const inMonth = d.month() === cursor.month()

      if (minDate && dateStr < minDate) return 'disabled'
      if (maxDate && dateStr > maxDate) return 'disabled'

      // 선택 상태 우선
      if (mode === 'single' && isSingle(value) && value === dateStr) return 'selected'
      if (mode === 'range' && isRange(value)) {
        const { start, end } = value
        if (start && end && start === end && dateStr === start) return 'selected'
        if (start && dateStr === start) return end ? 'rangeStart' : 'selected'
        if (end && dateStr === end) return 'rangeEnd'
        if (start && end && dateStr > start && dateStr < end) return 'range'
      }

      if (!inMonth) return 'otherMonth'
      if (holidaySet.has(dateStr)) return 'holiday'
      if (dow === 0) return 'holiday' // 일요일 = holiday 색
      if (dow === 6) return 'saturday'

      if (d.isSame(dayjs(), 'day')) return 'today'

      return 'default'
    }

    const handleSelect = (d: Dayjs) => {
      const dateStr = d.format('YYYY-MM-DD')
      if (mode === 'single') {
        onChange?.(dateStr)
        return
      }
      const cur = isRange(value) ? value : { start: null, end: null }
      if (!cur.start || (cur.start && cur.end)) {
        onChange?.({ start: dateStr, end: null })
      } else {
        if (dateStr < cur.start) onChange?.({ start: dateStr, end: cur.start })
        else onChange?.({ start: cur.start, end: dateStr })
      }
    }

    const goToToday = () => {
      const today = dayjs()
      setCursor(today)
      if (mode === 'single') onChange?.(today.format('YYYY-MM-DD'))
    }

    const yearOptions = React.useMemo(() => {
      const now = dayjs().year()
      return Array.from({ length: 21 }, (_, i) => now - 10 + i)
    }, [])

    const monthOptions = React.useMemo(
      () => Array.from({ length: 12 }, (_, i) => i + 1),
      [],
    )

    return (
      <div
        ref={ref}
        className={cn('flex w-[328px] select-none flex-col bg-background', className)}
      >
        {/* Month Navigation: [«][‹]  [년▼ 월▼]  [›][»] */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <RoundIconButton
              onClick={() => setCursor(cursor.subtract(1, 'year'))}
              ariaLabel="이전 년"
            >
              <Icon name="KeyboardDoubleArrowLeft" size={20} aria-hidden />
            </RoundIconButton>
            <RoundIconButton
              onClick={() => setCursor(cursor.subtract(1, 'month'))}
              ariaLabel="이전 달"
            >
              <Icon name="ChevronLeft" size={20} aria-hidden />
            </RoundIconButton>
          </div>

          <div className="flex items-center gap-1">
            <YearMonthDropdown
              value={year}
              onChange={(y) => setCursor(cursor.year(y))}
              options={yearOptions}
              formatLabel={(v) => `${v}년`}
              ariaLabel="년 선택"
            />
            <YearMonthDropdown
              value={month}
              onChange={(m) => setCursor(cursor.month(m - 1))}
              options={monthOptions}
              formatLabel={(v) => `${v}월`}
              ariaLabel="월 선택"
            />
          </div>

          <div className="flex items-center gap-1">
            <RoundIconButton
              onClick={() => setCursor(cursor.add(1, 'month'))}
              ariaLabel="다음 달"
            >
              <Icon name="ChevronRight" size={20} aria-hidden />
            </RoundIconButton>
            <RoundIconButton
              onClick={() => setCursor(cursor.add(1, 'year'))}
              ariaLabel="다음 년"
            >
              <Icon name="KeyboardDoubleArrowRight" size={20} aria-hidden />
            </RoundIconButton>
          </div>
        </div>

        {/* Calendar Body: px-24 py-16 + gap-8 — 그리드는 7×40px 고정으로 셀 인접면이 항상 flush */}
        <div className="flex w-full flex-col items-center gap-2 px-6 py-4">
          {/* Day container — 일/월/.../토 */}
          <div className="grid grid-cols-[repeat(7,40px)]">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="flex h-10 items-center justify-center text-[15px] font-medium leading-[1.5] text-krds-text-ink"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date container — 7×6 그리드. 컬럼/행 모두 40px 고정 → range middle bg 가 셀 경계 없이 연결됨 */}
          <div className="grid grid-cols-[repeat(7,40px)] grid-rows-[repeat(6,40px)]">
            {cells.map((d) => {
              const state = getState(d)
              const dateStr = d.format('YYYY-MM-DD')
              const scheduled = scheduledSet.has(dateStr)
              const isSelectedLike =
                state === 'selected' || state === 'rangeStart' || state === 'rangeEnd'

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => state !== 'disabled' && handleSelect(d)}
                  disabled={state === 'disabled'}
                  className={cellVariants({ state })}
                  style={getCellBgStyle(state)}
                  aria-pressed={isSelectedLike}
                  aria-current={state === 'today' ? 'date' : undefined}
                >
                  {d.date()}
                  {scheduled && (
                    <span
                      className={cn(
                        'absolute bottom-1 left-1/2 size-[6px] -translate-x-1/2 rounded-full',
                        isSelectedLike ? 'bg-white' : 'bg-krds-feedback-danger',
                      )}
                      aria-hidden
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 오늘 버튼 — Figma m_date_picker_today_button */}
        {showTodayButton && (
          <div className="flex w-full items-center">
            <button
              type="button"
              onClick={goToToday}
              className={cn(
                'inline-flex h-10 items-center justify-center rounded-full px-6',
                'border border-krds-border-field bg-background',
                'text-[15px] font-medium leading-[1.5] text-krds-action-primary-active',
                'hover:bg-krds-bg-primary-faint',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              )}
            >
              오늘
            </button>
          </div>
        )}
      </div>
    )
  },
)
Calendar.displayName = 'Calendar'

export { Calendar }
