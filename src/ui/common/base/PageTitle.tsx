// Figma m_page title_24(9300-27179) 1:1.
// 페이지 또는 최상위 영역 타이틀. 24px Bold, padding 20px 16px (Figma 컨테이너 기준 가로 폭은 부모가 결정).
//
// 사용 예:
//   <PageTitle>페이지 제목</PageTitle>
//   <PageTitle as="h1">조달업무</PageTitle>      // 의미적 헤딩 레벨 지정
import * as React from 'react'

import { cn } from '@/utils/cn'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface PageTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /** 의미론적 헤딩 레벨. 기본 h1 (페이지 최상위 타이틀 용도). */
  as?: HeadingTag
}

const PageTitle = React.forwardRef<HTMLHeadingElement, PageTitleProps>(
  ({ className, as = 'h1', children, ...props }, ref) => {
    const Tag = as as React.ElementType
    return (
      <Tag
        ref={ref}
        className={cn(
          'flex w-full items-center px-4 py-5',
          'text-[24px] font-bold leading-[1.5] text-krds-text-ink break-words',
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    )
  },
)
PageTitle.displayName = 'PageTitle'

export { PageTitle }
