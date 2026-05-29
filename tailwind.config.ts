import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

/**
 * Tailwind 디자인 토큰 매핑.
 * Design Ref: krds-design-system.design.md §2.3, §3.3, §11
 *
 * - CSS 변수 정의: src/styles/tokens.css (KRDS) + src/styles/globals.css (shadcn 브리지)
 * - 색상은 hsl() 래퍼 없이 var() 직접 참조 (토큰이 hex 완성값이므로).
 * - shadcn 호환 토큰명(border/primary/...)은 globals.css 브리지가 KRDS로 재매핑.
 * - krds-* 네임스페이스 키는 기존 Tailwind 기본 스케일을 덮어쓰지 않도록 추가.
 */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        krds: {
          'bg-primary': 'var(--krds-bg-primary)',
          'bg-primary-subtle': 'var(--krds-bg-primary-subtle)',
          'bg-danger-subtle': 'var(--krds-bg-danger-subtle)',
          'text-strong': 'var(--krds-text-strong)',
          'text-muted': 'var(--krds-text-muted)',
          'text-subtle': 'var(--krds-text-subtle)',
          'text-disabled': 'var(--krds-text-disabled)',
          'text-primary': 'var(--krds-text-primary)',
          'text-danger': 'var(--krds-text-danger)',
          'border-strong': 'var(--krds-border-strong)',
          'border-primary': 'var(--krds-border-primary)',
          'border-danger': 'var(--krds-border-danger)',
          'action-primary': 'var(--krds-action-primary)',
          'action-primary-hover': 'var(--krds-action-primary-hover)',
          'action-primary-active': 'var(--krds-action-primary-active)',
          'action-danger-hover': 'var(--krds-action-danger-hover)',
          'feedback-success': 'var(--krds-feedback-success)',
          'feedback-success-bg': 'var(--krds-feedback-success-bg)',
          'feedback-warning': 'var(--krds-feedback-warning)',
          'feedback-warning-bg': 'var(--krds-feedback-warning-bg)',
          'feedback-danger': 'var(--krds-feedback-danger)',
          'feedback-danger-bg': 'var(--krds-feedback-danger-bg)',
          'feedback-info': 'var(--krds-feedback-info)',
          'feedback-info-bg': 'var(--krds-feedback-info-bg)',
          'bg-disabled': 'var(--krds-bg-disabled)',
          'bg-disabled-soft': 'var(--krds-bg-disabled-soft)',
          'bg-primary-faint': 'var(--krds-bg-primary-faint)',
          'bg-blue-pastel': 'var(--krds-d2b-blue-pastel-bg)',
          'step-blue': 'var(--krds-d2b-step-blue)',
          'border-field': 'var(--krds-border-field)',
          'border-disabled': 'var(--krds-border-disabled)',
          'border-divider': 'var(--krds-border-divider)',
          'bg-divider': 'var(--krds-border-divider)',
          'text-ink': 'var(--krds-text-ink)',
          'text-disabled-soft': 'var(--krds-text-disabled-soft)',
          'color-success-60': 'var(--krds-color-success-60)',
          'color-warning-60': 'var(--krds-color-warning-60)',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard GOV Variable',
          'Pretendard GOV',
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
      fontSize: {
        'krds-display-lg': [
          'var(--krds-font-size-display-lg)',
          {
            lineHeight: 'var(--krds-line-height-display)',
          },
        ],
        'krds-display-md': [
          'var(--krds-font-size-display-md)',
          {
            lineHeight: 'var(--krds-line-height-display)',
          },
        ],
        'krds-display-sm': [
          'var(--krds-font-size-display-sm)',
          {
            lineHeight: 'var(--krds-line-height-display)',
          },
        ],
        'krds-heading-xl': [
          'var(--krds-font-size-heading-xl)',
          {
            lineHeight: 'var(--krds-line-height-heading)',
          },
        ],
        'krds-heading-lg': [
          'var(--krds-font-size-heading-lg)',
          {
            lineHeight: 'var(--krds-line-height-heading)',
          },
        ],
        'krds-heading-md': [
          'var(--krds-font-size-heading-md)',
          {
            lineHeight: 'var(--krds-line-height-heading)',
          },
        ],
        'krds-heading-sm': [
          'var(--krds-font-size-heading-sm)',
          {
            lineHeight: 'var(--krds-line-height-heading)',
          },
        ],
        'krds-heading-xs': [
          'var(--krds-font-size-heading-xs)',
          {
            lineHeight: 'var(--krds-line-height-heading)',
          },
        ],
        'krds-heading-xxs': [
          'var(--krds-font-size-heading-xxs)',
          {
            lineHeight: 'var(--krds-line-height-heading)',
          },
        ],
        'krds-body-lg': [
          'var(--krds-font-size-body-lg)',
          {
            lineHeight: 'var(--krds-line-height-body)',
          },
        ],
        'krds-body-md': [
          'var(--krds-font-size-body-md)',
          {
            lineHeight: 'var(--krds-line-height-body)',
          },
        ],
        'krds-body-sm': [
          'var(--krds-font-size-body-sm)',
          {
            lineHeight: 'var(--krds-line-height-body)',
          },
        ],
        'krds-body-xs': [
          'var(--krds-font-size-body-xs)',
          {
            lineHeight: 'var(--krds-line-height-body)',
          },
        ],
        'krds-label-lg': [
          'var(--krds-font-size-label-lg)',
          {
            lineHeight: 'var(--krds-line-height-label)',
          },
        ],
        'krds-label-md': [
          'var(--krds-font-size-label-md)',
          {
            lineHeight: 'var(--krds-line-height-label)',
          },
        ],
        'krds-label-sm': [
          'var(--krds-font-size-label-sm)',
          {
            lineHeight: 'var(--krds-line-height-label)',
          },
        ],
        'krds-label-xs': [
          'var(--krds-font-size-label-xs)',
          {
            lineHeight: 'var(--krds-line-height-label)',
          },
        ],
      },
      spacing: {
        'krds-0': 'var(--krds-space-0)',
        'krds-1': 'var(--krds-space-1)',
        'krds-2': 'var(--krds-space-2)',
        'krds-3': 'var(--krds-space-3)',
        'krds-4': 'var(--krds-space-4)',
        'krds-5': 'var(--krds-space-5)',
        'krds-6': 'var(--krds-space-6)',
        'krds-7': 'var(--krds-space-7)',
        'krds-8': 'var(--krds-space-8)',
        'krds-9': 'var(--krds-space-9)',
        'krds-10': 'var(--krds-space-10)',
        'krds-11': 'var(--krds-space-11)',
        'krds-12': 'var(--krds-space-12)',
        'krds-13': 'var(--krds-space-13)',
        'krds-14': 'var(--krds-space-14)',
        'krds-15': 'var(--krds-space-15)',
        'krds-16': 'var(--krds-space-16)',
        'krds-17': 'var(--krds-space-17)',
        'krds-18': 'var(--krds-space-18)',
        'krds-19': 'var(--krds-space-19)',
        'krds-20': 'var(--krds-space-20)',
        'krds-21': 'var(--krds-space-21)',
        'krds-max': 'var(--krds-space-max)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'krds-xs': 'var(--krds-radius-xs)',
        'krds-sm': 'var(--krds-radius-sm)',
        'krds-md': 'var(--krds-radius-md)',
        'krds-8': 'var(--krds-radius-d2b)',
        'krds-lg': 'var(--krds-radius-lg)',
        'krds-xl': 'var(--krds-radius-xl)',
        'krds-full': 'var(--krds-radius-full)',
      },
      boxShadow: {
        'krds-1': 'var(--krds-shadow-1)',
        'krds-2': 'var(--krds-shadow-2)',
        'krds-3': 'var(--krds-shadow-3)',
      },
      keyframes: {
        'spinner-dots-rotate': {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'spinner-dots': 'spinner-dots-rotate 1s steps(8) infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config
