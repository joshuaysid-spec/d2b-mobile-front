// MUI-MS-01-M12 전체메뉴(햄버거 메뉴) — 메뉴 트리 데이터.
// 1depth(도메인) → 2depth(메뉴) 구조. 아코디언 섹션/네비게이션 항목을 이 데이터로 구동한다.
// 라우팅 경로는 추후 확정 — 핸들러는 페이지에서 console.log 스텁으로 처리(// 추후 라우팅).

/** 3depth 메뉴 항목(불릿 리스트). 2depth 가 children 을 가질 때만 사용. */
export interface MenuLeaf {
  /** 안정적 고유 식별자(React key). */
  id: string
  /** 메뉴명. */
  label: string
}

/** 2depth 메뉴 항목. children 이 있으면 펼침 가능한 3depth 그룹을 가진다. */
export interface MenuItem {
  /** 안정적 고유 식별자(중첩 아코디언 value · React key). */
  id: string
  /** 2depth 메뉴명. */
  label: string
  /** 3depth 하위 메뉴(선택). 있으면 펼침 chevron + 불릿 리스트로 렌더. */
  children?: MenuLeaf[]
}

export interface MenuGroup {
  /** 안정적 고유 식별자(아코디언 value · React key). */
  id: string
  /** 1depth 도메인명(아코디언 섹션 타이틀). */
  title: string
  /** 2depth 메뉴 항목. */
  items: MenuItem[]
}

export const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'op',
    title: '조달계획',
    items: [{ id: 'op-plan', label: '조달계획관리' }],
  },
  {
    id: 'bd',
    title: '입찰',
    items: [
      { id: 'bd-noti', label: '입찰공고' },
      { id: 'bd-proc', label: '입찰진행' },
      { id: 'bd-open', label: '개찰' },
    ],
  },
  {
    id: 'ct',
    title: '계약',
    items: [
      {
        id: 'ct-econtract',
        label: '전자계약',
        // 3depth(Figma 9623-17698) — 전자계약 하위 불릿 메뉴.
        children: [
          { id: 'ct-econtract-list', label: '계약통합목록' },
          { id: 'ct-econtract-cancel', label: '해지/해제 목록' },
        ],
      },
    ],
  },
  {
    id: 'ex',
    title: '이행',
    items: [{ id: 'ex-inspect', label: '검사 및 납품조서' }],
  },
  {
    id: 'wm',
    title: '대금·사후',
    items: [{ id: 'wm-claim', label: '대금청구' }],
  },
  {
    id: 'ts',
    title: '업무지원',
    items: [
      { id: 'ts-intent', label: '사전의향서' },
      { id: 'ts-eligibility', label: '물품적격심사' },
      { id: 'ts-defect', label: '하자관리' },
      { id: 'ts-gov-asset', label: '관급자산관리' },
      { id: 'ts-tax-invoice', label: '세금계산서' },
      { id: 'ts-subcontract', label: '하도급관리' },
      { id: 'ts-eguarantee', label: '전자보증' },
      { id: 'ts-guarantee-use', label: '보증사용현황' },
      { id: 'ts-biz-stat', label: '사업구조통계' },
      { id: 'ts-localization', label: '국산화·개발품목조회' },
      { id: 'ts-mock-review', label: '모의심사' },
    ],
  },
  {
    id: 'support',
    title: '고객센터',
    items: [
      { id: 'support-notice', label: '공지사항' },
      { id: 'support-archive', label: '자료실' },
      { id: 'support-faq', label: '자주묻는 질문' },
      { id: 'support-civil-doc', label: '민원서류 발급신청' },
      { id: 'support-law', label: '법령조회' },
      { id: 'support-epeople', label: '국민신문고' },
      { id: 'support-survey', label: '설문조사' },
    ],
  },
  {
    id: 'mypage',
    title: '마이페이지',
    items: [
      { id: 'my-progress', label: '나의진행업무현황' },
      { id: 'my-history', label: '나의업무이력현황' },
      { id: 'my-posts', label: '나의 게시물' },
      { id: 'my-interest-noti', label: '관심입찰공고' },
      { id: 'my-calendar', label: '업무캘린더' },
      { id: 'my-docbox', label: '문서함' },
      { id: 'my-notification', label: '알림현황' },
      { id: 'my-interest-law', label: '관심법령' },
      { id: 'my-cabinet', label: '디지털캐비닛' },
    ],
  },
  {
    id: 'cert',
    title: '인증센터',
    items: [
      { id: 'cert-manage', label: '인증서 관리' },
      { id: 'cert-import', label: '인증서 가져오기' },
      { id: 'cert-export', label: '인증서 내보내기' },
    ],
  },
  {
    id: 'intro',
    title: '국방전자조달 소개',
    items: [
      { id: 'intro-system', label: '시스템소개' },
      { id: 'intro-feature', label: '주요특징' },
      { id: 'intro-history', label: '연혁' },
      { id: 'intro-infographics', label: '인포그래픽스' },
      { id: 'intro-related-system', label: '관련시스템' },
      { id: 'intro-contact', label: '이용문의' },
    ],
  },
  {
    id: 'guide',
    title: '이용안내',
    items: [
      { id: 'guide-prep', label: '조달사전준비안내' },
      { id: 'guide-domestic', label: '국내조달안내' },
      { id: 'guide-foreign', label: '국외조달안내' },
      { id: 'guide-related-site', label: '관련사이트' },
      { id: 'guide-glossary', label: '용어사전' },
    ],
  },
  {
    id: 'settings',
    title: '설정',
    items: [
      { id: 'set-push', label: '앱 푸시 알림' },
      { id: 'set-permission-list', label: '앱 권한 내역' },
      { id: 'set-permission-manage', label: '앱 권한 관리' },
      { id: 'set-cache', label: '앱 캐시 삭제' },
      { id: 'set-version', label: '앱 버전 정보' },
    ],
  },
  {
    id: 'terms',
    title: '약관',
    items: [
      { id: 'terms-privacy', label: '개인정보처리방침' },
      { id: 'terms-copyright', label: '저작권 정책' },
    ],
  },
]
