// MUI-MS-01-M12 전체메뉴(햄버거 메뉴). Figma 9623-17652(로그인 전) / 9623-17740(로그인 후).
// FullPopup 컨테이너(타이틀 "전체메뉴" + 닫기) 위에 다음을 조립:
//   ① 상단 로그인 상태 영역(props 기반 · 로그인 전/후 텍스트·액션 분기) ② 퀵 아이콘 4열 ③ 검색 행 ④ 메뉴 트리(공통 MenuAccordion)
// 인증 상태·유저 정보는 props 로만 받는다(authStore import 금지 — 부모 AppLayout 이 주입).
// 메뉴 트리는 아래 MENU_TREE(1/2/3depth) 로 구동 → 공통 composites/MenuAccordion 이 렌더.
//   (예전 biz 전용 MenuGroup·menuData 는 MenuAccordion 과 중복이라 제거 — 공통 컴포넌트로 일원화.)
// 검색은 cmService.searchAll 스텁 호출 → 결과 없으면 공통 Toast 알림. 핸들러는 console.log 스텁(// 추후 라우팅).
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { LINKED_MENU_LABELS } from '@/constants/menuLabels'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { InputBox } from '@/ui/common/base/InputBox'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { Image } from '@/ui/common/base/Image'
import { Toast } from '@/ui/common/composites/Toast'
import {
  MenuAccordion,
  type MenuItem as MenuAccordionItem,
} from '@/ui/common/composites/MenuAccordion'
import { cmService } from '@/services/cm'
import chatbotImage from '@/assets/images/chatbot.png'

export interface MenuPageProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoggedIn: boolean
  user?: { name?: string; lastLoginAt?: string } | null
  onLogin: () => void
  onLogout: () => void
}

// ─── 메뉴 트리 데이터 ─────────────────────────────────────────────────────────
// 1depth(도메인) → 2depth(메뉴) → 3depth(불릿) 순수 데이터. 라우팅 경로는 추후 확정.
interface MenuNode {
  /** 안정적 고유 식별자(아코디언 value · React key). */
  id: string
  /** 메뉴명. */
  label: string
  /** 하위 메뉴(선택). 있으면 펼침 토글, 없으면 leaf(onClick 라우팅). */
  children?: MenuNode[]
}

const MENU_TREE: MenuNode[] = [
  // 조달·입찰 — 라우팅 연결됨(MENU_ROUTES). 링크된 leaf 의 라벨은 LINKED_MENU_LABELS(단일
  // 진실원천)에서 가져온다 → 여기 메뉴명을 바꾸면 연결 페이지 헤더 타이틀도 같이 바뀐다.
  { id: 'op', label: '조달', children: [{ id: 'op-plan', label: LINKED_MENU_LABELS[ROUTES.OP] }] },
  {
    id: 'bd',
    label: '입찰',
    children: [
      { id: 'bd-noti', label: LINKED_MENU_LABELS[ROUTES.BD] },
      { id: 'bd-proc', label: LINKED_MENU_LABELS[ROUTES.BD_PRGRS] },
      { id: 'bd-open', label: LINKED_MENU_LABELS[ROUTES.BD_OPBID] },
    ],
  },
  // 이하 — 사이트맵(260713) 이미지 구조로 교체(미연결, 라우팅 추후).
  {
    id: 'ct',
    label: '계약',
    children: [
      { id: 'ct-list', label: LINKED_MENU_LABELS[ROUTES.CT] },
      { id: 'ct-payment', label: LINKED_MENU_LABELS[ROUTES.CT_PYMT] },
      { id: 'ct-cancel', label: '해지/해제 목록' },
    ],
  },
  {
    id: 'ex',
    label: '이행',
    children: [
      { id: 'ex-inspect-list', label: '검사 통합 목록' },
      { id: 'ex-inspect-report', label: '검사 및 납품조서 현황 목록' },
      { id: 'ex-quote-req', label: '견적 의뢰서 목록' },
      { id: 'ex-quote-noti', label: '견적 통보서 목록' },
      { id: 'ex-order-req', label: '발주 의뢰서 목록' },
      { id: 'ex-order-noti', label: '발주 통보서 목록' },
    ],
  },
  {
    id: 'wm',
    label: '대금청구 및 사후',
    children: [
      { id: 'wm-claim-list', label: '대금 청구 통합 목록' },
      { id: 'wm-payment-return', label: '대금 지불정보 (반납)' },
      { id: 'wm-claim-progress', label: '대금 청구 진행 현황' },
    ],
  },
  {
    id: 'ts',
    label: '업무지원',
    children: [
      { id: 'ts-intent', label: '사전의향서' },
      { id: 'ts-tax-invoice', label: '세금계산서' },
    ],
  },
  {
    id: 'support',
    label: '고객센터',
    children: [
      { id: 'support-notice-general', label: LINKED_MENU_LABELS[ROUTES.SUPPORT_NOTICE] },
      { id: 'support-notice-dapa', label: LINKED_MENU_LABELS[ROUTES.SUPPORT_NOTICE_DAPA] },
      { id: 'support-notice-unit', label: LINKED_MENU_LABELS[ROUTES.SUPPORT_NOTICE_DMDFRC] },
      { id: 'support-archive-general', label: LINKED_MENU_LABELS[ROUTES.SUPPORT_ARCHIVE] },
      { id: 'support-archive-unit', label: LINKED_MENU_LABELS[ROUTES.SUPPORT_ARCHIVE_DMDFRC] },
      { id: 'support-archive-form', label: LINKED_MENU_LABELS[ROUTES.SUPPORT_ARCHIVE_CTRT] },
      { id: 'support-improve', label: LINKED_MENU_LABELS[ROUTES.SUPPORT_SYS_IMPV] },
      { id: 'support-faq', label: LINKED_MENU_LABELS[ROUTES.SUPPORT_FAQ] },
      { id: 'support-civil-doc', label: LINKED_MENU_LABELS[ROUTES.SUPPORT_DCMNT_ISSU_APLY] },
      { id: 'support-law', label: LINKED_MENU_LABELS[ROUTES.SUPPORT_STT_INFO_LIST] },
    ],
  },
  {
    id: 'cert',
    label: '인증센터',
    children: [
      { id: 'cert-manage', label: '인증서 관리' },
      { id: 'cert-import', label: '인증서 가져오기' },
      { id: 'cert-export', label: '인증서 내보내기' },
      { id: 'cert-bio', label: '생체인증' },
    ],
  },
  {
    id: 'intro',
    label: '국방전자조달소개',
    children: [
      { id: 'intro-system', label: '시스템 소개' },
      { id: 'intro-feature', label: '주요 특징' },
      { id: 'intro-history', label: '연혁' },
      { id: 'intro-infographics', label: '인포그래픽스' },
      { id: 'intro-related-system', label: '관련 시스템' },
      { id: 'intro-contact', label: '이용문의' },
    ],
  },
  {
    id: 'guide',
    label: '이용안내',
    children: [
      { id: 'guide-prep', label: LINKED_MENU_LABELS[ROUTES.GUIDE_PREPARATION] },
      { id: 'guide-domestic', label: LINKED_MENU_LABELS[ROUTES.GUIDE_DOMESTIC] },
      { id: 'guide-foreign', label: LINKED_MENU_LABELS[ROUTES.GUIDE_FOREIGN] },
      { id: 'guide-related-site', label: LINKED_MENU_LABELS[ROUTES.GUIDE_SITE] },
      { id: 'guide-glossary', label: '용어사전' },
      { id: 'guide-app', label: '앱 이용안내' },
    ],
  },
]

// 순수 트리(MenuNode) → MenuAccordion items 로 변환. leaf(자식 없음)에만 onClick 부착.
function toMenuItems(
  nodes: MenuNode[],
  onLeafClick: (node: MenuNode) => void,
): MenuAccordionItem[] {
  return nodes.map((node) =>
    node.children?.length
      ? { id: node.id, label: node.label, children: toMenuItems(node.children, onLeafClick) }
      : { id: node.id, label: node.label, onClick: () => onLeafClick(node) },
  )
}

// 펼침 가능한(자식 있는) 모든 노드 id — 디폴트 전체 펼침(1/2/3depth 전부)용.
function collectOpenIds(nodes: MenuNode[]): string[] {
  return nodes.flatMap((node) =>
    node.children?.length ? [node.id, ...collectOpenIds(node.children)] : [],
  )
}
const ALL_OPEN_IDS = collectOpenIds(MENU_TREE)

// 퀵 아이콘 4열 — 아이콘(24) 위, 라벨 중앙정렬. 링크는 추후 확정.
interface QuickIcon {
  id: string
  label: string
  /** Material Icon 또는 커스텀 SVG(img). */
  icon: ReactNode
  onClick: () => void
}

// 메뉴 leaf(node.id) → 라우트. 구현된 화면만 등록(미구현은 스텁 console.log 유지).
const MENU_ROUTES: Record<string, string> = {
  'op-plan': ROUTES.OP, // 조달계획관리
  'bd-noti': ROUTES.BD, // 입찰공고
  'bd-proc': ROUTES.BD_PRGRS, // 입찰진행
  'bd-open': ROUTES.BD_OPBID, // 개찰(개찰목록 MUI-BD-08-M01)
  'ct-list': ROUTES.CT, // 계약통합목록(MUI-CT-01-M01)
  'ct-payment': ROUTES.CT_PYMT, // 대금지불정보목록(MUI-CT-01-M15)
  'support-notice-general': ROUTES.SUPPORT_NOTICE, // 일반공지사항(MUI-CM-04-M01)
  'support-notice-dapa': ROUTES.SUPPORT_NOTICE_DAPA, // 방위사업청공지사항(M21)
  'support-notice-unit': ROUTES.SUPPORT_NOTICE_DMDFRC, // 수요부대별공지사항(M23)
  'support-archive-general': ROUTES.SUPPORT_ARCHIVE, // 일반자료실(M25)
  'support-archive-unit': ROUTES.SUPPORT_ARCHIVE_DMDFRC, // 수요부대별자료실(M27)
  'support-archive-form': ROUTES.SUPPORT_ARCHIVE_CTRT, // 계약관련서식자료실(M29)
  'support-improve': ROUTES.SUPPORT_SYS_IMPV, // 시스템개선안내(M31)
  'support-faq': ROUTES.SUPPORT_FAQ, // 자주묻는질문(M03)
  'support-civil-doc': ROUTES.SUPPORT_DCMNT_ISSU_APLY, // 민원서류발급신청(M04)
  'support-law': ROUTES.SUPPORT_STT_INFO_LIST, // 법령조회=법령정보(MUI-CM-04-M24)
  'cert-manage': ROUTES.CERT_CRTF_MNG, // 인증서 관리(MUI-CM-04-M14)
  'cert-import': ROUTES.CERT_CRTF_RECEIVE, // 인증서 가져오기(MUI-CM-04-M16)
  'cert-export': ROUTES.CERT_CRTF_SEND, // 인증서 내보내기(MUI-CM-04-M17)
  'intro-system': ROUTES.INTRO_SYSTEM, // 시스템소개(MUI-CM-05-M01)
  'intro-feature': ROUTES.INTRO_FEATURE, // 주요특징(MUI-CM-05-M02)
  'intro-history': ROUTES.INTRO_HISTORY, // 연혁(MUI-CM-05-M03)
  'intro-related-system': ROUTES.INTRO_RELATED, // 관련시스템(MUI-CM-05-M05)
  'intro-contact': ROUTES.INTRO_INQUIRY, // 이용문의(MUI-CM-05-M06)
  'guide-prep': ROUTES.GUIDE_PREPARATION, // 조달사전준비안내 > 사전준비사항(MUI-CM-05-M07)
  'guide-domestic': ROUTES.GUIDE_DOMESTIC, // 국내조달안내 > 국방조달참여절차(MUI-CM-05-M09)
  'guide-foreign': ROUTES.GUIDE_FOREIGN, // 국외조달안내 > 국외조달원 등록절차(MUI-CM-05-M12)
  'guide-related-site': ROUTES.GUIDE_SITE, // 관련사이트(MUI-CM-05-M15)
}

function MenuPage({ open, onOpenChange, isLoggedIn, user, onLogin, onLogout }: MenuPageProps) {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  // 검색 결과 없음 토스트.
  const [emptyToastOpen, setEmptyToastOpen] = useState(false)
  // 검색 진행 중 — 연타/중복 호출 방어.
  const [searching, setSearching] = useState(false)

  const quickIcons: QuickIcon[] = [
    {
      id: 'mypage',
      label: '마이페이지',
      icon: <Icon name="LocationAway" size={24} aria-hidden />,
      onClick: () => {
        onOpenChange(false) // 전체메뉴 닫고 이동
        navigate(ROUTES.MYPAGE) // 마이페이지(MUI-CM-06-M01)
      },
    },
    {
      id: 'cert',
      label: '인증센터',
      icon: <Icon name="VerifiedUser" size={24} aria-hidden />,
      onClick: () => {
        console.log('[menu] 인증센터')
        // 추후 라우팅: navigate(ROUTES.CERT_CENTER)
      },
    },
    {
      id: 'chatbot',
      label: '챗봇상담',
      // 챗봇 마스코트는 Figma 추출 PNG(챗봇상담 이미지 9300-27501). Image 를 24px div 로 감싸 다른 아이콘과 동일 사이즈.
      icon: (
        <div className="size-6 overflow-hidden rounded-full">
          <Image src={chatbotImage} alt="" objectFit="contain" className="size-8" />
        </div>
      ),
      onClick: () => {
        onOpenChange(false) // 전체메뉴 닫고 이동
        navigate(ROUTES.CHATBOT) // 챗봇문의(MUI-MS-01-M11)
      },
    },
    {
      id: 'settings',
      label: '설정',
      icon: <Icon name="Settings" size={24} aria-hidden />,
      onClick: () => {
        onOpenChange(false)
        navigate(ROUTES.SETTINGS) // 설정(MUI-MS-02-M01)
      },
    },
  ]

  // 통합검색 — cmService 스텁 호출. 결과 없으면 토스트 알림(현재 스텁은 항상 빈 배열).
  const handleSearch = async () => {
    const trimmed = keyword.trim()
    if (!trimmed || searching) return
    setSearching(true)
    try {
      const results = await cmService.searchAll(trimmed)
      if (results.length === 0) {
        setEmptyToastOpen(true)
        return
      }
      console.log('[menu] 통합검색 결과', results.length)
      // 추후 라우팅: navigate(ROUTES.SEARCH, { keyword: trimmed })
    } finally {
      setSearching(false)
    }
  }

  // 메뉴 트리 → MenuAccordion items (leaf 클릭은 라우팅 스텁). 렌더마다 재생성 방지(useMemo).
  const handleLeafClick = useCallback(
    (node: MenuNode) => {
      const route = MENU_ROUTES[node.id]
      if (route) {
        onOpenChange(false) // 메뉴(전체메뉴 풀팝업) 닫고 이동
        navigate(route)
        return
      }
      console.log('[menu]', node.label) // 미구현 화면 — 추후 라우팅
    },
    [navigate, onOpenChange],
  )
  const menuItems = useMemo(() => toMenuItems(MENU_TREE, handleLeafClick), [handleLeafClick])

  return (
    <FullPopup open={open} onOpenChange={onOpenChange} title="전체메뉴">
      <div className="flex flex-col gap-krds-8 px-krds-8 py-krds-8 bg-krds-bg-primary-faint">
        {/* ① 상단 로그인 상태 영역 — Figma 9623:17655(로그인 전) / 9623-17825(로그인 후).
            카드/배경 없이 텍스트 중심. isLoggedIn 으로 텍스트·액션 분기.
            (하단 큰 로그인/로그아웃 버튼은 제거하고 로그인 진입/로그아웃을 이 영역으로 이동.) */}
        <div className="flex items-center justify-between gap-krds-5">
          {isLoggedIn ? (
            <>
              <div className="flex min-w-0 flex-col gap-krds-2">
                <p className="text-[22px] font-bold leading-normal text-krds-text-ink">
                  <span>{user?.name ?? '사용자'}</span>
                  <span className="font-medium"> 님</span>
                </p>
                {/* 최근 로그인 — lastLoginAt 주입 시에만 표시(없으면 숨김). 추후 API: authService 가 User 에 채움 */}
                {user?.lastLoginAt && (
                  <p className="text-[14px] font-medium leading-normal text-krds-text-muted">
                    최근 로그인 {user.lastLoginAt}
                  </p>
                )}
              </div>
              {/* 로그아웃 — 컴팩트 텍스트 버튼(기존 하단 큰 버튼 대체). 터치 타깃 44px 확보. */}
              <button
                type="button"
                onClick={onLogout}
                className="flex min-h-11 shrink-0 items-center gap-krds-2 text-[15px] font-medium leading-normal text-krds-text-muted focus-visible:outline-hidden active:opacity-70"
              >
                <Icon name="Logout" size={18} aria-hidden />
                로그아웃
              </button>
            </>
          ) : (
            // 로그인 전 — 텍스트 행 전체가 로그인 진입(기존 하단 큰 버튼 대체).
            <button
              type="button"
              onClick={onLogin}
              aria-label="로그인"
              className="flex min-h-11 w-full items-center justify-between gap-krds-5 text-left focus-visible:outline-hidden active:opacity-70"
            >
              <span className="text-[22px] font-bold leading-normal text-krds-text-ink">
                로그인을 해주세요
              </span>
              <Icon
                name="ChevronRight"
                size={24}
                aria-hidden
                className="shrink-0 text-krds-text-ink"
              />
            </button>
          )}
        </div>

        {/* ② 퀵 아이콘 4열 */}
        <ul className="grid grid-cols-4">
          {quickIcons.map((item) => (
            <li key={item.id} className="flex justify-center">
              <button
                type="button"
                onClick={item.onClick}
                className="flex w-full flex-col items-center gap-[3px] py-krds-5 text-krds-text-ink focus-visible:outline-hidden active:opacity-70"
              >
                <span aria-hidden className="inline-flex size-6 items-center justify-center">
                  {item.icon}
                </span>
                <span className="text-center text-[15px] font-bold leading-normal">
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* ③ 검색 행 — InputBox + 검색 아이콘 버튼(Figma 9623:17683: secondary=흰 배경+파란 테두리+파란 아이콘 20). */}
        <div className="flex items-center gap-krds-5">
          <InputBox
            className="flex-1"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword('')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleSearch()
            }}
            placeholder="내용을 입력하세요."
            aria-label="통합검색"
          />
          <Button
            variant="secondary"
            size="icon"
            aria-label="검색"
            disabled={searching}
            onClick={() => void handleSearch()}
          >
            <Icon name="Search" size={20} aria-hidden />
          </Button>
        </div>
      </div>

      {/* ④ 메뉴 트리 — 공통 MenuAccordion(1/2/3depth 재귀). 각 1depth 는 독립 카드(rounded-12 + shadow).
          디폴트로 모든 그룹(1/2/3depth) 펼침. */}
      <div className="px-krds-8 py-krds-8">
        <MenuAccordion items={menuItems} defaultOpenIds={ALL_OPEN_IDS} />
      </div>

      {/* 검색 결과 없음 토스트(Figma 9623-17911) — 공통 Toast 재사용. */}
      <Toast open={emptyToastOpen} onClose={() => setEmptyToastOpen(false)} duration={2000}>
        검색 결과가 없습니다.
      </Toast>
    </FullPopup>
  )
}
MenuPage.displayName = 'MenuPage'

export { MenuPage }
