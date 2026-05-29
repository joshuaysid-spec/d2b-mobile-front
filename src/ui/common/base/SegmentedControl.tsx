// Figma m_segmented control_option(9052-1309) 1:1 — 단일 옵션(아톰) 알약 형태.
// 트랙(여러 옵션을 감싸는 컨테이너)은 사용처에서 직접 flex+rounded-full+bg 로 합성한다.
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/cn'

const segmentedControlVariants = cva(
  cn(
    'inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full px-krds-8',
    'text-krds-body-md font-bold transition-colors',
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
  ),
  {
    variants: {
      // selected: 선택 상태 — bg 채움
      // unselected: 미선택 상태 — bg 투명 (트랙의 배경이 비침)
      selected: {
        true: 'bg-primary text-white',
        false: 'bg-transparent text-white',
      },
      disabled: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // disabled + selected: 채움 색이 회색으로 (#8e8e8e = krds-text-disabled)
      {
        selected: true,
        disabled: true,
        class: 'bg-krds-text-disabled text-white',
      },
      // disabled + unselected: 텍스트가 회색으로
      {
        selected: false,
        disabled: true,
        class: 'text-krds-text-disabled',
      },
    ],
    defaultVariants: {
      selected: false,
      disabled: false,
    },
  },
)

export interface SegmentedControlProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof segmentedControlVariants> {}

const SegmentedControl = React.forwardRef<HTMLButtonElement, SegmentedControlProps>(
  ({ className, selected = false, disabled = false, type = 'button', children, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled ?? false}
      aria-pressed={selected ?? false}
      className={cn(segmentedControlVariants({ selected, disabled, className }))}
      {...props}
    >
      {children}
    </button>
  ),
)
SegmentedControl.displayName = 'SegmentedControl'

export { SegmentedControl, segmentedControlVariants }
