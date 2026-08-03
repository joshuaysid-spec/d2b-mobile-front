// 대금청구/사후(WM) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// ⚠️ 폐쇄망 반입 후 실백엔드 경로 확정 시 EP 맵만 수정한다(메서드 본문 불변).
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_WM } from '@/mocks/wm'
import type {
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
}
