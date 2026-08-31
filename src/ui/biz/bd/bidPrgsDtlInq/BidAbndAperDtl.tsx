// 입찰포기신청서조회 — 설계서 영문 화면ID MUI-BD-03-P09 (slide109, 2026-07-15 화면추가).
// 입찰서 상태가 '입찰포기'인 경우 제출한 입찰포기신청서를 그대로 호출해 보여주는 읽기전용 팝업.
// 바텀시트 콘텐츠 전용(컨테이너·footer '닫기' 는 부모 소유) — 제출/입력 없음.
// ⚠️ 작성판(MUI-BD-03-P03 BidAbndAperWrt)과 본문이 완전히 동일하다 — slide108(작성) vs slide109(조회)의
//    차이는 footer 의 제출하기/취소 버튼 유무뿐(입력 필드가 없는 신청서라 읽기전용 전환분이 없음).
//    그래서 본문(요약·공고일반·품목내역·서약문)은 이 파일 한 벌만 두고 P03 이 이걸 렌더한다.
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { OathBox } from '@/ui/biz/bd/OathBox'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

export interface BidAbndAperDtlProps {
  /** 상세에서 넘어온 항목(navigate state) — 요약/공고일반을 이 항목으로 그린다. */
  detail: MockBidPrgrsItem
}

// 업체내역 (설계서 dmt_bidPbancInfo 중 업체 항목) — 로그인 업체 정보라 목록 항목에 없어 목업 유지.
const MOCK_BZENTY = {
  bzentyCd: '00000', // 업체코드
  bzentyNm: '㈜업체명표기영역', // 업체명
  rprsvNm: '홍길동', // 대표자
  brno: '123-56-78901', // 사업자등록번호
  orderInstNm: '육군 탄약지원사령부', // 발주기관(공고 항목, 목록 미보유 → 목업)
}

// 품목내역 (설계서 dlt_itemList 항목명 그대로)
interface ItemListRow {
  rNum: string // 번호
  clsfNo: string // 항목번호
  fscCdNtnItemIdntfNo: string // 재고번호
  itemNm: string // 품명
  spcfctNo: string // 규격
  unitNm: string // 단위
  drctnQty: string // 수량
  drctnUntprc: string // 단가
  drctnAmt: string // 금액
}

// ── 품목내역 목업 (설계서 dlt_itemList 값 그대로) ─────────────────────
const MOCK_ITEMS: ItemListRow[] = [
  {
    rNum: '1',
    clsfNo: '000 000 000',
    fscCdNtnItemIdntfNo: '-',
    itemNm: '간편한 아침식 제조 및 납품',
    spcfctNo: '-',
    unitNm: '-',
    drctnQty: '1',
    drctnUntprc: '31,608,000.00 원',
    drctnAmt: '31,608,000.00 원',
  },
]

export function BidAbndAperDtl({ detail }: BidAbndAperDtlProps) {
  // 공고일반(dmt_bidPbancInfo) — 공고 식별값은 상세 항목, 업체내역은 목업.
  const pbancRows: TableRow[] = [
    { label: '공고번호', value: detail.pbancNo },
    { label: '발주기관', value: MOCK_BZENTY.orderInstNm },
    { label: '판단번호/공사번호', value: detail.prcmNo },
    { label: '통합참조번호', value: detail.rfrncNo },
    { label: '업체코드', value: MOCK_BZENTY.bzentyCd },
    { label: '업체명', value: MOCK_BZENTY.bzentyNm },
    { label: '대표자', value: MOCK_BZENTY.rprsvNm },
    { label: '사업자등록번호', value: MOCK_BZENTY.brno },
  ]

  const item = MOCK_ITEMS[0]
  const itemRows: TableRow[] = [
    { label: '번호', value: item.rNum },
    { label: '항목번호', value: item.clsfNo },
    { label: '재고번호', value: item.fscCdNtnItemIdntfNo },
    { label: '품명', value: item.itemNm },
    { label: '규격', value: item.spcfctNo },
    { label: '단위', value: item.unitNm },
    { label: '수량', value: item.drctnQty, type: 'number' },
    { label: '단가', value: item.drctnUntprc, type: 'number' },
    { label: '금액', value: item.drctnAmt, type: 'number' },
  ]

  return (
    <div className="flex flex-col gap-krds-7">
      <SummaryInfo
        flushX
        badges={[
          { key: 'task', label: detail.taskSeNm },
          { key: 'ctrt', label: detail.ctrtMthdNm },
          ...(detail.bfhdSrng ? [{ key: 'bfhd', label: '사전심사' }] : []),
          ...(detail.bidPrgrsApfr ? [{ key: 'apfr', label: '입찰참가' }] : []),
        ]}
        subtitle={detail.pbancNo}
        title={detail.bidNm}
      />

      <Accordion type="multiple" defaultValue={['pbanc', 'item']}>
        <AccordionSection value="pbanc" title="공고일반" variant="blue" borderTop={false} flush triggerClassName="px-0">
          <Table rows={pbancRows} />
        </AccordionSection>
        <AccordionSection
          value="item"
          title={`품목내역 (총 ${MOCK_ITEMS.length}건)`}
          variant="blue"
          flush
          triggerClassName="px-0"
        >
          <Table rows={itemRows} />
        </AccordionSection>
      </Accordion>

      {/* 서약문 박스(Figma 9300-43269) — 좌우 패딩은 시트 본문(px-16) 제공, 하단 간격만 */}
      <div className="pb-krds-8">
        <OathBox statement="우리 회사가 귀 부대에 제출한 전자입찰서를 포기합니다." />
      </div>
    </div>
  )
}
BidAbndAperDtl.displayName = 'BidAbndAperDtl'
