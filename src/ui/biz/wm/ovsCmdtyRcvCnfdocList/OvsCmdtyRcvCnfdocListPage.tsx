// 물품수령확인서목록(국외) — MUI-WM-01-M71 OvsCmdtyRcvCnfdocList.
// 설계서 05.대금청구및사후 v0.85 slide89~93 (2026-08-13 국외 신규 화면 추가분).
// 구성: 검색조건(SearchCondition, 대상칩 계약번호 + 필터버튼→P72) + 목록헤더(총건수·표시개수)
//      + 카드 리스트 + 더보기 + FAB + 전자계산서목록 바텀시트(P73).
// 조회 조건: 계약번호 필수(slide93 이벤트) — 값이 없으면 조회하지 않고 안내 문구만 표시.
// 업무도움(slide89 1])은 '내역이 없으면 항목을 표시하지 않음' — 안내 내역 확정 전이라 미표시(M01 동일).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { wmQueries } from '@/queries/cts/wm/wmQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { OvsElcrtTxivList } from '@/ui/biz/wm/ovsCmdtyRcvCnfdocList/OvsElcrtTxivList'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { OvsCmdtyRcvCnfdocItem, OvsElcrtTxivItem } from '@/types/mock/wm'

/** 외화 금액 표기 — 소수 2자리 고정(설계서 000,000,000,000.00). */
const fmtAmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// ── MUI-WM-01-P72 검색필터 schema (slide90) — 키는 검색조건(dm_search, slide92 1.1) 항목명 그대로 ──
const WM_OVS_CMDTY_RCV_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        // 계약번호 — 필수(slide90 '계약번호 *'). 계약번호조회 공통시트(MUI-EX-02-P79)를 셸이 연다.
        {
          type: 'selectionField',
          key: 'ctrtNo',
          label: '계약번호',
          required: true,
          placeholder: '계약번호를 입력하세요.',
          searchSheet: 'ctrtNo',
        },
        { type: 'text', key: 'blNo', label: 'B/L번호', placeholder: 'B/L번호를 입력하세요.' },
      ],
    },
  ],
}

function buildDefaultValue(): SearchFilterValue {
  return { ctrtNo: '', blNo: '' }
}

const SEARCH_TARGETS = [{ value: 'ctrtNo', label: '계약번호' }]

export function OvsCmdtyRcvCnfdocListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업(P72)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['ctrtNo'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedCtrtNo, setAppliedCtrtNo] = useState<string | null>(null)
  // P73 전자계산서목록 바텀시트 — 선택한 물품수령확인서. null=닫힘.
  const [picked, setPicked] = useState<OvsCmdtyRcvCnfdocItem | null>(null)

  // 검색 조건 — 빠른검색(계약번호)이 있으면 우선, 없으면 상세필터 값.
  const req = useMemo(
    () => ({
      ctrtNo: appliedCtrtNo ?? String(filter.ctrtNo ?? ''),
      blNo: String(filter.blNo ?? ''),
    }),
    [appliedCtrtNo, filter],
  )
  const { data: listData, isLoading } = wmQueries.useSelectGoodsReceiveConfirmList(req)

  const sheetOpen = picked !== null

  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedCtrtNo(null)
  }
  const handleQuickSearch = () => {
    setAppliedCtrtNo(keyword.trim())
    setPage(1)
  }

  const list = listData?.list ?? []
  const total = list.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = list.slice(0, loaded)

  // 카드 매핑 — slide89: 표시레이블(INVOICE) + 계약번호+회차(4-2]) + 문서 정보 8행.
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: <Badge>{it.invcNo}</Badge>,
    subtitle: `계약번호 ${it.ctrtNo} - ${it.ctrtCycl}`,
    rows: [
      { label: 'L/C번호', value: it.lcNo },
      { label: 'B/L번호', value: it.blNo },
      { label: '계약 품목수', value: it.ctrtItemNmbt.toLocaleString() },
      { label: '계약금액', value: fmtAmt(it.ctrtAmt) },
      { label: '선적 품목수', value: it.shpgItemCnt.toLocaleString() },
      { label: '송장금액', value: fmtAmt(it.invcAmtmn) },
      { label: '수령 품목수', value: it.rcptItemQty.toLocaleString() },
      { label: '수령금액', value: fmtAmt(it.rcptAmtmn) },
    ],
    onClick: () => setPicked(it),
  }))

  // 전자계산서 카드 클릭(slide93) → 전자계산서상세(M74). 식별자는 navigate state.
  const handleTxivClick = (item: OvsElcrtTxivItem) => {
    navigate('/wm/ovsElcrtTxivDtl', { state: item })
  }

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 계약번호(필수) 빠른검색 + 상세필터(P72) */}
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
          placeholder="검색할 내용을 입력하세요."
        />
      </div>

      {/* 목록 헤더 — 총건수 + 표시개수(10/30/50) */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      {/* 카드 목록 — 계약번호가 없으면 조회하지 않고 안내(slide93 '계약번호 필수항목') */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList
          items={cardItems}
          loading={isLoading}
          emptyText={req.ctrtNo ? '데이터가 없습니다.' : '계약번호로 조회할 수 있습니다.'}
        />
      </div>

      {/* 더보기 — 표시개수만큼 추가 로드 */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() => document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* 상세필터 풀팝업(P72) — 공통 SearchFilter 셸에 schema 주입 */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={WM_OVS_CMDTY_RCV_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />

      {/* 전자계산서목록(P73) 바텀시트 — 컨테이너는 페이지 소유, 콘텐츠만 분리.
          key=선택 항목 id: 다른 건으로 재오픈 시 콘텐츠(페이징) 리마운트로 초기화. */}
      <BottomSheet
        open={sheetOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setPicked(null)
        }}
        title="전자계산서목록"
        footer={
          <Button variant="secondary" className="w-full" onClick={() => setPicked(null)}>
            닫기
          </Button>
        }
      >
        <OvsElcrtTxivList
          key={picked?.id ?? 'none'}
          ctrtNo={picked?.ctrtNo ?? ''}
          ctrtCycl={picked?.ctrtCycl ?? ''}
          open={sheetOpen}
          onItemClick={handleTxivClick}
        />
      </BottomSheet>
    </div>
  )
}
OvsCmdtyRcvCnfdocListPage.displayName = 'OvsCmdtyRcvCnfdocListPage'
