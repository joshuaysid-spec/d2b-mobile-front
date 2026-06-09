// Figma tab_atomic(9300-28533 / 28537) 1:1.
// 단일 탭 atom — h-48 · 19px Bold label · 3px 하단 border.
// selected=false → border-field(#c1d1ee) 회색 / selected=true → D2B blue(#0054e9).
//
// 사용 예 (단독):
//   <Tab selected onClick={...}>탭제목</Tab>
//
// 보통은 직접 쓰지 않고 <TabList /> 가 items 배열로 매핑한다.
import * as React from 'react'

import { cn } from '@/utils/cn'

export interface TabProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 활성 탭 여부. 활성 시 텍스트/보더가 primary 색으로 전환. */
  selected?: boolean
}

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ className, selected = false, children, ...props }, ref) => (
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
            : 'text-krds-border-field',
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
  ),
)
Tab.displayName = 'Tab'

export { Tab }
