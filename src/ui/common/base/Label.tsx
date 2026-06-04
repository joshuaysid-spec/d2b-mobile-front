import * as React from 'react'
import { cva } from 'class-variance-authority'

import { Label as RawLabel } from '@/ui/raw/label'
import { cn } from '@/utils/cn'

const labelVariants = cva(
  cn(
    'text-krds-body-sm font-bold text-foreground',
    'peer-disabled:cursor-not-allowed peer-disabled:text-krds-text-disabled',
  ),
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof RawLabel> {
  required?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required = false, children, ...props }, ref) => (
    <RawLabel ref={ref} className={cn(labelVariants(), className)} {...props}>
      {children}
      {required && (
        <span className="ml-0.5 text-krds-text-danger" aria-hidden="true">
          *
        </span>
      )}
    </RawLabel>
  ),
)
Label.displayName = 'Label'

export { Label, labelVariants }
