import * as React from 'react'

import { Textarea as RawTextarea } from '@/ui/raw/textarea'
import { cn } from '@/utils/cn'

/** TextArea 기본 최대 글자수 — 사유/내용류 컬럼(4000) 기준. 카운터 표시 등 사용처가 같은 값을 쓸 때 import. */
export const TEXT_AREA_MAX_LENGTH = 4000

export interface TextAreaProps
  extends React.ComponentPropsWithoutRef<typeof RawTextarea> {
  /** true 시 에러 스타일 (분홍 배경 + 빨강 보더) */
  error?: boolean
  /**
   * 최대 글자수(UTF-16 단위). 기본 TEXT_AREA_MAX_LENGTH(4000) — 설계서 자릿수가 다르면 명시.
   * 타이핑만 막으므로 붙여넣기·프로그램 세팅은 zod `.max()` 가 최종 방어(docs/rules/forms.md).
   */
  maxLength?: number
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error = false, disabled, maxLength = TEXT_AREA_MAX_LENGTH, ...props }, ref) => (
    <RawTextarea
      ref={ref}
      disabled={disabled}
      maxLength={maxLength}
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
