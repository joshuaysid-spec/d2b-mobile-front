// 공개수의협상결과조회 - '조회 결과' 탭 (MUI-BD-12-T83(구 M83 — v1.83 재편), 설계서 slide443 · 항목설명 slide445).
// 업체별 결과 카드(총액제) — 기본 4행 + 내역 펼쳐보기 + 더보기. 항목명 = 설계서 데이터영역 영문(dl_bidRsltList).
// 제출서류=O → '제출서류 보기' → 첨부파일 바텀시트(이 탭이 컨테이너 소유).
import { memo, useMemo, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { cn } from '@/utils/cn'
import type { MockOvsRlsVltrnsSrngRsltItem } from '@/types/mock/bd'

// 조회결과 목업 — 설계서 slide443 값. 첫 건 낙찰(+계약포기), 이후 탈락. 추후 bdService.selectOvsRlsVltrnsSrngRslt 매핑.
const ITEM_BASE: Omit<MockOvsRlsVltrnsSrngRsltItem, 'no' | 'rnk' | 'scsbdYn' | 'rsn' | 'abndDt' | 'abndRsn'> = {
  sbtBzentyCd: '7001F',
  sbtBzentyNm: 'A 무역대리점',
  splyBzentyCd: '7004F',
  splyBzentyNm: 'B 해외업체',
  docSbmsnYn: 'O',
  estmtAmt: '98,000,000.00',
  crncNm: 'USD',
}
const TOTAL = 258
const MOCK_ITEMS: MockOvsRlsVltrnsSrngRsltItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const win = i === 0 // 첫 건 낙찰(설계서 slide443 예시)
  return {
    ...ITEM_BASE,
    no: String(i + 1),
    rnk: String(i + 1),
    scsbdYn: win ? '낙찰' : '탈락',
    rsn: win ? '' : '가격 미달',
    abndDt: win ? '2025-12-11' : '',
    abndRsn: win ? '계약 포기 사유' : '',
  }
})

// 제출서류 첨부파일 목업(다운로드) — 설계서에 제출서류 팝업 상세 없음 → 견적서 제출서류 4종 기준 목업.
const SUBMITTED_DOCS: FileDownloadItem[] = [
  { id: 'd1', name: '견적제안서 · 첨부파일명.hwp', size: '786KB', onDownload: () => console.log('[M83] 제출서류 다운로드 d1') },
  { id: 'd2', name: '공급자증명서 · 첨부파일명.hwp', size: '1.2MB', onDownload: () => console.log('[M83] 제출서류 다운로드 d2') },
  { id: 'd3', name: '제작사증명서 · 첨부파일명.hwp', size: '540KB', onDownload: () => console.log('[M83] 제출서류 다운로드 d3') },
  { id: 'd4', name: '기타 공고요구서류 · 첨부파일명.hwp', size: '320KB', onDownload: () => console.log('[M83] 제출서류 다운로드 d4') },
]

// 접힘 시 노출 행수 — 순번/신청업체코드/신청업체명/입찰업체코드 4행(slide443).
const DEFAULT_VISIBLE = 4

const BidRsltItemCard = memo(function BidRsltItemCard({
  item,
  onViewDocs,
}: {
  item: MockOvsRlsVltrnsSrngRsltItem
  onViewDocs: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  const allRows = useMemo<TableRow[]>(
    () => [
      { label: '순번', value: item.no },
      { label: '신청업체코드', value: item.sbtBzentyCd },
      { label: '신청업체명', value: item.sbtBzentyNm },
      { label: '입찰업체코드', value: item.splyBzentyCd },
      { label: '입찰업체명', value: item.splyBzentyNm },
      {
        label: '제출서류',
        type: 'combination',
        // O/X 표시(좌) + '보기' 버튼(우) — 설계서 slide443. 제출(O)일 때만 보기 노출.
        value: (
          <div className="flex w-full items-center justify-between gap-krds-5">
            <span>{item.docSbmsnYn}</span>
            {item.docSbmsnYn === 'O' && (
              <Button variant="secondary" className="h-9 px-krds-6 text-krds-body-sm" onClick={onViewDocs}>
                보기
              </Button>
            )}
          </div>
        ),
      },
      { label: '견적금액', value: item.estmtAmt, type: 'number' },
      { label: '화폐단위', value: item.crncNm },
      { label: '순위', value: item.rnk, type: 'number' },
      { label: '낙찰여부', value: item.scsbdYn },
      { label: '탈락사유', value: item.rsn || '-' },
      { label: '계약포기일자', value: item.abndDt || '-' },
      { label: '계약포기사유', value: item.abndRsn || '-' },
    ],
    [item, onViewDocs],
  )
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

export function OvsRlsVltrnsNgtnSrngRsltInq2() {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [docsOpen, setDocsOpen] = useState(false) // 제출서류 첨부파일 바텀시트

  const loaded = Math.min(page * pageSize, TOTAL)
  const visible = MOCK_ITEMS.slice(0, loaded)

  return (
    <div className="flex flex-col gap-krds-7 pb-6">
      {/* 헤더 — '조회 결과' 라벨 + 총건수·표시개수 (설계서 slide443 '조회 결과 - 총 N건') */}
      <div className="flex flex-col gap-krds-5 px-4 pt-4">
        <InputLabel>조회 결과</InputLabel>
        <ListSectionHeader
          total={TOTAL}
          pageSize={pageSize}
          pageSizeOptions={[10, 30, 50]}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
            console.log('[M83] 표시개수 →', size)
          }}
        />
      </div>

      <div className="flex flex-col gap-krds-8">
        {visible.map((item) => (
          <BidRsltItemCard key={item.no} item={item} onViewDocs={() => setDocsOpen(true)} />
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
              console.log('[M83] 더보기 → page', next)
            }}
          >
            더보기 ({loaded}/{TOTAL})
          </Button>
        </div>
      )}

      {/* 제출서류 첨부파일 — 다운로드 전용 바텀시트(이 탭이 컨테이너 소유) */}
      <BottomSheet open={docsOpen} onOpenChange={setDocsOpen} title="제출서류">
        <FileDownloadList files={SUBMITTED_DOCS} />
      </BottomSheet>
    </div>
  )
}
OvsRlsVltrnsNgtnSrngRsltInq2.displayName = 'OvsRlsVltrnsNgtnSrngRsltInq2'
