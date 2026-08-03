// 선금신청서상세 - '신청정보' 탭 콘텐츠 (MUI-WM-01-T01). 설계서 05.대금청구및사후 v0.83 slide23, 26~27.
// 아코디언 3개(공급자 정보 · 계약내용 · 신청정보) + Table — 데이터(detail)는 페이지가 조회해 주입.
// 항목 순서는 slide23 화면 목업 그대로.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { PrpayApfrDtl as ApfrDtl } from '@/types/wm'

export interface PrpayApfrDtlProps {
  detail: ApfrDtl
}

export function PrpayApfrDtl({ detail }: PrpayApfrDtlProps) {
  // ── 공급자 정보 (dmt_splrInfo, slide27 1.5) ───────────────────────────────
  const splrRows: TableRow[] = [
    { label: '작성자명/직책', value: `${detail.wrtrNm} ${detail.wrtrJbttlNm}` },
    { label: '휴대폰번호', value: detail.wrtrEnmtno },
  ]

  // ── 계약내용 (dmt_ctrtCnInfo, slide26 1.2) ────────────────────────────────
  const ctrtRows: TableRow[] = [
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '계약번호', value: detail.ctrtNo },
    { label: '계약명', value: detail.ctrtNm },
    { label: '계약금액', value: `${detail.ctrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '납기', value: detail.dlvgdsYmd },
    { label: '비고', value: detail.mainBizCn || '-' },
  ]

  // ── 신청정보 (dmt_prpayApfrCyclInfo + dmt_aplyAmtInfo, slide26 1.1·1.3) ───
  const aplyRows: TableRow[] = [
    { label: '차수', value: detail.aplyCtrtCycl },
    { label: '수신자', value: detail.rcptnOgnzCd },
    { label: '신청일자', value: detail.dmndDt },
    { label: '신청금액', value: `${detail.aplyAmt.toLocaleString()} 원`, type: 'number' },
    { label: '신청금액 (일금)', value: `₩ ${detail.aplyAmtHngl}` },
    { label: '지출원인금액', value: `${detail.expndCauseAmt.toLocaleString()} 원`, type: 'number' },
  ]

  return (
    <Accordion type="multiple" defaultValue={['splr', 'ctrt', 'aply']} className="w-full">
      <AccordionSection value="splr" title="공급자 정보" borderTop={false}>
        <Table rows={splrRows} />
      </AccordionSection>
      <AccordionSection value="ctrt" title="계약내용">
        <Table rows={ctrtRows} />
      </AccordionSection>
      <AccordionSection value="aply" title="신청정보">
        <Table rows={aplyRows} />
      </AccordionSection>
    </Accordion>
  )
}
PrpayApfrDtl.displayName = 'PrpayApfrDtl'
