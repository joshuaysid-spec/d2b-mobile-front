// tssBdService — 지원 시스템(tss) / bd 도메인: 모의입찰(/tss/bd/simtBid/*, /tss/bd/ovsSimtBid/*).
// 실 API 목록 no.911~924 (전부 Mobile TBD — 사용자 확정으로 Y 와 동일하게 서비스 함수 선생성, 2026-08-24).
// ⚠️ 요청/응답 규격 미확정(설계서 데이터영역 없음) — 파라미터/반환은 unknown 잠정, 상세설계 확정 시 타입 교체.
//    소비 화면도 미구현 — 훅(queries)은 화면 배선 시 추가(컨벤션).
// 동명 메서드 충돌: simtBid ↔ ovsSimtBid 컨트롤러에 같은 백엔드 메서드명 3쌍
// (insertSimtBidPrtcpAply / selectSimtBidPrtcpApfr / insertSimtTndrSbmsn) → 국외(ovsSimtBid) 쪽에 Ovs 접두.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'

export const tssBdService = {
  // ── 국내 모의입찰 (/tss/bd/simtBid) ───────────────────────────────────────

  /** no.911 모의입찰공고목록조회 */
  async selectSimtBidPbancList(req: unknown = {}): Promise<unknown> {
    if (USE_MOCK) return mockDelay([])
    return apiClient.post<unknown, unknown>('/tss/bd/simtBid/selectSimtBidPbancList.do', req)
  },

  /** no.912 모의입찰참가신청서조회 */
  async selectSimtBidPrtcpApfr(req: unknown = {}): Promise<unknown> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<unknown, unknown>('/tss/bd/simtBid/selectSimtBidPrtcpApfr.do', req)
  },

  /** no.913 모의입찰참가신청 */
  async insertSimtBidPrtcpAply(req: unknown = {}): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/tss/bd/simtBid/insertSimtBidPrtcpAply.do', req)
  },

  /** no.914 모의입찰서제출조회 */
  async selectSimtTndrSbmsn(req: unknown = {}): Promise<unknown> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<unknown, unknown>('/tss/bd/simtBid/selectSimtTndrSbmsn.do', req)
  },

  /** no.915 모의입찰서제출 */
  async insertSimtTndrSbmsn(req: unknown = {}): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/tss/bd/simtBid/insertSimtTndrSbmsn.do', req)
  },

  // ── 국외 모의입찰 (/tss/bd/ovsSimtBid) ────────────────────────────────────

  /** no.916 모의보관함공고목록조회 */
  async selectSimtLockerPbancList(req: unknown = {}): Promise<unknown> {
    if (USE_MOCK) return mockDelay([])
    return apiClient.post<unknown, unknown>('/tss/bd/ovsSimtBid/selectSimtLockerPbancList.do', req)
  },

  /** no.917 모의임시입찰내용조회 */
  async selectSimtTmprBidCnList(req: unknown = {}): Promise<unknown> {
    if (USE_MOCK) return mockDelay([])
    return apiClient.post<unknown, unknown>('/tss/bd/ovsSimtBid/selectSimtTmprBidCnList.do', req)
  },

  /** no.918 모의임시입찰내용저장 */
  async saveSimtTmprBidCn(req: unknown = {}): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/tss/bd/ovsSimtBid/saveSimtTmprBidCn.do', req)
  },

  /** no.919 모의입찰참가신청(국외) — 백엔드 메서드명은 insertSimtBidPrtcpAply(ovsSimtBid) — no.913 과 충돌로 Ovs 접두. */
  async insertOvsSimtBidPrtcpAply(req: unknown = {}): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/tss/bd/ovsSimtBid/insertSimtBidPrtcpAply.do', req)
  },

  /** no.920 모의입찰참가신청조회(국외) — 백엔드 메서드명은 selectSimtBidPrtcpApfr(ovsSimtBid) — no.912 와 충돌로 Ovs 접두. */
  async selectOvsSimtBidPrtcpApfr(req: unknown = {}): Promise<unknown> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<unknown, unknown>('/tss/bd/ovsSimtBid/selectSimtBidPrtcpApfr.do', req)
  },

  /** no.921 모의입찰서제출(국외) — 백엔드 메서드명은 insertSimtTndrSbmsn(ovsSimtBid) — no.915 와 충돌로 Ovs 접두. */
  async insertOvsSimtTndrSbmsn(req: unknown = {}): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/tss/bd/ovsSimtBid/insertSimtTndrSbmsn.do', req)
  },

  /** no.922 모의역경매입찰서제출 */
  async insertSimtDtchacTndrSbmsn(req: unknown = {}): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/tss/bd/ovsSimtBid/insertSimtDtchacTndrSbmsn.do', req)
  },

  /** no.923 모의최저가투찰 */
  async insertSimtLwprcTndrSbmsn(req: unknown = {}): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/tss/bd/ovsSimtBid/insertSimtLwprcTndrSbmsn.do', req)
  },

  /** no.924 모의입찰서조회 */
  async selectSimtTndr(req: unknown = {}): Promise<unknown> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<unknown, unknown>('/tss/bd/ovsSimtBid/selectSimtTndr.do', req)
  },
}
