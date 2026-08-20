// 인증(auth) 도메인 쿼리키 — 키명 = 서비스 함수명(services/bds/auth.ts)과 통일.
// 구조: ['auth', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['auth'])·함수 prefix 무효화 모두 가능.
// 인증 흐름은 현재 전부 이벤트성(useMutation)이라 조회 함수(select~)만 키를 둔다.
export const authKeys = {
  /** no.654 업체목록조회(로그인업체선택). */
  selectPrcmBzentyList: ['auth', 'selectPrcmBzentyList'] as const,
  /** no.659 사용자정보조회. */
  selectUserInfo: ['auth', 'selectUserInfo'] as const,
  selectIntgAcntTarget: ['auth', 'selectIntgAcntTarget'] as const,
}
