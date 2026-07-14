import { ROUTES } from './routes'

// 전체메뉴(MenuPage MENU_TREE)와 그 메뉴에 연결된 페이지 헤더 타이틀의 **단일 진실원천**.
//
// 규칙: 전체메뉴에서 링크된 페이지의 메뉴명 = 그 페이지의 헤더 타이틀.
//   → 메뉴명이 바뀌면 연결된 페이지 타이틀도 같이 바뀌어야 하므로, 라벨을 여기 한 곳에만 두고
//     MENU_TREE(전체메뉴)와 router.tsx(페이지 헤더 title)가 함께 참조한다.
//   → 라벨을 고칠 땐 **이 파일만** 수정한다(양쪽 자동 반영).
//
// key = 라우트 경로(ROUTES 값), value = 메뉴명(= 연결 페이지 헤더 타이틀).
export const LINKED_MENU_LABELS = {
  [ROUTES.OP]: '조달계획통합목록',
  [ROUTES.BD]: '입찰공고통합목록',
  [ROUTES.BD_PRGRS]: '입찰진행목록',
  [ROUTES.BD_OPBID]: '개찰목록',
  [ROUTES.SUPPORT_NOTICE]: '일반공지사항',
  [ROUTES.SUPPORT_NOTICE_DAPA]: '방위사업청공지사항',
  [ROUTES.SUPPORT_NOTICE_DMDFRC]: '수요부대별공지사항',
  [ROUTES.SUPPORT_ARCHIVE]: '일반자료실',
  [ROUTES.SUPPORT_ARCHIVE_DMDFRC]: '수요부대별자료실',
  [ROUTES.SUPPORT_ARCHIVE_CTRT]: '계약관련서식자료실',
  [ROUTES.SUPPORT_SYS_IMPV]: '시스템개선안내',
  [ROUTES.SUPPORT_FAQ]: '자주묻는 질문',
  [ROUTES.GUIDE_PREPARATION]: '조달사전준비안내',
  [ROUTES.GUIDE_DOMESTIC]: '국내조달안내',
  [ROUTES.GUIDE_FOREIGN]: '국외조달안내',
  [ROUTES.GUIDE_SITE]: '관련사이트',
} as const
