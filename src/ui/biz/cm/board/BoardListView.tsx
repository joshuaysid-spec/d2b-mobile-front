// 고객센터 게시판 목록 공용 뷰 — 공지사항(일반/방위사업청/수요부대별) · 자료실(일반/수요부대별/계약관련서식)
// · 시스템개선안내(MUI-CM-04-M01·M21·M23·M25·M27·M29·M31)가 구조 동일(검색조건+카드 목록)이라
// 이 뷰 하나로 조립하고, 각 화면(설계서 영문 화면 ID)은 config 만 주입하는 얇은 페이지로 둔다.
// (CLAUDE.md "유사 화면 = 로직 공유". 데이터/타입/라벨만 다르므로 제네릭 <T> config 로 흡수)
//
// 구성(위→아래): 검색영역(SearchCondition: 대상칩 제목/내용 + 필터버튼 / 입력 / 검색)
//   → 목록헤더(ListSectionHeader 총건수·표시개수) → 카드 리스트(CardList) → 더보기 → 맨위로 FAB
//   → 검색필터 풀팝업(SearchFilter — footer 버튼 asymmetric = 첫 100px + 마지막 flex-1).
// 데이터/검색/페이징 상태는 이 뷰가 소유. 목록은 목업(페이지가 주입) — 추후 API(cmService) 로 교체.
import { useMemo, useState, type ReactNode } from 'react'

import { Button } from '@/ui/common/base/Button'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'

export interface BoardListViewProps<T> {
  /** 전체 목록 목업(추후 API). 이미 부풀린 전체 건수를 넘긴다. */
  list: T[]
  /** 고유 id(카드 key·상세 라우팅). */
  getId: (item: T) => string
  /** 목업 1건 → 카드 슬롯 props(id·onClick 제외 — 뷰가 부착). */
  toCard: (item: T) => Omit<CardListItem, 'id' | 'onClick'>
  /** 상단 검색어 부분일치(검색대상 target 별). */
  matchKeyword: (item: T, keyword: string, target: string) => boolean
  /** 상세필터(구분 설정 등) 부합 여부. 없으면 상세필터로 목록을 거르지 않음(스텁). */
  matchFilter?: (item: T, filter: SearchFilterValue) => boolean
  /** 상위고정(정렬 상단). 없으면 정렬 안 함(자료실 등). */
  isPinned?: (item: T) => boolean
  /** 검색대상 칩(제목/내용 등). */
  searchTargets: { value: string; label: ReactNode }[]
  /** 상세 검색필터 schema. */
  searchSchema: SearchFilterSchema
  /** 검색필터 기본/초기화 기준값. */
  defaultFilter: SearchFilterValue
  /** 카드 클릭(상세 이동 스텁). */
  onCardClick: (item: T) => void
  /** 빈 목록 문구. */
  emptyText?: ReactNode
}

export function BoardListView<T>({
  list,
  getId,
  toCard,
  matchKeyword,
  matchFilter,
  isPinned,
  searchTargets,
  searchSchema,
  defaultFilter,
  onCardClick,
  emptyText,
}: BoardListViewProps<T>) {
  const [filterOpen, setFilterOpen] = useState(false) // 검색필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(() => ({ ...defaultFilter }))
  const [keyword, setKeyword] = useState('') // 상단 검색어(입력 중)
  const [targets, setTargets] = useState<string[]>([searchTargets[0]?.value ?? '']) // 검색대상(single)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false) // 상세필터 적용 여부(버튼 강조)
  // 상단 검색 '적용' 상태 — 검색 버튼/Enter 시에만 확정(입력 중엔 거르지 않음).
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  // ── API 경계 스텁 (백엔드 연동 시 services/cm 로 대체). console 로 동작 확인 ──
  const handleSearch = () => {
    const target = targets[0] ?? searchTargets[0]?.value ?? '' // 검색대상은 single 칩 — 1개만 선택됨
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
    console.log('[BoardList] 검색', { keyword: keyword.trim(), target })
    // cmService.selectBoardList({ [target]: keyword, page: 1, ... })
  }
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
    console.log('[BoardList] 상세필터 검색', value)
    // cmService.selectBoardList(toRequest(value)) → 목록 재조회
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[BoardList] pageSize →', size)
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[BoardList] loadMore → page', next)
  }

  // ── ⚠️ 임시 목업 검색/페이징 (API 연동 시 이 블록 통째로 교체) ⚠️ ──────────
  const filteredList = useMemo(() => {
    const kw = appliedSearch?.keyword ?? ''
    const target = appliedSearch?.target ?? ''
    let matched = kw ? list.filter((it) => matchKeyword(it, kw, target)) : list
    // 상세필터(구분 설정 등) — 적용된 filter 로 거른다. matchFilter 없으면 거르지 않음.
    if (matchFilter) matched = matched.filter((it) => matchFilter(it, filter))
    // 상위고정(upFix='Y')을 앞으로(공지사항). isPinned 없으면 원순서 유지.
    if (!isPinned) return matched
    return [...matched].sort((a, b) => Number(isPinned(b)) - Number(isPinned(a)))
  }, [appliedSearch, list, matchKeyword, matchFilter, filter, isPinned])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: getId(it),
    ...toCard(it),
    onClick: () => onCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 검색대상 칩(제목/내용) + 필터 버튼(상단) / 입력 / 검색(하단). */}
      <div className="px-4 py-4">
        <SearchCondition
          targets={searchTargets}
          selectedTargets={targets}
          onTargetsChange={setTargets}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onFilterClick={() => setFilterOpen(true)}
          filterActive={filterApplied}
          onSearch={handleSearch}
          placeholder="검색어를 입력해주세요"
        />
      </div>

      {/* 목록 헤더 — 총건수(좌) + 표시개수(우). full-bleed 파란 바. */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 카드 목록 (px-4 인셋) */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} emptyText={emptyText} />
      </div>

      {/* 더보기 — 모두 노출되면 숨김. */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total})
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() => document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* 검색필터 풀팝업 — 공통 SearchFilter 셸. */}
      <SearchFilter
        open={filterOpen}
        onOpenChange={setFilterOpen}
        schema={searchSchema}
        value={filter}
        defaultValue={{ ...defaultFilter }}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
BoardListView.displayName = 'BoardListView'
