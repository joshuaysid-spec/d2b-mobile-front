// Figma m_button_plus(9300-26913) + m_button_top(9300-26911) 1:1 통합.
// 두 디자인을 하나의 컴포넌트로 묶고, 핸들러 prop 으로 노출 여부를 결정한다.
//
//   <FloatingActionButton onPlus={...} />                  // plus 1개만
//   <FloatingActionButton onTop={...} />                   // top 1개만
//   <FloatingActionButton onTop={...} onPlus={...} />      // 둘 다 (세로 스택: top 위 / plus 아래)
//   <FloatingActionButton />                               // 노출 0 (null 반환)
//
// 위치(좌우/z-index)는 사용처 책임 — 컴포넌트는 inline-flex 세로 스택을 제공하고,
// 하단 간격만 스스로 책임진다(아래 marginBottom): BottomNav 가 있으면 그 위 10px,
// 없으면 화면 하단 10px(둘 다 safe-area 보정). → 사용처는 bottom-0 으로 앵커만 잡으면 된다.
//   <div className="fixed bottom-0 right-4 z-50">
//     <FloatingActionButton onPlus={...} onTop={...} />
//   </div>
//
// 시각 스펙(공통 — Figma):
//   - 48×48 원형 · bg-white · drop-shadow-sm 0 0 5px rgba(23,43,77,0.5)
//   - 아이콘 30px (Add=plus / Upgrade=top, weight=bold)
//   - 아이콘 색: ink (검정) — Figma 그대로
import * as React from 'react'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { BOTTOM_NAV_HEIGHT, useBottomNavVisible } from '@/ui/common/layout/bottomNavContext'
import { cn } from '@/utils/cn'

export interface FloatingActionButtonProps {
  /** plus 액션 핸들러 — 주어지면 plus 버튼 노출(아래쪽). */
  onPlus?: () => void
  /** top 액션 핸들러 — 주어지면 top 버튼 노출(위쪽). */
  onTop?: () => void
  /** 버튼 사이 간격(px). 기본 12. */
  gap?: number
  /** 그룹 컨테이너 클래스(위치/z-index 등). */
  className?: string
  /** plus 버튼 aria-label. 기본 "추가". */
  plusLabel?: string
  /** top 버튼 aria-label. 기본 "맨 위로". */
  topLabel?: string
}

interface CircleButtonProps {
  iconName: IconName
  ariaLabel: string
  onClick: () => void
}

function CircleButton({ iconName, ariaLabel, onClick }: CircleButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        'flex size-12 shrink-0 items-center justify-center rounded-full bg-background text-krds-text-ink',
        'drop-shadow-[0_0_5px_rgba(23,43,77,0.5)]',
        'transition-transform active:scale-95',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
      )}
    >
      <Icon name={iconName} size={30} aria-hidden />
    </button>
  )
}

const FloatingActionButton = React.forwardRef<
  HTMLDivElement,
  FloatingActionButtonProps
>(
  (
    {
      onPlus,
      onTop,
      gap = 12,
      className,
      plusLabel = '추가',
      topLabel = '맨 위로',
    },
    ref,
  ) => {
    const bottomNavVisible = useBottomNavVisible()
    if (!onPlus && !onTop) return null

    // 하단 간격(margin-bottom) — 사용처가 bottom-0 으로 앵커하면 이 margin 이 버튼을 위로 띄운다.
    //   BottomNav 있음: 그 위 10px → nav 높이(78px) + 10px + safe-area
    //   BottomNav 없음: 화면 하단 10px → 10px + safe-area
    const liftBottom = bottomNavVisible
      ? `calc(${BOTTOM_NAV_HEIGHT + 10}px + env(safe-area-inset-bottom))`
      : `calc(10px + env(safe-area-inset-bottom))`

    return (
      <div
        ref={ref}
        className={cn('inline-flex flex-col items-center', className)}
        style={{ gap, marginBottom: liftBottom }}
      >
        {onTop && (
          <CircleButton iconName="Upgrade" ariaLabel={topLabel} onClick={onTop} />
        )}
        {onPlus && (
          <CircleButton iconName="Add" ariaLabel={plusLabel} onClick={onPlus} />
        )}
      </div>
    )
  },
)
FloatingActionButton.displayName = 'FloatingActionButton'

export { FloatingActionButton }
