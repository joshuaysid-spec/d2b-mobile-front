// 착·중도금신청서상세 - '신청정보' 탭 콘텐츠 (MUI-WM-01-T03). 설계서 05.대금청구및사후 v0.83 slide30, 33.
// 아코디언 3개(공급자 정보 · 계약내용 · 신청정보) — 선금(T01)과 동형이나 계약내용에 품명·납기(최종),
// 신청정보에 신청구분(착수금/착·중도금)이 추가되고 지출원인금액이 없다(설계서 별도 데이터영역).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { DpsmnItrpyApfrDtl as ApfrDtl } from '@/types/mock/wm'

export interface DpsmnItrpyApfrDtlProps {
  detail: ApfrDtl
}

export function DpsmnItrpyApfrDtl({ detail }: DpsmnItrpyApfrDtlProps) {
  // ── 공급자 정보 (dmt_splrInfo) ────────────────────────────────────────────
  const splrRows: TableRow[] = [
    { label: '작성자명/직책', value: `${detail.wrtrNm} ${detail.wrtrJbttlNm}` },
    { label: '휴대폰번호', value: detail.wrtrEnmtno },
  ]

  // ── 계약내용 (dmt_ctrtCnInfo, slide33 1.2) ────────────────────────────────
  const ctrtRows: TableRow[] = [
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '계약번호', value: detail.ctrtNo },
    { label: '품명', value: detail.itemNm },
    { label: '계약금액(대상금액)', value: `${detail.ctrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '납기(최종)', value: detail.dudtYmd },
    { label: '비고', value: detail.mainBizCn || '-' },
  ]

  // ── 신청정보 (dmt_dpsmnItrpyApfrInfo + dmt_aplyAmtInfo, slide33 1.1·1.3) ──
  const aplyRows: TableRow[] = [
    { label: '차수', value: detail.aplyCtrtCycl },
    { label: '수신자', value: detail.rcptnOgnzCd },
    { label: '신청일자', value: detail.dmndDt },
    { label: '신청금액', value: `${detail.aplyAmt.toLocaleString()} 원`, type: 'number' },
    { label: '신청금액 (일금)', value: `₩ ${detail.aplyAmtHngl}` },
    // 신청구분 — fravItrpySecd '1':착수금 · '2':착·중도금 (slide33 1.2)
    { label: '신청구분', value: detail.fravItrpySecd === '1' ? '착수금' : '착·중도금' },
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
DpsmnItrpyApfrDtl.displayName = 'DpsmnItrpyApfrDtl'
