// 물품전자계약진행상세 - '상세정보' 탭 콘텐츠 (MUI-CT-01-T01, Figma 10020-154603). 설계서 slide24·28~29.
// 아코디언 3개(계약 상세정보 · 계약금액 · 담당자 정보) + Table — 데이터(detail)는 페이지가 조회해 주입.
// 조건부 행(설계서 slide24 표시조건): 납품일자/납품장소=물품 · 하자보수보증금율/위치=일반용역 ·
//   대여목적/반납장소=대여계약서(유형 7/J/8/K) · 리스 4항목=리스계약서(유형 5/H) — 값 있는 행만 렌더.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCmdtyElctrCtrtPrgrsDtl as CtrtDtl } from '@/types/mock/ct'

export interface CmdtyElctrCtrtPrgrsDtl_CnProps {
  detail: CtrtDtl
}

/** 값이 있을 때만 행 포함 — 조건부(계약서유형별) 항목용. */
function optionalRow(label: string, value?: string, type?: TableRow['type']): TableRow[] {
  return value === undefined || value === '' ? [] : [{ label, value, type }]
}

export function CmdtyElctrCtrtPrgrsDtl_Cn({ detail }: CmdtyElctrCtrtPrgrsDtl_CnProps) {
  // ── 계약 상세정보 (slide28 데이터영역 순서 = Figma 154603 표 순서) ──────────
  const detailRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '계약서유형', value: detail.ctrdocTpNm },
    { label: '계약명', value: detail.ctrtNm },
    { label: '판단번호', value: detail.prcmNo },
    { label: '발주기관', value: detail.orderInstNm },
    { label: '계약방법', value: detail.ctrtMthdCd },
    { label: '수의계약사유', value: detail.pvctRncd ?? '-' },
    { label: '계약진행상태', value: detail.ctrtPrgrsStcd },
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '계약기간', value: `${detail.ctrtBgngYmd} ~ ${detail.ctrtEndYmd}` },
    // 물품 계약만 — 납품일자/납품장소
    ...(detail.dlvgdsBgngYmd && detail.dlvgdsEndYmd
      ? [{ label: '납품일자', value: `${detail.dlvgdsBgngYmd} ~ ${detail.dlvgdsEndYmd}` }]
      : []),
    ...optionalRow('납품장소', detail.dlvgdsPlcNm),
    // 일반용역 계약만 — 하자보수보증금율(+위치는 dlvgdsPlcNm 공유라 물품과 동시 표시 안 됨)
    ...(detail.dfrpGrnteAmtRt !== undefined
      ? [{ label: '하자보수보증금율', value: `${detail.dfrpGrnteAmtRt} %`, type: 'number' as const }]
      : []),
    // 대여계약서(7/J/8/K)만 — 대여목적/반납장소
    ...optionalRow('대여목적', detail.rntlPrps),
    // 리스계약서(5/H)만 — 리스구분/리스료 지급기준/리스료/리스료 기준금액
    ...optionalRow('리스구분', detail.leaseSecd),
    ...optionalRow('리스료 지급기준', detail.lsfeeGiveCrtrCd),
    ...(detail.qtrLsfee !== undefined
      ? [{ label: '리스료', value: `${detail.qtrLsfee.toLocaleString()} 원`, type: 'number' as const }]
      : []),
    ...(detail.lsfeeCrtrAmt !== undefined
      ? [
          {
            label: '리스료 기준금액',
            value: `${detail.lsfeeCrtrAmt.toLocaleString()} 원`,
            type: 'number' as const,
          },
        ]
      : []),
    // 물가변동계약금액조정방법(slide24 — Figma 미노출이나 설계서 데이터영역 항목)
    ...optionalRow('물가변동계약금액 조정방법', detail.pfrAplcnMthdCd),
    // 리스계약만 — 지출관/재무관 연락처
    ...(detail.finrTelno?.[0] ? [{ label: '지출관 연락처', value: detail.finrTelno[0] }] : []),
    ...(detail.finrTelno?.[1] ? [{ label: '재무관 연락처', value: detail.finrTelno[1] }] : []),
  ]

  // ── 계약금액 (slide23·28 + Figma 154603) ──────────────────────────────────
  const amountRows: TableRow[] = [
    { label: '일반예산', value: `${detail.bscbgtCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '국채', value: `${detail.govbndCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '합계', value: `${detail.sumAmt.toLocaleString()} 원`, type: 'number' },
    ...(detail.itemSumAmt !== undefined
      ? [
          {
            label: '품목별 합계',
            value: `${detail.itemSumAmt.toLocaleString()} 원`,
            type: 'number' as const,
          },
        ]
      : []),
    { label: '총부기금액', value: `${detail.tbkpngAmt.toLocaleString()} 원`, type: 'number' },
    { label: '계약보증금', value: `${detail.grnteAmt.toLocaleString()} 원`, type: 'number' },
    { label: '지체상금률', value: `${detail.lqdmgRt} %`, type: 'number' },
  ]

  // ── 담당자 정보 (slide29 1.2) ──────────────────────────────────────────────
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
CmdtyElctrCtrtPrgrsDtl_Cn.displayName = 'CmdtyElctrCtrtPrgrsDtl_Cn'
