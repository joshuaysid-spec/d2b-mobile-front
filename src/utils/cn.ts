import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// shadcn/ui className 병합 헬퍼. components.json 의 aliases.utils 가 가리킴.
//
// ─────────────────────────────────────────────────────────────────────────────
// extendTailwindMerge 가 필요한 이유 (2026-05-28)
// ─────────────────────────────────────────────────────────────────────────────
// 기본 twMerge 는 표준 Tailwind 토큰만 인식한다. 우리가 추가한 커스텀 토큰
// `text-krds-body-md` 같은 fontSize 토큰을 만나면, twMerge 가 클래스 이름 패턴
// `text-{*}` 만 보고 font-color 그룹으로 추정 → 옆에 있던 진짜 색 클래스
// (`text-white`, `text-primary-foreground` 등)가 같은 그룹으로 묶여 제거됨.
//
// 결과: Button primary 의 흰 글자가 사라지고 부모 상속 색으로 보이는 회귀
//       (5/22, 5/28 두 차례 발생).
//
// 해결: extendTailwindMerge 로 우리 커스텀 토큰을 올바른 그룹에 명시 등록.
//   - krds-* fontSize 17종      → 'font-size' 그룹
//   - krds-* 색 네임스페이스 35종 → 'text-color' / 'bg-color' / 'border-color' 그룹
//     (Tailwind colors 키는 자동으로 bg/text/border 모두에 노출되므로 3개 그룹에
//      동일 토큰 목록을 등록)
//
// 신규 krds-* 토큰을 src/styles/tailwind.css 의 @theme 에 추가할 때는 여기에도 같이 등록한다.
// 누락 시 같은 회귀가 다시 발생할 수 있다.

const KRDS_FONT_SIZES = [
  'krds-display-lg',
  'krds-display-md',
  'krds-display-sm',
  'krds-heading-xl',
  'krds-heading-lg',
  'krds-heading-md',
  'krds-heading-sm',
  'krds-heading-xs',
  'krds-heading-xxs',
  'krds-body-lg',
  'krds-body-md',
  'krds-body-sm',
  'krds-body-xs',
  'krds-label-lg',
  'krds-label-md',
  'krds-label-sm',
  'krds-label-xs',
] as const

// src/styles/tailwind.css @theme 의 `--color-krds-*` 키 전부. 이름은 `krds-{key}` 형태로
// bg-/text-/border- prefix 와 자동 결합된다.
const KRDS_COLOR_NAMES = [
  // bg roles
  'krds-bg-primary',
  'krds-bg-primary-subtle',
  'krds-bg-danger-subtle',
  'krds-bg-disabled',
  'krds-bg-disabled-soft',
  'krds-bg-primary-faint',
  'krds-bg-blue-pastel',
  'krds-bg-divider',
  // text roles
  'krds-text-strong',
  'krds-text-muted',
  'krds-text-subtle',
  'krds-text-disabled',
  'krds-text-info',
  'krds-text-primary',
  'krds-text-danger',
  'krds-text-ink',
  'krds-text-disabled-soft',
  // border roles
  'krds-border-strong',
  'krds-border-primary',
  'krds-border-danger',
  'krds-border-field',
  'krds-border-disabled',
  'krds-border-divider',
  // interactive (action)
  'krds-action-primary',
  'krds-action-primary-hover',
  'krds-action-primary-active',
  'krds-action-danger',
  'krds-action-danger-hover',
  // feedback
  'krds-feedback-success',
  'krds-feedback-success-bg',
  'krds-feedback-warning',
  'krds-feedback-warning-bg',
  'krds-feedback-danger',
  'krds-feedback-danger-bg',
  'krds-feedback-info',
  'krds-feedback-info-bg',
  // direct -60 step (Badge solid 등 직접 노출)
  'krds-color-success-60',
  'krds-color-warning-60',
  // StepBar 전용 파랑
  'krds-step-blue',
] as const

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...KRDS_FONT_SIZES] }],
      'text-color': [{ text: [...KRDS_COLOR_NAMES] }],
      'bg-color': [{ bg: [...KRDS_COLOR_NAMES] }],
      'border-color': [{ border: [...KRDS_COLOR_NAMES] }],
    },
  },
})

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
