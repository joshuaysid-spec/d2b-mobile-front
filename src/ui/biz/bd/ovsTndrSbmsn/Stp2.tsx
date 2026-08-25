// 국외 입찰서제출 - 스탭2 입찰참여품목 (MUI-BD-06-T72(구 M72 — v1.83 재편) 단가제 · MUI-BD-06-T73(구 M73 — v1.83 재편) 총액제, 설계서 slide367·368·371~372).
// 호스트 페이지(OvsTndrSbmsnPage)의 '입찰참여품목' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바는 페이지 소유.
// 단가제(M72)/총액제(M73)는 한 파일에서 detail.bidMthdNm 데이터 모드로 분기(설계서 화면 목록: 두 화면 모두 Stp2.tsx).
// - 단가제: 품목 카드(기본 4행 + 내역 펼쳐보기/접기, PrcmPlanDtl_PrdList 패턴) + 품목별 입찰단가 입력
//   → 입찰금액/달러단가/달러금액 자동 계산(설계서 slide373 이벤트 ibx_unitPrice_onchange).
// - 총액제: 입찰 품목 목록(읽기전용) + 입찰내역(입찰금액 입력 → 달러금액 계산, ibx_amountPrice_onchange).
// 항목명/형식은 데이터영역(slide371 dl_ititbBidCnList · slide372 dl_alonbsItemList/dl_alonbsBidCnInfo) 그대로.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { cn } from '@/utils/cn'
import type { OvsTndrSbmsnDetail } from '@/types/mock/bd'

// ── 입찰참여품목(단가제) 데이터 영역(dl_ititbBidCnList, 설계서 slide371) ──
export interface OvsItitbBidCnItem {
  /** 항목번호 (frcptlArtclNo, 5) */
  frcptlArtclNo: string
  /** 재고번호 (invtNo, 9) */
  invtNo: string
  /** 부품번호 (prtsNo, 32) */
  prtsNo: string
  /** 입찰업체 (splyBzentyNm, 200) */
  splyBzentyNm: string
  /** 품명 (itemNm, 200) */
  itemNm: string
  /** 단위 (unitNm, 2) */
  unitNm: string
  /** 수량 (qty, 15) */
  qty: string
  /** 지시단가 (drctnUntprc, 25) */
  drctnUntprc: string
  /** 화폐단위 (crncNm, 100) */
  crncNm: string
  /** 품목대체구분 (itemSbstSe, 1) — As it is / Replace */
  itemSbstSe: 'As it is' | 'Replace'
  /** 품목대체첨부문서 (itemSbstDocEn, 1) — 있으면 'O', 없으면 표시 없음 */
  itemSbstDocEn: 'O' | ''
  /** 수정재고번호 (mdfcnInvtNo, 13) */
  mdfcnInvtNo: string
  /** 수정부품번호 (mdfcnPrtsNo, 32) */
  mdfcnPrtsNo: string
  /** MOQ구분 (moqYn, 1) — Y / N */
  moqYn: 'Y' | 'N'
  /** MOQ수량 (moqQty, 15) */
  moqQty: string
  /** MOQ첨부문서 (moqDocEn, 1) — 있으면 'O', 없으면 표시 없음 */
  moqDocEn: 'O' | ''
  /** 납기(본조) (bscbgtDudtYmd, 8) */
  bscbgtDudtYmd: string
  /** 납기(당국) (athrtDudtYmd, 8) */
  athrtDudtYmd: string
  /** 납기(장국) (ltbndDudtYmd, 8) */
  ltbndDudtYmd: string
  /** 달러환산율 (usdExrt, 15) */
  usdExrt: string
}

// ── 입찰품목(총액제) 데이터 영역(dl_alonbsItemList, 설계서 slide372) ──
export interface OvsAlonbsItem {
  /** 항목번호 (frcptlArtclNo, 5) */
  frcptlArtclNo: string
  /** 재고번호 (invtNo, 9) */
  invtNo: string
  /** 부품번호 (prtsNo, 32) */
  prtsNo: string
  /** 품명 (itemNm, 200) */
  itemNm: string
  /** 단위 (unitNm, 2) */
  unitNm: string
  /** 수량 (qty, 15) */
  qty: string
}

// 서버 총건수(입찰참여품목 조회 결과 total) — 상단 총건수·더보기 분모(설계서 '총 00건'·'더보기(10/100)').
const TOTAL_COUNT = 100
// 더보기 한 번에 추가로 노출할 건수(페이지 크기).
const PAGE_SIZE = 2

// ── 입찰참여품목(단가제) 목업 — 설계서 slide367 예시값/형식 그대로 ─────────────
const MOCK_ITITB_ITEMS: OvsItitbBidCnItem[] = [
  {
    frcptlArtclNo: '1',
    invtNo: 'A000-A0000',
    prtsNo: 'T-80U/TBE-3',
    splyBzentyNm: 'A 해외업체',
    itemNm: 'MAIN ROTOR BLADE, 500MD',
    unitNm: 'EA',
    qty: '1',
    drctnUntprc: '608,000.00',
    crncNm: '미 달러',
    itemSbstSe: 'Replace',
    itemSbstDocEn: 'O',
    mdfcnInvtNo: 'A000-A0001-001',
    mdfcnPrtsNo: 'T-80U/TBE-3R',
    moqYn: 'Y',
    moqQty: '1',
    moqDocEn: 'O',
    bscbgtDudtYmd: '2025-03-25',
    athrtDudtYmd: '2025-03-25',
    ltbndDudtYmd: '2025-03-25',
    usdExrt: '1.0000',
  },
  {
    frcptlArtclNo: '2',
    invtNo: 'A000-A0001',
    prtsNo: '369D25100-505',
    splyBzentyNm: 'A 해외업체',
    itemNm: 'TAIL ROTOR ASSY, 500MD',
    unitNm: 'EA',
    qty: '2',
    drctnUntprc: '124,500.00',
    crncNm: '미 달러',
    itemSbstSe: 'As it is',
    itemSbstDocEn: '',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    moqYn: 'N',
    moqQty: '',
    moqDocEn: '',
    bscbgtDudtYmd: '2025-03-25',
    athrtDudtYmd: '2025-04-25',
    ltbndDudtYmd: '2025-05-25',
    usdExrt: '1.0000',
  },
  {
    frcptlArtclNo: '3',
    invtNo: 'A000-A0002',
    prtsNo: '369A1602-5',
    splyBzentyNm: 'A 해외업체',
    itemNm: 'DRIVE SHAFT, MAIN, 500MD',
    unitNm: 'EA',
    qty: '4',
    drctnUntprc: '36,200.00',
    crncNm: '미 달러',
    itemSbstSe: 'Replace',
    itemSbstDocEn: 'O',
    mdfcnInvtNo: 'A000-A0002-001',
    mdfcnPrtsNo: '369A1602-5R',
    moqYn: 'N',
    moqQty: '',
    moqDocEn: '',
    bscbgtDudtYmd: '2025-03-25',
    athrtDudtYmd: '2025-03-25',
    ltbndDudtYmd: '2025-03-25',
    usdExrt: '1.0000',
  },
  {
    frcptlArtclNo: '4',
    invtNo: 'A000-A0003',
    prtsNo: '369H90148',
    splyBzentyNm: 'A 해외업체',
    itemNm: 'BEARING ASSY, 500MD',
    unitNm: 'EA',
    qty: '10',
    drctnUntprc: '4,850.00',
    crncNm: '미 달러',
    itemSbstSe: 'As it is',
    itemSbstDocEn: '',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    moqYn: 'Y',
    moqQty: '5',
    moqDocEn: 'O',
    bscbgtDudtYmd: '2025-03-25',
    athrtDudtYmd: '2025-03-25',
    ltbndDudtYmd: '2025-03-25',
    usdExrt: '1.0000',
  },
]

// ── 입찰품목(총액제) 목업 — dl_alonbsItemList(설계서 slide368·372) ─────────────
const MOCK_ALONBS_ITEMS: OvsAlonbsItem[] = MOCK_ITITB_ITEMS.map((item) => ({
  frcptlArtclNo: item.frcptlArtclNo,
  invtNo: item.invtNo,
  prtsNo: item.prtsNo,
  itemNm: item.itemNm,
  unitNm: item.unitNm,
  qty: item.qty,
}))

// ── 입찰내역(총액제) 데이터 영역(dl_alonbsBidCnInfo) 목업 — 설계서 slide368 예시값 ──
const MOCK_ALONBS_BID_CN = {
  /** 입찰업체 (splyBzentyNm) */
  splyBzentyNm: 'A 해외업체',
  /** 화폐단위 (crncNm) */
  crncNm: 'USD',
  /** 달러환산율 (usdExrt) */
  usdExrt: '1.0000',
}

// ── 금액 입력/표시 헬퍼 (국내 TndrWrt_Stp3 과 동일 방식) ─────────────────────
// 천단위 콤마 + 소수점 둘째자리까지 — 숫자·점 1개만 허용.
function formatDecimal2(raw: string): string {
  let s = raw.replace(/[^0-9.]/g, '')
  const dot = s.indexOf('.')
  if (dot !== -1) s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, '') // 점 1개만
  const [int = '', dec] = s.split('.')
  const intFmt = int.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (dec === undefined) return intFmt
  return `${intFmt === '' ? '0' : intFmt}.${dec.slice(0, 2)}`
}

// 콤마 포함 표시 문자열 → 숫자
const toNumber = (v: string) => Number(v.replace(/,/g, ''))

// 숫자 → '608,000.00' 표시 문자열(소수 둘째자리 고정)
const toAmountString = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// ── 단가제(M72) 품목 카드 — 기본 4행 + 내역 펼쳐보기/접기(PrcmPlanDtl_PrdList 패턴) ──
function ItitbItemCard({
  item,
  bdngTccrUntprc,
  onUntprcChange,
  onOpenAtchDoc,
}: {
  item: OvsItitbBidCnItem
  /** 입찰단가 (bdngTccrUntprc, E) — 입력값(콤마 포함 표시 문자열) */
  bdngTccrUntprc: string
  onUntprcChange: (value: string) => void
  onOpenAtchDoc: (kind: '품목대체' | 'MOQ', item: OvsItitbBidCnItem) => void
}) {
  const [expanded, setExpanded] = useState(false)

  // 입찰단가 변경 시 입찰금액/달러단가/달러금액 계산(설계서 slide373 ibx_unitPrice_onchange).
  const untprc = toNumber(bdngTccrUntprc)
  const qty = toNumber(item.qty)
  const exrt = Number(item.usdExrt)
  const hasUntprc = bdngTccrUntprc !== '' && Number.isFinite(untprc)
  const bdngTccrAmt = hasUntprc ? toAmountString(untprc * qty) : '-' // 입찰금액
  const bdngUsdUntprc = hasUntprc ? toAmountString(untprc * exrt) : '-' // 달러단가
  const bdngUsdAmt = hasUntprc ? toAmountString(untprc * qty * exrt) : '-' // 달러금액

  // 기본(접힘) 4행 — 항목번호/재고번호/부품번호/품명(설계서 slide367).
  const baseRows: TableRow[] = [
    { label: '항목번호', value: item.frcptlArtclNo },
    { label: '재고번호', value: item.invtNo },
    { label: '부품번호', value: item.prtsNo },
    { label: '품명', value: item.itemNm },
  ]

  // 펼침 시 추가 행 — 단위~달러환산율(읽기전용). 첨부문서 'O' 는 [보기] 로 첨부문서조회 팝업(P76) 호출.
  const detailRows: TableRow[] = [
    { label: '단위', value: item.unitNm },
    { label: '수량', value: item.qty, type: 'number' },
    { label: '지시단가', value: item.drctnUntprc, type: 'number' },
    { label: '품목대체구분', value: item.itemSbstSe },
    {
      label: '품목대체첨부문서',
      type: 'combination',
      value:
        item.itemSbstDocEn === 'O' ? (
          <>
            <span>O</span>
            <div>
              <Button size="sm" variant="inner" onClick={() => onOpenAtchDoc('품목대체', item)}>
                보기
              </Button>
            </div>
          </>
        ) : (
          <span>-</span>
        ),
    },
    { label: '수정재고번호', value: item.mdfcnInvtNo || '-' },
    { label: '수정부품번호', value: item.mdfcnPrtsNo || '-' },
    { label: 'MOQ구분', value: item.moqYn },
    { label: 'MOQ수량', value: item.moqQty || '-', type: 'number' },
    {
      label: 'MOQ첨부문서',
      type: 'combination',
      value:
        item.moqDocEn === 'O' ? (
          <>
            <span>O</span>
            <div>
              <Button size="sm" variant="inner" onClick={() => onOpenAtchDoc('MOQ', item)}>
                보기
              </Button>
            </div>
          </>
        ) : (
          <span>-</span>
        ),
    },
    { label: '납기(본조)', value: item.bscbgtDudtYmd },
    { label: '납기(당국)', value: item.athrtDudtYmd },
    { label: '납기(장국)', value: item.ltbndDudtYmd },
    { label: '달러환산율', value: item.usdExrt, type: 'number' },
  ]

  // 입찰단가 입력 아래 계산 결과 행 — 입찰금액/화폐단위/달러단가/달러금액.
  const calcRows: TableRow[] = [
    { label: '입찰금액', value: bdngTccrAmt, type: 'number' },
    { label: '화폐단위', value: item.crncNm },
    { label: '달러단가', value: bdngUsdUntprc, type: 'number' },
    { label: '달러금액', value: bdngUsdAmt, type: 'number' },
  ]

  return (
    <div className="flex flex-col">
      <Table rows={expanded ? [...baseRows, ...detailRows] : baseRows} />

      {expanded && (
        <>
          {/* 입찰단가(E) 입력 — 변경 시 입찰금액/달러단가/달러금액 자동 계산 */}
          <div className="flex flex-col gap-krds-5 pt-4">
            <InputLabel htmlFor={`bdngTccrUntprc-${item.frcptlArtclNo}`} required>
              입찰단가
            </InputLabel>
            <div className="flex items-center gap-krds-3">
              <InputBox
                id={`bdngTccrUntprc-${item.frcptlArtclNo}`}
                className="flex-1"
                inputMode="decimal"
                format={formatDecimal2}
                value={bdngTccrUntprc}
                placeholder="입력해주세요."
                onChange={(e) => onUntprcChange(e.target.value)}
                onClear={() => onUntprcChange('')}
              />
              <span className="shrink-0 text-krds-body-md text-krds-text-ink">USD</span>
            </div>
          </div>

          {/* 계산 결과 — 입찰금액/화폐단위/달러단가/달러금액 */}
          <div className="pt-4">
            <Table rows={calcRows} />
          </div>
        </>
      )}

      {/* 내역 펼쳐보기/접기 토글 */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-center gap-krds-3 py-krds-6 text-[17px] font-medium text-krds-text-ink"
      >
        {expanded ? '내역 접기' : '내역 펼쳐보기'}
        <Icon
          name="ExpandMore"
          size={20}
          aria-hidden
          className={cn('transition-transform duration-200', expanded && 'rotate-180')}
        />
      </button>
    </div>
  )
}

export function OvsTndrSbmsnPage_Stp2({ detail }: { detail: OvsTndrSbmsnDetail }) {
  // 단가제(M72)/총액제(M73) 데이터 모드 분기 — 임시 항목 bidMthdNm(페이지 타입 주석 참고).
  const isUntprc = (detail.bidMthdNm ?? '단가제') === '단가제'

  // 더보기 페이징: 현재까지 노출한 건수.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // 품목별 입찰단가 입력값(단가제) — key: frcptlArtclNo. 페이지 제출 시 전송.
  const [untprcByArtcl, setUntprcByArtcl] = useState<Record<string, string>>({})

  // 입찰금액 입력값(총액제, bdngTccrAmt E) — 변경 시 달러금액 계산(설계서 slide373 ibx_amountPrice_onchange).
  const [bdngTccrAmt, setBdngTccrAmt] = useState('')
  const alonbsUsdAmt =
    bdngTccrAmt !== ''
      ? toAmountString(toNumber(bdngTccrAmt) * Number(MOCK_ALONBS_BID_CN.usdExrt))
      : '-'

  // 단가제/총액제 각각의 노출 목록 — 캐스트 없이 타입 안전하게 분리.
  const visibleItitbItems = MOCK_ITITB_ITEMS.slice(0, visibleCount)
  const visibleAlonbsItems = MOCK_ALONBS_ITEMS.slice(0, visibleCount)
  const listLength = isUntprc ? MOCK_ITITB_ITEMS.length : MOCK_ALONBS_ITEMS.length
  const visibleLength = isUntprc ? visibleItitbItems.length : visibleAlonbsItems.length
  const hasMore = visibleCount < listLength

  const handleLoadMore = () => {
    console.log('[M72/M73] 입찰참여품목 더보기', detail.pbancNo, visibleCount)
    // 추후 API: bdService.selectOvsTndrItemList(pbancNo, pbancOd, page) — 다음 페이지 조회 append
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, listLength))
  }

  // 품목대체/MOQ 첨부문서 [보기] → 첨부문서조회 팝업(UI-BD-05-P76) 호출 스텁(설계서 slide373).
  const handleOpenAtchDoc = (kind: '품목대체' | 'MOQ', item: OvsItitbBidCnItem) => {
    console.log(`[M72] ${kind}첨부문서 조회(P76)`, item.frcptlArtclNo, item.invtNo)
    // 추후 API: bdService.selectOvsAtchDoc(...) — 첨부문서조회 팝업(UI-BD-05-P76) 호출
  }

  return (
    <>
      <PageTitle as="h2" className="px-4 pb-2 pt-4">
        입찰참여품목
      </PageTitle>

      {/* 품목 목록(단가제) / 입찰 품목(총액제) — 총건수 */}
      <SectionTitle as="h3" topDivider info={`총 ${TOTAL_COUNT}건`} className="bg-white">
        {isUntprc ? '품목 목록' : '입찰 품목'}
      </SectionTitle>

      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {isUntprc
          ? visibleItitbItems.map((item) => (
              <ItitbItemCard
                key={item.frcptlArtclNo}
                item={item}
                bdngTccrUntprc={untprcByArtcl[item.frcptlArtclNo] ?? ''}
                onUntprcChange={(value) =>
                  setUntprcByArtcl((prev) => ({ ...prev, [item.frcptlArtclNo]: value }))
                }
                onOpenAtchDoc={handleOpenAtchDoc}
              />
            ))
          : visibleAlonbsItems.map((item) => (
              <Table
                key={item.frcptlArtclNo}
                rows={[
                  { label: '항목번호', value: item.frcptlArtclNo },
                  { label: '재고번호', value: item.invtNo },
                  { label: '부품번호', value: item.prtsNo },
                  { label: '품명', value: item.itemNm },
                  { label: '단위', value: item.unitNm },
                  { label: '수량', value: item.qty, type: 'number' },
                ]}
              />
            ))}

        {/* 더보기 — 클릭 시 다음 페이지 로드(추후 API). 추가 항목 없으면 숨김. */}
        {hasMore && (
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({visibleLength}/{TOTAL_COUNT})
          </Button>
        )}
      </div>

      {/* 입찰내역(총액제, dl_alonbsBidCnInfo) — 입찰금액 입력 → 달러금액 계산 */}
      {!isUntprc && (
        <>
          <SectionTitle as="h3" topDivider>
            입찰내역
          </SectionTitle>
          <div className="flex flex-col gap-4 px-4 py-4">
            <Table
              rows={[
                { label: '입찰업체', value: MOCK_ALONBS_BID_CN.splyBzentyNm },
                { label: '화폐단위', value: MOCK_ALONBS_BID_CN.crncNm },
              ]}
            />

            {/* 입찰금액(bdngTccrAmt, E) — 변경 시 달러금액 자동 계산 */}
            <div className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="bdngTccrAmt" required>
                입찰금액
              </InputLabel>
              <div className="flex items-center gap-krds-3">
                <InputBox
                  id="bdngTccrAmt"
                  className="flex-1"
                  inputMode="decimal"
                  format={formatDecimal2}
                  value={bdngTccrAmt}
                  placeholder="입력해주세요."
                  onChange={(e) => setBdngTccrAmt(e.target.value)}
                  onClear={() => setBdngTccrAmt('')}
                />
                <span className="shrink-0 text-krds-body-md text-krds-text-ink">
                  {MOCK_ALONBS_BID_CN.crncNm}
                </span>
              </div>
            </div>

            <Table
              rows={[
                { label: '달러금액', value: alonbsUsdAmt, type: 'number' },
                { label: '달러환산율', value: MOCK_ALONBS_BID_CN.usdExrt, type: 'number' },
              ]}
            />
          </div>
        </>
      )}
    </>
  )
}
OvsTndrSbmsnPage_Stp2.displayName = 'OvsTndrSbmsnPage_Stp2'
