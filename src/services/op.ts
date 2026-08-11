// 조달(OP) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// ⚠️ 폐쇄망 반입 후 실백엔드 경로 확정 시 EP 맵만 수정한다(메서드 본문 불변).
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_OP } from '@/mocks/op'
import type {
  OpDeptSearchRequest,
  OpDeptSearchResult,
  OpItemSearchRequest,
  OpItemSearchResult,
  OpItemSpec,
  OpListRequest,
  OpListResult,
  OpNotifyRequest,
  OpOpinion,
  OpOverseasPlanResult,
  OpPlanDetail,
  OpProducerSearchRequest,
  OpProducerSearchResult,
  WarSplBzEnty,
  WarSplCnfg,
  WarSplIdntf,
  WarSplInqRequest,
  WarSplRef,
} from '@/types/op'

const EP = {
  /** 조달계획 통합목록 — MUI-OP-01-M02 (prcmPlanIntgList/PrcmPlanIntgListPage) */
  PLAN_LIST: '/v1/ops/plans',
  /** 조달계획 상세 — MUI-OP-01-M03 (prcmPlanDtl/PrcmPlanDtl) */
  PLAN_DTL: (id: string) => `/v1/ops/plans/${id}`,
  /** 품목명세서 — MUI-OP-01-M04 (prcmPlanDtl/PrcmPlanDtl_PrdList) */
  PLAN_ITEM_SPECS: (id: string) => `/v1/ops/plans/${id}/item-specs`,
  /** 업체의견 — MUI-OP-01-M05 (prcmPlanDtl/PrcmPlanDtl_OpnnList · bfhdSpcfctDtl/BfhdSpcfctDtl_OpnnList) */
  PLAN_OPINIONS: (id: string) => `/v1/ops/plans/${id}/opinions`,
  /** 입찰공고 알림신청 — MUI-OP-01-P10 (prcmPlanDtl/PrcmPlanDtlPage) */
  NOTIFY_APPLY: '/v1/ops/bid-notify-applies',
  /** 사전규격 상세 — MUI-OP-01-M11 (bfhdSpcfctDtl/BfhdSpcfctDtl) */
  SPEC_DTL: (id: string) => `/v1/ops/pre-specs/${id}`,
  /** 국외 조달계획 상세 — MUI-OP-01-M73 (ovsPrcmPlanDtl/OvsPrcmPlanDtl) */
  OVS_PLAN_DTL: (id: string) => `/v1/ops/overseas-plans/${id}`,
  /** 국외 조달계획 집행결과 — MUI-OP-01-M74 (ovsPrcmPlanDtl/OvsPrcmPlanDtl_RsltList) */
  OVS_PLAN_RESULTS: (id: string) => `/v1/ops/overseas-plans/${id}/results`,
  /** 품목별 검색 — MUI-OP-01-P71 (cm/search/ItemInq) */
  ITEM_SEARCH: '/v1/ops/items',
  /** 생산자 검색 — MUI-OP-01-P72 (cm/search/PrdcrInq) */
  PRODUCER_SEARCH: '/v1/ops/producers',
  /** 발주부서(기관) 검색 — MUI-BD-01-P04 (cm/search/DeptInq) */
  DEPT_SEARCH: '/v1/ops/depts',
  /** 목록정보조회 - 형상자료 — MUI-OP-01-T73 (ovsPrcmPlanDtl/WarSplList_Cnfg) */
  WAR_SPL_CNFG: '/v1/ops/war-supplies/configurations',
  /** 목록정보조회 - 식별자료 — MUI-OP-01-T74 (ovsPrcmPlanDtl/WarSplList_Idntf) */
  WAR_SPL_IDNTF: '/v1/ops/war-supplies/identifications',
  /** 목록정보조회 - 참고자료 — MUI-OP-01-T75 (ovsPrcmPlanDtl/WarSplList_Ref) */
  WAR_SPL_REF: '/v1/ops/war-supplies/references',
  /** 목록정보조회 - 업체정보 — MUI-OP-01-P77 (ovsPrcmPlanDtl/WarSplList_BzEnty) */
  WAR_SPL_BZ_ENTY: '/v1/ops/war-supplies/business-entities',
} as const

export const opService = {
  // ── 조달계획 목록/상세 ─────────────────────────────────────────────────────

  /** 조달계획 통합목록 조회 — 목업은 유형 전체 반환(키워드/페이징은 페이지 클라이언트 로직 소관). */
  async getList(req: OpListRequest): Promise<OpListResult> {
    if (USE_MOCK) {
      const list = MOCK_OP.planList.filter((it) => it.srchType === req.srchType)
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<OpListResult, OpListResult>(EP.PLAN_LIST, req)
  },

  /** 조달계획 상세 조회(헤더/요약). */
  async getDetail(id: string): Promise<OpPlanDetail> {
    if (USE_MOCK) return mockDelay(MOCK_OP.planDetail)
    return apiClient.post<OpPlanDetail, OpPlanDetail>(EP.PLAN_DTL(id))
  },

  /** 품목명세서 목록 조회. */
  async getItemSpecs(id: string): Promise<OpItemSpec[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.itemSpecs)
    return apiClient.post<OpItemSpec[], OpItemSpec[]>(EP.PLAN_ITEM_SPECS(id))
  },

  /** 업체의견 목록 조회(조달계획·사전규격 공용). */
  async getOpinions(id: string): Promise<OpOpinion[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.opinions)
    return apiClient.post<OpOpinion[], OpOpinion[]>(EP.PLAN_OPINIONS(id))
  },

  /** 입찰공고 알림신청. */
  async applyNotify(req: OpNotifyRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.NOTIFY_APPLY, req)
  },

  // ── 사전규격 상세 ──────────────────────────────────────────────────────────

  /** 사전규격 상세 조회(헤더/요약). */
  async getSpecDetail(id: string): Promise<OpPlanDetail> {
    if (USE_MOCK) return mockDelay(MOCK_OP.planDetail)
    return apiClient.post<OpPlanDetail, OpPlanDetail>(EP.SPEC_DTL(id))
  },

  // ── 국외 조달계획 상세 ─────────────────────────────────────────────────────

  /** 국외 조달계획 상세 조회(헤더/요약). */
  async getOverseasPlanDetail(id: string): Promise<OpPlanDetail> {
    if (USE_MOCK) return mockDelay(MOCK_OP.planDetail)
    return apiClient.post<OpPlanDetail, OpPlanDetail>(EP.OVS_PLAN_DTL(id))
  },

  /** 국외 조달계획 집행결과 목록 조회. */
  async getOverseasPlanResults(id: string): Promise<OpOverseasPlanResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.overseasResults)
    return apiClient.post<OpOverseasPlanResult[], OpOverseasPlanResult[]>(EP.OVS_PLAN_RESULTS(id))
  },

  // ── 검색 바텀시트(품목/생산자/발주부서) ────────────────────────────────────

  /** 품목별 검색(요구년도 필수 + 품명/재고번호/부품번호 부분일치). */
  async searchItems(req: OpItemSearchRequest): Promise<OpItemSearchResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.itemSearch)
    return apiClient.post<OpItemSearchResult[], OpItemSearchResult[]>(EP.ITEM_SEARCH, req)
  },

  /** 생산자 검색(생산자명 부분일치). */
  async searchProducers(req: OpProducerSearchRequest): Promise<OpProducerSearchResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.producerSearch)
    return apiClient.post<OpProducerSearchResult[], OpProducerSearchResult[]>(EP.PRODUCER_SEARCH, req)
  },

  /** 발주부서(기관) 검색(발주기관명 부분일치). */
  async searchDepts(req: OpDeptSearchRequest): Promise<OpDeptSearchResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.deptSearch)
    return apiClient.post<OpDeptSearchResult[], OpDeptSearchResult[]>(EP.DEPT_SEARCH, req)
  },

  // ── 목록정보조회(군수품 목록) — P76 3탭 + P77 ──────────────────────────────
  // req.niin 없음 = 해당 연간조달계획의 디폴트 값, 있음 = NIIN 검색 결과(화면에서 디폴트 아래에 이어붙음).
  // 목업은 두 경우를 다른 품목 값으로 반환해 "디폴트 + 검색 추가" 동작이 화면에서 드러나게 한다.

  /** 형상자료 조회 — 식별정보(dm_itemInfo) + 참조번호(dl_refList). */
  async getWarSplCnfg(req: WarSplInqRequest): Promise<WarSplCnfg> {
    if (USE_MOCK) return mockDelay(req.niin ? MOCK_OP.warSplCnfgSrch : MOCK_OP.warSplCnfg)
    return apiClient.post<WarSplCnfg, WarSplCnfg>(EP.WAR_SPL_CNFG, req)
  },

  /** 식별자료 조회(dm_idntfInfo). */
  async getWarSplIdntf(req: WarSplInqRequest): Promise<WarSplIdntf> {
    if (USE_MOCK) return mockDelay(req.niin ? MOCK_OP.warSplIdntfSrch : MOCK_OP.warSplIdntf)
    return apiClient.post<WarSplIdntf, WarSplIdntf>(EP.WAR_SPL_IDNTF, req)
  },

  /** 참고자료 목록 조회(dl_refList). */
  async getWarSplRef(req: WarSplInqRequest): Promise<WarSplRef[]> {
    if (USE_MOCK) return mockDelay(req.niin ? MOCK_OP.warSplRefSrch : MOCK_OP.warSplRef)
    return apiClient.post<WarSplRef[], WarSplRef[]>(EP.WAR_SPL_REF, req)
  },

  /** 업체정보 조회(dm_bzentyInfo) — 형상자료 참조번호의 생산자부호(prdctnCd) 기준. */
  async getWarSplBzEnty(prdctnCd: string): Promise<WarSplBzEnty> {
    if (USE_MOCK) return mockDelay(MOCK_OP.warSplBzEnty)
    return apiClient.post<WarSplBzEnty, WarSplBzEnty>(EP.WAR_SPL_BZ_ENTY, { prdctnCd })
  },
}
