// 견적의뢰서상세 - '상세정보' 탭 콘텐츠 (MUI-EX-02-T71). 설계서 04.이행 v0.83 slide49, 52.
// 계약 정보(dm_ctrtInfo) 아코디언 + Table — 데이터(detail)는 페이지가 조회해 주입.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockOvsEstmtRqdcDtl as RqdcDtl } from '@/types/mock/ex'

export interface OvsEstmtRqdcDtlProps {
  detail: RqdcDtl
}

export function OvsEstmtRqdcDtl({ detail }: OvsEstmtRqdcDtlProps) {
  // ── 계약 정보 (dm_ctrtInfo, slide52 1.1 순서) ─────────────────────────────
  const ctrtRows: TableRow[] = [
    { label: '계약번호', value: detail.ctrtNo },
    { label: '견적번호', value: detail.clmSeq },
    { label: '견적일자', value: detail.clmYmd },
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
OvsEstmtRqdcDtl.displayName = 'OvsEstmtRqdcDtl'
