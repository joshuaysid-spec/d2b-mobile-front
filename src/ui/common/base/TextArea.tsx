import * as React from 'react'

import { Textarea as RawTextarea } from '@/ui/raw/textarea'
import { cn } from '@/utils/cn'

export interface TextAreaProps
  extends React.ComponentPropsWithoutRef<typeof RawTextarea> {
  /** true 시 에러 스타일 (분홍 배경 + 빨강 보더) */
  error?: boolean
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error = false, disabled, ...props }, ref) => (
    <RawTextarea
      ref={ref}
      disabled={disabled}
      className={cn(
        // base — Figma m_text area_box: h-200 · p-10 · rounded-8 · resize-none
        'min-h-[200px] w-full rounded-krds-8 border p-krds-6',
        'text-krds-body-md text-krds-text-ink',
        'resize-none transition-colors',
        'placeholder:text-krds-text-disabled',
        // ring 제거 (border로 focus 표현)
        'focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0',
        // default / focus
        !error && [
          'border-krds-border-field bg-background',
          'focus:border-2 focus:border-krds-action-primary-active',
        ],
        // error / error_focus
        error && [
          'border-krds-border-danger bg-krds-bg-danger-subtle',
          'focus:border-2 focus:border-krds-border-danger',
        ],
        // disabled (에러보다 우선)
        'disabled:cursor-not-allowed disabled:resize-none',
        'disabled:border-krds-border-disabled disabled:bg-krds-bg-disabled-soft disabled:text-krds-text-disabled',
        className,
      )}
      {...props}
    />
  ),
)
TextArea.displayName = 'TextArea'

export { TextArea }
