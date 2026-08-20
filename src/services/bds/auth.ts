// 인증(auth) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환(어떤 자격증명이든 성공) · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: authKeys.selectXxx / useSelectXxx) — 실 API 목록(no.645~660·675·676) 기준.
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로).
//   대상 컨트롤러: LoginController(/cbs/cm/login/*) · UserMngController(/cbs/cm/userReg|userInfoMng/*).
//   ※ /cbs/cm/userInfoMng/* 중 업체사용자관리(no.665/666)·알림서비스(no.663/664)는 소비 화면이 cm 이라
//     cmService 에 남겨 두었다(도메인 = 화면 기준).
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
  User,
} from '@/types/domain'

export const authService = {
  // ── 로그인 ─────────────────────────────────────────────────────────────────

  /**
   * no.650 로그인(아이디/비밀번호) — MUI-CM-03-M02 (idPswdLogin/IdPswdLoginPage).
   * 성공 시 소속 업체가 여럿이면 LoginResult.bzentyList 로 업체선택 유도. 구 `login`.
   */
  async procIdPswdLogin(req: LoginRequest): Promise<LoginResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.loginResult)
    return apiClient.post<LoginResult, LoginResult>('/cbs/cm/login/procIdPswdLogin.do', req)
  },

  /**
   * 로그인 업체 확정 — MUI-MS-01-P14 (idPswdLogin/IdPswdLoginPage · bzentyChc/BzentyChc).
   * TODO(백엔드 확정): 업체 확정 전용 API 가 실목록에 없어 no.650 과 같은 URL 로 bzentyCd 를 덧붙여 재호출한다.
   *   별도 메서드(예: procBzentyChcLogin)가 확인되면 URL 만 교체.
   */
  async loginWith(bzentyCd: string): Promise<LoginResult> {
    if (USE_MOCK) {
      const bzenty = MOCK_AUTH.bzentyList.find((b) => b.bzentyCd === bzentyCd)
      return mockDelay({
        ...MOCK_AUTH.loginResult,
        bzentyList: bzenty ? [bzenty] : MOCK_AUTH.bzentyList.slice(0, 1),
      })
    }
    return apiClient.post<LoginResult, LoginResult>('/cbs/cm/login/procIdPswdLogin.do', {
      bzentyCd,
    })
  },

  /**
   * no.657 로그인(간편인증/공동인증/금융인증/모바일신분증인증) — MUI-CM-01 (bioInfoCertReg/BioInfoCertRegPage).
   * 구 `biometricLogin`. 디바이스 생체인증(하이브리드) 성공 후 세션 확정.
   * TODO(백엔드 확정): 생체인증이 이 API 의 인증수단(certSeCd) 한 종류인지 — 모바일 전용 별도 API 인지 확인 필요.
   */
  async procCertLogin(certSeCd?: string): Promise<LoginResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.loginResult)
    return apiClient.post<LoginResult, LoginResult>('/cbs/cm/login/procCertLogin.do', { certSeCd })
  },

  /** no.655 QR코드생성 — PC QR 로그인(MUI-CM-03-M17). PC 측 QR 발급. 소비처 대기. */
  async procQrCode(): Promise<{ qrToken: string }> {
    if (USE_MOCK) return mockDelay({ qrToken: 'mock-qr-token' })
    return apiClient.post<{ qrToken: string }, { qrToken: string }>('/cbs/cm/login/procQrCode.do')
  },

  /**
   * no.656 로그인(QR) — MUI-CM-03-M17 (pcQRLgn/PcQRLgnPage).
   * 모바일이 스캔한 QR 토큰으로 PC 로그인을 승인한다. 구 `cmService.scanPcQr`(login 계열이라 auth 로 이관).
   */
  async procQrLogin(qrToken: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/cbs/cm/login/procQrLogin.do', { qrToken })
  },

  // ── 본인확인 / ID·PW 찾기 ──────────────────────────────────────────────────

  /**
   * no.645 anyId인증 — MUI-CM-01 (bioInfoCertReg/BioInfoCertRegPage) 본인확인(회원조회).
   * 구 `verifyMember`. 간편/본인인증 수단으로 회원 존재 검증.
   */
  async procAnyIdCert(certMethod: string, req: MemberVerifyRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/cbs/cm/userReg/procAnyIdCert.do', { certMethod, ...req })
  },

  /**
   * no.651 아이디찾기(본인인증) — MUI-CM-03-M03 (idFndng/IdFndngPage).
   * 구 `startIdInquiry`. 인증수단으로 본인확인 후 마스킹 아이디 반환.
   */
  async selectIdFndng(certMethod: string): Promise<IdInquiryResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.idInquiry)
    return apiClient.post<IdInquiryResult, IdInquiryResult>('/cbs/cm/login/selectIdFndng.do', {
      certMethod,
    })
  },

  /**
   * 아이디 찾기(등록정보) — MUI-CM-03-M04 (idRegInfoFndng/IdRegInfoFndngPage). 구 `findIdByRegInfo`.
   * TODO(백엔드 확정): 실 API 는 no.651 하나뿐이라 같은 URL 을 쓰되 요청 항목(사업자번호·성명·생년월일)이
   *   달라 함수를 분리해 둔다. 등록정보 전용 메서드 확인 시 URL 교체.
   */
  async selectIdFndngByRegInfo(req: FindIdRequest): Promise<IdInquiryResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.idInquiry)
    return apiClient.post<IdInquiryResult, IdInquiryResult>('/cbs/cm/login/selectIdFndng.do', req)
  },

  /**
   * no.652 비밀번호찾기 — MUI-CM-03-M07 (pswdRegInfoFndng/PswdRegInfoFndngPage).
   * 구 `findPasswordByRegInfo`. 등록정보 확인 후 재설정 흐름 진입(결과화면).
   */
  async selectPswdFndng(req: FindPasswordRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/cbs/cm/login/selectPswdFndng.do', req)
  },

  /**
   * no.653 비밀번호설정 — MUI-CM-02-M05 (pswdChg/PswdChgPage · pswdRslt/PswdRsltPage).
   * 구 `changePassword`. 사용자 비밀번호 변경 / 찾기 후 재설정 공용.
   */
  async procPswdStng(req: ChangePasswordRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/cbs/cm/login/procPswdStng.do', req)
  },

  // ── 업체 / 앱 권한 ─────────────────────────────────────────────────────────

  /**
   * no.654 업체목록조회 — MUI-MS-01-P14 (bzentyChc/BzentyChc), 로그인업체선택. 구 `selectMyBzentyList`.
   * ※ 같은 이름의 no.644(PrcmBzentyInfoMngController 조달업체목록조회)는 URL 이 달라 cmService 에 따로 있다.
   */
  async selectPrcmBzentyList(): Promise<BzentyChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.bzentyList)
    return apiClient.post<BzentyChcItem[], BzentyChcItem[]>('/cbs/cm/login/selectPrcmBzentyList.do')
  },

  /**
   * 앱 접근권한 동의 — MUI-MS-01 (appAuthrtAgre/AppAuthrtAgrePage).
   * TODO(백엔드 확정): 실 API 목록에 대응 메서드 없음(모바일 전용) — URL 임시, 반입 전 확인 필요.
   */
  async agreeAppPermission(permissionIds: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/auth/app-permissions/agree', { permissionIds })
  },

  // ── 사용자정보 (UserMngController /cbs/cm/userInfoMng) ─────────────────────

  /** no.659 사용자정보조회 — MUI-CM-02 (indvInfoMdfcn/IndvInfoMdfcnPage) 진입 조회. 소비처 대기. */
  async selectUserInfo(): Promise<User> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.user)
    return apiClient.post<User, User>('/cbs/cm/userInfoMng/selectUserInfo.do')
  },

  /** no.660 사용자정보변경 — MUI-CM-02 (indvInfoMdfcn/IndvInfoMdfcnPage) 저장. 소비처 대기. */
  async updateUserInfo(req: Partial<User>): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/cbs/cm/userInfoMng/updateUserInfo.do', req)
  },

  /** no.675 인증서인증 — MUI-CM-02 (indvCert/IndvCertPage) 공동인증서 인증. 소비처 대기. */
  async procCrtfCert(req: { crtfDn?: string; signedData?: string }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/cbs/cm/userInfoMng/procCrtfCert.do', req)
  },

  /**
   * no.676 작성자정보조회 — 게시물/문서 작성자 정보. 소비처 대기.
   * TODO(백엔드 확정): 응답 항목 미확정 — 소비 화면 배선 시 types/domain.ts 에 타입 추가.
   */
  async selectWrtrInfoInqList(req: { wrtrId?: string } = {}): Promise<User[]> {
    if (USE_MOCK) return mockDelay([MOCK_AUTH.user])
    return apiClient.post<User[], User[]>('/cbs/cm/userInfoMng/selectWrtrInfoInqList.do', req)
  },

  // ── 통합 로그인 계정 등록(MUI-CM-03-M22) ──────────────────────────────────

  /**
   * 통합계정 등록 대상 조회 — MUI-CM-03-M22 (newId/NewIdPwReg).
   * 본인인증(CI 획득) 후 성명·기존 사용자 아이디 목록 반환.
   * TODO(백엔드 확정): 실 API 목록에 대응 메서드 없음 — URL 임시(no.658 등록 전 선행 조회로 추정).
   */
  async selectIntgAcntTarget(): Promise<IntgAcntTarget> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.intgAcntTarget)
    return apiClient.post<IntgAcntTarget, IntgAcntTarget>('/v1/auth/intg-account/target')
  },

  /**
   * 통합계정 아이디 중복확인 — MUI-CM-03-M22 (newId/NewIdPwReg).
   * TODO(백엔드 확정): 실 API 목록에 대응 메서드 없음 — URL 임시.
   */
  async checkIntgAcntId(userId: string): Promise<IntgAcntIdCheckResult> {
    if (USE_MOCK) return mockDelay(MOCK_AUTH.intgAcntIdCheck)
    return apiClient.post<IntgAcntIdCheckResult, IntgAcntIdCheckResult>(
      '/v1/auth/intg-account/id-check',
      { userId },
    )
  },

  /**
   * no.658 통합로그인계정생성 — MUI-CM-03-M22 (newId/NewIdPwReg). 구 `registerIntgAcnt`.
   * 통합 로그인 계정(아이디·비밀번호)을 생성한다.
   */
  async insertIntgLoginInfo(req: RegisterIntgAcntRequest): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/cbs/cm/login/insertIntgLoginInfo.do', req)
  },
}
