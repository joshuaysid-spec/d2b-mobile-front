// Figma Tab bar (9300-27700) — 모바일 하단 고정 네비게이션.
// frontend-architecture.md §10.1 — 하단 고정 네비게이션.
//
// 디자인:
//   - 360w · bg-white · 상단 1px divider(#d1d7e0) · 위쪽 그림자 drop-shadow(0 -5px 5px rgba(23,43,77,0.1))
//   - 탭 4개 균등(flex-1) · 각 탭 h-77 · 세로 정렬(아이콘 24 + gap-3 + 15px Bold 라벨)
//
// 상태:
//   - 선택(NavLink isActive): 상단 navy border-t-4 + 아이콘/라벨 navy
//     (비선택 탭에 border-t-4 border-transparent 를 줘 높이 점프 방지 → 모든 탭 h-77 통일)
//   - 비선택: 투명 border · 아이콘/라벨 ink(#1d1d1d)
//   - 알림(hasNotification): 알림 탭 아이콘 우상단 빨강 dot 배지
//
// Props:
//   interface NavItem { label; iconName?; icon?; to }
//   interface BottomNavProps { items?; hasNotification? }
//   무인자 <BottomNav/> → 기본 4탭(홈/알림/고객센터/마이페이지).
import { NavLink } from 'react-router-dom'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

interface NavItem {
  /** 탭 식별자. 알림 dot 매칭 등 안정적 비교에 사용(label 변경에 영향 없음). */
  id: string
  label: string
  /** REGISTRY 에 있는 Material 아이콘 이름. */
  iconName?: IconName
  /** REGISTRY 미등록 아이콘은 직접 전달 (Icon children 로 렌더). */
  icon?: React.ReactNode
  to: string
}

interface BottomNavProps {
  items?: NavItem[]
  /** true 면 알림 탭(id='notification') 아이콘 우상단에 빨강 dot 배지 표시. */
  hasNotification?: boolean
  /** dot 을 표시할 탭 id. 기본 'notification'. */
  notificationTabId?: string
}

// 기본 4탭. to 는 ROUTES 매핑.
// NOTE(스캐폴드): '고객센터' 라우트가 아직 없어 ROUTES.HOME 으로 둠. 확정 시 교체할 것.
const DEFAULT_ITEMS: NavItem[] = [
  { id: 'home', label: '홈', iconName: 'Home', to: ROUTES.HOME },
  { id: 'notification', label: '알림', iconName: 'Notifications', to: ROUTES.NOTIFICATION },
  // headset_mic 는 REGISTRY 미등록 → children 으로 직접 import (size=24 명시).
  { id: 'support', label: '고객센터', icon: <Icon name="HeadsetMic" size={24} />, to: ROUTES.HOME },
  // location_away 는 MUI 에 없어 Person 으로 대체 (마이페이지 인물 아이콘).
  { id: 'mypage', label: '마이페이지', iconName: 'Person', to: ROUTES.MYPAGE },
]

// 탭 1개 — 아토믹을 별도 파일로 분리하지 않고 BottomNav 내부 컴포넌트로 처리.
function NavTab({ item, showDot }: { item: NavItem; showDot: boolean }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === ROUTES.HOME}
      className={({ isActive }) =>
        cn(
          // 높이 점프 방지: 선택/비선택 모두 4px 상단 border 영역 확보.
          // 선택 시 navy, 비선택 시 transparent. 콘텐츠 위치 동일 → 모든 탭 h-77.
          // min-w-0: flex-1 이 라벨 min-content 아래로도 줄어들게 → 좁은 폭에서 nav 가 넘쳐 잘리지 않음.
          'flex h-[77px] min-w-0 flex-1 flex-col items-center gap-1.5 border-t-4 pt-4',
          'text-[15px] font-bold leading-none',
          isActive
            ? 'border-krds-action-primary-active text-krds-action-primary-active'
            : 'border-transparent text-krds-text-ink',
        )
      }
    >
      <span className="relative inline-flex">
        <Icon name={item.iconName} size={24} aria-hidden>
          {item.icon}
        </Icon>
        {showDot && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-krds-feedback-danger">
            <span className="sr-only">새 알림 있음</span>
          </span>
        )}
      </span>
      {/* 좁은 폭에선 라벨이 잘려(…) 탭이 균등 축소 — nav 가 화면 밖으로 넘치지 않음 */}
      <span className="max-w-full truncate">{item.label}</span>
    </NavLink>
  )
}

function BottomNav({
  items = DEFAULT_ITEMS,
  hasNotification = false,
  notificationTabId = 'notification',
}: BottomNavProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-1/2 z-10 flex w-full max-w-[480px] -translate-x-1/2',
        'border-t border-krds-border-divider bg-white pb-[env(safe-area-inset-bottom)]',
        'shadow-[0_-5px_5px_rgba(23,43,77,0.1)]',
      )}
    >
      {items.map((item) => (
        <NavTab
          key={item.id}
          item={item}
          showDot={hasNotification && item.id === notificationTabId}
        />
      ))}
    </nav>
  )
}

export { BottomNav }
