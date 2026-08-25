// 해지/해제 물품일반계약 상세 - '상세정보' 탭 콘텐츠 (MUI-CT-03-T01). 설계서 slide109·112.
// 아코디언 3개(계약 상세정보 · 계약금액 · 담당자 정보) — 데이터(detail)는 페이지가 조회해 주입.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCmdtyCncltnRmvDtl } from '@/types/mock/ct'

export interface CmdtyCtrtCncltnRmvDtl_CnProps {
  detail: MockCmdtyCncltnRmvDtl
}

export function CmdtyCtrtCncltnRmvDtl_Cn({ detail }: CmdtyCtrtCncltnRmvDtl_CnProps) {
  // ── 계약 상세정보 (slide109·112 표 순서) ────────────────────────────────────
  const detailRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '계약서유형', value: detail.ctrdocTpcd },
    { label: '계약명', value: detail.ctrtNm },
    { label: '판단번호', value: detail.prcmNo },
    { label: '발주기관', value: detail.orderInstNm },
    { label: '계약방법', value: detail.ctrtMthdCd },
    { label: '수의계약사유', value: detail.pvctRncd ?? '-' },
    { label: '계약진행상태', value: detail.ctrtPrgrsStcd },
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '계약기간', value: `${detail.ctrtBgngYmd} ~ ${detail.ctrtEndYmd}` },
    { label: '해지해제구분', value: detail.cncltnRmvSecd },
    { label: '해지해제일자', value: detail.cncltnRmvYmd },
    { label: '해지해제사유', value: detail.cncltnRmvRsn },
    { label: '물가변동계약금액 조정방법', value: detail.pfrAplcnMthdCd ?? '-' },
  ]

  // ── 계약금액 (본조/국채/합계/총제조부기금액/계약보증금/지체상금율, slide109) ────
  const amountRows: TableRow[] = [
    { label: '본조', value: `${detail.bscbgtCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '국채', value: `${detail.govbndCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '합계', value: `${detail.sumAmt.toLocaleString()} 원`, type: 'number' },
    {
      label: '총제조부기금액',
      value: `${detail.tbkpngAmt.toLocaleString()} 원`,
      type: 'number',
    },
    { label: '계약보증금', value: `${detail.grnteAmt.toLocaleString()} 원`, type: 'number' },
    { label: '지체상금율', value: `${detail.lqdmgRt} %`, type: 'number' },
  ]

  // ── 담당자 정보 (slide112 1.2) ──────────────────────────────────────────────
  const managerRows: TableRow[] = detail.managers.flatMap((m) => [
    { label: '구분', value: m.tkcgSecd },
    { label: '성명/계급', value: m.picNm },
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
CmdtyCtrtCncltnRmvDtl_Cn.displayName = 'CmdtyCtrtCncltnRmvDtl_Cn'
