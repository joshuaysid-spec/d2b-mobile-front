// MUI-MS-01-M06 앱이용안내 (앱 기동 > 앱 이용안내 / Figma 10020:83458)
// (설계서 v0.84 slide7 화면목록 기준 M06 — slide365 이용안내 목록엔 P06 으로 표기돼 문서 내 불일치. 화면(풀스크린)이므로 M06 채택)
// 앱 이용에 대한 안내(인트로) 화면. 다크 배경 위 흰 카드 = 로고 + 서비스 소개 문구
//   + '국방전자조달 앱 실행하기' 기본 버튼. 셸(AppLayout) 밖 독립 풀스크린 라우트(/app-guide).
//   이용안내 도움말 톤은 M06 코치마크(Figma 10020:84865) 참고.
//
// 설계서: "앱 기동 > 앱 이용안내. 앱 이용에 대한 안내 화면." (얇음 — 카드 문구는 Figma P06 원문 그대로)
// 동작(백엔드 미연동 — 경계만 표시): 버튼 클릭 → 메인(홈) 이동.
//
// 다크 화면 배경 = bg-krds-bg-inverse(--krds-bg-inverse, gray-90).
import { useNavigate } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { Logo } from '@/ui/common/base/Logo'

// onLaunch: 홈 첫 진입 오버레이로 열렸을 때 주입 — 있으면 닫기 콜백, 없으면(라우트 /app-guide 직접 진입) 홈으로.
export function AppSrvcExplnPage({ onLaunch }: { onLaunch?: () => void }) {
  const navigate = useNavigate()
  const handleLaunch = () => {
    console.log('[AppSrvcExpln] 국방전자조달 앱 실행하기')
    if (onLaunch) onLaunch()
    else navigate('/') // 라우트 직접 진입 시 메인(홈)으로
  }

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center bg-krds-bg-inverse px-krds-8">
      {/* 인트로 카드 (Figma 10020:83458) */}
      <div className="flex w-full max-w-sm flex-col items-center gap-krds-9 rounded-krds-xl bg-card px-krds-9 py-krds-12 shadow-krds-card">
        <Logo className="h-8 w-auto" alt="국방전자조달시스템" />

        <div className="flex flex-col items-center gap-krds-8">
          <h1 className="text-center text-krds-heading-xs font-bold text-krds-text-strong">
            국방전자조달 모바일 서비스란?
          </h1>
          <div className="flex flex-col gap-krds-8 text-center text-krds-body-sm text-krds-text-muted">
            <p>
              국방전자조달시스템에 게시되는 주요 조달정보를 언제 어디서나 조회할 수 있도록
              스마트폰에서도 이용 가능한 모바일 앱 서비스입니다.
            </p>
            <p>
              각종 입찰공고는 물론, 조달계획, 입찰결과, 계약정보 등 다양한 정보를 실시간으로
              조회하실 수 있습니다.
            </p>
          </div>
        </div>

        <Button variant="primary" size="lg" className="w-full" onClick={handleLaunch}>
          국방전자조달 앱 실행하기
        </Button>
      </div>
    </div>
  )
}
AppSrvcExplnPage.displayName = 'AppSrvcExplnPage'
