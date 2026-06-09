// 조달계획 통합목록(MUI-OP-01-M01, node 9300-36815). Design Ref: op-list-page.design.
// 구성: 업무도움(Infobox) + 검색조건(SearchCondition, 필터버튼→풀팝업) + 목록헤더(총건수·page size)
//      + 카드 리스트(CardList, Card 재사용) + 더보기 + 맨위로 FAB.
// 데이터/페이징/검색은 페이지가 소유. 목록은 목업(dlt_prcmPlanList), 더보기·page size·빠른검색은 API 경계 스텁
//   (Plan SC: 핸들러 실행 + console.log 로 변수 변화 확인). 상세필터 풀팝업(SearchFilter)은 기구현.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { OpSearchFilter, OpPlanItem } from '@/types/op'

const DATE_FORMAT = 'YYYY-MM-DD'

// 조달계획 검색 schema (Figma MUI-OP-01-M02) — 상세필터 풀팝업 5섹션.
const OP_SEARCH: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'srchType',
      title: '검색유형',
      fields: [
        {
          type: 'radio',
          key: 'srchType',
          showIndicator: true, // 검색유형은 원형 라디오(○) 표시 — Figma M02
          options: [
            { value: 'plan', label: '조달계획' },
            { value: 'spec', label: '사전규격' },
            { value: 'annual', label: '연간조달계획' },
          ],
        },
      ],
    },
    // 업무구분 — 다중 선택(가로 스와이프). 코드값은 백엔드 연동 시 확정(현재 잠정).
    {
      key: 'taskSeNm',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSeNm',
          selectAll: true, // 상단 '전체' 칩(전체↔개별 자동 동기화) — options 에 별도 '전체' 없음
          options: [
            { value: 'goods', label: '물품' },
            { value: 'service', label: '용역' },
            { value: 'construction', label: '공사' },
            { value: 'foreign', label: '외자' },
          ],
        },
      ],
    },
    {
      key: 'date',
      title: '일자 설정',
      // TODO: 발주예정월 월 단위(YYYY-MM) 피커로 교체 — date-input 개선 시
      fields: [{ type: 'dateRange', key: 'orderPrnmntYm' }],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'prcmPlanNm', label: '제목', placeholder: '제목을 입력하세요.' },
        { type: 'text', key: 'prcmNo', label: '판단번호', placeholder: '번호를 입력하세요.' },
        // 선택필드(`>`) — 터치 시 SearchFilter 셸이 공통 검색시트를 직접 연다(searchSheet).
        //   품명     → 품목별조회 (MUI-OP-01-P71, ItemInqSheet)
        //   발주기관 → 생산자조회 (MUI-OP-01-P72, PrdcrInqSheet)
        {
          type: 'selectionField',
          key: 'rprsItemNm',
          label: '품명',
          placeholder: '품명을 입력하세요.',
          searchSheet: 'item',
        },
        {
          type: 'selectionField',
          key: 'deptCd',
          label: '발주기관',
          placeholder: '발주기관을 입력하세요.',
          searchSheet: 'producer',
        },
        { type: 'text', key: 'userNm', label: '담당자', placeholder: '담당자를 입력하세요.' },
      ],
    },
    {
      key: 'category',
      title: '구분설정',
      fields: [
        {
          type: 'select',
          key: 'implPrgrsStcd',
          label: '진행상태',
          placeholder: '전체',
          options: [
            { value: 'all', label: '전체' },
            { value: 'plan', label: '조달계획' },
            { value: 'posted', label: '공고게시' },
            { value: 'waiting', label: '계약대기' },
            { value: 'done', label: '계약완료' },
          ],
        },
        // 기능/입찰형태/계약방법 — 옵션 추후 확정(TODO). 현재 '전체'만
        {
          type: 'select',
          key: 'inspShcd',
          label: '기능',
          placeholder: '전체',
          options: [{ value: 'all', label: '전체' }],
        },
        {
          type: 'select',
          key: 'bidSecd',
          label: '입찰형태',
          placeholder: '전체',
          options: [{ value: 'all', label: '전체' }],
        },
        {
          type: 'select',
          key: 'ctrtMthdCd',
          label: '계약방법',
          placeholder: '전체',
          options: [{ value: 'all', label: '전체' }],
        },
      ],
    },
  ],
}

// 초기/초기화 기준값 (검색유형 조달계획 · 발주예정월 최근 1개월 · 나머지 전체/빈값)
const DEFAULT_VALUE: OpSearchFilter = {
  srchType: 'plan',
  taskSeNm: ['goods', 'service', 'construction', 'foreign'], // 업무구분 기본 — 전체(모든 항목)
  orderPrnmntYm: {
    start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
    end: dayjs().format(DATE_FORMAT),
  },
  prcmPlanNm: '',
  prcmNo: '',
  rprsItemNm: '',
  deptCd: '',
  userNm: '',
  implPrgrsStcd: 'all',
  inspShcd: 'all',
  bidSecd: 'all',
  ctrtMthdCd: 'all',
}

// 빠른검색 대상 칩 (조달명/판단번호)
const SEARCH_TARGETS = [
  { value: 'prcmNm', label: '조달명' },
  { value: 'prcmNo', label: '판단번호' },
]

// 조달계획 통합목록 데이터(dlt_prcmPlanList, 기획서 p15 1.4) — 목업, 추후 API(opService.getList).
// 데모용으로 srchType(plan/spec/annual)·taskSeNm('국외' 포함)을 섞어 라우팅 분기를 모두 확인 가능.
// (실제로는 srchType 별 별도 조회 — 여기선 1개 변수에 혼합)
const TOTAL = 100 // 총 건수(목업 — 실제 API total)
const dlt_prcmPlanList: OpPlanItem[] = [
  // 조달계획 · 국내(물품/용역/공사) → /op/:id (국내 분기)
  {
    id: '1',
    srchType: 'plan',
    taskSeNm: '물품',
    ctrtMthdNm: '수의계약',
    prcmNo: '6000A',
    title: "'26년 K5방독면",
    orderPrnmntYm: '2026-03',
    orderDeptNm: '화력총괄계약팀',
    ctrtMthd: '총액제',
    budgetAmt: 11616000,
  },
  {
    id: '2',
    srchType: 'plan',
    taskSeNm: '용역',
    ctrtMthdNm: '일반경쟁',
    prcmNo: '6000B',
    title: "'26년 정보화 유지보수 사업",
    orderPrnmntYm: '2026-04',
    orderDeptNm: '정보화팀',
    ctrtMthd: '총액제',
    budgetAmt: 92472000,
  },
  {
    id: '3',
    srchType: 'plan',
    taskSeNm: '공사',
    ctrtMthdNm: '제한경쟁',
    prcmNo: '6000C',
    title: "'26년 막사 보수 공사",
    orderPrnmntYm: '2026-02',
    orderDeptNm: '시설관리단',
    ctrtMthd: '총액제',
    budgetAmt: 158000000,
  },
  // 조달계획 · 국외 → /op/:id (국외 분기)
  {
    id: '4',
    srchType: 'plan',
    taskSeNm: '국외',
    ctrtMthdNm: '일반경쟁',
    prcmNo: '6000D',
    title: "'26년 야간투시경 해외구매",
    orderPrnmntYm: '2026-05',
    orderDeptNm: '해외조달팀',
    ctrtMthd: '단가제',
    budgetAmt: 540000000,
  },
  // 사전규격 · 국내 → /op/spec/:id
  {
    id: '5',
    srchType: 'spec',
    taskSeNm: '용역',
    ctrtMthdNm: '일반경쟁',
    prcmNo: '6000E',
    title: "'26년 통신장비 사전규격",
    orderPrnmntYm: '2026-03',
    orderDeptNm: '통신정보팀',
    ctrtMthd: '총액제',
    budgetAmt: 47200000,
  },
  // 연간조달계획 · 국외(고정) → /op/:id (국외 분기)
  {
    id: '6',
    srchType: 'annual',
    taskSeNm: '국외',
    ctrtMthdNm: '일반경쟁',
    prcmNo: '6000F',
    title: "'26년 연간 군수품 해외조달",
    orderPrnmntYm: '2026-06',
    orderDeptNm: '해외조달팀',
    ctrtMthd: '단가제',
    budgetAmt: 880000000,
  },
]

// ⚠️⚠️ 임시 목업 — API 연동 시 이 상수(MOCK_LIST)와 아래 컴포넌트 안의 filteredList/visibleList 로직을
//   통째로 삭제하고 다시 짠다. ⚠️⚠️
// 지금은 "보유한 6건"을 TOTAL(100)건으로 부풀려, 더보기 누를 때마다 page*pageSize 만큼 잘라 보여준다
//   (그래서 더보기 1번 = 카드 10개씩 추가되는 것처럼 보임). 검색도 이 배열을 클라이언트에서 필터.
// 변경 예정: 보유 데이터를 부풀려 슬라이스/필터하는 대신, 서버 API(opService.getList)로
//   "다음 페이지/검색결과를 새로 fetch 해 누적"하는 로직으로 교체한다.
//   → MOCK_LIST · filteredList(useMemo) · visibleList(slice) 모두 제거 대상.
const MOCK_LIST: OpPlanItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dlt_prcmPlanList[i % dlt_prcmPlanList.length]
  // id·prcmNo 는 고유해야 하므로 인덱스로 구분 (key 안정성 + 판단번호 검색 데모용)
  return { ...base, id: String(i + 1), prcmNo: `${base.prcmNo}-${i + 1}` }
})

export function PrcmPlanIntgListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT_VALUE)
  const [keyword, setKeyword] = useState('') // 빠른검색어(입력 중)
  const [targets, setTargets] = useState<string[]>(['prcmNm']) // 빠른검색 대상(single — 1개만)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  // 빠른검색 '적용' 상태 — 검색 버튼(또는 Enter)을 눌렀을 때만 확정된다.
  // (입력 중에는 목록이 걸러지지 않고, 검색을 실행해야 dlt_prcmPlanList 가 필터됨)
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  // 검색어 selectionField(품명/발주기관) 의 검색시트는 SearchFilter 셸이 직접 연다(searchSheet).

  // ── API 경계 스텁 (백엔드 연동 시 services/op·queries/op 로 대체). console 로 동작 확인 ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    console.log('[OpList] 상세필터 검색', value)
    // services/op.ts: opService.getList(toRequest(value)) → 목록 재조회
  }
  const handleQuickSearch = () => {
    // 검색대상(targets)은 single 칩이라 항상 1개만 선택됨 — 첫 값을 검색 기준으로 사용.
    const target = targets[0] ?? 'prcmNm'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1) // 새 검색은 첫 페이지부터
    console.log('[OpList] 빠른검색', { keyword, target })
    // 실제로는 opService.getList({ keyword, searchTarget: target, ... }) 로 서버 검색.
    // 현재는 목업(dlt_prcmPlanList)을 클라이언트에서 필터(아래 filteredList) 한다.
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[OpList] pageSize →', size) // 실제로는 page=1·pageSize=size 로 재조회
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[OpList] loadMore → page', next) // 실제로는 다음 페이지 fetch 후 누적
  }
  // 카드 클릭 라우팅 — 사전규격→사전규격상세(/op/spec/:id), 국외→국외상세(/op/ovs/:id),
  // 그 외(국내 조달계획)→조달계획상세(/op/:id).
  const handleCardClick = (item: OpPlanItem) => {
    if (item.srchType === 'spec') {
      navigate(`/op/spec/${item.id}`)
      return
    }
    if (item.taskSeNm === '국외') {
      navigate(`/op/ovs/${item.id}`)
      return
    }
    navigate(`/op/${item.id}`)
  }

  // ── ⚠️ 임시 목업 검색/페이징 (API 연동 시 이 블록 통째로 삭제 후 재작성) ⚠️ ──────────
  // [현재] 보유한 MOCK_LIST 를 클라이언트에서 필터(검색) + 슬라이스(더보기) 한다.
  //   filteredList: SEARCH_TARGET(검색대상)에 따라 검색 필드를 바꿔 부분일치(대소문자 무시)로 거름.
  //     - 'prcmNm'(조달명)  → 카드 제목(it.title)
  //     - 'prcmNo'(판단번호) → 판단번호(it.prcmNo)
  //     아직 검색 실행 전(appliedSearch null)이거나 검색어가 비면 전체(MOCK_LIST).
  //   visibleList: 더보기 누른 만큼(page*pageSize=loaded)만 잘라서 노출 → 더보기 1번에 10개씩 추가.
  // [변경 예정] 위 "보유 데이터 필터 + 슬라이스" 대신, 검색·더보기 모두 서버 API 호출로 교체:
  //   opService.getList({ page, pageSize, keyword, searchTarget }) 결과를 받아 누적/치환한다.
  //   → filteredList(useMemo) · visibleList(slice) 제거하고 fetch 한 데이터로 cardItems 를 만든다.
  const filteredList = useMemo(() => {
    if (!appliedSearch || !appliedSearch.keyword) return MOCK_LIST
    const kw = appliedSearch.keyword.toLowerCase()
    return MOCK_LIST.filter((it) => {
      const field = appliedSearch.target === 'prcmNo' ? it.prcmNo : it.title
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch])

  // 검색이 적용되면 총건수·더보기는 걸러진 결과 기준, 아니면 목업 TOTAL(서버 total) 기준.
  const isSearching = !!appliedSearch && !!appliedSearch.keyword
  const total = isSearching ? filteredList.length : TOTAL
  const loaded = Math.min(page * pageSize, total)
  // 더보기 누른 만큼만 노출 (10개씩 추가). API 연동 시엔 서버가 페이지 단위로 주므로 slice 불필요.
  const visibleList = filteredList.slice(0, loaded)

  // 목업 → Card props 매핑 (Design §3.2)
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSeNm}</Badge>
        <Badge>{it.ctrtMthdNm}</Badge>
      </>
    ),
    subtitle: `판단번호 ${it.prcmNo}`,
    title: it.title,
    rows: [
      { label: '발주예정월', value: it.orderPrnmntYm },
      { label: '발주기관', value: it.orderDeptNm },
      { label: '계약방법', value: it.ctrtMthd },
      { label: '예산금액', value: `${it.budgetAmt.toLocaleString()} 원` },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    // 조달계획관리 공통 셸(PageTitle + full-bleed 플러시 스택). 과거 OpPageLayout 래퍼를 인라인.
    <div className="flex w-full flex-col">
      <PageTitle>조달계획관리</PageTitle>
      {/* 업무도움 — full-bleed 블루 바 (셸이 무패딩이라 -mx 불필요) */}
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

      {/* 목록 — 헤더 + 카드 (px-4 인셋) */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4">
        <ListSectionHeader total={total} pageSize={pageSize} onPageSizeChange={handlePageSize} />
        <CardList items={cardItems} />
      </div>

      {/* 더보기 (loaded/total — 스텁). 검색 중이면 걸러진 건수 기준. 모두 노출됐으면 숨김. */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB — BottomNav 위로 띄움. 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-20 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 상세필터 풀팝업 (필터 아이콘으로 open) */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={OP_SEARCH}
        value={filter}
        defaultValue={DEFAULT_VALUE}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
