// 입찰포기신청서작성 — 설계서 영문 화면ID MUI-BD-03-P03 (slide69 기준).
// Figma 는 참고만, 내용(항목명·코드값·형식)은 설계서대로.
// 전체화면 FullPopup 으로 입찰포기신청서를 작성/제출한다.
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'

interface BidAbndAperWrtProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 공고일반 (설계서 dmt_bidPbancInfo 항목명 그대로)
interface BidPbancInfo {
  pbancNo: string // 공고번호
  orderInstNm: string // 발주기관
  prcmNo: string // 판단번호/공사번호
  rfrncNo: string // 통합참조번호
  bzentyCd: string // 업체코드
  bzentyNm: string // 업체명
  rprsvNm: string // 대표자
  brno: string // 사업자등록번호
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

// ── 목업 (설계서 데이터영역 값 그대로) ──────────────────────────────
const MOCK_PBANC: BidPbancInfo = {
  pbancNo: '긴급공고 LDG0097-1',
  orderInstNm: '육군 탄약지원사령부',
  prcmNo: '56349',
  rfrncNo: '2025LDG56349',
  bzentyCd: '00000',
  bzentyNm: '㈜업체명표기영역',
  rprsvNm: '홍길동',
  brno: '123-56-78901',
}

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

export function BidAbndAperWrt({ open, onOpenChange }: BidAbndAperWrtProps) {
  const handleSubmit = () => {
    console.log('[P03] 입찰포기신청서 제출')
    // 추후 API: bdService.submitBidAbandon
    onOpenChange(false)
  }

  const pbancRows: TableRow[] = [
    { label: '공고번호', value: MOCK_PBANC.pbancNo },
    { label: '발주기관', value: MOCK_PBANC.orderInstNm },
    { label: '판단번호/공사번호', value: MOCK_PBANC.prcmNo },
    { label: '통합참조번호', value: MOCK_PBANC.rfrncNo },
    { label: '업체코드', value: MOCK_PBANC.bzentyCd },
    { label: '업체명', value: MOCK_PBANC.bzentyNm },
    { label: '대표자', value: MOCK_PBANC.rprsvNm },
    { label: '사업자등록번호', value: MOCK_PBANC.brno },
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
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="입찰포기신청서"
      footer={
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '취소', variant: 'secondary', onClick: () => onOpenChange(false) },
            { label: '제출하기', variant: 'primary', onClick: handleSubmit },
          ]}
        />
      }
    >
      <SummaryInfo
        badges={[
          { label: '물품' },
          { label: '경쟁입찰' },
          { label: '사전심사' },
          { label: '입찰참가' },
        ]}
        subtitle="긴급공고 LDG0097-1"
        title="특수작전용대물타격무인항공기"
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
    </FullPopup>
  )
}

BidAbndAperWrt.displayName = 'BidAbndAperWrt'
