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
  [ROUTES.GUIDE_PREPARATION]: '조달 사전준비 안내',
  [ROUTES.GUIDE_DOMESTIC]: '국내 조달 안내',
  [ROUTES.GUIDE_FOREIGN]: '국외 조달 안내',
  [ROUTES.GUIDE_SITE]: '관련 사이트',
} as const
