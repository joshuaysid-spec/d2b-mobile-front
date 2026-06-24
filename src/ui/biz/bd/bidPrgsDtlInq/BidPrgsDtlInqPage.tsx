// 입찰진행 상세조회 (MUI-BD-03-M02, 설계서 slide66). 입찰진행 목록 카드 → /bd/prgrs/:id 진입.
// 레퍼런스: 입찰공고 상세 BidPbancDtlPage (요약정보 sticky + 본문 아코디언/테이블 패턴).
// 신청한 입찰의 상세 정보(구분/내용) + 작성 서류 보기 버튼. 데이터는 목업 — 추후 bdService.getBidProgressDetail.
// 항목명은 설계서 dlt_bidPrgrsList(slide67) 기준. 입찰참가신청서/입찰서 상태값은 설계서에 영문 항목명이
//   없어(상세설계 예정) 상태 텍스트는 표시하지 않고 '내용 보기' 버튼만 둔다.
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SummaryInfo, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import type { BidPrgrsItem } from '@/types/bd'

// 상세 대상(목업) — 설계서 slide66 예시값 + dlt_bidPrgrsList 항목명. 추후 bdService.getBidProgressDetail(id).
const DETAIL: BidPrgrsItem = {
  rNum: '1',
  taskSeNm: '물품',
  pbancNo: 'LDG0097-1',
  prcmNo: '56349',
  bidNm: '특수작전용대물타격무인항공기',
  rfrncNo: '2025LDG56349',
  orderInstTelno: '02-1234-5678',
  ctrtMthdNm: '경쟁입찰',
  bidMthdNm: '전자입찰',
  bidClrsDt: '2025-12-23 17:00',
  tndrSbmsnDdlnDt: '2025-12-24 10:00',
  bzentySeNm: '대표',
  bfhdSrng: true,
  bidPrgrsApfr: true,
  tndr: false,
}

// 구분/내용 — 설계서 slide66 항목(dlt_bidPrgrsList 항목명).
const INFO_ROWS: TableRow[] = [
  { label: '업무구분', value: DETAIL.taskSeNm },
  { label: '공고번호', value: DETAIL.pbancNo },
  { label: '판단번호', value: DETAIL.prcmNo },
  { label: '입찰건명', value: DETAIL.bidNm },
  { label: '통합참조번호', value: DETAIL.rfrncNo },
  { label: '발주기관연락처', value: DETAIL.orderInstTelno },
  { label: '계약방법', value: DETAIL.ctrtMthdNm },
  { label: '입찰방법', value: DETAIL.bidMthdNm },
  { label: '업체구분', value: DETAIL.bzentySeNm },
  { label: '입찰참가등록 마감일시', value: DETAIL.bidClrsDt },
  { label: '입찰서제출 마감일시', value: DETAIL.tndrSbmsnDdlnDt },
]

// 작성 서류 — flag(bfhdSrng/bidPrgrsApfr/tndr 등)에 따라 해당 항목만 노출. '보기' 클릭 시 읽기모드 연계(스텁).
function docRows(it: BidPrgrsItem): TableRow[] {
  const viewBtn = (label: string, key: string) => (
    <Button size="sm" variant="inner" onClick={() => console.log('[M02] 내용 보기', key)}>
      {label}
    </Button>
  )
  const rows: TableRow[] = [
    { label: '공고', value: viewBtn('공고 보기', 'pbanc'), type: 'combination' },
  ]
  if (it.bidPrgrsApfr) rows.push({ label: '입찰참가신청서', value: viewBtn('내용 보기', 'apfr'), type: 'combination' })
  if (it.tndr) rows.push({ label: '입찰서', value: viewBtn('내용 보기', 'tndr'), type: 'combination' })
  if (it.bfhdSrng) rows.push({ label: '사전심사(PQ)', value: viewBtn('결과', 'pq'), type: 'combination' })
  return rows
}

export function BidPrgsDtlInqPage() {
  const { collapsed, rootRef, scrollToTop } = useCollapsibleHeader()
  const { id } = useParams()
  useEffect(() => {
    console.log('[M02] 입찰진행 상세 조회', id) // 추후 API: bdService.getBidProgressDetail(id)
  }, [id])

  const summaryRows: SummaryInfoRow[] = [
    { label: '입찰참가등록 마감일시', value: DETAIL.bidClrsDt },
    { label: '입찰서제출 마감일시', value: DETAIL.tndrSbmsnDdlnDt },
  ]

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: DETAIL.taskSeNm }, { label: DETAIL.ctrtMthdNm }]}
          subtitle={`공고번호 ${DETAIL.pbancNo}`}
          title={DETAIL.bidNm}
          actions={
            <button
              type="button"
              aria-label="출력"
              onClick={() => console.log('[M02] 출력')}
              className="flex size-[37px] shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-field bg-background text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
            >
              <Icon name="Print" size={24} aria-hidden />
            </button>
          }
          rows={summaryRows}
        />
      </div>

      <PageTitle as="h2">입찰진행 상세정보</PageTitle>
      <Accordion type="multiple" defaultValue={['info', 'docs']} className="w-full">
        <AccordionSection value="info" title="입찰정보" borderTop={false}>
          <Table rows={INFO_ROWS} />
        </AccordionSection>
        <AccordionSection value="docs" title="작성 서류">
          <Table rows={docRows(DETAIL)} />
        </AccordionSection>
      </Accordion>

      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
