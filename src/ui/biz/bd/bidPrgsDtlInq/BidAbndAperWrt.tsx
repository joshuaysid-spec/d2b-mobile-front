// 입찰포기신청서작성 — 설계서 영문 화면ID MUI-BD-03-P03 (slide69 기준).
// Figma 는 참고만, 내용(항목명·코드값·형식)은 설계서대로.
// 바텀시트 콘텐츠 전용(컨테이너는 부모 소유) — 부모가 BottomSheet(title/footer/open/onOpenChange)를
// 소유하고, 이 컴포넌트는 본문만 렌더한다. footer '제출하기' 는 부모가 ref.submit() 으로 호출한다.
import { forwardRef, useImperativeHandle } from 'react'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import type { BidPrgrsItem } from '@/types/bd'

export interface BidAbndAperWrtHandle {
  /** 부모 BottomSheet footer '제출하기' 가 호출 — 제출 처리 후 onSubmitted() 로 시트 닫힘 알림 */
  submit: () => void
}

interface BidAbndAperWrtProps {
  /** 상세에서 넘어온 항목(navigate state) — 요약/공고일반을 이 항목으로 그린다. */
  detail: BidPrgrsItem
  /** 제출 완료 시 호출(부모가 BottomSheet 를 닫음) */
  onSubmitted: () => void
}

// 업체내역 (설계서 dmt_bzentyInfo) — 로그인 업체 정보라 목록 항목에 없어 목업 유지.
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

const BidAbndAperWrt = forwardRef<BidAbndAperWrtHandle, BidAbndAperWrtProps>(
  ({ detail, onSubmitted }, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        submit: () => {
          console.log('[P03] 입찰포기신청서 제출', { pbancNo: detail.pbancNo })
          // 추후 API: bdService.submitBidAbandon
          onSubmitted()
        },
      }),
      [detail, onSubmitted],
    )

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
          <AccordionSection value="pbanc" title="공고일반" variant="blue" borderTop={false} flush>
            <Table rows={pbancRows} />
          </AccordionSection>
          <AccordionSection
            value="item"
            title={`품목내역 (총 ${MOCK_ITEMS.length}건)`}
            variant="blue"
            flush
          >
            <Table rows={itemRows} />
          </AccordionSection>
        </Accordion>

        {/* 서약문 — 설계서 문구 그대로, 가운데 정렬 */}
        <div className="flex flex-col items-center gap-krds-7 px-krds-8 py-krds-10 text-center">
          <p className="text-krds-body-md text-krds-text-ink">
            우리 회사가 귀 부대에 제출한 전자입찰서를 포기합니다.
          </p>
          <p className="text-krds-body-md text-krds-text-ink">0000 년 00 월 00 일</p>
          <p className="text-krds-body-md text-krds-text-ink">000000 재무관 귀하</p>
        </div>
      </div>
    )
  },
)
BidAbndAperWrt.displayName = 'BidAbndAperWrt'

export { BidAbndAperWrt }
