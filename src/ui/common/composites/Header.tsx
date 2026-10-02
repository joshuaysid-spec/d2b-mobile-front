// Figma Header (node 9300-26861) 기반 — 앱 전체 상단 헤더.
// 360w · 메인바 h-72 고정 · bg-white · 하단 1px border krds-border-divider(#d1d7e0).
// 노치/Dynamic Island 보호를 위해 콘텐츠 위에 safe-area-top 스페이서를 별도 분리
// (FullPopup / AlertModal 과 동일 철학 — h-72 를 Figma 1:1 로 고정 유지).
//
// 우측 utility menu = 70w × 66h, 세로 정렬(24px 아이콘 + gap-3px + 15px Bold ink 라벨).
//
// ※ 위치 스왑: 통합검색(헤더)↔알림현황(탭바). 헤더의 통합검색 자리에 알림현황 버튼이,
//   BottomNav 의 알림 탭 자리에 통합검색 탭이 온다.
//
// 2026-07-06 레이아웃 변경(카톡 기획 이미지): 2뎁스 이하(variant='sub')에서도 메인 앱바를
//   최상단에 그대로 두고, 그 바로 아래에 타이틀바(뒤로가기 + 가운데 타이틀)를 한 줄 추가한다.
//   → 메인바(로고+로그인/로그아웃+알림+전체메뉴)는 모든 화면 공통 고정 크롬.
//
// 상태:
//   1) variant='main' · isLoggedIn=false → [Logo] ··········· [로그인][알림][전체메뉴]
//   2) variant='main' · isLoggedIn=true  → [Logo] ········· [로그아웃][알림][전체메뉴]
//   3) variant='sub'  → 메인바(1·2 와 동일) + 아래 타이틀바 [뒤로][타이틀(가운데)]
//
// Props (개별 props):
// ┌────────────────┬──────────────────────────┬──────────────────────────────────────────────┐
// │ variant        │ 'main' | 'sub' = 'main'   │ 'sub' 면 메인바 아래 타이틀바 추가            │
// │ isLoggedIn     │ boolean = false          │ false→로그인 버튼, true→로그아웃 버튼(공통)   │
// │ onLogin        │ () => void               │ 로그인 버튼 클릭                              │
// │ onLogout       │ () => void               │ 로그아웃 버튼 클릭                            │
// │ title          │ ReactNode                │ sub 전용. 타이틀바 타이틀(19 Bold, 가운데)     │
// │ util           │ 'home'|'search'          │ ⚠️ deprecated — 2단 헤더 전환으로 미사용.      │
// │ onBack         │ () => void               │ sub 전용. 뒤로가기                            │
// │ onHome         │ () => void               │ ⚠️ deprecated — 홈은 메인바 로고(onLogo)로.    │
// │ onNotification │ () => void               │ 공통. 알림현황 이동                           │
// │ hasNotification│ boolean = false          │ 알림 아이콘 우상단 빨강 dot                   │
// │ onMenu         │ () => void               │ 공통. 전체메뉴                                │
// │ className      │ string                   │ header 추가 클래스                            │
// └────────────────┴──────────────────────────┴──────────────────────────────────────────────┘
//
// 기본값으로 무인자 <Header /> → main + 로그인전 렌더 (AppLayout 호환).
import * as React from 'react'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { Logo } from '@/ui/common/base/Logo'
import { cn } from '@/utils/cn'

/**
 * sub 타이틀바 우측 셀의 portal 타깃 id. 페이지가 헤더에 액션 버튼(예: 통합검색 '초기화')을 꽂을 때
 * `createPortal(<button/>, document.getElementById(HEADER_ACTION_SLOT_ID))` 로 사용한다.
 * 헤더는 라우트 handle(정적) 로만 제어되므로 페이지 상태에 묶인 핸들러는 이 슬롯으로만 전달 가능.
 */
export const HEADER_ACTION_SLOT_ID = 'header-action-slot'

export interface HeaderProps {
  /** 헤더 모드. 기본 'main'. 'sub' 면 메인바 아래 타이틀바(뒤로+타이틀)가 한 줄 추가된다. */
  variant?: 'main' | 'sub'

  // --- 로그인 상태 (메인바 공통) ---
  /** 로그인 여부. 기본 false → 로그인 버튼, true → 로그아웃 버튼 노출. */
  isLoggedIn?: boolean
  /** 로그인 버튼 클릭. */
  onLogin?: () => void
  /** 로그아웃 버튼 클릭. */
  onLogout?: () => void
  /** 메인바 로고 클릭 → 홈 이동. 주어지면 로고가 버튼이 된다(미지정 시 비클릭 이미지). */
  onLogo?: () => void

  // --- sub(타이틀바) 전용 ---
  /** sub 타이틀바 타이틀(19 Bold ink, 가운데 정렬 truncate). */
  title?: React.ReactNode
  /**
   * @deprecated 2026-07-06 2단 헤더 전환으로 미사용 — 우측 유틸은 메인바 고정
   * ([로그인/로그아웃][알림][전체메뉴]). 라우트 handle 의 기존 util 값은 무시된다.
   */
  util?: 'home' | 'search'
  /** 뒤로가기 클릭. */
  onBack?: () => void
  /** @deprecated 홈 유틸 제거 — 홈 이동은 메인바 로고(onLogo)가 담당. */
  onHome?: () => void

  // --- 공통 utility ---
  /** 알림현황 클릭(알림현황 화면 이동). */
  onNotification?: () => void
  /** true 면 알림 아이콘 우상단 빨강 dot(새 알림) 표시. */
  hasNotification?: boolean
  /** 전체메뉴 클릭. */
  onMenu?: () => void

  className?: string
}

// ──────────────────────────────────────────────────────────────────────────
// Internal: 우측 유틸리티 메뉴 아톰 (70w × 66h, 24px 아이콘 + gap-3px + 15px Bold 라벨)
// 파일 분리 없이 Header 내부에서만 사용.
// ──────────────────────────────────────────────────────────────────────────
interface UtilityMenuProps {
  /** Material 아이콘 이름(REGISTRY 키) 또는 커스텀 ReactNode. */
  icon: IconName | React.ReactNode
  /** 시각 라벨이자 버튼 aria-label(string 으로 강제). */
  label: string
  /** true 면 아이콘 우상단 빨강 dot(새 알림) 표시 — BottomNav dot 과 동일 디자인. */
  dot?: boolean
  onClick?: () => void
}

const UtilityMenu = ({ icon, label, dot = false, onClick }: UtilityMenuProps) => {
  const iconNode =
    typeof icon === 'string' ? (
      <Icon name={icon as IconName} size={24} aria-hidden />
    ) : (
      <span
        aria-hidden
        className="inline-flex h-[24px] w-[24px] items-center justify-center"
      >
        {icon}
      </span>
    )

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'inline-flex h-[66px] w-[70px] shrink-0 flex-col items-center justify-center gap-[3px] rounded-krds-8',
        'text-krds-text-ink',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
        'active:opacity-70',
      )}
    >
      <span className="relative inline-flex">
        {iconNode}
        {dot && (
          <span className="absolute right-0 top-0 size-[11px] rounded-full border-2 border-white bg-krds-feedback-danger">
            <span className="sr-only">새 알림 있음</span>
          </span>
        )}
      </span>
      <span className="text-[15px] font-bold leading-[1.2]">{label}</span>
    </button>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Header
// ──────────────────────────────────────────────────────────────────────────
const Header = ({
  variant = 'main',
  isLoggedIn = false,
  onLogin,
  onLogout,
  onLogo,
  title,
  onBack,
  onNotification,
  hasNotification = false,
  onMenu,
  className,
}: HeaderProps) => {
  // 우측 utility 묶음 — 메인바 고정: [로그인/로그아웃][알림][전체메뉴] (main/sub 공통).
  const rightUtilities = (
    <>
      {isLoggedIn ? (
        <UtilityMenu
          icon={<Icon name="Logout" size={24} />}
          label="로그아웃"
          onClick={onLogout}
        />
      ) : (
        <UtilityMenu
          icon={<Icon name="Login" size={24} />}
          label="로그인"
          onClick={onLogin}
        />
      )}

      {/* 통합검색↔알림현황 위치 스왑 — 이 슬롯은 알림현황 진입(통합검색은 BottomNav 탭).
          data-coach = 앱 이용안내(M16) 코치마크 하이라이트 측정 지점(알림+전체메뉴 묶음). */}
      <div data-coach="header-utils" className="flex items-center">
        <UtilityMenu
          icon="NotificationsActive"
          label="알림"
          dot={hasNotification}
          onClick={onNotification}
        />

        <UtilityMenu icon="Menu" label="전체메뉴" onClick={onMenu} />
      </div>
    </>
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-10 bg-white',
        // 노치/Dynamic Island 영역만큼 헤더와 같은 배경으로 채움(콘텐츠 h-72 와 분리).
        'pt-[env(safe-area-inset-top)]',
        className,
      )}
    >
      {/* 메인바 — 로고 + [로그인/로그아웃][알림][전체메뉴]. main/sub 공통 최상단 고정. */}
      <div className="flex h-[72px] items-center border-b border-krds-border-divider pl-[16px]">
        {onLogo ? (
          <button
            type="button"
            onClick={onLogo}
            aria-label="홈으로"
            className="inline-flex shrink-0 items-center rounded-krds-8 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
          >
            <Logo />
          </button>
        ) : (
          <Logo />
        )}

        <div className="flex-1" aria-hidden />

        <div className="flex shrink-0 items-center">{rightUtilities}</div>
      </div>

      {/* 타이틀바(sub 전용) — 뒤로가기 + 가운데 타이틀. 메인바 바로 아래 한 줄 추가(카톡 기획 이미지).
          그리드 [44px|1fr|≥44px] 로 타이틀을 광학적 가운데 고정(우측 = 페이지 액션 portal 슬롯, 비면 뒤로가기와 동일 폭).
          높이 56px: Figma 미확정 — 뒤로가기 터치 타깃(44px) + 상하 여백 근사값(원본 확정 시 조정). */}
      {variant === 'sub' && (
        <div className="grid h-[56px] grid-cols-[44px_minmax(0,1fr)_minmax(44px,auto)] items-center border-b border-krds-border-divider px-1">
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로 가기"
            className={cn(
              'inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-krds-8',
              'text-krds-text-ink',
              'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
              'active:opacity-70',
            )}
          >
            <Icon name="ArrowBackIosNew" size={20} aria-hidden />
          </button>

          {/* 페이지 본문(PageContainer)이 이미 <h1> 을 렌더하므로 헤더 타이틀은
              중복 헤딩을 피해 <span> 으로 둔다(네비게이션 chrome 라벨). */}
          <span className="min-w-0 truncate text-center text-[19px] font-bold leading-normal text-krds-text-ink">
            {title}
          </span>

          {/* 페이지 액션 슬롯 — 페이지가 createPortal 로 채움(HEADER_ACTION_SLOT_ID). 비면 스페이서. */}
          <div id={HEADER_ACTION_SLOT_ID} className="flex h-[44px] items-center justify-end" />
        </div>
      )}
    </header>
  )
}
Header.displayName = 'Header'

export { Header }
