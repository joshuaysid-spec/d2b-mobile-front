// 대금청구/사후(WM) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: wmService(services/cts/wm.ts) · wmQueries(이 파일) · wmKeys(keys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = keys.ts(함수명 동일).
import { useQuery } from '@tanstack/react-query'
import { wmService } from '@/services/cts/wm'
import { wmKeys } from '@/queries/cts/wm/wmKeys'
import type {
  PymtClmIntgListRequest,
  PymtClmPrgrsPrstRequest,
  RtnPymtDfryInfoRequest,
  OvsCmdtyRcvCnfdocRequest,
  OvsPymtPrgrsRequest,
  OvsRtnPymtDfryInfoRequest,
} from '@/types/mock/wm'

export const wmQueries = {
  /** 대금청구통합목록(M01) — 키워드 세부 필터/더보기 페이징은 페이지 클라이언트 로직 유지(서버 전환 시 req 로 이행). */
  useSelectPymtClmIntgList(req: PymtClmIntgListRequest = {}) {
    return useQuery({
      queryKey: wmKeys.selectPymtClmIntgList(req),
      queryFn: () => wmService.selectPymtClmIntgList(req),
    })
  },

  /** 대금청구신청목록(P13) — 바텀시트 열릴 때만 조회. */
  useSelectPymtClmAplyList(ctrtNo: string, enabled: boolean) {
    return useQuery({
      queryKey: wmKeys.selectPymtClmAplyList(ctrtNo),
      queryFn: () => wmService.selectPymtClmAplyList(ctrtNo),
      enabled: Boolean(ctrtNo) && enabled,
    })
  },

  /** 선금신청서상세(M02) — 목록 state 는 placeholder 로 쓰지 않음(필드 구성 상이). */
  useSelectPrpayClmAplyDtl(id: string) {
    return useQuery({
      queryKey: wmKeys.selectPrpayClmAplyDtl(id),
      queryFn: () => wmService.selectPrpayClmAplyDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 선금 세부신청내역(T02). */
  useSelectPrpayAplyDsctns(id: string) {
    return useQuery({
      queryKey: wmKeys.selectPrpayAplyDsctns(id),
      queryFn: () => wmService.selectPrpayAplyDsctns(id),
      enabled: Boolean(id),
    })
  },

  /** 착·중도금신청서상세(M03). */
  useSelectDpsmnItrpyAplyDtlDsctn(id: string) {
    return useQuery({
      queryKey: wmKeys.selectDpsmnItrpyAplyDtlDsctn(id),
      queryFn: () => wmService.selectDpsmnItrpyAplyDtlDsctn(id),
      enabled: Boolean(id),
    })
  },

  /** 착·중도금 세부신청내역(T04). */
  useSelectDpsmnItrpyAplyDsctns(id: string) {
    return useQuery({
      queryKey: wmKeys.selectDpsmnItrpyAplyDsctns(id),
      queryFn: () => wmService.selectDpsmnItrpyAplyDsctns(id),
      enabled: Boolean(id),
    })
  },

  /** 지급상태(T23, 상세 공용 탭). */
  useSelectGiveStts(id: string) {
    return useQuery({
      queryKey: wmKeys.selectGiveStts(id),
      queryFn: () => wmService.selectGiveStts(id),
      enabled: Boolean(id),
    })
  },

  /** 진행상태(T24, 상세 공용 탭). */
  useSelectPymtClmPrgrsStts(id: string) {
    return useQuery({
      queryKey: wmKeys.selectPymtClmPrgrsStts(id),
      queryFn: () => wmService.selectPymtClmPrgrsStts(id),
      enabled: Boolean(id),
    })
  },

  /** 대금청구 상세(중앙조달, M05). */
  useSelectCenterPrcmPymtClmDtl(id: string) {
    return useQuery({
      queryKey: wmKeys.selectCenterPrcmPymtClmDtl(id),
      queryFn: () => wmService.selectCenterPrcmPymtClmDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 대금청구상세(부대조달, M06). */
  useSelectSbsdPrcmPymtClmDtl(id: string) {
    return useQuery({
      queryKey: wmKeys.selectSbsdPrcmPymtClmDtl(id),
      queryFn: () => wmService.selectSbsdPrcmPymtClmDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 대금청구상세(공사, M07). */
  useSelectCstrnPymtClmDtl(id: string) {
    return useQuery({
      queryKey: wmKeys.selectCstrnPymtClmDtl(id),
      queryFn: () => wmService.selectCstrnPymtClmDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 대금청구상세(기성대가, M08). */
  useSelectPxcndCstPymtClmDtl(id: string) {
    return useQuery({
      queryKey: wmKeys.selectPxcndCstPymtClmDtl(id),
      queryFn: () => wmService.selectPxcndCstPymtClmDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 사후정산청구상세(M13). */
  useSelectEpfcClcInAplyDtlDtsm(id: string) {
    return useQuery({
      queryKey: wmKeys.selectEpfcClcInAplyDtlDtsm(id),
      queryFn: () => wmService.selectEpfcClcInAplyDtlDtsm(id),
      enabled: Boolean(id),
    })
  },

  /** 대금청구진행현황(M11). */
  useSelectPymtClmPrgrsList(req: PymtClmPrgrsPrstRequest = {}) {
    return useQuery({
      queryKey: wmKeys.selectPymtClmPrgrsList(req),
      queryFn: () => wmService.selectPymtClmPrgrsList(req),
    })
  },

  /** 대금지불정보(반납)(M10). */
  useSelectPymtDfryInfoRtnList(req: RtnPymtDfryInfoRequest = {}) {
    return useQuery({
      queryKey: wmKeys.selectPymtDfryInfoRtnList(req),
      queryFn: () => wmService.selectPymtDfryInfoRtnList(req),
    })
  },

  /** 물품수령확인서목록(M71, 국외) — 계약번호 필수라 값이 있을 때만 조회. */
  useSelectGoodsReceiveConfirmList(req: OvsCmdtyRcvCnfdocRequest = {}) {
    return useQuery({
      queryKey: wmKeys.selectGoodsReceiveConfirmList(req),
      queryFn: () => wmService.selectGoodsReceiveConfirmList(req),
      enabled: Boolean(req.ctrtNo),
    })
  },

  /** 전자계산서목록(P73) — 바텀시트 열릴 때만 조회. */
  useSelectOvsElcrtTxivList(ctrtNo: string, enabled: boolean) {
    return useQuery({
      queryKey: wmKeys.selectOvsElcrtTxivList(ctrtNo),
      queryFn: () => wmService.selectOvsElcrtTxivList(ctrtNo),
      enabled: Boolean(ctrtNo) && enabled,
    })
  },

  /** 전자계산서상세(M74). */
  useSelectElectronicBill(bilPblcnNo: string) {
    return useQuery({
      queryKey: wmKeys.selectElectronicBill(bilPblcnNo),
      queryFn: () => wmService.selectElectronicBill(bilPblcnNo),
      enabled: Boolean(bilPblcnNo),
    })
  },

  /** 전자계산서 품목정보(M74 하단). */
  useSelectOvsElcrtTxivItems(bilPblcnNo: string) {
    return useQuery({
      queryKey: wmKeys.selectOvsElcrtTxivItems(bilPblcnNo),
      queryFn: () => wmService.selectOvsElcrtTxivItems(bilPblcnNo),
      enabled: Boolean(bilPblcnNo),
    })
  },

  /** 대금지불정보(M75, 국외). */
  useSelectPaymentList(req: OvsRtnPymtDfryInfoRequest = {}) {
    return useQuery({
      queryKey: wmKeys.selectPaymentList(req),
      queryFn: () => wmService.selectPaymentList(req),
    })
  },

  /** 대금지급현황(M77, 국외) — 계약번호 필수라 값이 있을 때만 조회(slide103 2-2]). */
  useSelectPaymentStatusList(req: OvsPymtPrgrsRequest = {}) {
    return useQuery({
      queryKey: wmKeys.selectPaymentStatusList(req),
      queryFn: () => wmService.selectPaymentStatusList(req),
      enabled: Boolean(req.ctrtNo),
    })
  },

  /** 선적품목내역(P78) — 바텀시트 열릴 때만 조회. */
  useSelectPackingItemList(blNo: string, enabled: boolean) {
    return useQuery({
      queryKey: wmKeys.selectPackingItemList(blNo),
      queryFn: () => wmService.selectPackingItemList(blNo),
      enabled: Boolean(blNo) && enabled,
    })
  },
}
