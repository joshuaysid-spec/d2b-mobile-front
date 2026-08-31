// 해지/해제 일반총액제계약 상세 - '상세정보' 탭 콘텐츠 (MUI-CT-03-T04). 설계서 slide116·119~120.
// 아코디언 4개(계약 상세정보 · 계약금액 · 업체정보 · 담당자 정보).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCncltnRmvGnrlCtrtDtl } from '@/types/mock/ct'

export interface CncltnRmvGnrlCtrtGramtDtl_CnProps {
  detail: MockCncltnRmvGnrlCtrtDtl
}

export function CncltnRmvGnrlCtrtGramtDtl_Cn({ detail }: CncltnRmvGnrlCtrtGramtDtl_CnProps) {
  // ── 계약 상세정보 (slide116·119 표 순서) ────────────────────────────────────
  const detailRows: TableRow[] = [
    { label: '물품명', value: detail.rprsItemNm },
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '공고번호', value: detail.pbancNo },
    { label: '입찰방법', value: detail.bidMthdCd },
    { label: '계약방법', value: detail.ctrtMthdCd },
    { label: '납품일자', value: detail.dlvgdsYmd ?? '-' },
    { label: '납품장소', value: detail.dlvgdsPlcNm ?? '-' },
    { label: '기타사항', value: detail.etcMttr ?? '-' },
    { label: '해지해제일', value: detail.cncltnRmvYmd },
    { label: '해지해제사유', value: detail.cncltnRmvRsn },
    { label: '물가변동율 적용방법', value: detail.pfrAplcnMthdCd ?? '-' },
    { label: '납부방법', value: detail.payMthdCd ?? '-' },
  ]

  // ── 계약금액 (본조/국채/합계/총제조부기금액/계약보증금/지체상금율) ────────────
  const amountRows: TableRow[] = [
    { label: '본조', value: `${detail.bscbgtCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '국채', value: `${detail.govbndCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '합계', value: `${detail.sumAmt.toLocaleString()} 원`, type: 'number' },
    { label: '총제조부기금액', value: `${detail.tbkpngAmt.toLocaleString()} 원`, type: 'number' },
    { label: '계약보증금', value: `${detail.grnteAmt.toLocaleString()} 원`, type: 'number' },
    { label: '지체상금율', value: `${detail.lqdmgRt} %`, type: 'number' },
  ]

  // ── 업체정보 (slide116) ─────────────────────────────────────────────────────
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
      <AccordionSection value="bzenty" title="업체정보">
        <Table rows={bzentyRows} />
      </AccordionSection>
      <AccordionSection value="manager" title="담당자 정보">
        <Table rows={managerRows} />
      </AccordionSection>
    </Accordion>
  )
}
CncltnRmvGnrlCtrtGramtDtl_Cn.displayName = 'CncltnRmvGnrlCtrtGramtDtl_Cn'
