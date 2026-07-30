// Figma coach mark_컴포넌트(10066-21724) 1:1 — 앱 이용안내(이용안내 > 앱 이용안내) 단계 안내 말풍선.
//
// variant 6종 = arrow(center|left|right) × direction(top|bottom) — Figma 심볼명 그대로.
//
// 실측(get_metadata 10066:21727, 단위 px):
//   심볼 328×192 = direction(328×10) + contents(328×182)
//   꼬리 삼각형 16×10 · x: center=156(가운데) · left=24 · right=288(우측에서 24)
//   contents: padding 16 · 텍스트블록 →16→ 버튼그룹
//   텍스트블록: coachmark_number(h26) →8→ 본문(h52, 2줄)
//   버튼그룹 296×48: [그만보기 76] ... [이전으로 76] →8→ [다음으로 76]  (우측 그룹 우측정렬)
//   coachmark_number: "1"(w10) →2→ "/"(w5) →2→ "5"(w10), h26 → 17px(=body-md, lh 1.5)
//     · 현재 단계만 primary, 나머지는 muted. 세 숫자 폭이 동일(10)이라 굵기 차이 없음.
//
// [그만보기]는 회색 테두리 + 잉크 텍스트 — 기존 Button variant 에 없어 **이 컴포넌트 안에서만**
//   className 으로 오버라이드한다(공통 Button API 불변, 2026-07-29 사용자 확정).
//
// 단계 이동: current 를 주면 controlled, 안 주면 내부 상태(defaultCurrent 시작)로 동작한다.
//   이전/다음은 1~total 로 clamp — Figma 에 비활성 상태가 없어 버튼은 항상 활성으로 둔다.
import * as React from 'react'

import { Button } from '@/ui/common/base/Button'
import { cn } from '@/utils/cn'

/** 꼬리 가로 위치 (Figma arrow=). */
export type CoachMarkArrow = 'center' | 'left' | 'right'
/** 꼬리 방향 (Figma direction=). top=말풍선 위, bottom=말풍선 아래. */
export type CoachMarkDirection = 'top' | 'bottom'

// 꼬리 가로 정렬 — left/right 는 가장자리에서 24px(krds-10) 들여쓰기.
const ARROW_ALIGN: Record<CoachMarkArrow, string> = {
  center: 'justify-center',
  left: 'justify-start pl-krds-10',
  right: 'justify-end pr-krds-10',
}

// 16×10 삼각형 — border 트릭(size-0 + 좌우 투명 8px + 반대쪽 10px 채움).
const ARROW_SHAPE: Record<CoachMarkDirection, string> = {
  top: 'border-b-[10px] border-b-krds-border-primary',
  bottom: 'border-t-[10px] border-t-krds-border-primary',
}

export interface CoachMarkProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 전체 단계 수 (숫자 표시 "n / total"). */
  total: number
  /** 현재 단계(1-base). 주면 controlled — 안 주면 내부 상태로 동작. */
  current?: number
  /** 비제어 모드 시작 단계. 기본 1. */
  defaultCurrent?: number
  /** 꼬리 가로 위치. 기본 center. */
  arrow?: CoachMarkArrow
  /** 꼬리 방향. 기본 top. */
  direction?: CoachMarkDirection
  /** 말풍선 본문. */
  children: React.ReactNode
  /** 이전으로 — 이동 후 단계를 인자로 받는다. */
  onPrev?: (step: number) => void
  /** 다음으로 — 이동 후 단계를 인자로 받는다. */
  onNext?: (step: number) => void
  /** 그만보기. */
  onClose?: () => void
  closeLabel?: React.ReactNode
  prevLabel?: React.ReactNode
  nextLabel?: React.ReactNode
}

const CoachMark = React.forwardRef<HTMLDivElement, CoachMarkProps>(
  (
    {
      total,
      current,
      defaultCurrent = 1,
      arrow = 'center',
      direction = 'top',
      children,
      onPrev,
      onNext,
      onClose,
      closeLabel = '그만보기',
      prevLabel = '이전으로',
      nextLabel = '다음으로',
      className,
      ...props
    },
    ref,
  ) => {
    const [innerStep, setInnerStep] = React.useState(defaultCurrent)
    const isControlled = current !== undefined
    const step = isControlled ? current : innerStep

    // 1~total 범위로 clamp 후 이동. 비제어면 내부 상태도 갱신하고, 콜백에 이동 결과를 넘긴다.
    // ⚠️ `onPrev?.(move(...))` 로 쓰면 안 된다 — 옵셔널 호출은 핸들러가 없을 때 **인자 평가까지
    //    건너뛰어서** move() 가 실행되지 않는다(비제어 모드에서 숫자가 안 바뀌는 버그).
    const move = (next: number, notify?: (step: number) => void) => {
      const clamped = Math.min(Math.max(next, 1), total)
      if (!isControlled) setInnerStep(clamped)
      notify?.(clamped)
    }

    const tail = (
      <div className={cn('flex', ARROW_ALIGN[arrow])} aria-hidden>
        <span className={cn('size-0 border-x-[8px] border-x-transparent', ARROW_SHAPE[direction])} />
      </div>
    )

    return (
      <div ref={ref} className={cn('flex w-full flex-col', className)} {...props}>
        {direction === 'top' && tail}

        <div className="flex flex-col gap-krds-8 rounded-krds-8 border-2 border-krds-border-primary bg-background p-krds-8">
          {/* 텍스트 블록 — 단계 숫자(n / total) → 본문 */}
          <div className="flex flex-col gap-krds-5">
            <p className="flex items-center gap-krds-2 text-krds-body-md">
              <span className="text-krds-text-primary">{step}</span>
              <span className="text-krds-text-muted">/</span>
              <span className="text-krds-text-muted">{total}</span>
              <span className="sr-only">단계</span>
            </p>
            <p className="text-krds-body-md text-krds-text-ink">{children}</p>
          </div>

          {/* 버튼 그룹 — 그만보기 좌측 · [이전으로 · 다음으로] 우측 */}
          <div className="flex items-center justify-between gap-krds-5">
            <Button
              variant="secondary"
              className="border-krds-border-strong text-krds-text-ink"
              onClick={onClose}
            >
              {closeLabel}
            </Button>
            <div className="flex items-center gap-krds-5">
              <Button variant="secondary" onClick={() => move(step - 1, onPrev)}>
                {prevLabel}
              </Button>
              <Button variant="primary" onClick={() => move(step + 1, onNext)}>
                {nextLabel}
              </Button>
            </div>
          </div>
        </div>

        {direction === 'bottom' && tail}
      </div>
    )
  },
)
CoachMark.displayName = 'CoachMark'

export { CoachMark }
