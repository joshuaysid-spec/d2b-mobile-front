// 대금청구상세(부대조달) - '계약정보' 탭 콘텐츠 (MUI-WM-01-T09). 설계서 05.대금청구및사후 v0.83 slide47, 52.
// 아코디언 2개(계약정보 · 대금신청대상) — 대금신청대상은 통지 건별 Table 반복.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockSbsdPrcmPymtClmDtl, MockSbsdPymtAplyTrgtItem } from '@/types/mock/wm'

export interface SbsdPrcmPymtClmDtl_CtrtProps {
  detail: MockSbsdPrcmPymtClmDtl
}

// 대금신청대상 1건 → 표 행 (dlt_pymtAplyTrgtList, slide52 1.2 순서).
function trgtRows(it: MockSbsdPymtAplyTrgtItem): TableRow[] {
  return [
    { label: '통지번호', value: it.avtsmtNo },
    { label: '조서발행번호', value: it.recrdPblcnNo },
    { label: '합격일자', value: it.rcpmDt },
    { label: '납품일자', value: it.dlvgdsYmd ?? '-' },
    { label: '예산구분', value: it.bgtCd },
    { label: '금액', value: `${it.dlvgdsAmt.toLocaleString()} 원`, type: 'number' },
    { label: '감액', value: `${it.ctbkAmt.toLocaleString()} 원`, type: 'number' },
    { label: '지체상금', value: `${it.lqdmg.toLocaleString()} 원`, type: 'number' },
  ]
}

export function SbsdPrcmPymtClmDtl_Ctrt({ detail }: SbsdPrcmPymtClmDtl_CtrtProps) {
  // ── 계약정보 (dmt_ctrtInfo, slide52 1.1) ──────────────────────────────────
  const ctrtRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} - ${detail.ctrtCycl}` },
    { label: '계약명', value: detail.ctrtNm },
    { label: '신청일자', value: detail.aplyYmd },
    { label: '계약금액', value: `${detail.ctrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '대금신청번호', value: detail.birqNo },
  ]

  return (
    <Accordion type="multiple" defaultValue={['ctrt', 'trgt']} className="w-full">
      <AccordionSection value="ctrt" title="계약정보" borderTop={false}>
        <Table rows={ctrtRows} />
      </AccordionSection>
      <AccordionSection value="trgt" title="대금신청대상">
        <div className="flex flex-col gap-krds-7">
          {detail.pymtAplyTrgts.map((it) => (
            <Table key={it.id} rows={trgtRows(it)} />
          ))}
        </div>
      </AccordionSection>
    </Accordion>
  )
}
SbsdPrcmPymtClmDtl_Ctrt.displayName = 'SbsdPrcmPymtClmDtl_Ctrt'
