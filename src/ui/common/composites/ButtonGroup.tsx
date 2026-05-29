// Figma button group(9300-27107 / 9052-258) 1:1.
// items 배열 + layout prop 으로 4가지 배치를 표현한다.
//
//   layout='single'      ── 첫 items[0] 만 w-full 풀폭 1버튼
//   layout='asymmetric'  ── (기본) 가로 · 첫 항목 w-[100px] 고정 + 마지막 flex-1, 사이 항목 shrink-0
//   layout='split'       ── 가로 · 모든 항목 flex-1 균등 분할
//   layout='vertical'    ── 세로 스택 · 모두 w-full, items 순서 그대로(items[0] 위)
//
// items 순서 컨벤션:
//   - 가로(asymmetric/split): 좌→우 = [secondary, ..., primary]  (마지막이 주 액션)
//   - 세로(vertical):       위→아래 = [primary, ..., secondary]  (위가 주 액션)
//   사용자 코드가 items 순서를 직접 정한다 — 컴포넌트는 정렬을 강제하지 않는다.
//
// gap: 가로 8px(=krds-5) / 세로 8px(=krds-5).
import * as React from 'react'

import { Button, type ButtonProps } from '@/ui/common/base/Button'
import { cn } from '@/utils/cn'

export interface ButtonGroupItem
  extends Omit<ButtonProps, 'className' | 'children'> {
  label: React.ReactNode
  /** 개별 버튼 className — layout 이 부여한 폭 클래스를 오버라이드한다. */
  itemClassName?: string
}

export type ButtonGroupLayout = 'single' | 'asymmetric' | 'split' | 'vertical'

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ButtonGroupItem[]
  /** 배치 모드. 기본 'asymmetric'. */
  layout?: ButtonGroupLayout
}

function ButtonGroup({
  className,
  items,
  layout = 'asymmetric',
  ...props
}: ButtonGroupProps) {
  if (items.length === 0) return null

  if (layout === 'single') {
    const { label, itemClassName, ...buttonProps } = items[0]
    return (
      <div className={cn('flex w-full', className)} {...props}>
        <Button
          className={cn('w-full', itemClassName)}
          {...buttonProps}
        >
          {label}
        </Button>
      </div>
    )
  }

  const isVertical = layout === 'vertical'

  return (
    <div
      className={cn(
        'flex w-full gap-krds-5',
        isVertical ? 'flex-col items-stretch' : 'flex-row items-center',
        className,
      )}
      {...props}
    >
      {items.map(({ label, itemClassName, ...buttonProps }, i) => {
        const isLast = i === items.length - 1

        let widthClass = ''
        if (layout === 'vertical') {
          widthClass = 'w-full'
        } else if (layout === 'split') {
          widthClass = 'flex-1'
        } else {
          // asymmetric — 마지막 flex-1, 그 외 shrink-0. 첫 항목은 Figma 100px 기본.
          if (isLast) {
            widthClass = 'flex-1'
          } else if (i === 0) {
            widthClass = 'w-[100px] shrink-0'
          } else {
            widthClass = 'shrink-0'
          }
        }

        return (
          <Button
            key={i}
            className={cn(widthClass, itemClassName)}
            {...buttonProps}
          >
            {label}
          </Button>
        )
      })}
    </div>
  )
}
ButtonGroup.displayName = 'ButtonGroup'

export { ButtonGroup }
