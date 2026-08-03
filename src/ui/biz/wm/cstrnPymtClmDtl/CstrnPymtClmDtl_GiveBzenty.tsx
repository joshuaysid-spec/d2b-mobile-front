// 대금청구상세(공사) - '대가지급업체' 탭 콘텐츠 (MUI-WM-01-T14). 설계서 slide57, 59.
// 대가지급업체 1건 = Table 반복(업체유형/업체명/신청금액/은행명/계좌번호/계좌실명번호/예금주).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CstrnPymtClmDtl, GiveBzentyItem } from '@/types/wm'

export interface CstrnPymtClmDtl_GiveBzentyProps {
  detail: CstrnPymtClmDtl
}

// 대가지급업체 1건 → 표 행 (dlt_giveBzentyList, slide59 1.2 순서).
function bzentyRows(it: GiveBzentyItem): TableRow[] {
  return [
    { label: '업체유형', value: it.fbctnSecd || '-' },
    { label: '업체명', value: it.bzentyNm },
    { label: '신청금액', value: `${it.aplyAmt.toLocaleString()} 원`, type: 'number' },
    { label: '은행명', value: it.dlngFnstNm },
    { label: '계좌번호', value: it.enacno },
    { label: '계좌실명번호', value: it.enacnoRlnm },
    { label: '예금주', value: it.dpstrNm },
  ]
}

export function CstrnPymtClmDtl_GiveBzenty({ detail }: CstrnPymtClmDtl_GiveBzentyProps) {
  return (
    <Accordion type="multiple" defaultValue={['bzenty']} className="w-full">
      <AccordionSection value="bzenty" title="대가지급업체" borderTop={false}>
        <div className="flex flex-col gap-krds-7">
          {detail.giveBzentys.map((it) => (
            <Table key={it.id} rows={bzentyRows(it)} />
          ))}
        </div>
      </AccordionSection>
    </Accordion>
  )
}
CstrnPymtClmDtl_GiveBzenty.displayName = 'CstrnPymtClmDtl_GiveBzenty'
