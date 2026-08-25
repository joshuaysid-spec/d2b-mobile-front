// 전자계산서상세(국외) — MUI-WM-01-M74 OvsElcrtTxivDtl.
// 설계서 05.대금청구및사후 v0.85 slide94~98 (2026-08-13 국외 신규 화면 추가분).
// 전자계산서목록(P73) 카드 클릭 → /wm/ovsElcrtTxivDtl 진입(식별자는 navigate state).
// 구성: 중요 안내 + sticky 요약(SummaryInfo) + 아코디언 4섹션(공급자/공급받는자/일반정보/품목정보)
//      — 탭 없이 하단으로 표시(slide94). 품목정보는 10건 초과 시 더보기(slide95).
// 업무도움(slide94)은 '내역이 있는 경우 만 표시' — 안내 내역 확정 전이라 미표시(M01 동일).
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { wmQueries } from '@/queries/cts/wm/wmQueries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsElcrtTxivItem, OvsElcrtTxivItemRow } from '@/types/mock/wm'

/** 외화 금액 표기 — 소수 2자리 고정(설계서 000,000,000,000.00). */
const fmtAmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// 품목 1건 → 표 행(slide95). 세액은 영세/면세(0 리턴)면 하이픈으로 표시.
function itemRows(it: OvsElcrtTxivItemRow): TableRow[] {
  return [
    { label: '월일', value: it.wrtYmd },
    { label: '계산서번호', value: it.issuNo },
    { label: '품목', value: it.itemNm },
    { label: '공급자', value: it.brno },
    { label: '수량', value: it.dlvgdsQty.toLocaleString(), type: 'number' },
    { label: '단가', value: fmtAmt(it.ctrtUntprc), type: 'number' },
    { label: '공급가액', value: fmtAmt(it.splyEqvl), type: 'number' },
    { label: '세액', value: it.vatAmt === 0 ? '-' : fmtAmt(it.vatAmt), type: 'number' },
    { label: '비고', value: it.rmrkCn || '-' },
  ]
}

export function OvsElcrtTxivDtlPage() {
  // 식별자(계산서발행번호)는 목록에서 navigate state 로 전달(URL 노출 금지).
  const stateItem = useLocation().state as OvsElcrtTxivItem | null
  const { collapsed, rootRef, scrollToTop } = useCollapsibleHeader()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const id = stateItem?.id ?? ''
  const { data: detail } = wmQueries.useSelectElectronicBill(id)
  const { data: items = [] } = wmQueries.useSelectOvsElcrtTxivItems(id)

  if (!stateItem) return <Navigate to="/wm/ovsCmdtyRcvCnfdocList" replace />
  if (!detail) return <PageLoading />

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = items.slice(0, loaded)

  // ── 세금계산서 공급자정보 (dm_billInfo, slide97 1.3) ──────────────────────
  const splrRows: TableRow[] = [
    { label: '사업자번호', value: detail.splr.brno },
    { label: '대표명', value: detail.splr.rprsvNm },
    { label: '상호(업체명)', value: detail.splr.bzentyNm },
    { label: '업태', value: detail.splr.bzstatCd ?? '-' },
    { label: '주소', value: detail.splr.splrAddr },
    { label: '업종', value: detail.splr.splrTpbizNm ?? '-' },
    { label: '청구인성명', value: detail.splr.splrPicNm ?? '-' },
    { label: '연락처', value: detail.splr.splrEntlno ?? '-' },
    { label: '부서명', value: detail.splr.splrTkcgDeptNm ?? '-' },
  ]

  // ── 세금계산서 공급받는자정보 (slide94 목업 — 사업자번호/대표명/상호/주소) ──
  const splrcpRows: TableRow[] = [
    { label: '사업자번호', value: detail.splrcp.brno },
    { label: '대표명', value: detail.splrcp.rprsvNm },
    { label: '상호', value: detail.splrcp.bzentyNm },
    { label: '주소', value: detail.splrcp.splrAddr },
  ]

  // ── 일반정보 (dm_billSubInfo, slide96 1.2) ────────────────────────────────
  const gnrlRows: TableRow[] = [
    { label: '계약번호', value: detail.ctrtNo },
    { label: '책번호', value: detail.bookNo },
    { label: '일련번호', value: detail.regSn },
    { label: '발행번호', value: detail.txivNo },
    { label: '세액구분', value: detail.vatSecd },
    { label: '확정구분', value: detail.cfmtnYn },
  ]

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      <Notice type="urgent">대금 신청, 청구는 PC 버전에서 가능합니다.</Notice>

      {/* 상단 요약 — sticky. 뱃지(구분/진행상태/수정사유)는 P73 목록과 동일(slide94) */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[
            { label: detail.billSe },
            { label: detail.prgrsSttsCd },
            ...(detail.mdfcnRsn ? [{ label: detail.mdfcnRsn }] : []),
          ]}
          subtitle={`계산서 발행번호 ${detail.bilPblcnNo}`}
          title={detail.ctrtNm}
          rows={[
            { label: '계약금액', value: fmtAmt(detail.ctrtAmt) },
            { label: '공급금액', value: fmtAmt(detail.splyEqvl) },
            { label: '발행일자', value: detail.pblcnYmd },
          ]}
        />
      </div>

      {/* 본문 — 아코디언 3섹션 + 품목정보(건수·더보기) */}
      <div className="min-h-[100dvh]">
        <Accordion type="multiple" defaultValue={['splr', 'splrcp', 'gnrl']} className="w-full">
          <AccordionSection value="splr" title="세금계산서 - 공급자정보" borderTop={false}>
            <Table rows={splrRows} />
          </AccordionSection>
          <AccordionSection value="splrcp" title="세금계산서 - 공급받는자정보">
            <Table rows={splrcpRows} />
          </AccordionSection>
          <AccordionSection value="gnrl" title="일반정보">
            <Table rows={gnrlRows} />
          </AccordionSection>
        </Accordion>

        <section className="flex flex-col gap-krds-7 py-6">
          <SectionTitle as="h3" info={`총 ${total}건`}>
            품목정보
          </SectionTitle>
          <div className="flex flex-col gap-krds-7 px-4">
            {visibleList.map((it) => (
              <Table key={it.id} rows={itemRows(it)} />
            ))}
          </div>
          {loaded < total && (
            <div className="px-4">
              <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
                더보기 ({loaded}/{total}건)
              </Button>
            </div>
          )}
        </section>
      </div>

      {/* 상단 이동 버튼(slide94) */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
OvsElcrtTxivDtlPage.displayName = 'OvsElcrtTxivDtlPage'
