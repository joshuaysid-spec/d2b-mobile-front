// Figma m_section title_19(9300-27190) 1:1.
// 하위 영역/아코디언/테이블 타이틀. 19px Bold, min-h 56px, padding 10px 16px.
// bgColor: white(기본) | blue(#ecf1fa) — 강조 영역.
// topDivider: 상단에 SectionDivider(1px) 추가.
// 우측 info slot: children 으로 보조 요소 전달(건수 표시, 아코디언 아이콘 등) — 17px, 텍스트 #0F316E(krds-text-primary-active).
//   info 가 있으면 타이틀바 전체 배경이 #ECF1FA(krds-bg-primary-faint) 로 강조됨.
//
// 사용 예:
//   <SectionTitle>하위 영역 제목</SectionTitle>
//   <SectionTitle bgColor="blue" topDivider>강조 영역</SectionTitle>
//   <SectionTitle>입찰 공고<span>총 2건</span></SectionTitle>          // 우측 슬롯
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { cn } from '@/utils/cn'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const titleVariants = cva(
  cn(
    'flex w-full items-center gap-4 px-4 py-2.5 min-h-[56px]',
    'text-[19px] font-bold leading-normal text-krds-text-ink',
  ),
  {
    variants: {
      bgColor: {
        white: 'bg-background',
        blue: 'bg-krds-bg-primary-faint',
      },
    },
    defaultVariants: {
      bgColor: 'white',
    },
  },
)

export interface SectionTitleProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'>,
    VariantProps<typeof titleVariants> {
  /** 의미론적 헤딩 레벨. 기본 h2. */
  as?: HeadingTag
  /** 상단 1px 구분선 표시. */
  topDivider?: boolean
  /** 본문(좌측 타이틀 텍스트). */
  children: React.ReactNode
  /** 우측 슬롯 — 보조 요소(건수, 아이콘 등). 17px / 텍스트 #0F316E. 있으면 타이틀바 전체 배경 #ECF1FA. */
  info?: React.ReactNode
}

const SectionTitle = React.forwardRef<HTMLElement, SectionTitleProps>(
  (
    {
      className,
      as = 'h2',
      bgColor = 'white',
      topDivider = false,
      info,
      children,
      ...props
    },
    ref,
  ) => {
    const Tag = as as React.ElementType
    return (
      <div className="flex w-full flex-col">
        {topDivider && <SectionDivider />}
        <Tag
          ref={ref}
          className={cn(
            titleVariants({ bgColor }),
            // info 슬롯이 있으면 타이틀바 전체 배경을 #ECF1FA 로 강조.
            info && 'bg-krds-bg-primary-faint',
            className,
          )}
          {...props}
        >
          <span className="min-w-px flex-1 wrap-break-word">{children}</span>
          {info && (
            <span className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[17px] font-bold text-krds-text-primary-active">
              {info}
            </span>
          )}
        </Tag>
      </div>
    )
  },
)
SectionTitle.displayName = 'SectionTitle'

export { SectionTitle, titleVariants as sectionTitleVariants }
