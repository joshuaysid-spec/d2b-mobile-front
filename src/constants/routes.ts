// frontend-architecture.md §9.2 — 라우트 경로 상수
export const ROUTES = {
  HOME: '/',
  OP: '/op',
  /** 조달계획 상세 (`:id` 파라미터). 이동: `/op/${id}`. */
  OP_DETAIL: '/op/:id',
  /** 사전규격 상세 (`:id` 파라미터). 이동: `/op/spec/${id}`. */
  OP_SPEC_DETAIL: '/op/spec/:id',
  /** 입찰공고 통합목록 (MUI-BD-01-M01). */
  BD: '/bd',
  /** 입찰공고 상세 (`:id` 파라미터). 이동: `/bd/${id}`. */
  BD_DETAIL: '/bd/:id',
  /** 입찰진행 목록 (MUI-BD-03-M01). */
  BD_PRGRS: '/bd/prgrs',
  /** 입찰진행 상세 (MUI-BD-03-M02, `:id`). 이동: `/bd/prgrs/${id}`. */
  BD_PRGRS_DETAIL: '/bd/prgrs/:id',
  /** 입찰등록심사 결과조회 (MUI-BD-03-M05). */
  BD_REG_RSLT: '/bd/reg-rslt',
  /** 사전심사(PQ) 결과조회 (MUI-BD-02-M02). */
  BD_SRNG_RSLT: '/bd/srng-rslt',
  /** 개찰목록 (MUI-BD-08-M01). */
  BD_OPBID: '/bd/opbid',
  /** 입찰결과상세(개찰상세) (MUI-BD-09-M01~M04, `:id` 파라미터). 이동: `/bd/result/${id}`. */
  BD_RESULT_DETAIL: '/bd/result/:id',
  NOTIFICATION: '/notification',
  SUPPORT: '/support',
  MYPAGE: '/mypage',
  /** 개발자용 컴포넌트 가이드 (PC 해상도, 모바일 셸 미적용). */
  GUIDE: '/guide',
} as const

export type RouteKey = keyof typeof ROUTES
