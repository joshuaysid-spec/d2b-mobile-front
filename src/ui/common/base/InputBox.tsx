import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { Input as RawInput } from '@/ui/raw/input'
import { cn } from '@/utils/cn'

/**
 * 입력 종류 — 허용 문자·키패드·IME 가드를 InputBox 가 내부에서 자동 처리한다.
 *   - `text`(기본): 가공 없음. 한글 포함 자유 입력. IME 가드 안 탐(회귀 0).
 *   - `numeric`: 숫자만(0-9). 숫자 키패드.
 *   - `tel`: 숫자만 + 전화 키패드. 하이픈 등 표시 포맷은 `format` 으로.
 *   - `english`: 영문/영숫자만.
 * text 외에는 비허용 문자를 입력 즉시 제거하므로, 한글 IME 조합이 깨지지 않도록
 * compositionstart~end 동안에는 가공을 보류한다(IME 가드).
 */
export type InputBoxType = 'text' | 'numeric' | 'tel' | 'english'

// inputType 별 비허용 문자 제거 필터
const FILTERS: Record<InputBoxType, (v: string) => string> = {
  text: (v) => v,
  numeric: (v) => v.replace(/[^0-9]/g, ''),
  tel: (v) => v.replace(/[^0-9]/g, ''),
  english: (v) => v.replace(/[^A-Za-z0-9]/g, ''),
}

// inputType → 모바일 키패드 힌트
const INPUT_MODE: Record<InputBoxType, React.HTMLAttributes<HTMLInputElement>['inputMode'] | undefined> = {
  text: undefined,
  numeric: 'numeric',
  tel: 'tel',
  english: undefined,
}

export interface InputBoxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  error?: boolean
  onClear?: () => void
  className?: string
  /** 입력 종류(허용 문자·키패드·IME 가드). 기본 'text'(가공 없음). */
  inputType?: InputBoxType
  /** 필터 후 적용할 표시 포맷(예: 전화 하이픈 `formatPhoneInput`, 금액 콤마). controlled value 에 반영된다. */
  format?: (filtered: string) => string
}

const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  (
    {
      className,
      error = false,
      onClear,
      disabled,
      inputType = 'text',
      format,
      inputMode,
      onChange,
      onCompositionStart,
      onCompositionEnd,
      ...props
    },
    ref,
  ) => {
    // IME 조합 중에는 가공을 보류(한글 등 조합 글자 삭제로 인한 커서 튐/깨짐 방지).
    const composingRef = React.useRef(false)
    const guarded = inputType !== 'text' || !!format

    // 원시 입력값 → 필터(inputType) → 포맷(format) 적용한 최종 문자열
    const transform = React.useCallback(
      (raw: string) => {
        const filtered = FILTERS[inputType](raw)
        return format ? format(filtered) : filtered
      },
      [inputType, format],
    )

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (guarded && !composingRef.current) {
          // DOM value 를 가공값으로 교체 → 화면 표시 + (controlled)onChange 가 읽는 값 일치
          e.target.value = transform(e.target.value)
        }
        onChange?.(e)
      },
      [guarded, transform, onChange],
    )

    const handleCompositionStart = React.useCallback(
      (e: React.CompositionEvent<HTMLInputElement>) => {
        composingRef.current = true
        onCompositionStart?.(e)
      },
      [onCompositionStart],
    )

    const handleCompositionEnd = React.useCallback(
      (e: React.CompositionEvent<HTMLInputElement>) => {
        composingRef.current = false
        if (guarded) {
          // 조합 종료 후 최종값을 한 번 가공해 반영
          const el = e.currentTarget
          el.value = transform(el.value)
          onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>)
        }
        onCompositionEnd?.(e)
      },
      [guarded, transform, onChange, onCompositionEnd],
    )

    return (
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
          inputMode={inputMode ?? INPUT_MODE[inputType]}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
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
    )
  },
)
InputBox.displayName = 'InputBox'

export { InputBox }
