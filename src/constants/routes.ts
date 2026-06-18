// frontend-architecture.md §9.2 — 라우트 경로 상수
export const ROUTES = {
  HOME: '/',
  OP: '/op',
  /** 조달계획 상세 (`:id` 파라미터). 이동: `/op/${id}`. */
  OP_DETAIL: '/op/:id',
  /** 사전규격 상세 (`:id` 파라미터). 이동: `/op/spec/${id}`. */
  OP_SPEC_DETAIL: '/op/spec/:id',
  NOTIFICATION: '/notification',
  SUPPORT: '/support',
  MYPAGE: '/mypage',
  /** 개발자용 컴포넌트 가이드 (PC 해상도, 모바일 셸 미적용). */
  GUIDE: '/guide',
} as const

export type RouteKey = keyof typeof ROUTES
