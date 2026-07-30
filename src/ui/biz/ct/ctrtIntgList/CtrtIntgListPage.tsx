// 계약 통합목록 — MUI-CT-01-M01 (Figma 10020-154484). 설계서 03.계약 v0.83 slide18~22.
// 구성: 검색조건(SearchCondition, 대상칩 계약명/계약번호 + 필터버튼→풀팝업) + 목록헤더(총건수·page size)
//      + 카드 리스트(CardList) + 더보기 + 맨위로 FAB + 검색필터(SearchFilter schema 주입, MUI-CT-01-P02).
// 데이터: useCtrtIntgList(queries/ct) — 목업/실연동은 ctService(USE_MOCK)가 전환. 목업은 mocks/ct.ts.
// 키워드 검색·더보기(페이징)는 클라이언트 로직(서버 페이징 전환 시 훅 파라미터로 이행).
// 업무도움(slide18 1])은 '내역이 없으면 항목을 표시하지 않음' — 안내 내역 확정 전이라 미표시(Figma 동일).
// 상세 화면(M03/M04/M09/M10 등 업무구분·상태 분기, slide22)은 미구현 → 카드 클릭은 console.log 스텁.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { useCtrtIntgList } from '@/queries/ct'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { CtrtIntgListItem, CtSearchFilter } from '@/types/ct'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── MUI-CT-01-P02 검색필터 schema (설계서 slide19~20 · 2026-07-14 개정 반영) ──────
// 개정: 검색유형 구분 삭제 · 검색어 일부 삭제(판단번호/담당자 — 계약건명은 AS-IS 존재하여 유지)
//      · 구분설정 일부 삭제(입찰형태) → 최종: 업무구분 / 검색설정(2) / 검색어(3) / 구분설정(2).
// 키는 설계서 검색조건 항목명(slide20 1.1) 그대로.

// 진행상태 옵션 — slide18 표시레이블(공통코드: 물품 UA22 · 공사 UB57, 확정 시 코드값 교체).
const CTRT_PRGRS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'docReq', label: '서류요청' },
  { value: 'docReg', label: '서류등록' },
  { value: 'docRjct', label: '서류반려' },
  { value: 'cnclsDmnd', label: '체결의뢰' },
]

// 계약방법 옵션 — slide18 (상위코드: CTMC, 확정 시 코드값 교체).
const CTRT_MTHD_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'general', label: '일반경쟁' },
  { value: 'nominated', label: '지명경쟁' },
  { value: 'restricted', label: '제한경쟁' },
  { value: 'multiple', label: '복수경쟁' },
  { value: 'private', label: '수의계약' },
  { value: 'negoDoc', label: '협상에의한계약(서류)' },
  { value: 'twoStageSml', label: '2단계 경쟁(동시)' },
  { value: 'twoStageSep', label: '2단계 경쟁(분리)' },
  { value: 'lowestTotal', label: '종합낙찰제' },
  { value: 'negoElec', label: '협상에의한계약(전자)' },
  { value: 'reverseAuction', label: '역경매' },
]

// 일자 프리셋 칩 — 최근 1/3/6개월. 당일 포함 과거(미래 불가, 최대 1년) 는
// DateRangeInput 공통 동작(slide19 3-1~3-3).
const DATE_PRESETS = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

const CT_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'taskSeNm',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSeNm',
          required: true, // 필수값(slide19) — default 전체
          selectAll: true, // '전체' 칩 — 개별↔전체 자동 동기화
          options: [
            { value: 'goods', label: '물품' },
            { value: 'service', label: '용역' },
            { value: 'construction', label: '공사' },
            { value: 'foreign', label: '국외' },
          ],
        },
      ],
    },
    {
      key: 'date',
      title: '검색 설정',
      fields: [
        {
          type: 'dateRange',
          key: 'dcMntDmndRcptnDt',
          label: '서류요청 수신',
          presets: DATE_PRESETS,
        },
        { type: 'dateRange', key: 'ctrtYmd', label: '계약일자', presets: DATE_PRESETS },
      ],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'ctrtNm', label: '계약건명', placeholder: '계약건명을 입력하세요.' },
        // 계약번호 — 계약번호조회 공통시트(MUI-EX-02-P79, OvsCtrtNoInq) 연동. 셸이 시트를 직접 연다.
        {
          type: 'selectionField',
          key: 'ctrtNo',
          label: '계약번호',
          placeholder: '번호를 선택하세요.',
          searchSheet: 'ctrtNo',
        },
        // 발주기관 → 발주부서(기관)검색(MUI-BD-01-P04, DeptInq) — 셸이 시트를 직접 연다.
        {
          type: 'selectionField',
          key: 'orderInstNm',
          label: '발주기관',
          placeholder: '발주기관을 입력하세요.',
          searchSheet: 'dept',
        },
      ],
    },
    {
      key: 'category',
      title: '구분 설정',
      fields: [
        {
          type: 'select',
          key: 'ctrtPrgrsStcd',
          label: '진행상태',
          placeholder: '전체',
          options: CTRT_PRGRS_OPTIONS,
        },
        {
          type: 'select',
          key: 'ctrtMthdCd',
          label: '계약방법',
          placeholder: '전체',
          options: CTRT_MTHD_OPTIONS,
        },
      ],
    },
  ],
}

const RECENT_1M = () => ({
  start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
  end: dayjs().format(DATE_FORMAT),
})

// On-Load 기본값(slide22): 서류요청 수신일자·계약일자 = 현재일-1개월 ~ 현재일, 업무구분 = 전체.
function buildDefaultValue(): CtSearchFilter {
  return {
    taskSeNm: ['goods', 'service', 'construction', 'foreign'],
    dcMntDmndRcptnDt: RECENT_1M(),
    ctrtYmd: RECENT_1M(),
    ctrtNm: '',
    ctrtNo: '',
    orderInstNm: '',
    ctrtPrgrsStcd: 'all',
    ctrtMthdCd: 'all',
  }
}

// 빠른검색 대상 칩 — slide18 목업(계약명/계약번호).
const SEARCH_TARGETS = [
  { value: 'ctrtNm', label: '계약명' },
  { value: 'ctrtNo', label: '계약번호' },
]

export function CtrtIntgListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업(MUI-CT-01-P02)
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

  // 목록 조회 — 목업/실연동은 ctService 의 USE_MOCK 분기가 전환.
  // 서버 필터/페이징 전환 시: req 에 filter/page/keyword 를 넣으면 queryKey 가 바뀌어 재조회된다.
  const { data: listData } = useCtrtIntgList()

  // ── 핸들러 — 확정값 상태만 갱신(조회는 useCtrtIntgList + 아래 클라이언트 필터가 담당) ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
    // 서버 필터 전환 시: useCtrtIntgList req 에 filter(value)를 포함시켜 재조회(현재는 표시용).
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
  const handleLoadMore = () => {
    setPage(page + 1)
  }
  // 카드 클릭 — 업무구분·상태별 상세 분기(slide22 이벤트):
  //   물품(진행) → M03(/ct/:id) · 물품(계약확정) → M04(/ct/cfmtn/:id) · 물품(계약수정) → M06(/ct/mdfcn/:id)
  //   물품(계약최종=타 계약서) → 계약서유형(ctrdocTpNm)으로 M05 일반/M07 총액/M08 단가 분기
  //   공사(진행) → M09(/ct/cstrn/:id) · 공사(확정) → M10(/ct/cstrn-doc/:id)
  //   국외(진행) → M71(/ct/ovs/:id) · 국외(계약확정) → M72(/ct/ovs/cfmtn/:id).
  const handleCardClick = (item: CtrtIntgListItem) => {
    if (item.taskSecd === '물품') {
      if (item.ctrtStatNm === '계약수정') {
        navigate(`/ct/mdfcn/${item.id}`, { state: item })
        return
      }
      if (item.ctrtStatNm === '계약최종') {
        // 타 계약서 — 계약서유형(ctrdocTpNm, 임시 키)으로 M05 일반/M07 총액/M08 단가 분기.
        const route = item.ctrdocTpNm?.includes('총액')
          ? 'gramt'
          : item.ctrdocTpNm?.includes('단가')
            ? 'untprc'
            : 'gnrl'
        navigate(`/ct/${route}/${item.id}`, { state: item })
        return
      }
      if (item.ctrtStatNm === '계약확정') {
        // 물품전자계약확정상세(MUI-CT-01-M04) — 진행상세(M03)와 화면 동일하나 스펙상 별도 화면.
        navigate(`/ct/cfmtn/${item.id}`, { state: item })
        return
      }
      navigate(`/ct/${item.id}`, { state: item })
      return
    }
    if (item.taskSecd === '공사') {
      // 계약확정 → M10 공사계약서상세 · 그 외(진행) → M09 공사전자계약진행상세(slide22).
      if (item.ctrtStatNm === '계약확정') {
        navigate(`/ct/cstrn-doc/${item.id}`, { state: item })
        return
      }
      navigate(`/ct/cstrn/${item.id}`, { state: item })
      return
    }
    if (item.taskSecd === '국외') {
      // 국외 '계약확정' → M72 국외전자계약확정상세 · 그 외 → M71 진행상세(slide146).
      if (item.ctrtStatNm === '계약확정') {
        navigate(`/ct/ovs/cfmtn/${item.id}`, { state: item })
        return
      }
      navigate(`/ct/ovs/${item.id}`, { state: item })
      return
    }
    console.log('[CtrtIntgList] 상세 이동(미구현)', item.taskSecd, item.ctrtPrgrsStcd, item.id)
  }

  // ── 키워드 필터 + 더보기 슬라이스 — 클라이언트 로직(서버 페이징 전환 시 이 블록 삭제) ──
  // 계약명 → ctrtNm 부분일치 · 계약번호 → `${ctrtNo}-${ctrtCycl}` 부분일치(대소문자 무시).
  const filteredList = useMemo(() => {
    const list = listData?.list ?? []
    if (!appliedSearch || !appliedSearch.keyword) return list
    const kw = appliedSearch.keyword.toLowerCase()
    return list.filter((it) => {
      const field =
        appliedSearch.target === 'ctrtNm' ? it.ctrtNm : `${it.ctrtNo}-${it.ctrtCycl}`
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch, listData])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 카드 매핑 — Figma m_card: 뱃지(업무구분/계약방법/계약상태/진행상태/첨언/첨부) +
  // subtitle(판단번호 / 계약번호-차수) + title(계약건명) + 행(계약일자/발주기관/계약금액/전자서명).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSecd}</Badge>
        <Badge>{it.ctrtMthdCd}</Badge>
        {it.ctrtStatNm && <Badge>{it.ctrtStatNm}</Badge>}
        <Badge>{it.ctrtPrgrsStcd}</Badge>
        {it.addCn && <Badge>첨언</Badge>}
        {it.docId && <Badge>첨부</Badge>}
      </>
    ),
    subtitle: `판단번호 ${it.prcmNo} / 계약번호 ${it.ctrtNo} - ${it.ctrtCycl}`,
    title: it.ctrtNm,
    rows: [
      { label: '계약일자', value: it.ctrtYmd },
      { label: '발주기관', value: it.orderInstNm },
      { label: '계약금액', value: `${it.ctrtAmt.toLocaleString()} 원` },
      // 전자서명 — 260617 개정 항목추가(elsgnVl). 값 있는 건만 표시.
      ...(it.elsgnVl ? [{ label: '전자서명', value: it.elsgnVl }] : []),
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

      {/* 목록 헤더 — 총건수 + 표시개수(10/30/50, slide18 3]) */}
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

      {/* 더보기 — 표시개수만큼 추가 로드(slide18 더보기 기능). 모두 노출됐으면 숨김. */}
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

      {/* 상세필터 풀팝업(MUI-CT-01-P02) — 공통 SearchFilter 셸에 schema 주입 */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={CT_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
