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

  // ── 업체정보 추가등록 물품(내자) M05 프리필(v0.87 검토 33번 — 기존 정보 불러와 표시) ─────
  /** 업체기본정보(사업자번호·업체코드). */
  selectBzentyBscInfo: ['cm', 'selectBzentyBscInfo'] as const,
  /** no.621 업체물품(내자)정보(대표품류/조합·등록품목). */
  selectBzentyDmscptInfo: (bzentyCd: string) => ['cm', 'selectBzentyDmscptInfo', bzentyCd] as const,
  /** 등록품목명세 목록(URL 임시). */
  selectRegItemList: ['cm', 'selectRegItemList'] as const,
}
