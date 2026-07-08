// 공개수의협상 견적서 작성 - 스탭3 입찰품목(입찰참여품목 단가제) (MUI-BD-12-M76/T76, 설계서 slide422).
// 품목 카드(기본 4행 + 내역 펼쳐보기) — 조회 항목 + 입력(품목대체구분 Y/N SelectBox·견적단가, 대체 시 수정재고/부품번호·대체첨부문서).
// 항목명 = 설계서 데이터영역 영문(dl_bidItemList).
import { memo, useMemo, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { cn } from '@/utils/cn'
import type { OvsRlsVltrnsEtdcItem } from '@/types/bd'

// 품목대체구분 Y/N SelectBox (사용자 요청).
const ALT_OPTIONS = [
  { value: 'N', label: 'N' },
  { value: 'Y', label: 'Y' },
]

// 화폐단위 SelectBox 옵션 (사용자 요청). 코드값은 추후 공통코드 매핑.
const CRNCY_OPTIONS = [
  { value: '미 달러', label: '미 달러' },
  { value: '유로화', label: '유로화' },
  { value: '엔화', label: '엔화' },
  { value: '원화', label: '원화' },
]

// 입찰참여품목 목업 — 설계서 slide422 값 그대로. 추후 bdService.getOvsRlsVltrnsEtdcItems 매핑.
const ITEM_BASE: Omit<
  OvsRlsVltrnsEtdcItem,
  'frcptlArtclNo' | 'itemSbstSe' | 'mdfcnInvtNo' | 'mdfcnPrtsNo' | 'estmtUntprc'
> = {
  invtNo: '1015375183975',
  prtsNo: '000-A0000 0000',
  itemNm: 'T-80U/TBE-3',
  unitNm: 'EA',
  qty: '1',
  drctnUntprc: '608,000.00',
  crncNm: '미 달러',
}
const TOTAL = 100
const MOCK_ITEMS: OvsRlsVltrnsEtdcItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...ITEM_BASE,
  frcptlArtclNo: String(i + 1),
  itemSbstSe: 'N',
  mdfcnInvtNo: '',
  mdfcnPrtsNo: '',
  estmtUntprc: '',
}))

// 접힘 시 노출 행수 — 항목번호/재고번호/부품번호/품명 4행(slide422).
const DEFAULT_VISIBLE = 4

interface ItemState {
  itemSbstSe: 'Y' | 'N'
  mdfcnInvtNo: string
  mdfcnPrtsNo: string
  estmtUntprc: string
  crncNm: string
}

const ItemCard = memo(function ItemCard({ item }: { item: OvsRlsVltrnsEtdcItem }) {
  const [expanded, setExpanded] = useState(false)
  const [s, setS] = useState<ItemState>({
    itemSbstSe: 'N',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    estmtUntprc: '',
    crncNm: item.crncNm,
  })
  const set = (patch: Partial<ItemState>) => setS((p) => ({ ...p, ...patch }))

  const rows = useMemo<TableRow[]>(() => {
    return [
      { label: '항목번호', value: item.frcptlArtclNo },
      { label: '재고번호', value: item.invtNo },
      { label: '부품번호', value: item.prtsNo },
      { label: '품명', value: item.itemNm },
      { label: '단위', value: item.unitNm },
      { label: '수량', value: item.qty, type: 'number' },
      { label: '지시단가', value: item.drctnUntprc, type: 'number' },
      // ── 입력 ──
      {
        label: '품목대체구분',
        type: 'combination',
        // SelectBox 셀 전체 폭 — Table combination 셀의 [&_button]:w-fit 를 !w-full 로 덮음.
        value: (
          <div className="w-full [&_button]:!w-full">
            <SelectBox
              items={ALT_OPTIONS}
              value={s.itemSbstSe}
              onValueChange={(v) => set({ itemSbstSe: v as 'Y' | 'N' })}
              aria-label="품목대체구분"
            />
          </div>
        ),
      },
      // 품목대체첨부문서 — 빈칸(추후 첨부 UI 연결).
      { label: '품목대체첨부문서', value: '' },
      {
        // 수정재고번호 — 항상 활성, 숫자만 입력(inputType=numeric). (onClear 제거로 입력폭 100%)
        label: '수정재고번호',
        type: 'combination',
        value: (
          <InputBox
            inputType="numeric"
            value={s.mdfcnInvtNo}
            placeholder="입력해주세요."
            onChange={(e) => set({ mdfcnInvtNo: e.target.value })}
          />
        ),
      },
      {
        label: '수정부품번호',
        type: 'combination',
        value: (
          <InputBox
            inputType="numeric"
            value={s.mdfcnPrtsNo}
            placeholder="입력해주세요."
            onChange={(e) => set({ mdfcnPrtsNo: e.target.value })}
          />
        ),
      },
      {
        // 견적단가 — 입력 폭 100%(onClear 없음 → X 버튼 없음).
        label: '견적단가',
        type: 'combination',
        value: (
          <InputBox
            inputType="numeric"
            value={s.estmtUntprc}
            placeholder="입력해주세요."
            onChange={(e) => set({ estmtUntprc: e.target.value })}
          />
        ),
      },
      // 견적금액 — 견적단가와 연동하지 않고 임의 숫자로 표시(목업).
      { label: '견적금액', value: '608,000.00', type: 'number' },
      {
        // 화폐단위 — SelectBox(맨 하단, 설계서 slide422). 셀 [&_button]:w-fit 를 !w-full 로 덮어 100%.
        label: '화폐단위',
        type: 'combination',
        value: (
          <div className="w-full [&_button]:!w-full">
            <SelectBox
              items={CRNCY_OPTIONS}
              value={s.crncNm}
              onValueChange={(v) => set({ crncNm: v })}
              aria-label="화폐단위"
            />
          </div>
        ),
      },
    ]
  }, [item, s])

  const visibleRows = expanded ? rows : rows.slice(0, DEFAULT_VISIBLE)

  return (
    <div className="px-4">
      <Table rows={visibleRows} />
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

export function OvsRlsVltrnsNgtnEtdcSbmsn3() {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const loaded = Math.min(page * pageSize, TOTAL)
  const visible = MOCK_ITEMS.slice(0, loaded)

  return (
    <div className="flex flex-col gap-krds-7 py-4">
      <div className="px-4">
        <ListSectionHeader
          total={TOTAL}
          pageSize={pageSize}
          pageSizeOptions={[10, 30, 50]}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
            console.log('[M76] 표시개수 →', size)
          }}
        />
      </div>
      <div className="flex flex-col gap-krds-8">
        {visible.map((item) => (
          <ItemCard key={item.frcptlArtclNo} item={item} />
        ))}
      </div>
      {loaded < TOTAL && (
        <div className="px-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              const next = page + 1
              setPage(next)
              console.log('[M76] 더보기 → page', next)
            }}
          >
            더보기 ({loaded}/{TOTAL})
          </Button>
        </div>
      )}
    </div>
  )
}
OvsRlsVltrnsNgtnEtdcSbmsn3.displayName = 'OvsRlsVltrnsNgtnEtdcSbmsn3'
