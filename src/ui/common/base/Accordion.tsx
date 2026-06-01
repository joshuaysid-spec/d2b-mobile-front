// Figma m_accordian(9300-28556) 1:1 — 섹션 아코디언(타이틀 바 + 접기/펴기 + 콘텐츠).
// raw/accordion(shadcn, Radix) 래핑 + KRDS 스타일. raw 의 chevron(접힘 ▼ / 펼침 ▲ 회전) 을 그대로 사용.
// 타이틀 바: h-56 · px-16 · 19px Bold · blue(bg-primary-faint) / white · 상단 1px divider.
// 콘텐츠: bg-white · p-16 · 세로 stack gap-16.
import * as React from 'react'

import {
  Accordion as RawAccordion,
  AccordionContent as RawAccordionContent,
  AccordionItem as RawAccordionItem,
  AccordionTrigger as RawAccordionTrigger,
} from '@/ui/raw/accordion'
import { cn } from '@/utils/cn'

// Root 는 그대로 재노출 — type('single'|'multiple') / defaultValue 는 사용처가 지정.
const Accordion = RawAccordion

export interface AccordionSectionProps {
  /** Accordion 내 고유 값(열림 상태 식별) */
  value: string
  title: React.ReactNode
  /** 타이틀 우측 부가 정보 (예: "총 2건") */
  titleInfo?: React.ReactNode
  /** 타이틀 바 배경. blue(기본, bg-primary-faint) / white */
  variant?: 'blue' | 'white'
  /** 상단 구분선(기본 true). 첫 섹션은 false 권장. */
  borderTop?: boolean
  /** 콘텐츠 패딩 제거(기본 false → p-16) */
  flush?: boolean
  className?: string
  children: React.ReactNode
}

const AccordionSection = ({
  value,
  title,
  titleInfo,
  variant = 'white',
  borderTop = true,
  flush = false,
  className,
  children,
}: AccordionSectionProps) => (
  <RawAccordionItem value={value} className={cn('border-b-0', className)}>
    <RawAccordionTrigger
      className={cn(
        'h-[56px] gap-krds-8 px-krds-8 py-0',
        'text-[19px] font-bold text-krds-text-ink hover:no-underline',
        // raw chevron(고정 h-4 w-4=16px)을 Figma 20px 로 — 자식 svg 선택자 오버라이드
        '[&>svg]:size-5',
        borderTop && 'border-t border-krds-border-divider',
        variant === 'blue' ? 'bg-krds-bg-primary-faint' : 'bg-white',
      )}
    >
      <span className="min-w-0 flex-1 truncate text-left">{title}</span>
      {titleInfo && (
        <span className="shrink-0 text-[17px] font-bold text-primary">{titleInfo}</span>
      )}
    </RawAccordionTrigger>
    <RawAccordionContent
      className={cn('flex flex-col gap-krds-8 bg-white', flush ? 'p-0' : 'p-krds-8')}
    >
      {children}
    </RawAccordionContent>
  </RawAccordionItem>
)
AccordionSection.displayName = 'AccordionSection'

export { Accordion, AccordionSection }
