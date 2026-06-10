// Figma m_segmented control(9300-28006) 1:1 — 트랙 + 옵션을 한 컴포넌트로 합친 단일 선택 컨트롤.
// items + value/defaultValue + onValueChange(선택 value 방출). RadioButtonGroup 과 동일한
// controlled/uncontrolled 패턴. 옵션(아톰)은 내부 전용이라 별도 export 하지 않는다.
//
// 트랙 배경(Figma): default #bcd4ff(=bg-primary-subtle) · disabled #f0f0f0(=bg-disabled-soft).
// 옵션: 선택 채움 #0054e9(=primary)/흰 텍스트 · 미선택 투명(트랙 비침) · disabled 회색(#8e8e8e).
import * as React from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/utils/cn'

// 옵션(아톰) 스타일 — 내부 전용.
const optionVariants = cva(
  cn(
    'inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full px-krds-8',
    'text-krds-body-md font-bold transition-colors',
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
  ),
  {
    variants: {
      // selected: 선택 상태(bg 채움) / unselected: 투명(트랙 배경 비침)
      selected: {
        true: 'bg-primary text-white',
        false: 'bg-transparent text-white',
      },
      disabled: { true: '', false: '' },
    },
    compoundVariants: [
      // disabled + selected: 채움이 회색(#8e8e8e)
      { selected: true, disabled: true, class: 'bg-krds-text-disabled text-white' },
      // disabled + unselected: 텍스트가 회색
      { selected: false, disabled: true, class: 'text-krds-text-disabled' },
    ],
    defaultVariants: { selected: false, disabled: false },
  },
)

export interface SegmentedControlItem {
  value: string
  label: React.ReactNode
  /** 개별 옵션 비활성 */
  disabled?: boolean
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** 옵션 목록 */
  items: SegmentedControlItem[]
  /** 선택된 값 (controlled) */
  value?: string
  /** 초기 선택 값 (uncontrolled) */
  defaultValue?: string
  /** 선택 변경 콜백 — 선택된 옵션의 value 를 방출 */
  onValueChange?: (value: string) => void
  /** 그룹 전체 비활성 */
  disabled?: boolean
  /** 각 옵션에 적용할 className (예: 'flex-1' 로 균등 분할) */
  itemClassName?: string
}

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    { className, items, value, defaultValue, onValueChange, disabled = false, itemClassName, ...props },
    ref,
  ) => {
    // controlled / uncontrolled 선택 상태
    const [internal, setInternal] = React.useState<string | undefined>(defaultValue)
    const isControlled = value !== undefined
    const selected = isControlled ? value : internal

    const select = (v: string) => {
      if (!isControlled) setInternal(v)
      onValueChange?.(v) // ← value 방출
    }

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          // w-fit: 부모가 flex(예: flex-col 폼)면 align-items:stretch 로 가로 100% 늘어나는 것 방지.
          //        full-width 가 필요하면 className 으로 'w-full'(+ itemClassName='flex-1') 오버라이드.
          'inline-flex w-fit rounded-full',
          disabled ? 'bg-krds-bg-disabled-soft' : 'bg-krds-bg-primary-subtle',
          className,
        )}
        {...props}
      >
        {items.map((item) => {
          const isSelected = selected === item.value
          const itemDisabled = Boolean(disabled || item.disabled)
          return (
            <button
              key={item.value}
              type="button"
              disabled={itemDisabled}
              aria-pressed={isSelected}
              onClick={() => select(item.value)}
              className={cn(
                optionVariants({ selected: isSelected, disabled: itemDisabled }),
                itemClassName,
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    )
  },
)
SegmentedControl.displayName = 'SegmentedControl'

export { SegmentedControl }
