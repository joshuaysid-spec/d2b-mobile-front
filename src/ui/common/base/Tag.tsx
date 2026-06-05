// Figma m_tag(9300-27119) 1:1.
// 칩형 태그 — 높이 39px · bg-white + 1px field 보더 + rounded-full · 15px Regular ink 텍스트.
// closable prop 또는 onClose 핸들러 제공 시 우측 X 아이콘 노출 + 클릭 시 onClose 호출.
//   X 아이콘 = 연파랑 원(#C1D1EE=krds-border-field) 안에 흰 X(#FFFFFF=text-white).
//
// 사용 예:
//   <Tag>태그</Tag>
//   <Tag closable onClose={() => remove(id)}>입찰서</Tag>
//   <Tag closable>읽기전용</Tag>           // onClose 없이도 X 표시 가능
import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 우측 X 아이콘 노출 여부. onClose 만 주어져도 자동 true. 기본 false. */
  closable?: boolean
  /** X 아이콘 클릭 핸들러. 주어지면 closable 자동 true. */
  onClose?: () => void
  /** X 버튼 aria-label. 기본 "태그 삭제". */
  closeLabel?: string
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      closable,
      onClose,
      closeLabel = '태그 삭제',
      children,
      ...props
    },
    ref,
  ) => {
    const showClose = closable || Boolean(onClose)
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex h-[39px] items-center justify-center gap-krds-3 rounded-krds-full border bg-background',
          'border-krds-border-field px-krds-6',
          'text-[15px] font-normal leading-normal text-krds-text-ink whitespace-nowrap',
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        {showClose && (
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            disabled={!onClose}
            className="shrink-0 disabled:cursor-default"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-krds-border-field">
              <Icon
                name="Close"
                size={14}
                weight={700}
                className="text-white"
                aria-hidden
              />
            </span>
          </button>
        )}
      </span>
    )
  },
)
Tag.displayName = 'Tag'

export { Tag }
