// 복수예비가격 — MUI-BD-09-P02 Prprc. 설계서 02.입찰 v1.88 slide246~248 (2026-08-13 화면 추가).
// 입찰결과 탭(T03)의 '복수예가조회' 버튼으로 진입. 생성된 복수예비가격(번호/금액/횟수) +
// 업체가 선택한 번호(번호/금액/업체명) 조회. 업체명은 마스킹 정책 대상(설계서) — 서버 응답값 그대로 표시.
// PC 는 15열 그리드지만 모바일은 '번호'를 행 라벨로 세운 단일 Table 로 전치(열 스크롤 회피).
import { bdQueries } from '@/queries/bds/bd/bdQueries'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { Table, type TableRow } from '@/ui/common/composites/Table'

export interface PrprcFullPopupProps {
  /** 개찰 건 식별자 — 입찰결과상세 페이지가 navigate state 에서 받아 탭을 거쳐 전달. */
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrprcFullPopup({ id, open, onOpenChange }: PrprcFullPopupProps) {
  const { data } = bdQueries.useSelectPlrlRsrvPrcInfo(id, open)
  const plrlRsrvPrc = data?.plrlRsrvPrc ?? []
  const chcNo = data?.chcNo ?? []

  // 생성된 복수예비가격 — 번호 라벨 + (금액 / 선택 횟수).
  const prprcRows: TableRow[] = plrlRsrvPrc.map((it) => ({
    label: `번호 ${it.regSn}`,
    value: (
      <div className="flex flex-col gap-0.5">
        <span>{it.prprc.toLocaleString()} 원</span>
        <span className="text-krds-text-muted">횟수 {it.chcNmtm}</span>
      </div>
    ),
    type: 'combination',
  }))

  // 업체가 선택한 번호 — 같은 번호를 여러 업체가 고를 수 있어 key 는 번호+업체명 조합.
  const chcNoRows: TableRow[] = chcNo.map((it) => ({
    label: `번호 ${it.regSn}`,
    value: (
      <div className="flex flex-col gap-0.5">
        <span>{it.prprc.toLocaleString()} 원</span>
        <span className="text-krds-text-muted">{it.bzentyNm}</span>
      </div>
    ),
    type: 'combination',
  }))

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="복수예비가격"
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col gap-8 pb-8">
        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3" info={`총 ${plrlRsrvPrc.length}건`}>
            복수예비가격
          </SectionTitle>
          <div className="px-4">
            <Table rows={prprcRows} />
          </div>
        </section>

        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3" info={`총 ${chcNo.length}건`}>
            선택번호
          </SectionTitle>
          <div className="px-4">
            <Table rows={chcNoRows} />
          </div>
        </section>
      </div>
    </FullPopup>
  )
}
PrprcFullPopup.displayName = 'PrprcFullPopup'
