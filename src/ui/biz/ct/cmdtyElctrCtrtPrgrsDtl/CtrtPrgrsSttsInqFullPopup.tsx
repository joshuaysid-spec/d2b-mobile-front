// 계약진행상태 풀팝업 — MUI-CT-01-P17 CtrtPrgrsSttsInq. 설계서 slide84~86.
// 물품/공사 계약의 진행 상태 이력 조회(내역 조회만, 클릭 불가). 상세 바로가기에서 진입.
// 국외 계약은 처리담당자·반려사유 추가 표시(반려사유 없으면 미표시) — 값 있는 행만 렌더.
import { useCtrtPrgrsStts } from '@/queries/ct'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CtrtPrgrsStts } from '@/types/ct'

export interface CtrtPrgrsSttsInqFullPopupProps {
  /** 계약 식별자 — 부모 상세 페이지가 navigate state 에서 받아 전달. */
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 이력 1건 → 표 행(slide84: 처리상태/부대·업체/처리일시 + 국외 담당자/반려사유).
function sttsRows(s: CtrtPrgrsStts): TableRow[] {
  return [
    { label: '처리상태', value: s.ctrtPrgrsStcd },
    { label: '부대/업체', value: s.prcsSbsdBzenty },
    ...(s.prcsPic ? [{ label: '담당자', value: s.prcsPic }] : []),
    ...(s.rjctRsn ? [{ label: '반려사유', value: s.rjctRsn }] : []),
    { label: '처리일시', value: s.prcsDt },
  ]
}

export function CtrtPrgrsSttsInqFullPopup({
  id,
  open,
  onOpenChange,
}: CtrtPrgrsSttsInqFullPopupProps) {
  const { data: sttsList = [] } = useCtrtPrgrsStts(id, open)

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="계약 진행 상태"
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col gap-8 pb-8">
        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3">계약진행 현황 이력 목록</SectionTitle>
          <div className="flex flex-col gap-krds-7 px-4">
            {sttsList.map((s) => (
              <Table key={s.id} rows={sttsRows(s)} />
            ))}
          </div>
        </section>
      </div>
    </FullPopup>
  )
}
CtrtPrgrsSttsInqFullPopup.displayName = 'CtrtPrgrsSttsInqFullPopup'
