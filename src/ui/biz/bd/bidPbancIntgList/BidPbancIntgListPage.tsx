// 입찰공고 통합목록(MUI-BD-01-M01, node 9300-36931). Design Ref: 02입찰 설계서 1.1~1.4.
// 레퍼런스: 조달계획 통합목록 PrcmPlanIntgListPage (구성·상태·페이징 동일 패턴).
// 구성: 업무도움(Infobox) + 검색조건(SearchCondition, 필터버튼→풀팝업) + 목록헤더(총건수·page size)
//      + 카드 리스트(CardList) + 더보기 + 맨위로 FAB.
// 데이터는 bdQueries.useSelectPbancList(queries/bds/bd) — 목업/실연동은 bdService(USE_MOCK)가 전환. 목업 데이터는 mocks/bd.ts.
// 키워드 검색·더보기(페이징)는 페이지 클라이언트 로직(서버 페이징 전환 시 훅 파라미터로 이행).
// 화면 타이틀('입찰공고')은 전역 Header(라우트 handle)가 제공 → 페이지 본문엔 타이틀 안 그림(설계서 Figma 타이틀 제거).
// 상세필터 풀팝업은 공통 SearchFilter 셸 + 동적 resolver(MUI-BD-01-M02, 설계서 slide14/19/21 기준).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { bdQueries } from '@/queries/bds/bd/queries'
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
  SearchFilterField,
  SearchFilterSchema,
  SearchFilterValue,
} from '@/types/search-filter'
import type { BidPbancItem } from '@/types/bd'

// 빠른검색 대상 — 설계서 검색조건(공고명/공고번호).
const SEARCH_TARGETS = [
  { value: 'rprsItemNm', label: '공고명' },
  { value: 'g2BBidPbancNo', label: '공고번호' },
]

// ── 상세필터(MUI-BD-01-M02) schema — 공통 SearchFilter 셸이 받아 렌더. 설계서 slide14(와이어프레임)·
//    slide19(검색조건 항목설명 dml_bidPbancSrchCnd)·slide21(On-Load 기본값) 기준. ──
// 일자설정 빠른칩 — 설계서 slide14 최근 1/3/6개월.
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '최근 1개월', months: 1 },
  { label: '최근 3개월', months: 3 },
  { label: '최근 6개월', months: 6 },
]
// 구분설정 드롭다운 옵션 — 설계서 속성값 기준. 코드값 미확정 항목은 '전체'+대표값(추후 백엔드 코드 보완).
const ALL = { value: 'all', label: '전체' }
const PBANC_TPCD_OPTIONS = [ALL, // 공고구분(pbancTpcd, 상위코드 ANTC — 코드값 미확정)
  { value: 'normal', label: '정상공고' }, { value: 'urgent', label: '긴급공고' },
  { value: 'amend', label: '정정공고' }, { value: 'cancel', label: '취소공고' },
  { value: 'delay', label: '연기공고' }, { value: 'repost', label: '재공고' },
  { value: 'renew', label: '갱신공고' }]
// 진행상태(bidStatNm) — 설계서 slide19 비고: 입찰철/재입찰 조건에 따라 '개찰전'/'개찰완료'/'재입찰'.
const BID_STAT_OPTIONS = [ALL,
  { value: 'beforeOpbid', label: '개찰전' }, { value: 'opbidDone', label: '개찰완료' },
  { value: 'rebid', label: '재입찰' }]
const SPF_OPTIONS = [ALL, // 기능(spfCode, 상위코드 SPF) — slide13 표시레이블(화공약품·공통적용 포함. '용역'은 업무구분 값이라 제외)
  { value: 'air', label: '항공' }, { value: 'fire', label: '화력' }, { value: 'ship', label: '함정' },
  { value: 'comm', label: '통신' }, { value: 'engineer', label: '공병' }, { value: 'airdef', label: '방공' },
  { value: 'mobility', label: '기동' }, { value: 'oil', label: '유류' }, { value: 'ammo', label: '탄약' },
  { value: 'transport', label: '수송' }, { value: 'chem', label: '화학' }, { value: 'supply', label: '병참' },
  { value: 'chemical', label: '화공약품' }, { value: 'medical', label: '의무' },
  { value: 'common', label: '공통적용' }, { value: 'etc', label: '기타' }]
// 군구분(prcmRqtInstCd, 상위코드 RS) — 코드값 미확정, 대표값 임시(추후 백엔드 코드 보완).
const PRCM_RQT_INST_OPTIONS = [ALL,
  { value: 'army', label: '육군' }, { value: 'navy', label: '해군' },
  { value: 'airforce', label: '공군' }, { value: 'etc', label: '기타' }]
const BID_MEDIA_OPTIONS = [ALL, // 입찰매체(bidMediaCd, 상위코드 BMDC)
  { value: 'normal', label: '일반입찰' }, { value: 'electronic', label: '전자입찰' },
  { value: 'computer', label: '전산입찰' }, { value: 'ocr', label: 'OCR입찰' },
  { value: 'omr', label: 'OMR입찰' }, { value: 'reverse', label: '역경매' }]
// 입찰형태(elctrNgtnYn) — 설계서 slide19: '1' 일반입찰 / '2' 전자입찰.
const ELCTR_NGTN_OPTIONS = [ALL,
  { value: '1', label: '일반입찰' }, { value: '2', label: '전자입찰' }]
const CTRT_MTHD_OPTIONS = [ALL, // 계약방법(ctrtMthdCd, 상위코드 CTMC) — slide13 표시레이블 전체(경쟁형태 포함)
  { value: 'open', label: '일반경쟁' }, { value: 'designated', label: '지명경쟁' },
  { value: 'limited', label: '제한경쟁' }, { value: 'multiple', label: '복수경쟁' },
  { value: 'private', label: '수의계약' }, { value: 'nego_doc', label: '협상에의한계약(서류)' },
  { value: 'nego_elec', label: '협상에의한계약(전자)' }, { value: 'two_step_sync', label: '2단계경쟁(동시)' },
  { value: 'two_step_split', label: '2단계경쟁(분리)' }, { value: 'total_award', label: '종합낙찰제' },
  { value: 'reverse', label: '역경매' }]
// 낙찰방법(scsbdMthdCd, 상위코드 CCMT) — 설계서에 속성값 미기재, 대표값 임시(추후 백엔드 코드 보완).
const SCSBD_MTHD_OPTIONS = [ALL,
  { value: 'lowest', label: '최저가' }, { value: 'qualify', label: '적격심사' }, { value: 'nego', label: '협상' }]

// 업무구분 4종 전체 — 기본값(전체 선택)·'전체' 판정에 공용.
const TASK_SE_ALL = ['goods', 'service', 'construction', 'foreign']

// 동적 schema resolver — 설계서 slide19 노출조건:
//   기능·군구분·입찰매체 = 업무구분 '전체' 또는 '국외' 선택 시 노출.
//   신기술여부 = 업무구분 '전체'·'물품'·'용역' 선택 시 노출.
// ('전체' = selectAll 로 4종 모두 선택. 미선택도 전체로 간주.)
function buildBidFilterSchema(value: SearchFilterValue): SearchFilterSchema {
  // '0' = '전체' 코드값(selectAll.value) — 개수 판정에서 제외하고 센다.
  const task = ((value.taskSeNm as string[]) ?? []).filter((v) => v !== '0')
  const isAllTask = task.length === 0 || task.length === TASK_SE_ALL.length
  const showOvsFields = isAllTask || task.includes('foreign')
  const showNtch = isAllTask || task.includes('goods') || task.includes('service')

  return {
    title: '검색필터',
    sections: [
      // 업무구분 — 전체/물품/용역/공사/국외 (전체 칩 자동 동기화)
      // 추후 API: 항목별 개수표시(설계서 slide14 '물품(12)' 식) — 목록 집계 연동 시 공통 CheckboxGroup 확장과 함께 반영.
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
      // 일자 설정 — 개찰일자/공고일자 토글 + 기간(빠른칩·직접입력·데이트피커)
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
      // 검색어 — 일부 입력 가능. 번호검색은 공고번호/통합참조 토글 + 입력. 발주기관/면허정보는 검색시트.
      //   지역명(rgnNm)은 직접 입력(v1.83 2026-07-09 개정: "지역명이 검색에서 직접 입력으로 변경됨" — 구 지역검색(P03) 시트 미사용).
      //   지역명 위치는 품명 위(2026-08-06 요청).
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
              { value: 'pbancNo', label: '공고번호' }, // 설계서 pbancNo
              { value: 'rfrncNo', label: '통합참조' }, // 설계서 통합참조번호(rfrncNo)
            ],
          },
          { type: 'text', key: 'bidNo', placeholder: '번호를 입력하세요.' },
          { type: 'text', key: 'rgnNm', label: '지역명', placeholder: '지역명을 입력하세요.' },
          { type: 'text', key: 'itemNm', label: '품명', placeholder: '품명을 입력하세요.' },
          // 발주기관(orderInstNm) → 발주부서(기관)검색(MUI-BD-01-P04, DeptInq)
          { type: 'selectionField', key: 'orderInstNm', label: '발주기관', placeholder: '발주기관을 입력하세요.', searchSheet: 'dept' },
          // 면허정보(cnstpCdNm) → 면허정보검색(MUI-BD-01-P05, LcnsInfoSrch)
          { type: 'selectionField', key: 'cnstpCdNm', label: '면허정보', placeholder: '면허정보를 입력하세요.', searchSheet: 'license' },
        ],
      },
      // 구분 설정 — 드롭다운 8종(v1.83 slide12·17 dml_bidPbancSrchCnd 재편: 구 입찰구분(bidSe) 제거,
      //   와이어프레임 순서 진행상태명→공고구분→기능→입찰매체→입찰형태→계약방법→낙찰방법→군구분.
      //   와이어프레임의 3번째 '진행상태' 행은 데이터영역에 bidStatNm 하나뿐이라 중복으로 보고 미구현 — 사용자 확정 2026-08-06.
      //   기능·입찰매체·군구분은 업무구분 전체/국외 선택 시 노출 — 비고 유지).
      {
        key: 'category',
        title: '구분 설정',
        fields: [
          { type: 'select', key: 'bidStatNm', label: '진행상태명', options: BID_STAT_OPTIONS, placeholder: '전체' },
          { type: 'select', key: 'pbancTpcd', label: '공고구분', options: PBANC_TPCD_OPTIONS, placeholder: '전체' },
          ...(showOvsFields
            ? ([
                { type: 'select', key: 'spfCode', label: '기능', options: SPF_OPTIONS, placeholder: '전체' },
                { type: 'select', key: 'bidMediaCd', label: '입찰매체', options: BID_MEDIA_OPTIONS, placeholder: '전체' },
              ] satisfies SearchFilterField[])
            : []),
          { type: 'select', key: 'elctrNgtnYn', label: '입찰형태', options: ELCTR_NGTN_OPTIONS, placeholder: '전체' },
          { type: 'select', key: 'ctrtMthdCd', label: '계약방법', options: CTRT_MTHD_OPTIONS, placeholder: '전체' },
          { type: 'select', key: 'scsbdMthdCd', label: '낙찰방법', options: SCSBD_MTHD_OPTIONS, placeholder: '전체' },
          ...(showOvsFields
            ? ([
                { type: 'select', key: 'prcmRqtInstCd', label: '군구분', options: PRCM_RQT_INST_OPTIONS, placeholder: '전체' },
              ] satisfies SearchFilterField[])
            : []),
        ],
      },
      // 가격 설정 — 추정가격(prsmpPrc, min/max + 듀얼 슬라이더). 최소 스텝 100만(설계서).
      {
        key: 'price',
        title: '가격 설정',
        fields: [
          { type: 'priceRange', key: 'prsmpPrc', label: '추정가격', rangeMin: 0, rangeMax: 100_000_000, step: 1_000_000 },
        ],
      },
      // 신기술여부(ntchYn) — 기본값 아니오. 업무구분 전체/물품/용역 선택 시에만 노출(설계서 slide19).
      ...(showNtch
        ? [
            {
              key: 'newTech',
              title: '신기술여부',
              fields: [
                {
                  type: 'radio',
                  key: 'ntchYn',
                  direction: 'horizontal',
                  showIndicator: true,
                  options: [
                    { value: 'Y', label: '예' },
                    { value: 'N', label: '아니오' },
                  ],
                } satisfies SearchFilterField,
              ],
            },
          ]
        : []),
    ],
  }
}

// 기본값 — 설계서 slide21 On-Load: 공고/개찰일자를 현재일자 한달 전~현재일자로 세팅.
//   업무구분 전체 선택(slide14 '전체가 아닌 경우 최소 1개 이상'), 번호검색 공고번호,
//   추정가격 1천만~2천만(slide14), 신기술 아니오.
const DEFAULT_FILTER: SearchFilterValue = {
  taskSeNm: ['0', ...TASK_SE_ALL], // 전체 선택('0' = 전체 코드값 포함)
  dateType: 'opbid',
  date: {
    start: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD'),
  },
  bidPbancNm: '',
  bidNoType: 'pbancNo',
  bidNo: '',
  itemNm: '',
  orderInstNm: '',
  cnstpCdNm: '',
  rgnNm: '',
  pbancTpcd: 'all',
  bidStatNm: 'all',
  spfCode: 'all',
  prcmRqtInstCd: 'all',
  bidMediaCd: 'all',
  elctrNgtnYn: 'all',
  ctrtMthdCd: 'all',
  scsbdMthdCd: 'all',
  prsmpPrc: { min: 10_000_000, max: 20_000_000 },
  ntchYn: 'N',
}

// 목록 데이터는 bdQueries.useSelectPbancList(bdService.selectPbancList) 가 공급 — 목업 데이터는 mocks/bd.ts(구 인라인 이관).
// 키워드 검색·더보기(페이징)는 아직 페이지 클라이언트 로직(서버 페이징 전환 시 훅 파라미터로 이행).

export function BidPbancIntgListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT_FILTER)
  const [keyword, setKeyword] = useState('') // 빠른검색어(입력 중)
  const [targets, setTargets] = useState<string[]>(['rprsItemNm']) // 빠른검색 대상(single — 1개만)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  // 빠른검색 '적용' 상태 — 검색 버튼(또는 Enter) 실행 시에만 확정(입력 중에는 목록 안 걸러짐).
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  // 목록 조회 — 전체 목록(목업/실연동은 bdService.selectPbancList 의 USE_MOCK 분기가 전환).
  // 서버 페이징/키워드 검색 전환 시: req 에 page/pageSize/keyword 를 넣으면 queryKey 가 바뀌어 재조회된다.
  const { data } = bdQueries.useSelectPbancList()

  // ── 목록 핸들러 — 확정값 상태만 갱신(조회는 bdQueries.useSelectPbancList + 아래 클라이언트 필터가 담당) ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
    // 서버 필터 전환 시: bdQueries.useSelectPbancList req 에 filter(value)를 포함시켜 재조회한다.
  }
  const handleQuickSearch = () => {
    const target = targets[0] ?? 'rprsItemNm'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
    // 서버 검색 전환 시: bdQueries.useSelectPbancList req 에 keyword/searchTarget 포함(현재는 아래 filteredList 클라 필터).
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
  }
  const handleLoadMore = () => {
    setPage(page + 1)
  }
  const handleCardClick = (it: BidPbancItem) => {
    // 업무구분(taskSeNm) 데이터 필드로 국내/국외 상세 분기 — 목록 아이템을 state 로 전달(즉시표시 초기값).
    if (it.taskSeNm === '국외') {
      // 국외 입찰공고 상세(MUI-BD-01-M71 · 탭 T71~T73(구 M71~M73 — v1.83 재편), /bd/ovsBidPbancDtl)
      navigate('/bd/ovsBidPbancDtl', { state: it })
      return
    }
    // 입찰공고상세(MUI-BD-01-M07, /bd/bidPbancDtl)
    navigate('/bd/bidPbancDtl', { state: it })
  }

  // ── 키워드 필터 + 더보기 슬라이스 — 클라이언트 로직(서버 페이징 전환 시 이 블록 삭제) ──
  //   filteredList: 조회 결과(data)를 검색대상(공고명→rprsItemNm · 공고번호→g2BBidPbancNo)으로 부분일치.
  //   visibleList: 더보기 누른 만큼(page*pageSize)만 노출.
  const filteredList = useMemo(() => {
    const list = data ?? []
    if (!appliedSearch || !appliedSearch.keyword) return list
    const kw = appliedSearch.keyword.toLowerCase()
    return list.filter((it) => {
      const field = appliedSearch.target === 'g2BBidPbancNo' ? it.g2BBidPbancNo : it.rprsItemNm
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch, data])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 목업 → Card props 매핑
  //   뱃지 최대 3개: 업무구분·입찰구분·공고구분(2026-08-06 요청). 마감일시류는 년-월-일까지만 표시.
  const toYmd = (dt: string) => dt.slice(0, 10)
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: [
      it.taskSeNm && <Badge key="taskSeNm">{it.taskSeNm}</Badge>,
      it.bidSeNm && <Badge key="bidSeNm">{it.bidSeNm}</Badge>,
      <Badge key="pbancTpcd">{it.pbancTpcd}</Badge>,
    ].filter(Boolean),
    subtitle: `공고번호 ${it.g2BBidPbancNo}-${it.g2BBidPbancCycl}`,
    title: it.rprsItemNm,
    rows: [
      { label: '발주기관', value: it.orderInstNm },
      { label: '기초예가금액', value: `${it.brprc.toLocaleString()} 원` },
      { label: '생산능력 제출 마감일시', value: toYmd(it.prdcpIdntySmdocDdlnDt) },
      { label: '입찰참가등록 마감일시', value: toYmd(it.bidClrsDt) },
      { label: '입찰서제출 마감일시', value: toYmd(it.tndrSbmsnDdlnDt) },
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
      {/* 카드 (px-4 인셋). data-coach = 앱 이용안내(M16) 코치마크 측정 지점(첫 카드/뱃지/정보행). */}
      <div data-coach="bd-list" className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
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

      {/* 상세필터 풀팝업(MUI-BD-01-M02) — 공통 SearchFilter 셸 + 동적 resolver(업무구분별 노출조건). */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={buildBidFilterSchema}
        value={filter}
        defaultValue={DEFAULT_FILTER}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
