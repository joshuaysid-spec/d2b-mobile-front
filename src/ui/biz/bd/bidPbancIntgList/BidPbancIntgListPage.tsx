// 입찰공고 통합목록(MUI-BD-01-M01, node 9300-36931). Design Ref: 02입찰 설계서 1.1~1.4.
// 레퍼런스: 조달계획 통합목록 PrcmPlanIntgListPage (구성·상태·페이징 동일 패턴).
// 구성: 업무도움(Infobox) + 검색조건(SearchCondition, 필터버튼→풀팝업) + 목록헤더(총건수·page size)
//      + 카드 리스트(CardList) + 더보기 + 맨위로 FAB.
// 데이터/페이징/검색은 페이지가 소유. 목록은 목업(dlt_bidPbancList), 핸들러는 API 경계 스텁(console.log).
// 화면 타이틀('입찰공고')은 전역 Header(라우트 handle)가 제공 → 페이지 본문엔 타이틀 안 그림(설계서 Figma 타이틀 제거).
// 상세필터 풀팝업은 공통 SearchFilter 셸 사용 — 현재는 최소 schema(업무구분), 상세 검색조건은 MUI-BD-01-M02 에서 확장.
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
import type { BidPbancItem } from '@/types/bd'

// 빠른검색 대상 — 설계서 검색조건(공고명/공고번호).
const SEARCH_TARGETS = [
  { value: 'bidPbancNm', label: '공고명' },
  { value: 'bidPbancNo', label: '공고번호' },
]

// ── 상세필터(MUI-BD-01-M02) schema — 공통 SearchFilter 셸이 받아 렌더. 설계서 1.1~1.4 / Figma 9300-37350 ──
// 일자설정 빠른칩 — 설계서: 3개월/6개월/12개월/기간검색.
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
  { label: '12개월', months: 12 },
  { label: '기간검색', custom: true },
]
// 구분설정 드롭다운 옵션 — 설계서 속성값 기준. 코드값 미확정 항목은 '전체'+대표값(추후 백엔드 코드 보완).
const ALL = { value: 'all', label: '전체' }
const PBANC_SE_OPTIONS = [ALL, // 공고구분
  { value: 'normal', label: '정상공고' }, { value: 'urgent', label: '긴급공고' },
  { value: 'amend', label: '정정공고' }, { value: 'cancel', label: '취소공고' },
  { value: 'delay', label: '연기공고' }, { value: 'repost', label: '재공고' },
  { value: 'renew', label: '갱신공고' }]
const FNC_OPTIONS = [ALL, // 기능
  { value: 'air', label: '항공' }, { value: 'fire', label: '화력' }, { value: 'ship', label: '함정' },
  { value: 'comm', label: '통신' }, { value: 'engineer', label: '공병' }, { value: 'airdef', label: '방공' },
  { value: 'mobility', label: '기동' }, { value: 'oil', label: '유류' }, { value: 'ammo', label: '탄약' },
  { value: 'transport', label: '수송' }, { value: 'chem', label: '화학' }, { value: 'supply', label: '병참' },
  { value: 'medical', label: '의무' }, { value: 'etc', label: '기타' }]
const BID_MDM_OPTIONS = [ALL, // 입찰매체
  { value: 'normal', label: '일반입찰' }, { value: 'electronic', label: '전자입찰' },
  { value: 'computer', label: '전산입찰' }, { value: 'ocr', label: 'OCR입찰' },
  { value: 'omr', label: 'OMR입찰' }, { value: 'reverse', label: '역경매' }]
const BID_FORM_OPTIONS = [ALL, // 입찰형태
  { value: 'open', label: '일반경쟁' }, { value: 'designated', label: '지명경쟁' },
  { value: 'limited', label: '제한경쟁' }, { value: 'multiple', label: '복수경쟁' }]
const CTRT_MTHD_OPTIONS = [ALL, // 계약방법
  { value: 'private', label: '수의계약' }, { value: 'nego_doc', label: '협상에의한계약(서류)' },
  { value: 'nego_elec', label: '협상에의한계약(전자)' }, { value: 'two_step_sync', label: '2단계경쟁(동시)' },
  { value: 'two_step_split', label: '2단계경쟁(분리)' }, { value: 'total_award', label: '종합낙찰제' }]
// 코드값 미확정 — 추후 백엔드 확정 시 옵션 보완.
const BID_SE_OPTIONS = [ALL, { value: 'domestic', label: '내자' }, { value: 'foreign', label: '외자' }]
const PRGRS_STAS_OPTIONS = [ALL, { value: 'posting', label: '공고중' }, { value: 'closed', label: '마감' }, { value: 'opened', label: '개찰완료' }]
const BID_WIN_OPTIONS = [ALL, { value: 'lowest', label: '최저가' }, { value: 'qualify', label: '적격심사' }, { value: 'nego', label: '협상' }]

const BID_FILTER_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    // 업무구분 — 전체/물품/용역/공사/국외 (전체 칩 자동 동기화)
    {
      key: 'taskSeNm',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSeNm',
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
    // 일자 설정 — 개찰/공고 토글 + 기간(빠른칩)
    {
      key: 'date',
      title: '일자 설정',
      fields: [
        {
          type: 'segment',
          key: 'dateType',
          options: [
            { value: 'opbid', label: '개찰' },
            { value: 'pbanc', label: '공고' },
          ],
        },
        { type: 'dateRange', key: 'date', presets: DATE_PRESETS },
      ],
    },
    // 검색어 — 일부 입력 가능. 번호검색은 공고번호/통합입찰번호 토글 + 입력. 발주기관/면허정보/지역은 검색시트.
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'bidPbancNm', label: '입찰건명', placeholder: '입찰건명을 입력하세요.' },
        {
          type: 'segment',
          key: 'bidNoType',
          label: '번호 검색',
          options: [
            { value: 'pbancNo', label: '공고번호' },
            { value: 'intgBidNo', label: '통합입찰번호' },
          ],
        },
        { type: 'text', key: 'bidNo', placeholder: '번호를 입력하세요.' },
        { type: 'text', key: 'prdctNm', label: '품명', placeholder: '품명을 입력하세요.' },
        // 발주기관 → 발주부서(기관)검색(MUI-BD-01-P04, DeptInq)
        { type: 'selectionField', key: 'deptNm', label: '발주기관', placeholder: '발주기관을 입력하세요.', searchSheet: 'dept' },
        // 면허정보 → 면허정보검색(MUI-BD-01-P05, LcnsInfoSrch)
        { type: 'selectionField', key: 'lcnsNm', label: '면허정보', placeholder: '면허정보를 입력하세요.', searchSheet: 'license' },
        // 지역 → 지역검색(MUI-BD-01-P03, RgnSrch)
        { type: 'selectionField', key: 'regionNm', label: '지역', placeholder: '지역을 입력하세요.', searchSheet: 'region' },
      ],
    },
    // 구분 설정 — 드롭다운 8종
    {
      key: 'category',
      title: '구분 설정',
      fields: [
        { type: 'select', key: 'bidSe', label: '입찰구분', options: BID_SE_OPTIONS, placeholder: '전체' },
        { type: 'select', key: 'pbancSe', label: '공고구분', options: PBANC_SE_OPTIONS, placeholder: '전체' },
        { type: 'select', key: 'prgrsStas', label: '진행상태', options: PRGRS_STAS_OPTIONS, placeholder: '전체' },
        { type: 'select', key: 'fnc', label: '기능', options: FNC_OPTIONS, placeholder: '전체' },
        { type: 'select', key: 'bidMdm', label: '입찰매체', options: BID_MDM_OPTIONS, placeholder: '전체' },
        { type: 'select', key: 'bidForm', label: '입찰형태', options: BID_FORM_OPTIONS, placeholder: '전체' },
        { type: 'select', key: 'ctrtMthd', label: '계약방법', options: CTRT_MTHD_OPTIONS, placeholder: '전체' },
        { type: 'select', key: 'bidWinMthd', label: '낙찰방법', options: BID_WIN_OPTIONS, placeholder: '전체' },
      ],
    },
    // 가격 설정 — 추정가격(min/max + 듀얼 슬라이더). 최소 스텝 100만(설계서).
    {
      key: 'price',
      title: '가격 설정',
      fields: [
        { type: 'priceRange', key: 'estPrice', label: '추정가격', rangeMin: 0, rangeMax: 100_000_000, step: 1_000_000 },
      ],
    },
    // 신기술여부 — 기본값 아니오(설계서)
    {
      key: 'newTech',
      title: '신기술여부',
      fields: [
        {
          type: 'radio',
          key: 'newTech',
          options: [
            { value: 'yes', label: '예' },
            { value: 'no', label: '아니오' },
          ],
        },
      ],
    },
  ],
}
// 기본값 — 설계서: 업무구분 미선택, 일자유형 개찰, 번호검색 공고번호, 추정가격 1천만~2천만, 신기술 아니오.
const DEFAULT_FILTER: SearchFilterValue = {
  taskSeNm: [],
  dateType: 'opbid',
  date: { start: '', end: '' },
  bidPbancNm: '',
  bidNoType: 'pbancNo',
  bidNo: '',
  prdctNm: '',
  deptNm: '',
  lcnsNm: '',
  regionNm: '',
  bidSe: 'all',
  pbancSe: 'all',
  prgrsStas: 'all',
  fnc: 'all',
  bidMdm: 'all',
  bidForm: 'all',
  ctrtMthd: 'all',
  bidWinMthd: 'all',
  estPrice: { min: 10_000_000, max: 20_000_000 },
  newTech: 'no',
}

// 입찰공고 통합목록 데이터(설계서 1.4 데이터영역) — 목업, 추후 bdService.getList 매핑.
// 필드/코드값/형식은 설계서 그대로(공고상태·업무구분·입찰방식 코드값, 공고번호 형식, 일시 형식).
const dlt_bidPbancList: BidPbancItem[] = [
  {
    id: '1',
    bidPbancNo: '2026LGM000604191-01',
    bidPbancNm: '(26-물품-04) 간편한 아침식 제조 및 납품',
    pbancStasNm: '정상공고',
    taskSeNm: '물품',
    bidMthdNm: '경쟁입찰',
    pbancDt: '2026-02-12',
    bidPtcptAplyDdlnDt: '2026-03-16 15:00',
    bidDocSbmsnDdlnDt: '2026-03-17 15:00',
    opbidDt: '2026-03-26 11:00',
    bidStatNm: '개찰전',
  },
  {
    id: '2',
    bidPbancNo: '2026LGM000598220-01',
    bidPbancNm: '(26-용역-12) 정보화시스템 유지관리 용역',
    pbancStasNm: '정정공고',
    taskSeNm: '용역',
    bidMthdNm: '공개수의',
    pbancDt: '2026-02-10',
    bidPtcptAplyDdlnDt: '2026-03-10 15:00',
    bidDocSbmsnDdlnDt: '2026-03-11 15:00',
    opbidDt: '2026-03-20 11:00',
    bidStatNm: '개찰전',
  },
  {
    id: '3',
    bidPbancNo: '2026LGM000601077-01',
    bidPbancNm: '(26-공사-07) 군 관사 리모델링 공사',
    pbancStasNm: '취소공고',
    taskSeNm: '공사',
    bidMthdNm: '제한경쟁',
    pbancDt: '2026-02-05',
    bidPtcptAplyDdlnDt: '2026-03-05 15:00',
    bidDocSbmsnDdlnDt: '2026-03-06 15:00',
    opbidDt: '2026-03-16 11:00',
    bidStatNm: '개찰전',
  },
  {
    id: '4',
    bidPbancNo: '2026LGM000605432-01',
    bidPbancNm: '(26-국외-02) 정밀부품 국외 도입',
    pbancStasNm: '긴급공고',
    taskSeNm: '국외',
    bidMthdNm: '협상에의한계약',
    pbancDt: '2026-02-14',
    bidPtcptAplyDdlnDt: '2026-03-02 15:00',
    bidDocSbmsnDdlnDt: '2026-03-03 15:00',
    opbidDt: '2026-03-12 11:00',
    bidStatNm: '개찰전',
  },
]

const TOTAL = 258 // 총 건수(목업 — 실제 API total)
// 목업 확장 — 보유 4건을 인덱스로 복제해 TOTAL 건 구성(공고번호·id 는 고유하게).
const MOCK_LIST: BidPbancItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dlt_bidPbancList[i % dlt_bidPbancList.length]
  return { ...base, id: String(i + 1), bidPbancNo: `${base.bidPbancNo.slice(0, -3)}-${i + 1}` }
})

export function BidPbancIntgListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT_FILTER)
  const [keyword, setKeyword] = useState('') // 빠른검색어(입력 중)
  const [targets, setTargets] = useState<string[]>(['bidPbancNm']) // 빠른검색 대상(single — 1개만)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  // 빠른검색 '적용' 상태 — 검색 버튼(또는 Enter) 실행 시에만 확정(입력 중에는 목록 안 걸러짐).
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  // ── API 경계 스텁 (백엔드 연동 시 services/bd·queries/bd 로 대체). console 로 동작 확인 ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
    console.log('[BidList] 상세필터 검색', value)
    // bdService.getList(toRequest(value)) → 목록 재조회
  }
  const handleQuickSearch = () => {
    const target = targets[0] ?? 'bidPbancNm'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
    console.log('[BidList] 빠른검색', { keyword, target })
    // bdService.getList({ keyword, searchTarget: target, ... }) 로 서버 검색.
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[BidList] pageSize →', size)
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[BidList] loadMore → page', next)
  }
  const handleCardClick = (it: BidPbancItem) => {
    // 입찰공고상세(MUI-BD-01-M07, /bd/:id) 이동.
    navigate(`/bd/${it.id}`)
  }

  // ── ⚠️ 임시 목업 검색/페이징 (API 연동 시 이 블록 통째로 교체) ⚠️ ─────────────────────
  //   filteredList: 검색대상(공고명→bidPbancNm · 공고번호→bidPbancNo)으로 부분일치(대소문자 무시).
  //   visibleList: 더보기 누른 만큼(page*pageSize)만 노출.
  const filteredList = useMemo(() => {
    if (!appliedSearch || !appliedSearch.keyword) return MOCK_LIST
    const kw = appliedSearch.keyword.toLowerCase()
    return MOCK_LIST.filter((it) => {
      const field = appliedSearch.target === 'bidPbancNo' ? it.bidPbancNo : it.bidPbancNm
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 목업 → Card props 매핑
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.pbancStasNm}</Badge>
        <Badge>{it.taskSeNm}</Badge>
        <Badge>{it.bidMthdNm}</Badge>
      </>
    ),
    subtitle: `입찰공고번호 ${it.bidPbancNo}`,
    title: it.bidPbancNm,
    rows: [
      { label: '공고일자', value: it.pbancDt },
      { label: '입찰참가신청 마감일시', value: it.bidPtcptAplyDdlnDt },
      { label: '입찰서제출 마감일시', value: it.bidDocSbmsnDdlnDt },
      { label: '개찰일시', value: it.opbidDt },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 업무도움 — full-bleed 블루 바 */}
      <Infobox
        className="rounded-none"
        title="업무도움"
        items={[
          '비밀번호 자동완성기능(ex. 알패스 등)은 사용할 수 없습니다.',
          '1577-1118 대표전화로 전화주세요. 서비스에 로그인할 수 있도록 도와드리겠습니다.',
        ]}
      />

      {/* 검색조건 — 블루 바(full-bleed) + 폼(px-4 인셋) */}
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

      {/* 목록 헤더 — 총건수·표시개수 */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />
      {/* 카드 (px-4 인셋) */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} />
      </div>

      {/* 더보기 — 모두 노출됐으면 숨김 */}
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

      {/* 상세필터 풀팝업 — 공통 SearchFilter 셸(MUI-BD-01-M02 에서 schema 확장 예정). */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={BID_FILTER_SCHEMA}
        value={filter}
        defaultValue={DEFAULT_FILTER}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
