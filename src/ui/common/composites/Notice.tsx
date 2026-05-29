// Figma m_noticebox(9300-29118) + m_notice_urgent(9300-29103) 통합.
// `type` prop 으로 2가지 시각/구조 분기:
//
//   type="default" (기본)
//     - bg-primary-faint(#ecf1fa) + rounded-12 + padding 20 + gap 12
//     - 좌측 40px 아이콘 버튼(bg primary-active, rounded-8, 24px Icon)
//     - 우측 17px Medium ink 멀티라인 텍스트
//     - 아이콘 버튼은 onIconClick(또는 onClick) 으로 이벤트 받음, icon prop 으로 교체 가능
//
//   type="urgent"
//     - bg-danger-subtle(#fff5f7) + padding 16 + gap 8 (라운드 없음)
//     - 좌측 Badge solid red ("중요") — 이미 있는 Badge 컴포넌트 재사용
//     - 우측 17px Bold ink 텍스트
//     - badgeLabel prop 으로 텍스트 교체 가능(기본 "중요")
//
// 사용 예:
//   <Notice>입찰 · 계약 관련 주요 업무 알림을 모바일로 받을 수 있습니다.</Notice>
//   <Notice type="urgent">중요공지 내용이 표시됩니다.</Notice>
//   <Notice icon="Settings" onIconClick={() => goSettings()}>...</Notice>
import * as React from 'react'

import { Badge } from '@/ui/common/base/Badge'
import { Icon, type IconName } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 시각/구조 분기. 기본 'default'. */
  type?: 'default' | 'urgent'
  /** default 좌측 아이콘 (Icon REGISTRY 키). 기본 'Notifications'. */
  icon?: IconName
  /** default 좌측 아이콘 버튼 클릭 핸들러. 미주입 시 비활성(시각만). */
  onIconClick?: () => void
  /** default 아이콘 버튼 aria-label. 기본 "알림". */
  iconLabel?: string
  /** urgent 좌측 Badge 텍스트. 기본 "중요". */
  badgeLabel?: React.ReactNode
  children: React.ReactNode
}

const Notice = React.forwardRef<HTMLDivElement, NoticeProps>(
  (
    {
      className,
      type = 'default',
      icon = 'Notifications',
      onIconClick,
      iconLabel = '알림',
      badgeLabel = '중요',
      children,
      ...props
    },
    ref,
  ) => {
    if (type === 'urgent') {
      return (
        <div
          ref={ref}
          role="alert"
          className={cn(
            'flex w-full items-start gap-krds-5 bg-krds-bg-danger-subtle p-krds-8',
            className,
          )}
          {...props}
        >
          <Badge type="solid" color="red" className="shrink-0">
            {badgeLabel}
          </Badge>
          <p className="min-w-px flex-1 break-words text-[17px] font-bold leading-[1.5] text-krds-text-ink">
            {children}
          </p>
        </div>
      )
    }

    // default
    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full items-center gap-krds-7 rounded-[12px] bg-krds-bg-primary-faint p-krds-9',
          className,
        )}
        {...props}
      >
        <button
          type="button"
          aria-label={iconLabel}
          onClick={onIconClick}
          disabled={!onIconClick}
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-krds-8 text-white',
            'bg-krds-action-primary-active',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
            'disabled:cursor-default',
          )}
        >
          <Icon name={icon} size={24} aria-hidden />
        </button>
        <p className="min-w-px flex-1 break-words text-[17px] font-medium leading-[1.5] text-krds-text-ink">
          {children}
        </p>
      </div>
    )
  },
)
Notice.displayName = 'Notice'

export { Notice }
