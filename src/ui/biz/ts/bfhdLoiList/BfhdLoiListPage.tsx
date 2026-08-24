// 사전의향서목록 — MUI-TS-01-M01 BfhdLoiList. 설계서 06.업무지원 v0.82 slide9~11.
// 구성: 검색조건(SearchCondition, 대상칩 제목/재고번호) + 목록헤더 + 카드 + 더보기 + FAB
//      + 검색필터(SearchFilter schema, MUI-TS-01-P04 — 접수기간 월 단위(2026-07-24 화면수정)·
//        제목/재고번호/발주부서(부서검색 공통시트)/담당자).
// 카드 클릭 → 사전의향서상세(M02). 진행상태 빈값=미작성(뱃지 미노출, slide9 처리절차).
// 공지사항(업무도움)은 '내역 확정 전' 미표시(형제 화면 동일 판단).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { tsQueries } from '@/queries/cts/ts/tsQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'

const MONTH_FORMAT = 'YYYY-MM'

// ── MUI-TS-01-P04 검색필터 schema (slide10~11) — 키는 검색조건 항목명 그대로 ──
const TS_LOI_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'date',
      title: '접수기간 설정',
      // 접수기간(rcptYmdFr~rcptYmdTo) — 2026-07-24 화면수정으로 월 단위 지정(monthRange).
      fields: [{ type: 'monthRange', key: 'rcptYmd', label: '기간 설정' }],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'bfhdLoiTtl', label: '제목', placeholder: '제목을 입력하세요.' },
        {
          type: 'text',
          key: 'mdfcnInvtNo',
          label: '재고번호',
          placeholder: '번호를 입력하세요.',
        },
        // 발주부서 — 부서검색 공통시트(MUI-BD-01-P04, DeptInq). 셸이 시트를 직접 연다.
        {
          type: 'selectionField',
          key: 'deptCd',
          label: '발주부서',
          placeholder: '발주기관을 입력하세요.',
          searchSheet: 'dept',
        },
        { type: 'text', key: 'userNm', label: '담당자', placeholder: '담당자를 입력하세요.' },
      ],
    },
  ],
}

// On-Load 기본값(slide11): 접수기간 = 현재(월 단위).
function buildDefaultValue(): SearchFilterValue {
  const thisMonth = dayjs().format(MONTH_FORMAT)
  return {
    rcptYmd: { start: thisMonth, end: thisMonth },
    bfhdLoiTtl: '',
    mdfcnInvtNo: '',
    deptCd: '',
    userNm: '',
  }
}

// 빠른검색 대상 칩 — slide9 목업(제목/재고번호).
const SEARCH_TARGETS = [
  { value: 'bfhdLoiTtl', label: '제목' },
  { value: 'mdfcnInvtNo', label: '재고번호' },
]

export function BfhdLoiListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업(MUI-TS-01-P04)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['bfhdLoiTtl'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  const { data: listData, isLoading } = tsQueries.useSelectBfhdLoiList()

  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
  }
  const handleQuickSearch = () => {
    const target = targets[0] ?? 'bfhdLoiTtl'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
  }

  // ── 키워드 필터 + 더보기 — 클라이언트 로직(서버 페이징 전환 시 삭제).
  //    재고번호는 목록 항목에 없어 제목만 부분일치(재고번호 검색은 서버 전환 시 req 로 이행). ──
  const filteredList = useMemo(() => {
    const list = listData?.list ?? []
    if (!appliedSearch || !appliedSearch.keyword) return list
    const kw = appliedSearch.keyword.toLowerCase()
    return list.filter((it) => it.bfhdLoiTtl.toLowerCase().includes(kw))
  }, [appliedSearch, listData])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 카드 매핑 — slide9 목업: 뱃지(진행상태 — 빈값이면 미노출) + title(제목) +
  // 행(접수일자/발주부서/담당자).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: it.prgrsStcd ? <Badge>{it.prgrsStcd}</Badge> : undefined,
    title: it.bfhdLoiTtl,
    rows: [
      { label: '접수일자', value: it.rcptYmd },
      { label: '발주부서', value: it.deptCd },
      { label: '담당자', value: it.userNm },
    ],
    onClick: () => navigate('/ts/bfhdLoiDtl', { state: it }),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 대상칩(제목/재고번호) + 필터버튼 + 검색어 입력 + 검색 버튼 */}
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

      {/* 상세필터 풀팝업(MUI-TS-01-P04) */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={TS_LOI_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
BfhdLoiListPage.displayName = 'BfhdLoiListPage'
