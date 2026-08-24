// 인증(auth) 도메인 목업 데이터 — USE_MOCK=true 일 때 cmService 가 반환.
// 어떤 자격증명이든 성공 처리(폐쇄망 반입 전 UX 확인용). bzentyList 2건 → 로그인업체선택 UX 노출.
// ⚠️ 실백엔드 연동 시 이 파일은 사용되지 않는다(서비스가 apiClient 분기).
import type {
  BzentyChcItem,
  IdInquiryResult,
  IntgAcntIdCheckResult,
  IntgAcntTarget,
  LoginResult,
  User,
} from '@/types/domain'

// 로그인 사용자(목업) — 설계서 예시값(홍길동).
const USER: User = { customerNo: 'C0000001', name: '홍길동' }

// 소속 업체 목록 — 2건 이상이면 로그인업체선택(BzentyChc) 바텀시트 노출.
const BZENTY_LIST: BzentyChcItem[] = [
  { bzentyCd: 'BZ001', bzentyNm: 'A 업체명', bizRegNo: '123-45-67890' },
  { bzentyCd: 'BZ002', bzentyNm: 'B 업체명', bizRegNo: '147-02-58369' },
]

/** 로그인 결과(목업) — 토큰 + 사용자 + 업체목록. loginWith 는 단일 업체로 좁혀 반환. */
const LOGIN_RESULT: LoginResult = {
  accessToken: 'mock-access-token',
  user: USER,
  bzentyList: BZENTY_LIST,
}

/** 아이디 찾기 결과(목업) — 마스킹 아이디 + 가입일자. */
const ID_INQUIRY: IdInquiryResult = {
  maskedUserId: 'hong****',
  joinYmd: '2024-03-15',
}

// 통합계정 등록 대상(목업) — 본인인증 후 조회 결과. 설계서 slide35 예시값(홍길동 / B·C 업체 기존 아이디).
const INTG_ACNT_TARGET: IntgAcntTarget = {
  userNm: '홍길동',
  userIds: [
    { bzentyNm: 'B 업체명', userId: 'user123456' },
    { bzentyNm: 'C 업체명', userId: 'user234567' },
  ],
}

// 통합계정 아이디 중복확인(목업) — 항상 사용 가능. 실백엔드는 중복 시 available:false.
const INTG_ACNT_ID_CHECK: IntgAcntIdCheckResult = { available: true }

export const MOCK_AUTH = {
  user: USER,
  bzentyList: BZENTY_LIST,
  loginResult: LOGIN_RESULT,
  idInquiry: ID_INQUIRY,
  intgAcntTarget: INTG_ACNT_TARGET,
  intgAcntIdCheck: INTG_ACNT_ID_CHECK,
} as const
