// 세금계산서진행현황 — MUI-TS-04-M04 TxivPrgrsPrst. 설계서 06.업무지원 v0.82 slide31~33.
// 발행일자별 세금계산서 진행현황 목록 — 카드 클릭 시 상세(M03) 이동.
// 구성: 검색조건(계약번호) + 안내문구(18시 이후 제출건 익일 전송) + 목록헤더 + 카드 + 더보기 + FAB
//      + 검색필터(발행일자 기간·계약번호·진행상태).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { tsQueries } from '@/queries/bds/ts/tsQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── 검색필터 schema — 검색조건(dmt_SrchTxivPrgrsPrst, slide33 1.1) 항목명 그대로 ──
const DATE_PRESETS = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

// 진행상태 옵션 — slide33 코드표(A/C/F/S/Y/R/T).
const TXIV_PRGRS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'A', label: '작성' },
  { value: 'C', label: '폐기' },
  { value: 'F', label: '서명실패' },
  { value: 'S', label: '전자서명' },
  { value: 'Y', label: '승인' },
  { value: 'R', label: '반려' },
  { value: 'T', label: '국세청SEND' },
]

const TS_TXIV_PRGRS_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'date',
      title: '검색 설정',
      fields: [
        { type: 'dateRange', key: 'bllPblcnYmd', label: '발행일자', presets: DATE_PRESETS },
      ],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        {
          type: 'text',
          key: 'ctrtNo',
          label: '계약번호',
          placeholder: '계약번호를 입력하세요.',
        },
      ],
    },
    {
      key: 'category',
      title: '구분 설정',
      fields: [
        {
          type: 'select',
          key: 'txivPrgrsStcd',
          label: '진행상태',
          placeholder: '전체',
          options: TXIV_PRGRS_OPTIONS,
        },
      ],
    },
  ],
}

function buildDefaultValue(): SearchFilterValue {
  return {
    bllPblcnYmd: {
      start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
      end: dayjs().format(DATE_FORMAT),
    },
    ctrtNo: '',
    txivPrgrsStcd: 'all',
  }
}

const SEARCH_TARGETS = [{ value: 'ctrtNo', label: '계약번호' }]

export function TxivPrgrsPrstPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['ctrtNo'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedSearch, setAppliedSearch] = useState<string | null>(null)

  const { data: listData, isLoading } = tsQueries.useSelectTxivPrgrsPrstList()

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
    return list.filter((it) => it.ctrtNo.toLowerCase().includes(kw))
  }, [appliedSearch, listData])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 카드 매핑 — slide31 목업: 뱃지(구분/진행상태/수정사유) + subtitle(계약번호) + title(계약건명) +
  // 행(계산서 발행번호/계약금액/공급가액/제출일시/국세청결과).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.reqDivsNm}</Badge>
        <Badge>{it.txivPrgrsStcd}</Badge>
        {it.txivMdfcnRncd && <Badge>{it.txivMdfcnRncd}</Badge>}
      </>
    ),
    subtitle: `계약번호 ${it.ctrtNo}`,
    title: it.rpstItnm,
    rows: [
      { label: '계산서 발행번호', value: it.pblcnNo },
      { label: '계약금액', value: `${it.contAmnt.toLocaleString()} 원` },
      { label: '공급가액', value: `${it.splyEqvl.toLocaleString()} 원` },
      { label: '제출일시', value: it.splrWrtDt },
      { label: '국세청결과', value: it.elsgnRsltCd || '-' },
    ],
    onClick: () => navigate('/ts/txivDtl', { state: it }),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 계약번호 */}
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

      {/* 국세청 전송 안내(slide31) */}
      <p className="px-4 pb-4 text-krds-body-sm text-krds-text-muted">
        18시 이후 제출건은 익일 09시에 국세청으로 전송됩니다.
      </p>

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

      {/* 상세필터 풀팝업 — 발행일자/계약번호/진행상태 */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={TS_TXIV_PRGRS_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
TxivPrgrsPrstPage.displayName = 'TxivPrgrsPrstPage'
