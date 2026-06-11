// Figma m_date_wheel picker(9300-29375) / m_wheel picker_item(9300-29370) 1:1.
// iOS 스타일 휠 피커 — 컬럼별 세로 스크롤(scroll-snap) + 중앙 하이라이트 밴드에 오는 값이 선택값.
// 도메인 무관: columns(값/라벨 목록) + value(컬럼키→값) + onChange 만 받는다. 날짜 조립은 사용처(Calendar).
//
// 스펙: 행 pitch 37px(텍스트 19px Bold + gap 8) · 7행 노출(259px) · 중앙 밴드 bg-primary-faint h-37 rounded-8.
//       항목: 미선택 #c6c6c6(text-disabled-faint) · 선택(중앙) #0f316e(action-primary-active) · 우측 정렬.
import * as React from 'react'

import { cn } from '@/utils/cn'

const ITEM_H = 37 // 행 높이(px) — Figma 29px 텍스트 + 8px gap
const VISIBLE = 7 // 노출 행 수(홀수: 중앙 1 + 위아래 3)
const PAD = ((VISIBLE - 1) / 2) * ITEM_H // 첫/마지막 항목이 중앙에 오도록 위/아래 패딩

export interface WheelItem {
  value: number
  label: string
}

export interface WheelColumn {
  key: string
  items: WheelItem[]
  /** 컬럼 너비(px). 기본 80. */
  width?: number
  /** 스크린리더용 라벨. 미지정 시 key. (예: '연도'·'월'·'일') */
  ariaLabel?: string
}

export interface WheelPickerProps {
  columns: WheelColumn[]
  /** 컬럼 key → 현재 값 */
  value: Record<string, number>
  /** 특정 컬럼의 값이 바뀌면 (key, value) 호출 */
  onChange: (key: string, value: number) => void
  className?: string
}

// 단일 컬럼 — 세로 스크롤 + snap. 중앙에 멈춘 항목을 onChange 로 방출.
function WheelColumnList({
  column,
  value,
  onChange,
}: {
  column: WheelColumn
  value: number
  onChange: (value: number) => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const settleRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const scrollingRef = React.useRef(false)
  const idx = Math.max(0, column.items.findIndex((i) => i.value === value))

  // value 변경 시 해당 항목을 중앙으로 (외부 동기화). 단 사용자가 스크롤 중일 땐 jump 억제
  // (예: 년/월 스크롤로 일 컬럼 clamp 시 손가락 아래에서 튀는 현상 방지).
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el || scrollingRef.current) return
    const target = idx * ITEM_H
    if (Math.abs(el.scrollTop - target) > 1) el.scrollTop = target
  }, [idx])

  const handleScroll = () => {
    scrollingRef.current = true
    clearTimeout(settleRef.current)
    // 스크롤이 멈추면(디바운스) 중앙값 방출. 스냅 정렬은 CSS scroll-snap-mandatory 가 처리하므로
    // scrollTo 를 호출하지 않는다(smooth 재진입으로 인한 진동 방지).
    settleRef.current = setTimeout(() => {
      scrollingRef.current = false
      const el = ref.current
      if (!el) return
      const i = Math.max(0, Math.min(column.items.length - 1, Math.round(el.scrollTop / ITEM_H)))
      const next = column.items[i]?.value
      if (next !== undefined && next !== value) onChange(next)
    }, 120)
  }

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={column.ariaLabel ?? column.key}
      onScroll={handleScroll}
      className={cn(
        // relative z-[1]: 중앙 하이라이트 밴드(absolute)가 painting order 상 컬럼(비positioned) 위에
        //   덮여 선택값 글자(#0F316E)를 가리던 문제 해소 — 컬럼을 밴드보다 위로 올린다.
        'relative z-[1] h-[259px] snap-y snap-mandatory overflow-y-auto overscroll-contain',
        'scrollbar-none [&::-webkit-scrollbar]:hidden',
      )}
      style={{ scrollbarWidth: 'none', width: column.width ?? 80 }}
    >
      <div style={{ paddingTop: PAD, paddingBottom: PAD }}>
        {column.items.map((it, i) => (
          <button
            key={it.value}
            type="button"
            role="option"
            aria-selected={i === idx}
            onClick={() => onChange(it.value)}
            className={cn(
              'flex h-[37px] w-full snap-center items-center justify-end pr-4 text-[19px] font-bold leading-normal whitespace-nowrap',
              i === idx ? 'text-krds-action-primary-active' : 'text-krds-text-disabled-faint',
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  )
}

const WheelPicker = React.forwardRef<HTMLDivElement, WheelPickerProps>(
  ({ columns, value, onChange, className }, ref) => (
    <div
      ref={ref}
      className={cn('relative mx-auto flex w-fit justify-center gap-[2px]', className)}
    >
      {/* 중앙 하이라이트 밴드 — 선택값이 놓이는 자리(Figma Rectangle 19746) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-[37px] w-full -translate-y-1/2 rounded-krds-8 bg-krds-bg-primary-faint"
      />
      {columns.map((col) => (
        <WheelColumnList
          key={col.key}
          column={col}
          value={value[col.key]}
          onChange={(v) => onChange(col.key, v)}
        />
      ))}
    </div>
  ),
)
WheelPicker.displayName = 'WheelPicker'

export { WheelPicker }
