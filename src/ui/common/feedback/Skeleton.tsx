// 범용 로딩 스켈레톤 — 데이터 로딩 중 자리표시(shimmer) UI.
// Figma 전용 노드 없이 범용으로 제작 (variant + 크기 props).
//
// variant:
//   - 'rect'(기본) : 사각 블록(카드/이미지/버튼 자리). className 으로 rounded/폭 조정.
//   - 'text'       : 텍스트 줄. count 로 줄 수 지정, 마지막 줄은 60% 폭(자연스러운 문단).
//   - 'circle'     : 원형(아바타/아이콘 자리). width 로 정사각 원형.
//
// 사용 예:
//   <Skeleton width={120} height={20} />                       // 사각 블록
//   <Skeleton variant="text" count={3} />                      // 3줄 텍스트
//   <Skeleton variant="circle" width={40} />                   // 40px 원형 아바타
//   <Skeleton variant="rect" height={160} className="w-full rounded-krds-8" />  // 카드 썸네일
import { cn } from '@/utils/cn'

export type SkeletonVariant = 'rect' | 'text' | 'circle'

export interface SkeletonProps {
  /** 모양. 기본 'rect'. */
  variant?: SkeletonVariant
  /** 폭(px 또는 CSS 길이). circle 은 이 값으로 정사각. */
  width?: number | string
  /** 높이(px 또는 CSS 길이). text 는 무시(줄 높이 고정). */
  height?: number | string
  /** variant='text' 일 때 줄 수. 기본 1. */
  count?: number
  className?: string
  /** 접근성 라벨. 기본 "불러오는 중". */
  srLabel?: string
}

const toCss = (v: number | string | undefined): string | undefined =>
  typeof v === 'number' ? `${v}px` : v

// shimmer 공통 — 뉴트럴 bg(muted) + pulse 애니메이션.
const BASE = 'animate-pulse bg-muted'

const A11Y = {
  role: 'status' as const,
  'aria-busy': true,
  'aria-live': 'polite' as const,
}

const Skeleton = ({
  variant = 'rect',
  width,
  height,
  count = 1,
  className,
  srLabel = '불러오는 중',
}: SkeletonProps) => {
  if (variant === 'text') {
    const lines = Math.max(1, count)
    return (
      <span {...A11Y} className={cn('block w-full', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              BASE,
              'block h-4 rounded-krds-sm',
              i > 0 && 'mt-2',
              // 마지막 줄은 짧게 — 문단 느낌
              lines > 1 && i === lines - 1 ? 'w-3/5' : 'w-full',
            )}
            style={{ width: i === 0 ? toCss(width) : undefined }}
          />
        ))}
        <span className="sr-only">{srLabel}</span>
      </span>
    )
  }

  if (variant === 'circle') {
    const size = toCss(width) ?? '40px'
    return (
      <span
        {...A11Y}
        className={cn(BASE, 'inline-block rounded-full', className)}
        style={{ width: size, height: toCss(height) ?? size }}
      >
        <span className="sr-only">{srLabel}</span>
      </span>
    )
  }

  // rect — className(w-full, rounded-* 등)은 보이는 블록에 직접 적용.
  return (
    <span
      {...A11Y}
      className={cn(BASE, 'inline-block rounded-krds-sm', className)}
      style={{ width: toCss(width), height: toCss(height) ?? '1rem' }}
    >
      <span className="sr-only">{srLabel}</span>
    </span>
  )
}
Skeleton.displayName = 'Skeleton'

export { Skeleton }
