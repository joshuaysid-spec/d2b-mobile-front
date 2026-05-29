// Figma m_section divider(9300-27188) 1:1.
// 영역 구분선 — 1px 가로 라인, color = krds-border-divider(#d1d7e0).
// SectionTitle 의 topDivider 옵션 내부에서도 동일 컴포넌트를 사용한다.
//
// 사용 예:
//   <SectionDivider />
//   <SectionDivider className="my-4" />
import * as React from 'react'

import { cn } from '@/utils/cn'

export type SectionDividerProps = React.HTMLAttributes<HTMLDivElement>

const SectionDivider = React.forwardRef<HTMLDivElement, SectionDividerProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      className={cn('h-px w-full bg-krds-bg-divider', className)}
      {...props}
    />
  ),
)
SectionDivider.displayName = 'SectionDivider'

export { SectionDivider }
