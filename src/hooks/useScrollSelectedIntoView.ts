import { useEffect, type RefObject } from 'react'

// 가로 스크롤(swipeable) 선택 그룹에서 "선택 항목이 화면 밖(특히 우측)에 숨는" 상황을 푸는 범용 훅.
//
// 기준(원칙): **첫(가장 왼쪽) 선택 항목**을 viewport 안으로 스크롤한다.
//   - 첫 선택 항목이 이미 보이면 → 움직이지 않음(좌측 유지). → '전체 선택' 등 좌측 포함 시 왼쪽 그대로.
//   - 첫 선택 항목이 우측으로 넘어가 안 보이면 → nearest(최소 이동)로 우측 스크롤해 보이게. → '맨 우측만 선택' 시 우측.
//   - 단, 첫 선택 항목이 '마지막 칩'이면 → 끝까지 스크롤(trailing 여백까지 노출)해 가장자리에 붙어 잘린 듯 보이는 답답함 방지.
// (마지막 선택이 아니라 첫 선택 기준 — 전체 선택이면 첫 항목=좌측이라 왼쪽 유지가 자연스럽다.)
//
// caller 는 스크롤 컨테이너 ref 와 "스크롤러 직속 자식 중 첫 선택 항목의 인덱스"만 넘긴다.
// (선택값→DOM 매핑을 인덱스로 처리 — data-* 전달 여부 같은 컴포넌트 내부 사정에 의존하지 않음.)
//
// 사용:
//   useScrollSelectedIntoView(scrollRef, firstSelectedChildIndex, { enabled: useSwiper })
export interface ScrollSelectedIntoViewOptions {
  /** false 면 동작 안 함(예: swipeable=false). 기본 true. */
  enabled?: boolean
  /** 스크롤 애니메이션. 초기 진입은 'auto'(즉시) 권장. 기본 'auto'. */
  behavior?: ScrollBehavior
}

export function useScrollSelectedIntoView(
  scrollerRef: RefObject<HTMLElement | null>,
  /** 스크롤러 직속 자식 중 '첫 선택 항목'의 인덱스. 선택 없음/대상 없음이면 undefined. */
  targetIndex: number | undefined,
  options: ScrollSelectedIntoViewOptions = {},
) {
  const { enabled = true, behavior = 'auto' } = options

  useEffect(() => {
    if (!enabled || targetIndex == null || targetIndex < 0) return

    const run = (): boolean => {
      const scroller = scrollerRef.current
      // clientWidth 0 = 아직 화면에 안 그려짐(바텀시트/아코디언 미오픈 등) → '아직 준비 안 됨'.
      if (!scroller || scroller.clientWidth === 0) return false
      const el = scroller.children[targetIndex] as HTMLElement | undefined
      if (!el) return true // 준비됐으나 대상 없음 — 관찰 종료

      let delta = 0
      if (targetIndex >= scroller.children.length - 1) {
        // 마지막 항목: 끝까지 스크롤해 컨테이너 trailing 여백(padding)까지 노출.
        // nearest 로 우측 끝에 딱 붙이면 남은 padding 만큼 잘린 듯 답답해 보이고 우측 화살표도 남는다.
        delta = scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft
      } else {
        // nearest: 보이게 만드는 최소 이동량. 우측으로 넘쳤으면 우측으로, 좌측이면 좌측으로.
        const cRect = scroller.getBoundingClientRect()
        const eRect = el.getBoundingClientRect()
        if (eRect.right > cRect.right) delta = eRect.right - cRect.right
        else if (eRect.left < cRect.left) delta = eRect.left - cRect.left
      }
      if (Math.abs(delta) > 1) scroller.scrollBy({ left: delta, behavior })
      return true
    }

    if (run()) return
    // 컨테이너가 아직 숨김(width 0)이면 보이는 순간 1회만 실행하고 관찰 해제.
    const scroller = scrollerRef.current
    if (!scroller) return
    const ro = new ResizeObserver(() => {
      if (run()) ro.disconnect()
    })
    ro.observe(scroller)
    return () => ro.disconnect()
  }, [scrollerRef, targetIndex, enabled, behavior])
}
