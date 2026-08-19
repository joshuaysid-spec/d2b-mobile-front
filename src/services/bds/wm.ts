// 대금청구/사후(WM) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: wmKeys.selectXxx / useSelectXxx) — 실규격 확정 전 임시 명명(select~ 스타일).
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로 확정 시 해당 함수만 수정).
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_WM } from '@/mocks/wm'
import type {
  CenterPrcmPymtClmDtl,
  CstrnPymtClmDtl,
  DpsmnItrpyAplyDsctnItem,
  DpsmnItrpyApfrDtl,
  EpfcClclnClmDtl,
  GiveSttsItem,
  PxcndCstPymtClmDtl,
  SbsdPrcmPymtClmDtl,
  PrpayAplyDsctnItem,
  PrpayApfrDtl,
  PymtClmAplyItem,
  PymtClmIntgListRequest,
  PymtClmIntgListResult,
  PymtClmPrgrsPrstRequest,
  PymtClmPrgrsPrstResult,
  PymtClmPrgrsSttItem,
  RtnPymtDfryInfoRequest,
  RtnPymtDfryInfoResult,
  OvsCmdtyRcvCnfdocRequest,
  OvsCmdtyRcvCnfdocResult,
  OvsElcrtTxivDtl,
  OvsElcrtTxivItem,
  OvsElcrtTxivItemRow,
  OvsPymtPrgrsRequest,
  OvsPymtPrgrsResult,
  OvsRtnPymtDfryInfoRequest,
  OvsRtnPymtDfryInfoResult,
  OvsShpgItemDsctnItem,
} from '@/types/wm'

export const wmService = {
  // ── 대금청구통합목록 (MUI-WM-01-M01) ──────────────────────────────────────

  /**
   * 대금청구통합목록 조회 — MUI-WM-01-M01 (pymtClmIntgList/PymtClmIntgListPage).
   * 키워드 필터/더보기 페이징은 페이지 클라이언트 로직(서버 전환 시 req 로 이행).
   */
  async selectPymtClmIntgList(req: PymtClmIntgListRequest = {}): Promise<PymtClmIntgListResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.pymtClmIntgList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<PymtClmIntgListResult, PymtClmIntgListResult>(
      '/v1/wms/payment-claims',
      req,
    )
  },

  // ── 대금청구신청목록 (MUI-WM-01-P13) ──────────────────────────────────────

  /**
   * 선택 계약의 대금청구 신청 목록 조회 — MUI-WM-01-P13 (pymtClmIntgList/PymtClmIntgAplyList).
   * 카드 클릭 → 바텀시트(slide21).
   */
  async selectPymtClmAplyList(ctrtNo: string): Promise<PymtClmAplyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.pymtClmAplyList)
    return apiClient.post<PymtClmAplyItem[], PymtClmAplyItem[]>(
      `/v1/wms/contracts/${ctrtNo}/payment-claim-applications`,
    )
  },

  // ── 선금신청서상세 (MUI-WM-01-M02) ────────────────────────────────────────

  /**
   * 선금신청서상세(차수·계약내용·신청금액·공급자) 조회 — MUI-WM-01-M02/T01
   * (prpayApfrDtl/PrpayApfrDtlPage). On-Load(slide28).
   */
  async selectPrpayApfrDtl(id: string): Promise<PrpayApfrDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.prpayApfrDtl)
    return apiClient.post<PrpayApfrDtl, PrpayApfrDtl>(`/v1/wms/prepayment-applications/${id}`)
  },

  /** 선금 세부신청내역 조회 — MUI-WM-01-T02 (prpayApfrDtl/PrpayApfrDtl_AplyDtsm). */
  async selectPrpayAplyDsctns(id: string): Promise<PrpayAplyDsctnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.prpayAplyDsctns)
    return apiClient.post<PrpayAplyDsctnItem[], PrpayAplyDsctnItem[]>(
      `/v1/wms/prepayment-applications/${id}/details`,
    )
  },

  // ── 착·중도금신청서상세 (MUI-WM-01-M03) ───────────────────────────────────

  /**
   * 착·중도금신청서상세 조회 — MUI-WM-01-M03/T03
   * (dpsmnItrpyApfrDtl/DpsmnItrpyApfrDtlPage).
   */
  async selectDpsmnItrpyApfrDtl(id: string): Promise<DpsmnItrpyApfrDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.dpsmnItrpyApfrDtl)
    return apiClient.post<DpsmnItrpyApfrDtl, DpsmnItrpyApfrDtl>(
      `/v1/wms/interim-payment-applications/${id}`,
    )
  },

  /** 착·중도금 세부신청내역 조회 — MUI-WM-01-T04 (dpsmnItrpyApfrDtl/DpsmnItrpyApfrDtl_AplyDtsm). */
  async selectDpsmnItrpyAplyDsctns(id: string): Promise<DpsmnItrpyAplyDsctnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.dpsmnItrpyAplyDsctns)
    return apiClient.post<DpsmnItrpyAplyDsctnItem[], DpsmnItrpyAplyDsctnItem[]>(
      `/v1/wms/interim-payment-applications/${id}/details`,
    )
  },

  // ── 지급상태 (MUI-WM-01-T23, 상세 공용 탭) ────────────────────────────────

  /**
   * 지급상태 목록 조회 — MUI-WM-01-T23
   * (prpayDpsmnItrpyGiveStts/PrpayDpsmnItrpyGiveStts, 상세 공용 탭).
   */
  async selectGiveSttsList(id: string): Promise<GiveSttsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.giveSttsList)
    return apiClient.post<GiveSttsItem[], GiveSttsItem[]>(
      `/v1/wms/payment-claims/${id}/payment-statuses`,
    )
  },

  // ── 진행상태 (MUI-WM-01-T24, 상세 공용 탭) ────────────────────────────────

  /**
   * 대금청구 진행상태 목록 조회 — MUI-WM-01-T24 (prcmPymtClmStts/PrcmPymtClmStts,
   * 대금청구 상세 M05·사후정산청구상세 M13 공용 탭). On-Load(slide81).
   */
  async selectPymtClmPrgrsSttList(id: string): Promise<PymtClmPrgrsSttItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.pymtClmPrgrsSttList)
    return apiClient.post<PymtClmPrgrsSttItem[], PymtClmPrgrsSttItem[]>(
      `/v1/wms/payment-claims/${id}/progress-statuses`,
    )
  },

  // ── 대금청구 상세(중앙조달) (MUI-WM-01-M05) ───────────────────────────────

  /**
   * 대금청구 상세(중앙조달: 계약정보+신청대상+공급자+신청금액+세금계산서) 조회 —
   * MUI-WM-01-M05/T05~T08 (centerPrcmPymtClmDtl/CenterPrcmPymtClmDtlPage). On-Load(slide45).
   */
  async selectCenterPrcmPymtClmDtl(id: string): Promise<CenterPrcmPymtClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.centerPrcmPymtClmDtl)
    return apiClient.post<CenterPrcmPymtClmDtl, CenterPrcmPymtClmDtl>(
      `/v1/wms/central-payment-claims/${id}`,
    )
  },

  // ── 대금청구상세(부대조달) (MUI-WM-01-M06) ────────────────────────────────

  /**
   * 대금청구상세(부대조달: 계약정보+신청대상+업체+신청금액+첨부) 조회 —
   * MUI-WM-01-M06/T09~T12 (sbsdPrcmPymtClmDtl/SbsdPrcmPymtClmDtlPage).
   */
  async selectSbsdPrcmPymtClmDtl(id: string): Promise<SbsdPrcmPymtClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.sbsdPrcmPymtClmDtl)
    return apiClient.post<SbsdPrcmPymtClmDtl, SbsdPrcmPymtClmDtl>(
      `/v1/wms/subsidiary-payment-claims/${id}`,
    )
  },

  // ── 대금청구상세(공사) (MUI-WM-01-M07) ────────────────────────────────────

  /**
   * 대금청구상세(공사: 계약정보+비고+대가지급업체+첨부) 조회 —
   * MUI-WM-01-M07/T13~T15 (cstrnPymtClmDtl/CstrnPymtClmDtlPage).
   */
  async selectCstrnPymtClmDtl(id: string): Promise<CstrnPymtClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.cstrnPymtClmDtl)
    return apiClient.post<CstrnPymtClmDtl, CstrnPymtClmDtl>(
      `/v1/wms/construction-payment-claims/${id}`,
    )
  },

  // ── 대금청구상세(기성대가) (MUI-WM-01-M08) ────────────────────────────────

  /**
   * 대금청구상세(기성대가: 계약정보+업체+기성대가 신청금액+세금계산서+첨부) 조회 —
   * MUI-WM-01-M08/T16~T19 (pxcndCstPymtClmDtl/PxcndCstPymtClmDtlPage).
   */
  async selectPxcndCstPymtClmDtl(id: string): Promise<PxcndCstPymtClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.pxcndCstPymtClmDtl)
    return apiClient.post<PxcndCstPymtClmDtl, PxcndCstPymtClmDtl>(
      `/v1/wms/progress-payment-claims/${id}`,
    )
  },

  // ── 사후정산청구상세 (MUI-WM-01-M13) ──────────────────────────────────────

  /**
   * 사후정산청구상세(차수+계약내용+신청금액+신청내역+공급자+세금계산서) 조회 —
   * MUI-WM-01-M13/T20~T22 (epfcClclnClmDtl/EpfcClclnClmDtlPage).
   */
  async selectEpfcClclnClmDtl(id: string): Promise<EpfcClclnClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.epfcClclnClmDtl)
    return apiClient.post<EpfcClclnClmDtl, EpfcClclnClmDtl>(
      `/v1/wms/post-settlement-claims/${id}`,
    )
  },

  // ── 대금청구진행현황 (MUI-WM-01-M11) ──────────────────────────────────────

  /**
   * 대금청구진행현황 목록 조회 — MUI-WM-01-M11 (pymtClmPrgrsPrst/PymtClmPrgrsPrstPage).
   * 키워드 필터/더보기 페이징은 페이지 클라이언트 로직.
   */
  async selectPymtClmPrgrsPrstList(
    req: PymtClmPrgrsPrstRequest = {},
  ): Promise<PymtClmPrgrsPrstResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.pymtClmPrgrsPrstList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<PymtClmPrgrsPrstResult, PymtClmPrgrsPrstResult>(
      '/v1/wms/payment-claim-progresses',
      req,
    )
  },

  // ── 대금지불정보(반납) (MUI-WM-01-M10) ────────────────────────────────────

  /**
   * 대금지불정보(반납) 목록 조회 — MUI-WM-01-M10 (rtnPymtDfryInfo/RtnPymtDfryInfoPage).
   * 키워드 필터/더보기 페이징은 페이지 클라이언트 로직.
   */
  async selectRtnPymtDfryInfoList(
    req: RtnPymtDfryInfoRequest = {},
  ): Promise<RtnPymtDfryInfoResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.rtnPymtDfryInfoList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<RtnPymtDfryInfoResult, RtnPymtDfryInfoResult>(
      '/v1/wms/return-payment-infos',
      req,
    )
  },

  // ── 물품수령확인서목록 (MUI-WM-01-M71, 국외) ──────────────────────────────

  /**
   * 물품수령확인서 목록 조회 — MUI-WM-01-M71
   * (ovsCmdtyRcvCnfdocList/OvsCmdtyRcvCnfdocListPage). 계약번호 필수(slide93 이벤트).
   */
  async selectOvsCmdtyRcvCnfdocList(
    req: OvsCmdtyRcvCnfdocRequest = {},
  ): Promise<OvsCmdtyRcvCnfdocResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.ovsCmdtyRcvCnfdocList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<OvsCmdtyRcvCnfdocResult, OvsCmdtyRcvCnfdocResult>(
      '/v1/wms/overseas/goods-receipt-confirmations',
      req,
    )
  },

  // ── 전자계산서목록/상세 (MUI-WM-01-P73 · M74, 국외) ───────────────────────

  /**
   * 선택 물품수령확인서의 전자계산서 목록 조회 — MUI-WM-01-P73
   * (ovsCmdtyRcvCnfdocList/OvsElcrtTxivList, 바텀시트 콘텐츠).
   */
  async selectOvsElcrtTxivList(ctrtNo: string): Promise<OvsElcrtTxivItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.ovsElcrtTxivList)
    return apiClient.post<OvsElcrtTxivItem[], OvsElcrtTxivItem[]>(
      '/v1/wms/overseas/electronic-invoices',
      { ctrtNo },
    )
  },

  /** 전자계산서상세 조회 — MUI-WM-01-M74 (ovsElcrtTxivDtl/OvsElcrtTxivDtlPage). */
  async selectOvsElcrtTxivDtl(bilPblcnNo: string): Promise<OvsElcrtTxivDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.ovsElcrtTxivDtl)
    return apiClient.post<OvsElcrtTxivDtl, OvsElcrtTxivDtl>(
      `/v1/wms/overseas/electronic-invoices/${bilPblcnNo}`,
    )
  },

  /** 전자계산서 품목정보 조회 — MUI-WM-01-M74 품목정보(slide95). */
  async selectOvsElcrtTxivItems(bilPblcnNo: string): Promise<OvsElcrtTxivItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.ovsElcrtTxivItems)
    return apiClient.post<OvsElcrtTxivItemRow[], OvsElcrtTxivItemRow[]>(
      `/v1/wms/overseas/electronic-invoices/${bilPblcnNo}/items`,
    )
  },

  // ── 대금지불정보 (MUI-WM-01-M75, 국외) ────────────────────────────────────

  /**
   * 대금지불정보 목록 조회 — MUI-WM-01-M75 (ovsRtnPymtDfryInfo/OvsRtnPymtDfryInfoPage).
   * On-Load 심사일자 = 1개월 전 ~ 현재일(slide102).
   */
  async selectOvsRtnPymtDfryInfoList(
    req: OvsRtnPymtDfryInfoRequest = {},
  ): Promise<OvsRtnPymtDfryInfoResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.ovsRtnPymtDfryInfoList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<OvsRtnPymtDfryInfoResult, OvsRtnPymtDfryInfoResult>(
      '/v1/wms/overseas/payment-delivery-infos',
      req,
    )
  },

  // ── 대금지급현황 · 선적품목내역 (MUI-WM-01-M77 · P78, 국외) ───────────────

  /**
   * 대금지급현황 목록 조회 — MUI-WM-01-M77 (ovsPymtPrgrsList/OvsPymtPrgrsListPage).
   * 계약번호 필수 — 없으면 목록 미표시(slide103 2-2]).
   */
  async selectOvsPymtPrgrsList(req: OvsPymtPrgrsRequest = {}): Promise<OvsPymtPrgrsResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.ovsPymtPrgrsList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<OvsPymtPrgrsResult, OvsPymtPrgrsResult>(
      '/v1/wms/overseas/payment-progresses',
      req,
    )
  },

  /**
   * 선적품목내역 조회 — MUI-WM-01-P78 (ovsPymtPrgrsList/OvsShpgItemDsctn, 바텀시트 콘텐츠).
   */
  async selectOvsShpgItemDsctns(blNo: string): Promise<OvsShpgItemDsctnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.ovsShpgItemDsctns)
    return apiClient.post<OvsShpgItemDsctnItem[], OvsShpgItemDsctnItem[]>(
      '/v1/wms/overseas/shipping-items',
      { blNo },
    )
  },
}
