// 범위 입력 — 듀얼 슬라이더(base/Slider) + min/max 직접 입력 박스를 한 컴포넌트로 합친 합성물.
// Figma m_range slider(9300-28028) + 추정가격 박스(9300-28042). 슬라이더와 두 입력이 같은 {min,max}
// 값을 양방향으로 공유한다(min ≤ max 유지). 가격뿐 아니라 임의 숫자 범위 입력에 범용으로 쓴다
// (unit·format·step·도메인 min/max 를 prop 으로). SearchFilterField 의 priceRange 필드도 이걸 사용.
import * as React from 'react'

import { Slider } from '@/ui/common/base/Slider'
import { cn } from '@/utils/cn'

export interface RangeValue {
  min: number
  max: number
}

export interface RangeSliderInputProps {
  /** 현재 범위 값 (controlled) */
  value: RangeValue
  onChange: (value: RangeValue) => void
  /** 슬라이더 도메인 최소 (기본 0) */
  min?: number
  /** 슬라이더 도메인 최대 (기본 100) */
  max?: number
  /** 스텝 (기본 1) */
  step?: number
  /** 값 뒤 단위 표기 (예: '원'). 없으면 미표시. */
  unit?: React.ReactNode
  /** 입력 박스 표시 포맷 (기본 천단위 콤마). 슬라이더 값에는 영향 없음. */
  format?: (n: number) => string
  /** 입력 박스 노출 여부 (기본 true). false 면 슬라이더만. */
  showInputs?: boolean
  error?: boolean
  disabled?: boolean
  className?: string
  /** 입력 접근성 라벨 prefix (예: '추정가격' → '추정가격 최소/최대') */
  ariaLabel?: string
}

const defaultFormat = (n: number) => n.toLocaleString('ko-KR')
const parseNum = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0

/** 범위 슬라이더 + min/max 입력 합성 컴포넌트 (controlled). */
const RangeSliderInput = ({
  value,
  onChange,
  min: domainMin = 0,
  max: domainMax = 100,
  step = 1,
  unit,
  format = defaultFormat,
  showInputs = true,
  error = false,
  disabled = false,
  className,
  ariaLabel = '값',
}: RangeSliderInputProps) => {
  const min = value?.min ?? domainMin
  const max = value?.max ?? domainMax
  const clamp = (n: number) => Math.min(Math.max(n, domainMin), domainMax)

  // min/max 교차 클램프 — 항상 min ≤ max, 도메인 범위 내.
  const setMin = (n: number) => onChange({ min: Math.min(clamp(n), max), max })
  const setMax = (n: number) => onChange({ min, max: Math.max(clamp(n), min) })

  return (
    <div className={cn('flex flex-col gap-krds-6', className)}>
      {showInputs && (
        <div
          aria-invalid={error || undefined}
          className={cn(
            'flex items-center gap-2 rounded-krds-8 border px-4 py-3 text-krds-body-md text-krds-text-ink',
            error
              ? 'border-krds-border-danger bg-krds-bg-danger-subtle'
              : 'border-krds-border-field bg-background',
            disabled && 'border-krds-border-disabled bg-krds-bg-disabled-soft',
          )}
        >
          <input
            inputMode="numeric"
            value={format(min)}
            disabled={disabled}
            onChange={(e) => setMin(parseNum(e.target.value))}
            aria-label={`${ariaLabel} 최소`}
            className="min-w-0 flex-1 bg-transparent text-right outline-none disabled:text-krds-text-disabled"
          />
          {unit != null && <span className="shrink-0 text-krds-text-subtle">{unit}</span>}
          <span className="shrink-0 text-krds-text-subtle">~</span>
          <input
            inputMode="numeric"
            value={format(max)}
            disabled={disabled}
            onChange={(e) => setMax(parseNum(e.target.value))}
            aria-label={`${ariaLabel} 최대`}
            className="min-w-0 flex-1 bg-transparent text-right outline-none disabled:text-krds-text-disabled"
          />
          {unit != null && <span className="shrink-0 text-krds-text-subtle">{unit}</span>}
        </div>
      )}
      <Slider
        value={[min, max]}
        min={domainMin}
        max={domainMax}
        step={step}
        minStepsBetweenThumbs={1}
        disabled={disabled}
        onValueChange={([lo, hi]) => onChange({ min: lo, max: hi })}
      />
    </div>
  )
}
RangeSliderInput.displayName = 'RangeSliderInput'

export { RangeSliderInput }
