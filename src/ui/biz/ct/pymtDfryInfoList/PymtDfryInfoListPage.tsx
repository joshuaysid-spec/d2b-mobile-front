// 대금지불정보목록 — MUI-CT-01-M15 PymtDfryInfoListPage. 설계서 slide100~101.
// 홈 > 계약 > 대금지불정보목록(전체메뉴 진입). 목록 컨벤션(PrcmPlanIntgListPage) 조립:
// SearchCondition(대상칩 통합참조번호/계약번호) + ListSectionHeader + CardList + 더보기 + FAB
// + SearchFilter(지불일자 dateRange + 검색어) — 카드 클릭 → P16 대금지불정보조회 풀팝업.
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

import { usePymtDfryInfoList } from '@/queries/ct'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { PymtDfryInfoInqFullPopup } from '@/ui/biz/ct/pymtDfryInfoList/PymtDfryInfoInqFullPopup'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { PymtDfryInfoItem } from '@/types/ct'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── 검색필터 schema — 검색조건(slide101 1.1): 지불일자(dfryYmd)/통합참조번호/계약번호 ──
const DATE_PRESETS = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

const PYMT_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'date',
      title: '검색 설정',
      fields: [{ type: 'dateRange', key: 'dfryYmd', label: '지불일자', presets: DATE_PRESETS }],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        {
          type: 'text',
          key: 'intgRfrncNo',
          label: '통합참조번호',
          placeholder: '번호를 입력하세요.',
        },
        // 계약번호 — 계약번호조회 공통시트(MUI-EX-02-P79, OvsCtrtNoInq) 연동. 셸이 시트를 직접 연다.
        {
          type: 'selectionField',
          key: 'ctrtNo',
          label: '계약번호',
          placeholder: '번호를 선택하세요.',
          searchSheet: 'ctrtNo',
        },
      ],
    },
  ],
}

const RECENT_1M = () => ({
  start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
  end: dayjs().format(DATE_FORMAT),
})

// On-Load(slide101): 지불일자 = 현재일-1개월 ~ 현재일.
function buildDefaultValue(): SearchFilterValue {
  return { dfryYmd: RECENT_1M(), intgRfrncNo: '', ctrtNo: '' }
}

// 빠른검색 대상 칩 — 검색조건 항목 기준(통합참조번호/계약번호. slide100 2-1 표기 흔들림 → 항목명 기준).
const SEARCH_TARGETS = [
  { value: 'intgRfrncNo', label: '통합참조번호' },
  { value: 'ctrtNo', label: '계약번호' },
]

export function PymtDfryInfoListPage() {
  const [open, setOpen] = useState(false) // 상세필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['intgRfrncNo'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )
  // P16 대금지불정보조회 — 카드 클릭 시 해당 계약번호로 조회.
  const [inqCtrtNo, setInqCtrtNo] = useState<string | null>(null)

  const { data: list = [] } = usePymtDfryInfoList()

  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
  }
  const handleQuickSearch = () => {
    const target = targets[0] ?? 'intgRfrncNo'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
  }

  // ── 키워드 필터 + 더보기 슬라이스(클라이언트 로직 — 서버 전환 시 훅 파라미터로 이행) ──
  // 통합참조번호는 목록 데이터영역에 없어 계약번호로 근사(목업 한계, API 연동 시 매핑).
  const filteredList = useMemo(() => {
    if (!appliedSearch || !appliedSearch.keyword) return list
    const kw = appliedSearch.keyword.toLowerCase()
    return list.filter((it) => it.ctrtNo.toLowerCase().includes(kw))
  }, [appliedSearch, list])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 카드 — 문서정보(계약번호/증빙번호) + 계약건명 + 지불 내역 행(slide100 5]).
  const cardItems: CardListItem[] = visibleList.map((it: PymtDfryInfoItem) => ({
    id: it.id,
    badges: <Badge>{it.taskSeNm}</Badge>,
    subtitle: `계약번호 ${it.ctrtNo} / 증빙번호 ${it.evdncNo}`,
    title: it.ctrtNm,
    rows: [
      { label: '수표발행일', value: it.checkPblcnYmd },
      { label: '업체명', value: it.bzentyNm },
      { label: '지출금액', value: `${it.expndAmt.toLocaleString()} 원` },
      { label: '지체상금액', value: `${it.lqdmgAmt.toLocaleString()} 원` },
      { label: '국고환수액', value: `${it.nttrRdmAmt.toLocaleString()} 원` },
    ],
    onClick: () => setInqCtrtNo(it.ctrtNo), // → P16 대금지불정보조회
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 */}
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

      {/* 목록 헤더 */}
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
        <CardList items={cardItems} />
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

      {/* 상세필터 풀팝업 */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={PYMT_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />

      {/* P16 대금지불정보조회 풀팝업 — 카드 클릭 시 해당 계약번호로 조회 */}
      <PymtDfryInfoInqFullPopup
        open={inqCtrtNo !== null}
        onOpenChange={(next) => {
          if (!next) setInqCtrtNo(null)
        }}
        ctrtNo={inqCtrtNo ?? ''}
      />
    </div>
  )
}
PymtDfryInfoListPage.displayName = 'PymtDfryInfoListPage'
