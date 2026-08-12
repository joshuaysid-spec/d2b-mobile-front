// 검사및납품조서현황목록 — MUI-EX-01-M05 InspDlvdocPrst. 설계서 04.이행 v0.83 slide30~33.
// 구성: 검색조건(SearchCondition) + 목록헤더(총건수·page size) + 카드 리스트 + 더보기 + FAB
//      + 검색필터(SearchFilter schema 주입, MUI-EX-01-P09 — 조서발행번호는 P06 공통시트).
// 데이터: useInspDlvdocPrstList(queries/ex) — 목업/실연동은 exService(USE_MOCK)가 전환.
// 카드 클릭(slide33 이벤트) 분기 — 조건 항목 미정의라 데이터 필드로 분기(⚠️ 임시, 상세설계 확정 시 대조):
//   공사(taskSeNm) → M04 기성및준공검사상세 · 부대조달(sbsdPrcmYn) → M03 상세 · 그 외 → M07 결과상세.
// 업무도움(slide30 1])은 '내역이 없으면 항목을 표시하지 않음' — 안내 내역 확정 전이라 미표시(M01 동일).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { useInspDlvdocPrstList } from '@/queries/ex'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { InspDlvdocPrstItem } from '@/types/ex'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── MUI-EX-01-P09 검색필터 schema (slide32~33) — 키는 검색조건·데이터영역 항목명 그대로 ──

// 일자 프리셋 칩 — 최근 1/3/6개월(slide32 4-3).
const DATE_PRESETS = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

// 진행상태 옵션 — slide33 납품조서진행상태코드(GTSA0003) 코드표.
const DLVDOC_PRGRS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'N', label: '저장' },
  { value: 'E', label: '검사의뢰완료' },
  { value: 'IX', label: '검사반려' },
  { value: 'IN', label: '검사저장' },
  { value: 'I', label: '검사완료' },
  { value: 'A', label: '출납완료' },
  { value: 'R', label: '조달접수' },
  { value: 'X', label: '조달반려' },
  { value: 'EX', label: '납품조서반려' },
  { value: 'EN', label: '청구저장' },
  { value: 'EY', label: '대금청구' },
]

const EX_PRST_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'taskSeNm',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSeNm',
          required: true, // 필수값 — default 전체(slide32)
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
    {
      key: 'date',
      title: '검색 설정',
      fields: [
        { type: 'dateRange', key: 'ctrtYmd', label: '계약일자', presets: DATE_PRESETS },
        { type: 'dateRange', key: 'passYmd', label: '합격일자', presets: DATE_PRESETS },
      ],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'ctrtNm', label: '계약명', placeholder: '계약건명을 입력하세요.' },
        // 계약번호 — 계약번호조회 공통시트(MUI-EX-02-P79, OvsCtrtNoInq).
        {
          type: 'selectionField',
          key: 'ctrtNo',
          label: '계약번호',
          placeholder: '번호를 입력하세요.',
          searchSheet: 'ctrtNo',
        },
        // 조서발행번호 — 조서발행번호정보조회 공통시트(MUI-EX-01-P06, RecrdPblcnNoInfoInq).
        {
          type: 'selectionField',
          key: 'recrdPblcnNo',
          label: '조서발행번호',
          placeholder: '조서발행번호를 선택하세요.',
          searchSheet: 'recrdPblcnNo',
        },
        // 신청번호 — ⚠️ 검색조건 항목명 미정의(slide32 목업 표시항목), 임시 키(aplyNo).
        { type: 'text', key: 'aplyNo', label: '신청번호', placeholder: '번호를 입력하세요.' },
        { type: 'text', key: 'avtsmtNo', label: '통지번호', placeholder: '번호를 입력하세요.' },
        { type: 'text', key: 'plcdlvNm', label: '납지', placeholder: '납지를 입력하세요.' },
      ],
    },
    {
      key: 'category',
      title: '구분 설정',
      fields: [
        // 예산구분(필수값, default 전체예산 — slide32) — ⚠️ 검색조건(dml) 항목명 미정의,
        // 대금신청대상(bgtSecd, 상위코드 KB) 항목명 재사용. 코드값 확정 시 교체.
        {
          type: 'select',
          key: 'bgtSecd',
          label: '예산구분',
          placeholder: '전체 예산',
          options: [
            { value: 'all', label: '전체 예산' },
            { value: 'prevGovbnd', label: '전년국채' },
            { value: 'main', label: '본조' },
            { value: 'currGovbnd', label: '당년국채' },
          ],
        },
        {
          type: 'select',
          key: 'dlvdocPrgrsStcd',
          label: '진행상태',
          placeholder: '전체',
          options: DLVDOC_PRGRS_OPTIONS,
        },
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
      ],
    },
  ],
}

// On-Load 기본값(slide33): 검사기간 = 현재일-1개월 ~ 현재일, 업무구분 = 전체.
function buildDefaultValue(): SearchFilterValue {
  const recent1m = {
    start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
    end: dayjs().format(DATE_FORMAT),
  }
  return {
    taskSeNm: ['0', 'goods', 'service', 'construction', 'foreign'], // 전체('0' = 전체 코드값)
    ctrtYmd: recent1m,
    passYmd: recent1m,
    ctrtNm: '',
    ctrtNo: '',
    recrdPblcnNo: '',
    aplyNo: '',
    avtsmtNo: '',
    plcdlvNm: '',
    bgtSecd: 'all',
    dlvdocPrgrsStcd: 'all',
    pxcndCmcnSecd: 'all',
  }
}

// 빠른검색 대상 칩 — slide30 목업(계약명/계약번호).
const SEARCH_TARGETS = [
  { value: 'ctrtNm', label: '계약명' },
  { value: 'ctrtNo', label: '계약번호' },
]

export function InspDlvdocPrstPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업(MUI-EX-01-P09)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['ctrtNm'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  const { data: listData, isLoading } = useInspDlvdocPrstList()

  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
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
  // 카드 클릭(slide33 계약번호 클릭 이벤트) — M07 결과상세 / M03 부대조달 상세 / M04 기성및준공.
  const handleCardClick = (item: InspDlvdocPrstItem) => {
    // 식별자는 URL 이 아니라 state 로만 전달(상세가 item.id 로 조회).
    if (item.taskSeNm === '공사') {
      navigate('/ex/pxcndCmcnInspDtl', { state: item })
      return
    }
    if (item.sbsdPrcmYn === 'Y') {
      navigate('/ex/inspDlvdocDtlSbsdPrcm', { state: item })
      return
    }
    navigate('/ex/dlvdocRsltDtl', { state: item })
  }

  // ── 키워드 필터 + 더보기 슬라이스 — 클라이언트 로직(서버 페이징 전환 시 삭제) ──
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

  // 카드 매핑 — slide30 목업: 뱃지(업무구분/예산구분/진행상태) + subtitle(계약번호+차수) +
  // title(계약명) + 행(계약일자/계약금액/합격일자/납품일자 — 값 없으면 '-').
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSeNm}</Badge>
        <Badge>{it.bgtSecdNm}</Badge>
        <Badge>{it.dlvdocPrgrsStcd}</Badge>
      </>
    ),
    subtitle: `계약번호 ${it.ctrtNo} - ${it.ctrtCycl}`,
    title: it.ctrtNm,
    rows: [
      { label: '계약일자', value: it.ctrtYmd },
      { label: '계약금액', value: `${it.ctrtAmt.toLocaleString()} 원` },
      { label: '합격일자', value: it.passYmd ?? '-' },
      { label: '납품일자', value: it.dlvgdsYmd ?? '-' },
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

      {/* 목록 헤더 — 총건수 + 표시개수 */}
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

      {/* 더보기 */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 상세필터 풀팝업(MUI-EX-01-P09) — 공통 SearchFilter 셸에 schema 주입 */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={EX_PRST_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
InspDlvdocPrstPage.displayName = 'InspDlvdocPrstPage'
