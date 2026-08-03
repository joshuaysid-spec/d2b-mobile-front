// 이행(EX) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 조회는 useQuery 훅. queryKey 는 exKeys 로 중앙 관리 — 무효화/프리페치 시 여기서만 참조.
import { useQuery } from '@tanstack/react-query'
import { exService } from '@/services/ex'
import type { InspIntgListRequest } from '@/types/ex'

export const exKeys = {
  inspIntgList: (req: InspIntgListRequest) => ['ex', 'inspIntgList', req] as const,
  dlvgdsAvtsmtList: (ctrtNo: string) => ['ex', 'dlvgdsAvtsmtList', ctrtNo] as const,
  inspDlvdocList: (ctrtNo: string, avtsmtNo: string) =>
    ['ex', 'inspDlvdocList', ctrtNo, avtsmtNo] as const,
}

/** 검사통합목록(M01) — 키워드 세부 필터/더보기 페이징은 페이지 클라이언트 로직 유지(서버 전환 시 req 로 이행). */
export function useInspIntgList(req: InspIntgListRequest = {}) {
  return useQuery({
    queryKey: exKeys.inspIntgList(req),
    queryFn: () => exService.getInspIntgList(req),
  })
}

/** 납품통지목록(P10) — 풀팝업 열릴 때만 조회. */
export function useDlvgdsAvtsmtList(ctrtNo: string, enabled: boolean) {
  return useQuery({
    queryKey: exKeys.dlvgdsAvtsmtList(ctrtNo),
    queryFn: () => exService.getDlvgdsAvtsmtList(ctrtNo),
    enabled: Boolean(ctrtNo) && enabled,
  })
}

/** 검사및납품조서목록(P11) — 바텀시트 열릴 때만 조회. */
export function useInspDlvdocList(ctrtNo: string, avtsmtNo: string, enabled: boolean) {
  return useQuery({
    queryKey: exKeys.inspDlvdocList(ctrtNo, avtsmtNo),
    queryFn: () => exService.getInspDlvdocList(ctrtNo, avtsmtNo),
    enabled: Boolean(ctrtNo) && Boolean(avtsmtNo) && enabled,
  })
}
