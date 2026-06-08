// 조달(OP, MUI-OP) 도메인 API. 현재는 백엔드 미연동 — 콘솔 스텁(API 경계 표시).
// frontend-architecture.md §7.1 — services 는 apiClient 로 호출 후 도메인 모델로 매핑.
// 추후 실제 연동 시 console 자리를 apiClient.post(...) + 응답 매핑으로 대체한다.

export const opService = {
  /**
   * 국내 조달계획 상세 조회 (taskSeNm !== '국외'). 현재 스텁.
   * 추후: return apiClient.post('/op/plan/domestic/detail', { prcmNo: id }).then(toPlanDetail)
   */
  getDomesticPlanDetail(id: string) {
    console.log('[opService] 국내 조달계획 상세 조회 (API 스텁)', { id })
  },

  /**
   * 국외 조달계획 상세 조회 (taskSeNm === '국외'). 현재 스텁.
   * 추후: return apiClient.post('/op/plan/overseas/detail', { prcmNo: id }).then(toPlanDetail)
   */
  getOverseasPlanDetail(id: string) {
    console.log('[opService] 국외 조달계획 상세 조회 (API 스텁)', { id })
  },
}
