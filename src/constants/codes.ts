// frontend-architecture.md §9.2 — 백엔드 응답/에러 코드 상수
export const RESPONSE_CODE = {
  SUCCESS: '0000',
  SESSION_EXPIRED: '9001',
  SERVER_ERROR: '9999',
} as const

export type ResponseCode = (typeof RESPONSE_CODE)[keyof typeof RESPONSE_CODE]

// 업무구분 공통코드 (그룹 GTSA0001 — 설계서 00.공통 p86 비고).
// ⚠️ 코드값 잠정 — PC 전송 규격 "0 1 2 3 4"(전체/물품/용역/공사/국외 순, selectAll '0' 정합)에서 추정.
//    폐쇄망 실응답으로 확정 시 값만 교정.
export const TASK_SE_CD = {
  ALL: '0',
  GOODS: '1', // 물품
  SERVICE: '2', // 용역
  CONSTRUCTION: '3', // 공사
  OVERSEAS: '4', // 국외 — 관심공고 등록 국내/국외 분기(no.30/51) 기준
} as const
