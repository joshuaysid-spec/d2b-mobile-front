// Figma m_Infobox(9300-29649) 1:1.
// ⓘ 아이콘 + 타이틀 헤더 + 본문(불릿 리스트/링크). 업무도움·안내사항 등에 재사용.
// variant:
//   collapsible(기본 true) — 우측 chevron, 헤더 클릭 토글. opened/closed.
//   static(collapsible=false) — chevron 없음, 본문 항상 노출(헤더 비클릭).
// 헤더 bg = primary-faint(#ecf1fa, SectionTitle blue 와 동일 토큰), 본문 bg = background.
// 상태: controlled(open/onOpenChange) / uncontrolled(defaultOpen, 기본 closed).
import * as React from 'react'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface InfoboxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 헤더 타이틀 (예: '업무도움' · '안내사항'). */
  title: React.ReactNode
  /** 헤더 좌측 아이콘. 기본 'Info'. */
  icon?: IconName
  /** 본문 불릿 항목들. 각 항목은 ReactNode(링크 포함 가능). children 과 택1. */
  items?: React.ReactNode[]
  /** items 대신 자유 본문. */
  children?: React.ReactNode
  /** 접기 가능 여부. 기본 true. false 면 chevron 없이 항상 펼침(static). */
  collapsible?: boolean
  /** uncontrolled 초기 펼침 여부. 기본 false(closed). */
  defaultOpen?: boolean
  /** controlled 펼침 상태. */
  open?: boolean
  /** controlled 변경 콜백. */
  onOpenChange?: (open: boolean) => void
}

const Infobox = React.forwardRef<HTMLDivElement, InfoboxProps>(
  (
    {
      className,
      title,
      icon = 'Info',
      items,
      children,
      collapsible = true,
      defaultOpen = false,
      open,
      onOpenChange,
      ...props
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const isControlled = open !== undefined
    // static(미접힘)은 항상 펼침
    const isOpen = !collapsible || (isControlled ? open : internalOpen)

    const toggle = () => {
      const next = !isOpen
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    }

    const header = (
      <>
        <Icon
          name={icon}
          size={20}
          fill={1}
          className="shrink-0 text-krds-action-primary-active"
          aria-hidden
        />
        <span className="min-w-px flex-1 text-[19px] font-bold leading-normal text-krds-action-primary-active">
          {title}
        </span>
        {collapsible && (
          <Icon
            name="ArrowForwardIos"
            size={20}
            className={cn(
              // arrow_forward_ios(›) 90° 회전 → 아래(⌄), 열림 시 위(⌃)
              'shrink-0 rotate-90 text-krds-action-primary-active transition-transform duration-200',
              isOpen && 'rotate-[270deg]',
            )}
            aria-hidden
          />
        )}
      </>
    )

    const body = (isOpen && (items?.length || children)) && (
      <div className="bg-background px-krds-8 py-krds-8">
        {items?.length ? (
          <ul className="flex flex-col gap-krds-5">
            {items.map((it, i) => (
              <li
                key={i}
                className="flex gap-krds-5 text-[17px] leading-normal text-krds-text-ink"
              >
                <span
                  aria-hidden
                  className="mt-[0.6em] size-1 shrink-0 rounded-full bg-krds-text-ink"
                />
                <span className="min-w-px flex-1 wrap-break-word">{it}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-[17px] leading-normal text-krds-text-ink">{children}</div>
        )}
      </div>
    )

    return (
      <div
        ref={ref}
        className={cn('flex w-full flex-col overflow-hidden rounded-krds-8', className)}
        {...props}
      >
        {collapsible ? (
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isOpen}
            className={cn(
              'flex min-h-[56px] w-full items-center gap-krds-5 bg-krds-bg-primary-faint px-krds-8 text-left',
              'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
            )}
          >
            {header}
          </button>
        ) : (
          <div className="flex min-h-[56px] w-full items-center gap-krds-5 bg-krds-bg-primary-faint px-krds-8">
            {header}
          </div>
        )}
        {body}
      </div>
    )
  },
)
Infobox.displayName = 'Infobox'

export { Infobox }
