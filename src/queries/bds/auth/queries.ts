// 인증(Auth) Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: authService(services/bds/auth.ts) · authQueries(이 파일) · authKeys(keys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = keys.ts(함수명 동일).
// 인증 흐름은 전부 사용자 액션 시점 실행(이벤트성)이라 useMutation 훅으로만 구성
// (2026-07-30 확정 — 페이지의 서비스 직접 import 금지).
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/bds/auth'
import type { LoginRequest, RegisterIntgAcntRequest } from '@/types/domain'

export const authQueries = {
  /** ID/PW 로그인(MUI-MS-02 IdPswdLogin). */
  useLogin() {
    return useMutation({ mutationFn: (req: LoginRequest) => authService.login(req) })
  },

  /** 업체 선택 후 로그인 확정(복수 업체 계정). */
  useLoginWith() {
    return useMutation({ mutationFn: (bzentyCd: string) => authService.loginWith(bzentyCd) })
  },

  /** 생체인증 로그인(BioInfoCertRslt). */
  useBiometricLogin() {
    return useMutation({ mutationFn: () => authService.biometricLogin() })
  },

  /** 통합계정 전환 대상 조회(NewIdPwReg On-Load) — 이벤트 시점 조회라 mutation 노출. */
  useSelectIntgAcntTarget() {
    return useMutation({ mutationFn: () => authService.selectIntgAcntTarget() })
  },

  /** 통합계정 ID 중복확인(NewIdPwReg). */
  useCheckIntgAcntId() {
    return useMutation({ mutationFn: (userId: string) => authService.checkIntgAcntId(userId) })
  },

  /** 통합계정 등록(NewIdPwReg 제출). */
  useRegisterIntgAcnt() {
    return useMutation({
      mutationFn: (req: RegisterIntgAcntRequest) => authService.registerIntgAcnt(req),
    })
  },
}
