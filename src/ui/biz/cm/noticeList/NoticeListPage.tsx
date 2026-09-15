// 일반공지사항(공지사항 목록) — MUI-CM-04-M01. Figma 10020-82108 / 설계서 00.공통 v0.83 slide216·217.
// 목록 마크업·검색/페이징 상태는 이 페이지가 직접 소유한다(공용 BoardListView 폐기 — 2026-09-15 사용자 확정, 상세와 동일 원칙).
// 구성(위→아래): 검색영역(SearchCondition: 대상칩 제목/내용 + 필터버튼 / 입력 / 검색)
//   → 목록헤더(ListSectionHeader 총건수·표시개수) → 카드 리스트(CardList) → 더보기 → 맨위로 FAB
//   → 검색필터 풀팝업(SearchFilter 셸).
// 데이터: tssCmQueries.useSelectNoticeList(no.925) — 목업 모드에선 서비스가 mocks/cm 목업을 반환(2026-09-15 배선).
//   검색어/상세필터/페이징은 아직 클라이언트에서 거른다(⚠️ 블록). 서버 페이징 전환 시 확정값을 훅 파라미터로 넘기고 그 블록만 제거.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Button } from '@/ui/common/base/Button'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { tssCmQueries } from '@/queries/tss/cm/tssCmQueries'
import {
  NOTICE_SEARCH_SCHEMA_WITH_CATEGORY,
  NOTICE_SEARCH_TARGETS,
  NOTICE_DEFAULT_WITH_CATEGORY,
  noticeToCard,
  noticeMatchKeyword,
  noticeMatchFilter,
  noticeIsPinned,
} from './noticeBoard'
import type { SearchFilterValue } from '@/types/search-filter'

export function NoticeListPage() {
  const navigate = useNavigate()
  const { data: list = [], isLoading } = tssCmQueries.useSelectNoticeList({})
  const [filterOpen, setFilterOpen] = useState(false) // 검색필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(() => ({
    ...NOTICE_DEFAULT_WITH_CATEGORY,
  }))
  const [keyword, setKeyword] = useState('') // 상단 검색어(입력 중)
  const [targets, setTargets] = useState<string[]>([NOTICE_SEARCH_TARGETS[0].value]) // 검색대상(single)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false) // 상세필터 적용 여부(버튼 강조)
  // 상단 검색 '적용' 상태 — 검색 버튼/Enter 시에만 확정(입력 중엔 거르지 않음).
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  // ── API 경계 스텁 (백엔드 연동 시 tssCmQueries 조회 파라미터로 대체) ──
  const handleSearch = () => {
    const target = targets[0] ?? NOTICE_SEARCH_TARGETS[0].value // 검색대상은 single 칩 — 1개만 선택됨
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
    let matched = kw ? list.filter((it) => noticeMatchKeyword(it, kw)) : list
    // 상세필터 '구분 설정 > 상태'(emrg) — 적용된 filter 로 거른다.
    matched = matched.filter((it) => noticeMatchFilter(it, filter))
    // 상위고정(upFix='Y')을 앞으로.
    return [...matched].sort((a, b) => Number(noticeIsPinned(b)) - Number(noticeIsPinned(a)))
  }, [appliedSearch, list, filter])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const cardItems: CardListItem[] = filteredList.slice(0, loaded).map((it) => ({
    id: it.contsNo,
    ...noticeToCard(it),
    onClick: () => navigate(ROUTES.SUPPORT_NOTICE_DETAIL, { state: it }),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 검색대상 칩(제목/내용) + 필터 버튼(상단) / 입력 / 검색(하단). */}
      <div className="px-4 py-4">
        <SearchCondition
          targets={NOTICE_SEARCH_TARGETS}
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
        <CardList items={cardItems} loading={isLoading} emptyText="공지사항이 없습니다." />
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
        schema={NOTICE_SEARCH_SCHEMA_WITH_CATEGORY}
        value={filter}
        defaultValue={{ ...NOTICE_DEFAULT_WITH_CATEGORY }}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
NoticeListPage.displayName = 'NoticeListPage'
