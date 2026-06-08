import type { ReactNode } from 'react'

// 라우트가 AppLayout 의 전역 Header 에 주입하는 메타(react-router route.handle).
// AppLayout 이 useMatches() 로 가장 깊은 매치의 header 를 읽어 Header props 로 변환한다.
// handle.header 가 없는 라우트는 main 헤더(로고)로 렌더된다.

export interface HeaderRouteMeta {
  /** 'main'(로고) | 'sub'(뒤로+타이틀). 기본 'main'. */
  variant?: 'main' | 'sub'
  /** sub 우측 유틸 버튼 — 'search'(통합검색) | 'home'(홈). 보통 2뎁스=search, 상세=home. */
  util?: 'home' | 'search'
  /** sub 헤더 타이틀. */
  title?: ReactNode
}

/** react-router 라우트의 handle 타입(useMatches 로 읽음). */
export interface RouteHandle {
  header?: HeaderRouteMeta
}
