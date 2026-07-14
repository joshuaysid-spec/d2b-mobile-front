// shadcn raw/radio-group(@radix-ui/react-radio-group 기반, 폼 컨트롤)의 RadioGroupItem 을
// 그대로 "넣어서" 칩을 구성한다 (Checkbox 파일럿 패턴 동일).
// raw 의 RadioGroupItem 은 Indicator+Circle(lucide) 를 고정 자식으로 갖고 구조 변경이 불가하므로 —
// raw 를 숨겨서 임베드하고, 바깥 <label> 래퍼를 칩(pill)으로 스타일링한다.
// 칩의 선택/비활성/포커스 시각은 raw 의 상태를 CSS 로 따라간다:
//   [&:has([data-state=checked])]  → 선택됨
//   [&:has(:disabled)]             → 비활성
//   [&:has(:focus-visible)]        → 키보드 포커스
// 클릭: <label> 이 내부 raw RadioGroupItem(labelable button)로 클릭을 전달 → 칩 어디를 눌러도 선택.
// 라디오 시맨틱: raw/radio-group 의 RadioGroup(Root) 컨텍스트 안에서 동작 — value/disabled/그룹 단일선택 그대로.
import * as React from 'react'

import { RadioGroupItem as RawRadioItem } from '@/ui/raw/radio-group'
import { cn } from '@/utils/cn'

export interface RadioButtonProps
  extends React.ComponentPropsWithoutRef<typeof RawRadioItem> {
  /** 칩에 표시할 라벨. children 으로도 받음(label 우선). */
  label?: React.ReactNode
  /** 좌측 원형 라디오 표시(○/●) 유무. 기본 false(원형 없는 pill). true 면 표준 라디오 원형 노출. */
  showIndicator?: boolean
}

const RadioButton = React.forwardRef<
  React.ElementRef<typeof RawRadioItem>,
  RadioButtonProps
>(({ className, label, children, showIndicator = false, ...props }, ref) => (
  <label
    className={cn(
      // chip base — Figma m_radiobutton: h-48 · px-10 · gap-4 · rounded-8
      // relative: 숨긴 raw 라디오(absolute)를 라벨 안에 가둔다 — 없으면 포커스 시 브라우저가
      //   그 절대요소를 화면에 넣으려 스크롤 컨테이너를 크게 점프시켜 흰 화면처럼 보임(실기기).
      'group relative inline-flex h-12 min-w-[74px] cursor-pointer select-none items-center justify-center gap-krds-3 rounded-krds-8 px-krds-6',
      'border border-krds-border-primary bg-background',
      'text-krds-body-md font-medium text-primary transition-colors',
      // 키보드 포커스 — 내부 radio item 이 focus-visible 일 때 칩에 링
      'has-focus-visible:outline-hidden has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2',
      // 선택됨 — raw 의 data-state=checked 를 따라감.
      // 굵은 테두리는 border-width 변경(레이아웃 이동) 대신 inset box-shadow 로 표현 → 텍스트 밀림 없음.
      'has-data-[state=checked]:border-primary has-data-[state=checked]:shadow-[inset_0_0_0_1px_var(--krds-border-primary)]',
      'has-data-[state=checked]:bg-krds-bg-primary-subtle has-data-[state=checked]:font-bold',
      // 비활성 — checked+disabled 조합에서도 회색이 우선하도록 ! 로 강제(선택 강조 위에 덮음)
      // border 색은 #8E8E8E(krds-text-disabled), bg 는 #F0F0F0(krds-bg-disabled-soft)
      'has-disabled:cursor-not-allowed has-disabled:!border-krds-text-disabled',
      'has-disabled:!bg-krds-bg-disabled-soft has-disabled:text-krds-text-disabled',
      // 비활성+선택 — inset shadow 색도 회색으로 덮음(선택 primary shadow 위에).
      '[&:has(:disabled):has([data-state=checked])]:shadow-[inset_0_0_0_1px_var(--krds-text-disabled)]',
      className,
    )}
  >
    {/* 실제 라디오 컨트롤 — 시각은 칩이 담당하므로 raw 는 숨김.
        raw 의 h-4 w-4 border rounded-full 을 확실히 덮어쓰도록 size-px/border-0/opacity-0 명시(sr-only 의 tailwind-merge 충돌 회피, Checkbox 동일). */}
    <RawRadioItem
      ref={ref}
      className="absolute size-px overflow-hidden border-0 p-0 opacity-0 [clip:rect(0,0,0,0)]"
      {...props}
    />
    {/* 라디오 원형 아이콘(장식) — showIndicator 일 때만. 칩(group)의 raw 상태를 group-has 로 따라감 */}
    {showIndicator && (
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
          'border-krds-border-field',
          'group-has-data-[state=checked]:border-primary',
          'group-has-disabled:!border-krds-text-disabled',
        )}
        aria-hidden
      >
        <span
          className={cn(
            'hidden size-3 rounded-full bg-primary',
            'group-has-data-[state=checked]:block',
            'group-has-disabled:bg-krds-text-disabled',
          )}
        />
      </span>
    )}
    <span>{label ?? children}</span>
  </label>
))
RadioButton.displayName = 'RadioButton'

export { RadioButton }
