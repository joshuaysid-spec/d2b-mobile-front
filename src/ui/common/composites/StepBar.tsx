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
// horizontal 은 1depth chip 만 가로 나열 (디자인상 horizontal-2depth 없음).
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

export interface StepBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StepItem[]
  /** 기본 'vertical'. */
  orientation?: 'vertical' | 'horizontal'
}

// ─── 1depth chip (pill) ──────────────────────────────────────────────────────
function Chip1Depth({ label, state }: { label: React.ReactNode; state: StepState }) {
  // done-red 는 1depth 에 정의된 디자인 없음 → done 처럼 처리
  const isDoing = state === 'doing'
  const wrapCls = cn(
    'inline-flex h-10 shrink-0 items-center gap-krds-3 rounded-krds-full pl-krds-5 pr-krds-7',
    isDoing
      ? 'bg-krds-action-danger'
      : 'border border-krds-step-blue bg-background',
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
  isLast,
}: {
  label: React.ReactNode
  state: StepState
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
        {/* 세로 connector 라인. 마지막 항목은 안 그림 */}
        {!isLast && (
          <span
            aria-hidden
            className="absolute left-[21px] top-0 h-full w-0.5 bg-krds-border-field"
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

// ─── StepBar ────────────────────────────────────────────────────────────────
function StepBar({
  className,
  items,
  orientation = 'vertical',
  ...props
}: StepBarProps) {
  if (orientation === 'horizontal') {
    return (
      <div
        className={cn('flex flex-wrap items-center gap-krds-5', className)}
        role="list"
        aria-label="진행 단계"
        {...props}
      >
        {items.map((item, i) => (
          <div key={i} role="listitem">
            <Chip1Depth label={item.label} state={item.state} />
          </div>
        ))}
      </div>
    )
  }

  // vertical — depth 별로 1depth chip / 2depth row 선택
  // 같은 depth=2 항목 끼리만 connector 가 이어지도록 isLast 계산:
  //   "현재 항목이 depth=2 이고, 그 다음 항목도 depth=2" 일 때만 connector 표시.
  return (
    <div
      className={cn('flex w-full flex-col items-stretch gap-krds-3', className)}
      role="list"
      aria-label="진행 단계"
      {...props}
    >
      {items.map((item, i) => {
        const depth = item.depth ?? 1
        const next = items[i + 1]
        const isLastInGroup = depth !== 2 || !next || (next.depth ?? 1) !== 2
        return (
          <div key={i} role="listitem" className="w-full">
            {depth === 1 ? (
              <Chip1Depth label={item.label} state={item.state} />
            ) : (
              <Row2Depth
                label={item.label}
                state={item.state}
                isLast={isLastInGroup}
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
