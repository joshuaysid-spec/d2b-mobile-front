// 지원시스템(tss) cm 도메인 Query 훅 — services/tss/cm.ts 1:1. 3자 대칭: tssCmService · tssCmQueries · tssCmKeys.
// 훅명 = use + 서비스 함수명. 조회 = useQuery(페이지의 서비스 직접 import 금지 — 페이지는 이 훅만).
// 게시판(공지·자료실·FAQ) 배선은 일반공지사항(M01·M02)부터 — 나머지 게시판은 같은 패턴으로 훅 추가.
import { useQuery } from '@tanstack/react-query'
import { tssCmService } from '@/services/tss/cm'
import { tssCmKeys } from '@/queries/tss/cm/tssCmKeys'
import type { MockBoardListRequest } from '@/types/mock/cm'

export const tssCmQueries = {
  /** 공지사항 목록 — 검색 확정값(req)별 캐시. 상세의 이전글/다음글도 같은 키(req {})의 캐시를 읽는다. */
  useSelectNoticeList(req: MockBoardListRequest = {}) {
    return useQuery({
      queryKey: tssCmKeys.selectNoticeList(req),
      queryFn: () => tssCmService.selectNoticeList(req),
    })
  },

  /** 공지사항 상세 — contsNo 없으면(state 유실) 요청하지 않음. */
  useSelectNoticeDtl(contsNo: string) {
    return useQuery({
      queryKey: tssCmKeys.selectNoticeDtl(contsNo),
      queryFn: () => tssCmService.selectNoticeDtl(contsNo),
      enabled: Boolean(contsNo),
    })
  },
}
