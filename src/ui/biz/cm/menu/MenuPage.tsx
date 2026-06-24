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
  { id: 'op', label: '조달계획', children: [{ id: 'op-plan', label: '조달계획관리' }] },
  {
    id: 'bd',
    label: '입찰',
    children: [
      { id: 'bd-noti', label: '입찰공고' },
      { id: 'bd-proc', label: '입찰진행' },
      { id: 'bd-open', label: '개찰' },
    ],
  },
  {
    id: 'ct',
    label: '계약',
    children: [
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
  { id: 'ex', label: '이행', children: [{ id: 'ex-inspect', label: '검사 및 납품조서' }] },
  { id: 'wm', label: '대금·사후', children: [{ id: 'wm-claim', label: '대금청구' }] },
  {
    id: 'ts',
    label: '업무지원',
    children: [
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
    label: '고객센터',
    children: [
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
    label: '마이페이지',
    children: [
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
    label: '인증센터',
    children: [
      { id: 'cert-manage', label: '인증서 관리' },
      { id: 'cert-import', label: '인증서 가져오기' },
      { id: 'cert-export', label: '인증서 내보내기' },
    ],
  },
  {
    id: 'intro',
    label: '국방전자조달 소개',
    children: [
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
    label: '이용안내',
    children: [
      { id: 'guide-prep', label: '조달사전준비안내' },
      { id: 'guide-domestic', label: '국내조달안내' },
      { id: 'guide-foreign', label: '국외조달안내' },
      { id: 'guide-related-site', label: '관련사이트' },
      { id: 'guide-glossary', label: '용어사전' },
    ],
  },
  {
    id: 'settings',
    label: '설정',
    children: [
      { id: 'set-push', label: '앱 푸시 알림' },
      { id: 'set-permission-list', label: '앱 권한 내역' },
      { id: 'set-permission-manage', label: '앱 권한 관리' },
      { id: 'set-cache', label: '앱 캐시 삭제' },
      { id: 'set-version', label: '앱 버전 정보' },
    ],
  },
  {
    id: 'terms',
    label: '약관',
    children: [
      { id: 'terms-privacy', label: '개인정보처리방침' },
      { id: 'terms-copyright', label: '저작권 정책' },
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
        console.log('[menu] 마이페이지')
        // 추후 라우팅: navigate(ROUTES.MYPAGE)
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
        console.log('[menu] 챗봇상담')
        // 추후 라우팅: open chatbot
      },
    },
    {
      id: 'settings',
      label: '설정',
      icon: <Icon name="Settings" size={24} aria-hidden />,
      onClick: () => {
        console.log('[menu] 설정')
        // 추후 라우팅: navigate(ROUTES.SETTINGS)
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
