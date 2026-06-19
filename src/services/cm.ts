// 공통관리(CM) 도메인 API. 현재는 백엔드 미연동 — 콘솔 스텁(API 경계 표시).
// frontend-architecture.md §7.1 — services 는 apiClient 로 호출 후 도메인 모델로 매핑.
// 추후 실제 연동 시 console 자리를 apiClient.post(...) + 응답 매핑으로 대체한다.

/** 통합검색 결과 항목(스텁). 추후 백엔드 응답 형태에 맞춰 확장. */
export interface SearchResult {
  /** 안정적 고유 식별자. */
  id: string
  /** 검색 결과 제목. */
  title: string
}

export const cmService = {
  /**
   * 전체메뉴(MUI-MS-01-M12) 통합검색. 현재 스텁 — 빈 배열 반환(결과 없음 → 토스트 알림).
   * 추후: return apiClient.post('/search', { keyword }).then(toSearchResults)
   */
  async searchAll(keyword: string): Promise<SearchResult[]> {
    console.log('[cmService] 통합검색 (API 스텁)', { keyword })
    return []
  },
}
