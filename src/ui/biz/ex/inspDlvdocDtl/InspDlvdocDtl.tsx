// 검사및납품조서상세(중앙조달) - '상세정보' 탭 콘텐츠 (MUI-EX-01-T01). 설계서 04.이행 v0.83 slide18, 20.
// 아코디언 2개(계약 상세정보 · 비고) + Table — 데이터(detail)는 페이지가 조회해 주입.
// 항목 순서는 slide18 화면 목업(계약번호/통지번호/예산구분/납기/납지/납품요구일시) 그대로.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { InspDlvdocDtl as DlvdocDtl } from '@/types/ex'

export interface InspDlvdocDtlProps {
  detail: DlvdocDtl
}

export function InspDlvdocDtl({ detail }: InspDlvdocDtlProps) {
  // ── 계약 상세정보 (dmt_CtrtInfo, slide20 1.1) ─────────────────────────────
  const detailRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '통지번호', value: detail.avtsmtNo },
    { label: '예산구분', value: detail.bgtSecdNm },
    { label: '납기', value: detail.dudtYmd },
    { label: '납지', value: detail.plcdlvNm },
    { label: '납품요구일시', value: detail.dlvgdsDmndDt },
  ]

  return (
    <Accordion type="multiple" defaultValue={['detail', 'rmrk']} className="w-full">
      <AccordionSection value="detail" title="계약 상세정보" borderTop={false}>
        <Table rows={detailRows} />
      </AccordionSection>
      {/* 비고 (dmt_Rmrk, slide20 1.3) — 라벨 없는 본문 표시 영역 */}
      <AccordionSection value="rmrk" title="비고">
        <p className="whitespace-pre-wrap px-4 pb-4 text-krds-body-md text-krds-text-ink">
          {detail.rmrkCn || '-'}
        </p>
      </AccordionSection>
    </Accordion>
  )
}
InspDlvdocDtl.displayName = 'InspDlvdocDtl'
