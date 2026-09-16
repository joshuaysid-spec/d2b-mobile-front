// 국외 공개수의협상 견적서 제출(M74) 목업·폼 초기값 — 컴포넌트 파일에서 상수 export 시 react-refresh 경고라 분리.
import type { MockOvsRlsVltrnsEtdcItem } from '@/types/mock/bd'
import type { EtdcItemsValues } from '@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsn.schema'

// 품목대체구분 Y/N SelectBox (사용자 요청).
export const ALT_OPTIONS = [
  { value: 'N', label: 'N' },
  { value: 'Y', label: 'Y' },
]

// 화폐단위 SelectBox 옵션 (사용자 요청). 코드값은 추후 공통코드 매핑.
export const CRNCY_OPTIONS = [
  { value: '미 달러', label: '미 달러' },
  { value: '유로화', label: '유로화' },
  { value: '엔화', label: '엔화' },
  { value: '원화', label: '원화' },
]

// 입찰참여품목 목업 — 설계서 slide422 값 그대로. 추후 bdService.selectEtdcSbmsn 매핑.
const ITEM_BASE: Omit<
  MockOvsRlsVltrnsEtdcItem,
  'frcptlArtclNo' | 'itemSbstSe' | 'mdfcnInvtNo' | 'mdfcnPrtsNo' | 'estmtUntprc'
> = {
  invtNo: '1015375183975',
  prtsNo: '000-A0000 0000',
  itemNm: 'T-80U/TBE-3',
  unitNm: 'EA',
  qty: '1',
  drctnUntprc: '608,000.00',
  crncNm: '미 달러',
}
export const ETDC_ITEM_TOTAL = 100
export const MOCK_ETDC_ITEMS: MockOvsRlsVltrnsEtdcItem[] = Array.from(
  { length: ETDC_ITEM_TOTAL },
  (_, i) => ({
    ...ITEM_BASE,
    frcptlArtclNo: String(i + 1),
    itemSbstSe: 'N',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    estmtUntprc: '',
  }),
)

/** T76 폼 초기값 — 품목 목업의 편집 항목만. 페이지가 확정값을 보관하고 되돌아올 때 재주입. */
export const ETDC_ITEMS_DEFAULT: EtdcItemsValues = {
  items: MOCK_ETDC_ITEMS.map((it) => ({
    frcptlArtclNo: it.frcptlArtclNo,
    itemSbstSe: it.itemSbstSe,
    itemSbstDocNm: '',
    mdfcnInvtNo: it.mdfcnInvtNo,
    mdfcnPrtsNo: it.mdfcnPrtsNo,
    estmtUntprc: it.estmtUntprc,
    crncNm: it.crncNm,
  })),
}
