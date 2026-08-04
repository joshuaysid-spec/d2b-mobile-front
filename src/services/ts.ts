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
  TxivCtrtListRequest,
  TxivCtrtListResult,
  TxivDtl,
  TxivItem,
  TxivPrgrsPrstRequest,
  TxivPrgrsPrstResult,
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
  /** 세금계산서계약목록 — MUI-TS-04-M01 (txivList_CtrtList/TxivList_CtrtListPage) */
  TXIV_CTRT_LIST: '/v1/tss/tax-invoice-contracts',
  /** 세금계산서목록 — MUI-TS-04-P02 (txivList_CtrtList/TxivList) */
  TXIV_LIST: (ctrtNo: string) => `/v1/tss/tax-invoice-contracts/${ctrtNo}/tax-invoices`,
  /** 세금계산서상세 — MUI-TS-04-M03 (txivDtl/TxivDtlPage) */
  TXIV_DTL: (id: string) => `/v1/tss/tax-invoices/${id}`,
  /** 세금계산서진행현황 — MUI-TS-04-M04 (txivPrgrsPrst/TxivPrgrsPrstPage) */
  TXIV_PRGRS_PRST_LIST: '/v1/tss/tax-invoice-progresses',
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

  // ── 세금계산서계약목록 (MUI-TS-04-M01) ────────────────────────────────────

  /** 계약목록 조회 — 계약연도 기본 현재 연도(slide24). */
  async getTxivCtrtList(req: TxivCtrtListRequest = {}): Promise<TxivCtrtListResult> {
    if (USE_MOCK) {
      const list = MOCK_TS.txivCtrtList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<TxivCtrtListResult, TxivCtrtListResult>(EP.TXIV_CTRT_LIST, req)
  },

  // ── 세금계산서목록 (MUI-TS-04-P02) ────────────────────────────────────────

  /** 선택 계약의 세금계산서 목록 조회(카드 클릭 → 바텀시트, slide22). */
  async getTxivList(ctrtNo: string): Promise<TxivItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_TS.txivList)
    return apiClient.post<TxivItem[], TxivItem[]>(EP.TXIV_LIST(ctrtNo))
  },

  // ── 세금계산서상세 (MUI-TS-04-M03) ────────────────────────────────────────

  /** 상세(계약정보+공급자/공급받는자+계약서 일반정보) 조회. */
  async getTxivDtl(id: string): Promise<TxivDtl> {
    if (USE_MOCK) return mockDelay(MOCK_TS.txivDtl)
    return apiClient.post<TxivDtl, TxivDtl>(EP.TXIV_DTL(id))
  },

  // ── 세금계산서진행현황 (MUI-TS-04-M04) ────────────────────────────────────

  /** 진행현황 목록 조회. */
  async getTxivPrgrsPrstList(req: TxivPrgrsPrstRequest = {}): Promise<TxivPrgrsPrstResult> {
    if (USE_MOCK) {
      const list = MOCK_TS.txivPrgrsPrstList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<TxivPrgrsPrstResult, TxivPrgrsPrstResult>(
      EP.TXIV_PRGRS_PRST_LIST,
      req,
    )
  },
}
