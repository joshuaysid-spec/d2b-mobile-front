// Figma m_range slider 9300-28028 — 듀얼 핸들(min/max) 범위 슬라이더. 추정가격 등 범위 입력에 사용.
//
// raw 우회 사유(사용자 승인): shadcn 정본 raw/slider 는 <SliderPrimitive.Thumb /> 를 1개만 하드코딩해
//   듀얼 핸들(값 2개)을 표현할 수 없다(자식 구조 고정). Figma 9300-28028(핸들 2개) 구현 지시에 따라
//   @radix-ui/react-slider 프리미티브를 직접 사용한다. (기존 Switch/BottomSheet 등과 동일한 승인 예외)
//   Radix Slider 는 value 배열 길이만큼 Thumb 를 렌더하므로, value 개수에 맞춰 Thumb 를 매핑한다.
//
// 스타일(Figma): track bg #bcd4ff(=bg-primary-subtle) h-10px rounded-full ·
//   active bg #0054e9(=bg-primary-strong) · thumb 30px 흰 원 + 그림자.
import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/utils/cn'

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  className?: string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, value, defaultValue, ...props }, ref) => {
  // Thumb 개수 = value(제어) 또는 defaultValue(비제어) 길이. 기본 1개.
  const thumbCount = (value ?? defaultValue)?.length ?? 1

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      className={cn(
        'relative flex w-full touch-none select-none items-center py-[10px]',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-[10px] w-full grow overflow-hidden rounded-full bg-krds-bg-primary-subtle">
        <SliderPrimitive.Range className="absolute h-full bg-krds-bg-primary-strong" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={cn(
            'block size-[30px] rounded-full border border-krds-border-divider bg-white shadow-krds-2',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = 'Slider'

export { Slider }
