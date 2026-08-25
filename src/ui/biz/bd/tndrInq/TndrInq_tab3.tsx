// 입찰진행상세 - 입찰서(견적서)조회 투찰내역 (MUI-BD-06-T03, 설계서 영문ID TndrInq_tab3 · 02입찰 v1.88 slide174).
// 호스트 페이지(TndrInqPage)의 '3. 투찰내역' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 설계서 slide174: "입찰서작성중 투찰내역(MUI-BD-06-M03) 화면 내용" — 작성판(TndrWrt_Stp3)의 입력 필드가
//   조회판에서는 제출된 값 표시로 바뀐다(한글금액 변환기 불필요 — 제출 시점 값을 그대로 받는다).
// 항목명은 데이터영역(slide129 dmt_bdngAmt) 그대로. 입찰단가/입찰수량은 단가제인 경우에만 노출(slide123·129).
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

// 제출된 투찰내역(dmt_bdngAmt) 목업 — 설계서 slide174 예시값 그대로.
const BDNG = {
  /** 입찰금액(₩) */
  bdngAmt: '10,000,000,000 원',
  /** 입찰금액(원) — 한글금액 */
  bdngAmtKor: '금 일백억 원',
  /** 입찰단가(₩) — 단가제 */
  bdngUntprc: '10,000,000,000 원',
  /** 입찰단가(원) — 한글금액 */
  bdngUntprcKor: '금 일백억 원',
  /** 입찰수량 — 단가제 */
  bdngQty: '1',
}

export function TndrInq_tab3({ detail }: { detail: MockBidPrgrsItem }) {
  const isUntprc = detail.bidMthdNm?.includes('단가제')

  const rows: TableRow[] = [
    { label: '입찰금액(₩)', value: BDNG.bdngAmt, type: 'number' },
    { label: '입찰금액(원)', value: BDNG.bdngAmtKor },
    ...(isUntprc
      ? [
          { label: '입찰단가(₩)', value: BDNG.bdngUntprc, type: 'number' as const },
          { label: '입찰단가(원)', value: BDNG.bdngUntprcKor },
          { label: '입찰수량', value: BDNG.bdngQty, type: 'number' as const },
        ]
      : []),
  ]

  return (
    <>
      <SectionTitle as="h3" topDivider>
        투찰내역
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={rows} />
      </div>
    </>
  )
}
TndrInq_tab3.displayName = 'TndrInq_tab3'
