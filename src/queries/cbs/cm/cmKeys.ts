// 공통관리(CM) 도메인 쿼리키 — 키명 = 서비스 함수명(services/cbs/cm.ts)과 통일.
// 구조: ['cm', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['cm'])·함수 prefix 무효화 모두 가능.
// 훅 파일(cmQueries.ts)과 분리 이유: mutation 무효화가 파일 경계를 넘어도 순환 import 없이 키만 참조.
export const cmKeys = {
  /** no.686 실적증명서제출목록조회(MUI-CM-04-P20). */
  selectPrfmncPrdocSbmsnList: (prfmncRcptNo: string) =>
    ['cm', 'selectPrfmncPrdocSbmsnList', prfmncRcptNo] as const,

  // ── 인증(구 authKeys — 2026-08-24 cm 흡수, 1단 'auth' → 'cm' 통합) ─────────
  /** no.654 업체목록조회(로그인업체선택) — 백엔드 메서드명 selectPrcmBzentyList(login), no.644 와 충돌로 접두. */
  selectLoginPrcmBzentyList: ['cm', 'selectLoginPrcmBzentyList'] as const,
  /** no.659 사용자정보조회. */
  selectUserInfo: ['cm', 'selectUserInfo'] as const,
  selectIntgAcntTarget: ['cm', 'selectIntgAcntTarget'] as const,
}
