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
  /** 일반공지사항(공지사항 목록) (MUI-CM-04-M01). */
  SUPPORT_NOTICE: '/support/notice',
  /** 일반공지사항 상세 (MUI-CM-04-M02, `:contsNo`). 이동: `/support/notice/${contsNo}`. */
  SUPPORT_NOTICE_DETAIL: '/support/notice/:contsNo',
  /** 방위사업청공지사항 (MUI-CM-04-M21). */
  SUPPORT_NOTICE_DAPA: '/support/notice/dapa',
  /** 방위사업청공지사항 상세 (MUI-CM-04-M22, `:contsNo`). */
  SUPPORT_NOTICE_DAPA_DETAIL: '/support/notice/dapa/:contsNo',
  /** 수요부대별공지사항 (MUI-CM-04-M23). */
  SUPPORT_NOTICE_DMDFRC: '/support/notice/dmdfrc',
  /** 수요부대별공지사항 상세 (MUI-CM-04-M24, `:contsNo`). */
  SUPPORT_NOTICE_DMDFRC_DETAIL: '/support/notice/dmdfrc/:contsNo',
  /** 일반자료실 (MUI-CM-04-M25). */
  SUPPORT_ARCHIVE: '/support/archive',
  /** 일반자료실 상세 (MUI-CM-04-M26, `:contsNo`). */
  SUPPORT_ARCHIVE_DETAIL: '/support/archive/:contsNo',
  /** 수요부대별자료실 (MUI-CM-04-M27). */
  SUPPORT_ARCHIVE_DMDFRC: '/support/archive/dmdfrc',
  /** 수요부대별자료실 상세 (MUI-CM-04-M28, `:contsNo`). */
  SUPPORT_ARCHIVE_DMDFRC_DETAIL: '/support/archive/dmdfrc/:contsNo',
  /** 계약관련서식자료실 (MUI-CM-04-M29). */
  SUPPORT_ARCHIVE_CTRT: '/support/archive/ctrt',
  /** 계약관련서식자료실 상세 (MUI-CM-04-M30, `:contsNo`). */
  SUPPORT_ARCHIVE_CTRT_DETAIL: '/support/archive/ctrt/:contsNo',
  /** 시스템개선안내 (MUI-CM-04-M31). */
  SUPPORT_SYS_IMPV: '/support/sys-impv',
  /** 시스템개선안내 상세 (MUI-CM-04-M32, `:contsNo`). */
  SUPPORT_SYS_IMPV_DETAIL: '/support/sys-impv/:contsNo',
  /** 자주묻는질문 (MUI-CM-04-M03). */
  SUPPORT_FAQ: '/support/faq',
  /** 인증센터 (MUI-CM-04-M13). 홈 유관기관 바로가기 진입. */
  CERT: '/cert',
  /** 인증서 관리 (MUI-CM-04-M14). 인증센터 > 인증서 관리 진입. */
  CERT_CRTF_MNG: '/cert/manage',
  /** 인증서 가져오기 (MUI-CM-04-M16). */
  CERT_CRTF_RECEIVE: '/cert/receive',
  /** 인증서 내보내기 (MUI-CM-04-M17). */
  CERT_CRTF_SEND: '/cert/send',
  /** 시스템소개 (MUI-CM-05-M01). 국방전자조달 소개 > 시스템소개. */
  INTRO_SYSTEM: '/intro/system',
  /** 주요특징 (MUI-CM-05-M02). 국방전자조달 소개 > 주요특징. */
  INTRO_FEATURE: '/intro/feature',
  /** 연혁 (MUI-CM-05-M03). 국방전자조달 소개 > 연혁. */
  INTRO_HISTORY: '/intro/history',
  /** 관련시스템 (MUI-CM-05-M05). 국방전자조달 소개 > 관련시스템. */
  INTRO_RELATED: '/intro/related',
  /** 이용문의 (MUI-CM-05-M06). 국방전자조달 소개 > 이용문의. */
  INTRO_INQUIRY: '/intro/inquiry',
  /** 사전준비사항 (MUI-CM-05-M07). 이용안내 > 조달사전준비안내 > 사전준비사항. */
  GUIDE_PREPARATION: '/guide/preparation01',
  /** 국방조달참여절차 (MUI-CM-05-M09). 이용안내 > 국내조달안내 > 국방조달참여절차. */
  GUIDE_DOMESTIC: '/guide/domestic01',
  /** 국외조달원 등록절차 (MUI-CM-05-M12). 이용안내 > 국외조달안내 > 국외조달원 등록절차. */
  GUIDE_FOREIGN: '/guide/foreign01',
  /** 관련사이트 (MUI-CM-05-M15). 이용안내 > 관련사이트. */
  GUIDE_SITE: '/guide/site',
  MYPAGE: '/mypage',
  /** 앱 실행 스플래시 (MUI-MS-01-M01). 셸(AppLayout) 밖 독립 풀스크린. */
  SPLASH: '/splash',
  /** 앱 접근권한 동의 (MUI-MS-01-M02). 셸 밖 풀스크린. */
  APP_AUTHRT_AGRE: '/app-authrt-agre',
  /** 앱 이용안내 (MUI-MS-01-P06). 셸 밖 풀스크린. */
  APP_GUIDE: '/app-guide',
  /** 개발자용 컴포넌트 가이드 (PC 해상도, 모바일 셸 미적용). */
  GUIDE: '/guide',
} as const

export type RouteKey = keyof typeof ROUTES
