// 발주통보서상세 - '상세정보' 탭 콘텐츠 (MUI-EX-02-T77). 설계서 04.이행 v0.83 slide79, 81.
// 계약 정보(dm_ctrtInfo — 발주의뢰서(T75)와 유사, 신용장번호 없음) 아코디언 + Table.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsOrderNtdcDtl as NtdcDtl } from '@/types/mock/ex'

export interface OvsOrderNtdcDtlProps {
  detail: NtdcDtl
}

export function OvsOrderNtdcDtl({ detail }: OvsOrderNtdcDtlProps) {
  // ── 계약 정보 (dm_ctrtInfo, slide81 1.1 순서) ─────────────────────────────
  const ctrtRows: TableRow[] = [
    { label: '계약번호', value: detail.ctrtNo },
    { label: '발주번호', value: detail.orderSeq },
    { label: '발주일자', value: detail.orderYmd },
    { label: '유효일자', value: detail.vldYmd },
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '사업명', value: detail.bizNm },
    { label: '군구분', value: detail.prcmRqtInstCd },
    { label: '계약업체', value: detail.ctrtBzentyCd },
    { label: '군담당자', value: detail.miltPicId },
    { label: '무역대리점', value: detail.bzentyCd },
    { label: '담당자', value: detail.picId },
    { label: '화폐단위', value: detail.crncCd },
    { label: '비고', value: detail.rmrkCn || '-' },
  ]

  return (
    <Accordion type="multiple" defaultValue={['ctrt']} className="w-full">
      <AccordionSection value="ctrt" title="계약 정보" borderTop={false}>
        <Table rows={ctrtRows} />
      </AccordionSection>
    </Accordion>
  )
}
OvsOrderNtdcDtl.displayName = 'OvsOrderNtdcDtl'
