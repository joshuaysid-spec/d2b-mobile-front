// MUI-MS-01-M12 전체메뉴(햄버거 메뉴). Figma 9623-17652(로그인 전) / 9623-17740(로그인 후).
// FullPopup 컨테이너(타이틀 "전체메뉴" + 닫기) 위에 다음을 조립:
//   ① 상단 로그인 상태 영역(props 기반) ② 퀵 아이콘 4열 ③ 검색 행 ④ 메뉴 그룹 카드 리스트(MenuGroup·menuData 구동) ⑤ footer 로그인/로그아웃
// 인증 상태·유저 정보는 props 로만 받는다(authStore import 금지 — 부모 AppLayout 이 주입).
// 메뉴 트리는 menuData.MENU_GROUPS 로 전부 구동. 핸들러는 console.log 스텁(// 추후 라우팅).
import { useState, type ReactNode } from 'react'

import { FullPopup } from '@/ui/common/composites/FullPopup'
import { InputBox } from '@/ui/common/base/InputBox'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { MenuGroup } from '@/ui/biz/cm/menu/MenuGroup'
import { MENU_GROUPS } from '@/ui/biz/cm/menu/menuData'
import chatbotIcon from '@/assets/images/chatbot.svg'
import { Image } from '@/ui/common/base/Image'

export interface MenuPageProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoggedIn: boolean
  user?: { name?: string; lastLoginAt?: string } | null
  onLogin: () => void
  onLogout: () => void
}

// 퀵 아이콘 4열 — 아이콘(24) 위, 라벨 중앙정렬. 링크는 추후 확정.
interface QuickIcon {
  id: string
  label: string
  /** Material Icon 또는 커스텀 SVG(img). */
  icon: ReactNode
  onClick: () => void
}

function MenuPage({ open, onOpenChange, isLoggedIn, user, onLogin, onLogout }: MenuPageProps) {
  const [keyword, setKeyword] = useState('')

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
      icon: <Image src={chatbotIcon} className="size-6" alt="" />,
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

  const handleSearch = () => {
    console.log('[menu] 통합검색', keyword)
    // 추후 라우팅: navigate(ROUTES.SEARCH, { keyword })
  }

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="전체메뉴"
      footer={
        isLoggedIn ? (
          <Button variant="primary" className="w-full" onClick={onLogout}>
            <Icon name="Logout" size={20} aria-hidden />
            로그아웃
          </Button>
        ) : (
          <Button variant="primary" className="w-full" onClick={onLogin}>
            로그인
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-krds-8 px-krds-8 py-krds-8">
        {/* ① 상단 로그인 상태 영역 — props 기반 */}
        <div className="rounded-krds-8 bg-krds-bg-primary-faint px-krds-8 py-krds-6">
          {isLoggedIn ? (
            <div className="flex flex-col gap-krds-2">
              <p className="text-[19px] font-bold leading-normal text-krds-text-ink">
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
          ) : (
            <p className="text-[19px] font-bold leading-normal text-krds-text-ink">
              로그인을 해주세요
            </p>
          )}
        </div>

        {/* ② 퀵 아이콘 4열 */}
        <ul className="grid grid-cols-4">
          {quickIcons.map((item) => (
            <li key={item.id} className="flex justify-center">
              <button
                type="button"
                onClick={item.onClick}
                className="flex w-full flex-col items-center gap-krds-2 py-krds-3 text-krds-text-ink focus-visible:outline-hidden active:opacity-70"
              >
                <span aria-hidden className="inline-flex size-6 items-center justify-center">
                  {item.icon}
                </span>
                <span className="text-center text-[14px] font-medium leading-normal">
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* ③ 검색 행 — InputBox + 검색 아이콘 버튼 */}
        <div className="flex items-center gap-krds-3">
          <InputBox
            className="flex-1"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword('')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
            placeholder="내용을 입력하세요."
            aria-label="통합검색"
          />
          <Button variant="primary" size="icon" aria-label="검색" onClick={handleSearch}>
            <Icon name="Search" size={24} aria-hidden />
          </Button>
        </div>
      </div>

      {/* ④ 메뉴 그룹 카드 리스트 — menuData 로 전부 구동. 각 그룹은 독립 카드(rounded-12 + shadow). */}
      <div className="flex flex-col gap-krds-8 px-krds-8 pb-krds-8">
        {MENU_GROUPS.map((group) => (
          <MenuGroup
            key={group.id}
            group={group}
            onItemClick={(item) => {
              console.log('[menu]', group.title, '>', item.label)
              // 추후 라우팅: navigate(menuRoutes[item.id])
            }}
          />
        ))}
      </div>
    </FullPopup>
  )
}
MenuPage.displayName = 'MenuPage'

export { MenuPage }
