// 공통관리(CM) 도메인 쿼리키 — 키명 = 서비스 함수명(services/bds/cm.ts)과 통일.
// 구조: ['cm', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['cm'])·함수 prefix 무효화 모두 가능.
// 훅 파일(queries.ts)과 분리 이유: mutation 무효화가 파일 경계를 넘어도 순환 import 없이 키만 참조.
export const cmKeys = {
  /** 실적증명서 제출 협회 목록(MUI-CM-04-P20). */
  selectSbmsnAsctnList: (prfmncRcptNo: string) =>
    ['cm', 'selectSbmsnAsctnList', prfmncRcptNo] as const,
}
