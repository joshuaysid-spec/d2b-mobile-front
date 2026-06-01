import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { Button as RawButton } from '@/ui/raw/button'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-krds-3 whitespace-nowrap rounded-krds-8 font-bold ring-offset-background transition-colors disabled:pointer-events-none disabled:border-transparent disabled:bg-krds-bg-disabled disabled:text-krds-text-disabled [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white hover:bg-primary hover:text-white active:bg-krds-action-primary-active',
        secondary:
          'border border-krds-border-primary bg-background text-krds-text-primary hover:bg-background hover:text-krds-text-primary active:bg-krds-action-pressed',
        inner:
          'border border-krds-border-primary bg-background font-medium text-krds-text-primary hover:bg-background hover:text-krds-text-primary active:bg-krds-action-pressed',
        tertiary:
          'border border-krds-border-tertiary bg-background text-krds-text-primary-active hover:bg-background hover:text-krds-text-primary-active active:bg-krds-action-tertiary-active active:border-krds-border-tertiary-active',
      },
      size: {
        default: 'h-12 min-w-[76px] px-krds-5 text-krds-body-md',
        sm: 'h-10 px-krds-4 text-krds-body-sm',
        lg: 'h-14 px-krds-8 text-krds-body-lg',
        icon: 'size-12',
      },
      iconSize: {
        xs: '[&_svg]:!size-3',
        sm: '[&_svg]:!size-4',
        md: '[&_svg]:!size-5',
        lg: '[&_svg]:!size-6',
        xl: '[&_svg]:!size-7',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      iconSize: 'md',
    },
  },
)

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RawButton>, 'variant' | 'size' | 'iconSize'>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconSize, ...props }, ref) => (
    <RawButton
      ref={ref}
      className={cn(buttonVariants({ variant, size, iconSize, className }))}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { Button, buttonVariants }
