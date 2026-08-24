// 발주통보서목록 — MUI-EX-02-M77 OvsOrderNtdcList. 설계서 04.이행 v0.83 slide74~77.
// 한도액계약 — 계약번호로 검색한 계약 정보(상단) + 발주통보 목록(견적통보서 M73 동형).
// 카드 클릭 → 발주통보서상세(M78).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { exQueries } from '@/queries/cts/ex/exQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { OvsEstmtNtdcCtrtInfo } from '@/types/ex'

// ── 검색필터 schema — 검색조건(slide76 1.1): 계약번호 단일(P79 공통시트) ──
const EX_ORDER_NTDC_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'keyword',
      title: '검색어',
      fields: [
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

function buildDefaultValue(): SearchFilterValue {
  return { ctrtNo: '' }
}

const SEARCH_TARGETS = [{ value: 'ctrtNo', label: '계약번호' }]

// 상단 계약정보 (slide76 1.2 — 견적통보서와 동일 구성) → 표 행.
function ctrtInfoRows(info: OvsEstmtNtdcCtrtInfo): TableRow[] {
  return [
    { label: '계약업체', value: info.ctrtBzentyCd },
    { label: '계약일자', value: info.ctrtYmd },
    { label: '화폐단위', value: info.crncCd },
    { label: '계약금액', value: info.ctrtAmt.toLocaleString(), type: 'number' },
    { label: '청구금액', value: info.clmAmt.toLocaleString(), type: 'number' },
    { label: '미청구금액', value: info.uclmAmt.toLocaleString(), type: 'number' },
  ]
}

export function OvsOrderNtdcListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['ctrtNo'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedSearch, setAppliedSearch] = useState<string | null>(null)

  const { data: listData, isLoading } = exQueries.useSelectOrderNtdcList()

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

  const filteredList = useMemo(() => {
    const list = listData?.list ?? []
    if (!appliedSearch) return list
    const kw = appliedSearch.toLowerCase()
    return list.filter(
      (it) => it.orderSeq.toLowerCase().includes(kw) || it.bizNm.toLowerCase().includes(kw),
    )
  }, [appliedSearch, listData])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 카드 매핑 — slide74 목업: 뱃지(진행상태 작성/송신/반려) + subtitle(RQ No) + title(사업명) +
  // 행(항목 수/무역대리점/작성일/수신자).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: <Badge>{it.docSttsCd}</Badge>,
    subtitle: `RQ No ${it.orderSeq}`,
    title: it.bizNm,
    rows: [
      { label: '항목 수', value: `${it.itemSeq.toLocaleString()} 개` },
      { label: '무역대리점', value: it.bzentyCd },
      { label: '작성일', value: it.wrtYmd },
      { label: '수신자', value: it.rcvrNm },
    ],
    onClick: () => navigate('/ex/ovsOrderNtdcDtl', { state: it }),
  }))

  return (
    <div className="flex w-full flex-col">
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

      {/* 상단 계약정보 — 계약번호로 검색한 계약 정보(slide74 1]) */}
      {listData?.ctrtInfo && (
        <section className="flex flex-col gap-krds-5 pb-4">
          <SectionTitle as="h3">계약정보</SectionTitle>
          <div className="px-4">
            <Table rows={ctrtInfoRows(listData.ctrtInfo)} />
          </div>
        </section>
      )}

      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} loading={isLoading} />
      </div>

      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={EX_ORDER_NTDC_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
OvsOrderNtdcListPage.displayName = 'OvsOrderNtdcListPage'
