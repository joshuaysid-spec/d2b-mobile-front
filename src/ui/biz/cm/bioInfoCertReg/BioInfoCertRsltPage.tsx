// MUI-CM-03-M20 생체인증등록완료 (설계서 00.공통 v0.84 slide62 / Figma 10020:87190)
// 생체인증 등록(MUI-CM-03-M15)에서 본인인증 성공 시 이동하는 완료 화면.
// 셸(AppLayout) 안 + sub헤더 라우트(/login/biometric/register/result, header variant='sub' title='생체인증 등록').
// 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// 설계서(slide62) 동작 메모:
//   - 본인 인증 완료 안내 + 디바이스 얼굴/지문 정보로 로그인 진행 안내.
//   - [생체인증 로그인] → 디바이스 생체인증 로그인 진행, 성공 시 메인 화면 이동.
//     (실패 메시지는 이전 화면으로 복귀하여 토스트 노출 — 하이브리드 인증 브릿지 미연동)
//
// 디자인 메모(보고 대상):
//   - 완료 체크 아이콘은 Figma 상 연한 파란 원 + 흰 체크. REGISTRY 'CheckCircle'(기본 FILL=1)로 근사,
//     원 톤은 text-krds-text-primary 로 근사(M15 완료 화면과 동일).
import { useNavigate } from 'react-router-dom'

import { authService } from '@/services/auth'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import type { LoginResult } from '@/types/domain'

export function BioInfoCertRsltPage() {
  const navigate = useNavigate()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const setUser = useAuthStore((s) => s.setUser)

  // [생체인증 로그인] — 디바이스 생체인증 로그인 → 토큰/유저 저장(store) 후 메인 홈 이동.
  const handleBioLogin = async () => {
    // 추후: 디바이스 생체인증(하이브리드 브릿지) 성공 판정 후 세션 확정. 실패 시 이전 화면 복귀+토스트.
    const result: LoginResult = await authService.biometricLogin()
    setAccessToken(result.accessToken)
    setUser(result.user)
    navigate('/')
  }

  // 셸(AppLayout) 안 화면 — 콘텐츠만 렌더. min-h-full 로 중앙 안내 + 하단 버튼 배치.
  return (
    <div className="flex min-h-full flex-col">
      {/* 중앙 안내 — 체크 아이콘 + 완료 문구 + 안내 박스 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-krds-8 px-krds-8">
        <Icon name="CheckCircle" size={64} className="text-krds-text-primary" aria-hidden />
        <h1 className="text-center text-krds-heading-sm font-bold leading-normal text-krds-text-ink">
          본인 인증이 완료되었습니다.
        </h1>
        <p className="w-full rounded-krds-xl bg-krds-bg-primary-faint px-krds-8 py-krds-7 text-center text-krds-body-md leading-normal text-krds-text-info wrap-break-word">
          디바이스에 등록된
          <br />
          모든 얼굴정보, 지문정보를 이용하여
          <br />
          로그인을 진행합니다.
        </p>
      </div>

      {/* 하단 — 생체인증 로그인 */}
      <div className="px-krds-8 py-krds-8">
        <Button variant="primary" size="lg" className="w-full" onClick={handleBioLogin}>
          생체인증 로그인
        </Button>
      </div>
    </div>
  )
}
BioInfoCertRsltPage.displayName = 'BioInfoCertRsltPage'
