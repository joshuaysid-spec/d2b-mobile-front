// MUI-MS-01-P04 앱업데이트안내 팝업 (설계서 00.공통 / Figma 10020:87092)
// 필수 업데이트가 필요할 때 주요 업데이트 항목을 안내하고 [설치]/[앱 종료] 받는 AlertModal 기반 팝업.
// 스플래시(M01) 버전 체크에서 "필수 업데이트" 판정 시 부모가 open. 라우트 아님(호스트 미배선).
//
// 근사(보고): Figma 타이틀 좌측정렬 → 공통 AlertModal 중앙정렬로 근사. 본문/목록은 좌측정렬로 맞춤.
import { AlertModal } from '@/ui/common/composites/AlertModal'

// 주요 업데이트 항목 — 설계서 "1. 보안 프로그램 최신화 / 2. 국방전자조달시스템 업그레이드".
const UPDATE_ITEMS: string[] = [
  '보안 프로그램 최신화',
  '국방전자조달시스템 업그레이드',
]

export interface AppUpdateInfoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppUpdateInfo({ open, onOpenChange }: AppUpdateInfoProps) {
  const handleInstall = () => {
    // 추후 네이티브 브리지: 스토어(앱 설치/업데이트) 이동.
    console.log('[AppUpdateInfo] 앱 설치')
  }
  const handleExit = () => {
    // 추후 네이티브 브리지: 앱 종료.
    console.log('[AppUpdateInfo] 앱 종료')
  }

  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      variant="none"
      title="필수 업데이트 안내"
      description={
        <div className="flex flex-col gap-krds-5 text-left">
          <p className="text-krds-body-md text-krds-text-ink">
            원활한 앱 사용을 위해 최신버전 업데이트가 필요합니다.
          </p>
          <div className="flex flex-col gap-krds-3">
            <span className="text-krds-body-md font-bold text-krds-text-ink">
              주요 업데이트
            </span>
            <ol className="flex flex-col gap-krds-2">
              {UPDATE_ITEMS.map((item, i) => (
                <li key={item} className="text-krds-body-md text-krds-text-ink">
                  {`${i + 1}. ${item}`}
                </li>
              ))}
            </ol>
          </div>
        </div>
      }
      secondaryAction={{ label: '앱 종료', onClick: handleExit }}
      primaryAction={{ label: '설치', onClick: handleInstall }}
    />
  )
}
AppUpdateInfo.displayName = 'AppUpdateInfo'
