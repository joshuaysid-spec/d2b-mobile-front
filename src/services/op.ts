// 조달(OP, MUI-OP) 도메인 API. 현재 백엔드 미연동 — 목업 반환 스텁(API 경계 표시).
// frontend-architecture.md §7.1 — services 는 apiClient 로 호출 후 도메인 모델로 매핑.
// 목록→상세 표준(CLAUDE.md "목록 → 상세 데이터 전달"): 상세는 id 로 getXxxDetail(id) 조회.
//   추후 실제 연동 시 Promise.resolve(MOCK) 자리를 apiClient.post(...) + 응답 매핑으로 대체한다.
import type { OpPlanDetail } from '@/types/op'

// 상세 헤더/요약 목업 — 설계서 데이터영역 항목명/형식. 추후 API 응답으로 대체.
const MOCK_PLAN_DETAIL: OpPlanDetail = {
  id: '0',
  srchType: 'plan',
  taskSeNm: '물품',
  ctrtMthdNm: '수의계약',
  prcmNo: '6000A',
  title: "'26년 K5방독면",
  orderPrnmntYm: '2026-03',
  orderDeptNm: '화력총괄계약팀',
  ctrtMthd: '총액제',
  budgetAmt: 11616000,
  prgrsStg: '조달',
}

export const opService = {
  /**
   * 국내 조달계획 상세 조회 (taskSeNm !== '국외'). 현재 목업 스텁.
   * 추후: return apiClient.post('/op/plan/domestic/detail', { prcmNo: id }).then(toPlanDetail)
   */
  getDomesticPlanDetail(id: string): Promise<OpPlanDetail> {
    console.log('[opService] 국내 조달계획 상세 조회 (API 스텁)', { id })
    return Promise.resolve({ ...MOCK_PLAN_DETAIL, id })
  },

  /**
   * 국외 조달계획 상세 조회 (taskSeNm === '국외'). 현재 목업 스텁.
   * 추후: return apiClient.post('/op/plan/overseas/detail', { prcmNo: id }).then(toPlanDetail)
   */
  getOverseasPlanDetail(id: string): Promise<OpPlanDetail> {
    console.log('[opService] 국외 조달계획 상세 조회 (API 스텁)', { id })
    return Promise.resolve({ ...MOCK_PLAN_DETAIL, id, taskSeNm: '국외' })
  },
}
