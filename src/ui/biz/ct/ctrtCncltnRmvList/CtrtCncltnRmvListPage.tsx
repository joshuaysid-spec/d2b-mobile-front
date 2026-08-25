// 해지/해제 목록 — MUI-CT-03-M01. 설계서 03.계약 v0.83 slide104~107.
// 구성: 검색조건(SearchCondition, 대상칩 계약명/계약번호 + 필터버튼→풀팝업 MUI-CT-03-P07)
//      + 목록헤더(총건수·page size) + 카드 리스트(CardList) + 더보기 + 맨위로 FAB.
// 데이터: ctQueries.useSelectCtrtCncltnRmvListInq(queries/ct) — 목업/실연동은 ctService(USE_MOCK)가 전환. 목업은 mocks/ct.ts.
// 카드 클릭 → 계약유형(dtlRouteCd)별 상세 분기(slide107): M02 물품일반 · M03 총액제 · M04 단가제
//   · M05 수정계약 · M06 공사계약.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { CncltnRmvListItem } from '@/types/mock/ct'

const DATE_FORMAT = 'YYYY-MM-DD'

// 진행상태 옵션 — slide104 표시레이블(상위코드: CTMC, 확정 시 코드값 교체).
const CNCLTN_RMV_PRGRS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'docReq', label: '서류요청' },
  { value: 'docReg', label: '서류등록' },
  { value: 'docRjct', label: '서류반려' },
  { value: 'cnclsDmnd', label: '체결의뢰' },
]

// 해지구분 옵션 — slide106 (상위코드: UB52, 1:해지 2:해제).
const CNCLTN_RMV_SECD_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'cncltn', label: '해지' },
  { value: 'rmv', label: '해제' },
]

// 일자 프리셋 칩 — 최근 1/3/6개월.
const DATE_PRESETS = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

// MUI-CT-03-P07 검색필터 schema — 검색조건 항목명(slide106 1.1) 그대로. 업무구분 국외 제외(slide105).
const CNCLTN_RMV_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'taskSeNm',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSeNm',
          required: true, // 필수값(slide105) — default 전체
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
        {
          type: 'dateRange',
          key: 'cncltnRmvYmd',
          label: '해지해제 일자',
          presets: DATE_PRESETS,
        },
        { type: 'dateRange', key: 'ctrtYmd', label: '계약일자', presets: DATE_PRESETS },
      ],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'ctrtNm', label: '계약건명', placeholder: '계약건명을 입력하세요.' },
        // 계약번호 — 계약번호검색 공통시트(slide106 비고). 셸이 시트를 직접 연다.
        {
          type: 'selectionField',
          key: 'ctrtNo',
          label: '계약번호',
          placeholder: '번호를 선택하세요.',
          searchSheet: 'ctrtNo',
        },
      ],
    },
    {
      key: 'category',
      title: '구분 설정',
      fields: [
        {
          type: 'select',
          key: 'ctrtPrgrsStcd',
          label: '진행상태',
          placeholder: '전체',
          options: CNCLTN_RMV_PRGRS_OPTIONS,
        },
        {
          type: 'select',
          key: 'cncltnRmvSecd',
          label: '해지구분',
          placeholder: '전체',
          options: CNCLTN_RMV_SECD_OPTIONS,
        },
      ],
    },
  ],
}

const RECENT_1M = () => ({
  start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
  end: dayjs().format(DATE_FORMAT),
})

// On-Load 기본값(slide105): 해지해제일자·계약일자 = 현재일-1개월 ~ 현재일, 업무구분 = 전체.
function buildDefaultValue(): SearchFilterValue {
  return {
    taskSeNm: ['0', 'goods', 'service', 'construction'], // 전체('0' = 전체 코드값)
    cncltnRmvYmd: RECENT_1M(),
    ctrtYmd: RECENT_1M(),
    ctrtNm: '',
    ctrtNo: '',
    ctrtPrgrsStcd: 'all',
    cncltnRmvSecd: 'all',
  }
}

// 빠른검색 대상 칩 — slide104 목업(계약명/계약번호).
const SEARCH_TARGETS = [
  { value: 'ctrtNm', label: '계약명' },
  { value: 'ctrtNo', label: '계약번호' },
]

// 카드 클릭 → 계약유형별 상세 경로(slide107). 식별자는 URL 이 아니라 navigate state 로 전달.
const DETAIL_PATH: Record<CncltnRmvListItem['dtlRouteCd'], string> = {
  gnrl: '/ct/cmdtyCtrtCncltnRmvDtl',
  gramt: '/ct/cncltnRmvGnrlCtrtGramtDtl',
  untprc: '/ct/cncltnRmvGnrlCtrtUntprcDtl',
  mdfcn: '/ct/cncltnRmvMdfcnCtrtDtl',
  cstrn: '/ct/cstrnCtrtCncltnRmvDtl',
}

export function CtrtCncltnRmvListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업(MUI-CT-03-P07)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('') // 빠른검색어(입력 중)
  const [targets, setTargets] = useState<string[]>(['ctrtNm']) // 빠른검색 대상(single)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  // 빠른검색 확정값 — 검색 실행(버튼/Enter) 시에만 반영(입력 중에는 목록을 거르지 않음).
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  const { data: listData } = ctQueries.useSelectCtrtCncltnRmvListInq()

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
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
  }
  const handleLoadMore = () => {
    setPage(page + 1)
  }
  const handleCardClick = (item: CncltnRmvListItem) => {
    navigate(DETAIL_PATH[item.dtlRouteCd], { state: item })
  }

  // ── 키워드 필터 + 더보기 슬라이스 — 클라이언트 로직(서버 페이징 전환 시 이 블록 삭제) ──
  const filteredList = useMemo(() => {
    const list = listData?.list ?? []
    if (!appliedSearch || !appliedSearch.keyword) return list
    const kw = appliedSearch.keyword.toLowerCase()
    return list.filter((it) => {
      const field =
        appliedSearch.target === 'ctrtNm' ? it.ctrtNm : `${it.ctrtNo}-${it.ctrtCycl}`
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch, listData])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 카드 매핑(slide104) — 뱃지(업무구분/계약방법/입찰구분/계약상태) + subtitle(판단·공사번호/계약번호)
  //   + title(계약건명) + 행(계약일자/해지해제일자/발주기관/계약금액).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSecd}</Badge>
        <Badge>{it.ctrtMthdCd}</Badge>
        <Badge>{it.bidMthdCd}</Badge>
        <Badge>{it.cncltnRmvStatNm}</Badge>
      </>
    ),
    subtitle: `${it.taskSecd === '공사' ? '공사번호' : '판단번호'} ${it.prcmNo} / 계약번호 ${it.ctrtNo} - ${it.ctrtCycl}`,
    title: it.ctrtNm,
    rows: [
      { label: '계약일자', value: it.ctrtYmd },
      { label: '해지해제일자', value: it.cncltnRmvYmd },
      { label: '발주기관', value: it.orderInstNm },
      { label: '계약금액', value: `${it.ctrtAmt.toLocaleString()} 원` },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 대상칩(계약명/계약번호) + 필터버튼 + 검색어 입력 + 검색 버튼 */}
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

      {/* 목록 헤더 — 총건수 + 표시개수(10/30/50, slide104) */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 카드 목록 */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} />
      </div>

      {/* 더보기 — 표시개수만큼 추가 로드. 모두 노출됐으면 숨김. */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 상세필터 풀팝업(MUI-CT-03-P07) — 공통 SearchFilter 셸에 schema 주입 */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={CNCLTN_RMV_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
CtrtCncltnRmvListPage.displayName = 'CtrtCncltnRmvListPage'
