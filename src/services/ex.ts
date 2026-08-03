// 이행(EX) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// ⚠️ 폐쇄망 반입 후 실백엔드 경로 확정 시 EP 맵만 수정한다(메서드 본문 불변).
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_EX } from '@/mocks/ex'
import type {
  DlvgdsAvtsmtItem,
  InspDlvdocCmdtyItem,
  InspDlvdocDtl,
  InspDlvdocDtlSbsdPrcm,
  InspDlvdocItem,
  InspDlvdocSbsdCmdtyItem,
  InspIntgListRequest,
  InspIntgListResult,
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
}
