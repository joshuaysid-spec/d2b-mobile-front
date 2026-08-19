// 조달(OP) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: opKeys.selectXxx / useSelectXxx) — 실규격 확정 전 임시 명명(select~ 스타일).
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로 확정 시 해당 함수만 수정).
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
  PrcDataResult,
  PrcDataSearchRequest,
  WarSplBzEnty,
  WarSplCnfg,
  WarSplIdntf,
  WarSplInqRequest,
  WarSplRef,
} from '@/types/op'

export const opService = {
  // ── 조달계획 목록/상세 ─────────────────────────────────────────────────────

  /** 조달계획 통합목록 조회 — MUI-OP-01-M02 (prcmPlanIntgList/PrcmPlanIntgListPage).
   *  목업은 유형 전체 반환(키워드/페이징은 페이지 클라이언트 로직 소관). */
  async selectPlanList(req: OpListRequest): Promise<OpListResult> {
    if (USE_MOCK) {
      const list = MOCK_OP.planList.filter((it) => it.srchType === req.srchType)
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<OpListResult, OpListResult>('/v1/ops/plans', req)
  },

  /** 조달계획 상세 조회(헤더/요약) — MUI-OP-01-M03 (prcmPlanDtl/PrcmPlanDtl). */
  async selectPlanDtl(id: string): Promise<OpPlanDetail> {
    if (USE_MOCK) return mockDelay(MOCK_OP.planDetail)
    return apiClient.post<OpPlanDetail, OpPlanDetail>(`/v1/ops/plans/${id}`)
  },

  /** 품목명세서 목록 조회 — MUI-OP-01-M04 (prcmPlanDtl/PrcmPlanDtl_PrdList). */
  async selectItemSpecs(id: string): Promise<OpItemSpec[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.itemSpecs)
    return apiClient.post<OpItemSpec[], OpItemSpec[]>(`/v1/ops/plans/${id}/item-specs`)
  },

  /** 업체의견 목록 조회(조달계획·사전규격 공용) — MUI-OP-01-M05
   *  (prcmPlanDtl/PrcmPlanDtl_OpnnList · bfhdSpcfctDtl/BfhdSpcfctDtl_OpnnList). */
  async selectOpinions(id: string): Promise<OpOpinion[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.opinions)
    return apiClient.post<OpOpinion[], OpOpinion[]>(`/v1/ops/plans/${id}/opinions`)
  },

  /** 입찰공고 알림신청 — MUI-OP-01-P10 (prcmPlanDtl/PrcmPlanDtlPage). */
  async applyNotify(req: OpNotifyRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/ops/bid-notify-applies', req)
  },

  // ── 사전규격 상세 ──────────────────────────────────────────────────────────

  /** 사전규격 상세 조회(헤더/요약) — MUI-OP-01-M11 (bfhdSpcfctDtl/BfhdSpcfctDtl). */
  async selectSpecDtl(id: string): Promise<OpPlanDetail> {
    if (USE_MOCK) return mockDelay(MOCK_OP.planDetail)
    return apiClient.post<OpPlanDetail, OpPlanDetail>(`/v1/ops/pre-specs/${id}`)
  },

  // ── 국외 조달계획 상세 ─────────────────────────────────────────────────────

  /** 국외 조달계획 상세 조회(헤더/요약) — MUI-OP-01-M73 (ovsPrcmPlanDtl/OvsPrcmPlanDtl). */
  async selectOvsPlanDtl(id: string): Promise<OpPlanDetail> {
    if (USE_MOCK) return mockDelay(MOCK_OP.planDetail)
    return apiClient.post<OpPlanDetail, OpPlanDetail>(`/v1/ops/overseas-plans/${id}`)
  },

  /** 국외 조달계획 집행결과 목록 조회 — MUI-OP-01-M74 (ovsPrcmPlanDtl/OvsPrcmPlanDtl_RsltList). */
  async selectOvsPlanResults(id: string): Promise<OpOverseasPlanResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.overseasResults)
    return apiClient.post<OpOverseasPlanResult[], OpOverseasPlanResult[]>(
      `/v1/ops/overseas-plans/${id}/results`,
    )
  },

  // ── 검색 바텀시트(품목/생산자/발주부서) ────────────────────────────────────

  /** 품목별 검색(요구년도 필수 + 품명/재고번호/부품번호 부분일치) — MUI-OP-01-P71 (cm/search/ItemInq). */
  async selectItemSearch(req: OpItemSearchRequest): Promise<OpItemSearchResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.itemSearch)
    return apiClient.post<OpItemSearchResult[], OpItemSearchResult[]>('/v1/ops/items', req)
  },

  /** 생산자 검색(생산자명 부분일치) — MUI-OP-01-P72 (cm/search/PrdcrInq). */
  async selectProducerSearch(req: OpProducerSearchRequest): Promise<OpProducerSearchResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.producerSearch)
    return apiClient.post<OpProducerSearchResult[], OpProducerSearchResult[]>(
      '/v1/ops/producers',
      req,
    )
  },

  /** 발주부서(기관) 검색(발주기관명 부분일치) — MUI-BD-01-P04 (cm/search/DeptInq). */
  async selectDeptSearch(req: OpDeptSearchRequest): Promise<OpDeptSearchResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.deptSearch)
    return apiClient.post<OpDeptSearchResult[], OpDeptSearchResult[]>('/v1/ops/depts', req)
  },

  // ── 목록정보조회(군수품 목록) — P76 3탭 + P77 ──────────────────────────────
  // req.niin 없음 = 해당 연간조달계획의 디폴트 값, 있음 = NIIN 검색 결과(화면에서 디폴트 아래에 이어붙음).
  // 목업은 두 경우를 다른 품목 값으로 반환해 "디폴트 + 검색 추가" 동작이 화면에서 드러나게 한다.

  /** 형상자료 조회 — 식별정보(dm_itemInfo) + 참조번호(dl_refList).
   *  MUI-OP-01-T73 (ovsPrcmPlanDtl/WarSplList_Cnfg). */
  async selectWarSplCnfg(req: WarSplInqRequest): Promise<WarSplCnfg> {
    if (USE_MOCK) return mockDelay(req.niin ? MOCK_OP.warSplCnfgSrch : MOCK_OP.warSplCnfg)
    return apiClient.post<WarSplCnfg, WarSplCnfg>('/v1/ops/war-supplies/configurations', req)
  },

  /** 식별자료 조회(dm_idntfInfo) — MUI-OP-01-T74 (ovsPrcmPlanDtl/WarSplList_Idntf). */
  async selectWarSplIdntf(req: WarSplInqRequest): Promise<WarSplIdntf> {
    if (USE_MOCK) return mockDelay(req.niin ? MOCK_OP.warSplIdntfSrch : MOCK_OP.warSplIdntf)
    return apiClient.post<WarSplIdntf, WarSplIdntf>('/v1/ops/war-supplies/identifications', req)
  },

  /** 참고자료 목록 조회(dl_refList) — MUI-OP-01-T75 (ovsPrcmPlanDtl/WarSplList_Ref). */
  async selectWarSplRef(req: WarSplInqRequest): Promise<WarSplRef[]> {
    if (USE_MOCK) return mockDelay(req.niin ? MOCK_OP.warSplRefSrch : MOCK_OP.warSplRef)
    return apiClient.post<WarSplRef[], WarSplRef[]>('/v1/ops/war-supplies/references', req)
  },

  /** 업체정보 조회(dm_bzentyInfo) — 형상자료 참조번호의 생산자부호(prdctnCd) 기준.
   *  MUI-OP-01-P77 (ovsPrcmPlanDtl/WarSplList_BzEnty). */
  async selectWarSplBzEnty(prdctnCd: string): Promise<WarSplBzEnty> {
    if (USE_MOCK) return mockDelay(MOCK_OP.warSplBzEnty)
    return apiClient.post<WarSplBzEnty, WarSplBzEnty>('/v1/ops/war-supplies/business-entities', {
      prdctnCd,
    })
  },

  // ── 품목별 가격자료 — P75 ──────────────────────────────────────────────────

  /** 품목별 가격자료 조회(dl_resultList) — MUI-OP-01-P75 (prcDataList/PrcDataList).
   *  목업은 입력 필드만 부분일치(획득구분은 일치) 필터.
   *  순번(no)은 "검색결과 순번"(설계서 slide74)이라 필터 후 1부터 재부여한다. */
  async selectPrcDataList(req: PrcDataSearchRequest): Promise<PrcDataResult> {
    if (USE_MOCK) {
      const list = MOCK_OP.prcDataList
        .filter(
          (it) =>
            (!req.acqstnTypeCd || it.acqstnTypeCd === req.acqstnTypeCd) &&
            (!req.fsc || it.fsc.includes(req.fsc)) &&
            (!req.niin || it.niin.includes(req.niin)) &&
            (!req.prtsNo || it.prtsNo.includes(req.prtsNo)) &&
            (!req.itemNm || it.itemNm.includes(req.itemNm)),
        )
        .map((it, i) => ({ ...it, no: i + 1 }))
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<PrcDataResult, PrcDataResult>('/v1/ops/price-data', req)
  },
}
