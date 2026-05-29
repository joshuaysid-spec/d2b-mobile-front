// Figma m_selection field_box(9300-29018) 1:1.
// 클릭 시 외부에서 모달/시트가 열려 값을 받는 선택 트리거 박스 — input 이 아니라 button.
// Figma 7 state(default/focus/filled/error/error_focus/read-only/disabled)는
// props 조합으로 자동 도출:
//   value 비어있음               → default(placeholder 회색)
//   value 있음                   → filled(텍스트 ink)
//   focus(:focus-visible)        → 2px primary-dark 보더
//   error                        → 1px danger 보더 + danger-subtle bg
//   error + focus                → 2px danger 보더 + danger-subtle bg
//   readOnly                     → 클릭 비활성 (cursor default, X 숨김)
//   disabled                     → 회색 bg + 회색 보더 + 클릭 불가
//
// 우측 화살표(>)는 항상 표시. onClear 제공 시 (value 있고 !disabled && !readOnly)
// X(Cancel) 버튼이 화살표 좌측에 노출.
//
// 사용 예:
//   const [v, setV] = useState('')
//   <SelectionFieldBox
//     value={v}
//     placeholder="발주기관을 입력하세요."
//     onClick={() => setSheetOpen(true)}
//     onClear={() => setV('')}
//   />
import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface SelectionFieldBoxProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'value' | 'children' | 'type'
  > {
  /** 현재 선택된 값(텍스트). 비어있으면 placeholder 표시. */
  value?: string
  /** value 가 비어있을 때 표시할 안내 문구. */
  placeholder?: string
  /** 에러 상태 — 보더/배경을 danger 토큰으로 전환. */
  error?: boolean
  /** 읽기 전용 — 클릭 비활성(button disabled 와 별개, 시각 표현은 filled). */
  readOnly?: boolean
  /** 우측 X 버튼 노출 + 클릭 핸들러. value 가 있고 !disabled/!readOnly 일 때만 보임. */
  onClear?: () => void
}

const SelectionFieldBox = React.forwardRef<HTMLButtonElement, SelectionFieldBoxProps>(
  (
    {
      className,
      value,
      placeholder = '내용을 입력하세요.',
      error = false,
      readOnly = false,
      disabled,
      onClear,
      onClick,
      ...props
    },
    ref,
  ) => {
    const hasValue = Boolean(value && value.length > 0)
    const isInteractive = !disabled && !readOnly
    const showClear = Boolean(onClear) && hasValue && isInteractive

    return (
      <div
        className={cn(
          // 그룹 박스 — button 의 focus-visible 를 받아 보더 2px 로 강조
          'group flex h-12 w-full items-center gap-krds-3 rounded-krds-8 border px-krds-6 transition-colors',
          'has-[:focus-visible]:border-2',
          error
            ? 'border-krds-border-danger bg-krds-bg-danger-subtle has-[:focus-visible]:border-krds-border-danger'
            : 'border-krds-border-field bg-background has-[:focus-visible]:border-krds-action-primary-active',
          disabled && 'border-krds-border-disabled bg-krds-bg-disabled-soft',
          className,
        )}
      >
        <button
          ref={ref}
          type="button"
          disabled={disabled || readOnly}
          aria-disabled={disabled || readOnly || undefined}
          onClick={isInteractive ? onClick : undefined}
          className={cn(
            'min-w-0 flex-1 truncate bg-transparent p-0 text-left text-krds-body-md outline-none',
            // 값 유무에 따라 텍스트 색만 분기 — readOnly/disabled 도 ink 유지(Figma)
            hasValue ? 'text-krds-text-ink' : 'text-krds-text-disabled',
            isInteractive ? 'cursor-pointer' : 'cursor-default',
            disabled && 'cursor-not-allowed',
          )}
          {...props}
        >
          {hasValue ? value : placeholder}
        </button>

        {showClear && (
          <button
            type="button"
            aria-label="선택 초기화"
            onClick={onClear}
            className="shrink-0 text-krds-text-disabled"
          >
            <Icon name="Cancel" size={20} aria-hidden />
          </button>
        )}

        <Icon
          name="ArrowForwardIos"
          size={20}
          aria-hidden
          className={cn(
            'shrink-0',
            disabled ? 'text-krds-text-disabled' : 'text-krds-text-ink',
          )}
        />
      </div>
    )
  },
)
SelectionFieldBox.displayName = 'SelectionFieldBox'

export { SelectionFieldBox }
