// 공사계약서상세 - '상세정보' 탭 콘텐츠 (MUI-CT-01-T19). 설계서 slide70·73~74.
// 아코디언 4개(계약 상세정보 · 계약금액 · 계약대상자 · 담당자 정보).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCstrnCtrdocDtl } from '@/types/mock/ct'

export interface CstrnCtrdocDtl_CnProps {
  detail: MockCstrnCtrdocDtl
}

export function CstrnCtrdocDtl_Cn({ detail }: CstrnCtrdocDtl_CnProps) {
  // ── 계약 상세정보 (slide70 표 순서) ────────────────────────────────────────
  const detailRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '계약유형', value: detail.fcltLbsvcSecd },
    { label: '계약건명', value: detail.ctrtNm },
    { label: '공사번호', value: detail.prcmNo },
    { label: '발주처', value: detail.orderInstNm },
    { label: '계약방법', value: detail.ctrtMthdCd },
    { label: '수의계약사유', value: detail.pvctRncd ?? '-' },
    { label: '납부방법', value: detail.depsPayMthdCd ?? '-' },
    { label: '착공년월일', value: detail.bgncstYmd },
    { label: '준공년월일', value: detail.cmcnYmd },
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '기타사항', value: detail.etcMttr ?? '-' },
    { label: '물가변동계약금액 조정방법', value: detail.pfrAplcnMthdCd ?? '-' },
  ]

  // ── 계약금액 (본조/국채/합계/총제조부기금액/계약보증금/지체상금율) ────────────
  const amountRows: TableRow[] = [
    { label: '본조', value: `${detail.bscbgtCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '국채', value: `${detail.govbndCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '합계', value: `${detail.sumAmt.toLocaleString()} 원`, type: 'number' },
    {
      label: '총제조부기금액',
      value: `${detail.tcstrnBkpngAmt.toLocaleString()} 원`,
      type: 'number',
    },
    { label: '계약보증금', value: `${detail.grnteAmt.toLocaleString()} 원`, type: 'number' },
    { label: '지체상금율', value: `${detail.lqdmgRt} %`, type: 'number' },
  ]

  // ── 계약대상자 (slide70) ────────────────────────────────────────────────────
  const bzentyRows: TableRow[] = [
    { label: '상호', value: detail.bzenty.bzentyNm },
    { label: '사업자등록번호', value: detail.bzenty.brno },
    { label: '대표자', value: detail.bzenty.rprsvNm },
    { label: '전화번호', value: detail.bzenty.telno },
    { label: '주소', value: detail.bzenty.bzentyAddr },
    { label: '금융기관', value: detail.bzenty.fnstCd },
    { label: '계좌번호', value: detail.bzenty.actno },
    { label: '예금주', value: detail.bzenty.dpstrNm },
  ]

  const managerRows: TableRow[] = detail.managers.flatMap((m) => [
    { label: '구분', value: m.tkcgSecd },
    { label: '성명/계급', value: m.picNm },
  ])

  return (
    <Accordion
      type="multiple"
      defaultValue={['detail', 'amount', 'bzenty', 'manager']}
      className="w-full"
    >
      <AccordionSection value="detail" title="계약 상세정보" borderTop={false}>
        <Table rows={detailRows} />
      </AccordionSection>
      <AccordionSection value="amount" title="계약금액">
        <Table rows={amountRows} />
      </AccordionSection>
      <AccordionSection value="bzenty" title="계약대상자">
        <Table rows={bzentyRows} />
      </AccordionSection>
      <AccordionSection value="manager" title="담당자 정보">
        <Table rows={managerRows} />
      </AccordionSection>
    </Accordion>
  )
}
CstrnCtrdocDtl_Cn.displayName = 'CstrnCtrdocDtl_Cn'
