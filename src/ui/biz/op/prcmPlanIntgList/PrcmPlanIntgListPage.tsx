// 조달계획 통합목록(MUI-OP-01-M01, node 9300-36815). Design Ref: op-list-page.design.
// 구성: 업무도움(Infobox) + 검색조건(SearchCondition, 필터버튼→풀팝업) + 목록헤더(총건수·page size)
//      + 카드 리스트(CardList, Card 재사용) + 더보기 + 맨위로 FAB.
// 데이터: useSelectPrcmPlanList(queries/bds/op) — 목업/실연동은 opService(USE_MOCK)가 전환. 목업 데이터는 mocks/op.ts.
// 키워드 검색·더보기(페이징)는 아직 클라이언트 로직(서버 페이징 전환 시 훅 파라미터로 이행 — queries/bds/op/opQueries.ts 참조).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { opQueries } from '@/queries/bds/op/opQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type {
  SearchFilterSchema,
  SearchFilterSection,
  SearchFilterValue,
  DateRangePresetDef,
} from '@/types/search-filter'
import type { OpSearchFilter, OpListItem, OpSrchType } from '@/types/mock/op'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── MUI-OP-01-M02 검색필터 schema (설계서 p11~13) ─────────────────────────────────
// 검색유형(srchType)에 따라 날짜·검색어·구분설정 섹션이 통째로 바뀐다. 단, 검색유형 자체는
// 더 이상 필터 내부 값이 아니라 **페이지 상단 탭**(설계서 p10 '유형 추가', 2026-06-18)이 정하므로,
// SearchFilter 에는 현재 탭으로 만든 정적 schema(buildOpSearchSchema(tab))를 넘긴다.
// (설계서 p12·p13 '검색 유형 삭제', 2026-06-18 — 검색유형 섹션 제거)
//   - 조달계획(plan, p11) : 월 설정 / 검색어 5(제목·판단번호·대표품명·발주기관·담당자) / 구분설정 4 / 업무구분 전체
//   - 사전규격(spec, p12) : 일자 설정 + 공개일 설정 / 검색어 4(품명 없음) / 구분설정 없음 / 업무구분 '국외' 비활성
//   - 연간조달(annual,p13): 연도 설정 / 검색어 4(군구분·품질등급·재고번호·부품번호) / 구분설정 4 / 업무구분 '국외'만 활성

// 진행상태 드롭다운 옵션 (조달계획·연간조달 공통)
const PROGRESS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'plan', label: '조달계획' },
  { value: 'posted', label: '공고게시' },
  { value: 'waiting', label: '계약대기' },
  { value: 'done', label: '계약완료' },
]
// 옵션 미확정 드롭다운 자리 — 현재 '전체'만(TODO: 백엔드 코드값 확정 시 채움)
const ALL_ONLY = [{ value: 'all', label: '전체' }]

// 업무구분 — 라벨/값은 동일, 검색유형별 활성/비활성만 다름.
//   spec: '국외' 비활성(사전규격은 국외 없음) · annual: '국외'만 활성(타 항목 비활성)
function taskSection(type: OpSrchType): SearchFilterSection {
  return {
    key: 'taskSeNm',
    title: '업무구분',
    fields: [
      {
        type: 'checkbox',
        key: 'taskSeNm',
        required: true,
        // '전체' 칩 — 비활성 제외 항목과 자동 동기화. 연간조달은 국외만 선택 가능하므로 '전체'도 비활성.
        // value '0' = '전체' 공통코드값 — 전체 선택 시 값 배열에 포함(PC 전송 규격 "0 1 2 3 4").
        selectAll: type === 'annual' ? { disabled: true } : { value: '0' },
        options: [
          // 연간조달: 국외만 활성(타 항목 비활성) · 사전규격: 국외 없음(비활성)
          { value: 'goods', label: '물품', disabled: type === 'annual' },
          { value: 'service', label: '용역', disabled: type === 'annual' },
          { value: 'construction', label: '공사', disabled: type === 'annual' },
          { value: 'foreign', label: '국외', disabled: type === 'spec' },
        ],
      },
    ],
  }
}

// 일자 설정 프리셋 칩 — 1개월/3개월/6개월 (설계서 일자설정). 기본 프리셋(1주일~) 대신 사용.
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

// 날짜 섹션 — 유형별로 완전히 다름.
function dateSections(type: OpSrchType): SearchFilterSection[] {
  if (type === 'spec') {
    // 사전규격: 일자 설정(접수기간)만. 공개일 설정은 검색어 뒤로(opnDtSection, buildOpSearchSchema 에서 배치).
    return [
      {
        key: 'date',
        title: '일자 설정',
        fields: [
          // 상단 세그먼트 — 날짜 유형 지표(사전규격=접수기간). Figma m_segmented control
          {
            type: 'segment',
            key: 'dateType',
            options: [{ value: 'rcptPeriod', label: '접수기간' }],
          },
          { type: 'dateRange', key: 'rcptPeriod', required: true, presets: DATE_PRESETS },
        ],
      },
    ]
  }
  if (type === 'annual') {
    // 연간조달: 연도 설정(지시년도) — 단일 연도 직접 입력
    return [
      {
        key: 'date',
        title: '연도 설정',
        fields: [
          // 연도만 선택하는 데이트피커(YearInput, 휠). required 없음.
          {
            type: 'year',
            key: 'stdYr',
            label: '지시년도',
            placeholder: '지시년도를 선택하세요.',
          },
        ],
      },
    ]
  }
  // 조달계획: 월 설정(발주예정월) — 월 단위(YYYY-MM) 피커(260730 확정, 구 dateRange 임시 구현 대체).
  return [
    {
      key: 'date',
      title: '월 설정',
      fields: [
        // 상단 세그먼트 — 날짜 유형 지표(조달계획=발주예정월). Figma m_segmented control
        {
          type: 'segment',
          key: 'dateType',
          options: [{ value: 'orderPrnmntYm', label: '발주예정월' }],
        },
        { type: 'monthRange', key: 'orderPrnmntYm', required: true },
      ],
    },
  ]
}

// 공개일 설정 섹션 — 사전규격 전용. 검색어 뒤에 배치. 날짜 필드 라벨은 '일자설정'.
function opnDtSection(): SearchFilterSection {
  return {
    key: 'opnDt',
    title: '공개일 설정',
    fields: [{ type: 'date', key: 'opnDt', label: '일자설정', placeholder: '날짜를 선택하세요.' }],
  }
}

// 검색어 섹션 — 유형별 필드 구성 다름.
// 선택필드(`>`) 는 SearchFilter 셸이 공통 검색시트를 직접 연다(searchSheet):
//   'item' → 품목별조회(P71, ItemInq) · 'producer' → 생산자조회(P72, PrdcrInq)
function keywordSection(type: OpSrchType, isGoods: boolean): SearchFilterSection {
  if (type === 'annual') {
    // 연간조달: 군구분·품질등급·재고번호·부품번호 + 품목(품목별검색)·생산자(생산자검색)
    return {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'mlSvcNm', label: '군구분', placeholder: '군구분을 입력하세요.' },
        {
          type: 'text',
          key: 'qltyGradeNm',
          label: '품질등급',
          placeholder: '품질등급을 입력하세요.',
        },
        {
          type: 'selectionField',
          key: 'stockNo',
          label: '재고번호',
          placeholder: '재고번호를 선택하세요.',
          searchSheet: 'item',
        },
        { type: 'text', key: 'partNo', label: '부품번호', placeholder: '부품번호를 입력하세요.' },
        // 품목 → 품목별조회(P71) · 생산자 → 생산자조회(P72)
        {
          type: 'selectionField',
          key: 'itemNm',
          label: '품목',
          placeholder: '품목을 검색하세요.',
          searchSheet: 'item',
        },
        {
          type: 'selectionField',
          key: 'prdctnNm',
          label: '생산자',
          placeholder: '생산자를 검색하세요.',
          searchSheet: 'producer',
        },
      ],
    }
  }
  // plan / spec 공통(제목·판단번호·발주기관·담당자). 대표품명은 조달계획만.
  const fields: SearchFilterSection['fields'] = [
    { type: 'text', key: 'prcmPlanNm', label: '제목', placeholder: '제목을 입력하세요.' },
    { type: 'text', key: 'prcmNo', label: '판단번호', placeholder: '번호를 입력하세요.' },
  ]
  if (type === 'plan' && isGoods) {
    // 대표품명 → 품목별조회(P71)
    fields.push({
      type: 'selectionField',
      key: 'rprsItemNm',
      label: '대표품명',
      placeholder: '대표품명을 입력하세요.',
      searchSheet: 'item',
    })
  }
  fields.push(
    // 발주기관 → 발주부서(기관)검색(MUI-BD-01-P04, DeptInq)
    {
      type: 'selectionField',
      key: 'deptCd',
      label: '발주기관',
      placeholder: '발주기관을 입력하세요.',
      searchSheet: 'dept',
    },
    { type: 'text', key: 'userNm', label: '담당자', placeholder: '담당자를 입력하세요.' },
  )
  return { key: 'keyword', title: '검색어 (일부 입력 가능)', fields }
}

// 구분설정 섹션 — 조달계획/연간조달만. 사전규격은 구분설정 없음(설계서 p12).
function categorySections(type: OpSrchType): SearchFilterSection[] {
  if (type === 'spec') return []
  if (type === 'annual') {
    // 연간조달: 부서/기능/진행상태/품류
    return [
      {
        key: 'category',
        title: '구분설정',
        fields: [
          {
            type: 'select',
            key: 'deptSeCd',
            label: '부서',
            placeholder: '전체',
            options: ALL_ONLY,
          },
          {
            type: 'select',
            key: 'functnCd',
            label: '기능',
            placeholder: '전체',
            options: ALL_ONLY,
          },
          {
            type: 'select',
            key: 'implPrgrsStcd',
            label: '진행상태',
            placeholder: '전체',
            options: PROGRESS_OPTIONS,
          },
          {
            type: 'select',
            key: 'prdClsfCd',
            label: '품류',
            placeholder: '전체',
            options: ALL_ONLY,
          },
        ],
      },
    ]
  }
  // 조달계획: 진행상태만(기능/입찰형태/계약방법 삭제 — 설계서 수정)
  return [
    {
      key: 'category',
      title: '구분설정',
      fields: [
        {
          type: 'select',
          key: 'implPrgrsStcd',
          label: '진행상태',
          placeholder: '전체',
          options: PROGRESS_OPTIONS,
        },
      ],
    },
  ]
}

// 최종 schema 빌더 — 현재 탭(검색유형)으로 섹션 조립. 검색유형은 페이지 탭이 정하므로 인자로 받는다.
// 동적 스키마: 셸이 매 렌더 draft(편집 중 값)로 재호출 — 업무구분 '물품' 체크 여부로 대표품명 노출 전환.
function buildOpSearchSchema(type: OpSrchType, draft?: SearchFilterValue): SearchFilterSchema {
  // draft 미전달(초기)이면 노출 — plan 탭 기본값이 전체 선택(goods 포함)이라 기본 상태와 일치.
  const isGoods = !draft || ((draft.taskSeNm as string[]) ?? []).includes('goods')
  // 사전규격: 일자설정 → 검색어 → 공개일설정 (공개일이 검색어 뒤). 그 외: 날짜 → 검색어 → 구분설정.
  const sections =
    type === 'spec'
      ? [taskSection(type), ...dateSections(type), keywordSection(type, isGoods), opnDtSection()]
      : [
          taskSection(type),
          ...dateSections(type),
          keywordSection(type, isGoods),
          ...categorySections(type),
        ]
  return {
    title: '검색필터',
    sections,
  }
}

// 검색유형별 업무구분 기본값 — 탭 전환 시 filter 를 이 유형 기본값으로 리셋한다.
const TASK_DEFAULT_BY_TYPE: Record<OpSrchType, string[]> = {
  plan: ['0', 'goods', 'service', 'construction', 'foreign'], // 전체('0' = 전체 코드값)
  spec: ['0', 'goods', 'service', 'construction'], // 국외 없음(비활성 제외 전체 = '0' 포함)
  annual: ['foreign'], // 국외만('전체' 비활성 — '0' 없음)
}

const RECENT_1M = () => ({
  start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
  end: dayjs().format(DATE_FORMAT),
})

// 탭(검색유형)별 초기/초기화 기준값. 탭 전환 시 filter 를 이 값으로 리셋하고, SearchFilter 초기화(reset)
// 도 이 값을 기준으로 한다. 유형마다 업무구분(taskSeNm) 기본값만 다르고 나머지 키는 한 벌씩 담아둔다
// (유형 전환 시 빈값으로 떨어지지 않게). srchType 은 더 이상 필터 값이 아님 — 페이지 탭이 소유.
function buildDefaultValue(type: OpSrchType): OpSearchFilter {
  return {
    taskSeNm: TASK_DEFAULT_BY_TYPE[type],
    // 조달계획 — 월 설정(이전 월 ~ 현재 월, YYYY-MM 월 단위)
    orderPrnmntYm: {
      start: dayjs().subtract(1, 'month').format('YYYY-MM'),
      end: dayjs().format('YYYY-MM'),
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
    // 사전규격 — 일자 설정(최근 1개월) + 공개일(기본 당일)
    rcptPeriod: RECENT_1M(),
    opnDt: dayjs().format(DATE_FORMAT),
    // 연간조달 — 연도/검색어/구분설정
    stdYr: dayjs().format('YYYY'),
    mlSvcNm: '',
    qltyGradeNm: '',
    stockNo: '',
    partNo: '',
    itemNm: '',
    prdctnNm: '',
    deptSeCd: 'all',
    functnCd: 'all',
    prdClsfCd: 'all',
  }
}

// 검색유형 탭 — 설계서 p10(2026-06-18 '유형 추가'). 업무도움 바로 아래에서 유형 선택.
const SRCH_TYPE_TABS: TabItem[] = [
  { value: 'plan', label: '조달계획' },
  { value: 'spec', label: '사전규격' },
  { value: 'annual', label: '연간조달계획' },
]

// 빠른검색 대상 칩 — 검색유형별로 다름(설계서 p11).
//   기본(조달계획/사전규격): 조달명 · 판단번호
//   연간조달계획: 재고번호 · 조달요구번호 (기본 선택 = 재고번호)
const SEARCH_TARGETS = [
  { value: 'prcmPlanNm', label: '조달명' },
  { value: 'prcmNo', label: '판단번호' },
]
const ANNUAL_SEARCH_TARGETS = [
  { value: 'stockNo', label: '재고번호' },
  { value: 'prcmReqNo', label: '조달요구번호' },
]

// 목록 데이터는 useSelectPrcmPlanList(검색유형별 조회)가 공급 — 목업 데이터는 mocks/op.ts(구 인라인 목업 이관).
// 검색유형별 업무구분: plan=물품/용역/공사/국외 · spec=물품/용역/공사(국외 없음) · annual=국외만.
// 카드 클릭 라우팅은 srchType 으로만 분기(handleCardClick): plan→/op/prcmPlanDtl, spec→/op/bfhdSpcfctDtl,
//   annual→/op/ovsPrcmPlanDtl(국외 연간조달계획 상세 MUI-OP-01-M78, 설계서 slide76 '클릭 시 M78 상세 화면 이동').
//   목록정보조회(P76)는 이제 M78 상세 안 재고번호에서 연다(구 목록 위 바텀시트 배선 제거).

export function PrcmPlanIntgListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업
  // 검색유형 — 업무도움 아래 탭이 소유(설계서 p10 '유형 추가'). filter 안이 아님.
  const [tab, setTab] = useState<OpSrchType>('plan')
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue('plan'))
  const [keyword, setKeyword] = useState('') // 빠른검색어(입력 중)
  const [targets, setTargets] = useState<string[]>(['prcmPlanNm']) // 빠른검색 대상(single — 1개만)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  // 상세필터가 적용됐는지 — 필터 버튼 강조(filterActive). 탭 전환 시 해제.
  const [filterApplied, setFilterApplied] = useState(false)
  // 빠른검색 '적용' 상태 — 검색 버튼(또는 Enter)을 눌렀을 때만 확정된다.
  // (입력 중에는 목록이 걸러지지 않고, 검색을 실행해야 dlt_prcmPlanList 가 필터됨)
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  // 검색어 selectionField(품명/발주기관) 의 검색시트는 SearchFilter 셸이 직접 연다(searchSheet).

  // 검색유형이 연간조달이면 빠른검색 대상 칩을 재고번호/조달요구번호로 교체(설계서 p11).
  const isAnnual = tab === 'annual'
  const searchTargets = isAnnual ? ANNUAL_SEARCH_TARGETS : SEARCH_TARGETS

  // 현재 탭 기준 schema — 함수로 넘겨 셸이 draft 로 재계산(동적 스키마: 물품 체크 시에만 대표품명).
  const schema = useMemo(() => (draft: SearchFilterValue) => buildOpSearchSchema(tab, draft), [tab])

  const tabDefaultValue = useMemo(() => buildDefaultValue(tab), [tab])

  // 목록 조회 — 검색유형(탭)별 전체 목록(목업/실연동은 opService 의 USE_MOCK 분기가 전환).
  // 서버 페이징/키워드 검색 전환 시: req 에 page/pageSize/keyword 를 넣으면 queryKey 가 바뀌어 재조회된다.
  const { data: planData } = opQueries.useSelectPrcmPlanList({ srchType: tab })

  // ── 목록 핸들러 — 확정값 상태만 갱신(조회는 useSelectPrcmPlanList + 아래 클라이언트 필터가 담당) ──
  // 검색유형 탭 전환 — 목록 유형 변경 + 관련 상태 리셋(page/빠른검색/필터). 구 normalize(업무구분 보정)는
  // 여기서 filter 를 그 유형 기본값(buildDefaultValue)으로 통째로 리셋하며 흡수한다.
  const handleTabChange = (next: string) => {
    const type = next as OpSrchType
    if (type === tab) return
    setTab(type)
    setFilter(buildDefaultValue(type)) // 유형 기본값으로 리셋(업무구분 등 종속 필드 포함)
    setFilterApplied(false) // 유형 바뀌면 이전 상세필터 강조 해제
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
    // 빠른검색 대상을 새 유형 기본값으로(연간조달=재고번호, 그 외=조달명).
    setTargets([type === 'annual' ? 'stockNo' : 'prcmPlanNm'])
    // 탭 변경 → useSelectPrcmPlanList queryKey 변경 → 유형별 목록 자동 재조회.
  }
  const handleFilterSearch = (value: SearchFilterValue) => {
    // 대표품명은 업무구분 '물품' 체크 시에만 노출되는 필드 — 물품 해제 상태로 검색하면
    // 숨겨지기 전 입력값이 남아 실려올 수 있어 여기서 비운다(동적 스키마 잔존값 정제).
    const isGoods = ((value.taskSeNm as string[]) ?? []).includes('goods')
    if (!isGoods) value = { ...value, rprsItemNm: '' }
    setFilter(value)
    setFilterApplied(true) // 상세필터 적용됨 → 필터 버튼 강조
    setPage(1) // 필터 적용 시 첫 페이지부터
    setKeyword('') // 검색필터 팝업에서 '검색' 실행 시 빠른검색 입력값 비움(닫기는 유지 — handleSearch 만 호출됨)
    setAppliedSearch(null) // 빠른검색어 초기화
    // 서버 필터 전환 시: useSelectPrcmPlanList req 에 filter(value)를 포함시켜 재조회한다(현재는 클라 필터 미적용 표시용).
  }
  const handleQuickSearch = () => {
    // 검색대상(targets)은 single 칩이라 항상 1개만 선택됨 — 첫 값을 검색 기준으로 사용.
    const target = targets[0] ?? 'prcmPlanNm'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1) // 새 검색은 첫 페이지부터
    // 서버 검색 전환 시: useSelectPrcmPlanList req 에 keyword/searchTarget 포함(현재는 아래 filteredList 클라 필터).
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
  }
  const handleLoadMore = () => {
    setPage(page + 1)
  }
  // 카드 클릭 라우팅 — 검색유형(srchType)으로만 분기(taskSeNm 하드코딩 분기 제거).
  //   조달계획(plan)   → 조달계획상세 (/op/prcmPlanDtl)   ※ 국외 업무구분이어도 항상 조달계획상세
  //   사전규격(spec)   → 사전규격상세 (/op/bfhdSpcfctDtl)
  //   연간조달(annual) → 국외 연간조달계획상세 (/op/ovsPrcmPlanDtl, MUI-OP-01-M78)
  const ROUTE_BY_SRCH_TYPE: Record<OpSrchType, string> = {
    plan: '/op/prcmPlanDtl',
    spec: '/op/bfhdSpcfctDtl',
    annual: '/op/ovsPrcmPlanDtl',
  }
  const handleCardClick = (item: OpListItem) => {
    // 클릭 항목을 state 로 전달 — 식별자는 URL 에 노출하지 않고 state 로만 넘긴다.
    // 상세는 이 값을 즉시표시 초기값 겸 조회 키로 쓴다. (CLAUDE.md "목록 → 상세 데이터 전달")
    navigate(ROUTE_BY_SRCH_TYPE[item.srchType], { state: item })
  }

  // ── 키워드 필터 + 더보기 슬라이스 — 클라이언트 로직(서버 페이징 전환 시 이 블록 삭제) ──
  //   filteredList: 조회 결과(planData.list)를 빠른검색 확정값으로 부분일치(대소문자 무시) 필터.
  //     - 조달계획/사전규격: 'prcmPlanNm'(조달명) → 제목 · 그 외(판단번호) → prcmNo
  //     - 연간조달계획: 'prcmReqNo'(조달요구번호) → prcmRqtNo · 그 외(재고번호) → fscCdNtnItemIdntfNo
  //   visibleList: 더보기 누른 만큼(page*pageSize)만 노출.
  //   서버 전환 시: keyword/page 를 useSelectPrcmPlanList req 로 옮기고 planData.total 을 총건수로 사용.
  const filteredList = useMemo(() => {
    const list = planData?.list ?? []
    if (!appliedSearch || !appliedSearch.keyword) return list
    const kw = appliedSearch.keyword.toLowerCase()
    return list.filter((it) => {
      const field =
        it.srchType === 'annual'
          ? appliedSearch.target === 'prcmReqNo'
            ? it.prcmRqtNo
            : it.fscCdNtnItemIdntfNo
          : appliedSearch.target === 'prcmPlanNm'
            ? it.prcmPlanNm
            : it.prcmNo
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch, planData])

  // 총건수·더보기는 항상 걸러진(검색유형+검색어) 결과 기준.
  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  // 더보기 누른 만큼만 노출 (10개씩 추가). API 연동 시엔 서버가 페이지 단위로 주므로 slice 불필요.
  const visibleList = filteredList.slice(0, loaded)

  // 목업 → Card props 매핑 (Design §3.2). 검색유형별 카드 항목이 다름:
  //   조달계획/사전규격(설계서 slide9) — 업무구분·계약방법 배지 + 판단번호/제목 + 발주정보 4행
  //   연간조달계획(설계서 slide76)     — 업무구분·군구분 배지 + 조달요구번호 + 품목정보 5행
  const cardItems: CardListItem[] = visibleList.map((it) =>
    it.srchType === 'annual'
      ? {
          id: it.id,
          badges: (
            <>
              <Badge>{it.taskSeNm}</Badge>
              <Badge>{it.prcmRqtInstCd}</Badge>
            </>
          ),
          title: `조달요구번호 ${it.prcmRqtNo}`,
          rows: [
            { label: '재고번호', value: it.fscCdNtnItemIdntfNo },
            { label: '부품번호', value: it.prtsNo },
            { label: '품질등급', value: it.inspShcd },
            { label: '생산자부호', value: it.prdcrSgn },
            { label: '접수기간', value: it.rcptPd },
          ],
          onClick: () => handleCardClick(it),
        }
      : {
          id: it.id,
          badges: (
            <>
              <Badge>{it.taskSeNm}</Badge>
              <Badge>{it.ctrtMthdCd}</Badge>
            </>
          ),
          subtitle: `판단번호 ${it.prcmNo}`,
          title: it.prcmPlanNm,
          rows: [
            { label: '발주예정월', value: it.orderPrnmntYm },
            { label: '발주기관', value: it.deptCd },
            { label: '입찰방법', value: it.bidMthdCd },
            { label: '예산금액', value: `${it.drctnAmt.toLocaleString()} 원` },
          ],
          onClick: () => handleCardClick(it),
        },
  )

  return (
    // 조달계획관리 공통 셸(PageTitle + full-bleed 플러시 스택). 과거 OpPageLayout 래퍼를 인라인.
    <div className="flex w-full flex-col">
      {/* <PageTitle>조달계획관리</PageTitle> */}
      {/* 업무도움 — full-bleed 블루 바 (셸이 무패딩이라 -mx 불필요). data-coach = 코치마크 측정 지점. */}
      <div data-coach="op-help">
        <Infobox
          className="rounded-none"
          title="업무도움"
          items={[
            '비밀번호 자동완성기능(ex. 알패스 등)은 사용할 수 없습니다.',
            '1577-1118 대표전화로 전화주세요. 서비스에 로그인할 수 있도록 도와드리겠습니다.',
          ]}
        />
      </div>

      {/* 업무도움 ↔ 탭 사이 1px 구분선 (Figma 9973-122615 m_section divider) */}
      <SectionDivider />

      {/* 검색유형 탭 — 업무도움 바로 아래(Figma 9973-122615, 2026-07-07 버튼 타입 전환).
          '유형' 레이블 + 라운드 칩 탭(조달계획/사전규격/연간조달계획). 컨테이너 p-16 + 하단 divider 는
          TabList(variant=button) 내장. 전환 시 목록 유형 + filter/빠른검색/page 리셋(handleTabChange). */}
      {/* fitted — 칩 탭들이 레이블 오른쪽 남은 폭을 균등 분할해 100% 채움. data-coach = 코치마크 측정 지점. */}
      <div data-coach="op-tabs">
        <TabList
          variant="button"
          label="유형"
          value={tab}
          onChange={handleTabChange}
          items={SRCH_TYPE_TABS}
          fitted
        />
      </div>

      {/* 검색영역 — 탭 바로 아래(설계 개정으로 '검색조건' 타이틀 바 삭제, Figma 9973-122615).
          data-coach = 코치마크 측정 지점(필터 버튼은 내부 aria-label 로 탐색). */}
      <div data-coach="op-search" className="px-4 py-4">
        <SearchCondition
          targets={searchTargets}
          selectedTargets={targets}
          onTargetsChange={setTargets}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onFilterClick={() => setOpen(true)}
          filterActive={filterApplied} // 상세필터를 적용한 경우에만 강조(설계서 '검색 필터 설정이 있는 경우 표시')
          onSearch={handleQuickSearch}
        />
      </div>

      {/* 목록 헤더 — background 바(full-bleed, 자체 px-4) */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />
      {/* 카드 (px-4 인셋). data-coach = 코치마크 측정 지점(첫 카드). */}
      <div data-coach="op-list" className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} />
      </div>

      {/* 더보기 (loaded/total — 스텁). 검색 중이면 걸러진 건수 기준. 모두 노출됐으면 숨김.
          data-coach = 코치마크 측정 지점. */}
      {loaded < total && (
        <div data-coach="op-more" className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB — BottomNav 위로 띄움. 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 상세필터 풀팝업 (필터 아이콘으로 open) */}
      {/* 검색유형은 상단 탭이 정하고(설계서 검색 유형 삭제), 그 탭으로 만든 정적 schema 를 넘긴다.
          유형별 섹션 구성은 buildOpSearchSchema 참고(설계서 MUI-OP-01-M02 p11~13). */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={schema}
        value={filter}
        defaultValue={tabDefaultValue}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
