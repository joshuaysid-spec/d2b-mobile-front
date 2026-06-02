// frontend-architecture.md §9.2 — 라우트 경로 상수
export const ROUTES = {
  HOME: '/',
  OP: '/op',
  NOTICE: '/notice',
  NOTIFICATION: '/notification',
  MYPAGE: '/mypage',
  /** 개발자용 컴포넌트 가이드 (PC 해상도, 모바일 셸 미적용). */
  GUIDE: '/guide',
} as const

export type RouteKey = keyof typeof ROUTES
