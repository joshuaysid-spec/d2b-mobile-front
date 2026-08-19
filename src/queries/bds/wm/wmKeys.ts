// 대금청구/사후(WM) 도메인 쿼리키 — 키명 = 서비스 함수명(services/bds/wm.ts)과 통일.
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
  selectPrpayApfrDtl: (id: string) => ['wm', 'selectPrpayApfrDtl', id] as const,
  selectPrpayAplyDsctns: (id: string) => ['wm', 'selectPrpayAplyDsctns', id] as const,
  selectDpsmnItrpyApfrDtl: (id: string) => ['wm', 'selectDpsmnItrpyApfrDtl', id] as const,
  selectDpsmnItrpyAplyDsctns: (id: string) => ['wm', 'selectDpsmnItrpyAplyDsctns', id] as const,
  selectGiveSttsList: (id: string) => ['wm', 'selectGiveSttsList', id] as const,
  selectPymtClmPrgrsSttList: (id: string) => ['wm', 'selectPymtClmPrgrsSttList', id] as const,
  selectCenterPrcmPymtClmDtl: (id: string) => ['wm', 'selectCenterPrcmPymtClmDtl', id] as const,
  selectSbsdPrcmPymtClmDtl: (id: string) => ['wm', 'selectSbsdPrcmPymtClmDtl', id] as const,
  selectCstrnPymtClmDtl: (id: string) => ['wm', 'selectCstrnPymtClmDtl', id] as const,
  selectPxcndCstPymtClmDtl: (id: string) => ['wm', 'selectPxcndCstPymtClmDtl', id] as const,
  selectEpfcClclnClmDtl: (id: string) => ['wm', 'selectEpfcClclnClmDtl', id] as const,
  selectPymtClmPrgrsPrstList: (req: PymtClmPrgrsPrstRequest) =>
    ['wm', 'selectPymtClmPrgrsPrstList', req] as const,
  selectRtnPymtDfryInfoList: (req: RtnPymtDfryInfoRequest) =>
    ['wm', 'selectRtnPymtDfryInfoList', req] as const,
  selectOvsCmdtyRcvCnfdocList: (req: OvsCmdtyRcvCnfdocRequest) =>
    ['wm', 'selectOvsCmdtyRcvCnfdocList', req] as const,
  selectOvsElcrtTxivList: (ctrtNo: string) => ['wm', 'selectOvsElcrtTxivList', ctrtNo] as const,
  selectOvsElcrtTxivDtl: (bilPblcnNo: string) =>
    ['wm', 'selectOvsElcrtTxivDtl', bilPblcnNo] as const,
  selectOvsElcrtTxivItems: (bilPblcnNo: string) =>
    ['wm', 'selectOvsElcrtTxivItems', bilPblcnNo] as const,
  selectOvsRtnPymtDfryInfoList: (req: OvsRtnPymtDfryInfoRequest) =>
    ['wm', 'selectOvsRtnPymtDfryInfoList', req] as const,
  selectOvsPymtPrgrsList: (req: OvsPymtPrgrsRequest) =>
    ['wm', 'selectOvsPymtPrgrsList', req] as const,
  selectOvsShpgItemDsctns: (blNo: string) => ['wm', 'selectOvsShpgItemDsctns', blNo] as const,
}
