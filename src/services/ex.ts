// 이행(EX) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// ⚠️ 폐쇄망 반입 후 실백엔드 경로 확정 시 EP 맵만 수정한다(메서드 본문 불변).
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_EX } from '@/mocks/ex'
import type {
  DlvdocRsltCmdtyItem,
  DlvdocRsltDtl,
  DlvgdsAvtsmtItem,
  InspDlvdocCmdtyItem,
  InspDlvdocDtl,
  InspDlvdocDtlSbsdPrcm,
  InspDlvdocItem,
  InspDlvdocPrstRequest,
  InspDlvdocPrstResult,
  InspDlvdocSbsdCmdtyItem,
  InspIntgListRequest,
  InspIntgListResult,
  OvsEstmtNtdcDtl,
  OvsEstmtNtdcItemRow,
  OvsEstmtNtdcListResult,
  OvsEstmtRqdcDtl,
  OvsEstmtRqdcItemRow,
  OvsEstmtRqdcListRequest,
  OvsEstmtRqdcListResult,
  OvsOrderNtdcDtl,
  OvsOrderNtdcItemRow,
  OvsOrderNtdcListResult,
  OvsOrderRqdcDtl,
  OvsOrderRqdcItemRow,
  OvsOrderRqdcListRequest,
  OvsOrderRqdcListResult,
  PxcndCmcnInspDtl,
} from '@/types/ex'

const EP = {
  /** 검사통합목록 — MUI-EX-01-M01 (inspIntgListInq/InspIntgListInqPage) */
  INSP_INTG_LIST: '/v1/exs/inspections',
  /** 납품통지목록 — MUI-EX-01-P10 (inspIntgListInq/DlvgdsAvtsmtListFullPopup) */
  DLVGDS_AVTSMT_LIST: (ctrtNo: string) => `/v1/exs/contracts/${ctrtNo}/delivery-notices`,
  /** 검사및납품조서목록 — MUI-EX-01-P11 (inspIntgListInq/InspDlvdocList) */
  INSP_DLVDOC_LIST: (ctrtNo: string, avtsmtNo: string) =>
    `/v1/exs/contracts/${ctrtNo}/delivery-notices/${avtsmtNo}/delivery-docs`,
  /** 검사및납품조서상세(중앙조달) — MUI-EX-01-M02/T01 (inspDlvdocDtl/InspDlvdocDtlPage) */
  INSP_DLVDOC_DTL: (id: string) => `/v1/exs/delivery-docs/${id}`,
  /** 검사및납품조서상세 물품목록 — MUI-EX-01-T02 (inspDlvdocDtl/InspDlvdocDtl_CmdtyList) */
  INSP_DLVDOC_CMDTYS: (id: string) => `/v1/exs/delivery-docs/${id}/commodities`,
  /** 검사및납품조서상세(부대조달) — MUI-EX-01-M03/T03 (inspDlvdocDtlSbsdPrcm/InspDlvdocDtlSbsdPrcmPage) */
  INSP_DLVDOC_SBSD_DTL: (id: string) => `/v1/exs/subsidiary-delivery-docs/${id}`,
  /** 부대조달 물품목록 — MUI-EX-01-T04 (inspDlvdocDtlSbsdPrcm/InspDlvdocDtlSbsdPrcm_CmdtyList) */
  INSP_DLVDOC_SBSD_CMDTYS: (id: string) => `/v1/exs/subsidiary-delivery-docs/${id}/commodities`,
  /** 기성및준공검사상세 — MUI-EX-01-M04 (pxcndCmcnInspDtl/PxcndCmcnInspDtlPage) */
  PXCND_CMCN_INSP_DTL: (id: string) => `/v1/exs/completion-inspections/${id}`,
  /** 검사및납품조서현황목록 — MUI-EX-01-M05 (inspDlvdocPrst/InspDlvdocPrstPage) */
  INSP_DLVDOC_PRST_LIST: '/v1/exs/delivery-doc-statuses',
  /** 견적의뢰서목록 — MUI-EX-02-M71 (ovsEstmtRqdcList/OvsEstmtRqdcListPage) */
  OVS_ESTMT_RQDC_LIST: '/v1/exs/estimate-requests',
  /** 견적의뢰서상세 — MUI-EX-02-M72/T71 (ovsEstmtRqdcDtl/OvsEstmtRqdcDtlPage) */
  OVS_ESTMT_RQDC_DTL: (id: string) => `/v1/exs/estimate-requests/${id}`,
  /** 견적의뢰서 품목목록 — MUI-EX-02-T72 (ovsEstmtRqdcDtl/OvsEstmtRqdcDtl_CmdtyList) */
  OVS_ESTMT_RQDC_ITEMS: (id: string) => `/v1/exs/estimate-requests/${id}/items`,
  /** 견적통보서목록 — MUI-EX-02-M73 (ovsEstmtNtdcList/OvsEstmtNtdcListPage) */
  OVS_ESTMT_NTDC_LIST: '/v1/exs/estimate-notices',
  /** 견적통보서상세 — MUI-EX-02-M74/T73 (ovsEstmtNtdcDtl/OvsEstmtNtdcDtlPage) */
  OVS_ESTMT_NTDC_DTL: (id: string) => `/v1/exs/estimate-notices/${id}`,
  /** 견적통보서 품목목록 — MUI-EX-02-T74 (ovsEstmtNtdcDtl/OvsEstmtNtdcDtl_CmdtyList) */
  OVS_ESTMT_NTDC_ITEMS: (id: string) => `/v1/exs/estimate-notices/${id}/items`,
  /** 발주의뢰서목록 — MUI-EX-02-M75 (ovsOrderRqdcList/OvsOrderRqdcListPage) */
  OVS_ORDER_RQDC_LIST: '/v1/exs/order-requests',
  /** 발주의뢰서상세 — MUI-EX-02-M76/T75 (ovsOrderRqdcDtl/OvsOrderRqdcDtlPage) */
  OVS_ORDER_RQDC_DTL: (id: string) => `/v1/exs/order-requests/${id}`,
  /** 발주의뢰서 품목목록 — MUI-EX-02-T76 (ovsOrderRqdcDtl/OvsOrderRqdcDtl_CmdtyList) */
  OVS_ORDER_RQDC_ITEMS: (id: string) => `/v1/exs/order-requests/${id}/items`,
  /** 발주통보서목록 — MUI-EX-02-M77 (ovsOrderNtdcList/OvsOrderNtdcListPage) */
  OVS_ORDER_NTDC_LIST: '/v1/exs/order-notices',
  /** 발주통보서상세 — MUI-EX-02-M78/T77 (ovsOrderNtdcDtl/OvsOrderNtdcDtlPage) */
  OVS_ORDER_NTDC_DTL: (id: string) => `/v1/exs/order-notices/${id}`,
  /** 발주통보서 품목목록 — MUI-EX-02-T78 (ovsOrderNtdcDtl/OvsOrderNtdcDtl_CmdtyList) */
  OVS_ORDER_NTDC_ITEMS: (id: string) => `/v1/exs/order-notices/${id}/items`,
  /** 검사및납품조서결과상세 — MUI-EX-01-M07/T05 (dlvdocRsltDtl/DlvdocRsltDtlPage) */
  DLVDOC_RSLT_DTL: (id: string) => `/v1/exs/delivery-doc-results/${id}`,
  /** 결과상세 물품목록 — MUI-EX-01-T06 (dlvdocRsltDtl/DlvdocRsltDtl_CmdtyList) */
  DLVDOC_RSLT_CMDTYS: (id: string) => `/v1/exs/delivery-doc-results/${id}/commodities`,
}

export const exService = {
  // ── 검사통합목록 (MUI-EX-01-M01) ──────────────────────────────────────────

  /** 검사통합목록 조회 — 키워드 필터/더보기 페이징은 페이지 클라이언트 로직(서버 전환 시 req 로 이행). */
  async getInspIntgList(req: InspIntgListRequest = {}): Promise<InspIntgListResult> {
    if (USE_MOCK) {
      const list = MOCK_EX.inspIntgList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<InspIntgListResult, InspIntgListResult>(EP.INSP_INTG_LIST, req)
  },

  // ── 납품통지목록 (MUI-EX-01-P10) ──────────────────────────────────────────

  /** 계약번호에 물린 납품통지 목록 조회(기간 제한 없음, slide13 On-Load). */
  async getDlvgdsAvtsmtList(ctrtNo: string): Promise<DlvgdsAvtsmtItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.dlvgdsAvtsmtList)
    return apiClient.post<DlvgdsAvtsmtItem[], DlvgdsAvtsmtItem[]>(
      EP.DLVGDS_AVTSMT_LIST(ctrtNo),
    )
  },

  // ── 검사및납품조서목록 (MUI-EX-01-P11) ────────────────────────────────────

  /** 선택 납품통지의 검사및납품조서 목록 조회. */
  async getInspDlvdocList(ctrtNo: string, avtsmtNo: string): Promise<InspDlvdocItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.inspDlvdocList)
    return apiClient.post<InspDlvdocItem[], InspDlvdocItem[]>(
      EP.INSP_DLVDOC_LIST(ctrtNo, avtsmtNo),
    )
  },

  // ── 검사및납품조서상세(중앙조달) (MUI-EX-01-M02) ──────────────────────────

  /** 상세(계약정보+비고+요약) 조회 — On-Load: 계약번호에 해당하는 계약정보 조회(slide20). */
  async getInspDlvdocDtl(id: string): Promise<InspDlvdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.inspDlvdocDtl)
    return apiClient.post<InspDlvdocDtl, InspDlvdocDtl>(EP.INSP_DLVDOC_DTL(id))
  },

  /** 물품목록(T02) 조회. */
  async getInspDlvdocCmdtys(id: string): Promise<InspDlvdocCmdtyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.inspDlvdocCmdtyList)
    return apiClient.post<InspDlvdocCmdtyItem[], InspDlvdocCmdtyItem[]>(
      EP.INSP_DLVDOC_CMDTYS(id),
    )
  },

  // ── 검사및납품조서상세(부대조달) (MUI-EX-01-M03) ──────────────────────────

  /** 부대조달 상세(계약정보+업체정보+이행정보) 조회. */
  async getInspDlvdocSbsdDtl(id: string): Promise<InspDlvdocDtlSbsdPrcm> {
    if (USE_MOCK) return mockDelay(MOCK_EX.inspDlvdocSbsdDtl)
    return apiClient.post<InspDlvdocDtlSbsdPrcm, InspDlvdocDtlSbsdPrcm>(
      EP.INSP_DLVDOC_SBSD_DTL(id),
    )
  },

  /** 부대조달 물품목록(T04) 조회. */
  async getInspDlvdocSbsdCmdtys(id: string): Promise<InspDlvdocSbsdCmdtyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.inspDlvdocSbsdCmdtyList)
    return apiClient.post<InspDlvdocSbsdCmdtyItem[], InspDlvdocSbsdCmdtyItem[]>(
      EP.INSP_DLVDOC_SBSD_CMDTYS(id),
    )
  },

  // ── 기성및준공검사상세 (MUI-EX-01-M04) ────────────────────────────────────

  /** 상세(계약정보+검사관+감독관) 조회 — On-Load(slide29). */
  async getPxcndCmcnInspDtl(id: string): Promise<PxcndCmcnInspDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.pxcndCmcnInspDtl)
    return apiClient.post<PxcndCmcnInspDtl, PxcndCmcnInspDtl>(EP.PXCND_CMCN_INSP_DTL(id))
  },

  // ── 검사및납품조서현황목록 (MUI-EX-01-M05) ────────────────────────────────

  /** 현황 목록 조회 — 키워드 필터/더보기 페이징은 페이지 클라이언트 로직(서버 전환 시 req 로 이행). */
  async getInspDlvdocPrstList(req: InspDlvdocPrstRequest = {}): Promise<InspDlvdocPrstResult> {
    if (USE_MOCK) {
      const list = MOCK_EX.inspDlvdocPrstList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<InspDlvdocPrstResult, InspDlvdocPrstResult>(
      EP.INSP_DLVDOC_PRST_LIST,
      req,
    )
  },

  // ── 검사및납품조서결과상세 (MUI-EX-01-M07) ────────────────────────────────

  /** 결과상세(계약정보+업체+정비+이행정보) 조회. */
  async getDlvdocRsltDtl(id: string): Promise<DlvdocRsltDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.dlvdocRsltDtl)
    return apiClient.post<DlvdocRsltDtl, DlvdocRsltDtl>(EP.DLVDOC_RSLT_DTL(id))
  },

  /** 결과상세 물품목록(T06) 조회. */
  async getDlvdocRsltCmdtys(id: string): Promise<DlvdocRsltCmdtyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.dlvdocRsltCmdtyList)
    return apiClient.post<DlvdocRsltCmdtyItem[], DlvdocRsltCmdtyItem[]>(
      EP.DLVDOC_RSLT_CMDTYS(id),
    )
  },

  // ── 견적의뢰서 (MUI-EX-02-M71·M72) ────────────────────────────────────────

  /** 견적의뢰서목록 조회 — On-Load: 수신일 5년전~현재(slide48). */
  async getOvsEstmtRqdcList(req: OvsEstmtRqdcListRequest = {}): Promise<OvsEstmtRqdcListResult> {
    if (USE_MOCK) {
      const list = MOCK_EX.ovsEstmtRqdcList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<OvsEstmtRqdcListResult, OvsEstmtRqdcListResult>(
      EP.OVS_ESTMT_RQDC_LIST,
      req,
    )
  },

  /** 견적의뢰서상세(계약정보) 조회. */
  async getOvsEstmtRqdcDtl(id: string): Promise<OvsEstmtRqdcDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsEstmtRqdcDtl)
    return apiClient.post<OvsEstmtRqdcDtl, OvsEstmtRqdcDtl>(EP.OVS_ESTMT_RQDC_DTL(id))
  },

  /** 견적의뢰서 품목목록(T72) 조회. */
  async getOvsEstmtRqdcItems(id: string): Promise<OvsEstmtRqdcItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsEstmtRqdcItems)
    return apiClient.post<OvsEstmtRqdcItemRow[], OvsEstmtRqdcItemRow[]>(
      EP.OVS_ESTMT_RQDC_ITEMS(id),
    )
  },

  // ── 견적통보서 (MUI-EX-02-M73·M74) ────────────────────────────────────────

  /** 견적통보서목록(상단 계약정보 + 연계 견적 목록) 조회. */
  async getOvsEstmtNtdcList(ctrtNo?: string): Promise<OvsEstmtNtdcListResult> {
    if (USE_MOCK) {
      const list = MOCK_EX.ovsEstmtNtdcList
      return mockDelay({ ctrtInfo: MOCK_EX.ovsEstmtNtdcCtrtInfo, list, total: list.length })
    }
    return apiClient.post<OvsEstmtNtdcListResult, OvsEstmtNtdcListResult>(
      EP.OVS_ESTMT_NTDC_LIST,
      { ctrtNo },
    )
  },

  /** 견적통보서상세(계약정보+품목수) 조회. */
  async getOvsEstmtNtdcDtl(id: string): Promise<OvsEstmtNtdcDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsEstmtNtdcDtl)
    return apiClient.post<OvsEstmtNtdcDtl, OvsEstmtNtdcDtl>(EP.OVS_ESTMT_NTDC_DTL(id))
  },

  /** 견적통보서 품목목록(T74) 조회. */
  async getOvsEstmtNtdcItems(id: string): Promise<OvsEstmtNtdcItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsEstmtNtdcItems)
    return apiClient.post<OvsEstmtNtdcItemRow[], OvsEstmtNtdcItemRow[]>(
      EP.OVS_ESTMT_NTDC_ITEMS(id),
    )
  },

  // ── 발주의뢰서 (MUI-EX-02-M75·M76) ────────────────────────────────────────

  /** 발주의뢰서목록 조회 — On-Load: 수신일 5년전~현재(slide67). */
  async getOvsOrderRqdcList(req: OvsOrderRqdcListRequest = {}): Promise<OvsOrderRqdcListResult> {
    if (USE_MOCK) {
      const list = MOCK_EX.ovsOrderRqdcList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<OvsOrderRqdcListResult, OvsOrderRqdcListResult>(
      EP.OVS_ORDER_RQDC_LIST,
      req,
    )
  },

  /** 발주의뢰서상세(계약정보) 조회. */
  async getOvsOrderRqdcDtl(id: string): Promise<OvsOrderRqdcDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsOrderRqdcDtl)
    return apiClient.post<OvsOrderRqdcDtl, OvsOrderRqdcDtl>(EP.OVS_ORDER_RQDC_DTL(id))
  },

  /** 발주의뢰서 품목목록(T76) 조회. */
  async getOvsOrderRqdcItems(id: string): Promise<OvsOrderRqdcItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsOrderRqdcItems)
    return apiClient.post<OvsOrderRqdcItemRow[], OvsOrderRqdcItemRow[]>(
      EP.OVS_ORDER_RQDC_ITEMS(id),
    )
  },

  // ── 발주통보서 (MUI-EX-02-M77·M78) ────────────────────────────────────────

  /** 발주통보서목록(상단 계약정보 + 목록) 조회. */
  async getOvsOrderNtdcList(ctrtNo?: string): Promise<OvsOrderNtdcListResult> {
    if (USE_MOCK) {
      const list = MOCK_EX.ovsOrderNtdcList
      return mockDelay({ ctrtInfo: MOCK_EX.ovsEstmtNtdcCtrtInfo, list, total: list.length })
    }
    return apiClient.post<OvsOrderNtdcListResult, OvsOrderNtdcListResult>(EP.OVS_ORDER_NTDC_LIST, {
      ctrtNo,
    })
  },

  /** 발주통보서상세(계약정보+품목수) 조회. */
  async getOvsOrderNtdcDtl(id: string): Promise<OvsOrderNtdcDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsOrderNtdcDtl)
    return apiClient.post<OvsOrderNtdcDtl, OvsOrderNtdcDtl>(EP.OVS_ORDER_NTDC_DTL(id))
  },

  /** 발주통보서 품목목록(T78) 조회. */
  async getOvsOrderNtdcItems(id: string): Promise<OvsOrderNtdcItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsOrderNtdcItems)
    return apiClient.post<OvsOrderNtdcItemRow[], OvsOrderNtdcItemRow[]>(
      EP.OVS_ORDER_NTDC_ITEMS(id),
    )
  },
}
