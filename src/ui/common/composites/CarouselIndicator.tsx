// Figma carousel(7077:85329 / 7077:85434) 1:1 — 캐러셀 페이지 인디케이터.
// `현재 / 전체` 숫자 박스(현재=primary 강조) + 이전/다음 화살표 버튼(40px 원형).
// 여러 화면(주요 서비스 바로가기 · 배너)에서 반복되어 공통 composite 로 추출.
//
// 동작은 사용처 책임 — onPrev/onNext 핸들러를 받는다. 미주입 또는 첫/끝 페이지면 해당 화살표 disabled.
// (목업 단계에선 current=1 고정 + 핸들러 생략 가능 → 시각만 표시)
//
// 사용 예:
//   <CarouselIndicator current={1} total={2} onPrev={...} onNext={...} />
import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface CarouselIndicatorProps {
  /** 1-base 현재 페이지. */
  current: number
  /** 전체 페이지 수. */
  total: number
  /** 이전 페이지. 미주입/첫 페이지면 비활성. */
  onPrev?: () => void
  /** 다음 페이지. 미주입/끝 페이지면 비활성. */
  onNext?: () => void
  /**
   * 자동 슬라이드 재생 상태. `onTogglePlay` 와 함께 주입하면 숫자 박스와 화살표 사이에
   * 재생/일시정지 토글 버튼이 노출된다.
   */
  playing?: boolean
  /** 재생/일시정지 토글 핸들러. 주입 시에만 토글 버튼 표시. */
  onTogglePlay?: () => void
  className?: string
}

// 40px 원형 화살표 버튼 — 파일 내부 인라인(아토믹 분리 안 함).
function ArrowButton({
  dir,
  ariaLabel,
  onClick,
  disabled,
}: {
  dir: 'prev' | 'next'
  ariaLabel: string
  onClick?: () => void
  disabled: boolean
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-full border border-krds-border-field bg-white text-krds-text-ink',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
        'disabled:opacity-40',
      )}
    >
      <Icon
        name={dir === 'prev' ? 'ArrowBackIosNew' : 'ArrowForwardIos'}
        size={20}
        aria-hidden
      />
    </button>
  )
}

const CarouselIndicator = ({
  current,
  total,
  onPrev,
  onNext,
  playing,
  onTogglePlay,
  className,
}: CarouselIndicatorProps) => {
  const atStart = current <= 1
  const atEnd = current >= total

  return (
    <div
      className={cn('flex h-10 items-center justify-center gap-krds-5', className)}
    >
      {/* 숫자 박스 — 현재=primary 강조 / 전체=ink */}
      <div className="flex h-10 items-center rounded-full border border-krds-border-field bg-white px-4 py-[7px]">
        <span className="text-[17px] font-bold leading-normal whitespace-nowrap">
          <span className="text-krds-action-primary">{current}</span>
          <span className="text-krds-text-ink"> / {total}</span>
        </span>
      </div>

      {/* 재생/일시정지 토글 — 숫자 박스와 화살표 사이 (onTogglePlay 주입 시에만) */}
      {onTogglePlay && (
        <button
          type="button"
          aria-label={playing ? '자동 슬라이드 일시정지' : '자동 슬라이드 재생'}
          aria-pressed={playing}
          onClick={onTogglePlay}
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full border border-krds-border-field bg-white text-krds-text-ink',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
          )}
        >
          <Icon name={playing ? 'Pause' : 'PlayArrow'} size={20} aria-hidden />
        </button>
      )}

      {/* 이전/다음 화살표 */}
      <div className="flex items-center gap-krds-5">
        <ArrowButton
          dir="prev"
          ariaLabel="이전"
          onClick={onPrev}
          disabled={atStart || !onPrev}
        />
        <ArrowButton
          dir="next"
          ariaLabel="다음"
          onClick={onNext}
          disabled={atEnd || !onNext}
        />
      </div>
    </div>
  )
}
CarouselIndicator.displayName = 'CarouselIndicator'

export { CarouselIndicator }
