// 대금청구/사후(WM) 도메인 쿼리키 — 키명 = 서비스 함수명(services/cts/wm.ts)과 통일.
// 구조: ['wm', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['wm'])·함수 prefix 무효화 모두 가능.
// 훅 파일(queries.ts)과 분리 이유: mutation 무효화가 파일 경계를 넘어도 순환 import 없이 키만 참조.
import type {
  PymtClmIntgListRequest,
  PymtClmPrgrsPrstRequest,
  RtnPymtDfryInfoRequest,
  OvsCmdtyRcvCnfdocRequest,
  OvsPymtPrgrsRequest,
  OvsRtnPymtDfryInfoRequest,
} from '@/types/wm'

export const wmKeys = {
  selectPymtClmIntgList: (req: PymtClmIntgListRequest) =>
    ['wm', 'selectPymtClmIntgList', req] as const,
  selectPymtClmAplyList: (ctrtNo: string) => ['wm', 'selectPymtClmAplyList', ctrtNo] as const,
  selectPrpayClmAplyDtl: (id: string) => ['wm', 'selectPrpayClmAplyDtl', id] as const,
  selectPrpayAplyDsctns: (id: string) => ['wm', 'selectPrpayAplyDsctns', id] as const,
  selectDpsmnItrpyAplyDtlDsctn: (id: string) =>
    ['wm', 'selectDpsmnItrpyAplyDtlDsctn', id] as const,
  selectDpsmnItrpyAplyDsctns: (id: string) => ['wm', 'selectDpsmnItrpyAplyDsctns', id] as const,
  selectGiveStts: (id: string) => ['wm', 'selectGiveStts', id] as const,
  selectPymtClmPrgrsStts: (id: string) => ['wm', 'selectPymtClmPrgrsStts', id] as const,
  selectCenterPrcmPymtClmDtl: (id: string) => ['wm', 'selectCenterPrcmPymtClmDtl', id] as const,
  selectSbsdPrcmPymtClmDtl: (id: string) => ['wm', 'selectSbsdPrcmPymtClmDtl', id] as const,
  selectCstrnPymtClmDtl: (id: string) => ['wm', 'selectCstrnPymtClmDtl', id] as const,
  selectPxcndCstPymtClmDtl: (id: string) => ['wm', 'selectPxcndCstPymtClmDtl', id] as const,
  selectEpfcClcInAplyDtlDtsm: (id: string) => ['wm', 'selectEpfcClcInAplyDtlDtsm', id] as const,
  selectPymtClmPrgrsList: (req: PymtClmPrgrsPrstRequest) =>
    ['wm', 'selectPymtClmPrgrsList', req] as const,
  selectPymtDfryInfoRtnList: (req: RtnPymtDfryInfoRequest) =>
    ['wm', 'selectPymtDfryInfoRtnList', req] as const,
  selectGoodsReceiveConfirmList: (req: OvsCmdtyRcvCnfdocRequest) =>
    ['wm', 'selectGoodsReceiveConfirmList', req] as const,
  selectOvsElcrtTxivList: (ctrtNo: string) => ['wm', 'selectOvsElcrtTxivList', ctrtNo] as const,
  selectElectronicBill: (bilPblcnNo: string) =>
    ['wm', 'selectElectronicBill', bilPblcnNo] as const,
  selectOvsElcrtTxivItems: (bilPblcnNo: string) =>
    ['wm', 'selectOvsElcrtTxivItems', bilPblcnNo] as const,
  selectPaymentList: (req: OvsRtnPymtDfryInfoRequest) =>
    ['wm', 'selectPaymentList', req] as const,
  selectPaymentStatusList: (req: OvsPymtPrgrsRequest) =>
    ['wm', 'selectPaymentStatusList', req] as const,
  selectPackingItemList: (blNo: string) => ['wm', 'selectPackingItemList', blNo] as const,
}
