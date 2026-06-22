// 입찰공고 상세 - '입찰진행현황' 탭 (MUI-BD-01-M12, Figma 9300-41670).
// 차수별 진행 카드(정보 테이블 + '입찰결과 바로가기') 목록. 입찰진행 전이면 노출 안 됨(컨테이너 제어).
// 데이터는 목업(추후 bdService.getBidProgress).
import { PageTitle } from '@/ui/common/base/PageTitle'
import { Button } from '@/ui/common/base/Button'
import { Table, type TableRow } from '@/ui/common/composites/Table'

interface BidProgress {
  id: string
  pbancNo: string // 공고번호
  rebidderCnt: string // 재입찰자수
  itemNo: string // 항목번호
  pbancNm: string // 공고명
  bidDocDdln: string // 입찰서제출마감일시
  opbidDt: string // 개찰일시
  prgrsStas: string // 진행상태
}

// 목업 — 추후 API. 진행상태 코드값(개찰완료/유찰 등)은 설계서 기준.
const PROGRESS_LIST: BidProgress[] = [
  {
    id: '1',
    pbancNo: '1234',
    rebidderCnt: '50명',
    itemNo: '000 000 0000',
    pbancNm: '-',
    bidDocDdln: '2025-12-25 10:30',
    opbidDt: '2025-12-25 10:30',
    prgrsStas: '개찰완료',
  },
  {
    id: '2',
    pbancNo: '5678',
    rebidderCnt: '100명',
    itemNo: '000 000 0000',
    pbancNm: '-',
    bidDocDdln: '2025-12-25 10:30',
    opbidDt: '2025-12-25 10:30',
    prgrsStas: '유찰',
  },
]

function progressRows(p: BidProgress): TableRow[] {
  return [
    { label: '공고번호', value: p.pbancNo },
    { label: '재입찰자수', value: p.rebidderCnt },
    { label: '항목번호', value: p.itemNo },
    { label: '공고명', value: p.pbancNm },
    { label: '입찰서제출마감일시', value: p.bidDocDdln },
    { label: '개찰일시', value: p.opbidDt },
    { label: '진행상태', value: p.prgrsStas },
  ]
}

export function BidPbancDtl_Tacpg07() {
  return (
    <>
      <PageTitle as="h2">입찰진행현황</PageTitle>
      <div className="flex flex-col gap-krds-7 px-4 pb-4">
        {PROGRESS_LIST.map((p) => (
          <div key={p.id} className="flex flex-col gap-krds-5">
            <Table rows={progressRows(p)} />
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => console.log('[M12] 입찰결과 바로가기', p.pbancNo)}
            >
              입찰결과 바로가기
            </Button>
          </div>
        ))}
      </div>
    </>
  )
}
BidPbancDtl_Tacpg07.displayName = 'BidPbancDtl_Tacpg07'
