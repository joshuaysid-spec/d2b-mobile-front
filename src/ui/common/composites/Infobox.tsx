// Figma m_Infobox(9300-29649) 1:1.
// ⓘ 아이콘 + 타이틀 헤더 + 본문(불릿 리스트/링크). 업무도움·안내사항 등에 재사용.
// 재구현(v2): 자체 토글 대신 base Accordion(Radix) 위에 구성 → 부드러운 슬라이드 애니메이션 +
//   통일된 화살표(arrow_forward_ios) + 접근성을 그대로 재사용. (raw 직접 사용 X — base AccordionSection 경유)
// variant:
//   collapsible(기본 true) — Accordion 으로 접기/펴기. opened/closed.
//   static(collapsible=false) — chevron 없이 본문 항상 노출(헤더 비클릭).
// 헤더 = bg-primary-faint(#ecf1fa) · 글자/아이콘 딥네이비(text-action-primary-active #0f316e) · 상단 border-divider(#d1d7e0).
// 본문(dropdown) = bg-primary-faint(#ecf1fa) · 텍스트 slate(text-info #425679). 모서리는 각짐(radius 없음).StepBar
// 상태: controlled(open/onOpenChange) / uncontrolled(defaultOpen, 기본 closed).
import * as React from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Icon, type IconName } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface InfoboxProps {
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
  className?: string
}

const VALUE = 'infobox' // Accordion item 식별자(단일 아이템)

/** 헤더 좌측 ⓘ + 타이틀 (색은 부모 currentColor = 딥네이비 상속) */
function InfoboxLabel({ icon, title }: { icon: IconName; title: React.ReactNode }) {
  return (
    <span className="flex min-w-0 items-center gap-krds-5">
      <Icon name={icon} size={20} fill={1} className="shrink-0" aria-hidden />
      <span className="min-w-0 flex-1 truncate">{title}</span>
    </span>
  )
}

/** 본문 — 불릿 리스트(items) 또는 자유 본문(children) */
function InfoboxBody({
  items,
  children,
}: {
  items?: React.ReactNode[]
  children?: React.ReactNode
}) {
  if (items?.length) {
    return (
      <ul className="flex flex-col gap-krds-5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-krds-5 text-[17px] leading-normal text-krds-text-info">
            <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-krds-text-info" />
            <span className="min-w-px flex-1 wrap-break-word">{it}</span>
          </li>
        ))}
      </ul>
    )
  }
  return <div className="text-[17px] leading-normal text-krds-text-info">{children}</div>
}

export function Infobox({
  title,
  icon = 'Info',
  items,
  children,
  collapsible = true,
  defaultOpen = false,
  open,
  onOpenChange,
  className,
}: InfoboxProps) {
  // static — chevron 없이 항상 펼침 (Accordion 미사용)
  if (!collapsible) {
    return (
      <div className={cn('flex w-full flex-col overflow-hidden', className)}>
        <div className="flex min-h-[56px] items-center gap-krds-5 border-t border-krds-border-divider bg-krds-bg-primary-faint px-krds-8 text-[19px] font-bold text-krds-action-primary-active">
          <InfoboxLabel icon={icon} title={title} />
        </div>
        <div className="bg-krds-bg-primary-faint p-krds-8">
          <InfoboxBody items={items}>{children}</InfoboxBody>
        </div>
      </div>
    )
  }

  // collapsible — base Accordion(single, collapsible) 위에 구성
  const controlled = open !== undefined
  const accordionProps = controlled
    ? { value: open ? VALUE : '', onValueChange: (v: string) => onOpenChange?.(v === VALUE) }
    : { defaultValue: defaultOpen ? VALUE : undefined }

  return (
    <Accordion
      type="single"
      collapsible
      className={cn('w-full overflow-hidden', className)}
      {...accordionProps}
    >
      <AccordionSection
        value={VALUE}
        variant="blue"
        borderTop // 상단 border-divider(#d1d7e0)
        triggerClassName="text-krds-action-primary-active" // 글자 + chevron 딥네이비
        contentClassName="bg-krds-bg-primary-faint" // dropdown 본문 배경 #ecf1fa
        title={<InfoboxLabel icon={icon} title={title} />}
      >
        <InfoboxBody items={items}>{children}</InfoboxBody>
      </AccordionSection>
    </Accordion>
  )
}
Infobox.displayName = 'Infobox'
