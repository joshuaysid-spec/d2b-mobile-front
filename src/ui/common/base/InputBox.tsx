import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { Input as RawInput } from '@/ui/raw/input'
import { cn } from '@/utils/cn'

export interface InputBoxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  error?: boolean
  onClear?: () => void
  className?: string
}

const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  ({ className, error = false, onClear, disabled, ...props }, ref) => (
    <div
      className={cn(
        'group flex h-12 w-full items-center gap-krds-3 rounded-krds-8 border px-krds-6 transition-colors',
        error
          ? 'border-krds-border-danger bg-krds-bg-danger-subtle focus-within:border-2'
          : 'border-krds-border-field bg-background focus-within:border-2 focus-within:border-krds-action-primary-active',
        disabled && 'border-krds-border-disabled bg-krds-bg-disabled-soft',
        className,
      )}
    >
      <RawInput
        ref={ref}
        disabled={disabled}
        className="min-w-0 flex-1 border-none bg-transparent p-0 text-krds-body-md text-krds-text-ink shadow-none outline-hidden ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-krds-text-disabled disabled:cursor-not-allowed"
        {...props}
      />
      {onClear && !disabled && (
        <button
          type="button"
          aria-label="입력 내용 지우기"
          onClick={onClear}
          className="hidden shrink-0 text-krds-text-disabled group-focus-within:flex"
        >
          <Icon name="Close" size={20} aria-hidden />
        </button>
      )}
    </div>
  ),
)
InputBox.displayName = 'InputBox'

export { InputBox }
