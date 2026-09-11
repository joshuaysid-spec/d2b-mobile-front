// Figma tab_atomic(9300-28533 / 28537) · tab_btntype atomic(10005-5894) 1:1.
// 단일 탭 atom — variant 두 가지:
//   line (기본) — h-48 · 19px Bold label · 3px 하단 border.
//                 selected=false → border-field(#c1d1ee) 회색 / selected=true → D2B blue(#0054e9).
//   button      — h-48 · 라운드 8px 칩 · 17px label · 보더 #0f316e(border-tertiary).
//                 selected=false → bg white + Medium 텍스트 #0f316e / selected=true → bg #0f316e + Bold 흰색.
//
// 사용 예 (단독):
//   <Tab selected onClick={...}>탭제목</Tab>
//   <Tab variant="button" selected onClick={...}>탭제목</Tab>
//
// 보통은 직접 쓰지 않고 <TabList /> 가 items 배열로 매핑한다.
import * as React from 'react'

import { cn } from '@/utils/cn'

export type TabVariant = 'line' | 'button'

export interface TabProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 활성 탭 여부. 활성 시 텍스트/보더가 primary 색으로 전환. */
  selected?: boolean
  /** 탭 모양 — line(하단 border) | button(라운드 칩). 기본 line. */
  variant?: TabVariant
}

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ className, selected = false, variant = 'line', children, ...props }, ref) => {
    if (variant === 'button') {
      // Figma tab_btntype atomic(10005-5894): 선택 = 채움(#0f316e) + Bold 흰색 / 비선택 = 흰 배경 + 1px 보더.
      // Figma 는 선택 시 border-2 이지만 보더색 = 배경색이라 1px 로 통일(선택 전환 시 폭 흔들림 방지).
      return (
        <button
          ref={ref}
          type="button"
          role="tab"
          aria-selected={selected}
          className={cn(
            'inline-flex h-12 shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-tertiary px-krds-6',
            // 키보드/보조기기 포커스 표시(KWCAG 초점) — inset ring 으로 가로 스크롤 TabList 안에서도 잘리지 않게.
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
            selected ? 'bg-krds-action-primary-active' : 'bg-background',
            className,
          )}
          {...props}
        >
          <span
            className={cn(
              'text-[17px] leading-normal whitespace-nowrap',
              selected
                ? 'font-bold text-white'
                : 'font-medium text-krds-text-primary-active',
            )}
          >
            {children}
          </span>
        </button>
      )
    }

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={selected}
        className={cn(
          'group inline-flex h-12 shrink-0 flex-col items-center pt-1',
          'focus-visible:outline-hidden',
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'inline-flex items-center justify-center px-krds-7',
            'text-[19px] font-bold leading-normal whitespace-nowrap',
            selected
              ? 'text-krds-action-primary'
              : // 비선택 탭 텍스트 — #8395bd(260729 확정, 구 border-field 색 대체)
                'text-krds-text-unselected',
          )}
        >
          {children}
        </span>
        {/* 3px 하단 border — mt-auto 로 탭(h-12) 맨 아래에 붙인다(아래 여백 0).
            → TabList 하단 divider 와 맞닿아 떨어져 보이지 않음. */}
        <span
          aria-hidden
          className={cn(
            'mt-auto h-[3px] w-full',
            selected ? 'bg-krds-action-primary' : 'bg-krds-border-field',
          )}
        />
      </button>
    )
  },
)
Tab.displayName = 'Tab'

export { Tab }
