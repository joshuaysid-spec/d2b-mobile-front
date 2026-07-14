// MUI-CM-03-P16 인증 성공/실패 안내 (설계서: 제공된 spec(slides25-56) 미수록 / Figma 10020:87200)
// 각 로그인 방식(간편/모바일신분증/공동/금융/생체/ID·PW)의 인증·로그인 성공·실패를 안내하는 알림.
//
// ⚠️ 근사: Figma(10020:87200)는 하단 토스트 바("로그인 되었습니다." / "인증에 실패 하였습니다.")로
//    그려져 있으나, /guide 공통 카탈로그에 토스트 컴포넌트가 없어 AlertModal 로 근사(코디네이터 지정).
//    → 보고 대상(설계↔Figma 불일치 + 토스트 부재).
// 설계서 미수록: 성공은 안내 없이 즉시 메인 이동일 수 있음(BUILD-GUIDE 참고 메모) → status='success' 는 옵션.
import { AlertModal } from '@/ui/common/composites/AlertModal'

export interface CertRsltProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 인증·로그인 결과. 'success' → 완료 안내, 'fail' → 실패 안내. */
  status: 'success' | 'fail'
  /**
   * 로그인 방식별로 문구가 달라질 경우 주입. 미주입 시 status 기본 문구.
   * (설계서에 방식별 개별 메시지가 명시되지 않아 기본 문구는 Figma 노출 텍스트를 사용)
   */
  message?: string
  onConfirm?: () => void
}

const DEFAULT_MESSAGE: Record<CertRsltProps['status'], string> = {
  success: '로그인 되었습니다.',
  fail: '인증에 실패 하였습니다.',
}

export function CertRslt({
  open,
  onOpenChange,
  status,
  message,
  onConfirm,
}: CertRsltProps) {
  const handleConfirm = () => {
    console.log('[CertRslt] 확인', status)
    onConfirm?.()
    // 추후 API: 성공 시 authService 세션 반영 후 메인 이동 / 실패 시 로그인 화면 유지
  }

  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      variant={status === 'success' ? 'check' : 'error'}
      title={message ?? DEFAULT_MESSAGE[status]}
      primaryAction={{ label: '확인', onClick: handleConfirm }}
    />
  )
}
CertRslt.displayName = 'CertRslt'
