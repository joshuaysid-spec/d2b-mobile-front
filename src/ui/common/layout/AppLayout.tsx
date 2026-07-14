import { Suspense, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useMatches, useNavigate, useNavigationType } from 'react-router-dom'

import { BottomNav } from '@/ui/common/composites/BottomNav'
import { Header } from '@/ui/common/composites/Header'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { BottomNavVisibleContext } from '@/ui/common/layout/bottomNavContext'
// AppLayout 이 직접 마운트하는 cm 오버레이(헤더 유틸로 열림 · 라우트 아님).
import { MenuPage } from '@/ui/biz/cm/menu/MenuPage'
import { IntgSrchPage } from '@/ui/biz/cm/intgSrch/IntgSrchPage'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants/routes'
import type { RouteHandle } from '@/types/navigation'

// 스크롤 위치 기억 — location.key 별 scrollTop 을 sessionStorage 에 저장.
// 메모리 Map 대신 sessionStorage 를 쓰는 이유: 하이브리드 WebView 가 새로고침(reload)돼도 위치가 유지됨.
// (sessionStorage 는 탭/세션 동안만 — 앱 완전 종료 시 비워짐. 라우트 이동·reload 엔 유지.)
//
// try/catch 이유: 하이브리드 WebView 가 DOM 스토리지를 비활성(안드로이드 domStorageEnabled=false,
//   iOS 프라이빗 스토리지 등)한 환경에선 sessionStorage 접근이 예외를 던진다. 켜짐 여부를 프론트가
//   보장 못 하므로 방어 — 스토리지가 막혀도 "스크롤 복원만 조용히 포기"하고 앱은 정상 동작하게 한다.
const SCROLL_KEY = (key: string) => `scroll:${key}`
const saveScroll = (key: string, top: number) => {
  try {
    sessionStorage.setItem(SCROLL_KEY(key), String(top))
  } catch {
    /* 스토리지 차단 환경 — 복원 못 해도 무시(앱 정상) */
  }
}
const loadScroll = (key: string) => {
  try {
    const v = Number(sessionStorage.getItem(SCROLL_KEY(key)))
    return Number.isFinite(v) ? v : 0 // 값 없음/깨짐 → 0(맨 위)
  } catch {
    return 0
  }
}
// 모바일 앱 셸 — Header(고정 크롬) + 본문(Outlet, 내부 스크롤) + BottomNav(fixed).
// 스크롤 구조: 외곽을 h-dvh + overflow-hidden 으로 뷰포트에 고정하고, main 만 min-h-0 + overflow-y-auto
//   로 내부 스크롤시킨다. → Header/BottomNav 가 스크롤 영역 밖 고정 크롬이 되고, 페이지의 sticky top-0
//   블록이 Header 아래에 자연히 붙는다(window 스크롤 시 겹치던 문제 해소). 맨위로 FAB 는 #app-scroll 참조.
// 본문(Outlet)은 lazy chunk 라서 Suspense 로 감싸 PageLoading 표시.
// 에러(청크 로드 실패·렌더 throw)는 router 의 errorElement(ErrorPage)가 처리한다.
export function AppLayout() {
  // 알림 dot 은 전역 store 에서 구독해 주입(Header 는 범용이라 도메인 store 를 모름).
  const hasUnread = useAuthStore((s) => s.hasUnread)
  // 전체메뉴(MenuPage)도 범용이라 store 를 모름 — AppLayout 이 인증 상태/유저/로그아웃을 주입.
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [menuOpen, setMenuOpen] = useState(false)
  // 통합검색(MUI-MS-01-M09) 오버레이 — 헤더 통합검색(util='search') 클릭 시 열림. MenuPage 와 동일 패턴.
  const [searchOpen, setSearchOpen] = useState(false)

  // 라우트 handle.header 메타로 헤더 모드 결정 — 가장 깊은(자식) 매치 우선. 없으면 main(로고).
  const matches = useMatches()
  const navigate = useNavigate()
  const location = useLocation()
  const navType = useNavigationType() // 'PUSH' | 'POP' | 'REPLACE'
  const scrollRef = useRef<HTMLElement>(null) // main#app-scroll
  const header = [...matches]
    .reverse()
    .map((m) => (m.handle as RouteHandle | undefined)?.header)
    .find(Boolean)
  // 목록 등 scrollReset 화면은 뒤로(POP)로 돌아와도 복원하지 않고 항상 맨 위에서 시작.
  const scrollReset = [...matches].some((m) => (m.handle as RouteHandle | undefined)?.scrollReset)
  // 홈/알림/고객센터/마이페이지 4개 메뉴에서만 BottomNav 노출(showBottomNav). 그 외엔 숨김.
  const showBottomNav = [...matches].some(
    (m) => (m.handle as RouteHandle | undefined)?.showBottomNav,
  )

  // 뒤로: 이전 화면 있으면 -1, 직접 진입(딥링크/새로고침 등)이면 홈 폴백.
  const handleBack = () => {
    if (location.key !== 'default') navigate(-1)
    else navigate(ROUTES.HOME)
  }
  // 스크롤 처리는 아래 effect #2 한 곳에서 (PUSH/REPLACE→맨위, POP→복원).
  //   ※ pathname 기준으로 무조건 top:0 하던 effect 는 POP 복원을 덮어써서 제거함.
  // 1) 현재 화면의 스크롤을 계속 저장(떠나기 직전 값 보존)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => saveScroll(location.key, el.scrollTop)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [location.key])
  // 2) 화면이 바뀌면: POP=저장 위치 복원, 그 외=맨 위로
  //    단, scrollReset 화면(목록)은 POP 으로 돌아와도 복원하지 않고 항상 맨 위.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (navType === 'POP' && !scrollReset) {
      el.scrollTo({ top: loadScroll(location.key) }) // 뒤로/앞으로 → 저장 위치 복원
    } else {
      el.scrollTo({ top: 0 }) // 새 진입(PUSH)·교체(REPLACE)·목록 복귀 → 맨 위
    }
  }, [location.key, navType, scrollReset])
  return (
    <BottomNavVisibleContext.Provider value={showBottomNav}>
    <div className="mx-auto flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-background">
      {/* 2단 헤더(2026-07-06 카톡 기획 이미지): 메인바(로고+로그인/로그아웃+알림+전체메뉴)는 모든 화면
          최상단 고정, sub 화면은 그 아래 타이틀바(뒤로+타이틀) 추가. handle.header.util 은 deprecated(무시). */}
      <Header
        variant={header?.variant ?? 'main'}
        title={header?.title}
        isLoggedIn={isLoggedIn}
        onLogin={() => navigate('/login')}
        onLogout={() => {
          logout()
          navigate(ROUTES.HOME)
        }}
        onBack={handleBack}
        onLogo={() => navigate(ROUTES.HOME)}
        // 통합검색↔알림현황 위치 스왑 — 헤더 유틸=알림현황 이동, 통합검색은 BottomNav 탭.
        onNotification={() => navigate(ROUTES.NOTIFICATION)}
        hasNotification={hasUnread}
        onMenu={() => setMenuOpen(true)}
      />
      {/* 하단 여백 = BottomNav 높이(탭 77px + border-t 1px + safe-area)와 동일하게 맞춰 콘텐츠가 안 가리게.
          BottomNav 가 없는 화면에선 그 여백 대신 safe-area 만 둔다(빈 공간 방지). */}
      <main
        ref={scrollRef}
        id="app-scroll"
        className={
          showBottomNav
            ? 'min-h-0 flex-1 overflow-y-auto pb-[calc(78px+env(safe-area-inset-bottom))]'
            : 'min-h-0 flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]'
        }
      >
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      {/* 알림 dot 은 헤더 알림 버튼으로 이동(위치 스왑). 액션 탭(통합검색/챗봇)은 id 로 분기. */}
      {showBottomNav && (
        <BottomNav
          onAction={(id) => {
            if (id === 'search') setSearchOpen(true)
            if (id === 'chatbot') console.log('[nav] 챗봇') // 추후: 챗봇 연결
          }}
        />
      )}
      {/* 전체메뉴 오버레이 — 헤더 onMenu 로 열림. 인증 상태/유저/로그아웃을 store 에서 주입. */}
      <MenuPage
        open={menuOpen}
        onOpenChange={setMenuOpen}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogin={() => {
          setMenuOpen(false)
          navigate('/login')
        }}
        onLogout={() => {
          setMenuOpen(false)
          logout()
          navigate(ROUTES.HOME)
        }}
      />
      {/* 통합검색 오버레이 — 헤더 통합검색 클릭으로 열림(메인/서브 공통). */}
      <IntgSrchPage open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
    </BottomNavVisibleContext.Provider>
  )
}
