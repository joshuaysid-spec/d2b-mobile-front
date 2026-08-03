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
  InspDlvdocItem,
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
}
