// 해지/해제 공사계약 상세 - '상세정보' 탭 콘텐츠 (MUI-CT-03-T13). 설계서 slide141·143.
// 아코디언 3개(계약 상세정보 · 계약금액 · 담당자 정보).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CstrnCncltnRmvDtl } from '@/types/mock/ct'

export interface CstrnCtrtCncltnRmvDtl_CnProps {
  detail: CstrnCncltnRmvDtl
}

export function CstrnCtrtCncltnRmvDtl_Cn({ detail }: CstrnCtrtCncltnRmvDtl_CnProps) {
  // ── 계약 상세정보 (slide141·143 표 순서) ────────────────────────────────────
  const detailRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '계약건명', value: detail.ctrtNm },
    { label: '공사번호', value: detail.prcmNo },
    { label: '장/단기 구분', value: detail.lshtmSecd },
    { label: '수의계약사유', value: detail.pvctRncd ?? '-' },
    { label: '계약진행상태', value: detail.ctrtPrgrsStcd },
    { label: '착공년월일', value: detail.bgncstYmd },
    { label: '준공연월일', value: detail.cmcnYmd },
    { label: '기타사항', value: detail.etcMttr ?? '-' },
    { label: '해지해제구분', value: detail.cncltnRmvSecd },
    { label: '해지해제일자', value: detail.cncltnRmvYmd },
    { label: '해지해제확정사유', value: detail.cncltnRmvCfmtnRsn },
    { label: '물가변동계약금 조정방법', value: detail.pfrAplcnMthdCd ?? '-' },
  ]

  // ── 계약금액 (일반예산/국채/합계/품목별 합계/총공사부기금액/계약보증금/지체상금률) ──
  const amountRows: TableRow[] = [
    { label: '일반예산', value: `${detail.bscbgtCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '국채', value: `${detail.govbndCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '합계', value: `${detail.sumAmt.toLocaleString()} 원`, type: 'number' },
    { label: '품목별 합계', value: `${detail.itemSumAmt.toLocaleString()} 원`, type: 'number' },
    {
      label: '총공사부기금액',
      value: `${detail.tcstrnBkpngAmt.toLocaleString()} 원`,
      type: 'number',
    },
    { label: '계약보증금', value: `${detail.grnteAmt.toLocaleString()} 원`, type: 'number' },
    { label: '지체상금률', value: `${detail.lqdmgRt} %`, type: 'number' },
  ]

  // ── 담당자 정보 (slide141 — 구분 + 부대/성명/계급) ────────────────────────────
  const managerRows: TableRow[] = detail.managers.flatMap((m) => [
    { label: '구분', value: m.tkcgSecd },
    { label: '부대/성명/계급', value: m.picNm },
  ])

  return (
    <Accordion type="multiple" defaultValue={['detail', 'amount', 'manager']} className="w-full">
      <AccordionSection value="detail" title="계약 상세정보" borderTop={false}>
        <Table rows={detailRows} />
      </AccordionSection>
      <AccordionSection value="amount" title="계약금액">
        <Table rows={amountRows} />
      </AccordionSection>
      <AccordionSection value="manager" title="담당자 정보">
        <Table rows={managerRows} />
      </AccordionSection>
    </Accordion>
  )
}
CstrnCtrtCncltnRmvDtl_Cn.displayName = 'CstrnCtrtCncltnRmvDtl_Cn'
