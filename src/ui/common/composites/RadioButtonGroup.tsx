import * as React from 'react'

import { RadioGroup } from '@/ui/raw/radio-group'
import { RadioButton, type RadioButtonProps } from '@/ui/common/base/RadioButton'
import { cn } from '@/utils/cn'

export interface RadioButtonGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroup> {
  /** 라디오 항목 목록 */
  items: Array<{ value: string; label: React.ReactNode; disabled?: boolean }>
  /** 'horizontal' — 가로 wrap, 'vertical' — 세로 스택 (기본: horizontal) */
  direction?: 'horizontal' | 'vertical'
  /** 각 RadioButton에 적용할 className */
  itemClassName?: RadioButtonProps['className']
  /** 좌측 원형 라디오 표시(○/●) 유무. 기본 false(원형 없는 pill). */
  showIndicator?: boolean
}

const RadioButtonGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroup>,
  RadioButtonGroupProps
>((
  { className, items, direction = 'horizontal', itemClassName, showIndicator = false, ...props },
  ref,
) => (
  <RadioGroup
    ref={ref}
    className={cn(
      direction === 'horizontal'
        ? 'flex flex-wrap gap-2'
        : 'flex flex-col gap-2',
      className,
    )}
    {...props}
  >
    {items.map(({ value, label, disabled }) => (
      <RadioButton
        key={value}
        value={value}
        label={label}
        disabled={disabled}
        showIndicator={showIndicator}
        className={cn(
          direction === 'horizontal' ? 'flex-1' : 'w-full',
          itemClassName,
        )}
      />
    ))}
  </RadioGroup>
))
RadioButtonGroup.displayName = 'RadioButtonGroup'

export { RadioButtonGroup }
