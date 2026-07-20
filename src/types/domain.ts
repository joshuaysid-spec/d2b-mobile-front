// frontend-architecture.md §9.3 — 프론트 도메인 모델
// 도메인 구현 시 이 파일에 모델을 확장한다.

export interface User {
  customerNo: string
  name: string
}

// ── 인증(auth) API 타입(추정 — TODO(백엔드 확정)) ──
// authService(services/auth.ts) 의 요청/응답 도메인 타입. 로그인 API 스펙 미확정이라 필드는 잠정.
// 폐쇄망 반입 후 실백엔드 응답 확정 시 이 섹션 + services/auth.ts 매핑만 교체한다.

/**
 * 로그인 대상 업체 1건 — 소속 업체 선택(MUI-MS-01-P14, BzentyChc).
 * 필드명은 bd 도메인 확립 규약(bzentyCd/bzentyNm/bizRegNo) 준용 — BzentyChc(P14) 콘텐츠가 이 타입을 직접 사용.
 */
export interface BzentyChcItem {
  /** 업체코드(bzentyCd) — 선택/로그인 확정 키. */
  bzentyCd: string
  /** 업체명(bzentyNm). */
  bzentyNm: string
  /** 사업자등록번호(bizRegNo) — 예: '123-45-67890'. */
  bizRegNo: string
}

/** 로그인 요청 — ID/PW 로그인(MUI-CM-03-M02). 항목 영문 ID 미확정(임시 키). */
export interface LoginRequest {
  /** 아이디(userId). */
  userId: string
  /** 비밀번호(password). */
  password: string
  /** 로그인 대상 구분 — 'bzenty'(업체) | 'inst'(기관). 설계서 2026-06-22 개정. */
  loginTarget: string
}

/**
 * 로그인 결과 — 서비스가 백엔드 응답을 이 안정 형태로 매핑(페이지/스토어는 이 타입만 의존).
 * bzentyList 가 2건 이상이면 로그인업체선택(BzentyChc) 바텀시트를 띄운다.
 */
export interface LoginResult {
  /** 액세스 토큰 — 호출측(authStore)이 저장 → apiClient 요청 인터셉터가 Bearer 로 첨부. */
  accessToken: string
  /** 로그인 사용자. */
  user: User
  /** 소속 업체 목록 — 2개 이상이면 로그인업체선택(BzentyChc) 표시. */
  bzentyList: BzentyChcItem[]
}

/** 본인확인(회원조회) 요청 — 간편/본인인증(MUI-CM-01, bioInfoCertReg). */
export interface MemberVerifyRequest {
  /** 아이디(userId). */
  userId: string
  /** 사용자명(userName). */
  userName: string
}

/** 아이디 찾기(등록정보) 요청 — MUI-CM-03-M04. */
export interface FindIdRequest {
  /** 사업자등록번호(bizRegNo) — '-' 없이 숫자만. */
  bizRegNo: string
  /** 사용자명(userName). */
  userName: string
  /** 생년월일 6자리(birthDate). */
  birthDate: string
}

/** 비밀번호 찾기(등록정보) 요청 — MUI-CM-03-M07. */
export interface FindPasswordRequest {
  /** 아이디(userId). */
  userId: string
  /** 사업자등록번호(bizRegNo). */
  bizRegNo: string
  /** 사용자명(userName). */
  userName: string
  /** 생년월일 6자리(birthDate). */
  birthDate: string
}

/** 아이디 찾기 결과 — 본인인증/등록정보 조회 성공 시 마스킹된 아이디 반환(MUI-CM-03-M05). */
export interface IdInquiryResult {
  /** 마스킹된 아이디(maskedUserId) — 예: 'hong****'. */
  maskedUserId: string
  /** 가입일자(joinYmd, yyyy-mm-dd) — 결과화면 표시(선택). */
  joinYmd?: string
}

/** 비밀번호 변경 요청 — 사용자 비밀번호 변경(MUI-CM-02-M05) / 찾기 후 재설정(pswdRslt). */
export interface ChangePasswordRequest {
  /** 새 비밀번호(newPassword). */
  newPassword: string
  /** 현재 비밀번호(currentPassword) — 로그인 후 변경 시 필요. 찾기 후 재설정 흐름에선 생략. */
  currentPassword?: string
}
