// 대금청구진행현황 — MUI-WM-01-M11 PymtClmPrgrsPrst. 설계서 05.대금청구및사후 v0.83 slide80~81.
// 구성: 검색조건(SearchCondition) + 안내문(P09) 버튼 + 목록헤더 + 카드 리스트 + 더보기 + FAB
//      + 검색필터(schema — 계약일자·청구일자·업무구분·검색어).
// 카드 클릭(slide81 상세 클릭 이벤트) → 대금청구상세 유형 분기(M05~M08, prcmSeNm 임시 키).
// '대금반납' 버튼(slide81) → 대금지불정보(반납)(M10) 이동.
// 업무도움은 '내역이 없으면 항목을 표시하지 않음' — 안내 내역 확정 전이라 미표시(M01 동일).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { wmQueries } from '@/queries/cts/wm/wmQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { PymtClmGdntcFullPopup } from '@/ui/biz/wm/centerPrcmPymtClmDtl/PymtClmGdntcFullPopup'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { PymtClmPrgrsPrstItem } from '@/types/mock/wm'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── 검색필터 schema — 키는 검색조건(dmt_pymtClmPrgrsPrstSrch, slide81 1.1) 항목명 그대로 ──
const DATE_PRESETS = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

const WM_PRGRS_SEARCH_SCHEMA: SearchFilterSchema = {
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
      fields: [
        { type: 'dateRange', key: 'ctrtYmd', label: '계약일자', presets: DATE_PRESETS },
        { type: 'dateRange', key: 'clmYmd', label: '청구일자', presets: DATE_PRESETS },
      ],
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
  const recent1m = {
    start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
    end: dayjs().format(DATE_FORMAT),
  }
  return {
    taskSeCd: ['0', 'goods', 'service', 'construction'], // 전체('0' = 전체 코드값)
    ctrtYmd: recent1m,
    clmYmd: recent1m,
    ctrtNm: '',
    ctrtNo: '',
  }
}

const SEARCH_TARGETS = [
  { value: 'ctrtNm', label: '계약명' },
  { value: 'ctrtNo', label: '계약번호' },
]

export function PymtClmPrgrsPrstPage() {
  const navigate = useNavigate()
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

  const { data: listData, isLoading } = wmQueries.useSelectPymtClmPrgrsList()

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
  // 카드 클릭(slide81) — 대금청구상세 유형 분기(M05~M08).
  const handleCardClick = (item: PymtClmPrgrsPrstItem) => {
    const path =
      item.prcmSeNm === '부대'
        ? '/wm/sbsdPrcmPymtClmDtl'
        : item.prcmSeNm === '공사'
          ? '/wm/cstrnPymtClmDtl'
          : item.prcmSeNm === '기성대가'
            ? '/wm/pxcndCstPymtClmDtl'
            : '/wm/centerPrcmPymtClmDtl'
    navigate(path, { state: item })
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

  // 카드 매핑 — slide81 목업: 뱃지(업무구분/대금상태) + subtitle(신청번호/계약번호+차수) +
  // title(계약명) + 행(청구일자/계약금액/수령액/청구금액 — 0706 보완 항목 포함).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSeCd}</Badge>
        <Badge>{it.pymtStNm}</Badge>
      </>
    ),
    subtitle: `신청번호 ${it.birqNo} / 계약번호 ${it.ctrtNo} - ${it.ctrtCycl}`,
    title: it.ctrtNm,
    rows: [
      { label: '청구일자', value: it.clmYmd },
      { label: '계약금액', value: `${it.ctrtAmt.toLocaleString()} 원` },
      { label: '수령액', value: `${it.trgtAmt.toLocaleString()} 원` },
      { label: '청구금액', value: `${it.clmAmt.toLocaleString()} 원` },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 + 안내문/대금반납 버튼(slide81 6]) */}
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
        <div className="flex justify-end gap-krds-3">
          <Button variant="secondary" size="sm" onClick={() => setGdntcOpen(true)}>
            안내문
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/wm/rtn')}>
            대금반납
          </Button>
        </div>
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
        schema={WM_PRGRS_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />

      {/* 대금청구 안내문(MUI-WM-01-P09) */}
      <PymtClmGdntcFullPopup open={gdntcOpen} onOpenChange={setGdntcOpen} />
    </div>
  )
}
PymtClmPrgrsPrstPage.displayName = 'PymtClmPrgrsPrstPage'
