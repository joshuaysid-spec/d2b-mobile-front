// Figma m_spinner(9300-28055) 1:1.
// 48×48 컨테이너에 8개 dot(4×12 rounded-full) 시계방향 배치 — 활성 1개만 D2B blue,
// 나머지 7개는 border-field 회색. 부모 회전(steps 8, 1초) 으로 활성 dot 이 시계방향 이동.
//
// percent prop (0-100) 주어지면 dot 아래에 17 Bold gray "70%" 같은 텍스트.
// size prop 으로 전체 크기 조정 — 48 기준 비율 scale 사용.
// 기존 API(size, label, srLabel, className) 호환 유지.
//
// 사용 예:
//   <Spinner />                               // 48px 기본
//   <Spinner size={24} />                     // 작은 스피너
//   <Spinner percent={70} />                  // 아래 "70%" 텍스트
//   <Spinner label="저장 중..." />            // 옆에 라벨
import * as React from 'react'

import { cn } from '@/utils/cn'

export interface SpinnerProps {
  /** 픽셀 단위 사이즈. Figma 기본 48. */
  size?: number
  /** 진행률(0-100). 주어지면 dot 아래에 "%" 텍스트 노출. */
  percent?: number
  /** 가로 정렬 라벨(스피너 옆 텍스트). percent 와 별개로 작동. */
  label?: React.ReactNode
  /** 스크린리더 전용 라벨. label/percent 둘 다 미주입 시 사용. 기본 "불러오는 중입니다." */
  srLabel?: string
  className?: string
}

// 48-grid 기준 8 dot 위치(시계방향, 12시 → 1.5시 → 3시 → ... → 10.5시).
// {top, left, rotateDeg} — 4×12 막대를 회전시켜 해당 각도 방향으로 배치.
// 각 막대 중심 (left+2, top+6) 을 그리드 중심 (24,24) 기준 반경 18 동심원 위에 둔다:
//   cx = 24 + 18·sinθ, cy = 24 − 18·cosθ  →  left = cx−2, top = cy−6
// (동심원이어야 부모 회전 시 dot 링이 중심에서 안 흔들림)
const DOTS: Array<{ top: number; left: number; rotate: number }> = [
  { top: 0,     left: 22,    rotate: 0 },     // 12시
  { top: 5.27,  left: 34.73, rotate: 45 },    // 1.5시
  { top: 18,    left: 40,    rotate: 90 },    // 3시
  { top: 30.73, left: 34.73, rotate: 135 },   // 4.5시
  { top: 36,    left: 22,    rotate: 180 },   // 6시
  { top: 30.73, left: 9.27,  rotate: 225 },   // 7.5시
  { top: 18,    left: 4,     rotate: 270 },   // 9시
  { top: 5.27,  left: 9.27,  rotate: 315 },   // 10.5시
]

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      size = 48,
      percent,
      label,
      srLabel = '불러오는 중입니다.',
      className,
    },
    ref,
  ) => {
    const scale = size / 48
    const hasPercent = typeof percent === 'number'

    const dots = (
      <span
        aria-hidden
        className="relative inline-block shrink-0"
        style={{ width: size, height: size }}
      >
        <span
          className="absolute inset-0 animate-spinner-dots"
          style={{ transformOrigin: 'center' }}
        >
          {DOTS.map((d, i) => (
            <span
              key={i}
              className={cn(
                'absolute rounded-full',
                // 첫 번째(12시) 만 D2B blue, 나머지 7개는 border-field
                i === 0 ? 'bg-krds-action-primary' : 'bg-krds-border-field',
              )}
              style={{
                width: 4 * scale,
                height: 12 * scale,
                top: d.top * scale,
                left: d.left * scale,
                transform: `rotate(${d.rotate}deg)`,
                transformOrigin: 'center',
              }}
            />
          ))}
        </span>
      </span>
    )

    // percent 모드 — dot 아래 텍스트 (Figma percent=on)
    if (hasPercent) {
      const clamped = Math.max(0, Math.min(100, Math.round(percent!)))
      return (
        <span
          ref={ref}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          className={cn('inline-flex flex-col items-center gap-krds-5', className)}
        >
          {dots}
          <span
            className="text-center font-bold leading-normal text-krds-text-muted"
            style={{ fontSize: 17 * scale, minWidth: size }}
          >
            {clamped}%
          </span>
        </span>
      )
    }

    // label 모드 — 가로 정렬
    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={cn('inline-flex items-center gap-krds-5', className)}
      >
        {dots}
        {label ? (
          <span className="text-krds-body-sm">{label}</span>
        ) : (
          <span className="sr-only">{srLabel}</span>
        )}
      </span>
    )
  },
)
Spinner.displayName = 'Spinner'

export { Spinner }
