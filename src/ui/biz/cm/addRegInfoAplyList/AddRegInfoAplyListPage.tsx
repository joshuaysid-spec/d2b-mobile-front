// 추가정보 신청 목록 (MUI-CM-01-M03, addRegInfoAplyList). 설계서 00.공통 v0.84 slide137~139(문서 P136~138).
//   웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 추가정보 신청 목록(> 검색필터 P24).
//   ⚠️ 디자인(Figma) 없음 → 설계서(pptx)로 작업, 간격은 기존 목록 화면(ItrstBidPbanc) 참고.
//
// 구성(위→아래): 현재 업체 정보 표시 영역(SummaryInfo) → 상단바(검색필터 버튼 + 표시개수, ListSectionHeader)
//   → 카드 리스트(추가정보구분·처리상태 배지 + 접수번호 + 업무구분/전화번호/신청일자) → 더보기(loaded/258)
//   → 맨위로 FAB → 검색필터 풀팝업(P24, 공통 SearchFilter 재사용).
//   카드 클릭 → 처리상태 무관 상세(T05 물품(내자)신청 / T06 국내소재상사신청) — 상세 미구현이라 현재 스텁(console.log).
//
// 데이터=파일 내 목업(설계서 slide139 데이터영역 항목명/형식), 동작=API 경계 스텁(console.log + '// 추후 …').
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { ROUTES } from '@/constants/routes'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { BzentySummaryCard } from '@/ui/biz/cm/bzentyInfo/BzentySummaryCard'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type {
  SearchFilterSchema,
  SearchFilterValue,
  DateRangePresetDef,
  DateRangeValue,
} from '@/types/search-filter'
import type { AddRegInfoAplyItem } from '@/types/mock/cm'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── 현재 업체 정보 표시 영역 (설계서 slide137 상단 블록) ──────────────────────
// 로그인 업체 요약(업체코드/상호명/대표자/사업자등록번호/주소/등록구분). M03 데이터영역이 아닌
// 로그인 업체 횡단 정보라 페이지 목업으로 둔다 — 추후 authStore(로그인 업체) 또는 업체정보 조회로 주입.
//   업체코드(bzentyCd)·상호명(bzentyNm)·사업자등록번호(brno)·주소(bzentyAddr)는 업체일반(BzentyGnrlInfo) 항목명 준수.
//   ⚠️ 대표자(rprsvNm)·등록구분(regSeNm)은 이 화면 데이터영역에 없어 잠정 영문키(화면 표기 기준).
const BZENTY = {
  bzentyCd: '7004F',
  bzentyNm: '주식회사 국방전자조달',
  rprsvNm: '홍길동',
  brno: '123-45-67890',
  bzentyAddr: '서울특별시 중구 세종대로 110 (태평로 1가)',
  regSeNm: '물품(내자)',
}

// ── 검색필터 schema (P24, 설계서 slide138 검색조건 dm_searchInfo) ─────────────
// 기간설정*(dateRange, 빠른설정 최근 1/3/6개월, 기본 1개월) + 검색어(품명) + 구분설정(처리상태 select).
//   ('구분' select 는 요청으로 삭제 — 2026-08-05)
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '최근 1개월', months: 1 },
  { label: '최근 3개월', months: 3 },
  { label: '최근 6개월', months: 6 },
]
// 처리상태(prgrsSttsNm) — 전체('A')/접수('U')/반송('R')/승인('F'). 개별 값은 카드 표시명과 일치시켜 목업 필터에 그대로 사용.
//   '전체'는 Radix Select.Item 이 빈 문자열 value 를 금지하므로 sentinel 'ALL'(=코드 'A')로 둔다(빈 값 대신 무필터 표식).
const ALL = 'ALL'
const PRGRS_STTS_OPTIONS = [
  { value: ALL, label: '전체' },
  { value: '접수', label: '접수' },
  { value: '반송', label: '반송' },
  { value: '승인', label: '승인' },
]
const SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'period',
      title: '기간 설정',
      fields: [{ type: 'dateRange', key: 'aplyYmd', label: '검색 기간', required: true, presets: DATE_PRESETS }],
    },
    {
      key: 'keyword',
      title: '검색어',
      fields: [{ type: 'text', key: 'itemNm', label: '품명', placeholder: '품명을 입력하세요.' }],
    },
    {
      key: 'divide',
      title: '구분 설정',
      fields: [{ type: 'select', key: 'prgrsSttsNm', label: '처리상태', options: PRGRS_STTS_OPTIONS }],
    },
  ],
}
// 기본값 — 기간 최근 1개월(slide138 '기본값 1개월'), 처리상태 전체, 품명 공백.
const RECENT_1M = (): DateRangeValue => ({
  start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
  end: dayjs().format(DATE_FORMAT),
})
const SEARCH_DEFAULT: SearchFilterValue = {
  aplyYmd: RECENT_1M(),
  prgrsSttsNm: ALL,
  itemNm: '',
}

// ── 목업 (설계서 slide137 예시 + slide139 데이터영역 dl_resultList 항목명/형식) ────
const TOTAL = 258 // 총 건수(목업 — slide137 더보기 10/258)
const dl_resultList: AddRegInfoAplyItem[] = [
  {
    id: '1',
    rcptNo: '2020101010',
    aplyYmd: '2020-10-10',
    rprsvTelno: '02-1234-5678',
    bizCdNm: '물품(내자)',
    addInfoCdNm: '물품(내자)',
    prgrsSttsNm: '접수',
  },
  {
    id: '2',
    rcptNo: '2020101011',
    aplyYmd: '2020-10-09',
    rprsvTelno: '02-2345-6789',
    bizCdNm: '공사',
    addInfoCdNm: '국내소재상사',
    prgrsSttsNm: '승인',
  },
  {
    id: '3',
    rcptNo: '2020101012',
    aplyYmd: '2020-10-08',
    rprsvTelno: '02-3456-7890',
    bizCdNm: '용역',
    addInfoCdNm: '물품(내자)',
    prgrsSttsNm: '반송',
  },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 아래 filteredList/visibleList 로직을 서버 조회로 교체(cmService.selectBzentyInfoAddRegAplyList).
const MOCK_LIST: AddRegInfoAplyItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dl_resultList[i % dl_resultList.length]
  return { ...base, id: String(i + 1), rcptNo: `${base.rcptNo}${String(i + 1).padStart(2, '0')}`.slice(0, 12) }
})

export function AddRegInfoAplyListPage() {
  const navigate = useNavigate()
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState<SearchFilterValue>(SEARCH_DEFAULT)
  const [filterApplied, setFilterApplied] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  // ── 동작 스텁 (API 연동 시 services/cm·queries/cm 로 교체) ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    console.log('[AddRegInfoAply] 검색필터', value) // 추후: cmService.selectBzentyInfoAddRegAplyList(toRequest(value))
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[AddRegInfoAply] pageSize →', size)
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[AddRegInfoAply] loadMore → page', next)
  }
  // 카드 클릭 → 처리상태 무관 상세(T05 물품(내자)신청 / T06 국내소재상사신청, 설계서 slide137).
  //   항목을 navigate state 로 넘겨 상세 상단(접수정보)을 그린다. 추가정보구분(addInfoCdNm)별 T05/T06 분기는 상세 페이지가 처리.
  const handleCardClick = (item: AddRegInfoAplyItem) => {
    navigate(ROUTES.ADD_REG_INFO_APLY_DETAIL, { state: item })
    console.log('[AddRegInfoAply] 상세 이동(T05/T06 분기)', item.rcptNo, item.addInfoCdNm)
  }

  // ── ⚠️ 임시 목업 필터/페이징 (API 연동 시 이 블록 통째로 삭제 후 재작성) ⚠️ ──────────
  //   처리상태(prgrsSttsNm)는 카드 필드라 로컬 필터. 기간(aplyYmd)·품명(itemNm)은 목업 단계 미필터
  //   (API 연동 시 기간 FROM~TO 범위·품명 부분일치 서버 조회). 검색 미실행이면 전체.
  const filteredList = useMemo(() => {
    const stts = filter.prgrsSttsNm as string
    return MOCK_LIST.filter((it) => stts === ALL || it.prgrsSttsNm === stts)
  }, [filter])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = useMemo(() => filteredList.slice(0, loaded), [filteredList, loaded])

  // 목업 → Card props 매핑. 접수번호(제목)는 번호만 primary 색(설계서 강조). 추가정보구분·처리상태는 배지.
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.addInfoCdNm}</Badge>
        <Badge>{it.prgrsSttsNm}</Badge>
      </>
    ),
    title: (
      <>
        접수번호 <span className="text-krds-text-primary-active">{it.rcptNo}</span>
      </>
    ),
    rows: [
      { label: '업무구분', value: it.bizCdNm },
      { label: '전화번호', value: it.rprsvTelno },
      { label: '신청일자', value: it.aplyYmd },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 현재 업체 정보 표시 영역 — 업체정보 상세(M02) 리디자인과 동일한 요약 카드(260827 사용자 확정). */}
      <div className="p-4 pb-0">
        <BzentySummaryCard
          name={BZENTY.bzentyNm}
          code={BZENTY.bzentyCd}
          infos={[
            { label: '대표자', value: BZENTY.rprsvNm },
            { label: '사업자등록번호', value: BZENTY.brno },
            { label: '주소', value: BZENTY.bzentyAddr },
            { label: '등록구분', value: BZENTY.regSeNm },
          ]}
        />
      </div>

      {/* 상단바(list section_top) — 좌: 검색필터 버튼 / 우: 표시개수 셀렉트. */}
      <ListSectionHeader
        className="px-4 pt-4"
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
        leftSlot={
          <Button variant="secondary" onClick={() => setFilterOpen(true)} aria-pressed={filterApplied}>
            <Icon name="Tune" aria-hidden />
            검색필터
          </Button>
        }
      />

      {/* 카드 리스트 — px16, 카드 간 16(krds-8). */}
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-4">
        <CardList items={cardItems} emptyText="신청 내역이 없습니다." />
      </div>

      {/* 더보기 (loaded/total). 모두 노출되면 숨김. */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total})
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() => document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* 검색필터 풀팝업 (P24, slide138 검색조건) — 공통 SearchFilter 재사용(schema 주입). */}
      <SearchFilter
        open={filterOpen}
        onOpenChange={setFilterOpen}
        schema={SEARCH_SCHEMA}
        value={filter}
        defaultValue={SEARCH_DEFAULT}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
AddRegInfoAplyListPage.displayName = 'AddRegInfoAplyListPage'
