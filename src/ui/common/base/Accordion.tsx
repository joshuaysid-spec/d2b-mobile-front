// Figma m_accordian(9300-28556) 1:1 — 섹션 아코디언(타이틀 바 + 접기/펴기 + 콘텐츠).
// raw/accordion(shadcn, Radix) 래핑 + KRDS 스타일.
// chevron: raw 가 고정으로 박은 lucide ChevronDown(svg)을 [&>svg]:hidden 으로 숨기고,
//   화살표 통일(arrow_forward_ios)에 맞춰 Material ArrowForwardIos(Icon)를 직접 렌더.
//   90° 회전해 아래(⌄), 열림(data-state=open) 시 위(⌃)로 회전. (raw 수정 금지 — base 에서 처리)
// 타이틀 바: h-56 · px-16 · 19px Bold · blue(bg-primary-faint) / white · 상단 1px divider.
// 콘텐츠: bg-white · 좌우/하단 16 · 상단 0(타이틀 바 h-56 의 하단 여백으로 충분 → pt 추가 시 간격 과다) · 세로 stack gap-16.
import * as React from 'react'

import {
  Accordion as RawAccordion,
  AccordionContent as RawAccordionContent,
  AccordionItem as RawAccordionItem,
  AccordionTrigger as RawAccordionTrigger,
} from '@/ui/raw/accordion'
import { Icon } from '@/ui/common/base/Icon'
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
  /** 콘텐츠 좌우/하단 패딩 제거(기본 false → 좌우/하단 16, 상단 0) */
  flush?: boolean
  className?: string
  /** 트리거(타이틀 바) 추가 className — 글자/chevron 색 등 오버라이드(currentColor 상속). */
  triggerClassName?: string
  /** 콘텐츠 영역 추가 className — 배경/텍스트 색 등 오버라이드(기본 bg-white). */
  contentClassName?: string
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
  triggerClassName,
  contentClassName,
  children,
}: AccordionSectionProps) => (
  <RawAccordionItem value={value} className={cn('border-b-0', className)}>
    <RawAccordionTrigger
      className={cn(
        'group h-[56px] gap-krds-8 px-krds-8 py-0',
        'text-[19px] font-bold text-krds-text-ink hover:no-underline',
        // raw 고정 lucide chevron(svg) 숨김 — 아래 Material Icon 으로 대체
        '[&>svg]:hidden',
        borderTop && 'border-t border-krds-border-divider',
        variant === 'blue' ? 'bg-krds-bg-primary-faint' : 'bg-white',
        triggerClassName, // 색 오버라이드 등 — text-* 는 base text-ink 보다 뒤라 우선
      )}
    >
      <span className="min-w-0 flex-1 truncate text-left">{title}</span>
      {titleInfo && (
        <span className="shrink-0 text-[17px] font-bold text-krds-text-primary-active">
          {titleInfo}
        </span>
      )}
      {/* Material 화살표(arrow_forward_ios) — 90° 회전해 아래(⌄), 열림 시 위(⌃). 크기는 size 로 조절. */}
      <Icon
        name="ArrowForwardIos"
        size={20}
        className="shrink-0 rotate-90 transition-transform duration-200 group-data-[state=open]:rotate-[270deg]"
        aria-hidden
      />
    </RawAccordionTrigger>
    <RawAccordionContent
      className={cn(
        // 상단 패딩 0(타이틀 바 하단 여백으로 충분) · 좌우/하단 16. raw 내부 div 의 pt-0 을 그대로 살린다.
        'flex flex-col gap-krds-8 bg-white',
        flush ? 'p-0' : 'px-krds-8 pb-krds-8',
        contentClassName,
      )}
    >
      {children}
    </RawAccordionContent>
  </RawAccordionItem>
)
AccordionSection.displayName = 'AccordionSection'

export { Accordion, AccordionSection }
