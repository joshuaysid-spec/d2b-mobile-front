// 대금지불정보조회 풀팝업 — MUI-CT-01-P16 PymtDfryInfoInq. 설계서 slide102~103.
// 대금지불정보목록(M15) 카드 클릭 → 해당 계약의 지불 상세 내역 조회.
// 구성: 대금지불정보(총 N건, 반복 Table) + footer 닫기.
import { usePymtDfryInfoInq } from '@/queries/ct'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { PymtDfryInfoInqItem } from '@/types/ct'

export interface PymtDfryInfoInqFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 조회 대상 계약번호 — 목록 카드에서 주입. */
  ctrtNo: string
}

// 지불 내역 1건 → 표 행(slide102 결과 데이터 영역 순서).
function inqRows(it: PymtDfryInfoInqItem): TableRow[] {
  return [
    { label: '지출일자', value: it.expndYmd },
    { label: '계약번호', value: it.ctrtNo },
    { label: '지출관증빙번호', value: it.dsbofrEvdncNo },
    { label: '지출금', value: `${it.expndAmt.toLocaleString()} 원`, type: 'number' },
    { label: '업체명', value: it.bzentyNm },
    { label: '반납구분', value: it.rtnSe ?? '-' },
  ]
}

export function PymtDfryInfoInqFullPopup({
  open,
  onOpenChange,
  ctrtNo,
}: PymtDfryInfoInqFullPopupProps) {
  const { data: items = [] } = usePymtDfryInfoInq(ctrtNo, open)

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="대금지불정보조회"
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col gap-8 pb-8">
        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3" info={`총 ${items.length}건`}>
            대금지불정보
          </SectionTitle>
          <div className="flex flex-col gap-krds-7 px-4">
            {items.map((it) => (
              <Table key={it.id} rows={inqRows(it)} />
            ))}
          </div>
        </section>
      </div>
    </FullPopup>
  )
}
PymtDfryInfoInqFullPopup.displayName = 'PymtDfryInfoInqFullPopup'
