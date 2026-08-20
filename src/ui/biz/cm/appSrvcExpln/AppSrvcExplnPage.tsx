// MUI-MS-01-M06 앱이용안내 (앱 기동 > 앱 이용안내) — 설계서 00.공통 v0.86 slide22(화면 p21).
// 최초 앱 기동 시 노출되는 온보딩 안내. 설계서 개정(2026-07-28 "화면 수정 / 스크린샷 이미지 업데이트 /
//   버튼 영역 추가 및 설명 작성")에 맞춰 구 인트로 카드(Figma 10020:83458 P06 표기, "국방전자조달 모바일
//   서비스란?" + 항목 리스트)를 폐기하고 배너 5페이지 순차 안내로 재작성.
// 구성: ① 배너 1장(현재 페이지) — 메인홈·검색필터·조달계획·입찰공고·마이페이지 순
//      ② 하단 버튼 영역 — 첫/중간/마지막 페이지별로 구성이 바뀐다(설계서 원문):
//         첫    [다시 보지 않기] [다음]
//         중간  [다시 보지 않기] [이전] [다음]
//         마지막 [이전] [다시 보지 않기]
//        ⚠️ 마지막 페이지에 [다음]이 없어 안내를 끝내는 경로는 [다시 보지 않기] 뿐 = 설계서 원문대로.
//           별도 [닫기]/[건너뛰기]는 설계서에 없으므로 임의 추가하지 않음(plan RISK 4).
// ⚠️ 전체메뉴 > 이용안내 > 앱 이용안내(MUI-CM-05-M16, AppSrvcExplnIdx + AppSrvcExplnCoach)는 별개 화면이다.
//    같은 폴더를 쓰지만 서로 참조하지 않는다(사용자 확인 2026-08-20).
// 배너 = Figma 5M6FlyQBdHgeNrgIG2XhIN 스토어 그래픽 원본 PNG(900×1600) self-host — 노드 ID 는 BANNERS 참조.
//   설계서 slide22 에 삽입된 스크린샷 5장과 동일 소스. 폐쇄망 반입 대비 CDN 없이 번들 에셋으로 emit.
// 셸(AppLayout) 밖 독립 풀스크린 라우트(/app-guide) + 홈 첫 진입 오버레이(HomePage) 2경로에서 사용.
// 배경 = bg-krds-bg-primary-faint(--krds-d2b-blue-faint #ecf1fa) — 배너 PNG 자체 배경이
//   #ecf1fb(상단)~#e6effd(하단) 의 옅은 청색이라 이 토큰과 사실상 동일하다. contain 여백(배너 높이가
//   화면보다 짧을 때 아래에 남는 띠)이 배너 배경과 이어져 이음선이 보이지 않는다.
//   결정 근거는 docs/01-plan/features/cm-app-srvc-expln-m06.plan.md.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ButtonGroup, type ButtonGroupItem } from '@/ui/common/composites/ButtonGroup'
import guideBidPbanc from '@/assets/images/appSrvcExpln/guideBidPbanc.png'
import guideMscrn from '@/assets/images/appSrvcExpln/guideMscrn.png'
import guideMyPage from '@/assets/images/appSrvcExpln/guideMyPage.png'
import guidePrcmPlan from '@/assets/images/appSrvcExpln/guidePrcmPlan.png'
import guideSrchFilter from '@/assets/images/appSrvcExpln/guideSrchFilter.png'

/**
 * 앱 이용안내를 이미 봤는지(= [다시 보지 않기] 누름) 저장 키.
 * 설계서 "이후 기동 시 앱 이용안내 화면 미노출" → 세션이 아니라 localStorage 로 영속.
 * TODO(하이브리드 앱 탑재): 앱 재설치와 무관하게 유지해야 하면 네이티브 저장(브릿지)으로 교체.
 */
export const APP_SRVC_EXPLN_SEEN_KEY = 'appLaunchGuideSeen'

/** 안내 배너 5장 — 설계서 slide22 "하단 5개 페이지 노출" 순서 그대로. */
const BANNERS = [
  // Figma 10064:17560 — [AOS-구글플레이스토어] 1) 홈
  { id: 'mscrn', src: guideMscrn, alt: '빠르고 편리한 국방조달 업무의 시작 — 홈' },
  // Figma 10064:17506 — [AOS-구글플레이스토어] 2) 검색필터
  { id: 'srchFilter', src: guideSrchFilter, alt: '복잡한 조건을 쉽게 필터링할 수 있는 — 검색필터' },
  // Figma 10064:17524 — [AOS-구글플레이스토어] 3) 조달계획
  { id: 'prcmPlan', src: guidePrcmPlan, alt: '예정된 조달을 미리 확인할 수 있는 — 조달계획' },
  // Figma 10064:17542 — [AOS-구글플레이스토어] 4) 입찰공고 (상세)
  { id: 'bidPbanc', src: guideBidPbanc, alt: '놓치기 쉬운 세부 정보까지 투명하게 — 입찰공고' },
  // Figma 10064:17488 — [AOS-구글플레이스토어] 5) 마이페이지
  { id: 'myPage', src: guideMyPage, alt: '나의 입찰 및 업무 진행 현황을 한눈에 — 마이페이지' },
] as const

// onClose: 홈 첫 진입 오버레이로 열렸을 때 주입 — 있으면 닫기 콜백, 없으면(라우트 /app-guide 직접 진입) 홈으로.
export function AppSrvcExplnPage({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0-base 현재 페이지
  const total = BANNERS.length
  const isFirst = step === 0
  const isLast = step === total - 1

  // [다시 보지 않기] — 이후 기동 시 미노출 기록 후 안내 종료.
  const dismiss = () => {
    localStorage.setItem(APP_SRVC_EXPLN_SEEN_KEY, '1')
    if (onClose) onClose()
    else navigate('/') // 라우트 직접 진입 시 메인(홈)으로
  }

  // 버튼 영역 — 설계서 slide22 의 첫/중간/마지막 3상태.
  // 폭 비율은 slide22 주석 좌표에서 역산(다시보지않기 : 이전 : 다음 ≈ 2 : 1 : 1) — plan RISK 2.
  const buttons: ButtonGroupItem[] = isLast
    ? [
        { label: '이전', variant: 'secondary', onClick: () => setStep(step - 1) },
        { label: '다시 보지 않기', variant: 'primary', onClick: dismiss, itemClassName: 'flex-[2]' },
      ]
    : [
        {
          label: '다시 보지 않기',
          variant: 'secondary',
          onClick: dismiss,
          itemClassName: 'flex-[2]',
        },
        ...(isFirst
          ? []
          : [{ label: '이전', variant: 'secondary' as const, onClick: () => setStep(step - 1) }]),
        { label: '다음', variant: 'primary', onClick: () => setStep(step + 1) },
      ]

  const banner = BANNERS[step]

  return (
    <div
      className="flex h-dvh w-full flex-col bg-krds-bg-primary-faint"
      role="region"
      aria-label="앱 이용안내"
    >
      {/* 배너 — 전체폭 contain 상단 정렬(잘림 없음). 원본 900×1600(9:16). */}
      <div className="flex min-h-0 flex-1 justify-center">
        <img
          src={banner.src}
          alt={banner.alt}
          width={900}
          height={1600}
          className="size-full object-contain object-top"
        />
      </div>

      {/* 하단 버튼 영역 */}
      <div className="shrink-0 px-krds-8 pb-krds-9 pt-krds-7">
        <ButtonGroup layout="split" items={buttons} aria-label={`앱 이용안내 ${step + 1} / ${total}`} />
      </div>
    </div>
  )
}
AppSrvcExplnPage.displayName = 'AppSrvcExplnPage'
