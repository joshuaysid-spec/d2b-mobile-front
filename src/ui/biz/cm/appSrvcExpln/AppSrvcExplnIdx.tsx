// 앱 이용안내 인덱스 — MUI-CM-05-M16. 설계서 00.공통 v0.85 slide378 / Figma 5M6FlyQBdHgeNrgIG2XhIN 10076:23346.
// 홈 위 딤 + 중앙 모달: "안내를 원하시는 항목을 선택해주세요." + 항목 리스트(메인 홈/마이페이지/메뉴/
//   조달계획/입찰) + [앱 이용안내 닫기]. 항목 클릭 → 해당 화면 이동 + 코치마크(AppSrvcExplnCoach).
// 열림은 URL 쿼리 ?appGuide=index 로 구동 — AppLayout 이 마운트(전체메뉴 이용안내 > 앱 이용안내에서 진입).
// 영문명: 설계서 화면목록(v0.85 slide357·366)·앱메뉴 xlsx 에 M16 영문명 미정의 → 기존 앱이용안내
//   매핑(AppSrvcExpln, MUI-MS-01-M06)에서 파생(2026-07-31 사용자 확정. plan: cm-app-srvc-expln-m16).
// ⚠️ 근사(코디네이터 보고 대상):
//   1) Figma 닫기 버튼은 outline 이나 AlertModal 단일 액션은 primary 고정(SysExpln 동일 근사).
//   2) AlertModal description 은 <p>(DialogDescription) → div 불가라 리스트는 NavigationItemList
//      대신 phrasing-safe <button> 행으로 동일 비주얼 재현.
import { useNavigate, useSearchParams } from 'react-router-dom'

import { AlertModal } from '@/ui/common/composites/AlertModal'
import { Icon } from '@/ui/common/base/Icon'
import { ROUTES } from '@/constants/routes'

/** 앱 이용안내 구동 URL 쿼리 파라미터 키. index=인덱스 모달, 그 외=코치마크 대상. */
export const APP_GUIDE_PARAM = 'appGuide'

/** 코치마크 대상 화면 키(설계서 slide378 항목 순). */
export type AppGuideTarget = 'home' | 'mypage' | 'menu' | 'op' | 'bd'

// 인덱스 항목 — 2026-07-31 요청 표기(구 설계서 slide378: 메인 홈/마이페이지/메뉴/조달계획/입찰).
const ITEMS: { key: AppGuideTarget; label: string }[] = [
  { key: 'home', label: '홈' },
  { key: 'menu', label: '전체메뉴' },
  { key: 'mypage', label: '마이페이지' },
  { key: 'op', label: '조달계획 통합목록' },
  { key: 'bd', label: '입찰공고' },
]

// 항목 → 실제 화면 라우트. '메뉴'는 화면이 아니라 AppLayout 오버레이 — 홈 + state.openMenu 로 연다.
const TARGET_ROUTE: Record<AppGuideTarget, string> = {
  home: ROUTES.HOME,
  mypage: ROUTES.MYPAGE,
  menu: ROUTES.HOME,
  op: ROUTES.OP,
  bd: ROUTES.BD,
}

export function AppSrvcExplnIdx() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const open = searchParams.get(APP_GUIDE_PARAM) === 'index'

  // 닫기 — 쿼리만 제거(현재 화면 유지 = 홈). 설계서: 닫기 클릭 시 이용안내 닫기/메인 페이지 이동.
  const close = () => {
    const next = new URLSearchParams(searchParams)
    next.delete(APP_GUIDE_PARAM)
    setSearchParams(next, { replace: true })
  }

  // 항목 클릭 — 해당 화면으로 이동하며 코치마크(?appGuide=<key>) 구동.
  const goTarget = (key: AppGuideTarget) => {
    navigate(
      `${TARGET_ROUTE[key]}?${APP_GUIDE_PARAM}=${key}`,
      key === 'menu' ? { state: { openMenu: true } } : undefined,
    )
  }

  return (
    <AlertModal
      open={open}
      onOpenChange={(o) => {
        if (!o) close()
      }}
      variant="none"
      dismissable
      title={
        <span className="block text-left text-[19px] font-bold leading-normal text-krds-text-ink">
          앱 이용안내
        </span>
      }
      description={
        <span className="flex flex-col gap-krds-7 text-left">
          <span className="text-[17px] font-normal leading-normal text-krds-text-ink">
            안내를 원하시는 항목을 선택해주세요.
          </span>
          <span className="flex flex-col">
            {ITEMS.map((it) => (
              <button
                key={it.key}
                type="button"
                onClick={() => goTarget(it.key)}
                className="flex min-h-[56px] w-full items-center gap-krds-2 border-t border-krds-border-divider py-krds-6 text-left last:border-b"
              >
                <span className="min-w-px flex-1 truncate text-[19px] font-medium leading-normal text-krds-text-ink">
                  {it.label}
                </span>
                <Icon
                  name="ArrowForwardIos"
                  size={20}
                  className="shrink-0 text-krds-text-ink"
                  aria-hidden
                />
              </button>
            ))}
          </span>
        </span>
      }
      primaryAction={{ label: '앱 이용안내 닫기' }}
    />
  )
}
AppSrvcExplnIdx.displayName = 'AppSrvcExplnIdx'
