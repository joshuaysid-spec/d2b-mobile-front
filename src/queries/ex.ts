// 이행(EX) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 조회는 useQuery 훅. queryKey 는 exKeys 로 중앙 관리 — 무효화/프리페치 시 여기서만 참조.
import { useQuery } from '@tanstack/react-query'
import { exService } from '@/services/ex'
import type { InspDlvdocPrstRequest, InspIntgListRequest } from '@/types/ex'

export const exKeys = {
  inspIntgList: (req: InspIntgListRequest) => ['ex', 'inspIntgList', req] as const,
  dlvgdsAvtsmtList: (ctrtNo: string) => ['ex', 'dlvgdsAvtsmtList', ctrtNo] as const,
  inspDlvdocList: (ctrtNo: string, avtsmtNo: string) =>
    ['ex', 'inspDlvdocList', ctrtNo, avtsmtNo] as const,
  inspDlvdocDtl: (id: string) => ['ex', 'inspDlvdocDtl', id] as const,
  inspDlvdocCmdtys: (id: string) => ['ex', 'inspDlvdocCmdtys', id] as const,
  inspDlvdocSbsdDtl: (id: string) => ['ex', 'inspDlvdocSbsdDtl', id] as const,
  inspDlvdocSbsdCmdtys: (id: string) => ['ex', 'inspDlvdocSbsdCmdtys', id] as const,
  pxcndCmcnInspDtl: (id: string) => ['ex', 'pxcndCmcnInspDtl', id] as const,
  inspDlvdocPrstList: (req: InspDlvdocPrstRequest) => ['ex', 'inspDlvdocPrstList', req] as const,
  dlvdocRsltDtl: (id: string) => ['ex', 'dlvdocRsltDtl', id] as const,
  dlvdocRsltCmdtys: (id: string) => ['ex', 'dlvdocRsltCmdtys', id] as const,
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

/** 검사및납품조서상세(M02) — 목록 state 는 placeholder 로 쓰지 않음(필드 구성이 달라 조회로 확정). */
export function useInspDlvdocDtl(id: string) {
  return useQuery({
    queryKey: exKeys.inspDlvdocDtl(id),
    queryFn: () => exService.getInspDlvdocDtl(id),
    enabled: Boolean(id),
  })
}

/** 검사및납품조서상세 물품목록(T02). */
export function useInspDlvdocCmdtys(id: string) {
  return useQuery({
    queryKey: exKeys.inspDlvdocCmdtys(id),
    queryFn: () => exService.getInspDlvdocCmdtys(id),
    enabled: Boolean(id),
  })
}

/** 검사및납품조서상세(부대조달, M03). */
export function useInspDlvdocSbsdDtl(id: string) {
  return useQuery({
    queryKey: exKeys.inspDlvdocSbsdDtl(id),
    queryFn: () => exService.getInspDlvdocSbsdDtl(id),
    enabled: Boolean(id),
  })
}

/** 부대조달 물품목록(T04). */
export function useInspDlvdocSbsdCmdtys(id: string) {
  return useQuery({
    queryKey: exKeys.inspDlvdocSbsdCmdtys(id),
    queryFn: () => exService.getInspDlvdocSbsdCmdtys(id),
    enabled: Boolean(id),
  })
}

/** 기성및준공검사상세(M04). */
export function usePxcndCmcnInspDtl(id: string) {
  return useQuery({
    queryKey: exKeys.pxcndCmcnInspDtl(id),
    queryFn: () => exService.getPxcndCmcnInspDtl(id),
    enabled: Boolean(id),
  })
}

/** 검사및납품조서현황목록(M05). */
export function useInspDlvdocPrstList(req: InspDlvdocPrstRequest = {}) {
  return useQuery({
    queryKey: exKeys.inspDlvdocPrstList(req),
    queryFn: () => exService.getInspDlvdocPrstList(req),
  })
}

/** 검사및납품조서결과상세(M07). */
export function useDlvdocRsltDtl(id: string) {
  return useQuery({
    queryKey: exKeys.dlvdocRsltDtl(id),
    queryFn: () => exService.getDlvdocRsltDtl(id),
    enabled: Boolean(id),
  })
}

/** 결과상세 물품목록(T06). */
export function useDlvdocRsltCmdtys(id: string) {
  return useQuery({
    queryKey: exKeys.dlvdocRsltCmdtys(id),
    queryFn: () => exService.getDlvdocRsltCmdtys(id),
    enabled: Boolean(id),
  })
}
