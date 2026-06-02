// 카드 목록 래퍼 — items 배열을 기존 Card 로 매핑해 세로 스택 렌더(카드 간 16px).
// 데이터를 소유하지 않는다: 페이지가 items(카드 props + id)·loading·empty 를 주입한다.
// Figma card list(9300-36838) — m_card 반복. Card 컴포넌트 재사용(slot props 1:1).
import * as React from 'react'

import { Card, type CardProps } from '@/ui/common/composites/Card'
import { cn } from '@/utils/cn'

/** 카드 1건 = Card props + 고유 id(key/상세 라우팅). */
export interface CardListItem extends Omit<CardProps, 'className'> {
  id: string
}

export interface CardListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CardListItem[]
  /** 로딩 중 — 스켈레톤 노출. */
  loading?: boolean
  /** 로딩 스켈레톤 개수. 기본 3. */
  loadingCount?: number
  /** 빈 목록 안내. 기본 '데이터가 없습니다.'. */
  emptyText?: React.ReactNode
}

const CardList = React.forwardRef<HTMLDivElement, CardListProps>(
  (
    { className, items, loading = false, loadingCount = 3, emptyText = '데이터가 없습니다.', ...props },
    ref,
  ) => {
    if (loading) {
      return (
        <div ref={ref} className={cn('flex w-full flex-col gap-krds-8', className)} {...props}>
          {Array.from({ length: loadingCount }).map((_, i) => (
            <div
              key={i}
              className="h-[200px] w-full animate-pulse rounded-krds-8 bg-muted"
              aria-hidden
            />
          ))}
        </div>
      )
    }

    if (items.length === 0) {
      return (
        <div
          ref={ref}
          className={cn('flex w-full items-center justify-center py-10', className)}
          {...props}
        >
          <p className="text-krds-body-md text-krds-text-subtle">{emptyText}</p>
        </div>
      )
    }

    return (
      <div ref={ref} className={cn('flex w-full flex-col gap-krds-8', className)} {...props}>
        {items.map(({ id, ...cardProps }) => (
          <Card key={id} {...cardProps} />
        ))}
      </div>
    )
  },
)
CardList.displayName = 'CardList'

export { CardList }
