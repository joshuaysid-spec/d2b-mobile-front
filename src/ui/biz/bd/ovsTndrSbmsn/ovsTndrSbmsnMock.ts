// 국외 입찰서 제출(M71) 입찰참여품목 목업·폼 초기값 — 컴포넌트 파일에서 상수 export 시 react-refresh 경고라 분리.
import type { MockOvsAlonbsItem, MockOvsItitbBidCnItem } from '@/types/mock/bd'
import type { OvsTndrItemValues } from '@/ui/biz/bd/ovsTndrSbmsn/OvsTndrSbmsn.schema'

// 서버 총건수(입찰참여품목 조회 결과 total) — 상단 총건수·더보기 분모(설계서 '총 00건'·'더보기(10/100)').
export const OVS_TNDR_ITEM_TOTAL = 100
// 더보기 한 번에 추가로 노출할 건수(페이지 크기).
export const OVS_TNDR_ITEM_PAGE_SIZE = 2

// ── 입찰참여품목(단가제) 목업 — 설계서 slide367 예시값/형식 그대로 ─────────────
export const MOCK_ITITB_ITEMS: MockOvsItitbBidCnItem[] = [
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
    bscbgtDudtYmd: '2025-03-25',
    athrtDudtYmd: '2025-03-25',
    ltbndDudtYmd: '2025-03-25',
    usdExrt: '1.0000',
  },
]

// ── 입찰품목(총액제) 목업 — dl_alonbsItemList(설계서 slide368·372) ─────────────
export const MOCK_ALONBS_ITEMS: MockOvsAlonbsItem[] = MOCK_ITITB_ITEMS.map((item) => ({
  frcptlArtclNo: item.frcptlArtclNo,
  invtNo: item.invtNo,
  prtsNo: item.prtsNo,
  itemNm: item.itemNm,
  unitNm: item.unitNm,
  qty: item.qty,
}))

// ── 입찰내역(총액제) 데이터 영역(dl_alonbsBidCnInfo) 목업 — 설계서 slide368 예시값 ──
export const MOCK_ALONBS_BID_CN = {
  /** 입찰업체 (splyBzentyNm) */
  splyBzentyNm: 'A 해외업체',
  /** 화폐단위 (crncNm) */
  crncNm: 'USD',
  /** 달러환산율 (usdExrt) */
  usdExrt: '1.0000',
}

/** T72/T73 폼 초기값 — 입찰방식(mode)별. 페이지가 확정값을 보관하고 되돌아올 때 재주입. */
export const ovsTndrItemDefault = (mode: OvsTndrItemValues['mode']): OvsTndrItemValues => ({
  mode,
  items: MOCK_ITITB_ITEMS.map((it) => ({ frcptlArtclNo: it.frcptlArtclNo, bdngTccrUntprc: '' })),
  bdngTccrAmt: '',
})
