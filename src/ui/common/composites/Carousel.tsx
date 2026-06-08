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
  /** 자동 슬라이드 간격(ms). 미지정/0 이면 비활성. 끝 페이지 후 처음으로 순환. */
  autoPlayInterval?: number
  /** 페이지 전환 애니메이션 길이(ms). 미지정/0 이면 브라우저 기본 smooth 속도. 값이 클수록 천천히 넘어감. */
  transitionDuration?: number
  className?: string
}

const Carousel = ({
  pages,
  ariaLabel = '캐러셀',
  showIndicator = true,
  autoPlayInterval,
  transitionDuration,
  className,
}: CarouselProps) => {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [index, setIndex] = React.useState(0)
  const total = pages.length

  // 페이지 전환 — transitionDuration 주입 시 rAF 커스텀 애니메이션(속도 제어),
  // 미지정 시 브라우저 기본 smooth.
  const rafRef = React.useRef<number | null>(null)
  const animateTo = React.useCallback(
    (target: number, onDone?: () => void) => {
      const el = trackRef.current
      if (!el) return
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      const duration = transitionDuration ?? 0
      if (duration <= 0) {
        el.scrollTo({ left: target, behavior: 'smooth' })
        // 네이티브 smooth 는 완료 시점을 알 수 없어 근사 타이머로 onDone 호출(루프 리셋용).
        if (onDone) window.setTimeout(onDone, 450)
        return
      }
      const start = el.scrollLeft
      const dist = target - start
      const t0 = performance.now()
      const ease = (t: number) => 0.5 * (1 - Math.cos(Math.PI * t)) // easeInOutSine
      // 애니메이션 중 scroll-snap(mandatory)이 매 프레임 강제 스냅해 모션을 끊지 않도록 잠시 해제.
      el.style.scrollSnapType = 'none'
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / duration)
        el.scrollLeft = start + dist * ease(p)
        if (p < 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          rafRef.current = null
          // onDone(루프 리셋: 클론→진짜 첫 페이지로 즉시 점프)을 snap 해제 상태에서 먼저 실행 후 복원.
          onDone?.()
          el.style.scrollSnapType = '' // 클래스 기반 snap 복원
        }
      }
      rafRef.current = requestAnimationFrame(step)
    },
    [transitionDuration],
  )
  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    },
    [],
  )

  // 자동 슬라이드 사용 여부 + 재생 상태(토글 버튼으로 제어).
  const isAutoPlay = !!autoPlayInterval && total > 1
  const [autoPlaying, setAutoPlaying] = React.useState(true)

  // 무한 루프 — 자동 슬라이드일 때 첫 슬라이드를 끝에 복제(클론)해, 마지막→첫 전환을
  // '다음 페이지로 가는 것처럼' 앞으로 진행시킨 뒤 도착하면 진짜 첫 페이지로 즉시 점프한다.
  const loop = isAutoPlay
  const slides = loop ? [...pages, pages[0]] : pages

  // 자동 슬라이드 — 일정 간격마다 다음 페이지로 전진.
  // 사용자가 스와이프/포인터 조작 중이면 잠시 멈췄다 떼면 재개.
  const pausedRef = React.useRef(false)
  React.useEffect(() => {
    if (!isAutoPlay || !autoPlaying) return
    const id = window.setInterval(() => {
      if (pausedRef.current) return
      const el = trackRef.current
      if (!el) return
      const cur = Math.min(Math.round(el.scrollLeft / el.clientWidth), total - 1)
      const next = cur + 1 // 0 → … → (total-1) → total(클론=첫 슬라이드)
      // 마지막 → 클론까지 앞으로 자연스럽게 이동, 도착 후 진짜 첫 페이지(0)로 무애니메이션 점프.
      animateTo(
        next * el.clientWidth,
        next >= total
          ? () => {
              el.scrollLeft = 0
            }
          : undefined,
      )
    }, autoPlayInterval)
    return () => window.clearInterval(id)
  }, [isAutoPlay, autoPlaying, autoPlayInterval, total, animateTo])

  // 스크롤 위치 → 현재 페이지 인덱스(가장 가까운 페이지). 클론(total)은 첫 페이지(0)로 매핑.
  const handleScroll = () => {
    const el = trackRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    const real = loop ? i % total : Math.min(i, total - 1)
    setIndex(Math.max(0, real))
  }

  const goTo = (i: number) => {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(total - 1, i))
    animateTo(clamped * el.clientWidth)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        // 자동 슬라이드 일시정지 — 포인터/터치로 조작하는 동안만 멈춤
        onPointerDown={() => (pausedRef.current = true)}
        onPointerUp={() => (pausedRef.current = false)}
        onPointerCancel={() => (pausedRef.current = false)}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
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
        {/* 페이지는 위치 고정 슬롯(재정렬 없음) → index key 허용.
            loop 시 마지막 슬롯(i===total)은 첫 슬라이드 클론 → 보조기술엔 숨김. */}
        {slides.map((page, i) => {
          const isClone = loop && i === total
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="슬라이드"
              aria-label={`${(isClone ? 0 : i) + 1} / ${total}`}
              aria-hidden={isClone || undefined}
              className="w-full shrink-0 snap-center"
            >
              {page}
            </div>
          )
        })}
      </div>

      {showIndicator && total > 1 && (
        <CarouselIndicator
          current={index + 1}
          total={total}
          onPrev={() => goTo(index - 1)}
          onNext={() => goTo(index + 1)}
          // 자동 슬라이드일 때만 재생/일시정지 토글 노출
          playing={isAutoPlay ? autoPlaying : undefined}
          onTogglePlay={
            isAutoPlay ? () => setAutoPlaying((v) => !v) : undefined
          }
        />
      )}
    </div>
  )
}
Carousel.displayName = 'Carousel'

export { Carousel }
