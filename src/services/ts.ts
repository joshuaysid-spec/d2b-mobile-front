// 업무지원(TS) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// ⚠️ 폐쇄망 반입 후 실백엔드 경로 확정 시 EP 맵만 수정한다(메서드 본문 불변).
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_TS } from '@/mocks/ts'
import type {
  BfhdLoiDtl,
  BfhdLoiListRequest,
  BfhdLoiListResult,
  BfhdLoiOpnnRequest,
  BfhdLoiSpcfctItem,
} from '@/types/ts'

const EP = {
  /** 사전의향서목록 — MUI-TS-01-M01 (bfhdLoiList/BfhdLoiListPage) */
  BFHD_LOI_LIST: '/v1/tss/letters-of-intent',
  /** 사전의향서상세 — MUI-TS-01-M02/T01 (bfhdLoiDtl/BfhdLoiDtlPage) */
  BFHD_LOI_DTL: (id: string) => `/v1/tss/letters-of-intent/${id}`,
  /** 품목명세서 목록 — MUI-TS-01-T02 (bfhdLoiDtl/BfhdLoiDtl_ItemList) */
  BFHD_LOI_SPCFCTS: (id: string) => `/v1/tss/letters-of-intent/${id}/item-specs`,
  /** 의견작성 임시저장/제출 — MUI-TS-01-P03 (bfhdLoiDtl/BfhdLoiWrt) */
  BFHD_LOI_OPNN: (id: string) => `/v1/tss/letters-of-intent/${id}/opinions`,
}

export const tsService = {
  // ── 사전의향서목록 (MUI-TS-01-M01) ────────────────────────────────────────

  /** 사전의향서목록 조회 — On-Load: 접수기간 현재일자(slide11). */
  async getBfhdLoiList(req: BfhdLoiListRequest = {}): Promise<BfhdLoiListResult> {
    if (USE_MOCK) {
      const list = MOCK_TS.bfhdLoiList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<BfhdLoiListResult, BfhdLoiListResult>(EP.BFHD_LOI_LIST, req)
  },

  // ── 사전의향서상세 (MUI-TS-01-M02) ────────────────────────────────────────

  /** 상세(집행계획+문의처) 조회. */
  async getBfhdLoiDtl(id: string): Promise<BfhdLoiDtl> {
    if (USE_MOCK) return mockDelay(MOCK_TS.bfhdLoiDtl)
    return apiClient.post<BfhdLoiDtl, BfhdLoiDtl>(EP.BFHD_LOI_DTL(id))
  },

  /** 품목명세서 목록(T02) 조회. */
  async getBfhdLoiSpcfcts(id: string): Promise<BfhdLoiSpcfctItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_TS.bfhdLoiSpcfctList)
    return apiClient.post<BfhdLoiSpcfctItem[], BfhdLoiSpcfctItem[]>(EP.BFHD_LOI_SPCFCTS(id))
  },

  // ── 의견작성 (MUI-TS-01-P03) ──────────────────────────────────────────────

  /** 의견 임시저장(mode='save')/제출(mode='submit') — slide15. */
  async saveBfhdLoiOpnn(req: BfhdLoiOpnnRequest): Promise<void> {
    if (USE_MOCK) {
      console.log('[tsService] 의견작성(목업)', req)
      return mockDelay(undefined)
    }
    return apiClient.post<void, void>(EP.BFHD_LOI_OPNN(req.bfhdLoiNo), req)
  },
}
