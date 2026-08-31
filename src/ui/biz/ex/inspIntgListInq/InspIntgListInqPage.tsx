// 검사통합목록 — MUI-EX-01-M01 InspIntgListInq. 설계서 04.이행 v0.83 slide10~12.
// 구성: 검색조건(SearchCondition, 대상칩 계약명/계약번호 + 필터버튼→풀팝업) + 목록헤더(총건수·page size)
//      + 카드 리스트(CardList) + 더보기 + 맨위로 FAB + 검색필터(SearchFilter schema 주입, MUI-EX-01-P08).
// 데이터: exQueries.useSelectInspIntgList(queries/cts/ex) — 목업/실연동은 exService(USE_MOCK)가 전환. 목업은 mocks/ex.ts.
// 키워드 검색·더보기(페이징)는 클라이언트 로직(서버 페이징 전환 시 훅 파라미터로 이행).
// 업무도움(slide10 1])은 '내역이 없으면 항목을 표시하지 않음' — 안내 내역 확정 전이라 미표시(CT 동일 판단).
// 카드 클릭(slide10 3-1): 물품/용역 → P10 납품통지목록 풀팝업 · 공사 → M04 기성및준공검사상세(그룹 4 예정).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { exQueries } from '@/queries/cts/ex/exQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { DlvgdsAvtsmtListFullPopup } from '@/ui/biz/ex/inspIntgListInq/DlvgdsAvtsmtListFullPopup'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { MockInspIntgListItem } from '@/types/mock/ex'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── MUI-EX-01-P08 검색필터 schema (slide11~12) — 키는 검색조건(dml_InspIntgListSrchCnd) 항목명 그대로 ──

// 일자 프리셋 칩 — 최근 1/3/6개월(slide11 4-3). 미래 불가·최대 1년은 DateRangeInput 공통 동작.
const DATE_PRESETS = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

const EX_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'taskSecd',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSecd',
          required: true, // 필수값(slide11) — default 전체
          selectAll: { value: '0' }, // '전체' 칩(개별↔전체 자동 동기화) — '0' = 전체 코드값
          options: [
            { value: 'goods', label: '물품' },
            { value: 'service', label: '용역' },
            { value: 'construction', label: '공사' },
            { value: 'foreign', label: '국외', disabled: true }, // 국외 선택 불가(slide11)
          ],
        },
      ],
    },
    {
      key: 'date',
      title: '검색 설정',
      fields: [{ type: 'dateRange', key: 'ctrtYmd', label: '계약일자', presets: DATE_PRESETS }],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'ctrtNm', label: '계약명', placeholder: '계약건명을 입력하세요.' },
        // 계약번호 — 계약번호조회 공통시트(MUI-EX-02-P79, OvsCtrtNoInq) 연동. 셸이 시트를 직접 연다.
        {
          type: 'selectionField',
          key: 'ctrtNo',
          label: '계약번호',
          placeholder: '번호를 입력하세요.',
          searchSheet: 'ctrtNo',
        },
      ],
    },
    {
      key: 'category',
      title: '구분 설정',
      fields: [
        // 공사검사구분(pxcndCmcnSecd, 상위코드 UB64) — 필수값, default 전체(slide11).
        {
          type: 'select',
          key: 'pxcndCmcnSecd',
          label: '공사검사구분',
          placeholder: '전체',
          options: [
            { value: 'all', label: '전체' },
            { value: 'pxcnd', label: '기성' },
            { value: 'cmcn', label: '준공' },
          ],
        },
        // 진행상태 드롭다운(slide11 목업)은 검색조건(dml_InspIntgListSrchCnd) 미정의 — 확정 시 추가.
      ],
    },
  ],
}

// On-Load 기본값(slide12): 계약일자 = 현재일-1개월 ~ 현재일, 업무구분 = 전체.
function buildDefaultValue(): SearchFilterValue {
  return {
    taskSecd: ['0', 'goods', 'service', 'construction'], // 전체('0' = 전체 코드값, 국외 비활성 제외)
    ctrtYmd: {
      start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
      end: dayjs().format(DATE_FORMAT),
    },
    ctrtNm: '',
    ctrtNo: '',
    pxcndCmcnSecd: 'all',
  }
}

// 빠른검색 대상 칩 — slide10 목업(계약명/계약번호).
const SEARCH_TARGETS = [
  { value: 'ctrtNm', label: '계약명' },
  { value: 'ctrtNo', label: '계약번호' },
]

export function InspIntgListInqPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업(MUI-EX-01-P08)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('') // 빠른검색어(입력 중)
  const [targets, setTargets] = useState<string[]>(['ctrtNm']) // 빠른검색 대상(single)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false) // 상세필터 적용 → 필터 버튼 강조
  // 빠른검색 확정값 — 검색 실행(버튼/Enter) 시에만 반영(입력 중에는 목록을 거르지 않음).
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )
  // P10 납품통지목록 풀팝업 — 선택한 계약(물품/용역 카드 클릭). null=닫힘.
  const [pickedCtrt, setPickedCtrt] = useState<{ ctrtNo: string; ctrtNm: string } | null>(null)

  // 목록 조회 — 목업/실연동은 exService 의 USE_MOCK 분기가 전환.
  // 서버 필터/페이징 전환 시: req 에 filter/page/keyword 를 넣으면 queryKey 가 바뀌어 재조회된다.
  const { data: listData, isLoading } = exQueries.useSelectInspIntgList()

  // ── 핸들러 — 확정값 상태만 갱신(조회는 exQueries.useSelectInspIntgList + 아래 클라이언트 필터가 담당) ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
    // 서버 필터 전환 시: exQueries.useSelectInspIntgList req 에 filter(value)를 포함시켜 재조회(현재는 표시용).
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
  // 카드 클릭(slide12 이벤트) — 물품/용역 → P10 납품통지목록 · 공사 → M04 기성및준공검사상세.
  const handleCardClick = (item: MockInspIntgListItem) => {
    if (item.taskSecd === '공사') {
      // 식별자는 URL 이 아니라 state 로만 전달(상세가 item.id 로 조회).
      navigate('/ex/pxcndCmcnInspDtl', { state: item })
      return
    }
    setPickedCtrt({ ctrtNo: item.ctrtNo, ctrtNm: item.ctrtNm })
  }

  // ── 키워드 필터 + 더보기 슬라이스 — 클라이언트 로직(서버 페이징 전환 시 이 블록 삭제) ──
  // 계약명 → ctrtNm 부분일치 · 계약번호 → `${ctrtNo}-${ctrtCycl}` 부분일치(대소문자 무시).
  const filteredList = useMemo(() => {
    const list = listData?.list ?? []
    if (!appliedSearch || !appliedSearch.keyword) return list
    const kw = appliedSearch.keyword.toLowerCase()
    return list.filter((it) => {
      const field = appliedSearch.target === 'ctrtNm' ? it.ctrtNm : `${it.ctrtNo}-${it.ctrtCycl}`
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch, listData])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 카드 매핑 — slide10 목업: 뱃지(업무구분/예산구분/진행상태 + 공사면 기성준공구분) +
  // subtitle(계약번호+차수, 4-4]) + title(계약명, 4-5]) + 행(계약일자/계약금액).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSecd}</Badge>
        <Badge>{it.bgtSecdNm}</Badge>
        {it.pxcndCmcnSecd && <Badge>{it.pxcndCmcnSecd}</Badge>}
        <Badge>{it.dlvdocPrgrsStcd}</Badge>
      </>
    ),
    subtitle: `계약번호 ${it.ctrtNo} - ${it.ctrtCycl}`,
    title: it.ctrtNm,
    rows: [
      { label: '계약일자', value: it.ctrtYmd },
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

      {/* 목록 헤더 — 총건수 + 표시개수(10/30/50, slide10 표시 개수 영역) */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 카드 목록 */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} loading={isLoading} />
      </div>

      {/* 더보기 — 표시개수만큼 추가 로드(slide10 더보기 기능). 모두 노출됐으면 숨김. */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
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

      {/* 상세필터 풀팝업(MUI-EX-01-P08) — 공통 SearchFilter 셸에 schema 주입 */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={EX_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />

      {/* 납품통지목록 풀팝업(MUI-EX-01-P10) — 물품/용역 카드 클릭 시 */}
      <DlvgdsAvtsmtListFullPopup
        open={pickedCtrt !== null}
        onOpenChange={(popupOpen) => {
          if (!popupOpen) setPickedCtrt(null)
        }}
        ctrtNo={pickedCtrt?.ctrtNo ?? ''}
        ctrtNm={pickedCtrt?.ctrtNm ?? ''}
      />
    </div>
  )
}
InspIntgListInqPage.displayName = 'InspIntgListInqPage'
