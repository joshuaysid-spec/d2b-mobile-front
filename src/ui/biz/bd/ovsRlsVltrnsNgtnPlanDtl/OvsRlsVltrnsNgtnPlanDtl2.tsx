// 공개수의협상계획상세 - '품목정보' 탭 (MUI-BD-12-T72(구 M72 — v1.83 재편), 설계서 02입찰 slide413).
// 품목 목록 — 조달계획 상세 품목명세서 탭과 동일 패턴: ListSectionHeader + 카드(기본 4행 + 내역 펼쳐보기/접기) + 더보기.
import { memo, useCallback, useMemo, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { cn } from '@/utils/cn'
import type { OvsRlsVltrnsItem } from '@/types/bd'

// 품목 목록 목업 — 설계서 slide413 값 그대로. 추후 bdService.selectOvsRlsVltrnsItems 매핑.
const ITEM_BASE: Omit<OvsRlsVltrnsItem, 'clsfNo'> = {
  qltyGrd: 'A',
  atchDocYn: 'O',
  stckNo: '156037A017759',
  partNo: '369A2093-2',
  specNo: '1560-D0001',
  prdctNm: '500MD',
  dlvyBaseYmd: '2025-03-02',
  unit: 'EA',
  mainQty: '5',
  currQty: '3',
  futrQty: '2',
  mainBdgt: '5,000,000 원',
  currBdgt: '1,000,000 원',
  futrBdgt: '1,000,000 원',
  qtySum: '10',
  crncyUnit: '미 달러',
  drctnUprc: '145.58',
  drctnAmt: '2,473.16',
  equipCd: '30310201',
  equipNm: '특수 추진기',
}
const TOTAL = 258
const MOCK_ITEMS: OvsRlsVltrnsItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...ITEM_BASE,
  clsfNo: String(i + 1),
}))

// 접힘 시 노출 행수 — 항목번호/품질등급/첨부문서/재고번호 4행(slide413).
const DEFAULT_VISIBLE = 4

// 첨부문서 '보기' → 바텀시트에 표시할 첨부파일 목업 (품목별 첨부문서). 추후 API 매핑.
const MOCK_DOC_FILES: FileDownloadItem[] = [
  { id: 'doc-1', name: '규격서.pdf', size: '786KB', onDownload: () => console.log('[M72] 첨부문서 다운로드: 규격서') },
  { id: 'doc-2', name: '도면.pdf', size: '1.2MB', onDownload: () => console.log('[M72] 첨부문서 다운로드: 도면') },
]

function itemRows(it: OvsRlsVltrnsItem, onViewDoc: () => void): TableRow[] {
  return [
    { label: '항목번호', value: it.clsfNo },
    { label: '품질등급', value: it.qltyGrd },
    {
      label: '첨부문서',
      type: 'combination',
      value: (
        <div className="flex items-center justify-between gap-2">
          <span>{it.atchDocYn}</span>
          <Button size="sm" variant="inner" onClick={onViewDoc}>
            보기
          </Button>
        </div>
      ),
    },
    { label: '재고번호', value: it.stckNo },
    { label: '부품번호', value: it.partNo },
    { label: '규격번호', value: it.specNo },
    { label: '품명', value: it.prdctNm },
    { label: '납기기준일자', value: it.dlvyBaseYmd },
    { label: '단위', value: it.unit },
    { label: '본조수량', value: it.mainQty, type: 'number' },
    { label: '당국수량', value: it.currQty, type: 'number' },
    { label: '장국수량', value: it.futrQty, type: 'number' },
    { label: '본조예산', value: it.mainBdgt, type: 'number' },
    { label: '당국예산', value: it.currBdgt, type: 'number' },
    { label: '장국예산', value: it.futrBdgt, type: 'number' },
    { label: '수량합계', value: it.qtySum, type: 'number' },
    { label: '화폐단위', value: it.crncyUnit },
    { label: '지시단가', value: it.drctnUprc, type: 'number' },
    { label: '지시금액', value: it.drctnAmt, type: 'number' },
    { label: '장비부호', value: it.equipCd },
    { label: '장비명', value: it.equipNm },
  ]
}

// 품목 1건 카드 — 기본 4행 + 펼쳐보기/접기 (품목명세서 탭과 동일). 첨부문서 보기 → 부모 바텀시트(onViewDoc).
const ItemCard = memo(function ItemCard({
  item,
  onViewDoc,
}: {
  item: OvsRlsVltrnsItem
  onViewDoc: (item: OvsRlsVltrnsItem) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const allRows = useMemo(() => itemRows(item, () => onViewDoc(item)), [item, onViewDoc])
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

export function OvsRlsVltrnsNgtnPlanDtl2() {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  // 첨부문서 보기 바텀시트 — 클릭한 품목의 항목번호로 타이틀 표기.
  const [docSheet, setDocSheet] = useState<{ open: boolean; clsfNo: string }>({ open: false, clsfNo: '' })
  const loaded = Math.min(page * pageSize, TOTAL)
  const visible = MOCK_ITEMS.slice(0, loaded)

  // onViewDoc — 안정 참조(ItemCard memo 유지). 클릭 품목의 첨부문서 바텀시트 오픈.
  const handleViewDoc = useCallback((item: OvsRlsVltrnsItem) => {
    setDocSheet({ open: true, clsfNo: item.clsfNo })
    console.log('[M72] 첨부문서 보기', item.clsfNo) // 추후 API: 품목 첨부문서 조회
  }, [])

  return (
    <div className="flex flex-col gap-krds-7 pb-6">
      <div className="px-4">
        <ListSectionHeader
          total={TOTAL}
          pageSize={pageSize}
          pageSizeOptions={[10, 30, 50]}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
            console.log('[M72] 표시개수 →', size)
          }}
        />
      </div>
      <div className="flex flex-col gap-krds-8">
        {visible.map((item) => (
          <ItemCard key={item.clsfNo} item={item} onViewDoc={handleViewDoc} />
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
              console.log('[M72] 더보기 → page', next)
            }}
          >
            더보기 ({loaded}/{TOTAL})
          </Button>
        </div>
      )}

      {/* 첨부문서 보기 — 첨부파일 바텀시트 (품목 첨부문서) */}
      <BottomSheet
        open={docSheet.open}
        onOpenChange={(o) => setDocSheet((s) => ({ ...s, open: o }))}
        title={`첨부문서${docSheet.clsfNo ? ` (항목번호 ${docSheet.clsfNo})` : ''}`}
      >
        <FileDownloadList files={MOCK_DOC_FILES} />
      </BottomSheet>
    </div>
  )
}
OvsRlsVltrnsNgtnPlanDtl2.displayName = 'OvsRlsVltrnsNgtnPlanDtl2'
