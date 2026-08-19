// 인증(auth) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환(어떤 자격증명이든 성공) · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: authKeys.selectXxx / useSelectXxx) — 실규격 확정 전 임시 명명(select~ 스타일).
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로 확정 시 해당 함수만 수정).
// 백엔드 로그인 응답 형태는 미확정 — 서비스가 LoginResult(안정 형태)로 매핑해 페이지/스토어를 격리한다.
// 응답 인터셉터가 봉투를 벗기므로 apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정한다.
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

export const authService = {
  // ── 로그인 ─────────────────────────────────────────────────────────────────

  /**
   * ID/PW 로그인 — MUI-CM-03-M02 (idPswdLogin/IdPswdLoginPage).
   * 성공 시 소속 업체가 여럿이면 LoginResult.bzentyList 로 업체선택 유도.
   */
  async login(req: LoginRequest): Promise<LoginResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.loginResult)
    return apiClient.post<LoginResult, LoginResult>('/v1/auth/login', req)
  },

  /**
   * 로그인 업체 확정 — MUI-MS-01-P14 (idPswdLogin/IdPswdLoginPage · bzentyChc/BzentyChc).
   * 선택한 업체코드로 로그인 확정(단일 업체).
   */
  async loginWith(bzentyCd: string): Promise<LoginResult> {
    if (USE_MOCK) {
      const bzenty = MOCK_AUTH.bzentyList.find((b) => b.bzentyCd === bzentyCd)
      return mockDelay({
        ...MOCK_AUTH.loginResult,
        bzentyList: bzenty ? [bzenty] : MOCK_AUTH.bzentyList.slice(0, 1),
      })
    }
    return apiClient.post<LoginResult, LoginResult>('/v1/auth/login/bzenty', { bzentyCd })
  },

  /**
   * 생체인증 로그인 — MUI-CM-01 (bioInfoCertReg/BioInfoCertRegPage).
   * 디바이스 생체인증(하이브리드) 성공 후 세션 확정.
   */
  async biometricLogin(): Promise<LoginResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.loginResult)
    return apiClient.post<LoginResult, LoginResult>('/v1/auth/login/biometric', {})
  },

  // ── 본인확인 / ID·PW 찾기 ──────────────────────────────────────────────────

  /**
   * 본인확인(회원조회) — MUI-CM-01 (bioInfoCertReg/BioInfoCertRegPage).
   * 간편/본인인증 수단으로 회원 존재 검증.
   */
  async verifyMember(certMethod: string, req: MemberVerifyRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/auth/member/verify', { certMethod, ...req })
  },

  /**
   * 아이디 찾기(본인인증) — MUI-CM-03-M03 (idFndng/IdFndngPage).
   * 인증수단으로 본인확인 후 마스킹 아이디 반환.
   */
  async startIdInquiry(certMethod: string): Promise<IdInquiryResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.idInquiry)
    return apiClient.post<IdInquiryResult, IdInquiryResult>('/v1/auth/id-inquiry', { certMethod })
  },

  /**
   * 아이디 찾기(등록정보) — MUI-CM-03-M04 (idRegInfoFndng/IdRegInfoFndngPage).
   * 사업자번호·성명·생년월일로 마스킹 아이디 반환.
   */
  async findIdByRegInfo(req: FindIdRequest): Promise<IdInquiryResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.idInquiry)
    return apiClient.post<IdInquiryResult, IdInquiryResult>('/v1/auth/id-inquiry/reg-info', req)
  },

  /**
   * 비밀번호 찾기(등록정보) — MUI-CM-03-M07 (pswdRegInfoFndng/PswdRegInfoFndngPage).
   * 등록정보 확인 후 재설정 흐름 진입(결과화면).
   */
  async findPasswordByRegInfo(req: FindPasswordRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/auth/password-inquiry/reg-info', req)
  },

  /**
   * 비밀번호 변경 — MUI-CM-02-M05 (pswdChg/PswdChgPage · pswdRslt/PswdRsltPage).
   * 사용자 비밀번호 변경 / 찾기 후 재설정 공용.
   */
  async changePassword(req: ChangePasswordRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/auth/password', req)
  },

  // ── 업체 / 앱 권한 ─────────────────────────────────────────────────────────

  /** 소속 업체 목록 조회 — MUI-MS-01-P14 (bzentyChc/BzentyChc), 로그인업체선택. */
  async selectMyBzentyList(): Promise<BzentyChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.bzentyList)
    return apiClient.post<BzentyChcItem[], BzentyChcItem[]>('/v1/auth/my/bzentys')
  },

  /**
   * 앱 접근권한 동의 — MUI-MS-01 (appAuthrtAgre/AppAuthrtAgrePage).
   * 필수 접근권한 동의 처리.
   */
  async agreeAppPermission(permissionIds: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/auth/app-permissions/agree', { permissionIds })
  },

  // ── 통합 로그인 계정 등록(MUI-CM-03-M22) ──────────────────────────────────

  /**
   * 통합계정 등록 대상 조회 — MUI-CM-03-M22 (newId/NewIdPwReg).
   * 본인인증(CI 획득) 후 성명·기존 사용자 아이디 목록 반환.
   */
  async selectIntgAcntTarget(): Promise<IntgAcntTarget> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.intgAcntTarget)
    return apiClient.post<IntgAcntTarget, IntgAcntTarget>('/v1/auth/intg-account/target')
  },

  /**
   * 통합계정 아이디 중복확인 — MUI-CM-03-M22 (newId/NewIdPwReg).
   * 등록하려는 아이디의 사용 가능 여부 반환.
   */
  async checkIntgAcntId(userId: string): Promise<IntgAcntIdCheckResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.intgAcntIdCheck)
    return apiClient.post<IntgAcntIdCheckResult, IntgAcntIdCheckResult>(
      '/v1/auth/intg-account/id-check',
      { userId },
    )
  },

  /**
   * 통합계정 등록 — MUI-CM-03-M22 (newId/NewIdPwReg).
   * 통합 로그인 계정(아이디·비밀번호)을 생성한다.
   */
  async registerIntgAcnt(req: RegisterIntgAcntRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/auth/intg-account', req)
  },
}
