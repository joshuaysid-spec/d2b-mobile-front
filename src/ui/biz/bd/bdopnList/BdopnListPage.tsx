// 개찰목록(MUI-BD-08-M01, 영문 BdopnListPage). Design Ref: 02입찰 설계서 7.1 / slide144.
// 레퍼런스: 입찰공고 통합목록 BidPbancIntgListPage (구성·상태·페이징 동일 패턴).
// 구성: 업무도움(Infobox) + 검색조건(SearchCondition, 필터버튼→풀팝업) + 목록헤더(총건수·page size)
//      + 카드 리스트(CardList) + 더보기 + 맨위로 FAB.
// 개찰목록 카드는 설계서 MUI-BD-08-M01 대로 정보행이 공고일자·개찰일시 2행(입찰공고 목록은 4행).
// 데이터는 useBdopnList(queries/bd) — 목업/실연동은 bdService(USE_MOCK)가 전환. 목업 데이터는 mocks/bd.ts.
// 키워드 검색·더보기(페이징)는 페이지 클라이언트 로직(서버 페이징 전환 시 훅 파라미터로 이행).
// 화면 타이틀('개찰목록')은 전역 Header(라우트 handle)가 제공 → 페이지 본문엔 타이틀 안 그림.
// 상세필터 풀팝업은 공통 SearchFilter 셸 사용 — 검색조건은 입찰공고 필터(MUI-BD-01-M02)와 동일.
// 설계서 개찰 검색필터(MUI-BD-08-P01(구 M02 — v1.83 재편) slide145)가 "입찰 공고와 동일한 검색 필터"라 BidPbancIntgListPage
// 의 BID_FILTER_SCHEMA 와 항목·라벨·placeholder·옵션을 일치시킨다. 개찰 고유 차이는 일자 토글뿐:
// 개찰/공고 → 개찰/협상. 검색시트(dept/region/license)는 셸 내장 재사용 — 신규 시트 없음.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useBdopnList } from '@/queries/bd'
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
import type { BdopnItem, OvsBidRsltSummary, OvsRlsVltrnsSummary } from '@/types/bd'

// 빠른검색 대상 — 설계서 검색조건(공고명/공고번호).
const SEARCH_TARGETS = [
  { value: 'bidPbancNm', label: '공고명' },
  { value: 'bidPbancNo', label: '공고번호' },
]

// ── 상세필터(개찰목록 MUI-BD-08-P01(구 M02 — v1.83 재편)) schema — 입찰공고 필터(MUI-BD-01-M02)와 동일 ──
// BidPbancIntgListPage 의 BID_FILTER_SCHEMA 와 항목·라벨·placeholder·옵션 일치. 개찰 차이는 일자 토글뿐.
// 일자설정 빠른칩 — 설계서 레이아웃(slide145): 최근 1/3/6개월.
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]
// 구분설정 드롭다운 옵션 — 입찰공고 필터와 동일. 코드값은 추후 백엔드 공통코드 매핑.
const ALL = { value: 'all', label: '전체' }
const BID_SE_OPTIONS = [ALL, { value: 'domestic', label: '내자' }, { value: 'foreign', label: '외자' }]
const PBANC_SE_OPTIONS = [ALL, // 공고구분
  { value: 'normal', label: '정상공고' }, { value: 'urgent', label: '긴급공고' },
  { value: 'amend', label: '정정공고' }, { value: 'cancel', label: '취소공고' },
  { value: 'delay', label: '연기공고' }, { value: 'repost', label: '재공고' },
  { value: 'renew', label: '갱신공고' }]
const PRGRS_STAS_OPTIONS = [ALL, { value: 'posting', label: '공고중' }, { value: 'closed', label: '마감' }, { value: 'opened', label: '개찰완료' }]
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
const BID_WIN_OPTIONS = [ALL, { value: 'lowest', label: '최저가' }, { value: 'qualify', label: '적격심사' }, { value: 'nego', label: '협상' }]

const BDOPN_FILTER_SCHEMA: SearchFilterSchema = {
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
          selectAll: { value: '0' }, // '0' = '전체' 코드값 — 전체 선택 시 값 배열에 포함
          options: [
            { value: 'goods', label: '물품' },
            { value: 'service', label: '용역' },
            { value: 'construction', label: '공사' },
            { value: 'foreign', label: '국외' },
          ],
        },
      ],
    },
    // 일자 설정 — 개찰/협상 토글 + 기간(빠른칩). 개찰목록이므로 기본 '개찰'. (입찰공고는 개찰/공고)
    {
      key: 'date',
      title: '일자 설정',
      fields: [
        {
          type: 'segment',
          key: 'dateType',
          options: [
            { value: 'opbid', label: '개찰' },
            { value: 'ngtn', label: '협상' },
          ],
        },
        { type: 'dateRange', key: 'date', presets: DATE_PRESETS },
      ],
    },
    // 검색어 — 일부 입력 가능. 번호검색은 공고번호/통합참조 토글 + 입력. 발주기관/면허정보/지역은 검색시트.
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
            { value: 'intgRef', label: '통합참조' },
          ],
        },
        { type: 'text', key: 'bidNo', placeholder: '번호를 입력하세요.' },
        { type: 'text', key: 'prdctNm', label: '품명', placeholder: '품명을 입력하세요.' },
        // 발주기관 → 발주부서(기관)검색(DeptInq, 셸 내장)
        { type: 'selectionField', key: 'deptNm', label: '발주기관', placeholder: '발주기관을 입력하세요.', searchSheet: 'dept' },
        // 면허정보 → 면허정보검색(LcnsInfoSrch, 셸 내장)
        { type: 'selectionField', key: 'lcnsNm', label: '면허정보', placeholder: '면허정보를 입력하세요.', searchSheet: 'license' },
        // 지역 → 지역검색(RgnSrch, 셸 내장)
        { type: 'selectionField', key: 'regionNm', label: '지역', placeholder: '지역을 입력하세요.', searchSheet: 'region' },
      ],
    },
    // 구분 설정 — 드롭다운 8종(입찰공고 필터와 동일)
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
          direction: 'horizontal',
          showIndicator: true,
          options: [
            { value: 'yes', label: '예' },
            { value: 'no', label: '아니오' },
          ],
        },
      ],
    },
  ],
}
// 기본값 — 업무구분 미선택, 일자유형 개찰, 번호검색 공고번호, 구분설정 전체, 추정가격 1천만~2천만, 신기술 아니오.
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

// 개찰목록 데이터는 useBdopnList(bdService.getBdopnList) 가 공급 — 목업은 mocks/bd.ts(구 인라인 dlt_bdopnList 이관).
// 상세(BidRsltDtlPage)는 useBidRsltDetail(id) 로 재조회(그 목업 분기가 mocks/bd.ts 의 getBdopnById lookup 사용).

// 국외 개찰 카드 = 상세 상단 요약 공통 데이터 (MUI-BD-09-M71 slide402) — 목록 최상단 고정.
// 카드 클릭 시 이 값을 navigate state 로 넘겨 상세 상단(배지/번호/사업명/요약행)을 카드와 동일하게 표시.
const OVS_BDOPN_SUMMARY: OvsBidRsltSummary = {
  taskSeNm: '국외',
  bidTypeNm: '단가제',
  bidMthdNm: '경쟁입찰',
  intgRfrncNo: 'BDF01823EFE',
  pbancNo: 'EFE00012-2',
  bizNm: '500MD 부품',
  bidBzentyNm: 'A 해외업체',
  prchsDmndNo: 'BDF01823-002',
  regDdlnDt: '2026-03-17 15:00',
  bdngDdlnDt: '2026-03-26 11:00',
  bdopnDt: '2026-03-30',
}
// 총액제 카드 — 단가제 카드 복사 후 입찰유형만 총액제로. (상세는 추후 제작 — MUI-BD-09-T73(구 M73 — v1.83 재편))
const OVS_BDOPN_SUMMARY_TOTAL: OvsBidRsltSummary = { ...OVS_BDOPN_SUMMARY, bidTypeNm: '총액제' }

// 요약 데이터 → 국외 개찰 카드. 배지 순서: 업무구분(국외) 먼저, 입찰방식(경쟁입찰) 맨 마지막, 사이 입찰유형(단가제/총액제).
function buildOvsBdopnCard(id: string, s: OvsBidRsltSummary): CardListItem {
  return {
    id,
    badges: (
      <>
        <Badge>{s.taskSeNm}</Badge>
        <Badge>{s.bidTypeNm}</Badge>
        <Badge>{s.bidMthdNm}</Badge>
      </>
    ),
    subtitle: `통합참조번호 ${s.intgRfrncNo} / 공고번호 ${s.pbancNo}`,
    title: s.bizNm,
    rows: [
      { label: '입찰업체', value: s.bidBzentyNm },
      { label: '구매요청번호', value: s.prchsDmndNo },
      { label: '입찰참가등록마감일시', value: s.regDdlnDt },
      { label: '입찰서제출마감일시', value: s.bdngDdlnDt },
      { label: '개찰일자', value: s.bdopnDt },
    ],
  }
}
const OVS_BDOPN_CARD = buildOvsBdopnCard('ovs-m71', OVS_BDOPN_SUMMARY)
const OVS_BDOPN_CARD_TOTAL = buildOvsBdopnCard('ovs-m73', OVS_BDOPN_SUMMARY_TOTAL)

// 국외 공개수의협상 카드 (MUI-BD-12-M71, slide411) — 수의계약 배지 조건. 클릭 시 공개수의협상계획상세 진입.
const OVS_NGTN_SUMMARY: OvsRlsVltrnsSummary = {
  taskSeNm: '국외',
  ctrtMthdNm: '수의계약',
  intgRfrncNo: 'BDF01823EFE',
  pbancNo: 'EFE00012-2',
  bizNm: '500MD 부품',
  prchsDmndNo: 'BDF01823-002',
  sumDrctnAmt: '$ 126,000.18',
  etdcDdlnDt: '2026-03-26 11:00',
  bdopnDt: '2026-03-30',
}
const OVS_NGTN_CARD: CardListItem = {
  id: 'ovs-ngtn-m71',
  // 배지: 업무구분(국외) + 계약방법(수의계약).
  badges: (
    <>
      <Badge>{OVS_NGTN_SUMMARY.taskSeNm}</Badge>
      <Badge>{OVS_NGTN_SUMMARY.ctrtMthdNm}</Badge>
    </>
  ),
  subtitle: `통합참조번호 ${OVS_NGTN_SUMMARY.intgRfrncNo} / 공고번호 ${OVS_NGTN_SUMMARY.pbancNo}`,
  title: OVS_NGTN_SUMMARY.bizNm,
  rows: [
    { label: '구매요청번호', value: OVS_NGTN_SUMMARY.prchsDmndNo },
    { label: '총 금액', value: OVS_NGTN_SUMMARY.sumDrctnAmt },
    { label: '견적서제출마감일시', value: OVS_NGTN_SUMMARY.etdcDdlnDt },
    { label: '개찰일자', value: OVS_NGTN_SUMMARY.bdopnDt },
  ],
}

export function BdopnListPage() {
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

  // 목록 조회 — 전체 목록(목업/실연동은 bdService.getBdopnList 의 USE_MOCK 분기가 전환).
  const { data } = useBdopnList()

  // ── 목록 핸들러 — 확정값 상태만 갱신(조회는 useBdopnList + 아래 클라이언트 필터가 담당) ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
  }
  const handleQuickSearch = () => {
    const target = targets[0] ?? 'bidPbancNm'
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
  const handleCardClick = (it: BdopnItem) => {
    // 입찰결과상세(개찰상세, MUI-BD-09-M01) 이동. URL 에 식별자를 두지 않으므로 카드 항목을 state 로 넘겨
    // 상단(뱃지/공고번호/타이틀/공고일자/개찰일시)을 즉시 그리고, 상세가 그 id 로 재조회해 확정한다.
    navigate('/bd/bidRsltDtl', { state: it })
  }

  // ── 키워드 필터 + 더보기 슬라이스 — 클라이언트 로직(서버 페이징 전환 시 이 블록 삭제) ──
  const filteredList = useMemo(() => {
    const list = data ?? []
    if (!appliedSearch || !appliedSearch.keyword) return list
    const kw = appliedSearch.keyword.toLowerCase()
    return list.filter((it) => {
      const field = appliedSearch.target === 'bidPbancNo' ? it.bidPbancNo : it.bidPbancNm
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch, data])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 목업 → Card props 매핑. 개찰목록 정보행 = 공고일자·개찰일시 2행(설계서 MUI-BD-08-M01).
  // 국외 입찰결과조회 카드(MUI-BD-09-M71)는 최상단 고정 — 국내 목록 앞에 prepend.
  const cardItems: CardListItem[] = [
    // 국외(단가제) 카드 → 국외 입찰결과조회 상세(MUI-BD-09-M71 · T72(구 M72 — v1.83 재편)). 상단 요약을 카드와 동일하게 state 로 전달.
    { ...OVS_BDOPN_CARD, onClick: () => navigate('/bd/ovsBidRsltDtl', { state: OVS_BDOPN_SUMMARY }) },
    // 국외(총액제) 카드 → 국외 입찰결과조회 상세(총액제, MUI-BD-09-M71 · T73(구 M73 — v1.83 재편)). 배지(총액제)로 결과 탭 분기.
    { ...OVS_BDOPN_CARD_TOTAL, onClick: () => navigate('/bd/ovsBidRsltDtl', { state: OVS_BDOPN_SUMMARY_TOTAL }) },
    // 국외·수의계약 카드 → 공개수의협상계획상세(MUI-BD-12-M71). 수의계약 배지 조건일 때만 진입.
    { ...OVS_NGTN_CARD, onClick: () => navigate('/bd/ovsRlsVltrnsNgtnPlanDtl', { state: OVS_NGTN_SUMMARY }) },
    ...visibleList.map((it) => ({
      id: it.id,
      // 최상단 배지(레이블 딱지) — 우선순위 순서(업무구분>공고구분) + 입찰방식은 맨 마지막.
      // 값이 있는 항목만 그 순서대로 노출(없으면 생략).
      badges: (
        <>
          {[it.taskSeNm, it.pbancStasNm, it.bidMthdNm].filter(Boolean).map((v, i) => (
            <Badge key={i}>{v}</Badge>
          ))}
        </>
      ),
      subtitle: `입찰공고번호 ${it.bidPbancNo}`,
      title: it.bidPbancNm,
      rows: [
        { label: '공고일자', value: it.pbancDt },
        { label: '개찰일시', value: it.opbidDt },
      ],
      onClick: () => handleCardClick(it),
    })),
  ]

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

      {/* 상세필터 풀팝업 — 공통 SearchFilter 셸(개찰목록 schema). 검색시트는 셸 내장(추가 제작 없음). */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={BDOPN_FILTER_SCHEMA}
        value={filter}
        defaultValue={DEFAULT_FILTER}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
