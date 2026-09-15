// 지원시스템(tss) cm 도메인 쿼리키 — 키명 = 서비스 함수명(services/tss/cm.ts)과 통일.
// 구조: ['tssCm', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['tssCm'])·함수 prefix 무효화 모두 가능.
// cbs 의 cmKeys(['cm', …])와 접두를 달리해 캐시 충돌 방지.
import type { MockBoardListRequest } from '@/types/mock/cm'

export const tssCmKeys = {
  /** no.925 공지사항목록조회(MUI-CM-04-M01) — 검색 확정값별 캐시. */
  selectNoticeList: (req: MockBoardListRequest) => ['tssCm', 'selectNoticeList', req] as const,
  /** no.926 공지사항상세조회(MUI-CM-04-M02). */
  selectNoticeDtl: (contsNo: string) => ['tssCm', 'selectNoticeDtl', contsNo] as const,
}
