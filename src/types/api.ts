// frontend-architecture.md §9.3 — API 요청/응답 타입 (백엔드 모델)

// 웹스퀘어 공통 응답 포맷
export interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

// 페이지네이션 공통 요청
export interface PageRequest {
  page: number
  size: number
}
