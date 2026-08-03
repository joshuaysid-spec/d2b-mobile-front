// 대금청구/사후(WM) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// ⚠️ 폐쇄망 반입 후 실백엔드 경로 확정 시 EP 맵만 수정한다(메서드 본문 불변).
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
} from '@/types/wm'

const EP = {
  /** 대금청구통합목록 — MUI-WM-01-M01 (pymtClmIntgList/PymtClmIntgListPage) */
  PYMT_CLM_INTG_LIST: '/v1/wms/payment-claims',
  /** 대금청구신청목록 — MUI-WM-01-P13 (pymtClmIntgList/PymtClmIntgAplyList) */
  PYMT_CLM_APLY_LIST: (ctrtNo: string) =>
    `/v1/wms/contracts/${ctrtNo}/payment-claim-applications`,
  /** 선금신청서상세 — MUI-WM-01-M02/T01 (prpayApfrDtl/PrpayApfrDtlPage) */
  PRPAY_APFR_DTL: (id: string) => `/v1/wms/prepayment-applications/${id}`,
  /** 선금 세부신청내역 — MUI-WM-01-T02 (prpayApfrDtl/PrpayApfrDtl_AplyDtsm) */
  PRPAY_APLY_DSCTNS: (id: string) => `/v1/wms/prepayment-applications/${id}/details`,
  /** 착·중도금신청서상세 — MUI-WM-01-M03/T03 (dpsmnItrpyApfrDtl/DpsmnItrpyApfrDtlPage) */
  DPSMN_ITRPY_APFR_DTL: (id: string) => `/v1/wms/interim-payment-applications/${id}`,
  /** 착·중도금 세부신청내역 — MUI-WM-01-T04 (dpsmnItrpyApfrDtl/DpsmnItrpyApfrDtl_AplyDtsm) */
  DPSMN_ITRPY_APLY_DSCTNS: (id: string) => `/v1/wms/interim-payment-applications/${id}/details`,
  /** 지급상태 — MUI-WM-01-T23 (prpayDpsmnItrpyGiveStts/PrpayDpsmnItrpyGiveStts, 상세 공용 탭) */
  GIVE_STTS_LIST: (id: string) => `/v1/wms/payment-claims/${id}/payment-statuses`,
  /** 대금청구 상세(중앙조달) — MUI-WM-01-M05/T05~T08 (centerPrcmPymtClmDtl/CenterPrcmPymtClmDtlPage) */
  CENTER_PRCM_PYMT_CLM_DTL: (id: string) => `/v1/wms/central-payment-claims/${id}`,
  /** 대금청구상세(부대조달) — MUI-WM-01-M06/T09~T12 (sbsdPrcmPymtClmDtl/SbsdPrcmPymtClmDtlPage) */
  SBSD_PRCM_PYMT_CLM_DTL: (id: string) => `/v1/wms/subsidiary-payment-claims/${id}`,
  /** 대금청구상세(공사) — MUI-WM-01-M07/T13~T15 (cstrnPymtClmDtl/CstrnPymtClmDtlPage) */
  CSTRN_PYMT_CLM_DTL: (id: string) => `/v1/wms/construction-payment-claims/${id}`,
  /** 대금청구상세(기성대가) — MUI-WM-01-M08/T16~T19 (pxcndCstPymtClmDtl/PxcndCstPymtClmDtlPage) */
  PXCND_CST_PYMT_CLM_DTL: (id: string) => `/v1/wms/progress-payment-claims/${id}`,
  /** 사후정산청구상세 — MUI-WM-01-M13/T20~T22 (epfcClclnClmDtl/EpfcClclnClmDtlPage) */
  EPFC_CLCLN_CLM_DTL: (id: string) => `/v1/wms/post-settlement-claims/${id}`,
}

export const wmService = {
  // ── 대금청구통합목록 (MUI-WM-01-M01) ──────────────────────────────────────

  /** 대금청구통합목록 조회 — 키워드 필터/더보기 페이징은 페이지 클라이언트 로직(서버 전환 시 req 로 이행). */
  async getPymtClmIntgList(req: PymtClmIntgListRequest = {}): Promise<PymtClmIntgListResult> {
    if (USE_MOCK) {
      const list = MOCK_WM.pymtClmIntgList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<PymtClmIntgListResult, PymtClmIntgListResult>(
      EP.PYMT_CLM_INTG_LIST,
      req,
    )
  },

  // ── 대금청구신청목록 (MUI-WM-01-P13) ──────────────────────────────────────

  /** 선택 계약의 대금청구 신청 목록 조회(카드 클릭 → 바텀시트, slide21). */
  async getPymtClmAplyList(ctrtNo: string): Promise<PymtClmAplyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.pymtClmAplyList)
    return apiClient.post<PymtClmAplyItem[], PymtClmAplyItem[]>(EP.PYMT_CLM_APLY_LIST(ctrtNo))
  },

  // ── 선금신청서상세 (MUI-WM-01-M02) ────────────────────────────────────────

  /** 상세(차수·계약내용·신청금액·공급자) 조회 — On-Load(slide28). */
  async getPrpayApfrDtl(id: string): Promise<PrpayApfrDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.prpayApfrDtl)
    return apiClient.post<PrpayApfrDtl, PrpayApfrDtl>(EP.PRPAY_APFR_DTL(id))
  },

  /** 세부신청내역(T02) 조회. */
  async getPrpayAplyDsctns(id: string): Promise<PrpayAplyDsctnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.prpayAplyDsctns)
    return apiClient.post<PrpayAplyDsctnItem[], PrpayAplyDsctnItem[]>(EP.PRPAY_APLY_DSCTNS(id))
  },

  // ── 착·중도금신청서상세 (MUI-WM-01-M03) ───────────────────────────────────

  /** 상세 조회. */
  async getDpsmnItrpyApfrDtl(id: string): Promise<DpsmnItrpyApfrDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.dpsmnItrpyApfrDtl)
    return apiClient.post<DpsmnItrpyApfrDtl, DpsmnItrpyApfrDtl>(EP.DPSMN_ITRPY_APFR_DTL(id))
  },

  /** 세부신청내역(T04) 조회. */
  async getDpsmnItrpyAplyDsctns(id: string): Promise<DpsmnItrpyAplyDsctnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.dpsmnItrpyAplyDsctns)
    return apiClient.post<DpsmnItrpyAplyDsctnItem[], DpsmnItrpyAplyDsctnItem[]>(
      EP.DPSMN_ITRPY_APLY_DSCTNS(id),
    )
  },

  // ── 지급상태 (MUI-WM-01-T23, 상세 공용 탭) ────────────────────────────────

  /** 지급상태 목록 조회. */
  async getGiveSttsList(id: string): Promise<GiveSttsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_WM.giveSttsList)
    return apiClient.post<GiveSttsItem[], GiveSttsItem[]>(EP.GIVE_STTS_LIST(id))
  },

  // ── 대금청구 상세(중앙조달) (MUI-WM-01-M05) ───────────────────────────────

  /** 상세(계약정보+신청대상+공급자+신청금액+세금계산서) 조회 — On-Load(slide45). */
  async getCenterPrcmPymtClmDtl(id: string): Promise<CenterPrcmPymtClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.centerPrcmPymtClmDtl)
    return apiClient.post<CenterPrcmPymtClmDtl, CenterPrcmPymtClmDtl>(
      EP.CENTER_PRCM_PYMT_CLM_DTL(id),
    )
  },

  // ── 대금청구상세(부대조달) (MUI-WM-01-M06) ────────────────────────────────

  /** 상세(계약정보+신청대상+업체+신청금액+첨부) 조회. */
  async getSbsdPrcmPymtClmDtl(id: string): Promise<SbsdPrcmPymtClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.sbsdPrcmPymtClmDtl)
    return apiClient.post<SbsdPrcmPymtClmDtl, SbsdPrcmPymtClmDtl>(
      EP.SBSD_PRCM_PYMT_CLM_DTL(id),
    )
  },

  // ── 대금청구상세(공사) (MUI-WM-01-M07) ────────────────────────────────────

  /** 상세(계약정보+비고+대가지급업체+첨부) 조회. */
  async getCstrnPymtClmDtl(id: string): Promise<CstrnPymtClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.cstrnPymtClmDtl)
    return apiClient.post<CstrnPymtClmDtl, CstrnPymtClmDtl>(EP.CSTRN_PYMT_CLM_DTL(id))
  },

  // ── 대금청구상세(기성대가) (MUI-WM-01-M08) ────────────────────────────────

  /** 상세(계약정보+업체+기성대가 신청금액+세금계산서+첨부) 조회. */
  async getPxcndCstPymtClmDtl(id: string): Promise<PxcndCstPymtClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.pxcndCstPymtClmDtl)
    return apiClient.post<PxcndCstPymtClmDtl, PxcndCstPymtClmDtl>(
      EP.PXCND_CST_PYMT_CLM_DTL(id),
    )
  },

  // ── 사후정산청구상세 (MUI-WM-01-M13) ──────────────────────────────────────

  /** 상세(차수+계약내용+신청금액+신청내역+공급자+세금계산서) 조회. */
  async getEpfcClclnClmDtl(id: string): Promise<EpfcClclnClmDtl> {
    if (USE_MOCK) return mockDelay(MOCK_WM.epfcClclnClmDtl)
    return apiClient.post<EpfcClclnClmDtl, EpfcClclnClmDtl>(EP.EPFC_CLCLN_CLM_DTL(id))
  },
}
