// 업무지원(TS) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: tsKeys.selectXxx / useSelectXxx) — 실 API 목록(no.478~526) 기준.
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로).
// 요청 body 항목명은 상세설계 대기 — 식별자 1개짜리 조회는 설계서 항목명(bfhdLoiNo/ctrtNo/pblcnNo)으로 전달.
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_TS } from '@/mocks/ts'
import type {
  MockBfhdLoiDtl,
  MockBfhdLoiListRequest,
  MockBfhdLoiListResult,
  MockBfhdLoiOpnnRequest,
  MockBfhdLoiSpcfctItem,
  MockTxivCtrtListRequest,
  MockTxivCtrtListResult,
  MockTxivDtl,
  MockTxivItem,
  MockTxivPrgrsPrstRequest,
  MockTxivPrgrsPrstResult,
} from '@/types/mock/ts'

export const tsService = {
  // ── 사전의향서목록 (MUI-TS-01-M01) ────────────────────────────────────────

  /**
   * no.478 사전의향서목록조회 — MUI-TS-01-M01 (bfhdLoiList/BfhdLoiListPage).
   * On-Load: 접수기간 현재일자(slide11).
   */
  async selectBfhdLoiList(req: MockBfhdLoiListRequest = {}): Promise<MockBfhdLoiListResult> {
    if (USE_MOCK) {
      const list = MOCK_TS.bfhdLoiList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<MockBfhdLoiListResult, MockBfhdLoiListResult>(
      '/cts/ts/bfhdLoi/selectBfhdLoiList.do',
      req,
    )
  },

  // ── 사전의향서상세 (MUI-TS-01-M02) ────────────────────────────────────────

  /** no.480 사전의향서상세조회 — MUI-TS-01-M02/T01 (bfhdLoiDtl/BfhdLoiDtlPage). */
  async selectBfhdLoiDtl(id: string): Promise<MockBfhdLoiDtl> {
    if (USE_MOCK) return mockDelay(MOCK_TS.bfhdLoiDtl)
    return apiClient.post<MockBfhdLoiDtl, MockBfhdLoiDtl>('/cts/ts/bfhdLoi/selectBfhdLoiDtl.do', {
      bfhdLoiNo: id,
    })
  },

  /**
   * 품목명세서 목록 조회 — MUI-TS-01-T02 (bfhdLoiDtl/BfhdLoiDtl_ItemList).
   * 실목록 외(모바일 Y 목록에 없음) — URL 임시. 상세조회(no.480) 응답에 포함될 가능성 있어 반입 전 확인 필요.
   */
  async selectBfhdLoiSpcfctList(id: string): Promise<MockBfhdLoiSpcfctItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_TS.bfhdLoiSpcfctList)
    return apiClient.post<MockBfhdLoiSpcfctItem[], MockBfhdLoiSpcfctItem[]>(
      `/v1/tss/letters-of-intent/${id}/item-specs`,
    )
  },

  // ── 의견작성 (MUI-TS-01-P03) ──────────────────────────────────────────────

  /**
   * no.481 제조/구매/의견입력저장 — MUI-TS-01-P03 (bfhdLoiDtl/BfhdLoiWrt) 임시저장, slide15.
   * 구 `saveBfhdLoiOpnn(mode='save')` — 실 API 가 임시저장/제출로 분리되어 함수도 분리.
   */
  async saveMnftrPrchsOpnnInpt(req: MockBfhdLoiOpnnRequest): Promise<void> {
    if (USE_MOCK) {
      console.log('[tsService] 의견 임시저장(목업)', req)
      return mockDelay(undefined)
    }
    return apiClient.post<void, void>('/cts/ts/bfhdLoi/saveMnftrPrchsOpnnInpt.do', req)
  },

  /** no.482 사전의향서제출 — MUI-TS-01-P03 (bfhdLoiDtl/BfhdLoiWrt) 제출, slide15. 구 `saveBfhdLoiOpnn(mode='submit')`. */
  async saveBfhdLoiSbmsn(req: MockBfhdLoiOpnnRequest): Promise<void> {
    if (USE_MOCK) {
      console.log('[tsService] 사전의향서 제출(목업)', req)
      return mockDelay(undefined)
    }
    return apiClient.post<void, void>('/cts/ts/bfhdLoi/saveBfhdLoiSbmsn.do', req)
  },

  // ── 세금계산서계약목록 (MUI-TS-04-M01) ────────────────────────────────────

  /**
   * no.520 계약목록조회 — MUI-TS-04-M01 (txivList_CtrtList/TxivList_CtrtListPage).
   * 계약연도 기본 현재 연도(slide24).
   */
  async selectCtrtList(req: MockTxivCtrtListRequest = {}): Promise<MockTxivCtrtListResult> {
    if (USE_MOCK) {
      const list = MOCK_TS.txivCtrtList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<MockTxivCtrtListResult, MockTxivCtrtListResult>(
      '/cts/ts/taxiv/selectCtrtList.do',
      req,
    )
  },

  // ── 세금계산서목록 (MUI-TS-04-P02) ────────────────────────────────────────

  /** no.521 세금계산서목록조회 — MUI-TS-04-P02 (txivList_CtrtList/TxivList). 카드 클릭 → 바텀시트(slide22). */
  async selectTxivList(ctrtNo: string): Promise<MockTxivItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_TS.txivList)
    return apiClient.post<MockTxivItem[], MockTxivItem[]>('/cts/ts/taxiv/selectTxivList.do', { ctrtNo })
  },

  // ── 세금계산서상세 (MUI-TS-04-M03) ────────────────────────────────────────

  /** no.523 세금계산서상세조회 — MUI-TS-04-M03 (txivDtl/TxivDtlPage). 계약정보+공급자/공급받는자+계약서 일반정보. */
  async selectTxivDtl(id: string): Promise<MockTxivDtl> {
    if (USE_MOCK) return mockDelay(MOCK_TS.txivDtl)
    return apiClient.post<MockTxivDtl, MockTxivDtl>('/cts/ts/taxiv/selectTxivDtl.do', { pblcnNo: id })
  },

  // ── 세금계산서진행현황 (MUI-TS-04-M04) ────────────────────────────────────

  /** no.526 세금계산서진행현황조회 — MUI-TS-04-M04 (txivPrgrsPrst/TxivPrgrsPrstPage). */
  async selectTxivPrgrsPrstList(req: MockTxivPrgrsPrstRequest = {}): Promise<MockTxivPrgrsPrstResult> {
    if (USE_MOCK) {
      const list = MOCK_TS.txivPrgrsPrstList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<MockTxivPrgrsPrstResult, MockTxivPrgrsPrstResult>(
      '/cts/ts/taxiv/selectTxivPrgrsPrstList.do',
      req,
    )
  },
}
