// 국외 입찰결과조회 - '입찰결과(단가제)' 탭 (MUI-BD-09-T72(구 M72 — v1.83 재편), 설계서 02입찰 slide404).
// 입찰결과현황(단가제) + 입찰결과 목록(단가제). 목록은 조달계획 상세 품목명세서 탭과 동일 패턴:
//   ListSectionHeader(총건수·표시개수) + 항목 카드(기본 4행 + '내역 펼쳐보기/접기') + 더보기.
// ⚠️ 결과품목/화폐금액/달러금액 등 카테고리는 테이블 행이 아니라 InputLabel(섹션 라벨)로 표시(사용자 지시).
import { memo, useMemo, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { cn } from '@/utils/cn'
import type { OvsBidRsltUnitPriceItem, OvsBidRsltUnitPriceStatus } from '@/types/bd'

// 입찰결과 필터(결과 전체 SelectBox) — 기본 '결과 전체'(all). value 는 item.bidRsltNm 과 일치.
const RESULT_OPTIONS = [
  { value: 'all', label: '결과 전체' },
  { value: '낙찰', label: '낙찰' },
  { value: '조건부 낙찰', label: '조건부 낙찰' },
  { value: '동가 낙찰', label: '동가 낙찰' },
  { value: '유찰', label: '유찰' },
]
const RESULT_VALUES = ['낙찰', '조건부 낙찰', '동가 낙찰', '유찰']

// 입찰결과현황(단가제) 목업 — 설계서 slide404 값 형식(원/USD) 그대로.
const MOCK_STATUS: OvsBidRsltUnitPriceStatus = {
  totItemCnt: '5',
  totScsbdCnt: '3',
  cnt: { scsbd: '2', cndl: '1', eqv: '1', sub: '4' },
  krw: { scsbd: '000,000,000 원', cndl: '000,000,000 원', eqv: '0 원', sub: '000,000,000 원' },
  usd: { scsbd: '000,000,000.00 USD', cndl: '000,000,000.00 USD', eqv: '0.00 USD', sub: '000,000,000.00 USD' },
}

// 입찰결과 목록(단가제) 목업 — 설계서 slide404 항목. 추후 bdService.selectBidCnListByItem 매핑.
// bidRsltNm 은 결과 필터 데모용으로 4종(낙찰/조건부 낙찰/동가 낙찰/유찰) 순환.
const ITEM_BASE: Omit<OvsBidRsltUnitPriceItem, 'clsfNo' | 'bidRsltNm'> = {
  prdctNm: '500MD',
  stckNo: '000 000 0000',
  partNo: '0000',
  unit: 'EA',
  qty: '5',
  drctnUprc: '5,000,000 원',
  bidUprc: '1,000,000 원',
  usdUprc: '10,000.00 USD',
  usdAmt: '1,000.00 USD',
}
const TOTAL = 258
const MOCK_ITEMS: OvsBidRsltUnitPriceItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...ITEM_BASE,
  clsfNo: String(i + 1),
  bidRsltNm: RESULT_VALUES[i % RESULT_VALUES.length],
}))

// 기본 노출 행수 (나머지는 '내역 펼쳐보기'로 토글) — 접힘 시 항목번호/품명/재고번호/부품번호 4행(slide404).
const DEFAULT_VISIBLE = 4

// 구분(낙찰/조건부/동가낙찰/소계) 4행 — 결과품목/화폐금액/달러금액 각 InputLabel 아래 표.
const breakdownRows = (b: { scsbd: string; cndl: string; eqv: string; sub: string }): TableRow[] => [
  { label: '낙찰', value: b.scsbd, type: 'number' },
  { label: '조건부', value: b.cndl, type: 'number' },
  { label: '동가낙찰', value: b.eqv, type: 'number' },
  { label: '소계', value: b.sub, type: 'number' },
]

// 입찰결과 목록 항목 표 (기본 4행 + 펼쳐보기 시 전체)
const itemRows = (it: OvsBidRsltUnitPriceItem): TableRow[] => [
  { label: '항목번호', value: it.clsfNo },
  { label: '품명', value: it.prdctNm },
  { label: '재고번호', value: it.stckNo },
  { label: '부품번호', value: it.partNo },
  { label: '단위', value: it.unit },
  { label: '수량', value: it.qty, type: 'number' },
  { label: '지시단가', value: it.drctnUprc, type: 'number' },
  { label: '입찰단가', value: it.bidUprc, type: 'number' },
  { label: '달러단가', value: it.usdUprc, type: 'number' },
  { label: '달러금액', value: it.usdAmt, type: 'number' },
  { label: '입찰결과', value: it.bidRsltNm },
]

// 항목 1건 카드 — 기본 4행 + 펼쳐보기/접기 (품목명세서 탭과 동일).
const BidRsltItemCard = memo(function BidRsltItemCard({ item }: { item: OvsBidRsltUnitPriceItem }) {
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

// bidTypeNm(단가제/총액제) = 상단 배지값 — 현황·목록 타이틀의 '(단가제/총액제)'에 반영.
export function OvsBidRsltDtl2({ bidTypeNm }: { bidTypeNm: string }) {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [resultFilter, setResultFilter] = useState('all') // 결과 전체 SelectBox
  const s = MOCK_STATUS

  // 결과 필터 적용 — '결과 전체'(all)면 전체, 아니면 입찰결과(bidRsltNm) 일치만.
  const filtered = useMemo(
    () => (resultFilter === 'all' ? MOCK_ITEMS : MOCK_ITEMS.filter((it) => it.bidRsltNm === resultFilter)),
    [resultFilter],
  )
  const total = filtered.length
  const loaded = Math.min(page * pageSize, total)
  const visible = filtered.slice(0, loaded)

  return (
    <div className="flex flex-col gap-krds-7 pb-6">
      {/* 입찰결과현황(단가제) — 총계 표 + 결과품목/화폐금액/달러금액(InputLabel + 구분 표) */}
      <Accordion type="multiple" defaultValue={['status']} className="w-full">
        <AccordionSection value="status" title={`입찰 결과 현황 (${bidTypeNm})`} borderTop={false}>
          <Table
            rows={[
              { label: '총 참여품목수', value: s.totItemCnt, type: 'number' },
              { label: '총 낙찰', value: s.totScsbdCnt, type: 'number' },
            ]}
          />
          <div className="flex flex-col gap-krds-5">
            <InputLabel>결과품목</InputLabel>
            <Table rows={breakdownRows(s.cnt)} />
          </div>
          <div className="flex flex-col gap-krds-5">
            <InputLabel>화폐금액</InputLabel>
            <Table rows={breakdownRows(s.krw)} />
          </div>
          <div className="flex flex-col gap-krds-5">
            <InputLabel>달러금액</InputLabel>
            <Table rows={breakdownRows(s.usd)} />
          </div>
        </AccordionSection>
      </Accordion>

      {/* 입찰 결과 목록(단가제) — 타이틀(InputLabel) + 결과 필터(결과 전체 SelectBox) */}
      <div className="flex items-center justify-between gap-krds-5 px-4">
        <InputLabel>입찰 결과 목록 ({bidTypeNm})</InputLabel>
        {/* 선택값 내용에 맞춰 최소 폭(w-max) — 잘림 없이 가장 좁게 */}
        <div className="w-max shrink-0">
          <SelectBox
            items={RESULT_OPTIONS}
            value={resultFilter}
            onValueChange={(v) => {
              setResultFilter(v)
              setPage(1) // 필터 변경 시 첫 페이지로
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
          <BidRsltItemCard key={item.clsfNo} item={item} />
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
              console.log('[OvsBidRslt] 더보기 → page', next) // 추후 API: bdService.selectBidCnListByItem(next)
            }}
          >
            더보기 ({loaded}/{total})
          </Button>
        </div>
      )}
    </div>
  )
}
OvsBidRsltDtl2.displayName = 'OvsBidRsltDtl2'
