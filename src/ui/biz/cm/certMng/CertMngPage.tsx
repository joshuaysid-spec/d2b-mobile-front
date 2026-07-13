// 인증센터 — MUI-CM-04-M13. Figma 10020-87972 / 설계서 00.공통 v0.83 slide333·336.
// 하위 화면(인증서 관리/가져오기/내보내기/생체인증)으로 이동하는 네비게이션 목록 화면.
// 데이터영역·검색 없음(메뉴 화면) → 검색필터/바텀시트 미생성. 카드 = 아이콘 + 라벨 + 이동 화살표.
// 헤더 타이틀은 router.tsx handle 소유. 하위 화면은 미구현이라 클릭 시 console.log 스텁.
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Icon, type IconName } from '@/ui/common/base/Icon'

interface CertMenu {
  id: string
  label: string
  icon: IconName
  onClick: () => void
}

export function CertMngPage() {
  const navigate = useNavigate()

  // 설계서 slide336 순서: 인증서 관리(M14) · 인증서 가져오기(M16) · 인증서 내보내기(M17) · 생체인증(얼굴·지문).
  const certMenus: CertMenu[] = [
    {
      id: 'crtfMng',
      label: '인증서 관리',
      icon: 'VerifiedUser',
      onClick: () => navigate(ROUTES.CERT_CRTF_MNG), // 인증서 관리(MUI-CM-04-M14)
    },
    {
      id: 'crtfReceive',
      label: '인증서 가져오기',
      icon: 'Download',
      onClick: () => console.log('[CertMng] 인증서 가져오기'), // 추후 라우팅: MUI-CM-04-M16
    },
    {
      id: 'crtfSend',
      label: '인증서 내보내기',
      icon: 'Upload',
      onClick: () => console.log('[CertMng] 인증서 내보내기'), // 추후 라우팅: MUI-CM-04-M17
    },
    {
      id: 'bio',
      label: '생체인증 (얼굴, 지문)',
      icon: 'Fingerprint',
      onClick: () => console.log('[CertMng] 생체인증'), // 추후 라우팅: 생체인증
    },
  ]

  return (
    <div className="flex w-full flex-col gap-4 px-4 py-5">
      {certMenus.map((menu) => (
        <button
          key={menu.id}
          type="button"
          onClick={menu.onClick}
          className="flex h-[74px] w-full items-center gap-2 rounded-[12px] border border-krds-border-divider bg-background px-6 text-left shadow-krds-card focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
        >
          <Icon name={menu.icon} size={24} aria-hidden className="shrink-0 text-krds-text-ink" />
          <span className="min-w-px flex-1 text-[19px] font-bold leading-normal text-krds-text-ink">
            {menu.label}
          </span>
          <Icon name="TrendingFlat" size={20} aria-hidden className="shrink-0 text-krds-text-ink" />
        </button>
      ))}
    </div>
  )
}
CertMngPage.displayName = 'CertMngPage'
