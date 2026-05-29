// Figma m_tag_list(9300-27122) 1:1.
// items 배열을 받아 Tag 로 매핑. flex-wrap + gap 8.
//
// 사용 예:
//   <TagList
//     items={[{ id: '1', label: '입찰서' }, { id: '2', label: '공고' }]}
//     onRemove={(id) => setItems(prev => prev.filter(t => t.id !== id))}
//   />
//
//   <TagList items={[{ label: '읽기전용1' }, { label: '읽기전용2' }]} />  // closable 안 줌
//
// onRemove 전달 시 자동으로 각 태그가 closable + X 클릭 콜백을 받는다.
// closable 만 true 로 주고 onRemove 없으면 X 만 표시(클릭 비활성 회색).
import * as React from 'react'

import { Tag, type TagProps } from '@/ui/common/base/Tag'
import { cn } from '@/utils/cn'

export interface TagItem
  extends Omit<TagProps, 'children' | 'onClose' | 'id'> {
  /** 식별자 — onRemove 콜백에 전달. 없으면 인덱스 사용. */
  id?: string | number
  /** 표시 텍스트. */
  label: React.ReactNode
}

export interface TagListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TagItem[]
  /** 모든 태그를 closable 로 일괄 설정. 개별 item.closable 이 우선. */
  closable?: boolean
  /** 태그 X 클릭 핸들러 — (id 또는 인덱스) 전달. 주어지면 자동으로 closable=true. */
  onRemove?: (id: string | number) => void
}

function TagList({
  className,
  items,
  closable,
  onRemove,
  ...props
}: TagListProps) {
  return (
    <div
      className={cn('flex flex-wrap items-start gap-krds-5', className)}
      {...props}
    >
      {items.map((item, i) => {
        const { id, label, closable: itemClosable, ...tagProps } = item
        const key = id ?? i
        const isClosable = itemClosable ?? (closable || Boolean(onRemove))
        return (
          <Tag
            key={key}
            closable={isClosable}
            onClose={onRemove ? () => onRemove(key) : undefined}
            {...tagProps}
          >
            {label}
          </Tag>
        )
      })}
    </div>
  )
}
TagList.displayName = 'TagList'

export { TagList }
