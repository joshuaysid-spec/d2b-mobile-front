// 견적의뢰서목록 — MUI-EX-02-M71 OvsEstmtRqdcList. 설계서 04.이행 v0.83 slide46~48.
// 한도액계약 — 견적의뢰서 목록을 조회하고 통보서 진행상태를 확인하는 화면.
// 구성: 검색조건(SearchCondition, 대상칩 계약번호) + 목록헤더 + 카드 + 더보기 + FAB
//      + 검색필터(SearchFilter schema, MUI-EX-02-P80 — 수신일·계약번호(P79 공통시트)).
// 카드 클릭 → 견적의뢰서상세(M72). 업무도움은 내역 확정 전 미표시(형제 화면 동일).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { exQueries } from '@/queries/bds/ex/exQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── MUI-EX-02-P80 검색필터 schema (slide47~48) — 키는 검색조건(dm_searchInfo) 항목명 그대로 ──
const DATE_PRESETS = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

const EX_ESTMT_RQDC_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'date',
      title: '검색 설정',
      // 수신일(rcptnBgngYmd~rcptnEndYmd, slide48 1.1 — 0630 개정 항목) — On-Load 5년전~현재.
      fields: [{ type: 'dateRange', key: 'rcptnYmd', label: '수신일', presets: DATE_PRESETS }],
    },
    {
      key: 'keyword',
      title: '검색어',
      fields: [
        // 계약번호 — 계약번호조회 공통시트(MUI-EX-02-P79, OvsCtrtNoInq). 셸이 시트를 직접 연다.
        {
          type: 'selectionField',
          key: 'ctrtNo',
          label: '계약번호',
          placeholder: '번호를 입력하세요.',
          searchSheet: 'ctrtNo',
        },
      ],
    },
  ],
}

// On-Load 기본값(slide48): 수신일 = 5년전 ~ 현재일.
function buildDefaultValue(): SearchFilterValue {
  return {
    rcptnYmd: {
      start: dayjs().subtract(5, 'year').format(DATE_FORMAT),
      end: dayjs().format(DATE_FORMAT),
    },
    ctrtNo: '',
  }
}

// 빠른검색 대상 칩 — slide46 목업(계약번호 단일).
const SEARCH_TARGETS = [{ value: 'ctrtNo', label: '계약번호' }]

export function OvsEstmtRqdcListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업(MUI-EX-02-P80)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['ctrtNo'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedSearch, setAppliedSearch] = useState<string | null>(null)

  const { data: listData, isLoading } = exQueries.useSelectEstmtRqdcList()

  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
  }
  const handleQuickSearch = () => {
    setAppliedSearch(keyword.trim())
    setPage(1)
  }

  // ── 키워드(견적번호/사업명 부분일치) 필터 + 더보기 — 클라이언트 로직 ──
  const filteredList = useMemo(() => {
    const list = listData?.list ?? []
    if (!appliedSearch) return list
    const kw = appliedSearch.toLowerCase()
    return list.filter(
      (it) => it.clmSeq.toLowerCase().includes(kw) || it.bizNm.toLowerCase().includes(kw),
    )
  }, [appliedSearch, listData])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 카드 매핑 — slide46 목업: 뱃지(통보서상태) + subtitle(견적번호+차수) + title(사업명) +
  // 행(항목수/무역대리점/납기일/작성일).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: <Badge>{it.ntdcStts}</Badge>,
    subtitle: `견적번호 ${it.clmSeq}`,
    title: it.bizNm,
    rows: [
      { label: '항목 수', value: `${it.itemSeq.toLocaleString()} 개` },
      { label: '무역대리점', value: it.bzentyCd },
      { label: '납기일', value: it.dudtYmd },
      { label: '작성일', value: it.wrtYmd },
    ],
    onClick: () => navigate('/ex/ovsEstmtRqdcDtl', { state: it }),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 대상칩(계약번호) + 필터버튼('계약번호 조회'는 필터의 P79 시트로 접근, slide46) */}
      <div className="px-4 py-4">
        <SearchCondition
          targets={SEARCH_TARGETS}
          selectedTargets={targets}
          onTargetsChange={setTargets}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onFilterClick={() => setOpen(true)}
          filterActive={filterApplied}
          onSearch={handleQuickSearch}
        />
      </div>

      {/* 목록 헤더 — 총건수 + 표시개수 */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      {/* 카드 목록 */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} loading={isLoading} />
      </div>

      {/* 더보기 */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 상세필터 풀팝업(MUI-EX-02-P80) */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={EX_ESTMT_RQDC_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
OvsEstmtRqdcListPage.displayName = 'OvsEstmtRqdcListPage'
