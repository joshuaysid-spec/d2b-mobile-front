// 대금청구 상세(중앙조달) - '대금신청금액' 탭 콘텐츠 (MUI-WM-01-T07). 설계서 05.대금청구및사후 v0.83 slide41, 44.
// 대금신청 금액 Table — 첫 행 라벨은 일자구분(ymdSeCd I:합격일자/D:납품일자)으로 갈리고,
// 세액여부(vatSecd) 없음(B)이면 세액 항목을 '-' 로 표기(slide41 4-1).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCenterPrcmPymtClmDtl } from '@/types/mock/wm'

export interface CenterPrcmPymtClmDtl_PymtProps {
  detail: MockCenterPrcmPymtClmDtl
}

export function CenterPrcmPymtClmDtl_Pymt({ detail }: CenterPrcmPymtClmDtl_PymtProps) {
  const vatFree = detail.vatSecd === 'B' // 세액여부 없음 → 세액 '-' 표기
  const won = (n: number) => `${n.toLocaleString()} 원`

  // ── 대금신청금액 (dmt_pymtAplyAmtInfo, slide44 1.4 순서) ──────────────────
  const pymtRows: TableRow[] = [
    // 일자구분 — I:합격월(합격일자) · D:납품월(납품일자)
    { label: detail.ymdSeCd === 'I' ? '합격일자' : '납품일자', value: detail.aplyYmd },
    { label: '세액여부', value: vatFree ? '없음' : '있음' },
    { label: '납품금액', value: won(detail.dlvgdsAmt), type: 'number' },
    { label: '공급가액', value: won(detail.dlvgdsSplyEqvl), type: 'number' },
    { label: '세액', value: vatFree ? '-' : won(detail.dlvgdsTxamt), type: 'number' },
    { label: '공제금액', value: won(detail.ddcAmt), type: 'number' },
    { label: '공급가액', value: won(detail.ddcSplyEqvl), type: 'number' },
    { label: '세액', value: vatFree ? '-' : won(detail.ddcTxamt), type: 'number' },
    { label: '공제내역', value: detail.ddcDsctnNm || '-' },
    { label: '청구금액', value: won(detail.clmAmt), type: 'number' },
    { label: '면제원제출', value: detail.exmptnSbmsnYn === 'Y' ? '제출' : '-' },
    { label: '보증보험증권제출', value: detail.grnteInsrncScrtSbmsnYn === 'Y' ? '제출' : '-' },
    { label: '비고', value: detail.rmrkCn || '-' },
  ]

  return (
    <Accordion type="multiple" defaultValue={['pymt']} className="w-full">
      <AccordionSection value="pymt" title="대금신청 금액" borderTop={false}>
        <Table rows={pymtRows} />
      </AccordionSection>
    </Accordion>
  )
}
CenterPrcmPymtClmDtl_Pymt.displayName = 'CenterPrcmPymtClmDtl_Pymt'
