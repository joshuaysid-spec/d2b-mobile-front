// MUI-MS-01-M06 앱이용안내 (앱 기동 > 앱 이용안내 / Figma 10020:83458)
// (설계서 v0.84 slide7 화면목록 기준 M06 — slide365 이용안내 목록엔 P06 으로 표기돼 문서 내 불일치. 화면(풀스크린)이므로 M06 채택)
// 구성: ① 인트로 카드(로고 + 서비스 소개 + '국방전자조달 앱 실행하기') — Figma 10020:83458 그대로
//      ② 앱이용안내 항목 선택 카드 — "안내를 원하시는 항목을 선택해주세요." + 메인홈/마이페이지/메뉴/조달계획/입찰
//        (2026-07-27 사용자 지시 구성. 항목 클릭 → 해당 화면 이동. '메뉴'는 화면이 아니라 AppLayout 오버레이라
//         홈 이동 + location.state.openMenu 트리거로 전체메뉴를 연다. 화면별 코치마크(Figma 10020:84865)는 추후.)
// 셸(AppLayout) 밖 독립 풀스크린 라우트(/app-guide). 다크 화면 배경 = bg-krds-bg-inverse(--krds-bg-inverse, gray-90).
import { useNavigate } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { Logo } from '@/ui/common/base/Logo'
import { NavigationItemList } from '@/ui/common/composites/NavigationItemList'
import { ROUTES } from '@/constants/routes'

// onLaunch: 홈 첫 진입 오버레이로 열렸을 때 주입 — 있으면 닫기 콜백, 없으면(라우트 /app-guide 직접 진입) 홈으로.
export function AppSrvcExplnPage({ onLaunch }: { onLaunch?: () => void }) {
  const navigate = useNavigate()
  const handleLaunch = () => {
    console.log('[AppSrvcExpln] 국방전자조달 앱 실행하기')
    if (onLaunch) onLaunch()
    else navigate('/') // 라우트 직접 진입 시 메인(홈)으로
  }

  // 안내 항목 클릭 — 오버레이로 열려 있으면 먼저 닫고 해당 화면으로 이동.
  const goItem = (path: string, state?: { openMenu?: boolean }) => {
    onLaunch?.()
    navigate(path, state ? { state } : undefined)
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-krds-8 overflow-y-auto bg-krds-bg-inverse px-krds-8 py-krds-10">
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

      {/* 앱이용안내 — 항목 선택 후 해당 화면으로 이동 */}
      <div className="flex w-full max-w-sm flex-col gap-krds-7 rounded-krds-xl bg-card px-krds-9 py-krds-10 shadow-krds-card">
        <div className="flex flex-col gap-krds-3">
          <h2 className="text-krds-heading-xs font-bold text-krds-text-strong">앱이용안내</h2>
          <p className="text-krds-body-sm text-krds-text-muted">
            안내를 원하시는 항목을 선택해주세요.
          </p>
        </div>
        <NavigationItemList
          items={[
            { id: 'home', label: '메인홈', onClick: () => goItem(ROUTES.HOME) },
            { id: 'mypage', label: '마이페이지', onClick: () => goItem(ROUTES.MYPAGE) },
            // 메뉴(전체메뉴)는 AppLayout 오버레이 — 홈 이동 + openMenu 트리거로 연다.
            { id: 'menu', label: '메뉴', onClick: () => goItem(ROUTES.HOME, { openMenu: true }) },
            { id: 'op', label: '조달계획', onClick: () => goItem(ROUTES.OP) },
            { id: 'bd', label: '입찰', onClick: () => goItem(ROUTES.BD) },
          ]}
        />
      </div>
    </div>
  )
}
AppSrvcExplnPage.displayName = 'AppSrvcExplnPage'
