// 대금지급현황(국외) — MUI-WM-01-M77 OvsPymtPrgrsList.
// 설계서 05.대금청구및사후 v0.85 slide103~105 (2026-08-13 국외 신규 화면 추가분).
// 구성: 검색조건(SearchCondition, 대상칩 계약번호 + 필터버튼) + 목록헤더 + 카드 리스트
//      + 더보기 + FAB + 선적품목내역 바텀시트(P78).
// 조회 조건: 계약번호 필수(dm_statSearch) — 없으면 목록 미표시 + 안내 문구(slide103 2-2]).
// 검색필터는 전용 P화면이 없어 계약번호 단일 필드 schema 로 구성(계약번호조회 P79 시트 진입 경로).
// 업무도움(slide103 1])은 '내역이 없으면 항목을 표시하지 않음' — 안내 내역 확정 전이라 미표시.
import { useState } from 'react'

import { wmQueries } from '@/queries/cts/wm/wmQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { OvsShpgItemDsctn } from '@/ui/biz/wm/ovsPymtPrgrsList/OvsShpgItemDsctn'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { OvsPymtPrgrsItem } from '@/types/wm'

/** 외화 금액 표기 — 소수 2자리 + 화폐단위(cmcUnit) 후행(slide103 3-2]). */
const fmtAmt = (n: number, unit: string) =>
  `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`

// ── 검색필터 schema — 검색조건(dm_statSearch, slide105 1.1): 계약번호 단일(필수, P79 공통시트) ──
const WM_OVS_PRGRS_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'keyword',
      title: '검색어',
      fields: [
        {
          type: 'selectionField',
          key: 'ctrtNo',
          label: '계약번호',
          required: true,
          placeholder: '계약번호를 입력하세요.',
          searchSheet: 'ctrtNo',
        },
      ],
    },
  ],
}

function buildDefaultValue(): SearchFilterValue {
  return { ctrtNo: '' }
}

const SEARCH_TARGETS = [{ value: 'ctrtNo', label: '계약번호' }]

export function OvsPymtPrgrsListPage() {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['ctrtNo'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedCtrtNo, setAppliedCtrtNo] = useState<string | null>(null)
  // P78 선적품목내역 바텀시트 — 선택한 지급현황 건. null=닫힘.
  const [picked, setPicked] = useState<OvsPymtPrgrsItem | null>(null)

  const ctrtNo = appliedCtrtNo ?? String(filter.ctrtNo ?? '')
  const { data: listData, isLoading } = wmQueries.useSelectPaymentStatusList({ ctrtNo })

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

  // 카드 매핑 — slide103: 표시레이블(INVOICE/지출상태/진행상태) + 문서 정보(B/L번호·계약번호) +
  // 행(L/C·지불의뢰금액·지체상금·실지급액·심사일자·이체일자·지불일자).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.invcNo}</Badge>
        <Badge>{it.expndStts}</Badge>
        <Badge>{it.prgrsSttn}</Badge>
      </>
    ),
    subtitle: `B/L번호 ${it.blNo}`,
    title: `계약번호 ${it.ctrtNo}`,
    rows: [
      { label: 'L/C', value: it.lcNo },
      { label: '지불의뢰금액', value: fmtAmt(it.dfryAmt, it.cmcUnit) },
      { label: '지체상금', value: fmtAmt(it.arrsPrmny, it.cmcUnit) },
      { label: '실지급액', value: fmtAmt(it.giveAmt, it.cmcUnit) },
      { label: '심사일자', value: it.srngYmd },
      { label: '이체일자', value: it.payYmd || '-' },
      { label: '지불일자', value: it.dfryYmd || '-' },
    ],
    // 선적품목내역(P78) — 클릭한 건의 B/L번호·계약번호로 조회(slide104).
    onClick: () => setPicked(it),
  }))

  return (
    <div className="flex w-full flex-col">
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

      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      {/* 카드 목록 — 계약번호가 없으면 조회하지 않고 안내(slide103 2-2]) */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList
          items={cardItems}
          loading={isLoading}
          emptyText={ctrtNo ? '데이터가 없습니다.' : '계약번호로 조회할 수 있습니다.'}
        />
      </div>

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

      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={WM_OVS_PRGRS_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />

      {/* 선적품목내역(P78) 바텀시트 — 컨테이너는 페이지 소유, 콘텐츠만 분리.
          key=선택 건 id: 다른 건으로 재오픈 시 콘텐츠(페이징) 리마운트로 초기화. */}
      <BottomSheet
        open={sheetOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setPicked(null)
        }}
        title="선적품목내역"
        footer={
          <Button variant="secondary" className="w-full" onClick={() => setPicked(null)}>
            닫기
          </Button>
        }
      >
        <OvsShpgItemDsctn
          key={picked?.id ?? 'none'}
          blNo={picked?.blNo ?? ''}
          ctrtNo={picked?.ctrtNo ?? ''}
          invcNo={picked?.invcNo ?? ''}
          open={sheetOpen}
        />
      </BottomSheet>
    </div>
  )
}
OvsPymtPrgrsListPage.displayName = 'OvsPymtPrgrsListPage'
