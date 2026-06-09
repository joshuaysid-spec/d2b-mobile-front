import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

// 스크롤 시 상단 헤더(요약 등)를 축소(collapse)하고 sticky 로 고정하기 위한 동작 훅.
//
// 사용처가 마크업(요약+스텝+탭 sticky 블록)은 직접 소유하고, "갈라지면 안 되는" 동작만 여기서 가져다 쓴다:
//   - 실제로 스크롤되는 컨테이너(main#app-scroll 또는 window) 탐지 → AppLayout 은 main 이 내부 스크롤.
//   - 스크롤 위치 임계값(히스테리시스)으로 collapsed 토글.
//   - scroll-anchoring 진동 차단(rootRef 에 overflow-anchor:none 자동 적용).
//   - 맨위로(scrollToTop).
//
// 사용:
//   const { collapsed, rootRef, scrollToTop } = useCollapsibleHeader()
//   return (
//     <div ref={rootRef} className="flex w-full flex-col">
//       <div className="sticky top-0 z-20 bg-white">
//         <SummaryInfo collapsed={collapsed} ... />  ...스텝/탭...
//       </div>
//       {본문}
//       <FloatingActionButton onTop={scrollToTop} ... />
//     </div>
//   )
export interface UseCollapsibleHeaderOptions {
  /** 펼침→접힘 임계(px). 기본 72. */
  collapseAt?: number
  /** 접힘→펼침 임계(px). 기본 16. (히스테리시스 — 경계 떨림 방지) */
  expandAt?: number
}

export interface UseCollapsibleHeaderReturn {
  /** 스크롤되어 축소 상태인지. <SummaryInfo collapsed={...}> 등에 전달. */
  collapsed: boolean
  /** 루트 요소에 부착 — 스크롤 컨테이너 탐지 기준점 + overflow-anchor 적용 대상. */
  rootRef: RefObject<HTMLDivElement>
  /** 스크롤 컨테이너를 최상단으로 + 헤더 펼침(맨위로 FAB). */
  scrollToTop: () => void
  /**
   * 본문을 맨 위로 보내되 **현재 접힘(collapsed)이면 접힘을 유지**한다(탭 전환용).
   * top=0 은 보통 펼침으로 판정되지만, 접힘 상태였다면 사용자가 다시 collapseAt 만큼
   * 내릴 때까지 접힘을 핀(pin) 고정 → 탭 바꿔도 헤더가 도로 펼쳐지지 않는다.
   */
  goToContentTop: () => void
}

export function useCollapsibleHeader(
  options: UseCollapsibleHeaderOptions = {},
): UseCollapsibleHeaderReturn {
  const { collapseAt = 80, expandAt = 16 } = options
  const [collapsed, setCollapsed] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLElement | Window | null>(null)
  // 콜백에서 최신 collapsed 를 읽기 위한 미러 ref.
  const collapsedRef = useRef(false)
  // 접힘 핀 — true 동안은 top 이 작아도(=top 으로 올라가도) 펼치지 않고 접힘 유지.
  const pinnedRef = useRef(false)

  useEffect(() => {
    collapsedRef.current = collapsed
  }, [collapsed])

  useEffect(() => {
    // 축소 시 높이 변화로 브라우저가 스크롤 위치를 보정(scroll anchoring)하면서 임계값을 다시
    // 넘나들어 collapse 가 진동(겹침·깜빡임)하던 문제 차단 — 루트에서 anchoring 끔.
    rootRef.current?.style.setProperty('overflow-anchor', 'none')

    // 실제로 스크롤되는 조상 탐지 — overflow-y auto/scroll 이고 내용이 넘치는(scrollHeight>clientHeight)
    // 요소. 없으면 window(AppLayout 구조에 따라 둘 중 하나가 스크롤됨).
    let node: HTMLElement | null | undefined = rootRef.current?.parentElement
    while (node) {
      const oy = getComputedStyle(node).overflowY
      if ((oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight) break
      node = node.parentElement
    }
    const scroller: HTMLElement | Window = node ?? window
    scrollerRef.current = scroller
    const getTop = () =>
      scroller === window ? window.scrollY : (scroller as HTMLElement).scrollTop
    const onScroll = () => {
      const top = getTop()
      // 접힘 핀 동안: 사용자가 collapseAt 넘게 내리면 핀 해제(이후 정상 로직), 그 전까진 접힘 유지.
      // → 작은 스크롤로 펼침 깜빡임 없이, 탭 전환 직후 top=0 에서도 접힘이 풀리지 않는다.
      if (pinnedRef.current) {
        if (top > collapseAt) pinnedRef.current = false
        setCollapsed(true)
        return
      }
      setCollapsed((c) => (c ? top > expandAt : top > collapseAt))
    }
    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [collapseAt, expandAt])

  const scrollToTop = useCallback(() => {
    // 맨위로 FAB — 펼침 의도이므로 핀 해제.
    pinnedRef.current = false
    scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goToContentTop = useCallback(() => {
    // 접힘 상태였으면 접힘 유지(핀), 펼침이었으면 그대로 펼침 유지.
    if (collapsedRef.current) pinnedRef.current = true
    scrollerRef.current?.scrollTo({ top: 0 })
  }, [])

  return { collapsed, rootRef, scrollToTop, goToContentTop }
}
