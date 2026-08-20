// 실적증명서 신청 목록 — MUI-CM-04-M06. 설계서 00.공통 v0.84 slide240~242 (화면 목록 slide212).
// 고객센터 > 민원서류발급신청(M04 허브) 하위의 검색 + 카드 목록 화면.
// Figma 전용 프레임 없음 → 목록 컨벤션 레퍼런스 PrcmPlanIntgListPage 표준 조립:
//   업무도움(Infobox) + 검색조건(SearchCondition) + 목록헤더 + 카드(CardList) + 더보기 + FAB.
// 검색필터(MUI-CM-04-P33)는 공통 SearchFilter 셸에 schema 주입 — 별도 풀팝업/검색시트 파일 없음.
// (+) FAB → "실적증명서 신청" 바텀시트(공통 BottomSheet + ButtonGroup 인라인 — *Sheet 래퍼 금지).
// 상세(M07)·신청 플로우(M08/P21) 미구현 → 카드 클릭·신청 버튼은 console.log 스텁.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { ROUTES } from '@/constants/routes'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type {
  SearchFilterSchema,
  SearchFilterValue,
  DateRangePresetDef,
} from '@/types/search-filter'
import type { PrfmncPrdocItem, PrfmncPrdocSearchFilter } from '@/types/cm'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── MUI-CM-04-P33 검색필터 schema (설계서 slide240) ──────────────────────────
// 기간 설정*(빠른 설정 최근 1/3/6개월) · 구분 설정(처리상태) · 검색어(계약번호).

// 빠른 설정 칩 — slide240 "최근 1개월/3개월/6개월".
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '최근 1개월', months: 1 },
  { label: '최근 3개월', months: 3 },
  { label: '최근 6개월', months: 6 },
]

// 처리상태(prcsStts) 옵션 — 설계서: 전체/신청/접수/처리중/발급/반려/보류.
// value 코드값 미정(자리수 1) — 백엔드 공통코드 확정 시 교체.
const PRCS_STTS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'apply', label: '신청' },
  { value: 'receipt', label: '접수' },
  { value: 'processing', label: '처리중' },
  { value: 'issued', label: '발급' },
  { value: 'rejected', label: '반려' },
  { value: 'hold', label: '보류' },
]

const SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'date',
      title: '기간 설정',
      fields: [
        // 상단 세그먼트 — 날짜 유형 지표(검색 기간). 기간 값 키는 aplyYmd(=aplyYmdFrom/To 쌍).
        {
          type: 'segment',
          key: 'dateType',
          options: [{ value: 'aplyYmd', label: '검색 기간' }],
        },
        { type: 'dateRange', key: 'aplyYmd', required: true, presets: DATE_PRESETS },
      ],
    },
    {
      key: 'keyword',
      title: '검색어',
      fields: [
        { type: 'text', key: 'ctrtNo', label: '계약번호', placeholder: '계약번호를 입력하세요.' },
      ],
    },
    {
      key: 'category',
      title: '구분 설정',
      fields: [
        {
          type: 'select',
          key: 'prcsStts',
          label: '처리상태',
          placeholder: '전체',
          options: PRCS_STTS_OPTIONS,
        },
      ],
    },
  ],
}

// 초기/초기화 기준값 — 기간은 최근 1개월(slide240 목업 범위도 1개월).
function buildDefaultValue(): PrfmncPrdocSearchFilter {
  return {
    aplyYmd: {
      start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
      end: dayjs().format(DATE_FORMAT),
    },
    ctrtNo: '',
    prcsStts: 'all',
  }
}

// 빠른검색 대상 칩 — slide240 "계약번호 ∨" 1종.
const SEARCH_TARGETS = [{ value: 'ctrtNo', label: '계약번호' }]

// ── 목업 (dl_resultList, slide240·241 형식 그대로 — API 연동 시 교체) ─────────
// 시드 2건 = slide240 표시값. 나머지는 처리상태/계약구분 변형(항목 형식 유지).
const dl_resultList: PrfmncPrdocItem[] = [
  {
    prfmncRcptNo: '2025NC00179',
    ctrtNo: '2025093455',
    ctrtSe: '물품',
    ctrtNm: '파카,외피 구매계약',
    rprsItemNm: '파카,외피',
    ctrtAmt: 11616000,
    orderInst: '방위사업청',
    aplyYmd: '2026-03-05',
    prcsYmd: undefined,
    prgrsStcd: '신청',
  },
  {
    prfmncRcptNo: '2026NC00590',
    ctrtNo: '2026-00590',
    ctrtSe: '공사',
    ctrtNm: '26-평 절개지 복구공사',
    rprsItemNm: '-',
    ctrtAmt: 11616000,
    orderInst: '방위사업청',
    aplyYmd: '2026-03-10',
    prcsYmd: '2026-03-20',
    prgrsStcd: '발급',
  },
  {
    prfmncRcptNo: '2026NC00611',
    ctrtNo: '2026101234',
    ctrtSe: '물품',
    ctrtNm: '전투화 구매계약',
    rprsItemNm: '전투화',
    ctrtAmt: 33500000,
    orderInst: '방위사업청',
    aplyYmd: '2026-04-02',
    prcsYmd: undefined,
    prgrsStcd: '접수',
  },
  {
    prfmncRcptNo: '2026NC00652',
    ctrtNo: '2026105678',
    ctrtSe: '물품',
    ctrtNm: 'K5방독면 정비부속 구매',
    rprsItemNm: 'K5방독면',
    ctrtAmt: 92472000,
    orderInst: '국방부',
    aplyYmd: '2026-04-15',
    prcsYmd: undefined,
    prgrsStcd: '처리중',
  },
  {
    prfmncRcptNo: '2026NC00701',
    ctrtNo: '2026109012',
    ctrtSe: '공사',
    ctrtNm: '26-정비고 증축공사',
    rprsItemNm: '-',
    ctrtAmt: 210000000,
    orderInst: '방위사업청',
    aplyYmd: '2026-05-01',
    prcsYmd: '2026-05-08',
    prgrsStcd: '반려',
  },
  {
    prfmncRcptNo: '2026NC00733',
    ctrtNo: '2026113456',
    ctrtSe: '물품',
    ctrtNm: '통신장비 구매계약',
    rprsItemNm: '무전기',
    ctrtAmt: 47200000,
    orderInst: '해군본부',
    aplyYmd: '2026-05-20',
    prcsYmd: undefined,
    prgrsStcd: '보류',
  },
]

// ⚠️ 임시 목업 — API 연동 시 MOCK_LIST·filteredList·visibleList 블록을 통째로 삭제하고
//   서버 조회(page/pageSize/keyword 파라미터) 누적 로직으로 재작성한다(PrcmPlanIntgListPage 동일).
const TOTAL = 40
const MOCK_LIST: PrfmncPrdocItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dl_resultList[i % dl_resultList.length]
  // 접수번호는 목록 key 라 고유해야 함 — 인덱스 접미로 구분(형식 유지).
  return {
    ...base,
    prfmncRcptNo: `${base.prfmncRcptNo.slice(0, 6)}${String(i + 100).padStart(5, '0')}`,
  }
})

export function PrfmncPrdocPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 검색필터 풀팝업
  const [aplySheetOpen, setAplySheetOpen] = useState(false) // (+) 실적증명서 신청 바텀시트
  // 스프레드 — 인터페이스(PrfmncPrdocSearchFilter)를 SearchFilterValue(Record)로 넘기기 위함(BoardListView 동일).
  const [filter, setFilter] = useState<SearchFilterValue>(() => ({ ...buildDefaultValue() }))
  const [keyword, setKeyword] = useState('') // 빠른검색어(입력 중)
  const [targets, setTargets] = useState<string[]>(['ctrtNo'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  // 빠른검색 확정값 — 검색 실행(버튼/Enter) 시에만 목록에 반영.
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string } | null>(null)

  const defaultValue = useMemo<SearchFilterValue>(() => ({ ...buildDefaultValue() }), [])

  // ── API 경계 스텁 (백엔드 연동 시 services/cm 조회로 대체) ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
    console.log('[PrfmncPrdoc] 상세필터 검색', value)
    // 추후 API: cmService.selectPrfmncPrdocAplyList({ aplyYmdFrom, aplyYmdTo, ctrtNo, prcsStts })
  }
  const handleQuickSearch = () => {
    setAppliedSearch({ keyword: keyword.trim() })
    setPage(1)
    console.log('[PrfmncPrdoc] 빠른검색(계약번호)', keyword)
    // 추후 API: cmService.selectPrfmncPrdocAplyList({ ctrtNo: keyword })
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[PrfmncPrdoc] pageSize →', size)
  }
  const handleLoadMore = () => {
    setPage(page + 1)
    console.log('[PrfmncPrdoc] loadMore → page', page + 1)
  }
  const handleCardClick = (item: PrfmncPrdocItem) => {
    // 실적증명서확인(상세, MUI-CM-04-M07) — 클릭 항목을 state 로 전달(목록→상세 표준).
    navigate(ROUTES.SUPPORT_PRFMNC_PRDOC_DTL, { state: item })
  }
  const handleAply = () => {
    setAplySheetOpen(false)
    // 실적증명서 신청 플로우(MUI-CM-04-P21 계약선택 → M12 → T12/T13)
    navigate(ROUTES.SUPPORT_PRFMNC_PRDOC_REG)
  }

  // ── ⚠️ 임시 목업 검색/페이징 (API 연동 시 블록 삭제) ──
  const filteredList = useMemo(() => {
    if (!appliedSearch || !appliedSearch.keyword) return MOCK_LIST
    const kw = appliedSearch.keyword.toLowerCase()
    return MOCK_LIST.filter((it) => it.ctrtNo.toLowerCase().includes(kw))
  }, [appliedSearch])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 목업 → Card props 매핑 (slide240 카드: 배지 '계약구분'·진행상태 / 접수·계약번호 / 품명 /
  //   실적 신청금액·발급기관·신청일자·처리일자). 타이틀: 물품=대표품명 · 공사=계약건명(목업 표기).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.prfmncRcptNo,
    // 배지 — 계약구분 값(물품/공사) + 진행상태 값(신청/발급 등). 상세(M07) SummaryInfo 배지와 동일 구성.
    badges: (
      <>
        <Badge>{it.ctrtSe}</Badge>
        <Badge>{it.prgrsStcd}</Badge>
      </>
    ),
    subtitle: `접수번호 ${it.prfmncRcptNo} · 계약번호 ${it.ctrtNo}`,
    title: it.ctrtSe === '공사' ? it.ctrtNm : it.rprsItemNm,
    rows: [
      { label: '실적 신청금액', value: `${it.ctrtAmt.toLocaleString()} 원` },
      { label: '발급기관', value: it.orderInst },
      { label: '신청일자', value: it.aplyYmd },
      { label: '처리일자', value: it.prcsYmd ?? '-' },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 업무도움 — full-bleed 블루 바(목록 화면 공통) */}
      <Infobox
        className="rounded-none"
        title="업무도움"
        items={[
          '비밀번호 자동완성기능(ex. 알패스 등)은 사용할 수 없습니다.',
          '1577-1118 대표전화로 전화주세요. 서비스에 로그인할 수 있도록 도와드리겠습니다.',
        ]}
      />

      {/* 검색영역 — 빠른검색어 + 대상 칩(계약번호) + 검색필터 버튼 */}
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

      {/* 목록 헤더 — 총건수 · 표시 개수 */}
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

      {/* 더보기 (loaded/total). 모두 노출됐으면 숨김. */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* FAB — 맨위로(top) + 신청(+). (+)는 실적증명서 신청 바텀시트(설계서: 버튼 1종). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
        onPlus={() => setAplySheetOpen(true)}
        plusLabel="실적증명서 신청"
      />

      {/* 실적증명서 신청 바텀시트 — 컨테이너는 페이지 소유(공통 BottomSheet 조립) */}
      <BottomSheet
        open={aplySheetOpen}
        onOpenChange={setAplySheetOpen}
        title="실적증명서 신청"
      >
        <ButtonGroup
          layout="vertical"
          items={[{ label: '실적증명서 신청', variant: 'secondary', onClick: handleAply }]}
        />
      </BottomSheet>

      {/* 검색필터 풀팝업(MUI-CM-04-P33) — 공통 셸 schema 주입 */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={SEARCH_SCHEMA}
        value={filter}
        defaultValue={defaultValue}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
PrfmncPrdocPage.displayName = 'PrfmncPrdocPage'
