// Figma m_label_badge(9300-27132) 1:1.
// type(pastel | solid) × color(blue | red | yellow | green) — 8 조합 (Figma 정의 6개 + solid yellow/green fallback).
//
// pastel : 옅은 배경 + 1px 보더 + 진한 텍스트 (Regular)
// solid  : 진한 배경 + 흰 텍스트 (SemiBold)
//
// 페이지 사용 예:
//   <Badge type="pastel" color="blue">구분명</Badge>
//   <Badge type="solid" color="red">중요</Badge>
import { cva, type VariantProps } from 'class-variance-authority'

import { Badge as RawBadge, type BadgeProps as RawBadgeProps } from '@/ui/raw/badge'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  cn(
    // 베이스 — Figma 공통: padding 6px/2px · radius 4px · 15px Regular · whitespace-nowrap
    // raw/badge 의 rounded-full / px-2.5 / text-xs / font-semibold 등을 덮어쓰기 위해 명시
    'inline-flex items-center justify-center whitespace-nowrap',
    'rounded-[4px] px-1.5 py-0.5',
    'text-[15px] leading-normal',
  ),
  {
    variants: {
      type: {
        pastel: 'border font-normal',
        solid: 'border-0 font-semibold text-white',
      },
      color: {
        blue: '',
        red: '',
        yellow: '',
        green: '',
      },
    },
    compoundVariants: [
      // pastel — bg + border + text 가 함께 정해짐
      {
        type: 'pastel',
        color: 'blue',
        class:
          'bg-krds-bg-blue-pastel border-krds-border-field text-krds-action-primary-active',
      },
      {
        type: 'pastel',
        color: 'red',
        class:
          'bg-krds-bg-danger-subtle border-krds-feedback-danger text-krds-feedback-danger',
      },
      {
        type: 'pastel',
        color: 'yellow',
        class:
          'bg-krds-feedback-warning-bg border-krds-color-warning-60 text-krds-color-warning-60',
      },
      {
        type: 'pastel',
        color: 'green',
        class:
          'bg-krds-feedback-success-bg border-krds-color-success-60 text-krds-color-success-60',
      },
      // solid — bg 만 (텍스트는 항상 white, border 는 type 변형에서 0 처리)
      {
        type: 'solid',
        color: 'blue',
        class: 'bg-krds-action-primary-active',
      },
      {
        type: 'solid',
        color: 'red',
        class: 'bg-krds-feedback-danger',
      },
      // solid yellow/green 은 Figma 미정의 — 일관성 위해 -60 색으로 채움
      {
        type: 'solid',
        color: 'yellow',
        class: 'bg-krds-color-warning-60',
      },
      {
        type: 'solid',
        color: 'green',
        class: 'bg-krds-color-success-60',
      },
    ],
    defaultVariants: {
      type: 'pastel',
      color: 'blue',
    },
  },
)

export interface BadgeProps
  extends Omit<RawBadgeProps, 'variant' | 'color'>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, type, color, ...props }: BadgeProps) {
  // raw badge 의 default variant 는 `bg-primary hover:bg-primary/80` 을 박는데,
  // hover:* 는 tailwind-merge 가 별도 그룹으로 보고 남겨두기 때문에 호버 시 색이 바뀐다.
  // 라벨은 비상호작용 요소이므로 호버 bg 가 없는 raw `outline` variant 를 기반으로 깐다.
  return (
    <RawBadge
      variant="outline"
      className={cn(badgeVariants({ type, color, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
