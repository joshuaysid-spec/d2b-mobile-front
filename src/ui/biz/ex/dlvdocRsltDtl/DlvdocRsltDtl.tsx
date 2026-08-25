// 검사및납품조서결과상세 - '상세정보' 탭 콘텐츠 (MUI-EX-01-T05). 설계서 04.이행 v0.83 slide37, 39~40.
// 아코디언 4개(계약 상세정보 · 계약 업체 정보 · 정비 정보 · 이행 정보) + Table — 데이터는 페이지가 조회해 주입.
// 항목 순서는 slide37 화면 목업 그대로.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockDlvdocRsltDtl as RsltDtl } from '@/types/mock/ex'

export interface DlvdocRsltDtlProps {
  detail: RsltDtl
}

export function DlvdocRsltDtl({ detail }: DlvdocRsltDtlProps) {
  // ── 계약 상세정보 (dmt_CtrtInfo, slide39 1.1) ─────────────────────────────
  const detailRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '통지번호', value: detail.avtsmtNo },
    { label: '예산구분', value: detail.bgtSeNm },
    { label: '납품장소', value: detail.dlvgdsPlcNm },
    { label: '납품기일', value: detail.dlvtrmYmd },
    { label: '조서발행번호', value: detail.recrdPblcnNo },
    { label: '비고', value: detail.rmrkCn || '-' },
  ]

  // ── 계약 업체 정보 (dmt_CtrtrInfo, slide39 1.2) ───────────────────────────
  const bzentyRows: TableRow[] = [
    { label: '계약업체', value: detail.ctrtBzentyNm },
    { label: '주소', value: detail.ctrtBzentyAddr },
    { label: '대표자', value: detail.rprsvNm },
    { label: '배송업체', value: detail.dlvBzentyNm },
  ]

  // ── 정비 정보 (dmt_MtncInq, slide39 1.3) ──────────────────────────────────
  const mtncRows: TableRow[] = [
    { label: '계약정비일수', value: `${detail.ctrtMtncDayCnt.toLocaleString()} 일`, type: 'number' },
    { label: '실정비일수', value: `${detail.rlmtDayCnt.toLocaleString()} 일`, type: 'number' },
    { label: '입고일 / 정비지시일', value: `${detail.wrhsYmd} / ${detail.mtncDrctnYmd}` },
    { label: '출고일', value: detail.spmtYmd },
  ]

  // ── 이행 정보 (dmt_DlvdocRslt, slide40 1.6 — 항목명은 M03 재사용, 타입 주석 참고) ──
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
    <Accordion
      type="multiple"
      defaultValue={['detail', 'bzenty', 'mtnc', 'implt']}
      className="w-full"
    >
      <AccordionSection value="detail" title="계약 상세정보" borderTop={false}>
        <Table rows={detailRows} />
      </AccordionSection>
      <AccordionSection value="bzenty" title="계약 업체 정보">
        <Table rows={bzentyRows} />
      </AccordionSection>
      <AccordionSection value="mtnc" title="정비 정보">
        <Table rows={mtncRows} />
      </AccordionSection>
      <AccordionSection value="implt" title="이행 정보">
        <Table rows={impltRows} />
      </AccordionSection>
    </Accordion>
  )
}
DlvdocRsltDtl.displayName = 'DlvdocRsltDtl'
