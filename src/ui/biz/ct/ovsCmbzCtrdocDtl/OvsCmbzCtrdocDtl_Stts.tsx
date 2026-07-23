// 상업계약서상세 - '계약현황' 탭 콘텐츠 (MUI-CT-01-T77 ovsCmbzCtrdocDtl_Stts). 설계서 slide179·182.
// 아코디언 5개(계약 현황 · 계약금액(외화) · 계약금액(원화) · 계약 추가 정보 · 계약 안내 사항).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsCmbzCtrdocDtl } from '@/types/ct'

export interface OvsCmbzCtrdocDtl_SttsProps {
  detail: OvsCmbzCtrdocDtl
}

export function OvsCmbzCtrdocDtl_Stts({ detail }: OvsCmbzCtrdocDtl_SttsProps) {
  // ── 계약 현황 (slide179 표 순서) ───────────────────────────────────────────
  const sttsRows: TableRow[] = [
    { label: '계약담당부서', value: detail.ofcctrDeptNm },
    { label: '담당자성명', value: detail.picNm },
    { label: '계약번호', value: detail.ctrtNo },
    { label: 'P.R.NO.', value: detail.prchsDmndNo },
    { label: '품목명', value: detail.itemNm },
    { label: '사업구분', value: detail.bizSeCd },
    { label: '계약방법', value: detail.ctrtMthdNm },
    { label: '계약형태', value: detail.ctrtShpCd },
    { label: '화폐단위', value: detail.crncCd },
  ]

  // ── 계약금액(외화/원화) — 본조/당년국채/장기국채/계 ─────────────────────────
  const frcncyRows: TableRow[] = [
    { label: '본조', value: detail.frcncyAmts.bscbgtFrcncyAmt, type: 'number' },
    { label: '당년국채', value: detail.frcncyAmts.thsyrGovbndFrcncyAmt, type: 'number' },
    { label: '장기국채', value: detail.frcncyAmts.ltrmGovbndFrcncyAmt, type: 'number' },
    { label: '계', value: detail.frcncyAmts.gramtFrcncy, type: 'number' },
  ]
  const krwRows: TableRow[] = [
    { label: '본조', value: detail.krwAmts.bscbgtAmt, type: 'number' },
    { label: '당년국채', value: detail.krwAmts.thsyrGovbndAmt, type: 'number' },
    { label: '장기국채', value: detail.krwAmts.ltrmGovbndAmt, type: 'number' },
    { label: '계', value: detail.krwAmts.gramt, type: 'number' },
  ]

  // ── 계약 추가 정보 (slide179) ──────────────────────────────────────────────
  const addRows: TableRow[] = [
    { label: '계약보증금', value: detail.addInfo.ctrtGrnteAmt, type: 'number' },
    { label: '계약보증금율', value: detail.addInfo.ctrtGrnteAmtRt, type: 'number' },
    { label: '지체상금율', value: detail.addInfo.lqdmgRt, type: 'number' },
    { label: '선급금', value: detail.addInfo.prpamt, type: 'number' },
    { label: '선급금율', value: detail.addInfo.prpamtRt, type: 'number' },
    { label: '품질보증기간', value: detail.addInfo.qltyGrntePrd },
    { label: '운송방법', value: detail.addInfo.trnsMthdCd },
    { label: '선적지', value: detail.addInfo.shplc },
    { label: '가격조건', value: detail.addInfo.prcCndCd },
    { label: '최종납기일(예상)', value: detail.addInfo.lastDudtYmd },
    { label: '검사조건', value: detail.addInfo.inspShpCd ?? '-' },
    { label: '분할선적횟수', value: detail.addInfo.prttnShpgNmtm ?? '-', type: 'number' },
  ]

  return (
    <Accordion
      type="multiple"
      defaultValue={['stts', 'frcncy', 'krw', 'add', 'guide']}
      className="w-full"
    >
      <AccordionSection value="stts" title="계약 현황" borderTop={false}>
        <Table rows={sttsRows} />
      </AccordionSection>
      <AccordionSection value="frcncy" title="계약금액">
        <Table rows={frcncyRows} />
      </AccordionSection>
      <AccordionSection value="krw" title="계약금액 (원화)">
        <Table rows={krwRows} />
      </AccordionSection>
      <AccordionSection value="add" title="계약 추가 정보">
        <Table rows={addRows} />
      </AccordionSection>
      {/* 계약 안내 사항 — 고정문 + 붙임서류(slide179) */}
      <AccordionSection value="guide" title="계약 안내 사항">
        <div className="flex flex-col gap-krds-5">
          <p className="text-krds-body-md text-krds-text-ink">{detail.guideCn}</p>
          <div className="text-krds-body-md text-krds-text-ink">
            <p className="font-bold">붙임서류 :</p>
            <ol className="list-decimal pl-6">
              {detail.attachedDocs.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ol>
          </div>
        </div>
      </AccordionSection>
    </Accordion>
  )
}
OvsCmbzCtrdocDtl_Stts.displayName = 'OvsCmbzCtrdocDtl_Stts'
