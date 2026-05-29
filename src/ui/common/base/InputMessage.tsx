// Figma m_input_message(9300-27870) 1:1.
// 폼 필드 아래 붙는 메시지 한 줄 — type=info(파랑) | type=error(빨강).
//
// 공통: 20px 아이콘(상단 2px 미세 정렬) + 4px gap + 15px Medium 텍스트, leading 1.5.
// 색상은 토큰 사용 — info=krds-text-primary(D2B blue), error=krds-action-danger(D2B pink).
// 아이콘은 Material `Info`(info) / `Cancel`(error) — KRDS sub_notice / close_mc_on 의 근사치.
//
// 사용 예:
//   <InputMessage>안내 메시지를 표시합니다.</InputMessage>
//   <InputMessage type="error">에러 메시지를 표시합니다.</InputMessage>
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

const messageVariants = cva(
  'flex w-full items-start gap-1 text-[15px] font-medium leading-[1.5]',
  {
    variants: {
      type: {
        info: 'text-krds-text-primary',
        error: 'text-krds-action-danger',
      },
    },
    defaultVariants: {
      type: 'info',
    },
  },
)

const ICON_FOR_TYPE: Record<NonNullable<InputMessageProps['type']>, IconName> = {
  info: 'Info',
  error: 'Cancel',
}

export interface InputMessageProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'children'>,
    VariantProps<typeof messageVariants> {
  children: React.ReactNode
}

const InputMessage = React.forwardRef<HTMLParagraphElement, InputMessageProps>(
  ({ className, type = 'info', children, ...props }, ref) => {
    const role = type === 'error' ? 'alert' : undefined
    return (
      <p
        ref={ref}
        role={role}
        className={cn(messageVariants({ type, className }))}
        {...props}
      >
        <span className="flex shrink-0 items-center pt-0.5">
          <Icon name={ICON_FOR_TYPE[type ?? 'info']} size={20} aria-hidden />
        </span>
        <span className="min-w-px flex-1 break-words">{children}</span>
      </p>
    )
  },
)
InputMessage.displayName = 'InputMessage'

export { InputMessage, messageVariants as inputMessageVariants }
