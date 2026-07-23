// 국외전자계약진행상세 - '일반현황' 탭 콘텐츠 (MUI-CT-01-T71 ovsElctrCtrtPrgrsDtlTab).
// 설계서 slide150~154. 아코디언 5개(계약 상세정보 · 계약금액 · 구매형태 · 계약 업체정보 · 담당자 정보).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsElctrCtrtDtl } from '@/types/ct'

export interface OvsElctrCtrtPrgrsDtlTabProps {
  detail: OvsElctrCtrtDtl
}

export function OvsElctrCtrtPrgrsDtlTab({ detail }: OvsElctrCtrtPrgrsDtlTabProps) {
  // ── 계약 상세정보 (slide150~151 표 순서) ───────────────────────────────────
  const detailRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '통합참조번호', value: detail.intgRfrncNo ?? '-' },
    { label: '계약건명', value: detail.ctrtNm },
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '전자계약상태', value: detail.elctrCtrtPrgrsSttsCd },
    { label: '발주기관', value: detail.orderInstNm },
    { label: '군구분', value: detail.prcmRqtInstCd ?? '-' },
    { label: '사업구분', value: detail.bizSeCd ?? '-' },
    { label: '계약업체', value: detail.ctrtBzentyCd ?? '-' },
    { label: '계약금액', value: detail.ctrtAmt ?? '-', type: 'number' },
    { label: '계약사유', value: detail.ctrtRsnCd ?? '-' },
    { label: '계약구분', value: detail.ctrtPrgrsCd ?? '-' },
    { label: '보증기간', value: detail.grntePrdDayCnt ?? '-' },
    { label: '담당자', value: detail.picId ?? '-' },
    { label: '기능구분', value: detail.fwkSeCd ?? '-' },
    { label: '일반조건코드', value: detail.gnrlCndCd ?? '-' },
    { label: '일반조건', value: detail.gnrlCndNm ?? '-' },
    { label: '무역대리점', value: detail.bzentyCd ?? '-' },
    { label: '국가', value: detail.ntnCd ?? '-' },
    { label: '물품번호', value: detail.cmdtySgn ?? '-' },
    { label: '생산자', value: detail.prdctnBzentyCd ?? '-' },
    { label: '계약방법', value: detail.ctrtMthdNm ?? '-' },
    { label: '화폐구분', value: detail.crncCd ?? '-' },
    { label: '수의사유', value: detail.pvctRsnCd ?? '-' },
    { label: '지불조건', value: detail.pymtDfryCndCd ?? '-' },
    { label: '보증금예치율', value: detail.grnteAmtDepstRt ?? '-', type: 'number' },
    { label: '가격조건', value: detail.prcCndCd ?? '-' },
    { label: '검사조건', value: detail.inspShpCd ?? '-' },
    { label: '품목수', value: detail.itemCnt ?? '-', type: 'number' },
    { label: '집행유형', value: detail.bizTypeCd ?? '-' },
    { label: '예상납기일', value: detail.expcDudtYmd ?? '-' },
    { label: '사업승인일자', value: detail.bizAprvYmd ?? '-' },
    { label: '품목군', value: detail.implTypeItemCd ?? '-' },
    { label: '최종선적일', value: detail.lastShpgYmd ?? '-' },
    { label: '절충조건', value: detail.ofstCndCd ?? '-' },
    { label: '절충사업관리번호', value: detail.ofstBizMngNo ?? '-' },
    { label: 'UN CPC', value: detail.unCpc ?? '-' },
    { label: '납기월', value: detail.dudtMm ?? '-' },
    { label: '승인일자', value: detail.aprvYmd ?? '-' },
    { label: '분할선적유무', value: detail.prttnShpgYn ?? '-' },
    { label: '분할선적횟수', value: detail.prttnShpgNmtm ?? '-', type: 'number' },
    { label: '지체한도율', value: detail.arrsLimRt ?? '-', type: 'number' },
    { label: '지체상금율', value: detail.lqdmgRt ?? '-', type: 'number' },
    { label: '감가율', value: detail.rdprcRt ?? '-', type: 'number' },
    { label: '감가금액', value: detail.rdprcAmt ?? '-', type: 'number' },
    { label: '계약보증금', value: detail.ctrtGrnteAmt ?? '-', type: 'number' },
    { label: '납부방법', value: detail.payMthdCd ?? '-' },
    { label: '운송방법', value: detail.trnsMthdCd ?? '-' },
    { label: '증권번호', value: detail.scrtNo ?? '-' },
    { label: '인지세 사용여부', value: detail.stmtxAplcnCd ?? '-' },
    { label: '인지세 금액', value: detail.stmtxPayAmt ?? '-', type: 'number' },
  ]

  // ── 계약금액 (dm_ctrtAmt — 외화/원화/달러) ─────────────────────────────────
  const amountRows: TableRow[] = [
    { label: '계약금액외화', value: detail.ctrtAmts.ctrtFrcncyAmt, type: 'number' },
    { label: '계약금액원화', value: detail.ctrtAmts.ctrtKrwAmt, type: 'number' },
    { label: '계약금액달러', value: detail.ctrtAmts.ctrtUsdAmt, type: 'number' },
  ]

  // ── 담당자 정보 ─────────────────────────────────────────────────────────────
  const managerRows: TableRow[] = detail.managers.flatMap((m) => [
    { label: '구분', value: m.tkcgSecd },
    { label: '성명/계급', value: m.picNm },
  ])

  return (
    <Accordion
      type="multiple"
      defaultValue={['detail', 'amount', 'prchs', 'bzenty', 'manager']}
      className="w-full"
    >
      <AccordionSection value="detail" title="계약 상세정보" borderTop={false}>
        <Table rows={detailRows} />
      </AccordionSection>
      <AccordionSection value="amount" title="계약금액">
        <Table rows={amountRows} />
      </AccordionSection>
      {/* 구매형태(dm_prchsShp) — AOG/URGENT/ROUTINE 별 납품기한·지체한도율·감가율 */}
      <AccordionSection value="prchs" title="구매형태">
        <div className="flex flex-col gap-krds-7">
          {detail.prchsShps.map((p) => (
            <Table
              key={p.id}
              rows={[
                { label: '구분', value: p.label },
                { label: '납품기한', value: p.dudt, type: 'number' },
                { label: '지체한도율', value: p.arrsLimRt, type: 'number' },
                { label: '감가율', value: p.rdprcRt, type: 'number' },
              ]}
            />
          ))}
        </div>
      </AccordionSection>
      {/* 계약 업체정보(dl_ctrtBzenty — 반복) */}
      <AccordionSection value="bzenty" title="계약 업체정보">
        <div className="flex flex-col gap-krds-7">
          {detail.bzentys.map((b) => (
            <Table
              key={b.id}
              rows={[
                { label: '업체명', value: b.ctrtBzentyNm },
                { label: '사업자등록번호', value: b.enbrno },
                { label: '대표자', value: b.rprsvNm },
                { label: '금융기관', value: b.fnstCd },
                { label: '예금주', value: b.dpstrNm },
                { label: '전자서명일', value: b.elsgnYmd },
                { label: '보증금납부방법', value: b.depsPayMthdCd },
                { label: '보증금액', value: b.grnteAmt, type: 'number' },
                { label: '계좌실명번호', value: b.bacntRlnmNo },
                { label: '계좌번호', value: b.enacno },
              ]}
            />
          ))}
        </div>
      </AccordionSection>
      <AccordionSection value="manager" title="담당자 정보">
        <Table rows={managerRows} />
      </AccordionSection>
    </Accordion>
  )
}
OvsElctrCtrtPrgrsDtlTab.displayName = 'OvsElctrCtrtPrgrsDtlTab'
