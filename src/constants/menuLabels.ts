import { ROUTES } from './routes'

// 전체메뉴(MenuPage MENU_TREE)와 그 메뉴에 연결된 페이지 헤더 타이틀의 **단일 진실원천**.
//
// 규칙: 전체메뉴에서 링크된 페이지의 메뉴명 = 그 페이지의 헤더 타이틀.
//   → 메뉴명이 바뀌면 연결된 페이지 타이틀도 같이 바뀌어야 하므로, 라벨을 여기 한 곳에만 두고
//     MENU_TREE(전체메뉴)와 router.tsx(페이지 헤더 title)가 함께 참조한다.
//   → 라벨을 고칠 땐 **이 파일만** 수정한다(양쪽 자동 반영).
//
// key = 라우트 경로(ROUTES 값), value = 메뉴명(= 연결 페이지 헤더 타이틀).
// 띄어쓰기는 사이트맵(260708 모바일 사이트맵, KakaoTalk_20260727 공유본) 표기 그대로.
export const LINKED_MENU_LABELS = {
  [ROUTES.OP]: '조달계획 통합 목록',
  [ROUTES.BD]: '입찰공고 통합 목록',
  [ROUTES.BD_PRGRS]: '입찰 진행 목록',
  [ROUTES.BD_OPBID]: '개찰 목록',
  [ROUTES.CT]: '계약 통합 목록',
  [ROUTES.CT_PYMT]: '대금 지불정보 목록',
  [ROUTES.CT_CNCLTN]: '해지/해제 목록',
  [ROUTES.EX]: '검사 통합 목록',
  [ROUTES.EX_PRST]: '검사 및 납품조서 현황 목록',
  [ROUTES.EX_ESTMT_RQDC]: '견적 의뢰서 목록',
  [ROUTES.EX_ESTMT_NTDC]: '견적 통보서 목록',
  [ROUTES.EX_ORDER_RQDC]: '발주 의뢰서 목록',
  [ROUTES.EX_ORDER_NTDC]: '발주 통보서 목록',
  [ROUTES.WM]: '대금 청구 통합 목록',
  [ROUTES.TS_LOI]: '사전의향서',
  [ROUTES.TS_TXIV]: '세금계산서',
  [ROUTES.WM_RTN]: '대금 지불정보 (반납)',
  [ROUTES.WM_PRGRS]: '대금 청구 진행 현황',
  [ROUTES.WM_OVS_CMDTY_RCV_CNFDOC]: '물품 수령확인서 목록',
  [ROUTES.WM_OVS_RTN_PYMT_DFRY_INFO]: '대금 지불정보 (국외)',
  [ROUTES.WM_OVS_PYMT_PRGRS]: '대금 지급현황',
  [ROUTES.SUPPORT_NOTICE]: '일반 공지사항',
  [ROUTES.SUPPORT_NOTICE_DAPA]: '방위사업청 공지사항',
  [ROUTES.SUPPORT_NOTICE_DMDFRC]: '수요부대별 공지사항',
  [ROUTES.SUPPORT_ARCHIVE]: '일반 자료실',
  [ROUTES.SUPPORT_ARCHIVE_DMDFRC]: '수요부대별 자료실',
  [ROUTES.SUPPORT_ARCHIVE_CTRT]: '계약관련서식 자료실',
  [ROUTES.SUPPORT_SYS_IMPV]: '시스템 개선안내',
  [ROUTES.SUPPORT_FAQ]: '자주 묻는 질문',
  [ROUTES.SUPPORT_DCMNT_ISSU_APLY]: '민원서류 발급신청',
  [ROUTES.SUPPORT_STT_INFO_LIST]: '법령 조회',
  // 이용안내 3종 메뉴명 개정(사용자 확정 2026-08-25): 조달 사전준비 안내→사전준비사항 ·
  // 국내 조달 안내→국방 조달 참여절차 · 국외 조달 안내→국외조달원 등록절차.
  [ROUTES.GUIDE_PREPARATION]: '사전준비사항',
  // 청렴계약제(M08) — 사전준비사항 밑 배치(사용자 확정 2026-08-25).
  [ROUTES.GUIDE_PREPARATION02]: '청렴계약제',
  [ROUTES.GUIDE_DOMESTIC]: '국방 조달 참여절차',
  // 이용안내 하위 안내 페이지 메뉴 노출(사용자 확정 2026-08-25 — cm05-guide-menu-links.plan.md).
  // 전자입찰절차 국내(M10)/국외(M14)는 '국내/국외 전자입찰절차'로 구분(사용자 확정 2026-08-25).
  [ROUTES.GUIDE_DOMESTIC02]: '국내 전자입찰절차',
  [ROUTES.GUIDE_DOMESTIC03]: '전자대금청구절차',
  [ROUTES.GUIDE_FOREIGN]: '국외조달원 등록절차',
  [ROUTES.GUIDE_FOREIGN02]: '국외조달원 등록/변경안내',
  [ROUTES.GUIDE_FOREIGN03]: '국외 전자입찰절차',
  [ROUTES.GUIDE_SITE]: '관련 사이트',
} as const
