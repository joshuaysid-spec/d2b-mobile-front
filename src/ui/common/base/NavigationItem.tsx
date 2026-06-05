// Figma m_navigation item(9300-28612) 1:1.
// 리스트 행 — 좌측 19px Medium 텍스트 + 우측 ArrowForwardIos(20px) + min-h 56 + py 10.
// state=default(bg white) / pressed(bg #ecf1fa = bg-primary-faint) — :active 로 처리.
// 버튼 상단 1px border(border-divider #d1d7e0). borderTop 옵션 켜지면 SectionDivider 로 대체(선 중복 방지).
//
// 사용 예:
//   <NavigationItem onClick={() => goto('/foo')}>바로가기 이름</NavigationItem>
//   <NavigationItem borderTop borderBottom>...</NavigationItem>
import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { cn } from '@/utils/cn'

export interface NavigationItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  /** 행 텍스트. */
  children: React.ReactNode
  /** 상단 1px 구분선. 기본 false. */
  borderTop?: boolean
  /** 하단 1px 구분선. 기본 true. */
  borderBottom?: boolean
}

const NavigationItem = React.forwardRef<HTMLButtonElement, NavigationItemProps>(
  (
    {
      className,
      children,
      borderTop = false,
      borderBottom = true,
      ...props
    },
    ref,
  ) => (
    <div className="flex w-full flex-col">
      {borderTop && <SectionDivider />}
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex min-h-[56px] w-full items-center gap-krds-3 py-krds-6',
          // 버튼 상단 1px border. borderTop 옵션이 SectionDivider 를 그릴 땐 빼서 선 중복(2px) 방지.
          !borderTop && 'border-t border-krds-border-divider',
          'text-left text-[19px] font-medium leading-normal text-krds-text-ink',
          'bg-background active:bg-krds-bg-primary-faint',
          'focus-visible:outline-hidden focus-visible:bg-krds-bg-primary-faint',
          'disabled:cursor-not-allowed disabled:text-krds-text-disabled',
          className,
        )}
        {...props}
      >
        <span className="min-w-px flex-1 truncate">{children}</span>
        <Icon
          name="ArrowForwardIos"
          size={20}
          aria-hidden
          className="shrink-0 text-krds-text-ink"
        />
      </button>
      {borderBottom && <SectionDivider />}
    </div>
  ),
)
NavigationItem.displayName = 'NavigationItem'

export { NavigationItem }
