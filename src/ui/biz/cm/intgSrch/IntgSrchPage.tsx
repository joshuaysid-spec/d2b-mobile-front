// MUI-MS-01-M09 통합검색(IntgSrch). 설계서 00공통 slide24~25 / Figma 9304-77195(최근검색어) · 9304-77324(없음).
// 2026-10-02 페이지 전환(사용자 결정, 설계서와 다름): 구 AppLayout FullPopup 오버레이 → /search 라우트.
//   BottomNav 통합검색 탭 진입, sub 헤더(뒤로가기) + 우측 '초기화'(HEADER_ACTION_SLOT_ID portal).
//   자주 찾는 서비스·자동완성(토글 포함)·관련 서비스는 삭제 — 최근 검색어만 남김.
// 구성: 히어로+검색 행(sticky) → 검색 실행 전=최근 검색어 / 실행 후=결과목록(MUI-MS-01-M10, IntgSrch_Rslt).
// 초기화 규칙: 인풋 x = 입력 텍스트만 비움(결과 유지) · 헤더 초기화 = 검색어+실행결과(정렬·필터·더보기 포함)
//   전부 비움. 최근 검색어는 보관 데이터라 초기화 대상 아님(전체삭제 별도).
// 상태 보존: 상세 → 뒤로(POP) 복귀 시 sessionStorage(useSessionState)에서 검색 상태를 되살린다
//   (스크롤은 AppLayout 이 같은 방식으로 복원). 새 진입(PUSH)은 항상 빈 상태.
// 데이터는 파일 내 목업 상수, 핸들러는 // 추후 API 주석으로 경계 표시. 실제 검색은 cmService.selectSearchAll.
//
// ═══ 검색 솔루션 연동 업체 안내 (2026-10-02) ═══════════════════════════════════════════════════
//  통합검색 API 배선은 연동 업체가 한다. 이 페이지에서 갈아끼울 지점:
//   ① handleSearch — 실행 검색어(state.executed)를 확정하는 곳. 검색 호출 자체는 결과목록(IntgSrch_Rslt)이
//      keyword 를 받아 수행하도록 두거나, 여기서 호출해 결과를 내려보내도 된다(현재 결과목록은 파일 내 목업).
//   ② RECENT_SEARCHES_SEED / handleRemoveRecent / handleClearRecent — 최근 검색어 목업. 서비스 함수는
//      src/services/cbs/cm.ts 의 selectRecentSearches / removeRecentSearch / clearRecentSearches (URL 임시).
//   ③ 하이라이트·HTML 평문화·첨부파일 영역은 IntgSrch_Rslt.tsx 상단 안내 참고.
//  유지할 것: 헤더 '초기화' portal(HEADER_ACTION_SLOT_ID) · 인풋 x 는 텍스트만 · 뒤로가기 복원(useSessionState).
// ═══════════════════════════════════════════════════════════════════════════════════════════
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigationType } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { Empty } from '@/ui/common/feedback/Empty'
import { HEADER_ACTION_SLOT_ID } from '@/ui/common/composites/Header'
import { TagList } from '@/ui/common/composites/TagList'
import { IntgSrch_Rslt } from '@/ui/biz/cm/intgSrch/IntgSrch_Rslt'
import { useSessionState } from '@/hooks/useSessionState'
import type { MockRecentSearch } from '@/types/mock/cm'

// ─── 목업 데이터 ──────────────────────────────────────────────────────────────
// 최근 검색어(최대 10) — 추후 API: cmService.selectRecentSearches().
const RECENT_SEARCHES_SEED: MockRecentSearch[] = [
  { id: 'r1', keyword: '방위사업청 물품' },
  { id: 'r2', keyword: '국방부' },
  { id: 'r3', keyword: '조달' },
  { id: 'r4', keyword: '민원서류' },
  { id: 'r5', keyword: '인증서 가져오기' },
]

// 뒤로가기 복원 대상 상태(sessionStorage 한 블록). executed=실행된 검색어(null=실행 전).
interface IntgSrchState {
  keyword: string
  executed: string | null
  recent: MockRecentSearch[]
}
const INITIAL_STATE: IntgSrchState = { keyword: '', executed: null, recent: RECENT_SEARCHES_SEED }
const STATE_KEY = 'intgSrch:state'

function IntgSrchPage() {
  // 뒤로(POP) 진입만 복원 — useSessionState 가 마운트 시 1회만 읽으므로 이후 값 변화는 무관.
  const restore = useNavigationType() === 'POP'
  const [state, setState] = useSessionState<IntgSrchState>(STATE_KEY, INITIAL_STATE, restore)
  const patch = (p: Partial<IntgSrchState>) => setState((prev) => ({ ...prev, ...p }))
  // 결과목록 하위 상태(정렬·필터·더보기)도 POP 복원. 새 검색/초기화 뒤 마운트되는 결과목록은 복원 안 함.
  const [restoreRslt, setRestoreRslt] = useState(restore)

  // 진입 시 검색 영역 포커스(설계서 slide24). 뒤로가기(POP) 복귀엔 키보드가 올라오지 않게 생략.
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!restore) inputRef.current?.focus()
    // 마운트 1회만 — 이후 executed 변화에 포커스를 다시 주지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 헤더 우측 '초기화' portal 타깃 — Header(AppLayout)가 먼저 마운트되므로 마운트 후 1회 조회.
  const [actionSlot, setActionSlot] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setActionSlot(document.getElementById(HEADER_ACTION_SLOT_ID))
  }, [])

  const handleSearch = () => {
    const q = state.keyword.trim()
    if (!q) return
    setRestoreRslt(false)
    patch({ executed: q })
    // 추후 API: cmService.selectSearchAll(q) → 카테고리별 결과목록(M10). 최근 검색어 등록도 응답 기준.
  }
  // 헤더 초기화 — 검색어 + 실행결과 전부(IntgSrch_Rslt 가 언마운트되며 정렬·필터·더보기도 함께 리셋).
  const handleReset = () => {
    setRestoreRslt(false)
    patch({ keyword: '', executed: null })
    inputRef.current?.focus()
  }
  const handleRemoveRecent = (id: string | number) => {
    patch({ recent: state.recent.filter((r) => r.id !== id) })
    // 추후 API: cmService.removeRecentSearch(id)
  }
  const handleClearRecent = () => {
    patch({ recent: [] })
    // 추후 API: cmService.clearRecentSearches()
  }

  return (
    <div className="flex w-full flex-col">
      {actionSlot &&
        createPortal(
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-[44px] shrink-0 items-center rounded-krds-8 px-krds-5 text-[15px] font-bold text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
          >
            초기화
          </button>,
          actionSlot,
        )}

      {/* 히어로 + 검색 행 — 상단 고정(main#app-scroll 내부 sticky). Figma bg-primary-faint. */}
      <div className="sticky top-0 z-10 flex flex-col gap-krds-7 bg-krds-bg-primary-faint px-krds-8 pt-krds-7 pb-krds-8">
        <p className="text-[20px] font-bold leading-snug text-krds-text-ink">
          국방전자조달시스템,
          <br />
          이제 한 곳에서 찾아보세요.
        </p>
        <div className="flex items-center gap-krds-5">
          <InputBox
            ref={inputRef}
            className="flex-1"
            value={state.keyword}
            onChange={(e) => patch({ keyword: e.target.value })}
            onClear={() => patch({ keyword: '' })} // 인풋 x — 텍스트만(결과 유지)
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
            placeholder="검색할 내용을 입력하세요."
            aria-label="통합검색"
            enterKeyHint="search"
          />
          <Button variant="secondary" size="icon" aria-label="검색" onClick={handleSearch}>
            <Icon name="Search" size={20} aria-hidden />
          </Button>
        </div>
      </div>

      {/* 본문 — 검색 실행 후 결과목록(M10, full-bleed), 실행 전 최근 검색어.
          key=검색어: 검색어가 바뀌면 결과목록을 새로 마운트해 하위 상태를 리셋. */}
      {state.executed !== null ? (
        <IntgSrch_Rslt key={state.executed} keyword={state.executed} restore={restoreRslt} />
      ) : (
        <section className="flex flex-col gap-krds-6 px-krds-8 py-krds-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold leading-normal text-krds-text-ink">최근 검색어</h2>
            {state.recent.length > 0 && (
              <button
                type="button"
                onClick={handleClearRecent}
                className="inline-flex min-h-[44px] items-center text-[15px] leading-normal text-krds-text-muted underline underline-offset-2 focus-visible:outline-hidden active:opacity-70"
              >
                전체삭제
              </button>
            )}
          </div>
          {state.recent.length > 0 ? (
            <TagList
              items={state.recent.map((r) => ({ id: r.id, label: r.keyword }))}
              onRemove={handleRemoveRecent}
            />
          ) : (
            <Empty className="py-krds-8">최근 검색어가 없습니다.</Empty>
          )}
        </section>
      )}
    </div>
  )
}
IntgSrchPage.displayName = 'IntgSrchPage'

export { IntgSrchPage }
