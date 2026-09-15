// 일반자료실(자료실 목록) — MUI-CM-04-M29.
// 목록 마크업·검색/페이징 상태는 이 페이지가 직접 소유한다(공용 BoardListView 폐기 — 2026-09-15 사용자 확정, 상세와 동일 원칙).
// 구성(위→아래): 검색영역(SearchCondition: 대상칩 제목/내용 + 필터버튼 / 입력 / 검색)
//   → 목록헤더(ListSectionHeader 총건수·표시개수) → 카드 리스트(CardList) → 더보기 → 맨위로 FAB
//   → 검색필터 풀팝업(SearchFilter 셸). 목록은 목업 — 추후 tssCmQueries 훅(data)으로 교체.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Button } from '@/ui/common/base/Button'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import {
  RPSTR_SEARCH_SCHEMA,
  RPSTR_SEARCH_TARGETS,
  RPSTR_DEFAULT,
  rpstrToCard,
  rpstrMatchKeyword,
} from './rpstrBoard'
import { RPSTR_MOCK } from './rpstrMock'
import type { SearchFilterValue } from '@/types/search-filter'

export function RpstrList() {
  const navigate = useNavigate()
  const list = RPSTR_MOCK // 추후 tssCmQueries 훅 data 로 교체
  const [filterOpen, setFilterOpen] = useState(false) // 검색필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(() => ({ ...RPSTR_DEFAULT }))
  const [keyword, setKeyword] = useState('') // 상단 검색어(입력 중)
  const [targets, setTargets] = useState<string[]>([RPSTR_SEARCH_TARGETS[0].value]) // 검색대상(single)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false) // 상세필터 적용 여부(버튼 강조)
  // 상단 검색 '적용' 상태 — 검색 버튼/Enter 시에만 확정(입력 중엔 거르지 않음).
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  // ── API 경계 스텁 (백엔드 연동 시 tssCmQueries 조회 파라미터로 대체) ──
  const handleSearch = () => {
    const target = targets[0] ?? RPSTR_SEARCH_TARGETS[0].value // 검색대상은 single 칩 — 1개만 선택됨
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
  }
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
  }
  const handleLoadMore = () => setPage((prev) => prev + 1)

  // ── ⚠️ 임시 목업 검색/페이징 (API 연동 시 이 블록 통째로 교체) ⚠️ ──
  const filteredList = useMemo(() => {
    const kw = appliedSearch?.keyword ?? ''
    return kw ? list.filter((it) => rpstrMatchKeyword(it, kw)) : list
  }, [appliedSearch, list])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const cardItems: CardListItem[] = filteredList.slice(0, loaded).map((it) => ({
    id: it.contsNo,
    ...rpstrToCard(it),
    onClick: () => navigate(ROUTES.SUPPORT_ARCHIVE_DETAIL, { state: it }),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 검색대상 칩(제목/내용) + 필터 버튼(상단) / 입력 / 검색(하단). */}
      <div className="px-4 py-4">
        <SearchCondition
          targets={RPSTR_SEARCH_TARGETS}
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
        <CardList items={cardItems} emptyText="자료가 없습니다." />
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
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 검색필터 풀팝업 — 공통 SearchFilter 셸. */}
      <SearchFilter
        open={filterOpen}
        onOpenChange={setFilterOpen}
        schema={RPSTR_SEARCH_SCHEMA}
        value={filter}
        defaultValue={{ ...RPSTR_DEFAULT }}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
RpstrList.displayName = 'RpstrList'
