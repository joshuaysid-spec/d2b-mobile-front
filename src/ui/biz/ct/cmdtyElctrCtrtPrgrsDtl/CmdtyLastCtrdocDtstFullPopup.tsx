// 물품최종계약명세서 풀팝업 — MUI-CT-01-P12 CmdtyLastCtrdocDtst. 설계서 slide91~92.
// 계약확정 상세(M04 = M03 화면 겸용)의 바로가기 '계약명세서'에서 진입(계약상태 확정 시 P11 대신).
// 구성: 계약품목정보(총 N건, 품목별 반복 Table) + footer 닫기 — 계약정보 섹션 없음(slide91).
import { ctQueries } from '@/queries/bds/ct/ctQueries'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CtrtLastDtstItem } from '@/types/ct'

export interface CmdtyLastCtrdocDtstFullPopupProps {
  /** 계약 식별자 — 부모 상세 페이지가 navigate state 에서 받아 전달. */
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 품목 1건 → 표 행(slide92 계약품목정보 순서).
function itemRows(it: CtrtLastDtstItem): TableRow[] {
  return [
    { label: '계약번호', value: it.ctrtNo },
    { label: '조달요구번호', value: it.prcmRqtNo },
    { label: '재고번호', value: it.invtNo },
    { label: '품명', value: it.fscCd },
    { label: '계약수량', value: it.ctrtQty.toLocaleString(), type: 'number' },
    { label: '계약단가', value: `${it.ctrtUntprc.toLocaleString()} 원`, type: 'number' },
    { label: '계약금액', value: `${it.ctrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '납기', value: it.dudt },
    { label: '납지', value: it.plcdlv },
    { label: '납기납지별수량', value: it.plcdlvQty.toLocaleString(), type: 'number' },
  ]
}

export function CmdtyLastCtrdocDtstFullPopup({
  id,
  open,
  onOpenChange,
}: CmdtyLastCtrdocDtstFullPopupProps) {
  const { data: items = [] } = ctQueries.useSelectCtrtLastDtst(id, open)

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="물품최종계약명세서"
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col gap-8 pb-8">
        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3" info={`총 ${items.length}건`}>
            계약품목정보
          </SectionTitle>
          <div className="flex flex-col gap-krds-7 px-4">
            {items.map((it) => (
              <Table key={it.id} rows={itemRows(it)} />
            ))}
          </div>
        </section>
      </div>
    </FullPopup>
  )
}
CmdtyLastCtrdocDtstFullPopup.displayName = 'CmdtyLastCtrdocDtstFullPopup'
