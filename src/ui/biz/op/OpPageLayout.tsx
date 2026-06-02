// 조달계획관리 페이지 공통 셸. Design Ref: Figma m_page title_24(9300-36817, title "조달계획관리").
// 책임:
//   - 상단 페이지 타이틀(PageTitle = m_page title_24, 24px Bold)
//   - 콘텐츠를 full-bleed 컬럼으로 쌓음 — 섹션 간 간격을 페이지가 gap 으로 주지 않도록(Figma 플러시 스택).
//     full-bleed 바(Infobox·SectionTitle)는 그대로 폭 전체, 폼/리스트 콘텐츠는 자식이 px-4 로 인셋.
// 조달계획관리 하위 페이지(통합목록 등)가 공통으로 사용한다.
import * as React from 'react'

import { PageTitle } from '@/ui/common/base/PageTitle'
import { cn } from '@/utils/cn'

export interface OpPageLayoutProps {
  /** 페이지 타이틀. 기본 '조달계획관리'(조달계획관리 공통 타이틀). */
  title?: string
  /** 본문 — 섹션들을 순서대로(플러시) 배치. */
  children: React.ReactNode
  className?: string
}

export function OpPageLayout({ title = '조달계획관리', children, className }: OpPageLayoutProps) {
  return (
    <div className={cn('flex w-full flex-col', className)}>
      <PageTitle>{title}</PageTitle>
      {children}
    </div>
  )
}
OpPageLayout.displayName = 'OpPageLayout'
