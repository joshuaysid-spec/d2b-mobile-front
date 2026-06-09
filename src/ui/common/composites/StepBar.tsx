// Figma Step bar(9300-28323) 1:1.
// atomic 을 별도 파일로 분리하지 않고 한 composite 안에 모두 정의 (사용자 요청).
// items[] + orientation 만 받아 vertical/horizontal 모두 표현한다.
//
// 데이터 스키마:
//   { label, state, depth?: 1|2 }
//   state: 'done' | 'doing' | 'todo' | 'done-red'
//
// 디자인 사양 요약 (Figma 픽셀 기준):
//   1depth chip — h-40 pill: 좌 dot 20 + 텍스트 19 Bold
//     done   : bg white  + border step-blue + dot bg step-blue + check / 텍스트 step-blue
//     doing  : bg danger + border 0 + dot border white + 텍스트 white
//     todo   : bg white  + border step-blue + dot border step-blue (빈) / 텍스트 step-blue
//   2depth row — h-44: 좌 connector(2px 세로선) + dot 14 + 텍스트 17
//     done   : dot bg step-blue + 12 check, 텍스트 ink 17 Regular
//     done-red: dot bg danger + 12 check, 텍스트 ink 17 Regular
//     doing  : dot bg danger (빈), 텍스트 danger 17 Bold
//     todo   : dot bg field grey, 텍스트 ink 17 Regular
//
// vertical 모드는 2depth connector 가 항목 사이를 잇는다(마지막 항목은 connector 안 그림).
// horizontal 은 1depth chip 을 가로 나열하고, 칩 사이를 8px×1px step-blue 연결선(Figma line)으로 잇는다
//   (디자인상 horizontal-2depth 없음).
//   - 항목 3개 이상이면 TabList 처럼 가로 스크롤 + 좌/우 화살표 버튼이 활성화된다.
import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export type StepState = 'done' | 'doing' | 'todo' | 'done-red'
export type StepDepth = 1 | 2

export interface StepItem {
  label: React.ReactNode
  state: StepState
  /** 들여쓰기/dot 사이즈. 기본 1. */
  depth?: StepDepth
}

export type StepBarScrollButtons = 'auto' | 'always' | 'none'

export interface StepBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StepItem[]
  /** 기본 'vertical'. */
  orientation?: 'vertical' | 'horizontal'
  /**
   * horizontal 모드 좌/우 스크롤 화살표 노출 정책. 기본 'auto'.
   * 항목이 3개 미만이면(스크롤 불필요) 화살표는 표시되지 않는다.
   */
  scrollButtons?: StepBarScrollButtons
}

// ─── 1depth chip (pill) ──────────────────────────────────────────────────────
function Chip1Depth({
  label,
  state,
  className,
}: {
  label: React.ReactNode
  state: StepState
  className?: string
}) {
  // done-red 는 1depth 에 정의된 디자인 없음 → done 처럼 처리
  const isDoing = state === 'doing'
  const wrapCls = cn(
    'inline-flex h-10 shrink-0 items-center gap-krds-3 rounded-krds-full pl-krds-5 pr-krds-7',
    isDoing
      ? 'bg-krds-action-danger'
      : 'border border-krds-step-blue bg-background',
    className,
  )
  const textCls = cn(
    'text-[19px] font-bold leading-normal whitespace-nowrap',
    isDoing ? 'text-white' : 'text-krds-step-blue',
  )
  return (
    <div className={wrapCls}>
      <Dot1Depth state={state} />
      <span className={textCls}>{label}</span>
    </div>
  )
}

function Dot1Depth({ state }: { state: StepState }) {
  // 20×20 동그라미
  if (state === 'done' || state === 'done-red') {
    return (
      <span className="flex size-5 items-center justify-center rounded-full bg-krds-step-blue text-white">
        <Icon name="Check" size={14} aria-hidden />
      </span>
    )
  }
  if (state === 'doing') {
    return <span className="block size-5 rounded-full border border-white" />
  }
  // todo
  return <span className="block size-5 rounded-full border border-krds-step-blue" />
}

// ─── 2depth row (with connector) ────────────────────────────────────────────
function Row2Depth({
  label,
  state,
  isFirst,
  isLast,
}: {
  label: React.ReactNode
  state: StepState
  isFirst: boolean
  isLast: boolean
}) {
  // dot 색
  const dotColorCls = (() => {
    switch (state) {
      case 'done':
        return 'bg-krds-step-blue'
      case 'done-red':
        return 'bg-krds-action-danger'
      case 'doing':
        return 'bg-krds-action-danger'
      case 'todo':
      default:
        return 'bg-krds-border-field'
    }
  })()
  const showCheck = state === 'done' || state === 'done-red'
  const textCls = cn(
    'min-w-px flex-1 text-[17px] leading-[1.3]',
    state === 'doing'
      ? 'font-bold text-krds-action-danger'
      : 'font-normal text-krds-text-ink',
  )
  return (
    <div className="flex w-full items-center gap-krds-3">
      {/* connector + dot column — 너비 40px (pl-20 + dot center) */}
      <div className="relative flex h-11 shrink-0 items-start pl-5 pr-3">
        {/* 세로 connector 라인(#C1D1EE=border-field) — dot 중심(22px) 기준 위/아래 반쪽.
            위쪽: 첫 항목이 아니면(윗 알약/dot 과 연결). 아래쪽: 마지막 항목이 아니면(아랫 항목과 연결).
            항목 사이 gap 0 + 1depth 알약(전체너비, dot 내장)이 노드 → 조달계획~대금청구 끊김 없이 이어짐. */}
        {!isFirst && (
          <span
            aria-hidden
            className="absolute left-[20px] top-0 h-[22px] w-0.5 bg-krds-border-field"
          />
        )}
        {!isLast && (
          <span
            aria-hidden
            className="absolute left-[20px] top-[22px] h-[22px] w-0.5 bg-krds-border-field"
          />
        )}
        {/* dot — 14×14, top 15px (Figma) */}
        <span
          className={cn(
            'absolute left-[14px] top-[15px] flex size-[14px] items-center justify-center rounded-full text-white',
            dotColorCls,
          )}
        >
          {showCheck && <Icon name="Check" size={10} aria-hidden />}
        </span>
      </div>
      <p className={textCls}>{label}</p>
    </div>
  )
}

// ─── horizontal (가로 스크롤 + 좌/우 화살표) ──────────────────────────────────
// 항목 3개 이상이면 TabList 패턴(overflow-x-auto + ResizeObserver 로 화살표 자동 노출)으로
// 가로 스크롤한다. 항목 2개 이하면 스크롤 불필요 → 단순 가로 나열(flex-wrap).
function StepBarHorizontal({
  className,
  items,
  scrollButtons = 'auto',
  ...props
}: Omit<StepBarProps, 'orientation'>) {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  // 3개 미만이면 스크롤·화살표 자체를 끈다.
  const scrollable = items.length >= 3

  // 스크롤 가능 여부 측정 — resize/scroll 시 갱신.
  const updateScrollState = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  React.useEffect(() => {
    if (!scrollable) return
    updateScrollState()
    const el = scrollerRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState, items.length, scrollable])

  const showLeft =
    scrollable &&
    (scrollButtons === 'always' || (scrollButtons === 'auto' && canScrollLeft))
  const showRight =
    scrollable &&
    (scrollButtons === 'always' || (scrollButtons === 'auto' && canScrollRight))

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <div className={cn('relative w-full bg-background', className)} {...props}>
      <div
        ref={scrollerRef}
        role="list"
        aria-label="진행 단계"
        className={cn(
          // 칩 사이 간격은 연결선(아래 8px line)이 담당 → 가로 gap 0. wrap 시 줄 간격만 부여.
          'flex w-full items-center',
          scrollable
            ? 'overflow-x-auto overflow-y-hidden scrollbar-none [&::-webkit-scrollbar]:hidden'
            : 'flex-wrap gap-y-krds-5',
        )}
        style={scrollable ? { scrollbarWidth: 'none' } : undefined}
      >
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {/* 칩 사이 연결선 — Figma 8px×1px step-blue. 첫 칩 앞엔 없음(i>0). 인접 상태와 무관히 파란선. */}
            {i > 0 && (
              <span aria-hidden className="h-px w-krds-5 shrink-0 bg-krds-step-blue" />
            )}
            <div role="listitem">
              <Chip1Depth label={item.label} state={item.state} />
            </div>
          </React.Fragment>
        ))}
      </div>

      {showLeft && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
          <div className="pointer-events-auto flex h-10 items-center">
            {/* 버튼 뒤(사각 모서리 포함)는 흰색으로 덮어 칩이 비치지 않게 */}
            <span className="flex h-full items-center bg-background">
              <button
                type="button"
                aria-label="이전 단계로 스크롤"
                onClick={() => scrollBy(-160)}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-krds-border-field bg-background text-krds-text-ink"
              >
                <Icon name="ArrowBackIosNew" size={20} aria-hidden />
              </button>
            </span>
            {/* 칩 위로 흰색→투명 그라데이션 fade — 화살표 안쪽 칩이 서서히 사라지게 */}
            <div
              aria-hidden
              className="h-full w-5 bg-gradient-to-r from-background to-transparent"
            />
          </div>
        </div>
      )}

      {showRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
          <div className="pointer-events-auto flex h-10 items-center">
            {/* 칩 위로 투명→흰색 그라데이션 fade — 화살표 안쪽 칩이 서서히 사라지게 */}
            <div
              aria-hidden
              className="h-full w-5 bg-gradient-to-r from-transparent to-background"
            />
            {/* 버튼 뒤(사각 모서리 포함)는 흰색으로 덮어 칩이 비치지 않게 */}
            <span className="flex h-full items-center bg-background">
              <button
                type="button"
                aria-label="다음 단계로 스크롤"
                onClick={() => scrollBy(160)}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-krds-border-field bg-background text-krds-text-ink"
              >
                <Icon name="ArrowForwardIos" size={20} aria-hidden />
              </button>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── StepBar ────────────────────────────────────────────────────────────────
function StepBar({
  className,
  items,
  orientation = 'vertical',
  scrollButtons,
  ...props
}: StepBarProps) {
  if (orientation === 'horizontal') {
    return (
      <StepBarHorizontal
        className={className}
        items={items}
        scrollButtons={scrollButtons}
        {...props}
      />
    )
  }

  // vertical — 연속 rail 타임라인. 항목 사이 gap 0(선 연속), 1depth 는 full-width 알약(dot 내장),
  // 2depth 는 dot+텍스트(좌측 connector). connector 가 모든 항목을 위/아래로 이어 끊기지 않는다.
  return (
    <div
      className={cn('flex w-full flex-col items-stretch', className)}
      role="list"
      aria-label="진행 단계"
      {...props}
    >
      {items.map((item, i) => {
        const depth = item.depth ?? 1
        return (
          <div key={i} role="listitem" className="w-full">
            {depth === 1 ? (
              // full-width 알약 + dot 을 connector(x≈21)에 맞춰 pl-krds-7(12px)
              <Chip1Depth
                label={item.label}
                state={item.state}
                className="flex w-full pl-krds-7 gap-krds-5"
              />
            ) : (
              <Row2Depth
                label={item.label}
                state={item.state}
                isFirst={i === 0}
                isLast={i === items.length - 1}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
StepBar.displayName = 'StepBar'

export { StepBar }
