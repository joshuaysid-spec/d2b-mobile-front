// 해지/해제 수정계약 상세 - '상세정보' 탭 콘텐츠 (MUI-CT-03-T10). 설계서 slide132·135.
// 아코디언 5개(계약 상세정보 · 계약금액[증액/감액] · 추가보증금 · 업체정보 · 담당자 정보).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CncltnRmvMdfcnCtrtDtl } from '@/types/ct'

export interface CncltnRmvMdfcnCtrtDtl_CnProps {
  detail: CncltnRmvMdfcnCtrtDtl
}

export function CncltnRmvMdfcnCtrtDtl_Cn({ detail }: CncltnRmvMdfcnCtrtDtl_CnProps) {
  // ── 계약 상세정보 (slide132·135 표 순서 — 해지해제일/사유 포함) ──────────────
  const detailRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '원계약번호', value: `${detail.orgctNo} (01)` },
    { label: '원계약일자', value: detail.orgctYmd },
    { label: '품명', value: detail.rprsItemNm },
    { label: '수정계약사유', value: detail.mdfcnRncd },
    { label: '기타사항', value: detail.etcMttr ?? '-' },
    { label: '해지해제일', value: detail.cncltnRmvYmd },
    { label: '해지해제사유', value: detail.cncltnRmvRsn },
  ]

  // ── 계약금액(증액/감액) + 추가보증금(계약/차액/보증금구분) — slide132 ─────────
  const amountRows: TableRow[] = [
    { label: '증액', value: `+ ${detail.mdfcnCtrtIncrsAmt.toLocaleString()} 원`, type: 'number' },
    { label: '감액', value: `- ${detail.mdfcnCtrtCtbkAmt.toLocaleString()} 원`, type: 'number' },
  ]
  const grnteRows: TableRow[] = [
    { label: '계약', value: `${detail.grnteAmt.toLocaleString()} 원`, type: 'number' },
    { label: '차액', value: `${detail.diffAmt.toLocaleString()} 원`, type: 'number' },
    { label: '보증금구분', value: detail.depsSecd },
  ]

  // ── 업체정보 (slide131) ─────────────────────────────────────────────────────
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
      defaultValue={['detail', 'amount', 'grnte', 'bzenty', 'manager']}
      className="w-full"
    >
      <AccordionSection value="detail" title="계약 상세정보" borderTop={false}>
        <Table rows={detailRows} />
      </AccordionSection>
      <AccordionSection value="amount" title="계약금액">
        <Table rows={amountRows} />
      </AccordionSection>
      <AccordionSection value="grnte" title="추가보증금">
        <Table rows={grnteRows} />
      </AccordionSection>
      <AccordionSection value="bzenty" title="업체정보">
        <Table rows={bzentyRows} />
      </AccordionSection>
      <AccordionSection value="manager" title="담당자 정보">
        <Table rows={managerRows} />
      </AccordionSection>
    </Accordion>
  )
}
CncltnRmvMdfcnCtrtDtl_Cn.displayName = 'CncltnRmvMdfcnCtrtDtl_Cn'
