// 인증(Auth) Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: authService(services/bds/auth.ts) · authQueries(이 파일) · authKeys(authKeys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = authKeys(함수명 동일).
// 인증 흐름은 전부 사용자 액션 시점 실행(이벤트성)이라 useMutation 훅으로만 구성
// (2026-07-30 확정 — 페이지의 서비스 직접 import 금지).
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/bds/auth'
import type { LoginRequest, RegisterIntgAcntRequest } from '@/types/domain'

export const authQueries = {
  /** no.650 로그인(아이디/비밀번호) — MUI-MS-02 IdPswdLogin. */
  useProcIdPswdLogin() {
    return useMutation({ mutationFn: (req: LoginRequest) => authService.procIdPswdLogin(req) })
  },

  /** 업체 선택 후 로그인 확정(복수 업체 계정). */
  useLoginWith() {
    return useMutation({ mutationFn: (bzentyCd: string) => authService.loginWith(bzentyCd) })
  },

  /**
   * no.657 인증수단 로그인(간편/공동/금융/모바일신분증) — 생체인증 확정(BioInfoCertRslt).
   * 현재 소비처(생체인증)는 수단을 고르지 않아 인자 없이 호출한다 — 수단 선택 화면이 생기면 certSeCd 를 받는다.
   */
  useProcCertLogin() {
    return useMutation({ mutationFn: () => authService.procCertLogin() })
  },

  /** 통합계정 전환 대상 조회(NewIdPwReg On-Load) — 이벤트 시점 조회라 mutation 노출. */
  useSelectIntgAcntTarget() {
    return useMutation({ mutationFn: () => authService.selectIntgAcntTarget() })
  },

  /** 통합계정 ID 중복확인(NewIdPwReg). */
  useCheckIntgAcntId() {
    return useMutation({ mutationFn: (userId: string) => authService.checkIntgAcntId(userId) })
  },

  /** no.658 통합로그인계정생성(NewIdPwReg 제출). */
  useInsertIntgLoginInfo() {
    return useMutation({
      mutationFn: (req: RegisterIntgAcntRequest) => authService.insertIntgLoginInfo(req),
    })
  },
}
