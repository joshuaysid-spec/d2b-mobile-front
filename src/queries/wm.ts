// 대금청구/사후(WM) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 조회는 useQuery 훅. queryKey 는 wmKeys 로 중앙 관리 — 무효화/프리페치 시 여기서만 참조.
import { useQuery } from '@tanstack/react-query'
import { wmService } from '@/services/wm'
import type { PymtClmIntgListRequest } from '@/types/wm'

export const wmKeys = {
  pymtClmIntgList: (req: PymtClmIntgListRequest) => ['wm', 'pymtClmIntgList', req] as const,
  pymtClmAplyList: (ctrtNo: string) => ['wm', 'pymtClmAplyList', ctrtNo] as const,
}

/** 대금청구통합목록(M01) — 키워드 세부 필터/더보기 페이징은 페이지 클라이언트 로직 유지(서버 전환 시 req 로 이행). */
export function usePymtClmIntgList(req: PymtClmIntgListRequest = {}) {
  return useQuery({
    queryKey: wmKeys.pymtClmIntgList(req),
    queryFn: () => wmService.getPymtClmIntgList(req),
  })
}

/** 대금청구신청목록(P13) — 바텀시트 열릴 때만 조회. */
export function usePymtClmAplyList(ctrtNo: string, enabled: boolean) {
  return useQuery({
    queryKey: wmKeys.pymtClmAplyList(ctrtNo),
    queryFn: () => wmService.getPymtClmAplyList(ctrtNo),
    enabled: Boolean(ctrtNo) && enabled,
  })
}
