// 인증(auth) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환(어떤 자격증명이든 성공) · false: apiClient 실호출.
// ⚠️ 폐쇄망 반입 후 실백엔드 경로 확정 시 EP 맵만 수정한다(메서드 본문 불변).
// 백엔드 로그인 응답 형태는 미확정 — 서비스가 LoginResult(안정 형태)로 매핑해 페이지/스토어를 격리한다.
// 응답 인터셉터가 봉투를 벗기므로 apiClient.get/post 의 2번째 제네릭(R)에 알맹이 타입을 지정한다.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_AUTH } from '@/mocks/auth'
import type {
  BzentyChcItem,
  ChangePasswordRequest,
  FindIdRequest,
  FindPasswordRequest,
  IdInquiryResult,
  IntgAcntIdCheckResult,
  IntgAcntTarget,
  LoginRequest,
  LoginResult,
  MemberVerifyRequest,
  RegisterIntgAcntRequest,
} from '@/types/domain'

const EP = {
  /** ID/PW 로그인 — MUI-CM-03-M02 (idPswdLogin/IdPswdLoginPage) */
  LOGIN: '/v1/auth/login',
  /** 로그인 업체 확정 — MUI-MS-01-P14 (idPswdLogin/IdPswdLoginPage · bzentyChc/BzentyChc) */
  LOGIN_WITH_BZENTY: '/v1/auth/login/bzenty',
  /** 생체인증 로그인 — MUI-CM-01 (bioInfoCertReg/BioInfoCertRegPage) */
  BIOMETRIC_LOGIN: '/v1/auth/login/biometric',
  /** 본인확인(회원조회) — MUI-CM-01 (bioInfoCertReg/BioInfoCertRegPage) */
  MEMBER_VERIFY: '/v1/auth/member/verify',
  /** 아이디 찾기(본인인증) — MUI-CM-03-M03 (idFndng/IdFndngPage) */
  ID_INQUIRY: '/v1/auth/id-inquiry',
  /** 아이디 찾기(등록정보) — MUI-CM-03-M04 (idRegInfoFndng/IdRegInfoFndngPage) */
  ID_INQUIRY_BY_REG: '/v1/auth/id-inquiry/reg-info',
  /** 비밀번호 찾기(등록정보) — MUI-CM-03-M07 (pswdRegInfoFndng/PswdRegInfoFndngPage) */
  PASSWORD_INQUIRY_BY_REG: '/v1/auth/password-inquiry/reg-info',
  /** 비밀번호 변경 — MUI-CM-02-M05 (pswdChg/PswdChgPage · pswdRslt/PswdRsltPage) */
  PASSWORD_CHANGE: '/v1/auth/password',
  /** 소속 업체 목록 — MUI-MS-01-P14 (bzentyChc/BzentyChc) */
  MY_BZENTY_LIST: '/v1/auth/my/bzentys',
  /** 앱 접근권한 동의 — MUI-MS-01 (appAuthrtAgre/AppAuthrtAgrePage) */
  APP_PERMISSION_AGREE: '/v1/auth/app-permissions/agree',
  /** 통합계정 등록 대상 조회(본인인증 후) — MUI-CM-03-M22 (newId/NewIdPwReg) */
  INTG_ACNT_TARGET: '/v1/auth/intg-account/target',
  /** 통합계정 아이디 중복확인 — MUI-CM-03-M22 (newId/NewIdPwReg) */
  INTG_ACNT_ID_CHECK: '/v1/auth/intg-account/id-check',
  /** 통합계정 등록 — MUI-CM-03-M22 (newId/NewIdPwReg) */
  INTG_ACNT_REGISTER: '/v1/auth/intg-account',
} as const

export const authService = {
  // ── 로그인 ─────────────────────────────────────────────────────────────────

  /** ID/PW 로그인. 성공 시 소속 업체가 여럿이면 LoginResult.bzentyList 로 업체선택 유도. */
  async login(req: LoginRequest): Promise<LoginResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.loginResult)
    return apiClient.post<LoginResult, LoginResult>(EP.LOGIN, req)
  },

  /** 로그인 업체 확정 — 선택한 업체코드로 로그인 확정(단일 업체). */
  async loginWith(bzentyCd: string): Promise<LoginResult> {
    if (USE_MOCK) {
      const bzenty = MOCK_AUTH.bzentyList.find((b) => b.bzentyCd === bzentyCd)
      return mockDelay({
        ...MOCK_AUTH.loginResult,
        bzentyList: bzenty ? [bzenty] : MOCK_AUTH.bzentyList.slice(0, 1),
      })
    }
    return apiClient.post<LoginResult, LoginResult>(EP.LOGIN_WITH_BZENTY, { bzentyCd })
  },

  /** 생체인증 로그인 — 디바이스 생체인증(하이브리드) 성공 후 세션 확정. */
  async biometricLogin(): Promise<LoginResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.loginResult)
    return apiClient.post<LoginResult, LoginResult>(EP.BIOMETRIC_LOGIN, {})
  },

  // ── 본인확인 / ID·PW 찾기 ──────────────────────────────────────────────────

  /** 본인확인(회원조회) — 간편/본인인증 수단으로 회원 존재 검증. */
  async verifyMember(certMethod: string, req: MemberVerifyRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.MEMBER_VERIFY, { certMethod, ...req })
  },

  /** 아이디 찾기(본인인증) — 인증수단으로 본인확인 후 마스킹 아이디 반환. */
  async startIdInquiry(certMethod: string): Promise<IdInquiryResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.idInquiry)
    return apiClient.post<IdInquiryResult, IdInquiryResult>(EP.ID_INQUIRY, { certMethod })
  },

  /** 아이디 찾기(등록정보) — 사업자번호·성명·생년월일로 마스킹 아이디 반환. */
  async findIdByRegInfo(req: FindIdRequest): Promise<IdInquiryResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.idInquiry)
    return apiClient.post<IdInquiryResult, IdInquiryResult>(EP.ID_INQUIRY_BY_REG, req)
  },

  /** 비밀번호 찾기(등록정보) — 등록정보 확인 후 재설정 흐름 진입(결과화면). */
  async findPasswordByRegInfo(req: FindPasswordRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.PASSWORD_INQUIRY_BY_REG, req)
  },

  /** 비밀번호 변경 — 사용자 비밀번호 변경 / 찾기 후 재설정 공용. */
  async changePassword(req: ChangePasswordRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.PASSWORD_CHANGE, req)
  },

  // ── 업체 / 앱 권한 ─────────────────────────────────────────────────────────

  /** 소속 업체 목록 조회 — 로그인업체선택(BzentyChc). */
  async getMyBzentyList(): Promise<BzentyChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.bzentyList)
    return apiClient.get<BzentyChcItem[], BzentyChcItem[]>(EP.MY_BZENTY_LIST)
  },

  /** 앱 접근권한 동의 — 필수 접근권한 동의 처리. */
  async agreeAppPermission(permissionIds: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.APP_PERMISSION_AGREE, { permissionIds })
  },

  // ── 통합 로그인 계정 등록(MUI-CM-03-M22) ──────────────────────────────────

  /** 통합계정 등록 대상 조회 — 본인인증(CI 획득) 후 성명·기존 사용자 아이디 목록 반환. */
  async getIntgAcntTarget(): Promise<IntgAcntTarget> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.intgAcntTarget)
    return apiClient.get<IntgAcntTarget, IntgAcntTarget>(EP.INTG_ACNT_TARGET)
  },

  /** 통합계정 아이디 중복확인 — 등록하려는 아이디의 사용 가능 여부 반환. */
  async checkIntgAcntId(userId: string): Promise<IntgAcntIdCheckResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.intgAcntIdCheck)
    return apiClient.get<IntgAcntIdCheckResult, IntgAcntIdCheckResult>(EP.INTG_ACNT_ID_CHECK, {
      params: { userId },
    })
  },

  /** 통합계정 등록 — 통합 로그인 계정(아이디·비밀번호)을 생성한다. */
  async registerIntgAcnt(req: RegisterIntgAcntRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.INTG_ACNT_REGISTER, req)
  },
}
