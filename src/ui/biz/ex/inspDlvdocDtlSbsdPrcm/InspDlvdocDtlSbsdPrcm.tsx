// 검사및납품조서상세(부대조달) - '상세정보' 탭 콘텐츠 (MUI-EX-01-T03). 설계서 04.이행 v0.83 slide22, 24~25.
// 아코디언 3개(계약 상세정보 · 계약 업체 정보 · 이행 정보) + Table — 데이터(detail)는 페이지가 조회해 주입.
// 항목 순서는 slide22 화면 목업 그대로(계약상세: 계약번호~검사희망일/비고 · 업체: 계약업체~배송업체 ·
// 이행: 개시일자~출납관 전화번호).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockInspDlvdocDtlSbsdPrcm as SbsdDtl } from '@/types/mock/ex'

export interface InspDlvdocDtlSbsdPrcmProps {
  detail: SbsdDtl
}

export function InspDlvdocDtlSbsdPrcm({ detail }: InspDlvdocDtlSbsdPrcmProps) {
  // ── 계약 상세정보 (dmt_CtrtInfo, slide24 1.1) ─────────────────────────────
  const detailRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '통지번호', value: detail.avtsmtNo },
    { label: '예산구분', value: detail.bgtSecdNm },
    { label: '납품조서번호', value: detail.dlvdocNo },
    { label: '납기', value: detail.dudtYmd },
    { label: '납지', value: detail.plcdlvNm },
    { label: '검사희망일', value: detail.inspHopeYmd },
    { label: '비고', value: detail.rmrkCn || '-' },
  ]

  // ── 계약 업체 정보 (dmt_CtrtrInfo, slide24 1.2) ───────────────────────────
  const bzentyRows: TableRow[] = [
    { label: '계약업체', value: detail.ctrtBzentyNm },
    { label: '주소', value: detail.ctrtBzentyAddr },
    { label: '대표자', value: detail.rprsvNm },
    { label: '배송업체', value: detail.dlvBzentyNm },
  ]

  // ── 이행 정보 (dmt_CtrtInfo, slide25 1.4) ─────────────────────────────────
  const impltRows: TableRow[] = [
    { label: '개시일자', value: detail.strtYmd },
    { label: '검수일자', value: detail.igiYmd },
    { label: '납품일자', value: detail.dlvgdsYmd },
    { label: '출납번호', value: detail.rcpmNo },
    { label: '합격일자', value: detail.passYmd },
    { label: '기술검사기관', value: detail.techInspInstNm },
    { label: '기술검사관', value: detail.techInsptrNm },
    { label: '물량검사관 소속', value: detail.amtmtrInsptrOgdpNm },
    { label: '물량검사관', value: detail.amtmtrInsptrNm },
    { label: '출납관 소속', value: detail.acofOgdpNm },
    { label: '출납관', value: detail.acofNm },
    { label: '출납관 전화번호', value: detail.acofTelno },
  ]

  return (
    <Accordion type="multiple" defaultValue={['detail', 'bzenty', 'implt']} className="w-full">
      <AccordionSection value="detail" title="계약 상세정보" borderTop={false}>
        <Table rows={detailRows} />
      </AccordionSection>
      <AccordionSection value="bzenty" title="계약 업체 정보">
        <Table rows={bzentyRows} />
      </AccordionSection>
      <AccordionSection value="implt" title="이행 정보">
        <Table rows={impltRows} />
      </AccordionSection>
    </Accordion>
  )
}
InspDlvdocDtlSbsdPrcm.displayName = 'InspDlvdocDtlSbsdPrcm'
