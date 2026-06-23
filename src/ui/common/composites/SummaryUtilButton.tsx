// 요약정보(SummaryInfo) 액션 슬롯용 유틸 아이콘 버튼 (37×37, border)
// Figma m_button icon_page utility(9300-27080) 1:1 — 즐겨찾기/알림신청/출력 등 상세 화면 공통.
//
// state(default/pressed/disabled) + selected(off/on) 조합:
//  - default      : 흰 배경 + field 보더(#c1d1ee) + ink 아이콘(라인, fill 0)
//  - pressed      : faint-blue 배경(#ecf1fa) — 보더 유지
//  - disabled     : 회색 배경(#d8d8d8) · 보더 제거 · 회색 아이콘
//  - selected(on) : 토글형(즐겨찾기) on — aria-pressed + 아이콘 채움(fill 1) + navy(primary-active #0f316e)
//                   (배경/보더는 selected 와 무관하게 state 를 따른다)
//
// 사용 예:
//   <SummaryUtilButton icon="KidStar" label="즐겨찾기" active={favorite} onClick={toggle} />
//   <SummaryUtilButton icon="Print" label="출력" onClick={handleOutput} />
import { Icon, type IconName } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface SummaryUtilButtonProps {
  icon: IconName
  label: string
  onClick: () => void
  /** 토글 on 상태(없으면 일반 버튼). 지정 시 aria-pressed + 아이콘 fill/색(navy) 전환. */
  active?: boolean
  /** 비활성 상태. 회색 배경 + 보더 제거 + 회색 아이콘. */
  disabled?: boolean
  className?: string
}

const SummaryUtilButton = ({
  icon,
  label,
  onClick,
  active,
  disabled,
  className,
}: SummaryUtilButtonProps) => {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex size-[37px] shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-field bg-white',
        active ? 'text-krds-text-primary-active' : 'text-krds-text-ink',
        'active:bg-krds-bg-primary-faint',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:border-transparent disabled:bg-krds-bg-disabled disabled:text-krds-text-disabled',
        className,
      )}
    >
      <Icon name={icon} size={24} fill={active ? 1 : 0} aria-hidden />
    </button>
  )
}
SummaryUtilButton.displayName = 'SummaryUtilButton'

export { SummaryUtilButton }
