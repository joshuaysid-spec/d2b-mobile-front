// 앱 이용안내 코치마크 오버레이 — MUI-CM-05-M16. 설계서 00.공통 v0.85 slide379~381.
// 인덱스(AppSrvcExplnIdx)에서 항목 선택 → 실제 화면(홈/마이페이지/전체메뉴/조달계획/입찰) 위에
//   딤 + CoachMark 말풍선 단계 안내(2026-07-31 사용자 확정: 실제 화면 위 오버레이 방식).
// ?appGuide=home|mypage|menu|op|bd 로 구동 — AppLayout 이 마운트. z-[60](전체메뉴 FullPopup z-50 위).
// 그만보기 → 메인 홈 이동(설계서 slide379 — 쿼리 제거로 오버레이 닫힘).
//   (상단 중앙 [앱 이용안내 닫기] 버튼은 2026-07-31 요청으로 삭제 — 닫기는 말풍선 그만보기가 담당.)
// 단계 문구는 설계서 원문(앞 순번 숫자는 제거하고 표시 — 단계 표기는 CoachMark 의 n/total 이 담당).
// 하이라이트: spotSelector(실제 DOM 측정) 우선, 없으면 spot(Figma 고정 좌표), 둘 다 없으면 전체 딤.
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  CoachMark,
  type CoachMarkArrow,
  type CoachMarkDirection,
} from '@/ui/common/composites/CoachMark'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import {
  APP_GUIDE_PARAM,
  type AppGuideTarget,
} from '@/ui/biz/cm/appSrvcExpln/AppSrvcExplnIdx'

interface CoachStep {
  text: string
  /** 말풍선 꼬리 가로 위치(안내 대상 방향). 기본 center. */
  arrow?: CoachMarkArrow
  /** 꼬리 방향 — top=위 요소 안내, bottom=아래 요소 안내. 기본 top. */
  direction?: CoachMarkDirection
  /** 말풍선 세로 위치 클래스 — Figma 실측(360×812) 또는 프리셋(POS). */
  pos: string
  /**
   * 하이라이트(스포트라이트) 영역 위치 클래스 — Figma coachmark layer 의 대상 요소 사본 실측.
   * 지정 시 딤에 이 영역만 구멍을 내 아래 실제 화면이 밝게 보인다(구멍 div + 9999px 그림자 딤).
   * 미지정이면 전체 딤.
   */
  spot?: string
  /**
   * 하이라이트 대상의 CSS 선택자 — 지정 시 실제 DOM 을 측정(getBoundingClientRect)해 구멍을
   * 정확히 요소에 맞춘다(고정 좌표 spot 보다 우선). 라운딩은 spotRadius 로.
   */
  spotSelector?: string
  /** spotSelector 측정 구멍의 라운딩 클래스(예: rounded-full). */
  spotRadius?: string
  /**
   * true 면 대상 요소가 아니라 **자식들의 합집합 rect** 를 하이라이트(4px 여유).
   * 뱃지 행처럼 컨테이너는 카드 폭 전체인데 내용물만 비춰야 할 때 사용.
   */
  spotChildren?: boolean
  /**
   * 측정 전 대상을 스크롤로 데려올 위치(scrollIntoView block). 기본 'nearest'(보이면 안 움직임).
   * 하단 요소(더보기/캘린더 등)는 'center'/'end' 로 지정해 말풍선 공간을 확보.
   */
  scrollInto?: ScrollLogicalPosition
  /**
   * 이 단계에서 아래 화면(main#app-scroll)이 가 있어야 할 scrollTop — Figma 프레임의 스크롤 상태
   * (contents area y 오프셋) 실측. 지정 시 단계 진입 때 스크롤을 맞춰 하이라이트가 실제 요소와 일치.
   */
  scrollTop?: number
}

// 위치 프리셋 — 전용 Figma 프레임이 없는 화면(마이페이지/메뉴/조달계획/입찰)용 근사값.
const POS = {
  top: 'top-[84px]',
  middle: 'top-1/2 -translate-y-1/2',
  bottom: 'bottom-[92px]',
}

// 화면별 단계 — 설계서 slide379(메인홈·마이페이지·메뉴 도입)·380(마이페이지·메뉴)·381(조달계획·입찰) 문구 그대로.
const STEPS: Record<AppGuideTarget, CoachStep[]> = {
  // 홈 — Figma 10066:18769·18986·19204·19461. 하이라이트 = 헤더 알림+전체메뉴/검색바/주요서비스
  //   그리드/하단 탭바 — 전부 실제 DOM 측정(spotSelector)으로 정합(뷰포트 크기 무관).
  home: [
    {
      text: '전체 메뉴와 알림을 확인할 수 있어요.',
      pos: 'top-[77px]',
      arrow: 'right',
      spotSelector: '[data-coach="header-utils"]',
      spotRadius: 'rounded-krds-8',
      scrollTop: 0,
    },
    {
      text: '공고를 바로 검색할 수 있어요.',
      pos: 'top-[270px]',
      spotSelector: '[data-coach="home-search"]',
      spotRadius: 'rounded-full',
      scrollTop: 0,
    },
    {
      text: '메인화면에서 주요 서비스에 쉽게 이동할 수 있어요',
      pos: 'top-[447px]',
      spotSelector: '[data-coach="home-services"]',
      spotRadius: 'rounded-krds-xl',
      scrollInto: 'center', // 그리드를 중앙으로(Figma 19204 의 230px 스크롤 상태 재현)
    },
    {
      text: '홈 이동, 통합검색, 챗봇, 마이페이지를 쓰기 쉽게 꺼내두었어요.',
      pos: 'bottom-[85px]',
      direction: 'bottom',
      spotSelector: '[data-coach="bottom-nav"]', // fixed 요소 — 스크롤 무관, 항상 하단
    },
  ],
  // 마이페이지 — Figma 10066:19676·20086·20494·21019 실측(하이라이트: 진행업무현황 행/업무이력 행/
  //   관심입찰공고 행/업무 캘린더. 말풍선은 모두 대상 아래·꼬리 위).
  mypage: [
    {
      text: '진행중인 업무 현황을 확인할 수 있어요.',
      pos: POS.top,
      spotSelector: '[data-coach="mypage-prgrs"]',
    },
    {
      text: '진행했던 업무 이력을 확인할 수 있어요.',
      pos: POS.middle,
      spotSelector: '[data-coach="mypage-hstry"]',
    },
    {
      text: '입찰공고에 별 표시한 공고를 모아볼 수 있어요.',
      pos: POS.middle,
      spotSelector: '[data-coach="mypage-intrst"]',
    },
    {
      text: '업무 캘린더를 통해 공고 일정과 개인 일정을 더 쉽게 확인할 수 있어요.',
      pos: POS.bottom,
      spotSelector: '[data-coach="mypage-calendar"]', // 월 캘린더만(헤더/일정 카드 제외 — Figma 21019)
      spotRadius: 'rounded-krds-xl',
      scrollInto: 'start', // 캘린더를 상단으로(Figma 21019) — 말풍선이 그 아래 들어갈 공간 확보
    },
  ],
  // 전체메뉴 — Figma 10066:21420·21523·21616 실측(하이라이트: 퀵아이콘 행 y144 / 메뉴명 검색 y226 /
  //   첫 1depth 타이틀 y306 · 말풍선은 항상 대상 아래 8px → 실제 DOM 측정(spotSelector)으로 정합).
  menu: [
    {
      text: '사용자들이 자주 사용하는 메뉴가 있어요.',
      pos: POS.top,
      spotSelector: '[data-coach="menu-quick"]',
      spotRadius: 'rounded-krds-8',
    },
    {
      text: '메뉴명을 검색해서 찾을 수 있어요.',
      pos: POS.top,
      spotSelector: '[data-coach="menu-search"]',
      spotRadius: 'rounded-krds-8',
    },
    {
      text: '각각의 메뉴는 열고 닫을 수 있어요.',
      pos: POS.middle,
      // 첫 번째 1depth 카드의 토글 행(버튼) — MenuAccordion 첫 버튼.
      spotSelector: '[data-coach="menu-accordion"] button',
      spotRadius: 'rounded-krds-8',
    },
  ],
  // 조달계획 통합목록 — Figma 10066:17773·17899·18025·18147·18277 실측(하이라이트: 업무도움/유형 탭/
  //   검색필터 버튼/첫 카드/더보기. 1~3=대상 아래·꼬리 위, 4~5=대상 위·꼬리 아래).
  op: [
    {
      text: '업무에 참고할 수 있는 도움말이 있어요.',
      pos: POS.top,
      spotSelector: '[data-coach="op-help"]',
    },
    {
      text: '조달계획 유형에 따라 목록이 바뀌어요.',
      pos: POS.top,
      spotSelector: '[data-coach="op-tabs"]',
    },
    {
      text: '검색필터로 상세 검색을 할 수 있어요.',
      pos: POS.top,
      arrow: 'right',
      spotSelector: '[data-coach="op-search"] [aria-label="상세 검색 필터"]',
      spotRadius: 'rounded-krds-8',
    },
    {
      text: '공고들이 카드형식으로 표시돼요.',
      pos: POS.middle,
      direction: 'bottom',
      arrow: 'left',
      spotSelector: '[data-coach="op-list"] > div > *:first-child', // CardList 첫 카드
      spotRadius: 'rounded-krds-8',
      scrollInto: 'center',
    },
    {
      text: '더보기 버튼으로 공고를 추가로 확인할 수 있어요.',
      pos: POS.bottom,
      direction: 'bottom',
      spotSelector: '[data-coach="op-more"] button', // 더보기 버튼만(패딩 래퍼 제외 — Figma 18277)
      spotRadius: 'rounded-krds-8',
      scrollInto: 'center', // 화면 하단 끝(end)이면 버튼이 가려 보임 — 중앙으로(2026-08-03 요청)
    },
  ],
  // 입찰공고 — Figma 10066:18399·18525·18646 실측(하이라이트: 첫 카드 전체/카드 상단 뱃지/카드 하단
  //   정보행. 1·3=대상 위·꼬리 아래(좌측), 2=대상 아래·꼬리 위(좌측)).
  bd: [
    {
      // 첫 카드를 화면 중앙으로(2026-08-03 요청) — 말풍선이 카드 위, 꼬리 아래·가운데.
      text: '공고들이 카드형식으로 표시돼요. 카드를 클릭하면 상세 내용을 볼 수 있어요.',
      pos: POS.middle,
      direction: 'bottom',
      spotSelector: '[data-coach="bd-list"] > div > *:first-child', // CardList 첫 카드
      spotRadius: 'rounded-krds-8',
      scrollInto: 'center',
    },
    {
      // 뱃지들만 하이라이트(행 전체 X — 2026-08-03 요청) — 말풍선이 뱃지 아래, 꼬리 위·좌측.
      text: '카드 상단에 주요 조건들이 제공돼요.',
      pos: POS.top,
      arrow: 'left',
      spotSelector: '[data-coach="bd-list"] > div > *:first-child > div:first-child', // 첫 카드 뱃지 행
      spotChildren: true,
      spotRadius: 'rounded-krds-8',
    },
    {
      // 정보행을 화면 중앙으로(2026-08-03 요청) — 말풍선이 정보행 위, 꼬리 아래·좌측.
      text: '공고의 주요 정보들이 하단에 표시돼요.',
      pos: POS.middle,
      direction: 'bottom',
      arrow: 'left',
      spotSelector: '[data-coach="bd-list"] > div > *:first-child > div:last-child', // 첫 카드 정보행
      spotRadius: 'rounded-krds-8',
      scrollInto: 'center',
    },
  ],
}

const TARGETS = new Set<string>(['home', 'mypage', 'menu', 'op', 'bd'])

export function AppSrvcExplnCoach() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const raw = searchParams.get(APP_GUIDE_PARAM)
  const target = raw && TARGETS.has(raw) ? (raw as AppGuideTarget) : null

  const [step, setStep] = useState(1)
  // 대상 화면이 바뀌면 1단계부터.
  useEffect(() => {
    setStep(1)
  }, [target])

  // spotSelector 측정 결과 — 실제 요소의 뷰포트 rect(오버레이가 fixed 라 그대로 사용 가능).
  const [spotRect, setSpotRect] = useState<DOMRect | null>(null)

  // 단계별 스크롤 동기화 + 하이라이트 대상 측정.
  // scrollTop(Figma 프레임의 스크롤 상태)으로 아래 화면을 맞춘 뒤, spotSelector 가 있으면
  // 실제 DOM rect 를 측정해 구멍을 요소에 정확히 맞춘다(리사이즈 시 재측정).
  useEffect(() => {
    if (!target) return
    const steps = STEPS[target]
    const cur = steps[Math.min(step, steps.length) - 1]
    if (cur?.scrollTop != null) document.getElementById('app-scroll')?.scrollTo({ top: cur.scrollTop })
    // spotChildren: 컨테이너 대신 자식들의 합집합 rect(+4px 여유) — 뱃지처럼 내용물만 비출 때.
    const rectOf = (el: Element) => {
      if (!cur?.spotChildren || el.children.length === 0) return el.getBoundingClientRect()
      let top = Infinity
      let left = Infinity
      let right = -Infinity
      let bottom = -Infinity
      for (const kid of Array.from(el.children)) {
        const r = kid.getBoundingClientRect()
        top = Math.min(top, r.top)
        left = Math.min(left, r.left)
        right = Math.max(right, r.right)
        bottom = Math.max(bottom, r.bottom)
      }
      return new DOMRect(left - 4, top - 4, right - left + 8, bottom - top + 8)
    }
    const measure = () => {
      const el = cur?.spotSelector ? document.querySelector(cur.spotSelector) : null
      // 대상이 화면 밖이면 스크롤로 데려온 뒤 측정 — 기본 nearest(보이면 안 움직임).
      el?.scrollIntoView({ block: cur?.scrollInto ?? 'nearest' })
      setSpotRect(el ? rectOf(el) : null)
      return el != null
    }
    measure()
    // 대상 화면이 lazy 청크/오버레이 애니메이션으로 늦게 마운트되는 경우 대비 — 찾을 때까지
    // 200ms 간격 폴링(최대 3초). 찾은 뒤 1회 더 측정(레이아웃 안정화)하고 중단.
    let ticks = 0
    let settled = false
    const poll = window.setInterval(() => {
      ticks += 1
      const found = measure()
      if ((found && settled) || ticks >= 15) window.clearInterval(poll)
      settled = found
    }, 200)
    window.addEventListener('resize', measure)
    return () => {
      window.clearInterval(poll)
      window.removeEventListener('resize', measure)
    }
  }, [target, step])

  if (!target) return null
  const steps = STEPS[target]
  const cur = steps[Math.min(step, steps.length) - 1]

  // 닫기/그만보기 — 메인 홈 이동(쿼리 제거 = 오버레이 닫힘, 설계서 동작).
  const goHome = () => navigate(ROUTES.HOME)

  return (
    <div
      // pointer-events-auto: 전체메뉴(FullPopup, Radix modal)가 열리면 body 가 pointer-events:none 이
      //   되어 다이얼로그 밖(이 오버레이)의 버튼 클릭이 막힘 → 명시적으로 복원.
      // data-app-guide-overlay: FullPopup 이 이 오버레이 클릭을 outside-dismiss 로 처리하지 않게 하는 마커.
      data-app-guide-overlay
      className="pointer-events-auto fixed inset-0 z-[60] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="앱 이용안내"
    >
      {/* 딤 — 안내 중 아래 화면 조작 차단. 하이라이트가 있으면 그 영역만 구멍을 내 아래 실제
          화면이 밝게 보이게 한다(투명 구멍 div 주변을 9999px 그림자로 딤 처리).
          spotSelector(실측 rect) > spot(고정 좌표) > 전체 딤. */}
      {cur.spotSelector && spotRect ? (
        <div
          className={cn('absolute shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]', cur.spotRadius)}
          style={{
            top: spotRect.top,
            left: spotRect.left,
            width: spotRect.width,
            height: spotRect.height,
          }}
          aria-hidden
        />
      ) : cur.spot ? (
        <div
          className={cn('absolute shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]', cur.spot)}
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 bg-black/50" aria-hidden />
      )}

      {/* 단계 말풍선 — 하이라이트를 실측(spotRect)한 단계는 대상에서 8px 떨어져 앵커링(Figma 간격),
          그 외에는 고정 좌표(cur.pos). 말풍선 높이(~240px)만큼은 항상 화면 안에 남도록 클램프(가림 방지). */}
      <div
        className={cn('absolute inset-x-4', !(cur.spotSelector && spotRect) && cur.pos)}
        style={
          cur.spotSelector && spotRect
            ? cur.direction === 'bottom'
              ? {
                  bottom: Math.min(
                    window.innerHeight - spotRect.top + 8,
                    window.innerHeight - 240,
                  ),
                }
              : { top: Math.min(spotRect.bottom + 8, window.innerHeight - 240) }
            : undefined
        }
      >
        <CoachMark
          total={steps.length}
          current={step}
          arrow={cur.arrow}
          direction={cur.direction}
          onPrev={setStep}
          // 마지막 단계의 다음 버튼은 [마치기] — 클릭 시 안내 종료(메인 홈). Figma 10066:21616.
          nextLabel={step === steps.length ? '마치기' : '다음으로'}
          onNext={(next) => {
            if (step === steps.length) goHome()
            else setStep(next)
          }}
          onClose={goHome}
        >
          {cur.text}
        </CoachMark>
      </div>
    </div>
  )
}
AppSrvcExplnCoach.displayName = 'AppSrvcExplnCoach'
