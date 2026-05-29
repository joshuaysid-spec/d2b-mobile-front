// shadcn raw/switch(@radix-ui/react-switch 기반)를 그대로 "넣어서" KRDS 토글을 구성한다.
// raw/switch 는 SwitchPrimitives.Thumb 를 고정 자식(<span>)으로 박아두고 thumb 클래스를
// 외부에서 직접 못 바꾼다(h-5 w-5 / data-[state=checked]:translate-x-5 가 baked).
// 따라서 Root 에 닿는 className 으로 트랙·thumb 를 Figma m_toggle switch(트랙 56×28, thumb 20px
// 가 28px 슬라이드)에 맞춰 보정한다:
//   - 트랙: raw 의 h-6 w-11 → h-7 w-14 (tailwind-merge 가 같은 그룹끼리 후자로 해결)
//   - thumb: raw 가 translate-x-5(20px) 를 baked → 부모에서 자식 span 을 arbitrary 로 보정.
//     같은 translate-x 그룹이지만 raw 클래스는 span 에, 보정 클래스는 Root([&>span])에 있어
//     tailwind-merge 가 dedupe 못 함 → 특이도/순서로 raw 가 이길 수 있으므로 반드시 `!important`.
//     [&>span]:translate-x-0! / data-[state=checked]:[&>span]:translate-x-7! (28px 슬라이드).
//     thumb 크기 20px(h-5 w-5)는 raw 와 동일하니 유지, 색만 흰색으로 고정.
// 시각 미세 정렬(트랙 padding/centering)은 브라우저 확인 필요.
import * as React from 'react'

import { Switch as RawSwitch } from '@/ui/raw/switch'
import { cn } from '@/utils/cn'

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof RawSwitch> {
  /** 스위치 옆에 표시할 라벨 */
  label?: React.ReactNode
}

const Switch = React.forwardRef<
  React.ElementRef<typeof RawSwitch>,
  SwitchProps
>(({ className, label, children, id, ...props }, ref) => {
  const root = (
    <RawSwitch
      ref={ref}
      id={id}
      className={cn(
        // 트랙 56×28 보정 — raw 의 h-6 w-11/border-2 를 덮어씀.
        'peer h-7 w-14 border-0 px-1',
        // 트랙 색: KRDS (raw 의 data-[state=checked]:bg-primary 는 유지, unchecked/disabled 만 보정)
        'data-[state=unchecked]:bg-krds-bg-primary-subtle',
        'data-disabled:cursor-not-allowed data-disabled:bg-krds-bg-disabled data-disabled:opacity-100',
        // thumb(자식 span) 보정 — raw 의 baked translate-x-5 를 !important 로 28px 슬라이드로 교체.
        // raw 의 translate-x 클래스는 span 자신의 data-state 로 토글되므로 동일하게 key 한다.
        '[&>span]:translate-x-0! data-[state=checked]:[&>span]:translate-x-7!',
        '[&>span]:bg-white!',
        className,
      )}
      {...props}
    />
  )

  const node = label ?? children
  if (!node) return root

  return (
    <label htmlFor={id} className="inline-flex items-center gap-krds-4">
      {root}
      <span
        className={cn(
          'text-krds-body-md text-krds-text-ink',
          'peer-data-disabled:cursor-not-allowed peer-data-disabled:text-krds-text-disabled',
        )}
      >
        {node}
      </span>
    </label>
  )
})
Switch.displayName = 'Switch'

export { Switch }
