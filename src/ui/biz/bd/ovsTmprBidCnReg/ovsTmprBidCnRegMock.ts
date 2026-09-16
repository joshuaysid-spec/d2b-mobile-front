// 입찰내역 작성(MUI-BD-01-M76) 목업 코드값 · 폼 초기값 · 표시 포맷/파생계산 헬퍼.
// 단가제(BidDsctn)/총액제(BidDsctn2) 두 탭 본문이 함께 쓰는 상수라 한 곳으로 모은다
//   (컴포넌트 파일에서 상수를 export 하면 react-refresh 경고 — forms.md 스텝 마법사 규칙의 `xxxMock.ts` 컨벤션).
import type {
  AlonbsBidCnValues,
  ItitbBidCnRow,
} from '@/ui/biz/bd/ovsTmprBidCnReg/OvsTmprBidCnReg.schema'
import type { MockAlonbsItem, MockItitbBidCnItem } from '@/types/mock/bd'

// ── 목업 코드값 — On-Load 입찰업체목록/화폐단위 조회 결과(설계서 slide319) ──
// 추후 API: bdService.selectOvsBidBzentyList / bdService.selectCrncUnitList
export const SPLY_BZENTY_ITEMS = [
  { value: 'MD Helicopters Inc.', label: 'MD Helicopters Inc.' },
  { value: 'Boeing Global Services Co.', label: 'Boeing Global Services Co.' },
  { value: 'Kaman Aerospace Corp.', label: 'Kaman Aerospace Corp.' },
]
// 화폐단위별 달러환산율(usdExrt) — 환율적용일자 기준 목업. 추후 API 응답으로 대체.
const USD_EXRT_BY_CRNC: Record<string, number> = {
  USD: 1.0,
  EUR: 1.085,
  GBP: 1.265,
  JPY: 0.0067,
}
export const CRNC_ITEMS = Object.keys(USD_EXRT_BY_CRNC).map((c) => ({ value: c, label: c }))

// 품목대체구분(itemSbstSe) — As it is / Replace (설계서 slide319).
export const ITEM_SBST_ITEMS = [
  { value: 'A', label: 'As it is' },
  { value: 'R', label: 'Replace' },
]

// ── 표시 포맷 ──
/** 금액 표시 포맷 — 소수 2자리 + 천단위 콤마 (설계서 예시 608,000.00). */
const fmtAmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
/** 입력용 콤마 포맷 — InputBox `format` prop (숫자만 → 천단위 콤마). */
export const fmtComma = (raw: string) =>
  raw ? Number(raw.replace(/,/g, '')).toLocaleString('en-US') : ''
/** 콤마 낀 입력값 → 숫자. 빈값/비정상은 0. */
export const toNum = (s: string) => Number(String(s).replace(/,/g, '')) || 0

// ── 파생계산 — 폼 값이 아니라 입력값에서 매 렌더 계산해 ReadOnly 로 표시(설계서 slide319 이벤트) ──
/** 단가제: 입찰단가/화폐단위(+수량) → 달러환산율·입찰금액·달러단가·달러금액. */
export function calcItitbBidCn(row: Pick<ItitbBidCnRow, 'crncNm' | 'bdngTccrUntprc'>, qty: string) {
  const exrt = USD_EXRT_BY_CRNC[row.crncNm]
  const untprc = toNum(row.bdngTccrUntprc)
  if (!exrt || !untprc) {
    return {
      usdExrt: exrt ? exrt.toFixed(4) : '',
      bdngTccrAmt: '',
      bdngUsdUntprc: '',
      bdngUsdAmt: '',
    }
  }
  const amt = untprc * toNum(qty)
  return {
    usdExrt: exrt.toFixed(4),
    bdngTccrAmt: fmtAmt(amt),
    bdngUsdUntprc: fmtAmt(untprc * exrt),
    bdngUsdAmt: fmtAmt(amt * exrt),
  }
}

/** 총액제: 입찰금액/화폐단위 → 달러환산율·달러금액. */
export function calcAlonbsBidCn(crncNm: string, bdngTccrAmt: string) {
  const exrt = USD_EXRT_BY_CRNC[crncNm]
  const amt = toNum(bdngTccrAmt)
  return {
    usdExrt: exrt ? exrt.toFixed(4) : '',
    bdngUsdAmt: exrt && amt ? fmtAmt(amt * exrt) : '',
  }
}

// ── 폼 초기값 ──
/** 단가제 행 초기값(작성분 없음) — 입찰내역 삭제 시 초기화 값으로도 재사용. */
export const EMPTY_ITITB_ROW: Omit<ItitbBidCnRow, 'frcptlArtclNo'> = {
  itemSbstSe: 'A',
  itemSbstDocEn: '',
  mdfcnInvtNo: '',
  mdfcnPrtsNo: '',
  bscbgtDudtYmd: '',
  athrtDudtYmd: '',
  ltbndDudtYmd: '',
  splyBzentyNm: '',
  bdngTccrUntprc: '',
  crncNm: '',
}

/** 임시입찰내용조회(no.60) 응답 1행 → 단가제 폼 행(편집 항목만, 금액은 입력 표시 포맷으로). */
export const toItitbFormRow = (r: MockItitbBidCnItem): ItitbBidCnRow => ({
  frcptlArtclNo: r.frcptlArtclNo,
  itemSbstSe: r.itemSbstSe,
  itemSbstDocEn: r.itemSbstDocEn,
  mdfcnInvtNo: r.mdfcnInvtNo,
  mdfcnPrtsNo: r.mdfcnPrtsNo,
  bscbgtDudtYmd: r.bscbgtDudtYmd,
  athrtDudtYmd: r.athrtDudtYmd,
  ltbndDudtYmd: r.ltbndDudtYmd,
  splyBzentyNm: r.splyBzentyNm,
  bdngTccrUntprc: fmtComma(r.bdngTccrUntprc),
  crncNm: r.crncNm,
})

/** 총액제 폼 초기값 — 조회 전 빈 폼. 입찰내역 삭제 시 초기화 값으로도 재사용. */
export const EMPTY_ALONBS_BID_CN: AlonbsBidCnValues = {
  splyBzentyNm: '',
  crncNm: '',
  bdngTccrAmt: '',
}

// ── 입찰품목(총액제) 목업 (dl_alonbsItemList, 설계서 slide315 예시값 형식) ──
export const MOCK_ALONBS_ITEM_LIST: MockAlonbsItem[] = [
  {
    frcptlArtclNo: '1',
    invtNo: 'A000-A0001',
    prtsNo: '369A1234-5',
    itemNm: 'T-80U/TBE-3',
    unitNm: 'EA',
    qty: '1',
  },
  {
    frcptlArtclNo: '2',
    invtNo: 'A000-A0002',
    prtsNo: '369A5501-3',
    itemNm: 'MAIN ROTOR BLADE ASSY',
    unitNm: 'EA',
    qty: '2',
  },
  {
    frcptlArtclNo: '3',
    invtNo: 'A000-A0003',
    prtsNo: '369D2210-11',
    itemNm: 'TAIL ROTOR ASSY',
    unitNm: 'EA',
    qty: '1',
  },
  {
    frcptlArtclNo: '4',
    invtNo: 'A000-A0004',
    prtsNo: '369H9020-7',
    itemNm: 'ENGINE FUEL PUMP',
    unitNm: 'EA',
    qty: '4',
  },
  {
    frcptlArtclNo: '5',
    invtNo: 'A000-A0005',
    prtsNo: '369A7003-1',
    itemNm: 'HYDRAULIC ACTUATOR',
    unitNm: 'EA',
    qty: '2',
  },
  {
    frcptlArtclNo: '6',
    invtNo: 'A000-A0006',
    prtsNo: '369D2911-4',
    itemNm: 'LANDING GEAR STRUT',
    unitNm: 'EA',
    qty: '2',
  },
  {
    frcptlArtclNo: '7',
    invtNo: 'A000-A0007',
    prtsNo: '369F1105-9',
    itemNm: 'MAIN TRANSMISSION GEARBOX',
    unitNm: 'EA',
    qty: '1',
  },
]
