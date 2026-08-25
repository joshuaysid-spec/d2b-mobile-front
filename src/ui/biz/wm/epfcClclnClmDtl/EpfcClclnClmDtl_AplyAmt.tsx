// 사후정산청구상세 - '신청금액(신청내역)' 탭 콘텐츠 (MUI-WM-01-T21). 설계서 slide74~75, 77.
// 신청정보(차수/수신자/신청일자) + 금액구분별 신청내역 반복 + 신청금액(일금/일금 한글/지출원인금액).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { EpfcAplyDsctnItem, EpfcClclnClmDtl } from '@/types/mock/wm'

export interface EpfcClclnClmDtl_AplyAmtProps {
  detail: EpfcClclnClmDtl
}

// 구분 1건 → 표 행 (dmt_aplyDsctnInfo, slide74 목업 순서).
function dsctnRows(it: EpfcAplyDsctnItem): TableRow[] {
  return [
    { label: '대상금액', value: `${it.trgtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '신청금액 - 기사용', value: `${it.arusAplyAmt.toLocaleString()} 원`, type: 'number' },
    {
      label: '신청금액 - 사용예정',
      value: `${it.usePrnmntAplyAmt.toLocaleString()} 원`,
      type: 'number',
    },
    { label: '신청금액 - 계', value: `${it.aplySumAmt.toLocaleString()} 원`, type: 'number' },
    { label: '신청금액의 비율', value: `${it.aplyAmtRt} %`, type: 'number' },
  ]
}

export function EpfcClclnClmDtl_AplyAmt({ detail }: EpfcClclnClmDtl_AplyAmtProps) {
  // ── 신청정보 (dmt_epfcClclnClmDocCyclInfo, slide77 1.1) ───────────────────
  const aplyRows: TableRow[] = [
    { label: '차수', value: detail.aplyCtrtCycl },
    { label: '수신자', value: detail.rcptnOgnzCd },
    { label: '신청일자', value: detail.aplyYmd },
  ]

  // ── 신청금액 (dmt_aplyAmtInfo, slide77 1.3 + slide74 하단) ────────────────
  const amtRows: TableRow[] = [
    { label: '일금', value: `${detail.aplyAmt.toLocaleString()} 원`, type: 'number' },
    { label: '일금 (한글)', value: `₩ ${detail.aplyAmtHngl}` },
    { label: '지출원인금액', value: `${detail.expndCsAmt.toLocaleString()} 원`, type: 'number' },
  ]

  return (
    <Accordion type="multiple" defaultValue={['aply', 'dsctn', 'amt']} className="w-full">
      <AccordionSection value="aply" title="신청정보" borderTop={false}>
        <Table rows={aplyRows} />
      </AccordionSection>
      <AccordionSection value="dsctn" title="신청내역">
        <div className="flex flex-col gap-krds-8">
          {detail.aplyDsctns.map((it) => (
            <div key={it.id} className="flex flex-col gap-krds-5">
              <p className="text-[17px] font-bold leading-normal text-krds-text-ink">
                {it.aplySeCd}
              </p>
              <Table rows={dsctnRows(it)} />
            </div>
          ))}
        </div>
      </AccordionSection>
      <AccordionSection value="amt" title="신청금액">
        <Table rows={amtRows} />
      </AccordionSection>
    </Accordion>
  )
}
EpfcClclnClmDtl_AplyAmt.displayName = 'EpfcClclnClmDtl_AplyAmt'
