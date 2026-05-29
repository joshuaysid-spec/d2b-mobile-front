import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { Button as RawButton } from '@/ui/raw/button'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-krds-3 whitespace-nowrap rounded-krds-8',
    'font-bold ring-offset-background transition-colors',
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:border-transparent disabled:bg-krds-bg-disabled disabled:text-krds-text-disabled',
    '[&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0',
  ),
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white active:bg-krds-action-primary-active',
        secondary:
          'border border-krds-border-primary bg-background text-krds-text-primary active:bg-krds-bg-primary-subtle',
        inner:
          'border border-krds-border-primary bg-background font-medium text-krds-text-primary active:bg-krds-bg-primary-subtle',
      },
      size: {
        default: 'h-12 min-w-[76px] px-krds-5 text-krds-body-md',
        sm: 'h-10 px-krds-4 text-krds-body-sm',
        lg: 'h-14 px-krds-8 text-krds-body-lg',
        icon: 'size-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RawButton>, 'variant' | 'size'>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <RawButton
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { Button, buttonVariants }
