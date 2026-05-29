// Figma m_navigation item_list(9300-28625) 1:1.
// items 배열을 받아 NavigationItem 매핑. divider 정책은 Figma 기준 자동 처리:
//   - 첫 항목 상단 1px (borderTop)
//   - 모든 항목 하단 1px (borderBottom)
//   → 결과: N+1 라인이 N개 행을 감싼다.
//
// 사용 예:
//   <NavigationItemList
//     items={[
//       { id: 'pq', label: '사전심사(PQ)신청서 작성하기', onClick: () => goto('/pq') },
//       { id: 'bid', label: '입찰서(견적서) 작성하기', onClick: () => goto('/bid') },
//     ]}
//   />
import * as React from 'react'

import {
  NavigationItem,
  type NavigationItemProps,
} from '@/ui/common/base/NavigationItem'
import { cn } from '@/utils/cn'

export interface NavigationItemData
  extends Omit<
    NavigationItemProps,
    'children' | 'borderTop' | 'borderBottom' | 'id'
  > {
  /** 식별자. 없으면 인덱스 사용. */
  id?: string | number
  /** 행 텍스트. */
  label: React.ReactNode
}

export interface NavigationItemListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: NavigationItemData[]
}

function NavigationItemList({
  className,
  items,
  ...props
}: NavigationItemListProps) {
  return (
    <div
      className={cn('flex w-full flex-col items-stretch', className)}
      {...props}
    >
      {items.map((item, i) => {
        const { id, label, ...itemProps } = item
        const key = id ?? i
        return (
          <NavigationItem
            key={key}
            borderTop={i === 0}
            borderBottom
            {...itemProps}
          >
            {label}
          </NavigationItem>
        )
      })}
    </div>
  )
}
NavigationItemList.displayName = 'NavigationItemList'

export { NavigationItemList }
