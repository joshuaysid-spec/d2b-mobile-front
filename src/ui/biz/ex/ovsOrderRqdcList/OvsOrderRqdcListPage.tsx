// 발주의뢰서목록 — MUI-EX-02-M75 OvsOrderRqdcList. 설계서 04.이행 v0.83 slide64~67.
// 한도액계약 — 발주의뢰서 목록을 조회하고 통보서 진행상태를 확인하는 화면(견적의뢰서 M71 동형).
// 구성: 검색조건 + 목록헤더 + 카드 + 더보기 + FAB + 검색필터(MUI-EX-02-P81 — 수신일·계약번호 P79 시트).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { useOvsOrderRqdcList } from '@/queries/ex'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── MUI-EX-02-P81 검색필터 schema (slide66~67) — P80 과 동일 구성(수신일·계약번호) ──
const DATE_PRESETS = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

const EX_ORDER_RQDC_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'date',
      title: '검색 설정',
      fields: [{ type: 'dateRange', key: 'rcptnYmd', label: '수신일', presets: DATE_PRESETS }],
    },
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

// On-Load 기본값(slide67): 수신일 = 5년전 ~ 현재일.
function buildDefaultValue(): SearchFilterValue {
  return {
    rcptnYmd: {
      start: dayjs().subtract(5, 'year').format(DATE_FORMAT),
      end: dayjs().format(DATE_FORMAT),
    },
    ctrtNo: '',
  }
}

const SEARCH_TARGETS = [{ value: 'ctrtNo', label: '계약번호' }]

export function OvsOrderRqdcListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['ctrtNo'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedSearch, setAppliedSearch] = useState<string | null>(null)

  const { data: listData, isLoading } = useOvsOrderRqdcList()

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

  // 카드 매핑 — 뱃지(통보서상태) + subtitle(발주번호) + title(사업명) +
  // 행(항목수/화폐단위/계약금액/납기일, dl_orderRqdc).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: <Badge>{it.ntdcStts}</Badge>,
    subtitle: `발주번호 ${it.orderSeq}`,
    title: it.bizNm,
    rows: [
      { label: '항목 수', value: `${it.itemSeq.toLocaleString()} 개` },
      { label: '화폐단위', value: it.crncCd },
      { label: '계약금액', value: it.ctrtAmt.toLocaleString() },
      { label: '납기일', value: it.dudtYmd },
    ],
    onClick: () => navigate(`/ex/order-rqdc/${it.id}`, { state: it }),
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

      {/* 상세필터 풀팝업(MUI-EX-02-P81) */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={EX_ORDER_RQDC_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
OvsOrderRqdcListPage.displayName = 'OvsOrderRqdcListPage'
