// frontend-architecture.md §9.3 — API 요청/응답 타입 (백엔드 모델)

// 공통 응답 상태 (metadata.status). success 로 성공/실패를 판별한다.
export interface ApiResponseStatus {
  success: boolean
  code: string | null
  message: string | null
  details: unknown[]
}

// 백엔드 공통 응답 봉투 — { metadata, data }.
// 실제 데이터는 data 에 담기고, 성공/실패·에러코드는 metadata.status 에 담긴다.
export interface ApiResponse<T> {
  metadata: {
    requestId: string
    timestamp: string
    status: ApiResponseStatus
  }
  data: T
}

// 응답 인터셉터가 실패(success:false) 시 reject 하는 정규화된 에러.
export interface ApiError {
  code: string | null
  message: string | null
  details: unknown[]
}

// 페이지네이션 공통 요청
export interface PageRequest {
  page: number
  size: number
}
