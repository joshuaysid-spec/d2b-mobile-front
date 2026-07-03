// Figma Header (node 9300-26861) 기반 — 앱 전체 상단 헤더.
// 360w · 콘텐츠 h-72 고정 · bg-white · 하단 1px border krds-border-divider(#d1d7e0).
// 노치/Dynamic Island 보호를 위해 콘텐츠(h-72) 위에 safe-area-top 스페이서를 별도 분리
// (FullPopup / AlertModal 과 동일 철학 — h-72 를 Figma 1:1 로 고정 유지).
//
// 우측 utility menu = 70w × 66h, 세로 정렬(24px 아이콘 + gap-3px + 15px Bold ink 라벨).
//
// ※ 위치 스왑: 통합검색(헤더)↔알림현황(탭바). 헤더의 통합검색 자리에 알림현황 버튼이,
//   BottomNav 의 알림 탭 자리에 통합검색 탭이 온다. util='search' 값(라우트 handle 18곳)은
//   이름을 유지하되 "우측 유틸 슬롯" 의미로 쓰이며 현재 알림 버튼을 렌더한다.
//
// 4가지 상태:
//   1) variant='main' · isLoggedIn=false → [Logo] ··········· [로그인][알림][전체메뉴]
//   2) variant='main' · isLoggedIn=true  → [Logo] ········· [로그아웃][알림][전체메뉴]
//   3) variant='sub'  · util='search'    → [뒤로][타이틀 flex-1] ···· [알림][전체메뉴]
//   4) variant='sub'  · util='home'      → [뒤로][타이틀 flex-1] ····· [홈][전체메뉴]
//
// Props (개별 props):
// ┌────────────────┬──────────────────────────┬──────────────────────────────────────────────┐
// │ variant        │ 'main' | 'sub' = 'main'   │ 헤더 모드                                     │
// │ isLoggedIn     │ boolean = false          │ main 전용. false→로그인 버튼, true→로그아웃 버튼 │
// │ onLogin        │ () => void               │ main 전용. 로그인 버튼 클릭                   │
// │ onLogout       │ () => void               │ main 전용. 로그아웃 버튼 클릭                 │
// │ title          │ ReactNode                │ sub 전용. 타이틀(19 Bold ink, flex-1 truncate) │
// │ util           │ 'home'|'search'='search' │ sub 전용. search→알림+전체메뉴 / home→홈+전체메뉴 │
// │ onBack         │ () => void               │ sub 전용. 뒤로가기                            │
// │ onHome         │ () => void               │ sub 전용. util='home' 홈                      │
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

export interface HeaderProps {
  /** 헤더 모드. 기본 'main'. */
  variant?: 'main' | 'sub'

  // --- main 전용 ---
  /** 로그인 여부. 기본 false → 로그인 버튼, true → 로그아웃 버튼 노출. */
  isLoggedIn?: boolean
  /** 로그인 버튼 클릭. */
  onLogin?: () => void
  /** 로그아웃 버튼 클릭. */
  onLogout?: () => void
  /** main 로고 클릭 → 홈 이동. 주어지면 로고가 버튼이 된다(미지정 시 비클릭 이미지). */
  onLogo?: () => void

  // --- sub 전용 ---
  /** sub 타이틀(19 Bold ink, flex-1 truncate). */
  title?: React.ReactNode
  /** sub 우측 유틸. 기본 'search'(알림+전체메뉴) / home→홈+전체메뉴. */
  util?: 'home' | 'search'
  /** 뒤로가기 클릭. */
  onBack?: () => void
  /** util='home' 홈 클릭. */
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
  util = 'search',
  onBack,
  onHome,
  onNotification,
  hasNotification = false,
  onMenu,
  className,
}: HeaderProps) => {
  // 우측 utility 묶음 — 상태별로 노출 버튼이 다름.
  const rightUtilities = (
    <>
      {variant === 'main' &&
        (isLoggedIn ? (
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
        ))}

      {variant === 'sub' && util === 'home' ? (
        <UtilityMenu icon="Home" label="홈" onClick={onHome} />
      ) : (
        // 통합검색↔알림현황 위치 스왑 — 이 슬롯은 알림현황 진입(통합검색은 BottomNav 탭).
        <UtilityMenu
          icon="NotificationsActive"
          label="알림"
          dot={hasNotification}
          onClick={onNotification}
        />
      )}

      <UtilityMenu icon="Menu" label="전체메뉴" onClick={onMenu} />
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
      <div
        className={cn(
          'flex h-[72px] items-center border-b border-krds-border-divider',
          // main(Logo)은 좌측 16px. sub 는 뒤로가기 버튼(44px 박스에 20px 아이콘
          // 중앙정렬 → 좌측 12px 여백)을 감안해 pl-1(4px) → 아이콘 시각 시작점 16px.
          variant === 'main' ? 'pl-[16px]' : 'pl-1',
        )}
      >
        {variant === 'main' ? (
          onLogo ? (
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
          )
        ) : (
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
        )}

        {variant === 'sub' && (
          // 페이지 본문(PageContainer)이 이미 <h1> 을 렌더하므로 헤더 타이틀은
          // 중복 헤딩을 피해 <span> 으로 둔다(네비게이션 chrome 라벨).
          <span className="min-w-0 flex-1 truncate text-[19px] font-bold leading-normal text-krds-text-ink">
            {title}
          </span>
        )}

        {/* main 일 때는 Logo 와 utility 사이를 밀어내는 스페이서. */}
        {variant === 'main' && <div className="flex-1" aria-hidden />}

        <div className="flex shrink-0 items-center">{rightUtilities}</div>
      </div>
    </header>
  )
}
Header.displayName = 'Header'

export { Header }
