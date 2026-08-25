// 대금청구/사후(WM) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: wmKeys.selectXxx / useSelectXxx) — 실 API 목록(no.407~444,
// BirqController) 기준. 실목록에 없는 화면은 임시 명명(select~ 스타일)·임시 URL 유지.
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로).
// 식별자는 POST body 로 전달 — 페이지가 넘기는 `id` 는 목록에서 만든 클라 합성키(`${clmNo}-${clmOdr}` ·
// `${birqNo}-${ctrtCycl}`)라 청구번호(birqNo) 로 보낸다. 요청 항목명·분해 여부는 상세설계 확정 시 대조.
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
//
// 실 API 목록에 있으나 모바일 설계서(05.대금청구및사후 v0.85)에 대응 화면이 없어 미배선인 건 —
// 화면이 생기면 함수 추가(응답 항목명이 설계서에 없어 타입을 임의 작명하지 않는다):
//   no.418 지급조건 조회            /cts/wm/birq/selectGiveCnd.do
//   no.423 사용기간 경과 사용 세부내역서 호출  /cts/wm/birq/popupUsePrdElpsUseDtlDtsm.do
//   no.424 국내재료비 및 직접경비 지급내역서 호출 /cts/wm/birq/popupDmstMtcoDrexpGiveDtsm.do
//   no.435 대금청구이행보증서 조회   /cts/wm/birq/selectPymtClmImpltWtgr.do
//   no.437 계약상대업체 조회         /cts/wm/birq/selectCtrtRltBzenty.do
//   no.444 선금/착.중도금전자보증서조회 /cts/wm/birq/selectPrpayDpsmnItrpyElWtgrInq.do
// 국외(OvsPymtClmController, /cts/wm/ovsPymtClm/) 중 모바일 소비처가 없어 미배선인 건 —
// 작성/제출은 PC 전용(모바일은 조회만), 다운로드는 모바일 미제공, 수송비지불현황은 설계서에 화면 없음:
//   no.447 전자계산서 제출 updateElectronicBill.do · no.448 전자계산서 삭제 deleteElectronicBill.do
//   no.450 전자계산서 저장 saveElectronicBill.do · no.451 전자계산서 Xml 다운로드 downloadElecronicBill.do
//   no.453 대금지불정보 엑셀다운 downloadPaymentExcel.do
//   no.456 수송비지불현황목록 조회 selectTransportPaymentStatusList.do
//   no.457 수송비지불현황 엑셀다운 downloadTransportPaymentStatus.do
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
  TxBllItem,
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
} from '@/types/mock/wm'

export const wmService = {
  // ── 대금청구통합목록 (MUI-WM-01-M01) ──────────────────────────────────────

  /**
   * no.407 대금청구통합목록 조회 — MUI-WM-01-M01 (pymtClmIntgList/PymtClmIntgListPage).
   * 키워드 필터/더보기 페이징은 페이지 클라이언트 로직(서버 전환 시 req 로 이행).
   */
  async selectPymtClmIntgList(req: PymtClmIntgListRequest = {}): Promise<PymtClmIntgListResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.pymtClmIntgList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<PymtClmIntgListResult, PymtClmIntgListResult>(
      '/cts/wm/birq/selectPymtClmIntgList.do',
      req,
    )
  },

  // ── 대금청구신청목록 (MUI-WM-01-P13) ──────────────────────────────────────

  /**
   * 선택 계약의 대금청구 신청 목록 조회 — MUI-WM-01-P13 (pymtClmIntgList/PymtClmIntgAplyList).
   * 카드 클릭 → 바텀시트(slide21).
   * 실목록(no.407~444) 에 대응 API 없음 — URL 임시. 통합목록(no.407)의 계약별 하위 목록이라
   * 별도 번호가 모바일 Y 로 누락됐을 가능성 있어 반입 전 확인 필요.
   */
  async selectPymtClmAplyList(ctrtNo: string): Promise<PymtClmAplyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.pymtClmAplyList)
    return apiClient.post<PymtClmAplyItem[], PymtClmAplyItem[]>(
      `/v1/wms/contracts/${ctrtNo}/payment-claim-applications`,
    )
  },

  // ── 선금신청서상세 (MUI-WM-01-M02) ────────────────────────────────────────

  /**
   * no.408 선금청구 신청상세 내역 조회 — MUI-WM-01-M02/T01
   * (prpayApfrDtl/PrpayApfrDtlPage). 차수·계약내용·신청금액·공급자. On-Load(slide28).
   * 구 `selectPrpayApfrDtl`.
   */
  async selectPrpayClmAplyDtl(id: string): Promise<PrpayApfrDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.prpayApfrDtl)
    return apiClient.post<PrpayApfrDtl, PrpayApfrDtl>('/cts/wm/birq/selectPrpayClmAplyDtl.do', {
      birqNo: id,
    })
  },

  /**
   * 선금 세부신청내역 조회 — MUI-WM-01-T02 (prpayApfrDtl/PrpayApfrDtl_AplyDtsm).
   * 실목록 외 — URL 임시. 설계서상 세부신청내역(dmt_aplyDsctnInfo)은 M02 데이터영역에 속하므로
   * 상세조회(no.408) 응답에 포함될 가능성이 높다(사후정산 M13 은 실제로 상세에 포함) — 반입 전 확인.
   */
  async selectPrpayAplyDsctns(id: string): Promise<PrpayAplyDsctnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.prpayAplyDsctns)
    return apiClient.post<PrpayAplyDsctnItem[], PrpayAplyDsctnItem[]>(
      `/v1/wms/prepayment-applications/${id}/details`,
    )
  },

  // ── 착·중도금신청서상세 (MUI-WM-01-M03) ───────────────────────────────────

  /**
   * no.421 착·중도금 신청상세 내역 조회 — MUI-WM-01-M03/T03
   * (dpsmnItrpyApfrDtl/DpsmnItrpyApfrDtlPage). 구 `selectDpsmnItrpyApfrDtl`.
   */
  async selectDpsmnItrpyAplyDtlDsctn(id: string): Promise<DpsmnItrpyApfrDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.dpsmnItrpyApfrDtl)
    return apiClient.post<DpsmnItrpyApfrDtl, DpsmnItrpyApfrDtl>(
      '/cts/wm/birq/selectDpsmnItrpyAplyDtlDsctn.do',
      { birqNo: id },
    )
  },

  /**
   * 착·중도금 세부신청내역 조회 — MUI-WM-01-T04 (dpsmnItrpyApfrDtl/DpsmnItrpyApfrDtl_AplyDtsm).
   * 실목록 외 — URL 임시(선금 T02 과 동일 사유: no.421 응답 포함 가능성).
   */
  async selectDpsmnItrpyAplyDsctns(id: string): Promise<DpsmnItrpyAplyDsctnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.dpsmnItrpyAplyDsctns)
    return apiClient.post<DpsmnItrpyAplyDsctnItem[], DpsmnItrpyAplyDsctnItem[]>(
      `/v1/wms/interim-payment-applications/${id}/details`,
    )
  },

  // ── 지급상태 (MUI-WM-01-T23, 상세 공용 탭) ────────────────────────────────

  /**
   * no.433 지급상태조회 — MUI-WM-01-T23
   * (prpayDpsmnItrpyGiveStts/PrpayDpsmnItrpyGiveStts, 상세 공용 탭). 구 `selectGiveSttsList`.
   */
  async selectGiveStts(id: string): Promise<GiveSttsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.giveSttsList)
    return apiClient.post<GiveSttsItem[], GiveSttsItem[]>('/cts/wm/birq/selectGiveStts.do', {
      birqNo: id,
    })
  },

  // ── 진행상태 (MUI-WM-01-T24, 상세 공용 탭) ────────────────────────────────

  /**
   * no.441 대금청구진행상태별조회 — MUI-WM-01-T24 (prcmPymtClmStts/PrcmPymtClmStts,
   * 대금청구 상세 M05·사후정산청구상세 M13 공용 탭). On-Load(slide81).
   * 구 `selectPymtClmPrgrsSttList` — 진행현황 목록(no.432, M11)과 다른 API 다.
   */
  async selectPymtClmPrgrsStts(id: string): Promise<PymtClmPrgrsSttItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.pymtClmPrgrsSttList)
    return apiClient.post<PymtClmPrgrsSttItem[], PymtClmPrgrsSttItem[]>(
      '/cts/wm/birq/selectPymtClmPrgrsStts.do',
      { birqNo: id },
    )
  },

  // ── 대금청구 상세(중앙조달) (MUI-WM-01-M05) ───────────────────────────────

  /**
   * no.429 대금청구신청상세 내역 조회 — MUI-WM-01-M05/T05~T08
   * (centerPrcmPymtClmDtl/CenterPrcmPymtClmDtlPage). 계약정보+신청대상+공급자+신청금액+세금계산서.
   * On-Load(slide45).
   *
   * ⚠️ no.429 는 대금청구 상세 4유형(중앙 M05 · 부대 M06 · 공사 M07 · 기성대가 M08)이 공유하는
   *   단일 엔드포인트로 판단해 4개 함수에 같은 URL 을 인라인했다(유형 분기는 요청 파라미터 추정,
   *   응답 구조가 유형별로 달라 함수·타입은 화면별로 유지). 유형별 별도 API 로 확인되면 해당 함수만 수정.
   */
  async selectCenterPrcmPymtClmDtl(id: string): Promise<CenterPrcmPymtClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.centerPrcmPymtClmDtl)
    return apiClient.post<CenterPrcmPymtClmDtl, CenterPrcmPymtClmDtl>(
      '/cts/wm/birq/selectPymtClmAplyDtlDsctn.do',
      { birqNo: id },
    )
  },

  // ── 대금청구상세(부대조달) (MUI-WM-01-M06) ────────────────────────────────

  /**
   * no.429 대금청구신청상세 내역 조회(부대조달) — MUI-WM-01-M06/T09~T12
   * (sbsdPrcmPymtClmDtl/SbsdPrcmPymtClmDtlPage). 계약정보+신청대상+업체+신청금액+첨부.
   * 엔드포인트 공유 사유는 `selectCenterPrcmPymtClmDtl` 주석 참고.
   */
  async selectSbsdPrcmPymtClmDtl(id: string): Promise<SbsdPrcmPymtClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.sbsdPrcmPymtClmDtl)
    return apiClient.post<SbsdPrcmPymtClmDtl, SbsdPrcmPymtClmDtl>(
      '/cts/wm/birq/selectPymtClmAplyDtlDsctn.do',
      { birqNo: id },
    )
  },

  // ── 대금청구상세(공사) (MUI-WM-01-M07) ────────────────────────────────────

  /**
   * no.429 대금청구신청상세 내역 조회(공사) — MUI-WM-01-M07/T13~T15
   * (cstrnPymtClmDtl/CstrnPymtClmDtlPage). 계약정보+비고+대가지급업체+첨부.
   * 엔드포인트 공유 사유는 `selectCenterPrcmPymtClmDtl` 주석 참고.
   */
  async selectCstrnPymtClmDtl(id: string): Promise<CstrnPymtClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.cstrnPymtClmDtl)
    return apiClient.post<CstrnPymtClmDtl, CstrnPymtClmDtl>(
      '/cts/wm/birq/selectPymtClmAplyDtlDsctn.do',
      { birqNo: id },
    )
  },

  // ── 대금청구상세(기성대가) (MUI-WM-01-M08) ────────────────────────────────

  /**
   * no.429 대금청구신청상세 내역 조회(기성대가) — MUI-WM-01-M08/T16~T19
   * (pxcndCstPymtClmDtl/PxcndCstPymtClmDtlPage). 계약정보+업체+기성대가 신청금액+세금계산서+첨부.
   * 엔드포인트 공유 사유는 `selectCenterPrcmPymtClmDtl` 주석 참고.
   */
  async selectPxcndCstPymtClmDtl(id: string): Promise<PxcndCstPymtClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.pxcndCstPymtClmDtl)
    return apiClient.post<PxcndCstPymtClmDtl, PxcndCstPymtClmDtl>(
      '/cts/wm/birq/selectPymtClmAplyDtlDsctn.do',
      { birqNo: id },
    )
  },

  // ── 사후정산청구상세 (MUI-WM-01-M13) ──────────────────────────────────────

  /**
   * no.439 사후정산 신청상세 내역 조회 — MUI-WM-01-M13/T20~T22
   * (epfcClclnClmDtl/EpfcClclnClmDtlPage). 차수+계약내용+신청금액+신청내역+공급자+세금계산서.
   * 구 `selectEpfcClclnClmDtl`.
   */
  async selectEpfcClcInAplyDtlDtsm(id: string): Promise<EpfcClclnClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.epfcClclnClmDtl)
    return apiClient.post<EpfcClclnClmDtl, EpfcClclnClmDtl>(
      '/cts/wm/birq/selectEpfcClcInAplyDtlDtsm.do',
      { birqNo: id },
    )
  },

  // ── 세금계산서 목록 (M05 T08 · M08 T18 · M13 T22 세금계산서 탭) ────────────

  /**
   * no.438 세금계산서 목록 조회 — 대금청구 상세의 세금계산서 탭(dlt_txBllList).
   * 현재 화면은 상세 응답(txBlls)으로 렌더하므로 훅 없이 함수만 둔다(소비처 생기면 훅 추가).
   */
  async selectTxivList(id: string): Promise<TxBllItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.centerPrcmPymtClmDtl.txBlls)
    return apiClient.post<TxBllItem[], TxBllItem[]>('/cts/wm/birq/selectTxivList.do', {
      birqNo: id,
    })
  },

  // ── 대금청구진행현황 (MUI-WM-01-M11) ──────────────────────────────────────

  /**
   * no.432 대금청구진행현황 목록 조회 — MUI-WM-01-M11 (pymtClmPrgrsPrst/PymtClmPrgrsPrstPage).
   * 키워드 필터/더보기 페이징은 페이지 클라이언트 로직. 구 `selectPymtClmPrgrsPrstList`.
   */
  async selectPymtClmPrgrsList(
    req: PymtClmPrgrsPrstRequest = {},
  ): Promise<PymtClmPrgrsPrstResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.pymtClmPrgrsPrstList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<PymtClmPrgrsPrstResult, PymtClmPrgrsPrstResult>(
      '/cts/wm/birq/selectPymtClmPrgrsList.do',
      req,
    )
  },

  // ── 대금지불정보(반납) (MUI-WM-01-M10) ────────────────────────────────────

  /**
   * no.431 대금지불정보(반납) 목록 조회 — MUI-WM-01-M10 (rtnPymtDfryInfo/RtnPymtDfryInfoPage).
   * 키워드 필터/더보기 페이징은 페이지 클라이언트 로직. 구 `selectRtnPymtDfryInfoList`.
   */
  async selectPymtDfryInfoRtnList(
    req: RtnPymtDfryInfoRequest = {},
  ): Promise<RtnPymtDfryInfoResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.rtnPymtDfryInfoList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<RtnPymtDfryInfoResult, RtnPymtDfryInfoResult>(
      '/cts/wm/birq/selectPymtDfryInfoRtnList.do',
      req,
    )
  },

  // ══ 국외 — OvsPymtClmController (no.446~457) ══════════════════════════════

  // ── 물품수령확인서목록 (MUI-WM-01-M71, 국외) ──────────────────────────────

  /**
   * no.446 물품수령확인서 목록 조회 — MUI-WM-01-M71
   * (ovsCmdtyRcvCnfdocList/OvsCmdtyRcvCnfdocListPage). 계약번호 필수(slide93 이벤트).
   * 구 `selectOvsCmdtyRcvCnfdocList`.
   */
  async selectGoodsReceiveConfirmList(
    req: OvsCmdtyRcvCnfdocRequest = {},
  ): Promise<OvsCmdtyRcvCnfdocResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.ovsCmdtyRcvCnfdocList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<OvsCmdtyRcvCnfdocResult, OvsCmdtyRcvCnfdocResult>(
      '/cts/wm/ovsPymtClm/selectGoodsReceiveConfirmList.do',
      req,
    )
  },

  // ── 전자계산서목록/상세 (MUI-WM-01-P73 · M74, 국외) ───────────────────────

  /**
   * 선택 물품수령확인서의 전자계산서 목록 조회 — MUI-WM-01-P73
   * (ovsCmdtyRcvCnfdocList/OvsElcrtTxivList, 바텀시트 콘텐츠).
   *
   * ⚠️ 전용 목록 API 가 없어 no.446 URL 을 공유한다 — 설계서 slide92 데이터영역이
   *   물품수령확인서목록(dl_goodsConfirmInfo)과 전자계산서목록(dl_billInfo)을 같은 화면(M71)에
   *   묶어 두어 한 응답에 실릴 가능성이 높다. 확인되면 이 함수를 지우고 446 응답에서 꺼내 쓸 것.
   */
  async selectOvsElcrtTxivList(ctrtNo: string): Promise<OvsElcrtTxivItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.ovsElcrtTxivList)
    return apiClient.post<OvsElcrtTxivItem[], OvsElcrtTxivItem[]>(
      '/cts/wm/ovsPymtClm/selectGoodsReceiveConfirmList.do',
      { ctrtNo },
    )
  },

  /**
   * no.449 전자계산서상세조회 — MUI-WM-01-M74 (ovsElcrtTxivDtl/OvsElcrtTxivDtlPage).
   * 구 `selectOvsElcrtTxivDtl`.
   */
  async selectElectronicBill(bilPblcnNo: string): Promise<OvsElcrtTxivDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.ovsElcrtTxivDtl)
    return apiClient.post<OvsElcrtTxivDtl, OvsElcrtTxivDtl>(
      '/cts/wm/ovsPymtClm/selectElectronicBill.do',
      { bilPblcnNo },
    )
  },

  /**
   * 전자계산서 품목정보 조회 — MUI-WM-01-M74 품목정보(slide95).
   * ⚠️ 전용 API 없음 — 품목정보(slide96 1.1)가 M74 데이터영역이라 상세(no.449) 응답 포함 가능성이
   *   높아 같은 URL 을 공유한다. 확인되면 이 함수를 지우고 449 응답에서 꺼내 쓸 것.
   */
  async selectOvsElcrtTxivItems(bilPblcnNo: string): Promise<OvsElcrtTxivItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.ovsElcrtTxivItems)
    return apiClient.post<OvsElcrtTxivItemRow[], OvsElcrtTxivItemRow[]>(
      '/cts/wm/ovsPymtClm/selectElectronicBill.do',
      { bilPblcnNo },
    )
  },

  // ── 대금지불정보 (MUI-WM-01-M75, 국외) ────────────────────────────────────

  /**
   * no.452 대금지불정보 조회 — MUI-WM-01-M75 (ovsRtnPymtDfryInfo/OvsRtnPymtDfryInfoPage).
   * On-Load 심사일자 = 1개월 전 ~ 현재일(slide102). 구 `selectOvsRtnPymtDfryInfoList`.
   */
  async selectPaymentList(req: OvsRtnPymtDfryInfoRequest = {}): Promise<OvsRtnPymtDfryInfoResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.ovsRtnPymtDfryInfoList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<OvsRtnPymtDfryInfoResult, OvsRtnPymtDfryInfoResult>(
      '/cts/wm/ovsPymtClm/selectPaymentList.do',
      req,
    )
  },

  // ── 대금지급현황 · 선적품목내역 (MUI-WM-01-M77 · P78, 국외) ───────────────

  /**
   * no.454 대금지급현황 조회 — MUI-WM-01-M77 (ovsPymtPrgrsList/OvsPymtPrgrsListPage).
   * 계약번호 필수 — 없으면 목록 미표시(slide103 2-2]). 구 `selectOvsPymtPrgrsList`.
   */
  async selectPaymentStatusList(req: OvsPymtPrgrsRequest = {}): Promise<OvsPymtPrgrsResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.ovsPymtPrgrsList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<OvsPymtPrgrsResult, OvsPymtPrgrsResult>(
      '/cts/wm/ovsPymtClm/selectPaymentStatusList.do',
      req,
    )
  },

  /**
   * no.455 선적품목내역조회 — MUI-WM-01-P78 (ovsPymtPrgrsList/OvsShpgItemDsctn, 바텀시트 콘텐츠).
   * 구 `selectOvsShpgItemDsctns`.
   */
  async selectPackingItemList(blNo: string): Promise<OvsShpgItemDsctnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.ovsShpgItemDsctns)
    return apiClient.post<OvsShpgItemDsctnItem[], OvsShpgItemDsctnItem[]>(
      '/cts/wm/ovsPymtClm/selectPackingItemList.do',
      { blNo },
    )
  },
}
