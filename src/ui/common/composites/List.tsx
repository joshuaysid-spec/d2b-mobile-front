// Figma list(9300-29812) 1:1.
// items 배열을 받아 행을 자동 렌더. layout 별로 다른 슬롯/하위 컴포넌트 사용.
// position(top/middle/bottom) 은 인덱스 기반으로 자동 계산 — divider 처리만 분기.
//
// 두 가지 layout:
//
// 1) layout: 'text'
//    아이콘(옵션) + 우측 Switch + 제목(19 Bold ink) + 설명(17 Regular muted, multi-line)
//    ```
//    { layout: 'text', icon?, title, description?, switch?: { checked, onChange } }
//    ```
//    Switch 가 우측 상단, 제목/설명은 좌측 flex 컬럼.
//
// 2) layout: 'keyvalue'
//    아이콘(옵션) + 제목(19 Bold) + 메타 행(17 Regular muted, '|' divider 로 구분) + full-width 버튼(옵션)
//    ```
//    { layout: 'keyvalue', icon?, title, meta?: ReactNode[], button?: { label, onClick } }
//    ```
//
// 행 사이 1px `krds-border-divider` 자동 (마지막 행은 안 그림).
// 기존 Switch / Button / Icon 재사용.
//
// 사용 예:
//   <List items={[
//     { layout: 'text', icon: 'Smartphone', title: '리스트 제목',
//       description: '...', switch: { checked: on, onChange: setOn } },
//     { layout: 'keyvalue', icon: 'Notifications', title: '폴더명',
//       meta: ['수정 2025-01-31 12:12', '폴더 10MB'],
//       button: { label: '버튼', onClick: () => goto(...) } },
//   ]} />
import * as React from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon, type IconName } from '@/ui/common/base/Icon'
import { Switch } from '@/ui/common/base/Switch'
import { cn } from '@/utils/cn'

interface TextListItem {
  layout: 'text'
  icon?: IconName
  title: React.ReactNode
  description?: React.ReactNode
  /** 우측 Switch — 미주입 시 미노출. */
  switch?: {
    checked?: boolean
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void
    disabled?: boolean
  }
}

interface KeyValueListItem {
  layout: 'keyvalue'
  icon?: IconName
  title: React.ReactNode
  /** 제목 아래 메타 행. 각 요소 사이에 '|' divider 자동 삽입. */
  meta?: React.ReactNode[]
  /** 하단 full-width 버튼. 미주입 시 미노출. */
  button?: {
    label: React.ReactNode
    onClick?: () => void
    variant?: 'primary' | 'secondary' | 'inner'
  }
}

export type ListItemData = TextListItem | KeyValueListItem

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ListItemData[]
}

function List({ className, items, ...props }: ListProps) {
  return (
    <div
      role="list"
      className={cn('flex w-full flex-col', className)}
      {...props}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <div
            key={i}
            role="listitem"
            className={cn(
              'flex w-full',
              i === 0 ? 'pb-krds-8' : 'py-krds-8',
              !isLast && 'border-b border-krds-border-divider',
            )}
          >
            {item.layout === 'text' ? (
              <TextRow item={item} />
            ) : (
              <KeyValueRow item={item} />
            )}
          </div>
        )
      })}
    </div>
  )
}
List.displayName = 'List'

// ─── layout='text' ──────────────────────────────────────────────────────────
function TextRow({ item }: { item: TextListItem }) {
  return (
    <div className="flex w-full items-start gap-krds-5">
      {item.icon && (
        <div className="flex shrink-0 items-center pt-0.5">
          <Icon name={item.icon} size={24} aria-hidden />
        </div>
      )}
      <div className="flex min-w-px flex-1 flex-col gap-krds-5">
        <div className="flex w-full items-start justify-between gap-krds-5">
          <p className="min-w-px flex-1 text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
            {item.title}
          </p>
          {item.switch && (
            <div className="shrink-0">
              <Switch {...item.switch} />
            </div>
          )}
        </div>
        {item.description && (
          <p className="text-[17px] font-normal leading-normal text-krds-text-muted wrap-break-word">
            {item.description}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── layout='keyvalue' ──────────────────────────────────────────────────────
function KeyValueRow({ item }: { item: KeyValueListItem }) {
  return (
    <div className="flex w-full flex-col gap-krds-8">
      <div className="flex w-full items-start gap-krds-5">
        {item.icon && (
          <div className="flex shrink-0 items-center pt-0.5">
            <Icon name={item.icon} size={24} aria-hidden />
          </div>
        )}
        <div className="flex min-w-px flex-1 flex-col gap-krds-5">
          <p className="min-w-px text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
            {item.title}
          </p>
          {item.meta && item.meta.length > 0 && (
            <div className="flex items-center gap-krds-5">
              {item.meta.map((m, mi) => (
                <React.Fragment key={mi}>
                  {mi > 0 && (
                    <span
                      aria-hidden
                      className="h-5 w-px shrink-0 bg-krds-border-divider"
                    />
                  )}
                  <span className="text-[17px] font-normal leading-normal text-krds-text-muted whitespace-nowrap">
                    {m}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
      {item.button && (
        <Button
          variant={item.button.variant ?? 'inner'}
          onClick={item.button.onClick}
          className="w-full"
        >
          {item.button.label}
        </Button>
      )}
    </div>
  )
}

export { List }
