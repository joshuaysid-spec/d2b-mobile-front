// 조달(OP) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: opKeys.selectXxx / useSelectXxx) — 실 API 목록(no.1~27) 기준.
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로).
// 요청 body 항목명은 상세설계 대기 — 식별자 1개짜리 조회는 설계서 항목명(prcmNo/prcmRqtNo)으로 전달.
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_OP } from '@/mocks/op'
import type {
  MockOpAnlPrcmPlanItem,
  MockOpDeptSearchRequest,
  MockOpDeptSearchResult,
  MockOpItemSearchRequest,
  MockOpItemSearchResult,
  MockOpItemSpec,
  MockOpListRequest,
  MockOpListResult,
  MockOpNotifyRequest,
  MockOpOpinion,
  MockOpOpnnRequest,
  MockOpPlanDetail,
  MockOpProducerSearchRequest,
  MockOpProducerSearchResult,
  MockPrcDataResult,
  MockPrcDataSearchRequest,
  MockWarSplBzEnty,
  MockWarSplCnfg,
  MockWarSplIdntf,
  MockWarSplInqRequest,
  MockWarSplRef,
} from '@/types/mock/op'

export const opService = {
  // ── 조달계획 통합목록 — 검색유형(탭)별로 실 API 가 3개로 갈린다 ─────────────
  // 화면(MUI-OP-01-M02 prcmPlanIntgList)은 탭 하나짜리 목록이지만 백엔드는
  // 조달계획(no.1) / 사전규격(no.5) / 연간조달계획(no.13) 이 각각 별도 엔드포인트다.
  // 분기는 opQueries.useSelectPrcmPlanList 가 담당(훅은 조건부 호출이 불가하므로 훅 안에서 분기).

  /** no.1 조달계획목록조회 — MUI-OP-01-M02 (prcmPlanIntgList/PrcmPlanIntgListPage) '조달계획' 탭.
   *  목업은 유형 전체 반환(키워드/페이징은 페이지 클라이언트 로직 소관). */
  async selectPrcmPlanList(req: MockOpListRequest): Promise<MockOpListResult> {
    if (USE_MOCK) return mockDelay(mockPlanList(req))
    return apiClient.post<MockOpListResult, MockOpListResult>(
      '/bds/op/prcmPlan/selectPrcmPlanList.do',
      req,
    )
  },

  /** no.5 사전규격목록 조회 — MUI-OP-01-M02 '사전규격' 탭. */
  async selectBfhdSpcfctList(req: MockOpListRequest): Promise<MockOpListResult> {
    if (USE_MOCK) return mockDelay(mockPlanList(req))
    return apiClient.post<MockOpListResult, MockOpListResult>(
      '/bds/op/prcmPlan/selectBfhdSpcfctList.do',
      req,
    )
  },

  /** no.13 연간조달계획목록조회 — MUI-OP-01-M02 '연간조달계획' 탭(dlt_anlPrcmPlanList). */
  async selectAnlPrcmPlanList(req: MockOpListRequest): Promise<MockOpListResult> {
    if (USE_MOCK) return mockDelay(mockPlanList(req))
    return apiClient.post<MockOpListResult, MockOpListResult>(
      '/bds/op/prcmPlan/selectAnlPrcmPlanList.do',
      req,
    )
  },

  // ── 조달계획 상세 ──────────────────────────────────────────────────────────

  /** no.3 조달계획상세조회 — MUI-OP-01-M03 (prcmPlanDtl/PrcmPlanDtl). 식별자 = 판단번호(prcmNo). */
  async selectPrcmPlanDtl(id: string): Promise<MockOpPlanDetail> {
    if (USE_MOCK) return mockDelay(MOCK_OP.planDetail)
    return apiClient.post<MockOpPlanDetail, MockOpPlanDetail>('/bds/op/prcmPlan/selectPrcmPlanDtl.do', {
      prcmNo: id,
    })
  },

  /** no.4 공고게시알림 신청 — MUI-OP-01-P10 (prcmPlanDtl/PrcmPlan_NotiAply). 구 `applyNotify`. */
  async savePbancPstgNotiAply(req: MockOpNotifyRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/op/prcmPlan/savePbancPstgNotiAply.do', req)
  },

  /**
   * 품목명세서 목록 조회 — MUI-OP-01-M04 (prcmPlanDtl/PrcmPlanDtl_PrdList).
   * ⚠️ 실 API 목록에 대응 항목 없음(국내 조달계획 상세의 품목명세서 탭). URL 임시.
   *    상세조회(no.3) 응답에 포함되거나 국외 품목목록(no.16)과 통합될 가능성 — 반입 전 확인 필요.
   */
  async selectItemSpecs(id: string): Promise<MockOpItemSpec[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.itemSpecs)
    return apiClient.post<MockOpItemSpec[], MockOpItemSpec[]>(`/v1/ops/plans/${id}/item-specs`)
  },

  // ── 사전규격 상세 ──────────────────────────────────────────────────────────

  /** no.7 사전규격상세 조회 — MUI-OP-01-M11 (bfhdSpcfctDtl/BfhdSpcfctDtl). 구 `selectSpecDtl`. */
  async selectBfhdSpcfcDtl(id: string): Promise<MockOpPlanDetail> {
    if (USE_MOCK) return mockDelay(MOCK_OP.planDetail)
    return apiClient.post<MockOpPlanDetail, MockOpPlanDetail>('/bds/op/prcmPlan/selectBfhdSpcfcDtl.do', {
      prcmNo: id,
    })
  },

  // ── 업체의견(조달계획·사전규격 공용) — MUI-OP-01-M05/P07 ────────────────────

  /**
   * no.8 업체의견조회 — MUI-OP-01-M05
   * (prcmPlanDtl/PrcmPlanDtl_OpnnList · bfhdSpcfctDtl/BfhdSpcfctDtl_OpnnList). 구 `selectOpinions`.
   * ⚠️ 함수명 잠정 — 실 API 목록의 fn 이 비어 있어(원본 엑셀 #NAME?) 같은 컨트롤러의
   *    insert/update/deleteBzentyOpnn 관례를 따라 잠정 작명. 실규격 확정 시 함수명·URL 동시 교체.
   */
  async selectBzentyOpnn(id: string): Promise<MockOpOpinion[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.opinions)
    /* TODO: URL 미확정(원본 #NAME?) — 확정 전 실호출 불가. */
    throw new Error(`업체의견조회 API 경로가 확정되지 않았습니다. (id=${id})`)
  },

  /** no.9 업체의견저장 — MUI-OP-01-P07 (prcmPlanDtl/PrcmPlanDtl_OpnnRegFullPopup) 등록. 화면 미배선. */
  async insertBzentyOpnn(req: MockOpOpnnRequest): Promise<void> {
    if (USE_MOCK) {
      console.log('[opService] 업체의견 저장(목업)', req)
      return mockDelay(undefined)
    }
    return apiClient.post<void, void>('/bds/op/prcmPlan/insertBzentyOpnn.do', req)
  },

  /** no.10 업체의견수정 — MUI-OP-01-P07 수정 모드. 화면 미배선. */
  async updateBzentyOpnn(req: MockOpOpnnRequest): Promise<void> {
    if (USE_MOCK) {
      console.log('[opService] 업체의견 수정(목업)', req)
      return mockDelay(undefined)
    }
    return apiClient.post<void, void>('/bds/op/prcmPlan/updateBzentyOpnn.do', req)
  },

  /** no.11 업체의견삭제 — MUI-OP-01-P08 (PrcmPlanDtl_OpnnDtlFullPopup 삭제). 화면 미배선. */
  async deleteBzentyOpnn(opnnId: string): Promise<void> {
    if (USE_MOCK) {
      console.log('[opService] 업체의견 삭제(목업)', opnnId)
      return mockDelay(undefined)
    }
    return apiClient.post<void, void>('/bds/op/prcmPlan/deleteBzentyOpnn.do', { opnnId })
  },

  /**
   * no.12 답변조회 — MUI-OP-01-P08 (PrcmPlanDtl_OpnnDtlFullPopup 의 답변 영역). 화면 미배선.
   * ⚠️ 요청 항목명 잠정(opnnId) — 현재 화면은 의견 카드에 답변이 함께 실려 오는 목업 구조라
   *    별도 조회인지 의견조회(no.8) 응답 포함인지 반입 전 확인 필요.
   *    응답도 의견과 같은 형태(MockOpOpinion)로 잠정 사용.
   */
  async selectAnsInq(opnnId: string): Promise<MockOpOpinion[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.opinions)
    return apiClient.post<MockOpOpinion[], MockOpOpinion[]>('/bds/op/prcmPlan/selectAnsInq.do', { opnnId })
  },

  // ── 국외 연간조달계획 상세 ─────────────────────────────────────────────────

  /**
   * no.15 조달계획상세조회(OvsPrcmPlanController) — MUI-OP-01-M78
   * (ovsPrcmPlanDtl/OvsPrcmPlanDtlPage). 구 `selectOvsPlanDtl`.
   * 백엔드 메서드명은 국내(no.3)와 같은 `selectPrcmPlanDtl` 이나 한 객체 안에서 충돌하므로 Ovs 접두.
   * 응답 = 연간조달계획 목록 데이터영역(dlt_anlPrcmPlanList) 1건 전체(설계서 slide77 '목록 데이터 전체 표시').
   */
  async selectOvsPrcmPlanDtl(id: string): Promise<MockOpAnlPrcmPlanItem> {
    if (USE_MOCK) return mockDelay(MOCK_OP.anlPrcmPlanDtl)
    return apiClient.post<MockOpAnlPrcmPlanItem, MockOpAnlPrcmPlanItem>(
      '/bds/op/ovsPrcmPlan/selectPrcmPlanDtl.do',
      { prcmRqtNo: id },
    )
  },

  /**
   * no.16 품목목록조회(OvsPrcmPlanController) — 소비 화면 미확정. 화면 미배선.
   * ⚠️ 국외 연간조달계획 상세(M78)에는 품목 목록 섹션이 없다. 국내 품목명세서(M04, selectItemSpecs)와
   *    같은 API 인지 반입 전 확인 필요 — 응답 타입도 잠정(MockOpItemSpec 재사용).
   */
  async selectPrcmItemList(id: string): Promise<MockOpItemSpec[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.itemSpecs)
    return apiClient.post<MockOpItemSpec[], MockOpItemSpec[]>(
      '/bds/op/ovsPrcmPlan/selectPrcmItemList.do',
      { prcmRqtNo: id },
    )
  },

  // ── 검색 바텀시트(품목/생산자/발주기관) ────────────────────────────────────

  /** no.21 품목정보조회 — MUI-OP-01-P71 (cm/search/ItemInq). 요구년도 필수 + 품명/재고번호/부품번호 부분일치.
   *  구 `selectItemSearch`. */
  async selectItemList(req: MockOpItemSearchRequest): Promise<MockOpItemSearchResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.itemSearch)
    return apiClient.post<MockOpItemSearchResult[], MockOpItemSearchResult[]>(
      '/bds/op/ovsPrcmPlan/selectItemList.do',
      req,
    )
  },

  /** no.22 생산자조회 — MUI-OP-01-P72 (cm/search/PrdcrInq). 생산자명 부분일치. 구 `selectProducerSearch`. */
  async selectPrdcrList(req: MockOpProducerSearchRequest): Promise<MockOpProducerSearchResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.producerSearch)
    return apiClient.post<MockOpProducerSearchResult[], MockOpProducerSearchResult[]>(
      '/bds/op/ovsPrcmPlan/selectPrdcrList.do',
      req,
    )
  },

  /** no.27 발주기관목록조회 — MUI-BD-01-P04 (cm/search/DeptInq). 발주기관명 부분일치. 구 `selectDeptSearch`. */
  async selectOrderInstList(req: MockOpDeptSearchRequest): Promise<MockOpDeptSearchResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_OP.deptSearch)
    return apiClient.post<MockOpDeptSearchResult[], MockOpDeptSearchResult[]>(
      '/bds/op/ovsPrcmPlan/selectOrderInstList.do',
      req,
    )
  },

  // ── 목록정보조회(군수품 목록) — P76 3탭 + P77 ──────────────────────────────
  // req.niin 없음 = 해당 연간조달계획의 디폴트 값, 있음 = NIIN 검색 결과(화면에서 디폴트 아래에 이어붙음).
  // 목업은 두 경우를 다른 품목 값으로 반환해 "디폴트 + 검색 추가" 동작이 화면에서 드러나게 한다.

  /** no.23 형상자료조회 — 식별정보(dm_itemInfo) + 참조번호(dl_refList).
   *  MUI-OP-01-T73 (ovsPrcmPlanDtl/WarSplList_Cnfg). 구 `selectWarSplCnfg`. */
  async selectCnfgInfo(req: MockWarSplInqRequest): Promise<MockWarSplCnfg> {
    if (USE_MOCK) return mockDelay(req.niin ? MOCK_OP.warSplCnfgSrch : MOCK_OP.warSplCnfg)
    return apiClient.post<MockWarSplCnfg, MockWarSplCnfg>('/bds/op/ovsPrcmPlan/selectCnfgInfo.do', req)
  },

  /** no.25 식별자료조회(dm_idntfInfo) — MUI-OP-01-T74 (ovsPrcmPlanDtl/WarSplList_Idntf). 구 `selectWarSplIdntf`. */
  async selectIdntfInfo(req: MockWarSplInqRequest): Promise<MockWarSplIdntf> {
    if (USE_MOCK) return mockDelay(req.niin ? MOCK_OP.warSplIdntfSrch : MOCK_OP.warSplIdntf)
    return apiClient.post<MockWarSplIdntf, MockWarSplIdntf>('/bds/op/ovsPrcmPlan/selectIdntfInfo.do', req)
  },

  /** no.26 참고자료조회(dl_refList) — MUI-OP-01-T75 (ovsPrcmPlanDtl/WarSplList_Ref). 구 `selectWarSplRef`. */
  async selectRefInfo(req: MockWarSplInqRequest): Promise<MockWarSplRef[]> {
    if (USE_MOCK) return mockDelay(req.niin ? MOCK_OP.warSplRefSrch : MOCK_OP.warSplRef)
    return apiClient.post<MockWarSplRef[], MockWarSplRef[]>('/bds/op/ovsPrcmPlan/selectRefInfo.do', req)
  },

  /** no.24 업체정보조회(dm_bzentyInfo) — 형상자료 참조번호의 생산자부호(prdctnCd) 기준.
   *  MUI-OP-01-P77 (ovsPrcmPlanDtl/WarSplList_BzEnty). 구 `selectWarSplBzEnty`. */
  async selectPrdcrDtl(prdctnCd: string): Promise<MockWarSplBzEnty> {
    if (USE_MOCK) return mockDelay(MOCK_OP.warSplBzEnty)
    return apiClient.post<MockWarSplBzEnty, MockWarSplBzEnty>('/bds/op/ovsPrcmPlan/selectPrdcrDtl.do', {
      prdctnCd,
    })
  },

  // ── 품목별 가격자료 — P75 ──────────────────────────────────────────────────

  /** no.19 품목별가격자료조회(dl_resultList) — MUI-OP-01-P75 (prcDataList/PrcDataList). 구 `selectPrcDataList`.
   *  목업은 입력 필드만 부분일치(획득구분은 일치) 필터.
   *  순번(no)은 "검색결과 순번"(설계서 slide74)이라 필터 후 1부터 재부여한다. */
  async selectPrcDataListByItem(req: MockPrcDataSearchRequest): Promise<MockPrcDataResult> {
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
    return apiClient.post<MockPrcDataResult, MockPrcDataResult>(
      '/bds/op/ovsPrcmPlan/selectPrcDataListByItem.do',
      req,
    )
  },
}

/** 통합목록 목업 — 검색유형(탭)이 곧 목업 필터(실 API 는 유형별로 엔드포인트가 갈린다). */
function mockPlanList(req: MockOpListRequest): MockOpListResult {
  const list = MOCK_OP.planList.filter((it) => it.srchType === req.srchType)
  return { list, total: list.length }
}
