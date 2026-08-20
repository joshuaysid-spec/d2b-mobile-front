// 대금지불정보(반납) — MUI-WM-01-M10 RtnPymtDfryInfo. 설계서 05.대금청구및사후 v0.83 slide82~83.
// 조달업체에서 과지급된 대금에 대하여 반납해야 하는 정보를 조회하는 화면.
// 구성: 검색조건(SearchCondition) + 안내문(P09) 버튼 + 목록헤더 + 카드 리스트 + 더보기 + FAB
//      + 검색필터(schema — 계약일자·업무구분·검색어). 카드 클릭 이벤트는 설계서 미정의(조회 전용).
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

import { wmQueries } from '@/queries/bds/wm/wmQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { PymtClmGdntcFullPopup } from '@/ui/biz/wm/centerPrcmPymtClmDtl/PymtClmGdntcFullPopup'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── 검색필터 schema — 키는 검색조건(dmt_pymtDfryInfoSrch, slide83 1.1) 항목명 그대로 ──
const DATE_PRESETS = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

const WM_RTN_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'taskSeCd',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSeCd',
          required: true,
          selectAll: { value: '0' }, // '0' = '전체' 코드값 — 전체 선택 시 값 배열에 포함
          options: [
            { value: 'goods', label: '물품' },
            { value: 'service', label: '용역' },
            { value: 'construction', label: '공사' },
          ],
        },
      ],
    },
    {
      key: 'date',
      title: '검색 설정',
      fields: [{ type: 'dateRange', key: 'ctrtYmd', label: '계약일자', presets: DATE_PRESETS }],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'ctrtNm', label: '계약명', placeholder: '계약건명을 입력하세요.' },
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
  return {
    taskSeCd: ['0', 'goods', 'service', 'construction'], // 전체('0' = 전체 코드값)
    ctrtYmd: {
      start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
      end: dayjs().format(DATE_FORMAT),
    },
    ctrtNm: '',
    ctrtNo: '',
  }
}

const SEARCH_TARGETS = [
  { value: 'ctrtNm', label: '계약명' },
  { value: 'ctrtNo', label: '계약번호' },
]

export function RtnPymtDfryInfoPage() {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['ctrtNm'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )
  const [gdntcOpen, setGdntcOpen] = useState(false) // P09 안내문

  const { data: listData, isLoading } = wmQueries.useSelectPymtDfryInfoRtnList()

  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
  }
  const handleQuickSearch = () => {
    const target = targets[0] ?? 'ctrtNm'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
  }

  const filteredList = useMemo(() => {
    const list = listData?.list ?? []
    if (!appliedSearch || !appliedSearch.keyword) return list
    const kw = appliedSearch.keyword.toLowerCase()
    return list.filter((it) => {
      const field = appliedSearch.target === 'ctrtNm' ? it.ctrtNm : `${it.ctrtNo}-${it.ctrtCycl}`
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch, listData])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 카드 매핑 — slide82 목업: 뱃지(업무구분/입찰구분) + subtitle(신청번호/계약번호+차수) +
  // title(계약명) + 행(계약금액/수령금액/반납금액).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSeCd}</Badge>
        <Badge>{it.bidMthdNm}</Badge>
      </>
    ),
    subtitle: `신청번호 ${it.birqNo} / 계약번호 ${it.ctrtNo} - ${it.ctrtCycl}`,
    title: it.ctrtNm,
    rows: [
      { label: '계약금액', value: `${it.ctrtAmt.toLocaleString()} 원` },
      { label: '수령금액', value: `${it.trgtAmt.toLocaleString()} 원` },
      { label: '반납금액', value: `${it.rtnAmt.toLocaleString()} 원` },
    ],
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 + 안내문 버튼 */}
      <div className="flex flex-col gap-krds-5 px-4 py-4">
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
        <Button variant="secondary" size="sm" className="self-end" onClick={() => setGdntcOpen(true)}>
          안내문
        </Button>
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

      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={WM_RTN_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />

      {/* 대금청구 안내문(MUI-WM-01-P09) */}
      <PymtClmGdntcFullPopup open={gdntcOpen} onOpenChange={setGdntcOpen} />
    </div>
  )
}
RtnPymtDfryInfoPage.displayName = 'RtnPymtDfryInfoPage'
