// Figma m_help_disclosure(10020:13190) 1:1 — "업무도움" 접힘(disclosure).
// 여러 화면(디지털캐비닛·군수품무역대리업 목록/상세·업체등록안내 등)에서 반복되는 공통 요소.
//
// Figma 실측: 헤더 h56 · bg #ecf1fa(primary-faint) · border-top 1px #d1d7e0 · px16 · gap16
//   · 좌: system-info(별도제작, **면으로 채워진 info**) 24 + 타이틀 19px Bold #0f316e(text-primary-active)
//   · 우: chevron(arrow) 20. 기본 접힘(closed). 열면 안내 항목(불릿 리스트) 노출.
//
// 사용:
//   <HelpDisclosure items={['안내 1', '안내 2']} />                 // 기본 타이틀 '업무도움' + 불릿
//   <HelpDisclosure title="도움말" items={[...]} />
//   <HelpDisclosure>{커스텀 콘텐츠}</HelpDisclosure>                // items 대신 임의 콘텐츠
import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface HelpDisclosureProps {
  /** 헤더 타이틀. 기본 '업무도움'. */
  title?: React.ReactNode
  /** 안내 항목(불릿 리스트). children 미지정 시 사용. */
  items?: React.ReactNode[]
  /** items 대신 임의 콘텐츠(주면 items 무시). */
  children?: React.ReactNode
  /** 초기 펼침 여부. 기본 false(접힘). */
  defaultOpen?: boolean
  className?: string
}

export function HelpDisclosure({
  title = '업무도움',
  items,
  children,
  defaultOpen = false,
  className,
}: HelpDisclosureProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const hasContent = children != null || (items && items.length > 0)
  return (
    <div className={cn('w-full', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-14 w-full items-center gap-krds-8 border-t border-krds-border-divider bg-krds-bg-primary-faint px-krds-8"
      >
        <span className="flex min-w-px flex-1 items-center gap-krds-5">
          {/* system-info(별도제작) = 면으로 채워진 info → Material 'info' FILL 1. */}
          <Icon name="Info" size={24} fill={1} aria-hidden className="shrink-0 text-krds-text-primary-active" />
          <span className="min-w-px flex-1 truncate text-left text-[19px] font-bold leading-normal text-krds-text-primary-active">
            {title}
          </span>
        </span>
        <Icon
          name="ExpandMore"
          size={20}
          aria-hidden
          className={cn(
            'shrink-0 text-krds-text-primary-active transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && hasContent && (
        <div className="bg-krds-bg-primary-faint px-krds-8 pb-krds-8">
          {children ?? (
            <ul className="flex flex-col gap-krds-5">
              {items!.map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-krds-5 text-[17px] leading-normal text-krds-text-ink"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-krds-text-muted" aria-hidden />
                  <span className="min-w-px flex-1 wrap-break-word">{t}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
HelpDisclosure.displayName = 'HelpDisclosure'
