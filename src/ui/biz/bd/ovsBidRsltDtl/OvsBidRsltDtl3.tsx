// 국외 입찰결과조회 - '입찰결과(총액제)' 탭 (MUI-BD-09-T73(구 M73 — v1.83 재편), 설계서 02입찰 slide405).
// 입찰 결과 목록(총액제) — 업체별 결과. 단가제 탭과 동일 목록 패턴(타이틀+결과필터+헤더+카드+더보기).
// ⚠️ 설계서 slide405 에 입찰결과현황(총액제) 데이터영역 없음 → 목록만(설계서 우선).
import { memo, useMemo, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { cn } from '@/utils/cn'
import type { OvsBidRsltTotalItem } from '@/types/bd'

// 입찰결과 필터(결과 전체 SelectBox) — 기본 '결과 전체'(all). value 는 item.bidRsltNm 과 일치.
const RESULT_OPTIONS = [
  { value: 'all', label: '결과 전체' },
  { value: '낙찰', label: '낙찰' },
  { value: '조건부 낙찰', label: '조건부 낙찰' },
  { value: '동가 낙찰', label: '동가 낙찰' },
  { value: '유찰', label: '유찰' },
]
const RESULT_VALUES = ['낙찰', '조건부 낙찰', '동가 낙찰', '유찰']

// 입찰결과 목록(총액제) 목업 — 설계서 slide405 항목. 추후 bdService.getOvsBidRslt 매핑.
// bidRsltNm 은 결과 필터 데모용으로 4종 순환.
const ITEM_BASE: Omit<OvsBidRsltTotalItem, 'seq' | 'bidRsltNm'> = {
  bidBzentyNm: 'A 국외업체',
  bizRegNo: '123-45-67890',
  drctnAmt: '5,000,000 원',
  bidAmt: '1,000,000 원',
  usdAmt: '10,000.00 USD',
}
const TOTAL = 258
const MOCK_ITEMS: OvsBidRsltTotalItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...ITEM_BASE,
  seq: String(i + 1),
  bidRsltNm: RESULT_VALUES[i % RESULT_VALUES.length],
}))

// 기본 노출 행수 (나머지는 '내역 펼쳐보기'로 토글) — 접힘 시 입찰업체/사업자번호 2행(slide405).
const DEFAULT_VISIBLE = 2

const itemRows = (it: OvsBidRsltTotalItem): TableRow[] => [
  { label: '입찰업체', value: it.bidBzentyNm },
  { label: '사업자번호', value: it.bizRegNo },
  { label: '지시금액', value: it.drctnAmt, type: 'number' },
  { label: '입찰금액', value: it.bidAmt, type: 'number' },
  { label: '달러금액', value: it.usdAmt, type: 'number' },
  { label: '입찰결과', value: it.bidRsltNm },
]

// 항목 1건 카드 — 기본 2행 + 펼쳐보기/접기 (품목명세서 탭과 동일).
const BidRsltItemCard = memo(function BidRsltItemCard({ item }: { item: OvsBidRsltTotalItem }) {
  const [expanded, setExpanded] = useState(false)
  const allRows = useMemo(() => itemRows(item), [item])
  const rows = expanded ? allRows : allRows.slice(0, DEFAULT_VISIBLE)

  return (
    <div className="px-4">
      <Table rows={rows} />
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-center gap-krds-3 py-krds-6 text-[17px] font-medium text-krds-text-ink"
      >
        {expanded ? '내역 접기' : '내역 펼쳐보기'}
        <Icon
          name="ExpandMore"
          size={20}
          aria-hidden
          className={cn('transition-transform duration-200', expanded && 'rotate-180')}
        />
      </button>
    </div>
  )
})

// bidTypeNm(총액제) = 상단 배지값 — 목록 타이틀 '(총액제)'에 반영.
export function OvsBidRsltDtl3({ bidTypeNm }: { bidTypeNm: string }) {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [resultFilter, setResultFilter] = useState('all') // 결과 전체 SelectBox

  const filtered = useMemo(
    () => (resultFilter === 'all' ? MOCK_ITEMS : MOCK_ITEMS.filter((it) => it.bidRsltNm === resultFilter)),
    [resultFilter],
  )
  const total = filtered.length
  const loaded = Math.min(page * pageSize, total)
  const visible = filtered.slice(0, loaded)

  return (
    <div className="flex flex-col gap-krds-7 pb-6">
      {/* 입찰 결과 목록(총액제) — 타이틀(InputLabel) + 결과 필터(결과 전체 SelectBox) */}
      <div className="flex items-center justify-between gap-krds-5 px-4">
        <InputLabel>입찰 결과 목록 ({bidTypeNm})</InputLabel>
        {/* 선택값 내용에 맞춰 최소 폭(w-max) — 잘림 없이 가장 좁게 */}
        <div className="w-max shrink-0">
          <SelectBox
            items={RESULT_OPTIONS}
            value={resultFilter}
            onValueChange={(v) => {
              setResultFilter(v)
              setPage(1)
            }}
            aria-label="입찰결과 필터"
          />
        </div>
      </div>

      {/* 헤더(총건수·표시개수) — 필터 적용된 총건수 반영 */}
      <div className="px-4">
        <ListSectionHeader
          total={total}
          pageSize={pageSize}
          pageSizeOptions={[10, 30, 50]}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
            console.log('[OvsBidRslt] 표시개수 →', size)
          }}
        />
      </div>
      <div className="flex flex-col gap-krds-8">
        {visible.map((item) => (
          <BidRsltItemCard key={item.seq} item={item} />
        ))}
      </div>

      {/* 더보기 */}
      {loaded < total && (
        <div className="px-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              const next = page + 1
              setPage(next)
              console.log('[OvsBidRslt] 더보기 → page', next) // 추후 API: bdService.getOvsBidRslt(next)
            }}
          >
            더보기 ({loaded}/{total})
          </Button>
        </div>
      )}
    </div>
  )
}
OvsBidRsltDtl3.displayName = 'OvsBidRsltDtl3'
