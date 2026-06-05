// 연관조달계획상세 (MUI-OP-01-P12, 문서 slide35). 조달계획 상세의 '연관정보'에서 호출.
// 연관된 조달계획의 집행계획 + 판단내역을 바텀시트로 표시([공사] 변형 예시). 목업 — 추후 API.
import { Button } from '@/ui/common/base/Button'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// 집행계획 (목업 — slide35 [공사])
const EXEC_ROWS: TableRow[] = [
  { label: '요구년도', value: '2026' },
  { label: '공사번호', value: '2026-00590' },
  { label: '발주기관', value: '제9911부대' },
  { label: '발주예정월', value: '2026-03' },
  { label: '계약예정월', value: '2026-06' },
  { label: '공사구분', value: '제조' },
  { label: '총공사 예산금액', value: '000,000,000 원', type: 'number' },
  { label: '당해년도 예산금액', value: '000,000,000 원', type: 'number' },
  { label: '대표품명', value: "'26년 K5방독면" },
]

// 판단내역 (목업 — slide35 [공사])
const DECISION_ROWS: TableRow[] = [
  { label: '계약방법', value: '일반경쟁' },
  { label: '입찰방법', value: '전자입찰' },
  { label: '공사기간', value: '2026-08-01 ~ 2027-09-30' },
  { label: '사전심사', value: '비대상' },
  { label: '낙찰자결정방법', value: '적격심사제' },
  { label: '적격심사 여부', value: '대상' },
  { label: '입찰예정일자', value: '2026-03-05' },
  { label: '공동도급이행방식', value: '단독' },
  { label: '입찰형태', value: '전자입찰' },
  { label: '공사개요', value: '25-19차 병영기본시설 연차별 예산조정' },
]

export interface RelatedPlanSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RelatedPlanSheet({ open, onOpenChange }: RelatedPlanSheetProps) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="연관조달계획상세"
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <h3 className="text-[17px] font-bold leading-normal text-krds-text-ink">집행계획</h3>
          <Table rows={EXEC_ROWS} />
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="text-[17px] font-bold leading-normal text-krds-text-ink">판단내역</h3>
          <Table rows={DECISION_ROWS} />
        </section>
      </div>
    </BottomSheet>
  )
}
RelatedPlanSheet.displayName = 'RelatedPlanSheet'
