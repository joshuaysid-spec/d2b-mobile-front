// 입찰진행 목록 (MUI-BD-03-M01, 설계서 slide66·68). "조달업체가 신청한 입찰 내역" 목록.
// 레퍼런스: 입찰공고 통합목록 BidPbancIntgListPage (구성·상태·페이징 동일 패턴).
// 구성: 업무도움(Infobox) + 검색조건(SearchCondition, 필터버튼→풀팝업) + 목록헤더 + 카드 리스트 + 더보기 + FAB.
// 데이터/페이징/검색은 페이지 소유. 목록은 목업(dlt_bidPrgrsList, 항목명 설계서 그대로) — 추후 bdService.getBidProgressList.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type {
  DateRangePresetDef,
  SearchFilterSchema,
  SearchFilterValue,
} from '@/types/search-filter'
import type { BidPrgrsItem } from '@/types/bd'

// 빠른검색 대상 — 설계서 검색조건(공고명/공고번호).
const SEARCH_TARGETS = [
  { value: 'bidNm', label: '공고명' },
  { value: 'pbancNo', label: '공고번호' },
]

// 상세필터 schema — 설계서 검색조건(dm_searchInfo): 업무구분/개찰일자/입찰건명/발주기관/통합참조번호.
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
  { label: '12개월', months: 12 },
  { label: '기간검색', custom: true },
]
const PRGRS_FILTER_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'taskSecd',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSecd',
          selectAll: true,
          options: [
            { value: 'goods', label: '물품' },
            { value: 'service', label: '용역' },
            { value: 'construction', label: '공사' },
            { value: 'foreign', label: '국외' },
          ],
        },
      ],
    },
    {
      key: 'bdopnYmd',
      title: '개찰일자',
      fields: [{ type: 'dateRange', key: 'bdopnYmd', presets: DATE_PRESETS }],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'bidNm', label: '입찰건명', placeholder: '입찰건명을 입력하세요.' },
        // 발주기관 → 발주부서(기관)검색(공통 시트)
        { type: 'selectionField', key: 'orderInstNm', label: '발주기관', placeholder: '발주기관을 입력하세요.', searchSheet: 'dept' },
        { type: 'text', key: 'rfrncNo', label: '통합참조번호', placeholder: '통합참조번호를 입력하세요.' },
      ],
    },
  ],
}
const DEFAULT_FILTER: SearchFilterValue = {
  taskSecd: [],
  bdopnYmd: { start: '', end: '' },
  bidNm: '',
  orderInstNm: '',
  rfrncNo: '',
}

// 입찰진행 목록 데이터(설계서 slide68 dlt_bidPrgrsList) — 목업, 추후 bdService.getBidProgressList.
const dlt_bidPrgrsList: BidPrgrsItem[] = [
  {
    rNum: '1',
    taskSeNm: '물품',
    pbancNo: '2026LGM000604191-01',
    prcmNo: '2026LGM000604191',
    bidNm: '(26-물품-04) 간편한 아침식 제조 및 납품',
    rfrncNo: '2026LGM56349',
    orderInstTelno: '02-1234-5678',
    ctrtMthdNm: '경쟁입찰',
    bidMthdNm: '전자입찰',
    bidClrsDt: '2026-03-16 15:00',
    tndrSbmsnDdlnDt: '2026-03-17 15:00',
    bzentySeNm: '대표',
    bfhdSrng: true,
    bidPrgrsApfr: true,
    tndr: false,
  },
  {
    rNum: '2',
    taskSeNm: '물품',
    pbancNo: '2026LGM000598220-01',
    prcmNo: '2026LGM000598220',
    bidNm: '(26-용역-12) 정보화시스템 유지관리 용역',
    rfrncNo: '2026LGM58220',
    orderInstTelno: '02-2345-6789',
    ctrtMthdNm: '공개수의',
    bidMthdNm: '전자입찰',
    bidClrsDt: '2026-03-10 15:00',
    tndrSbmsnDdlnDt: '2026-03-11 15:00',
    bzentySeNm: '대표',
    bfhdSrng: false,
    bidPrgrsApfr: false,
    tndr: true,
  },
]

const TOTAL = 2010 // 총 건수(목업 — 실제 API total)
const MOCK_LIST: BidPrgrsItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dlt_bidPrgrsList[i % dlt_bidPrgrsList.length]
  return { ...base, rNum: String(i + 1), pbancNo: `${base.pbancNo.slice(0, -3)}-${i + 1}` }
})

// 신청유형 배지(설계서 slide66: 사전심사/입찰참가/견적서) — 해당 플래그가 true 인 것만.
function aplyBadges(it: BidPrgrsItem): string[] {
  const out: string[] = []
  if (it.bfhdSrng) out.push('사전심사')
  if (it.bidPrgrsApfr) out.push('입찰참가')
  if (it.tndr) out.push('견적서')
  return out
}

export function BidPrgrsListForBzentyPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT_FILTER)
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['bidNm'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  // ── API 경계 스텁 (백엔드 연동 시 services/bd 로 대체) ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
    console.log('[BidPrgrs] 상세필터 검색', value)
  }
  const handleQuickSearch = () => {
    const target = targets[0] ?? 'bidNm'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
    console.log('[BidPrgrs] 빠른검색', { keyword, target })
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[BidPrgrs] pageSize →', size)
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[BidPrgrs] loadMore → page', next)
  }
  const handleCardClick = (it: BidPrgrsItem) => {
    navigate(`/bd/prgrs/${it.rNum}`) // 입찰진행 상세(MUI-BD-03-M02). 결과/작성 화면은 상세의 보기 버튼에서 연계.
  }

  // ── 임시 목업 검색/페이징 (API 연동 시 통째로 교체) ──
  const filteredList = useMemo(() => {
    if (!appliedSearch || !appliedSearch.keyword) return MOCK_LIST
    const kw = appliedSearch.keyword.toLowerCase()
    return MOCK_LIST.filter((it) => {
      const field = appliedSearch.target === 'pbancNo' ? it.pbancNo : it.bidNm
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.rNum,
    badges: (
      <>
        <Badge>{it.taskSeNm}</Badge>
        <Badge>{it.ctrtMthdNm}</Badge>
        {aplyBadges(it).map((b) => (
          <Badge key={b}>{b}</Badge>
        ))}
      </>
    ),
    subtitle: `공고번호 ${it.pbancNo}`,
    title: it.bidNm,
    rows: [
      { label: '계약방법', value: it.ctrtMthdNm },
      { label: '입찰참가등록 마감일시', value: it.bidClrsDt },
      { label: '입찰서접수 마감일시', value: it.tndrSbmsnDdlnDt },
      { label: '발주기관연락처', value: it.orderInstTelno },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      <Infobox
        className="rounded-none"
        title="업무도움"
        items={[
          '조달업체가 신청한 입찰 내역을 조회하는 화면입니다.',
          '상세 정보 보기를 누르면 신청한 입찰의 상세 내역을 확인할 수 있습니다.',
        ]}
      />

      <SectionTitle as="h2" bgColor="blue">
        검색조건
      </SectionTitle>
      <div className="px-4 py-4">
        <SearchCondition
          targets={SEARCH_TARGETS}
          selectedTargets={targets}
          onTargetsChange={setTargets}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onFilterClick={() => setOpen(true)}
          onSearch={handleQuickSearch}
        />
      </div>

      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} />
      </div>

      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
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
        schema={PRGRS_FILTER_SCHEMA}
        value={filter}
        defaultValue={DEFAULT_FILTER}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
