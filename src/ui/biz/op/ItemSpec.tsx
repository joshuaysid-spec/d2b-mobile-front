// 조달계획 상세 - '품목명세서' 탭 콘텐츠 (MUI-OP-01-M04, 문서 slide25).
// 헤더(총건수 + 표시개수) + 품목 카드 N개(각 품목 = 테이블, 기본 4행 + "내역 펼쳐보기/접기"로 전체 토글)
//   + 안내문 + 더보기. 재고번호 행의 [보기] → 목록정보조회 팝업(P75/P76) 스텁.
// 단가·금액은 비공개('- 원'). 데이터는 목업 — 추후 API(opService.getItemSpecs)로 대체.
// 미반영(추후): + 플로팅 버튼 → 출력물 바텀시트(MUI-BD-01-P17, OZ리포트).
import { memo, useCallback, useMemo, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { cn } from '@/utils/cn'

// 품목 1건 (목업/추후 API 매핑)
interface SpecItem {
  no: number
  itemNo: string // 항목번호
  rqstNo: string // 조달요구번호
  specNo: string // 규격번호
  specType: string // 규격종류
  unit: string // 단위
  qty: string // 수량
  open: string // 규격공개여부
  gun: string // 군급
  invtNo: string // 재고번호 (보기 → P75/P76)
  drawingNo: string // 도면/부품번호
  equip: string // 적용장비
  deliveryPlace: string // 납지
  unitPrice: string // 단가 (비공개)
  itemNm: string // 품명
  qaType: string // 품보형태
  budgetType: string // 예산구분
  delivery: string // 납기
  amount: string // 금액 (비공개)
}

const TOTAL = 258 // 총 건수(목업)

// 목업 품목 (문서 slide25 예시값 기반)
const MOCK_ITEMS: SpecItem[] = [
  {
    no: 1,
    itemNo: '1111',
    rqstNo: 'MBDKE22026003B',
    specNo: '4240-4009',
    specType: '국방/정식',
    unit: 'EA',
    qty: '25',
    open: '공개',
    gun: '-',
    invtNo: '4240-3753116870',
    drawingNo: 'A7005265',
    equip: '-',
    deliveryPlace: '-',
    unitPrice: '- 원',
    itemNm: '방독면,화학-생물학전용(K5)',
    qaType: '체계품질보증형',
    budgetType: '본조',
    delivery: '2026-12-15',
    amount: '- 원',
  },
  {
    no: 2,
    itemNo: '1112',
    rqstNo: 'MBDKE22026003B',
    specNo: '4240-4010',
    specType: '국방/정식',
    unit: 'EA',
    qty: '30',
    open: '공개',
    gun: '-',
    invtNo: '4240-3753116871',
    drawingNo: 'A7005266',
    equip: '-',
    deliveryPlace: '-',
    unitPrice: '- 원',
    itemNm: '정화통,방독면용(K5)',
    qaType: '체계품질보증형',
    budgetType: '본조',
    delivery: '2026-12-15',
    amount: '- 원',
  },
  {
    no: 3,
    itemNo: '1113',
    rqstNo: 'MBDKE22026003B',
    specNo: '4240-4011',
    specType: '국방/정식',
    unit: 'EA',
    qty: '50',
    open: '비공개',
    gun: '-',
    invtNo: '4240-3753116872',
    drawingNo: 'A7005267',
    equip: '-',
    deliveryPlace: '-',
    unitPrice: '- 원',
    itemNm: '휴대낭,방독면용(K5)',
    qaType: '체계품질보증형',
    budgetType: '본조',
    delivery: '2026-12-15',
    amount: '- 원',
  },
]

// 기본 노출 행수 (나머지는 "내역 펼쳐보기"로 토글)
const DEFAULT_VISIBLE = 4

function buildRows(item: SpecItem, onView: (invtNo: string) => void): TableRow[] {
  return [
    { label: '순번', value: String(item.no) },
    { label: '항목번호', value: item.itemNo },
    { label: '조달요구번호', value: item.rqstNo },
    { label: '규격번호', value: item.specNo },
    { label: '규격종류', value: item.specType },
    { label: '단위', value: item.unit },
    { label: '수량', value: item.qty, type: 'number' },
    { label: '규격공개여부', value: item.open },
    { label: '군급', value: item.gun },
    {
      label: '재고번호',
      type: 'combination',
      value: (
        <>
          <span>{item.invtNo}</span>
          <div>
            <Button size="sm" variant="inner" onClick={() => onView(item.invtNo)}>
              보기
            </Button>
          </div>
        </>
      ),
    },
    { label: '도면/부품번호', value: item.drawingNo },
    { label: '적용장비', value: item.equip },
    { label: '납지', value: item.deliveryPlace },
    { label: '단가', value: item.unitPrice, type: 'number' },
    { label: '품명', value: item.itemNm },
    { label: '품보형태', value: item.qaType },
    { label: '예산구분', value: item.budgetType },
    { label: '납기', value: item.delivery },
    { label: '금액', value: item.amount, type: 'number' },
  ]
}

// 품목 1건 카드 — 기본 4행 + 펼쳐보기/접기. memo: 부모(ItemSpec) 리렌더 시 스킵(item/onView 안정).
const SpecItemCard = memo(function SpecItemCard({
  item,
  onView,
}: {
  item: SpecItem
  onView: (invtNo: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const allRows = useMemo(() => buildRows(item, onView), [item, onView])
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

export function ItemSpec() {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  // 재고번호 보기 → 목록정보조회 팝업(P75/P76) 스텁
  const handleView = useCallback((invtNo: string) => {
    console.log('[M04] 목록정보조회(P75/P76) 열기', invtNo)
  }, [])

  const loaded = Math.min(page * pageSize, TOTAL)

  return (
    <div className="flex flex-col gap-krds-7 pb-6">
      <PageTitle as="h2">품목명세서</PageTitle>
      <div className="px-4">
        <ListSectionHeader
          total={TOTAL}
          pageSize={pageSize}
          pageSizeOptions={[10, 30, 50]}
          onPageSizeChange={(s) => {
            setPageSize(s)
            setPage(1)
            console.log('[M04] 표시개수 →', s)
          }}
        />
      </div>

      {/* 품목 카드 목록 */}
      <div className="flex flex-col gap-krds-8">
        {MOCK_ITEMS.map((item) => (
          <SpecItemCard key={item.no} item={item} onView={handleView} />
        ))}
      </div>

      {/* 단가·금액 비공개 안내 */}
      <p className="px-4 text-krds-body-sm text-krds-feedback-danger">
        ※ 방위사업청 조달계획은 품목명세서 상 단가, 금액을 공개하지 않습니다.
      </p>

      {/* 더보기 */}
      <div className="px-4">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            const next = page + 1
            setPage(next)
            console.log('[M04] 더보기 → page', next)
          }}
        >
          더보기 ({loaded}/{TOTAL})
        </Button>
      </div>
    </div>
  )
}
ItemSpec.displayName = 'ItemSpec'
