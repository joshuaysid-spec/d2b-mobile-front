// 공사전자계약진행상세 - '상세정보' 탭 콘텐츠 (MUI-CT-01-T09). 설계서 slide39·43~44.
// 아코디언 3개(계약 상세정보 · 계약금액 · 담당자 정보) — M03 상세정보(_Cn)와 동일 구조, 필드 세트만 공사용.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCstrnElctrCtrtPrgrsDtl as CstrnDtl } from '@/types/mock/ct'

export interface CstrnElctrCtrtPrgrsDtl_CnProps {
  detail: CstrnDtl
}

export function CstrnElctrCtrtPrgrsDtl_Cn({ detail }: CstrnElctrCtrtPrgrsDtl_CnProps) {
  // ── 계약 상세정보 (slide39 표 순서) ────────────────────────────────────────
  const detailRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '계약유형', value: detail.fcltLbsvcSecd },
    { label: '계약명', value: detail.ctrtNm },
    { label: '공사번호', value: detail.prcmNo },
    { label: '발주처', value: detail.orderInstNm },
    { label: '계약방법', value: detail.ctrtMthdCd },
    { label: '수의계약사유', value: detail.pvctRncd ?? '-' },
    { label: '계약진행상태', value: detail.ctrtPrgrsStcd },
    { label: '하자담보유무', value: detail.flwGrnteYn },
    { label: '착공년월일', value: detail.bgncstYmd },
    { label: '준공년월일', value: detail.cmcnYmd },
    { label: '기타사항', value: detail.etcMttr ?? '-' },
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '계약시작일자', value: detail.ctrtBgngYmd },
    { label: '계약종료일자', value: detail.ctrtEndYmd },
    { label: '낙찰자확정일자', value: detail.scbdrCfmtnYmd ?? '-' },
    { label: '입찰일자', value: detail.bidYmd ?? '-' },
    { label: '물가변동계약금액 조정방법', value: detail.pfrAplcnMthdCd ?? '-' },
    { label: '입찰방법', value: detail.bidMthdCd },
    { label: '처리사유', value: detail.prcsRsn ?? '-' },
    { label: '수정사유', value: detail.mdfcnCtrtRncd ?? '-' },
    { label: '관련근거', value: detail.relBssCn ?? '-' },
  ]

  // ── 계약금액 (slide39 — 물품 대비 공채매입/낙찰율/낙찰금액/예정금액/국민주택채권 추가) ──
  const amountRows: TableRow[] = [
    { label: '일반예산', value: `${detail.bscbgtCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '국채', value: `${detail.govbndCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '합계', value: `${detail.sumAmt.toLocaleString()} 원`, type: 'number' },
    { label: '총부기금액', value: `${detail.tbkpngAmt.toLocaleString()} 원`, type: 'number' },
    { label: '계약보증금', value: `${detail.grnteAmt.toLocaleString()} 원`, type: 'number' },
    { label: '지체상금률', value: `${detail.lqdmgRt} %`, type: 'number' },
    ...(detail.pbdbtPrchsAmt !== undefined
      ? [
          {
            label: '공채매입금액',
            value: `${detail.pbdbtPrchsAmt.toLocaleString()} 원`,
            type: 'number' as const,
          },
        ]
      : []),
    ...(detail.scbrt !== undefined
      ? [{ label: '낙찰율', value: `${detail.scbrt} %`, type: 'number' as const }]
      : []),
    ...(detail.scsbdAmt !== undefined
      ? [
          {
            label: '낙찰금액',
            value: `${detail.scsbdAmt.toLocaleString()} 원`,
            type: 'number' as const,
          },
        ]
      : []),
    ...(detail.prnmntAmt !== undefined
      ? [
          {
            label: '예정금액',
            value: `${detail.prnmntAmt.toLocaleString()} 원`,
            type: 'number' as const,
          },
        ]
      : []),
    ...(detail.nhbdPrchsAmt !== undefined
      ? [
          {
            label: '국민주택채권 매입금액',
            value: `${detail.nhbdPrchsAmt.toLocaleString()} 원`,
            type: 'number' as const,
          },
        ]
      : []),
  ]

  // ── 담당자 정보 ─────────────────────────────────────────────────────────────
  const managerRows: TableRow[] = detail.managers.flatMap((m) => [
    { label: '구분', value: m.tkcgSecd },
    { label: '성명/계급', value: m.picNm },
  ])

  return (
    <Accordion type="multiple" defaultValue={['detail', 'amount', 'manager']} className="w-full">
      <AccordionSection value="detail" title="계약 상세정보" borderTop={false}>
        <Table rows={detailRows} />
      </AccordionSection>
      <AccordionSection value="amount" title="계약금액">
        <Table rows={amountRows} />
      </AccordionSection>
      <AccordionSection value="manager" title="담당자 정보">
        <Table rows={managerRows} />
      </AccordionSection>
    </Accordion>
  )
}
CstrnElctrCtrtPrgrsDtl_Cn.displayName = 'CstrnElctrCtrtPrgrsDtl_Cn'
