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

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof RawCheckbox> {
  /** 칩 라벨. children 으로도 받음(children 우선). */
  label?: React.ReactNode
  /**
   * 시각 형태.
   * - 'chip'(기본): pill 칩 — 항상 Check 아이콘 표시, 선택 시 배경/굵기 변경. 검색필터·CheckboxGroup 등 기존 사용처 전부 이 형태.
   * - 'box': 24px 사각 체크박스 + 옆에 일반 텍스트 라벨. 약관/서약서 동의 목록처럼 행 안에 박스로 끼울 때.
   */
  variant?: 'chip' | 'box'
}

const Checkbox = React.forwardRef<React.ElementRef<typeof RawCheckbox>, CheckboxProps>(
  ({ className, label, children, variant = 'chip', ...props }, ref) => {
    // box variant — 사각 체크박스(☐). raw 를 박스 위에 투명 임베드(레이어 규칙 유지), 시각은 data-state 로 따라감.
    if (variant === 'box') {
      const content = label ?? children
      return (
        <label
          className={cn(
            'inline-flex cursor-pointer select-none items-center gap-krds-4',
            'text-krds-body-md text-krds-text-ink',
            'has-disabled:cursor-not-allowed has-disabled:text-krds-text-disabled',
            className,
          )}
        >
          <span
            className={cn(
              // 24px 사각 박스 — Figma m_checkbox_basic(border #c1d1ee=border-field, radius 2px=krds-xs)
              'relative grid size-6 shrink-0 place-content-center rounded-krds-xs border border-krds-border-field bg-background transition-colors',
              // 선택됨/부분선택(indeterminate) — 파란 배경 + 흰 체크/대시
              'has-data-[state=checked]:border-krds-action-primary has-data-[state=checked]:bg-krds-action-primary',
              'has-data-[state=indeterminate]:border-krds-action-primary has-data-[state=indeterminate]:bg-krds-action-primary',
              // 키보드 포커스 링
              'has-focus-visible:outline-hidden has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2',
              // 비활성
              'has-disabled:border-krds-border-disabled has-disabled:bg-krds-bg-disabled-soft',
            )}
          >
            {/* after:-inset-2 — 24px 박스의 클릭 가능 영역을 사방 8px 넓혀 터치 타깃 확보(레이아웃 불변). */}
            <RawCheckbox
              ref={ref}
              className="peer absolute inset-0 size-full cursor-pointer opacity-0 after:absolute after:-inset-2 after:content-[''] disabled:cursor-not-allowed"
              {...props}
            />
            {/* 체크 아이콘 — 선택 시에만 표시(peer=raw 의 data-state 추적). 흰색, 클릭은 raw 로 통과. */}
            <Icon
              name="Check"
              size={18}
              aria-hidden
              className="pointer-events-none text-white opacity-0 peer-data-[state=checked]:opacity-100"
            />
            {/* 부분선택(전체동의 일부 체크) — 대시 표시. absolute 로 겹쳐 중앙 정렬(체크 아이콘과 자리 공유). */}
            <Icon
              name="Remove"
              size={18}
              aria-hidden
              className="pointer-events-none absolute inset-0 grid place-content-center text-white opacity-0 peer-data-[state=indeterminate]:opacity-100"
            />
          </span>
          {content != null && <span className="min-w-0">{content}</span>}
        </label>
      )
    }

    // chip variant(기본) — pill 칩. 기존 동작 그대로.
    return (
      <label
        className={cn(
          // 칩(pill) 기본 — 기본 너비 74px(min-w), 내용이 길면 줄바꿈 없이 가로로 늘어나 아래로 안 넘침
          // relative: 숨은 input(absolute)의 containing block 을 칩으로 고정 → 스와이프 스크롤러 안에서
          //           칩 클릭 시 input 포커스가 스크롤러를 왼쪽 끝으로 당기는 현상 방지.
          'relative inline-flex h-12 min-w-[74px] cursor-pointer select-none items-center justify-center gap-krds-3 rounded-krds-8 px-krds-6',
          'border border-krds-border-primary bg-background',
          'text-krds-body-md font-medium text-krds-text-primary transition-colors',
          // 키보드 포커스 — 내부 checkbox 가 focus-visible 일 때 칩에 링
          'has-focus-visible:outline-hidden has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2',
          // 선택됨 — raw 의 data-state=checked 를 따라감.
          // 굵은 테두리는 border-width 변경(레이아웃 이동) 대신 inset box-shadow 로 표현 → 텍스트 밀림 없음.
          // 선택 배경 = #ecf1fa(bg-primary-faint) — 현행 m_checkbox_button(10020:7494) 실측.
        // (구 #bcd4ff subtle 은 텍스트 #0054e9 와 대비 4.06:1 미달 → faint 는 5.38:1 통과, 260729)
        'has-data-[state=checked]:shadow-[inset_0_0_0_1px_var(--krds-border-primary)] has-data-[state=checked]:bg-krds-bg-primary-faint has-data-[state=checked]:font-bold',
          // 비활성
          'has-disabled:cursor-not-allowed has-disabled:border-krds-border-disabled has-disabled:bg-krds-bg-disabled-soft has-disabled:text-krds-text-disabled ',
          // 비활성+선택 — border/check 아이콘(currentColor)/텍스트 모두 #8e8e8e(krds-text-disabled). 가장 높은 specificity 로 명시 고정.
          '[&:has(:disabled):has([data-state=checked])]:shadow-[inset_0_0_0_1px_var(--krds-text-disabled)] [&:has(:disabled):has([data-state=checked])]:border-krds-text-disabled [&:has(:disabled):has([data-state=checked])]:bg-krds-bg-disabled-soft [&:has(:disabled):has([data-state=checked])]:text-krds-text-disabled',
          className,
        )}
      >
        3333
        {/* 실제 폼 컨트롤 — 시각은 칩이 담당하므로 raw 는 숨김.
        raw 의 h-4 w-4 border 를 확실히 덮어쓰도록 size-px/border-0/opacity-0 명시(sr-only 의 tailwind-merge 충돌 회피). */}
        <RawCheckbox
          ref={ref}
          className="absolute size-px overflow-hidden border-0 p-0 opacity-0 [clip:rect(0,0,0,0)]"
          {...props}
        />
        <Icon name="Check" size={20} className="shrink-0" aria-hidden />
        <span className="whitespace-nowrap">{label ?? children}</span>
      </label>
    )
  },
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
