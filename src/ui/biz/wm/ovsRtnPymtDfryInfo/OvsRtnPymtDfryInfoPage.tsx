// 대금지불정보(국외) — MUI-WM-01-M75 OvsRtnPymtDfryInfo.
// 설계서 05.대금청구및사후 v0.85 slide99~102 (2026-08-13 국외 신규 화면 추가분).
// 구성: 검색조건(SearchCondition, 대상칩 계약번호 + 필터버튼→P76) + 목록헤더 + 카드 리스트
//      + 더보기 + FAB + 검색필터(P76). 카드 클릭 없음(slide99 4]).
// On-Load(slide102): 심사일자 = 1개월 전 ~ 현재일.
// 업무도움(slide99 1])은 '내역이 없으면 항목을 표시하지 않음' — 안내 내역 확정 전이라 미표시.
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
import type { DateRangeValue, SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'

const DATE_FORMAT = 'YYYY-MM-DD'

/** 외화 금액 표기 — 소수 2자리 + 화폐단위(cmcUnit) 후행(slide99 4-2]). */
const fmtAmt = (n: number, unit: string) =>
  `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`

// ── MUI-WM-01-P76 검색필터 schema (slide100) — 키는 검색조건(dm_search, slide101 1.1) 항목명 그대로 ──
const DATE_PRESETS = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

const WM_OVS_DFRY_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        // 계약번호 — 계약번호조회 공통시트(MUI-EX-02-P79)를 셸이 연다.
        {
          type: 'selectionField',
          key: 'ctrtNo',
          label: '계약번호',
          placeholder: '계약번호를 입력하세요.',
          searchSheet: 'ctrtNo',
        },
        { type: 'text', key: 'blNo', label: 'B/L번호', placeholder: 'B/L번호를 입력하세요.' },
        {
          type: 'text',
          key: 'invcNo',
          label: 'INVOICE NO',
          placeholder: 'INVOICE 번호를 입력하세요.',
        },
      ],
    },
    {
      key: 'date',
      title: '검색 설정',
      fields: [{ type: 'dateRange', key: 'srngYmd', label: '심사일자', presets: DATE_PRESETS }],
    },
  ],
}

// On-Load 기본값(slide102): 심사일자 = 1개월 전 ~ 현재일.
function buildDefaultValue(): SearchFilterValue {
  return {
    ctrtNo: '',
    blNo: '',
    invcNo: '',
    srngYmd: {
      start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
      end: dayjs().format(DATE_FORMAT),
    },
  }
}

const SEARCH_TARGETS = [{ value: 'ctrtNo', label: '계약번호' }]

export function OvsRtnPymtDfryInfoPage() {
  const [open, setOpen] = useState(false) // 상세필터 풀팝업(P76)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['ctrtNo'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedCtrtNo, setAppliedCtrtNo] = useState<string | null>(null)

  // 검색 조건 — 빠른검색(계약번호)이 있으면 우선, 없으면 상세필터 값.
  const req = useMemo(() => {
    const srngYmd = filter.srngYmd as DateRangeValue | undefined
    return {
      ctrtNo: appliedCtrtNo ?? String(filter.ctrtNo ?? ''),
      blNo: String(filter.blNo ?? ''),
      invcNo: String(filter.invcNo ?? ''),
      srngYmdFrom: srngYmd?.start ?? '',
      srngYmdTo: srngYmd?.end ?? '',
    }
  }, [appliedCtrtNo, filter])
  const { data: listData, isLoading } = wmQueries.useSelectPaymentList(req)

  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedCtrtNo(null)
  }
  const handleQuickSearch = () => {
    setAppliedCtrtNo(keyword.trim())
    setPage(1)
  }

  const list = listData?.list ?? []
  const total = list.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = list.slice(0, loaded)

  // 카드 매핑 — slide99: 표시레이블(INVOICE/지출상태/진행상태) + 문서 정보(B/L번호·계약번호) +
  // 행(L/C·지불의뢰금액·지체상금·실지급액·심사일자·이체일자·지불일자).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.invcNo}</Badge>
        <Badge>{it.expndStts}</Badge>
        <Badge>{it.prgrsSttn}</Badge>
      </>
    ),
    subtitle: `B/L번호 ${it.blNo}`,
    title: `계약번호 ${it.ctrtNo}`,
    rows: [
      { label: 'L/C', value: it.lcNo },
      { label: '지불의뢰금액', value: fmtAmt(it.dfryAmt, it.cmcUnit) },
      { label: '지체상금', value: fmtAmt(it.arrsPrmny, it.cmcUnit) },
      { label: '실지급액', value: fmtAmt(it.giveAmt, it.cmcUnit) },
      { label: '심사일자', value: it.srngYmd },
      { label: '이체일자', value: it.payYmd || '-' },
      { label: '지불일자', value: it.dfryYmd || '-' },
    ],
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 계약번호 빠른검색 + 상세필터(P76) */}
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
          placeholder="검색할 내용을 입력하세요."
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
        onTop={() => document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* 상세필터 풀팝업(P76) */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={WM_OVS_DFRY_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
OvsRtnPymtDfryInfoPage.displayName = 'OvsRtnPymtDfryInfoPage'
