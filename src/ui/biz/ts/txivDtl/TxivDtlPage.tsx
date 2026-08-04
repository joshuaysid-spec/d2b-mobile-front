// 세금계산서상세 — MUI-TS-04-M03 TxivDtl. 설계서 06.업무지원 v0.82 slide28~30.
// 세금계산서목록(P02) 카드 클릭 → /ts/txiv/dtl/:id 진입.
// 구성: sticky(요약 SummaryInfo — 뱃지는 P02 목록과 동일 3종) + 아코디언 4섹션
//   (계약정보 · 공급자 정보 · 공급받는자 정보 · 계약서 일반정보) — 탭·StepBar 없음(slide28).
// 계약번호 라벨은 조달구분(sOption)별 변경(재무관증빙번호/청구번호) — 상세설계 확정 전 '계약번호' 고정.
// 출력 버튼(slide30) — Window print 처리(스텁).
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useTxivDtl } from '@/queries/ts'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Table, type TableRow } from '@/ui/common/composites/Table'

export function TxivDtlPage() {
  const { id = '' } = useParams()
  const { collapsed, rootRef, scrollToTop } = useCollapsibleHeader()
  const [printModalOpen, setPrintModalOpen] = useState(false)

  const { data: detail } = useTxivDtl(id)

  if (!detail) return <PageLoading />

  // ── 계약정보 (dmt_TxivWrtInfo, slide29 1.1) ───────────────────────────────
  const ctrtRows: TableRow[] = [
    { label: '계약번호', value: detail.ctrtNo },
    { label: '발행번호', value: detail.pblcnNo },
    { label: '책번호', value: detail.bookNo },
    { label: '일련번호', value: detail.regSn },
  ]

  // ── 공급자 정보 ───────────────────────────────────────────────────────────
  const splrRows: TableRow[] = [
    { label: '사업자번호', value: detail.splrBrno },
    { label: '대표명', value: detail.splrRprsvNm },
    { label: '상호(업체명)', value: detail.splrBzentyNm },
    { label: '업태', value: detail.splrBzstatCd },
    { label: '주소', value: detail.splrAddr },
    { label: '업종', value: detail.splrTpbizNm },
    { label: '청구인성명', value: detail.splrPicNm },
    { label: '연락처', value: detail.splrEntlno },
    { label: '부서명', value: detail.splrTkcgDeptNm },
    { label: 'E-Mail', value: detail.splrEmlAddr },
  ]

  // ── 공급받는자 정보 ───────────────────────────────────────────────────────
  const splrcpRows: TableRow[] = [
    { label: '사업자번호', value: detail.splrcpBrno },
    { label: '대표명', value: detail.splrcpRprsvNm },
    { label: '상호(업체명)', value: detail.splrcpBzentyNm },
    { label: '업태', value: detail.splrcpBzstatCd },
    { label: '주소', value: detail.splrcpAddr },
    { label: '업종', value: detail.splrcpTpbizNm },
  ]

  // ── 계약서 일반정보 (세액구분/신고구분 + 품목, slide28) ───────────────────
  const gnrlRows: TableRow[] = [
    { label: '세액구분', value: detail.vatSecd },
    { label: '신고구분', value: detail.cfmtnYn },
    { label: '계산서일자', value: detail.splyYmd },
    { label: '품목 (계약건명)', value: detail.itemNm },
    { label: '수량', value: detail.dlvgdsQty.toLocaleString(), type: 'number' },
    { label: '단가', value: `${detail.ctrtUntprc.toLocaleString()} 원`, type: 'number' },
    { label: '공급가액', value: `${detail.splyEqvl.toLocaleString()} 원`, type: 'number' },
    { label: '세액', value: `${detail.vatAmt.toLocaleString()} 원`, type: 'number' },
    { label: '비고', value: detail.rmrkCn || '-' },
  ]

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky. 뱃지(구분/진행상태/수정사유)는 P02 목록과 동일(slide28) */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[
            { label: detail.reqDivsNm },
            { label: detail.txivPrgrsStcd },
            ...(detail.txivMdfcnRncd ? [{ label: detail.txivMdfcnRncd }] : []),
          ]}
          subtitle={`계약번호 ${detail.ctrtNo}`}
          title={detail.rpstItnm}
          actions={
            // 출력(slide30) — 세금계산서상세내용 팝업 호출 후 Window print 처리(스텁).
            <SummaryUtilButton icon="Print" label="출력" onClick={() => setPrintModalOpen(true)} />
          }
          rows={[
            { label: '계산서 발행번호', value: detail.pblcnNo },
            { label: '계약금액', value: `${detail.contAmnt.toLocaleString()} 원` },
            { label: '공급가액', value: `${detail.splyEqvl.toLocaleString()} 원` },
            { label: '발행일자', value: detail.bllPblcnYmd },
          ]}
        />
      </div>

      {/* 본문 — 아코디언 4섹션 */}
      <div className="min-h-[100dvh]">
        <Accordion
          type="multiple"
          defaultValue={['ctrt', 'splr', 'splrcp', 'gnrl']}
          className="w-full"
        >
          <AccordionSection value="ctrt" title="계약정보" borderTop={false}>
            <Table rows={ctrtRows} />
          </AccordionSection>
          <AccordionSection value="splr" title="공급자 정보">
            <Table rows={splrRows} />
          </AccordionSection>
          <AccordionSection value="splrcp" title="공급받는자 정보">
            <Table rows={splrcpRows} />
          </AccordionSection>
          <AccordionSection value="gnrl" title="계약서 일반정보">
            <Table rows={gnrlRows} />
          </AccordionSection>
        </Accordion>
      </div>

      {/* 출력 확인 — Window print 처리 스텁 */}
      <AlertModal
        open={printModalOpen}
        onOpenChange={setPrintModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="세금계산서 상세내용을 출력할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[M03] 세금계산서상세내용 출력(Window print) 스텁'),
        }}
      />

      {/* 맨 위로 FAB */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
TxivDtlPage.displayName = 'TxivDtlPage'
