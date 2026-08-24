// MUI-CM-03-P18 로그아웃 안내 (설계서: 제공된 spec(slides25-56) 미수록 / Figma 10020:87215)
// 로그아웃 완료를 안내하는 알림. (앱 백그라운드 복귀 시 세션 만료로 인한 자동 로그아웃 안내 포함)
//
// ⚠️ 근사: Figma(10020:87215)는 하단 토스트 바("로그아웃 되었습니다.")로 그려져 있으나,
//    /guide 공통에 토스트 컴포넌트가 없어 AlertModal 로 근사(코디네이터 지정). → 보고 대상.
import { AlertModal } from '@/ui/common/composites/AlertModal'

export interface LgoInfoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 미주입 시 기본 문구. (예: 세션 만료 시 별도 문구 주입) */
  message?: string
  onConfirm?: () => void
}

const DEFAULT_MESSAGE = '로그아웃 되었습니다.'

export function LgoInfo({
  open,
  onOpenChange,
  message,
  onConfirm,
}: LgoInfoProps) {
  const handleConfirm = () => {
    console.log('[LgoInfo] 확인')
    onConfirm?.()
    // 추후 API: cmService 세션 정리 후 메인/로그인 화면 이동
  }

  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      variant="check"
      title={message ?? DEFAULT_MESSAGE}
      primaryAction={{ label: '확인', onClick: handleConfirm }}
    />
  )
}
LgoInfo.displayName = 'LgoInfo'
