// 공개수의협상 견적서 조회(상세) - 입찰품목(입찰참여품목 단가제) (MUI-BD-12-T80(구 M80 — v1.83 재편), 설계서 slide432). 읽기전용.
// 품목 카드(기본 4행 + 내역 펼쳐보기) — 전부 값 표시(입력 없음). altSe='Y' 시 품목대체첨부문서·수정재고/부품번호 노출.
// 품목대체첨부문서 [보기] → 첨부파일 조회 바텀시트(국외 입찰공고 상세의 OvsBidPbanc_AtchFileInq 재사용 —
//   사용자 지시 2026-08-26). 컨테이너는 여기(탭 콘텐츠)가 소유.
import { memo, useMemo, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OvsBidPbanc_AtchFileInq } from '@/ui/biz/bd/ovsBidPbancDtl/OvsBidPbanc_AtchFileInq'
import { cn } from '@/utils/cn'
import type { MockOvsAtchDoc, MockOvsRlsVltrnsEtdcDtlItem } from '@/types/mock/bd'

// 입찰참여품목 목업 — 설계서 slide432 값 그대로. 항목명 = 설계서 데이터영역 영문(dl_bidItemList).
const ITEM_BASE: Omit<MockOvsRlsVltrnsEtdcDtlItem, 'frcptlArtclNo'> = {
  invtNo: '1015375183975',
  prtsNo: '000-A0000 0000',
  itemNm: 'T-80U/TBE-3',
  unitNm: 'EA',
  qty: '1',
  drctnUntprc: '608,000.00',
  itemSbstSe: 'Y',
  itemSbstDocEn: 'File.pdf',
  mdfcnInvtNo: '1',
  mdfcnPrtsNo: '2',
  estmtUntprc: '10,000.00',
  estmtAmt: '608,000.00',
  crncNm: 'USD (미 달러)',
}
const TOTAL = 100
const MOCK_ITEMS: MockOvsRlsVltrnsEtdcDtlItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...ITEM_BASE,
  frcptlArtclNo: String(i + 1),
}))

// 접힘 시 노출 행수 — 항목번호/재고번호/부품번호/품명 4행(slide432).
const DEFAULT_VISIBLE = 4

const ItemCard = memo(function ItemCard({
  item,
  onViewAtch,
}: {
  item: MockOvsRlsVltrnsEtdcDtlItem
  /** 품목대체첨부문서 [보기] — 첨부파일 조회 바텀시트 호출(컨테이너는 탭 콘텐츠 소유) */
  onViewAtch: (item: MockOvsRlsVltrnsEtdcDtlItem) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const rows = useMemo<TableRow[]>(() => {
    return [
      { label: '항목번호', value: item.frcptlArtclNo },
      { label: '재고번호', value: item.invtNo },
      { label: '부품번호', value: item.prtsNo },
      { label: '품명', value: item.itemNm },
      { label: '단위', value: item.unitNm },
      { label: '수량', value: item.qty, type: 'number' },
      { label: '지시단가', value: item.drctnUntprc, type: 'number' },
      { label: '품목대체구분', value: item.itemSbstSe },
      // 품목대체 = Y 일 때만 대체 관련 3행 노출(설계서 slide432).
      ...(item.itemSbstSe === 'Y'
        ? ([
            {
              // 품목대체첨부문서 — [보기] 로 첨부파일 조회 바텀시트 호출(사용자 지시 2026-08-26).
              label: '품목대체첨부문서',
              type: 'combination',
              value: (
                <div className="flex flex-col items-start gap-krds-3">
                  <span>{item.itemSbstDocEn}</span>
                  <Button size="sm" variant="inner" onClick={() => onViewAtch(item)}>
                    보기
                  </Button>
                </div>
              ),
            },
            { label: '수정재고번호', value: item.mdfcnInvtNo },
            { label: '수정부품번호', value: item.mdfcnPrtsNo },
          ] as TableRow[])
        : []),
      { label: '견적단가', value: item.estmtUntprc, type: 'number' },
      { label: '견적금액', value: item.estmtAmt, type: 'number' },
      { label: '화폐단위', value: item.crncNm },
    ]
  }, [item, onViewAtch])

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

export function OvsRlsVltrnsNgtnEtdcDtl3() {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  // 첨부파일 조회 대상 품목 — null=시트 닫힘.
  const [atchItem, setAtchItem] = useState<MockOvsRlsVltrnsEtdcDtlItem | null>(null)
  const loaded = Math.min(page * pageSize, TOTAL)
  const visible = MOCK_ITEMS.slice(0, loaded)

  // 선택 품목의 첨부서류 목록(dl_docList 형태) — 목업. 추후 API: bdService.selectOvsItemAtchFileList(frcptlArtclNo)
  const buildAtchDocs = (it: MockOvsRlsVltrnsEtdcDtlItem): MockOvsAtchDoc[] => [
    { docTitl: '품목대체첨부문서', fileNm: it.itemSbstDocEn, fileSz: 262_144, fileId: `ETDC-ATCH-${it.frcptlArtclNo}` },
  ]

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
            console.log('[M80] 표시개수 →', size)
          }}
        />
      </div>
      <div className="flex flex-col gap-krds-8">
        {visible.map((item) => (
          <ItemCard key={item.frcptlArtclNo} item={item} onViewAtch={setAtchItem} />
        ))}
      </div>

      {/* 첨부파일 조회 바텀시트 — 컨테이너/footer(닫기)는 여기 소유, 콘텐츠는 OvsBidPbanc_AtchFileInq 재사용 */}
      <BottomSheet
        open={atchItem !== null}
        onOpenChange={(o) => {
          if (!o) setAtchItem(null)
        }}
        title="첨부파일 조회"
        onConfirm={() => setAtchItem(null)}
        confirmLabel="닫기"
      >
        {atchItem && <OvsBidPbanc_AtchFileInq docs={buildAtchDocs(atchItem)} />}
      </BottomSheet>
      {loaded < TOTAL && (
        <div className="px-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              const next = page + 1
              setPage(next)
              console.log('[M80] 더보기 → page', next)
            }}
          >
            더보기 ({loaded}/{TOTAL})
          </Button>
        </div>
      )}
    </div>
  )
}
OvsRlsVltrnsNgtnEtdcDtl3.displayName = 'OvsRlsVltrnsNgtnEtdcDtl3'
