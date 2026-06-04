// 조달계획 통합목록(MUI-OP-01-M01, node 9300-36815). Design Ref: op-list-page.design.
// 구성: 업무도움(Infobox) + 검색조건(SearchCondition, 필터버튼→풀팝업) + 목록헤더(총건수·page size)
//      + 카드 리스트(CardList, Card 재사용) + 더보기 + 맨위로 FAB.
// 데이터/페이징/검색은 페이지가 소유. 목록은 목업(OP_ITEMS), 더보기·page size·빠른검색은 API 경계 스텁
//   (Plan SC: 핸들러 실행 + console.log 로 변수 변화 확인). 상세필터 풀팝업(SearchFilter)은 기구현.
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { OpPageLayout } from '@/ui/biz/op/OpPageLayout'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { ItemSearchPopup } from '@/ui/biz/op/ItemSearchPopup'
import { ProducerSearchPopup } from '@/ui/biz/op/ProducerSearchPopup'
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
          options: [
            { value: 'all', label: '전체' },
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
        // 선택필드(`>`) — 터치 시 페이지가 검색 팝업을 연다(onSelectionClick).
        //   품명     → 품목별 검색 (MUI-OP-01-P71)
        //   발주기관 → 생산자 검색 (MUI-OP-01-P72)
        {
          type: 'selectionField',
          key: 'rprsItemNm',
          label: '품명',
          placeholder: '품명을 입력하세요.',
        },
        {
          type: 'selectionField',
          key: 'deptCd',
          label: '발주기관',
          placeholder: '발주기관을 입력하세요.',
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
  taskSeNm: ['all'], // 업무구분 기본 — 전체
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

// 목업 목록 — 추후 API(opService.getList) 로 대체. Design Ref: §3.3.
const TOTAL = 100 // 총 건수(목업 — 실제 API total)
const OP_ITEMS: OpPlanItem[] = [
  {
    id: '1',
    taskSe: '물품',
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
    taskSe: '용역',
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
    taskSe: '물품',
    ctrtMthdNm: '제한경쟁',
    prcmNo: '6000C',
    title: "'26년 전투화 구매",
    orderPrnmntYm: '2026-02',
    orderDeptNm: '군수사령부',
    ctrtMthd: '단가제',
    budgetAmt: 34500000,
  },
  {
    id: '4',
    taskSe: '공사',
    ctrtMthdNm: '수의계약',
    prcmNo: '6000D',
    title: "'26년 막사 보수 공사",
    orderPrnmntYm: '2026-05',
    orderDeptNm: '시설관리단',
    ctrtMthd: '총액제',
    budgetAmt: 158000000,
  },
  {
    id: '5',
    taskSe: '용역',
    ctrtMthdNm: '수의계약',
    prcmNo: '6000E',
    title: "'26년 보안 관제 위탁",
    orderPrnmntYm: '2026-03',
    orderDeptNm: '보안운영팀',
    ctrtMthd: '총액제',
    budgetAmt: 47200000,
  },
  {
    id: '6',
    taskSe: '물품',
    ctrtMthdNm: '일반경쟁',
    prcmNo: '6000F',
    title: "'26년 야전상의 구매",
    orderPrnmntYm: '2026-06',
    orderDeptNm: '피복관리소',
    ctrtMthd: '단가제',
    budgetAmt: 21800000,
  },
]

export function OpListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT_VALUE)
  const [keyword, setKeyword] = useState('') // 빠른검색어
  const [targets, setTargets] = useState<string[]>(['prcmNm']) // 빠른검색 대상
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  // selectionField → 검색 팝업(P71/P72). commit 은 클릭된 필드의 onChange(드래프트 주입) 보관.
  const [itemSearchOpen, setItemSearchOpen] = useState(false) // P71 품목별 검색
  const [producerSearchOpen, setProducerSearchOpen] = useState(false) // P72 생산자 검색
  const commitRef = useRef<((value: string) => void) | null>(null)

  // 품명(rprsItemNm)→P71 / 발주기관(deptCd)→P72. 선택 결과는 commitRef 로 필터 필드에 주입.
  const handleSelectionClick = (key: string, _current: string, commit: (v: string) => void) => {
    commitRef.current = commit
    if (key === 'rprsItemNm') setItemSearchOpen(true)
    else if (key === 'deptCd') setProducerSearchOpen(true)
  }

  // ── API 경계 스텁 (백엔드 연동 시 services/op·queries/op 로 대체). console 로 동작 확인 ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    console.log('[OpList] 상세필터 검색', value)
    // services/op.ts: opService.getList(toRequest(value)) → 목록 재조회
  }
  const handleQuickSearch = () => {
    console.log('[OpList] 빠른검색', { keyword, targets })
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
  const handleCardClick = (id: string) => {
    navigate(`/op/${id}`)
  }

  const loaded = Math.min(page * pageSize, TOTAL)

  // 목업 → Card props 매핑 (Design §3.2)
  const cardItems: CardListItem[] = OP_ITEMS.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSe}</Badge>
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
    onClick: () => handleCardClick(it.id),
  }))

  return (
    <OpPageLayout title="조달계획관리">
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
        <ListSectionHeader total={TOTAL} pageSize={pageSize} onPageSizeChange={handlePageSize} />
        <CardList items={cardItems} />
      </div>

      {/* 더보기 (loaded/total — 스텁) */}
      <div className="px-4 pb-6">
        <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
          더보기 ({loaded}/{TOTAL}건)
        </Button>
      </div>

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
        onSelectionClick={handleSelectionClick}
      />

      {/* 검색어 selectionField 연계 팝업 — 결과 선택 시 commitRef 로 해당 필드에 값 주입 */}
      <ItemSearchPopup
        open={itemSearchOpen}
        onOpenChange={setItemSearchOpen}
        onSelect={(v) => commitRef.current?.(v)}
      />
      <ProducerSearchPopup
        open={producerSearchOpen}
        onOpenChange={setProducerSearchOpen}
        onSelect={(v) => commitRef.current?.(v)}
      />
    </OpPageLayout>
  )
}
