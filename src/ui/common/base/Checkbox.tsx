// shadcn raw/checkbox(@radix-ui/react-checkbox 기반, 폼 input)를 그대로 "넣어서" 칩을 구성한다.
// raw/checkbox 는 라벨/구조를 못 받으므로(고정 Indicator) — Root 자체를 칩으로 쓰는 대신
// raw 를 sr-only 로 임베드하고, 바깥 <label> 래퍼를 칩(pill)으로 스타일링한다.
// 칩의 선택/비활성 시각은 raw 의 상태를 CSS 로 따라간다:
//   [&:has([data-state=checked])]  → 선택됨
//   [&:has(:disabled)]             → 비활성
//   [&:has(:focus-visible)]        → 키보드 포커스
// 클릭: <label> 이 내부 raw checkbox(labelable button)로 클릭을 전달 → 칩 어디를 눌러도 토글.
// 폼 시맨틱: raw/checkbox 가 숨은 native input 을 자동 생성 → name/value/required/폼 제출 그대로.
import * as React from 'react'

import { Checkbox as RawCheckbox } from '@/ui/raw/checkbox'
import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof RawCheckbox> {
  /** 칩 라벨. children 으로도 받음(children 우선). */
  label?: React.ReactNode
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof RawCheckbox>,
  CheckboxProps
>(({ className, label, children, ...props }, ref) => (
  <label
    className={cn(
      // 칩(pill) 기본
      'inline-flex h-12 cursor-pointer select-none items-center justify-center gap-krds-3 rounded-krds-8 px-krds-6',
      'border border-krds-border-primary bg-background',
      'text-krds-body-md font-medium text-krds-text-primary transition-colors',
      // 키보드 포커스 — 내부 checkbox 가 focus-visible 일 때 칩에 링
      '[&:has(:focus-visible)]:outline-none [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-ring [&:has(:focus-visible)]:ring-offset-2',
      // 선택됨 — raw 의 data-state=checked 를 따라감
      '[&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:bg-krds-bg-primary-subtle [&:has([data-state=checked])]:font-bold',
      // 비활성
      '[&:has(:disabled)]:cursor-not-allowed [&:has(:disabled)]:border-krds-border-disabled [&:has(:disabled)]:bg-krds-bg-disabled-soft [&:has(:disabled)]:text-krds-text-disabled',
      '[&:has(:disabled):has([data-state=checked])]:border-2 [&:has(:disabled):has([data-state=checked])]:border-krds-text-disabled [&:has(:disabled):has([data-state=checked])]:bg-krds-bg-disabled-soft',
      className,
    )}
  >
    {/* 실제 폼 컨트롤 — 시각은 칩이 담당하므로 raw 는 숨김.
        raw 의 h-4 w-4 border 를 확실히 덮어쓰도록 size-px/border-0/opacity-0 명시(sr-only 의 tailwind-merge 충돌 회피). */}
    <RawCheckbox
      ref={ref}
      className="absolute size-px overflow-hidden border-0 p-0 opacity-0 [clip:rect(0,0,0,0)]"
      {...props}
    />
    <Icon name="Check" size={20} className="shrink-0" aria-hidden />
    <span>{label ?? children}</span>
  </label>
))
Checkbox.displayName = 'Checkbox'

export { Checkbox }
