// 업무지원(TS) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: tsKeys.selectXxx / useSelectXxx) — 실규격 확정 전 임시 명명(select~ 스타일).
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로 확정 시 해당 함수만 수정).
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

export const tsService = {
  // ── 사전의향서목록 (MUI-TS-01-M01) ────────────────────────────────────────

  /** 사전의향서목록 조회 — MUI-TS-01-M01 (bfhdLoiList/BfhdLoiListPage). On-Load: 접수기간 현재일자(slide11). */
  async selectBfhdLoiList(req: BfhdLoiListRequest = {}): Promise<BfhdLoiListResult> {
    if (USE_MOCK) {
      const list = MOCK_TS.bfhdLoiList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<BfhdLoiListResult, BfhdLoiListResult>(
      '/v1/tss/letters-of-intent',
      req,
    )
  },

  // ── 사전의향서상세 (MUI-TS-01-M02) ────────────────────────────────────────

  /** 사전의향서상세(집행계획+문의처) 조회 — MUI-TS-01-M02/T01 (bfhdLoiDtl/BfhdLoiDtlPage). */
  async selectBfhdLoiDtl(id: string): Promise<BfhdLoiDtl> {
    if (USE_MOCK) return mockDelay(MOCK_TS.bfhdLoiDtl)
    return apiClient.post<BfhdLoiDtl, BfhdLoiDtl>(`/v1/tss/letters-of-intent/${id}`)
  },

  /** 품목명세서 목록 조회 — MUI-TS-01-T02 (bfhdLoiDtl/BfhdLoiDtl_ItemList). */
  async selectBfhdLoiSpcfctList(id: string): Promise<BfhdLoiSpcfctItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_TS.bfhdLoiSpcfctList)
    return apiClient.post<BfhdLoiSpcfctItem[], BfhdLoiSpcfctItem[]>(
      `/v1/tss/letters-of-intent/${id}/item-specs`,
    )
  },

  // ── 의견작성 (MUI-TS-01-P03) ──────────────────────────────────────────────

  /** 의견 임시저장(mode='save')/제출(mode='submit') — MUI-TS-01-P03 (bfhdLoiDtl/BfhdLoiWrt), slide15. */
  async saveBfhdLoiOpnn(req: BfhdLoiOpnnRequest): Promise<void> {
    if (USE_MOCK) {
      console.log('[tsService] 의견작성(목업)', req)
      return mockDelay(undefined)
    }
    return apiClient.post<void, void>(
      `/v1/tss/letters-of-intent/${req.bfhdLoiNo}/opinions`,
      req,
    )
  },

  // ── 세금계산서계약목록 (MUI-TS-04-M01) ────────────────────────────────────

  /** 세금계산서계약목록 조회 — MUI-TS-04-M01 (txivList_CtrtList/TxivList_CtrtListPage). 계약연도 기본 현재 연도(slide24). */
  async selectTxivCtrtList(req: TxivCtrtListRequest = {}): Promise<TxivCtrtListResult> {
    if (USE_MOCK) {
      const list = MOCK_TS.txivCtrtList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<TxivCtrtListResult, TxivCtrtListResult>(
      '/v1/tss/tax-invoice-contracts',
      req,
    )
  },

  // ── 세금계산서목록 (MUI-TS-04-P02) ────────────────────────────────────────

  /** 선택 계약의 세금계산서 목록 조회 — MUI-TS-04-P02 (txivList_CtrtList/TxivList). 카드 클릭 → 바텀시트(slide22). */
  async selectTxivList(ctrtNo: string): Promise<TxivItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_TS.txivList)
    return apiClient.post<TxivItem[], TxivItem[]>(
      `/v1/tss/tax-invoice-contracts/${ctrtNo}/tax-invoices`,
    )
  },

  // ── 세금계산서상세 (MUI-TS-04-M03) ────────────────────────────────────────

  /** 세금계산서상세(계약정보+공급자/공급받는자+계약서 일반정보) 조회 — MUI-TS-04-M03 (txivDtl/TxivDtlPage). */
  async selectTxivDtl(id: string): Promise<TxivDtl> {
    if (USE_MOCK) return mockDelay(MOCK_TS.txivDtl)
    return apiClient.post<TxivDtl, TxivDtl>(`/v1/tss/tax-invoices/${id}`)
  },

  // ── 세금계산서진행현황 (MUI-TS-04-M04) ────────────────────────────────────

  /** 세금계산서진행현황 목록 조회 — MUI-TS-04-M04 (txivPrgrsPrst/TxivPrgrsPrstPage). */
  async selectTxivPrgrsPrstList(req: TxivPrgrsPrstRequest = {}): Promise<TxivPrgrsPrstResult> {
    if (USE_MOCK) {
      const list = MOCK_TS.txivPrgrsPrstList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<TxivPrgrsPrstResult, TxivPrgrsPrstResult>(
      '/v1/tss/tax-invoice-progresses',
      req,
    )
  },
}
