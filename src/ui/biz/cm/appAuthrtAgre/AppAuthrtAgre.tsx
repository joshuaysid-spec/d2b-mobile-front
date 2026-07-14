// MUI-MS-01-P03 앱접근권한동의 팝업 (설계서 00.공통 / Figma 10020:87071)
// 앱 기능 사용에 필요한 선택 접근권한(전화 등)을 안내하고 [허용]/[취소] 받는 AlertModal 기반 팝업.
// 부모가 open/onOpenChange 를 소유하는 콘텐츠 컴포넌트 — 라우트 아님(호스트 미배선).
//
// 근사(보고): Figma 는 좌측정렬 타이틀 + 우측 상단 닫기(X) 이나, 공통 AlertModal 은
//   중앙정렬 타이틀·닫기 X 미지원이라 근사 처리(타이틀 중앙, X 생략). 본문/권한카드는 좌측정렬로 맞춤.
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { Icon, type IconName } from '@/ui/common/base/Icon'

// 선택 접근권한 목록 — 설계서 "선택 접근권한(전화 등)". 항목: 권한명 + 용도.
// TODO(디자인 에셋): 전화 아이콘은 Material Symbols 'call' 글리프. REGISTRY 미등록이라
//   telephony 근사 글리프 HeadsetMic 로 대체. → 권장: Icon REGISTRY 에 `Call: 'call'` 추가 후 icon:'Call'.
interface AccessPermission {
  id: string
  icon: IconName
  /** 권한명 (예: 전화) */
  name: string
  /** 용도 설명 (예: 전화 걸기 및 관리) */
  usage: string
}

const ACCESS_PERMISSIONS: AccessPermission[] = [
  { id: 'phone', icon: 'HeadsetMic', name: '전화', usage: '전화 걸기 및 관리' },
]

export interface AppAuthrtAgreProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppAuthrtAgre({ open, onOpenChange }: AppAuthrtAgreProps) {
  const handleAllow = () => {
    // 추후 네이티브 브리지: 접근권한 허용 → 토스트 "허용 되었습니다."
    console.log('[AppAuthrtAgre] 접근권한 허용')
  }
  const handleCancel = () => {
    // 추후 네이티브 브리지: 접근권한 취소 → 토스트 "취소 되었습니다."
    console.log('[AppAuthrtAgre] 접근권한 취소')
  }

  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      variant="none"
      title="선택 접근권한"
      description={
        <div className="flex flex-col gap-krds-5 text-left">
          <p className="text-krds-body-md text-krds-text-ink">
            해당 기능을 사용하기 위해서는 다음 접근권한이 필요합니다.
          </p>
          <ul className="flex flex-col gap-krds-4">
            {ACCESS_PERMISSIONS.map((perm) => (
              <li
                key={perm.id}
                className="flex items-center gap-krds-5 rounded-krds-lg bg-krds-bg-primary-faint px-krds-6 py-krds-5"
              >
                <Icon
                  name={perm.icon}
                  size={24}
                  className="text-krds-text-primary"
                  aria-hidden
                />
                <div className="flex flex-col">
                  <span className="text-krds-body-md font-bold text-krds-text-ink">
                    {perm.name}
                  </span>
                  <span className="text-krds-body-sm text-krds-text-muted">
                    {perm.usage}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      }
      secondaryAction={{ label: '취소', onClick: handleCancel }}
      primaryAction={{ label: '허용', onClick: handleAllow }}
    />
  )
}
AppAuthrtAgre.displayName = 'AppAuthrtAgre'
