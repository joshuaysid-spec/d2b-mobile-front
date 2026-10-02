import { useCallback, useEffect, useRef, useState, type RefCallback } from 'react'

// 스크롤 시 상단 헤더(요약 등)를 축소(collapse)하고 sticky 로 고정하기 위한 동작 훅.
//
// 사용처가 마크업(요약+스텝+탭 sticky 블록)은 직접 소유하고, "갈라지면 안 되는" 동작만 여기서 가져다 쓴다:
//   - 실제로 스크롤되는 컨테이너(main#app-scroll 또는 window) 탐지 → AppLayout 은 main 이 내부 스크롤.
//   - 스크롤 위치 임계값(히스테리시스)으로 collapsed 토글.
//   - scroll-anchoring 진동 차단(rootRef 에 overflow-anchor:none 자동 적용).
//   - 맨위로(scrollToTop).
//
// 2026-09-22 수정 — API 연동 후 상단 고정/접힘이 안 되던 원인 2가지:
//   ① 스크롤 컨테이너를 "지금 내용이 넘치는 조상"으로 찾았다. 목업은 첫 렌더부터 넘쳐 main#app-scroll 을 찾지만,
//      API 는 첫 렌더가 로딩/빈 화면이라 넘치는 조상이 없어 window 에 붙었고, 실제 스크롤은 main 에서 나므로
//      collapsed 가 영영 안 바뀌었다(데이터가 와도 effect 는 재실행 안 됨). → 프로젝트 규칙대로 main#app-scroll 을
//      id 로 바로 잡고(데이터 전 빈 화면이어도 존재), 셸 밖에서만 window.
//   ② `if (!detail) return <PageLoading/>` 처럼 데이터 도착 전 early return 하면 첫 effect 때 rootRef 가 null 이라
//      overflow-anchor 가 적용되지 않았다. → rootRef 를 콜백 ref 로 바꿔 루트가 나중에 붙어도 그때 적용.
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
  /** 루트 요소에 부착(콜백 ref) — 붙는 시점에 overflow-anchor:none 적용(데이터 도착 후 늦게 붙어도 동작). */
  rootRef: RefCallback<HTMLDivElement>
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
  const scrollerRef = useRef<HTMLElement | Window | null>(null)
  // 루트 콜백 ref — 축소 시 높이 변화로 브라우저가 스크롤 위치를 보정(scroll anchoring)하면서 임계값을
  //   다시 넘나들어 collapse 가 진동하던 문제 차단. 루트가 언제 붙든(early return 후 포함) 그때 적용된다.
  // 루트 요소·ResizeObserver 미러 — 루트가 늦게 붙어도(early return 후) 그때 관찰을 시작하기 위해 ref 로 공유.
  const rootElRef = useRef<HTMLDivElement | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const rootRef = useCallback<RefCallback<HTMLDivElement>>((el) => {
    rootElRef.current = el
    if (!el) return
    el.style.setProperty('overflow-anchor', 'none')
    resizeObserverRef.current?.observe(el)
  }, [])
  // 콜백에서 최신 collapsed 를 읽기 위한 미러 ref.
  const collapsedRef = useRef(false)
  // 접힘 핀 — true 동안은 top 이 작아도(=top 으로 올라가도) 펼치지 않고 접힘 유지.
  const pinnedRef = useRef(false)

  useEffect(() => {
    collapsedRef.current = collapsed
  }, [collapsed])

  useEffect(() => {
    // 스크롤 컨테이너 — 프로젝트 규칙상 main#app-scroll(AppLayout 내부 스크롤)이 스크롤 주체.
    //   id 로 바로 잡는다(데이터 도착 전 빈 화면이어도 존재). 셸 밖에서만 window.
    //   ("지금 내용이 넘치는 조상" 탐색은 폐기 — 넘침은 데이터 도착 후에야 생겨 API 화면에서 window 로 빠졌다.)
    const scroller: HTMLElement | Window = document.getElementById('app-scroll') ?? window
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
    // 페이지 루트(rootRef) 높이 변화(API 응답 도착·탭 전환·더보기 등) 때도 판정을 한 번 더 돌린다 — 내용이 줄어
    //   브라우저가 scrollTop 을 당겨 올릴 때 scroll 이벤트를 안 주는 WebView 가 있어, 접힘/펼침이 실제 위치와
    //   어긋나는 것을 막는다. 판정식은 스크롤 위치만 보므로 높이 자체를 계산하진 않는다(높이 변화 = 재판정 트리거).
    //   루트가 아직 없으면(데이터 전 early return) rootRef 콜백이 붙는 시점에 observe 한다.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onScroll) : null
    resizeObserverRef.current = ro
    if (ro && rootElRef.current) ro.observe(rootElRef.current)
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      ro?.disconnect()
      resizeObserverRef.current = null
    }
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
