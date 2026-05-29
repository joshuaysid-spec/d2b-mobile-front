// Figma m_date_input_box(9052-1579) 1:1 — 5 state(default/filled/focus/error/error_focus).
// 텍스트가 가운데 정렬 (일반 InputBox 는 좌측 정렬) · 모바일 숫자 키패드(inputMode="numeric").
// readOnly 로 두면 BottomSheet 트리거 역할, 기본은 편집 가능한 input.
import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { Input as RawInput } from '@/ui/raw/input'
import { cn } from '@/utils/cn'

export interface DateInputBoxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  error?: boolean
  /** clear(X) 버튼 핸들러. 주면 focus 시 X 버튼 노출. */
  onClear?: () => void
  className?: string
}

const DateInputBox = React.forwardRef<HTMLInputElement, DateInputBoxProps>(
  (
    {
      className,
      error = false,
      onClear,
      disabled,
      placeholder = '일자를 선택해주세요.',
      ...props
    },
    ref,
  ) => (
    <div
      className={cn(
        'group flex h-12 w-full items-center justify-center gap-krds-5 rounded-krds-8 border px-krds-6 transition-colors',
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
        inputMode="numeric"
        maxLength={10}
        placeholder={placeholder}
        className={cn(
          'min-w-0 flex-1 border-none bg-transparent p-0 text-center text-krds-body-md text-krds-text-ink shadow-none outline-none ring-0',
          'focus-visible:ring-0 placeholder:text-krds-text-disabled disabled:cursor-not-allowed',
        )}
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
DateInputBox.displayName = 'DateInputBox'

export { DateInputBox }
