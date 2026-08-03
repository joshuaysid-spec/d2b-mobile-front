// 기성및준공검사상세 - '상세정보' 탭 콘텐츠 (MUI-EX-01-M04). 설계서 04.이행 v0.83 slide27~28.
// 아코디언 3개(계약 상세정보 · 검사관 · 감독관) + Table — 데이터(detail)는 페이지가 조회해 주입.
// 계약 상세정보 순서는 slide27 화면 목업(계약번호~검사일자 + 기성금액~준공내용) 그대로.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { PxcndCmcnInspDtl as InspDtl } from '@/types/ex'

export interface PxcndCmcnInspDtlProps {
  detail: InspDtl
}

export function PxcndCmcnInspDtl({ detail }: PxcndCmcnInspDtlProps) {
  // ── 계약 상세정보 (dmt_CtrtInfo, slide28 1.1) ─────────────────────────────
  const detailRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '계약금액', value: `${detail.ctrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '계약명', value: detail.ctrtNm },
    { label: '기성차수', value: detail.pxcndCycl },
    { label: '검사구분', value: detail.pxcndCmcnSecd },
    { label: '검사일자', value: detail.inspYmd },
    { label: '기성금액', value: `${detail.pxcndAmt.toLocaleString()} 원`, type: 'number' },
    { label: '기성율', value: `${detail.pxcndRt} %`, type: 'number' },
    { label: '착공일자', value: detail.bgncstYmd },
    { label: '실 준공일자', value: detail.rlccYmd },
    { label: '준공기한', value: detail.cmcnTermYmd },
    { label: '준공계 제출일자', value: detail.cmdocSbmsnYmd },
    { label: '준공내용', value: detail.cmcnCn },
  ]

  // ── 검사관 (dmt_Insptr) / 감독관 (dmt_Sprv) — 소속 + 성명/계급 반복 ────────
  const insptrRows: TableRow[] = detail.insptrs.flatMap((m) => [
    { label: '소속', value: m.insptrOgdpNm },
    { label: '성명/계급', value: `${m.insptrNm} ${m.insptrEchlnNm}` },
  ])
  const sprvRows: TableRow[] = detail.sprvs.flatMap((m) => [
    { label: '소속', value: m.sprvOgdpNm },
    { label: '성명/계급', value: `${m.sprvNm} ${m.sprvEchlnNm}` },
  ])

  return (
    <Accordion type="multiple" defaultValue={['detail', 'insptr', 'sprv']} className="w-full">
      <AccordionSection value="detail" title="계약 상세정보" borderTop={false}>
        <Table rows={detailRows} />
      </AccordionSection>
      {/* 섹션 타이틀 "검사관/감독관 - 총 N건"(slide27) — 아코디언 타이틀 + 건수 라인으로 구성 */}
      <AccordionSection value="insptr" title="검사관">
        <div className="flex flex-col gap-krds-5">
          <p className="px-4 text-krds-body-sm text-krds-text-primary-active">
            총 {detail.insptrs.length}건
          </p>
          <Table rows={insptrRows} />
        </div>
      </AccordionSection>
      <AccordionSection value="sprv" title="감독관">
        <div className="flex flex-col gap-krds-5">
          <p className="px-4 text-krds-body-sm text-krds-text-primary-active">
            총 {detail.sprvs.length}건
          </p>
          <Table rows={sprvRows} />
        </div>
      </AccordionSection>
    </Accordion>
  )
}
PxcndCmcnInspDtl.displayName = 'PxcndCmcnInspDtl'
