// 스와이프 캐러셀 — scroll-snap 기반 가로 슬라이드 + CarouselIndicator(숫자/화살표) 통합.
// 터치 스와이프(네이티브 overflow-x scroll-snap) + 화살표 버튼(프로그램 스크롤) 모두 지원.
// 메인 홈 주요 서비스 바로가기 · 배너에서 사용. 페이지(슬라이드)는 사용처가 ReactNode[] 로 주입.
//
// 사용 예:
//   <Carousel ariaLabel="배너" pages={[<Banner/>, <Banner/>, <Banner/>]} />
import * as React from 'react'

import { CarouselIndicator } from '@/ui/common/composites/CarouselIndicator'
import { cn } from '@/utils/cn'

export interface CarouselProps {
  /** 슬라이드 페이지들(각 페이지는 full-width 로 렌더). */
  pages: React.ReactNode[]
  /** 스크롤 영역 aria-label. */
  ariaLabel?: string
  /** 인디케이터(숫자/화살표) 노출. 기본 true. 페이지 1개면 자동 숨김. */
  showIndicator?: boolean
  className?: string
}

const Carousel = ({
  pages,
  ariaLabel = '캐러셀',
  showIndicator = true,
  className,
}: CarouselProps) => {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [index, setIndex] = React.useState(0)
  const total = pages.length

  // 스크롤 위치 → 현재 페이지 인덱스(가장 가까운 페이지).
  const handleScroll = () => {
    const el = trackRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    setIndex(Math.max(0, Math.min(total - 1, i)))
  }

  const goTo = (i: number) => {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(total - 1, i))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        role="group"
        aria-label={ariaLabel}
        aria-roledescription="캐러셀"
        // 가로 스크롤 영역에 키보드 접근(WCAG 2.1.1) — 화살표키로 좌우 스크롤. 포커스 링은 인디케이터로 충분히 표시되므로 outline 만 유지.
        tabIndex={0}
        className={cn(
          'flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden',
          'scrollbar-none [&::-webkit-scrollbar]:hidden',
          'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
        )}
        style={{ scrollbarWidth: 'none' }}
      >
        {/* 페이지는 위치 고정 슬롯(재정렬 없음) → index key 허용. */}
        {pages.map((page, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="슬라이드"
            aria-label={`${i + 1} / ${total}`}
            className="w-full shrink-0 snap-center"
          >
            {page}
          </div>
        ))}
      </div>

      {showIndicator && total > 1 && (
        <CarouselIndicator
          current={index + 1}
          total={total}
          onPrev={() => goTo(index - 1)}
          onNext={() => goTo(index + 1)}
        />
      )}
    </div>
  )
}
Carousel.displayName = 'Carousel'

export { Carousel }
