// 대금청구상세(공사) - '계약정보' 탭 콘텐츠 (MUI-WM-01-T13). 설계서 05.대금청구및사후 v0.83 slide56, 59.
// 아코디언 2개(계약정보 · 비고).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CstrnPymtClmDtl } from '@/types/mock/wm'

export interface CstrnPymtClmDtl_CtrtProps {
  detail: CstrnPymtClmDtl
}

export function CstrnPymtClmDtl_Ctrt({ detail }: CstrnPymtClmDtl_CtrtProps) {
  // ── 계약정보 (dmt_ctrtInfo, slide59 1.1 — 화면 순서 slide56) ──────────────
  const ctrtRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} - ${detail.ctrtCycl}` },
    { label: '공사기간', value: detail.bgncstYmd },
    { label: '업체명(대표)', value: detail.rprsvNm },
    { label: '검사일자', value: detail.inspYmd },
    { label: '지급구분', value: detail.giveSecd || '-' },
    { label: '계약금액', value: `${detail.ctrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '기성금액', value: `${detail.pxcndAmt.toLocaleString()} 원`, type: 'number' },
    { label: '신청금액', value: `${detail.aplyAmt.toLocaleString()} 원`, type: 'number' },
  ]

  return (
    <Accordion type="multiple" defaultValue={['ctrt', 'rmrk']} className="w-full">
      <AccordionSection value="ctrt" title="계약정보" borderTop={false}>
        <Table rows={ctrtRows} />
      </AccordionSection>
      {/* 비고 (dmt_birqRmrkCnInfo) — 변경내역 표시(slide56) */}
      <AccordionSection value="rmrk" title="비고">
        <p className="whitespace-pre-wrap px-4 pb-4 text-krds-body-md text-krds-text-ink">
          {detail.birqRmrkCn || '-'}
        </p>
      </AccordionSection>
    </Accordion>
  )
}
CstrnPymtClmDtl_Ctrt.displayName = 'CstrnPymtClmDtl_Ctrt'
