// 세금계산서계약목록 — MUI-TS-04-M01 TxivList_CtrtList. 설계서 06.업무지원 v0.82 slide22, 24~25.
// 구성: 검색조건(SearchCondition, 계약번호) + 진행현황 이동 버튼 + 목록헤더 + 카드 + 더보기 + FAB
//      + 검색필터(SearchFilter schema, MUI-TS-04-P05 — 계약연도(기본 현재연도)·계약번호)
//      + 세금계산서목록(MUI-TS-04-P02) 바텀시트(컨테이너는 페이지 소유, 콘텐츠 TxivList).
// 계약 카드 클릭 → P02 시트 · 세금계산서 카드 클릭 → 상세(M03).
// 공지사항(업무도움)은 내역 확정 전 미표시.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { useTxivCtrtList } from '@/queries/ts'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { TxivList } from '@/ui/biz/ts/txivList_CtrtList/TxivList'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { TxivCtrtItem, TxivItem } from '@/types/ts'

// ── MUI-TS-04-P05 검색필터 schema (slide24~25) — 계약연도(현재 연도 기본) + 계약번호 ──
const THIS_YEAR = dayjs().year()
const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => {
  const y = String(THIS_YEAR - i)
  return { value: y, label: y }
})

const TS_TXIV_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'year',
      title: '계약연도 설정',
      fields: [
        { type: 'select', key: 'ctrtYmd', label: '연도 설정', options: YEAR_OPTIONS },
      ],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        {
          type: 'text',
          key: 'ctrtNo',
          label: '계약번호',
          placeholder: '계약번호를 입력하세요.',
        },
      ],
    },
  ],
}

// 기본값(slide24): 계약연도 = 현재 연도.
function buildDefaultValue(): SearchFilterValue {
  return { ctrtYmd: String(THIS_YEAR), ctrtNo: '' }
}

const SEARCH_TARGETS = [{ value: 'ctrtNo', label: '계약번호' }]

export function TxivList_CtrtListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업(MUI-TS-04-P05)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['ctrtNo'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedSearch, setAppliedSearch] = useState<string | null>(null)
  // P02 세금계산서목록 바텀시트 — 선택한 계약(null=닫힘). key 리마운트로 재오픈 시 초기화.
  const [pickedCtrt, setPickedCtrt] = useState<TxivCtrtItem | null>(null)

  const { data: listData, isLoading } = useTxivCtrtList()

  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
  }
  const handleQuickSearch = () => {
    setAppliedSearch(keyword.trim())
    setPage(1)
  }
  // 세금계산서 카드 클릭(P02) — 상세(M03) 이동.
  const handleTxivClick = (item: TxivItem) => {
    navigate(`/ts/txiv/dtl/${item.id}`, { state: item })
  }

  const filteredList = useMemo(() => {
    const list = listData?.list ?? []
    if (!appliedSearch) return list
    const kw = appliedSearch.toLowerCase()
    return list.filter((it) => it.ctrtNo.toLowerCase().includes(kw))
  }, [appliedSearch, listData])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 카드 매핑 — slide22 목업: 뱃지(계약종류 bidxMtnm) + subtitle(계약번호) + title(계약건명) +
  // 행(업체코드(명)/계약담당).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: <Badge>{it.bidxMtnm}</Badge>,
    subtitle: `계약번호 ${it.ctrtNo}`,
    title: it.rpstItnm,
    rows: [
      { label: '업체코드(명)', value: `${it.bzentyCd} (${it.bzentyNm})` },
      { label: '계약담당', value: it.userNm },
    ],
    onClick: () => setPickedCtrt(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 계약번호 + 진행현황 이동(M04) */}
      <div className="flex flex-col gap-krds-5 px-4 py-4">
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
        <Button
          variant="secondary"
          size="sm"
          className="self-end"
          onClick={() => navigate('/ts/txiv/prgrs')}
        >
          진행현황
        </Button>
      </div>

      {/* 목록 헤더 — 총건수 + 표시개수 */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      {/* 계약 카드 목록 */}
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

      {/* 상세필터 풀팝업(MUI-TS-04-P05) */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={TS_TXIV_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />

      {/* 세금계산서목록(MUI-TS-04-P02) 바텀시트 — 컨테이너는 페이지 소유, 콘텐츠만 분리.
          key=계약번호: 다른 계약으로 재오픈 시 콘텐츠(페이징) 리마운트로 초기화. */}
      <BottomSheet
        open={pickedCtrt !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setPickedCtrt(null)
        }}
        title="세금계산서 목록"
        footer={
          <Button variant="secondary" className="w-full" onClick={() => setPickedCtrt(null)}>
            닫기
          </Button>
        }
      >
        <TxivList
          key={pickedCtrt?.id ?? 'none'}
          ctrtNo={pickedCtrt?.ctrtNo ?? ''}
          rpstItnm={pickedCtrt?.rpstItnm ?? ''}
          open={pickedCtrt !== null}
          onItemClick={handleTxivClick}
        />
      </BottomSheet>
    </div>
  )
}
TxivList_CtrtListPage.displayName = 'TxivList_CtrtListPage'
