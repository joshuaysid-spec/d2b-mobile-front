// 국외 조달계획 상세 - '결과목록' 탭 콘텐츠 (MUI-OP-01-M74, ovsPrcmPlanDtl_RsltList).
// 국외 조달 결과(품목별) 목록. 행 클릭 시 품목별가격자료(P75)/목록정보조회(P76·P77) 팝업 연계 예정.
// 데이터는 목업 — 추후 API(opService.getOverseasPlanResults)로 대체.
import { PageTitle } from '@/ui/common/base/PageTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'

interface OvsResult {
  id: string
  rows: TableRow[]
}

// 결과 1건 = 라벨/값 테이블(목업)
const MOCK_RESULTS: OvsResult[] = [
  {
    id: '1',
    rows: [
      { label: '재고번호', value: '152302089999' },
      { label: '품명', value: 'NIGHT VISION GOGGLE' },
      { label: '수량', value: '120', type: 'number' },
      { label: '계약금액(USD)', value: '$ 540,000.00', type: 'number' },
      { label: '진행상태', value: '계약완료' },
    ],
  },
  {
    id: '2',
    rows: [
      { label: '재고번호', value: '841511009876' },
      { label: '품명', value: 'FIELD JACKET BUTTON' },
      { label: '수량', value: '5,000', type: 'number' },
      { label: '계약금액(USD)', value: '$ 12,300.00', type: 'number' },
      { label: '진행상태', value: '공고게시' },
    ],
  },
]

export function OvsPrcmPlanDtl_RsltList() {
  return (
    <div className="flex flex-col gap-krds-7 pb-6">
      <PageTitle as="h2">결과목록</PageTitle>
      <div className="flex flex-col gap-krds-7 px-4">
        {MOCK_RESULTS.map((r) => (
          // 추후: 행 클릭 → 품목별가격자료(P75)/목록정보조회(P76·P77) 팝업 연계
          <Table key={r.id} rows={r.rows} />
        ))}
      </div>
    </div>
  )
}
OvsPrcmPlanDtl_RsltList.displayName = 'OvsPrcmPlanDtl_RsltList'
