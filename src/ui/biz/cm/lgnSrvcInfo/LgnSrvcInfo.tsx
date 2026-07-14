// MUI-CM-03-P19 로그인 필요 서비스 안내 — 근사(설계서 없는 디자인)
// 비로그인 상태에서 로그인이 필요한 서비스에 접근할 때 노출되는 안내 팝업.
//
// ⚠️ 근사(설계서 없는 디자인): 제공된 spec(slides25-56)·Figma 프레임 모두 미제공 →
//    기존 AlertModal 로 근사. 안내 문구는 설계 의도("로그인 필요 안내 + [로그인]/[취소]") 기반
//    임시 작성이며 확정 문구는 설계서 확인 필요. → 보고 대상.
import { AlertModal } from '@/ui/common/composites/AlertModal'

export interface LgnSrvcInfoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin?: () => void
  onCancel?: () => void
}

export function LgnSrvcInfo({
  open,
  onOpenChange,
  onLogin,
  onCancel,
}: LgnSrvcInfoProps) {
  const handleLogin = () => {
    console.log('[LgnSrvcInfo] 로그인')
    onLogin?.()
    // 추후 API: 로그인 화면(MUI-CM-03-M01)으로 이동
  }
  const handleCancel = () => {
    console.log('[LgnSrvcInfo] 취소')
    onCancel?.()
  }

  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      variant="none"
      // TODO(설계서 확인): 확정 안내 문구 미제공 — 설계 의도 기반 임시 작성
      title="로그인이 필요한 서비스입니다."
      description="로그인 후 이용하실 수 있습니다."
      secondaryAction={{ label: '취소', onClick: handleCancel }}
      primaryAction={{ label: '로그인', onClick: handleLogin }}
    />
  )
}
LgnSrvcInfo.displayName = 'LgnSrvcInfo'
