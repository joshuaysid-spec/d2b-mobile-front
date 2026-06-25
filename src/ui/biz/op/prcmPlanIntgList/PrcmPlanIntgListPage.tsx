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
import { Infobox } from '@/ui/common/composites/Infobox'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type {
  SearchFilterSchema,
  SearchFilterSection,
  SearchFilterValue,
  DateRangePresetDef,
} from '@/types/search-filter'
import type { OpSearchFilter, OpPlanItem, OpSrchType } from '@/types/op'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── MUI-OP-01-M02 검색필터 schema (설계서 p11~13) ─────────────────────────────────
// 검색유형(srchType)에 따라 날짜·검색어·구분설정 섹션이 통째로 바뀐다. SearchFilter 에 정적 객체가
// 아니라 resolver(buildOpSearchSchema)로 넘겨, draft.srchType 변경 시마다 재구성되도록 한다.
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

// 검색유형 — 항상 첫 섹션(고정). 원형 라디오(○) · 필수.
const SRCH_TYPE_SECTION: SearchFilterSection = {
  key: 'srchType',
  title: '검색유형',
  fields: [
    {
      type: 'radio',
      key: 'srchType',
      required: true,
      showIndicator: true, // 검색유형은 원형 라디오(○) 표시 — 설계서 M02
      options: [
        { value: 'plan', label: '조달계획' },
        { value: 'spec', label: '사전규격' },
        { value: 'annual', label: '연간조달계획' },
      ],
    },
  ],
}

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
        selectAll: type === 'annual' ? { disabled: true } : true,
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

// 일자 설정 프리셋 칩 — 1개월/3개월/6개월/기간검색 (설계서 일자설정). 기본 프리셋(1주일~) 대신 사용.
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
  { label: '기간검색', custom: true },
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
  // 조달계획: 월 설정(발주예정월). TODO: 월 단위(YYYY-MM) 피커로 교체 — date-input 개선 시
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
        { type: 'dateRange', key: 'orderPrnmntYm', required: true, presets: DATE_PRESETS },
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
function keywordSection(type: OpSrchType): SearchFilterSection {
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
  if (type === 'plan') {
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

// 최종 resolver — draft 의 검색유형으로 섹션 조립. SearchFilter 에 함수째 넘긴다.
function buildOpSearchSchema(value: SearchFilterValue): SearchFilterSchema {
  const type = (value.srchType as OpSrchType) ?? 'plan'
  // 사전규격: 일자설정 → 검색어 → 공개일설정 (공개일이 검색어 뒤). 그 외: 날짜 → 검색어 → 구분설정.
  const sections =
    type === 'spec'
      ? [
          SRCH_TYPE_SECTION,
          taskSection(type),
          ...dateSections(type),
          keywordSection(type),
          opnDtSection(),
        ]
      : [
          SRCH_TYPE_SECTION,
          taskSection(type),
          ...dateSections(type),
          keywordSection(type),
          ...categorySections(type),
        ]
  return {
    title: '검색필터',
    sections,
  }
}

// 검색유형별 업무구분 기본값 — 검색유형 전환 시 normalize 로 이 값으로 교체한다.
const TASK_DEFAULT_BY_TYPE: Record<OpSrchType, string[]> = {
  plan: ['goods', 'service', 'construction', 'foreign'], // 전체
  spec: ['goods', 'service', 'construction'], // 국외 없음
  annual: ['foreign'], // 국외만
}

// 검색유형이 바뀌면 종속 필드(업무구분)를 새 유형 기본값으로 교체. 그 외 변경은 그대로 통과.
// (도메인 로직이라 SearchFilter 가 아닌 페이지가 소유 → normalize prop 으로 주입)
function normalizeOpSearch(next: SearchFilterValue, prev: SearchFilterValue): SearchFilterValue {
  if (next.srchType === prev.srchType) return next
  const type = (next.srchType as OpSrchType) ?? 'plan'
  return { ...next, taskSeNm: TASK_DEFAULT_BY_TYPE[type] }
}

const RECENT_1M = () => ({
  start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
  end: dayjs().format(DATE_FORMAT),
})

// 초기/초기화 기준값 — 검색유형 조달계획. 유형 전환 시 normalize 가 종속 필드를 보정하므로,
// 여기엔 모든 유형의 키를 한 벌씩 담아둔다(전환 후 빈값으로 떨어지지 않게).
const DEFAULT_VALUE: OpSearchFilter = {
  srchType: 'plan',
  taskSeNm: TASK_DEFAULT_BY_TYPE.plan,
  // 조달계획 — 월 설정(최근 1개월)
  orderPrnmntYm: RECENT_1M(),
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

// 조달계획 통합목록 데이터(dlt_prcmPlanList, 기획서 p15 1.4) — 목업, 추후 API(opService.getList).
// 검색유형별 업무구분: plan=물품/용역/공사/국외 · spec=물품/용역/공사(국외 없음) · annual=국외만.
// 카드 클릭 라우팅은 srchType 으로만 분기(handleCardClick): plan→/op/:id, spec→/op/spec/:id, annual→/op/ovs/:id.
// (실제로는 srchType 별 별도 조회 — 여기선 1개 변수에 혼합)
const TOTAL = 100 // 총 건수(목업 — 실제 API total)
const dlt_prcmPlanList: OpPlanItem[] = [
  // 조달계획 · 국내(물품/용역/공사) → /op/:id (국내 분기)
  {
    id: '1',
    srchType: 'plan',
    no: 1,
    taskSeNm: '물품',
    ctrtMthdCd: '수의계약',
    bidMthdCd: '전자입찰',
    prcmNo: '6000A',
    prcmPlanNm: "'26년 K5방독면",
    orderPrnmntYm: '2026-03',
    deptCd: '화력총괄계약팀',
    userNm: '김조달',
    drctnAmt: 11616000,
    implPrgrsStcd: '조달계획',
  },
  {
    id: '2',
    srchType: 'plan',
    no: 2,
    taskSeNm: '용역',
    ctrtMthdCd: '일반경쟁',
    bidMthdCd: '전자입찰',
    prcmNo: '6000B',
    prcmPlanNm: "'26년 정보화 유지보수 사업",
    orderPrnmntYm: '2026-04',
    deptCd: '정보화팀',
    userNm: '이정보',
    drctnAmt: 92472000,
    implPrgrsStcd: '공고게시',
  },
  {
    id: '3',
    srchType: 'plan',
    no: 3,
    taskSeNm: '공사',
    ctrtMthdCd: '제한경쟁',
    bidMthdCd: '전자입찰',
    prcmNo: '6000C',
    prcmPlanNm: "'26년 막사 보수 공사",
    orderPrnmntYm: '2026-02',
    deptCd: '시설관리단',
    userNm: '박시설',
    drctnAmt: 158000000,
    implPrgrsStcd: '계약대기',
  },
  // 조달계획 · 국외(업무구분) — srchType=plan 이므로 조달계획상세(/op/:id)로 이동
  {
    id: '4',
    srchType: 'plan',
    no: 4,
    taskSeNm: '국외',
    ctrtMthdCd: '일반경쟁',
    bidMthdCd: '전자입찰',
    prcmNo: '6000D',
    prcmPlanNm: "'26년 야간투시경 해외구매",
    orderPrnmntYm: '2026-05',
    deptCd: '해외조달팀',
    userNm: '최해외',
    drctnAmt: 540000000,
    implPrgrsStcd: '계약완료',
  },
  // 사전규격 · 국내(물품/용역/공사 — 국외 없음) → /op/spec/:id
  {
    id: '5',
    srchType: 'spec',
    no: 5,
    taskSeNm: '용역',
    ctrtMthdCd: '일반경쟁',
    bidMthdCd: '전자입찰',
    prcmNo: '6000E',
    prcmPlanNm: "'26년 통신장비 사전규격",
    orderPrnmntYm: '2026-03',
    deptCd: '통신정보팀',
    userNm: '정통신',
    drctnAmt: 47200000,
    implPrgrsStcd: '조달계획',
  },
  {
    id: '7',
    srchType: 'spec',
    no: 6,
    taskSeNm: '물품',
    ctrtMthdCd: '수의계약',
    bidMthdCd: '전자입찰',
    prcmNo: '6000G',
    prcmPlanNm: "'26년 전투화 사전규격",
    orderPrnmntYm: '2026-04',
    deptCd: '피복관리팀',
    userNm: '한피복',
    drctnAmt: 33500000,
    implPrgrsStcd: '조달계획',
  },
  {
    id: '8',
    srchType: 'spec',
    no: 7,
    taskSeNm: '공사',
    ctrtMthdCd: '제한경쟁',
    bidMthdCd: '전자입찰',
    prcmNo: '6000H',
    prcmPlanNm: "'26년 정비고 증축 사전규격",
    orderPrnmntYm: '2026-05',
    deptCd: '시설관리단',
    userNm: '박시설',
    drctnAmt: 210000000,
    implPrgrsStcd: '공고게시',
  },
  // 연간조달계획 · 국외만 → /op/ovs/:id (국외 분기)
  {
    id: '6',
    srchType: 'annual',
    no: 8,
    taskSeNm: '국외',
    ctrtMthdCd: '일반경쟁',
    bidMthdCd: '전자입찰',
    prcmNo: '6000F',
    prcmPlanNm: "'26년 연간 군수품 해외조달",
    orderPrnmntYm: '2026-06',
    deptCd: '해외조달팀',
    userNm: '최해외',
    drctnAmt: 880000000,
    implPrgrsStcd: '계약대기',
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
  // id·prcmNo·no 는 고유해야 하므로 인덱스로 구분 (key 안정성 + 판단번호 검색 데모용)
  return { ...base, id: String(i + 1), no: i + 1, prcmNo: `${base.prcmNo}-${i + 1}` }
})

export function PrcmPlanIntgListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT_VALUE)
  const [keyword, setKeyword] = useState('') // 빠른검색어(입력 중)
  const [targets, setTargets] = useState<string[]>(['prcmPlanNm']) // 빠른검색 대상(single — 1개만)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  // 빠른검색 '적용' 상태 — 검색 버튼(또는 Enter)을 눌렀을 때만 확정된다.
  // (입력 중에는 목록이 걸러지지 않고, 검색을 실행해야 dlt_prcmPlanList 가 필터됨)
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  // 검색어 selectionField(품명/발주기관) 의 검색시트는 SearchFilter 셸이 직접 연다(searchSheet).

  // 검색유형이 연간조달이면 빠른검색 대상 칩을 재고번호/조달요구번호로 교체(설계서 p11).
  const isAnnual = filter.srchType === 'annual'
  const searchTargets = isAnnual ? ANNUAL_SEARCH_TARGETS : SEARCH_TARGETS

  // ── API 경계 스텁 (백엔드 연동 시 services/op·queries/op 로 대체). console 로 동작 확인 ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    // 검색유형이 바뀌면 빠른검색 대상을 그 유형 기본값으로 리셋(연간조달=재고번호, 그 외=조달명).
    // (이전 선택 'prcmNm' 등이 새 유형 칩에 없어 비활성으로 남는 것 방지)
    if (value.srchType !== filter.srchType) {
      setTargets([value.srchType === 'annual' ? 'stockNo' : 'prcmPlanNm'])
    }
    setFilter(value)
    setPage(1) // 필터(검색유형 등) 적용 시 첫 페이지부터
    setKeyword('') // 검색필터 팝업에서 '검색' 실행 시 빠른검색 입력값 비움(닫기는 유지 — handleSearch 만 호출됨)
    setAppliedSearch(null) // 빠른검색어 초기화(유형 바뀌면 이전 키워드 필터 해제)
    console.log('[OpList] 상세필터 검색', value)
    // services/op.ts: opService.getList(toRequest(value)) → 목록 재조회
  }
  const handleQuickSearch = () => {
    // 검색대상(targets)은 single 칩이라 항상 1개만 선택됨 — 첫 값을 검색 기준으로 사용.
    const target = targets[0] ?? 'prcmPlanNm'
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
  // 카드 클릭 라우팅 — 검색유형(srchType)으로만 분기(taskSeNm 하드코딩 분기 제거).
  //   조달계획(plan)  → 조달계획상세 (/op/:id)      ※ 국외 업무구분이어도 항상 조달계획상세
  //   사전규격(spec)  → 사전규격상세 (/op/spec/:id)
  //   연간조달(annual) → 국외 상세   (/op/ovs/:id)   ※ 연간조달 = 국외 → 항상 국외 상세
  const ROUTE_BY_SRCH_TYPE: Record<OpSrchType, (id: string) => string> = {
    plan: (id) => `/op/${id}`,
    spec: (id) => `/op/spec/${id}`,
    annual: (id) => `/op/ovs/${id}`,
  }
  const handleCardClick = (item: OpPlanItem) => {
    // 클릭 항목을 state 로 함께 전달 — 상세에서 즉시표시 초기값(재조회 없이 헤더/요약 렌더).
    // (CLAUDE.md "목록 → 상세 데이터 전달")
    navigate((ROUTE_BY_SRCH_TYPE[item.srchType] ?? ROUTE_BY_SRCH_TYPE.plan)(item.id), {
      state: item,
    })
  }

  // ── ⚠️ 임시 목업 검색/페이징 (API 연동 시 이 블록 통째로 삭제 후 재작성) ⚠️ ──────────
  // [현재] 보유한 MOCK_LIST 를 클라이언트에서 필터(검색) + 슬라이스(더보기) 한다.
  //   filteredList: SEARCH_TARGET(검색대상)에 따라 검색 필드를 바꿔 부분일치(대소문자 무시)로 거름.
  //     - 'prcmPlanNm'(조달명)  → 카드 제목(it.prcmPlanNm)
  //     - 'prcmNo'(판단번호) → 판단번호(it.prcmNo)
  //     - 연간조달 'stockNo'(재고번호)/'prcmReqNo'(조달요구번호) → 목업에 필드 없어 prcmNo 로 대체(API 연동 시 매핑)
  //     아직 검색 실행 전(appliedSearch null)이거나 검색어가 비면 전체(MOCK_LIST).
  //   visibleList: 더보기 누른 만큼(page*pageSize=loaded)만 잘라서 노출 → 더보기 1번에 10개씩 추가.
  // [변경 예정] 위 "보유 데이터 필터 + 슬라이스" 대신, 검색·더보기 모두 서버 API 호출로 교체:
  //   opService.getList({ page, pageSize, keyword, searchTarget }) 결과를 받아 누적/치환한다.
  //   → filteredList(useMemo) · visibleList(slice) 제거하고 fetch 한 데이터로 cardItems 를 만든다.
  const filteredList = useMemo(() => {
    // ① 검색유형(srchType) 필터 — 적용된 검색유형의 데이터만 노출(기본 조달계획). 목록은 항상 한 유형만.
    const srchType = (filter.srchType as OpSrchType) ?? 'plan'
    const byType = MOCK_LIST.filter((it) => it.srchType === srchType)
    // ② 빠른검색 키워드 필터(검색 실행 시에만)
    if (!appliedSearch || !appliedSearch.keyword) return byType
    const kw = appliedSearch.keyword.toLowerCase()
    return byType.filter((it) => {
      // 조달명만 제목 검색, 나머지(판단번호·재고번호·조달요구번호)는 prcmNo 검색(목업 한계).
      const field = appliedSearch.target === 'prcmPlanNm' ? it.prcmPlanNm : it.prcmNo
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch, filter.srchType])

  // 총건수·더보기는 항상 걸러진(검색유형+검색어) 결과 기준.
  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  // 더보기 누른 만큼만 노출 (10개씩 추가). API 연동 시엔 서버가 페이지 단위로 주므로 slice 불필요.
  const visibleList = filteredList.slice(0, loaded)

  // 목업 → Card props 매핑 (Design §3.2)
  const cardItems: CardListItem[] = visibleList.map((it) => ({
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
  }))

  return (
    // 조달계획관리 공통 셸(PageTitle + full-bleed 플러시 스택). 과거 OpPageLayout 래퍼를 인라인.
    <div className="flex w-full flex-col">
      {/* <PageTitle>조달계획관리</PageTitle> */}
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
          targets={searchTargets}
          selectedTargets={targets}
          onTargetsChange={setTargets}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onFilterClick={() => setOpen(true)}
          filterActive // 이 화면은 검색유형 필터가 항상 적용 중 → 필터 버튼 always on
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
      {/* 카드 (px-4 인셋) */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
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
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 상세필터 풀팝업 (필터 아이콘으로 open) */}
      {/* 검색유형(조달계획/사전규격/연간조달)에 따라 섹션이 달라짐 — schema 를 resolver 로,
          유형 전환 시 업무구분 보정은 normalize 로 처리(설계서 MUI-OP-01-M02 p11~13). */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={buildOpSearchSchema}
        normalize={normalizeOpSearch}
        value={filter}
        defaultValue={DEFAULT_VALUE}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
