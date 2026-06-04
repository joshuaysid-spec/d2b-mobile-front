// Figma m_empty_data(9300-28084) 기반 — 빈 상태(no data) 표시 컴포넌트.
// 카드 / div / BottomSheet 내부 콘텐츠로 사용. 너비는 부모를 따른다(w-full).
//
// 구조 (Figma 1:1):
//   36px 알림 아이콘(원형 채움)
//   ↓ gap 8px
//   17px Medium gray-90 메시지
//   ↓ (옵션) gap 4px
//   15px Regular muted 보조 설명
//   ↓ (옵션) gap 16px
//   액션 영역(Button 등)
//
// variant — 아이콘 시멘틱:
//   - 'info'(default) = Error 아이콘(채워진 느낌표 원, FILL 1) · 색은 D2B blue-border #c1d1ee — Figma Icon-alert
//   - 'check'         = CheckCircle 아이콘(배경 있는 채움, FILL 1) · 색은 D2B blue-check #8eb7ff — Figma check_circle (성공/완료 상태)
//   - 커스텀 아이콘은 `icon` prop 으로 전달 (variant 무시)
//
// 사용 예:
//   <Empty>검색 결과가 없습니다.</Empty>
//   <Empty description="다른 조건으로 검색해보세요.">검색 결과가 없습니다.</Empty>
//   <Empty variant="check">처리가 완료되었습니다.</Empty>
//   <Empty
//     description="입찰 공고 후 다시 시도해주세요."
//     action={<Button variant="secondary" size="sm">새로고침</Button>}
//   >
//     조회된 공고가 없습니다.
//   </Empty>
import * as React from 'react'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export type EmptyVariant = 'info' | 'check'

export interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 아이콘 시멘틱. 기본 'info'. */
  variant?: EmptyVariant
  /** 커스텀 아이콘 — Icon REGISTRY 키 또는 ReactNode. 주입 시 variant 무시. */
  icon?: IconName | React.ReactNode
  /** 아이콘 색상 강제. 미주입 시 variant 기본색. */
  iconColor?: string
  /** 아이콘 사이즈(px). Figma 기본 36. */
  iconSize?: number
  /** 메인 메시지. children 으로도 받음(children 우선). */
  title?: React.ReactNode
  /** 보조 설명(메시지 아래 15px muted). */
  description?: React.ReactNode
  /** 하단 액션 영역(Button 등). description 과 별개로 16px 간격. */
  action?: React.ReactNode
  children?: React.ReactNode
}

const VARIANT_ICON: Record<EmptyVariant, IconName> = {
  info: 'Error',
  check: 'CheckCircle',
}

const VARIANT_COLOR: Record<EmptyVariant, string> = {
  info: 'var(--krds-d2b-blue-border)',
  check: 'var(--krds-d2b-blue-check)',
}

// 아이콘 FILL 축 — info(검색결과 없음)·check(완료) 모두 배경 채움(FILL 1).
const VARIANT_FILL: Record<EmptyVariant, 0 | 1> = {
  info: 1,
  check: 1,
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  (
    {
      className,
      variant = 'info',
      icon,
      iconColor,
      iconSize = 36,
      title,
      description,
      action,
      children,
      ...props
    },
    ref,
  ) => {
    const message = children ?? title
    const color = iconColor ?? VARIANT_COLOR[variant]

    const iconNode = (() => {
      if (icon == null) {
        return (
          <Icon
            name={VARIANT_ICON[variant]}
            size={iconSize}
            color={color}
            fill={VARIANT_FILL[variant]}
            aria-hidden
          />
        )
      }
      if (typeof icon === 'string') {
        return <Icon name={icon as IconName} size={iconSize} color={color} aria-hidden />
      }
      return (
        <span
          aria-hidden
          className="inline-flex items-center justify-center"
          style={{ width: iconSize, height: iconSize, color }}
        >
          {icon}
        </span>
      )
    })()

    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          'flex w-full flex-col items-center justify-center text-center',
          className,
        )}
        {...props}
      >
        {iconNode}
        {message && (
          <p className="mt-krds-5 wrap-break-word text-[17px] font-medium leading-normal text-krds-text-ink">
            {message}
          </p>
        )}
        {description && (
          <p className="mt-krds-3 wrap-break-word text-[15px] leading-normal text-krds-text-muted">
            {description}
          </p>
        )}
        {action && <div className="mt-krds-7">{action}</div>}
      </div>
    )
  },
)
Empty.displayName = 'Empty'

export { Empty }
