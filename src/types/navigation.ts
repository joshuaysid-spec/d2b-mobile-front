import type { ReactNode } from 'react'

// 라우트가 AppLayout 의 전역 Header 에 주입하는 메타(react-router route.handle).
// AppLayout 이 useMatches() 로 가장 깊은 매치의 header 를 읽어 Header props 로 변환한다.
// handle.header 가 없는 라우트는 main 헤더(로고)로 렌더된다.

export interface HeaderRouteMeta {
  /** 'main'(메인바만) | 'sub'(메인바 + 아래 타이틀바[뒤로+타이틀]). 기본 'main'. */
  variant?: 'main' | 'sub'
  /**
   * @deprecated 2026-07-06 2단 헤더 전환(카톡 기획 이미지)으로 미사용 — 우측 유틸은 메인바 고정
   * ([로그인/로그아웃][알림][전체메뉴]). 기존 라우트의 util 값은 무시되며, 새 라우트엔 지정하지 않는다.
   */
  util?: 'home' | 'search'
  /** sub 타이틀바 타이틀. */
  title?: ReactNode
}

/** react-router 라우트의 handle 타입(useMatches 로 읽음). */
export interface RouteHandle {
  header?: HeaderRouteMeta
  /**
   * 뒤로(POP)로 이 화면에 되돌아올 때 저장된 스크롤을 복원하지 않고 항상 맨 위로 보낼지.
   * 목록 화면에 true — 상세에서 뒤로 왔을 때 스크롤 위치와 무관하게 상단에서 시작한다.
   */
  scrollReset?: boolean
  /**
   * 하단 고정 네비게이션(BottomNav)을 노출할지. 홈/알림/고객센터/마이페이지 4개 메뉴에만 true —
   * 그 외(목록·세부 화면 등)에선 BottomNav 가 보이지 않는다.
   */
  showBottomNav?: boolean
}
