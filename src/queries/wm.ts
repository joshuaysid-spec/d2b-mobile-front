// 대금청구/사후(WM) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 조회는 useQuery 훅. queryKey 는 wmKeys 로 중앙 관리 — 무효화/프리페치 시 여기서만 참조.
import { useQuery } from '@tanstack/react-query'
import { wmService } from '@/services/wm'
import type { PymtClmIntgListRequest } from '@/types/wm'

export const wmKeys = {
  pymtClmIntgList: (req: PymtClmIntgListRequest) => ['wm', 'pymtClmIntgList', req] as const,
  pymtClmAplyList: (ctrtNo: string) => ['wm', 'pymtClmAplyList', ctrtNo] as const,
  prpayApfrDtl: (id: string) => ['wm', 'prpayApfrDtl', id] as const,
  prpayAplyDsctns: (id: string) => ['wm', 'prpayAplyDsctns', id] as const,
  dpsmnItrpyApfrDtl: (id: string) => ['wm', 'dpsmnItrpyApfrDtl', id] as const,
  dpsmnItrpyAplyDsctns: (id: string) => ['wm', 'dpsmnItrpyAplyDsctns', id] as const,
  giveSttsList: (id: string) => ['wm', 'giveSttsList', id] as const,
  centerPrcmPymtClmDtl: (id: string) => ['wm', 'centerPrcmPymtClmDtl', id] as const,
  sbsdPrcmPymtClmDtl: (id: string) => ['wm', 'sbsdPrcmPymtClmDtl', id] as const,
  cstrnPymtClmDtl: (id: string) => ['wm', 'cstrnPymtClmDtl', id] as const,
  pxcndCstPymtClmDtl: (id: string) => ['wm', 'pxcndCstPymtClmDtl', id] as const,
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

/** 선금신청서상세(M02) — 목록 state 는 placeholder 로 쓰지 않음(필드 구성 상이). */
export function usePrpayApfrDtl(id: string) {
  return useQuery({
    queryKey: wmKeys.prpayApfrDtl(id),
    queryFn: () => wmService.getPrpayApfrDtl(id),
    enabled: Boolean(id),
  })
}

/** 선금 세부신청내역(T02). */
export function usePrpayAplyDsctns(id: string) {
  return useQuery({
    queryKey: wmKeys.prpayAplyDsctns(id),
    queryFn: () => wmService.getPrpayAplyDsctns(id),
    enabled: Boolean(id),
  })
}

/** 착·중도금신청서상세(M03). */
export function useDpsmnItrpyApfrDtl(id: string) {
  return useQuery({
    queryKey: wmKeys.dpsmnItrpyApfrDtl(id),
    queryFn: () => wmService.getDpsmnItrpyApfrDtl(id),
    enabled: Boolean(id),
  })
}

/** 착·중도금 세부신청내역(T04). */
export function useDpsmnItrpyAplyDsctns(id: string) {
  return useQuery({
    queryKey: wmKeys.dpsmnItrpyAplyDsctns(id),
    queryFn: () => wmService.getDpsmnItrpyAplyDsctns(id),
    enabled: Boolean(id),
  })
}

/** 지급상태(T23, 상세 공용 탭). */
export function useGiveSttsList(id: string) {
  return useQuery({
    queryKey: wmKeys.giveSttsList(id),
    queryFn: () => wmService.getGiveSttsList(id),
    enabled: Boolean(id),
  })
}

/** 대금청구 상세(중앙조달, M05). */
export function useCenterPrcmPymtClmDtl(id: string) {
  return useQuery({
    queryKey: wmKeys.centerPrcmPymtClmDtl(id),
    queryFn: () => wmService.getCenterPrcmPymtClmDtl(id),
    enabled: Boolean(id),
  })
}

/** 대금청구상세(부대조달, M06). */
export function useSbsdPrcmPymtClmDtl(id: string) {
  return useQuery({
    queryKey: wmKeys.sbsdPrcmPymtClmDtl(id),
    queryFn: () => wmService.getSbsdPrcmPymtClmDtl(id),
    enabled: Boolean(id),
  })
}

/** 대금청구상세(공사, M07). */
export function useCstrnPymtClmDtl(id: string) {
  return useQuery({
    queryKey: wmKeys.cstrnPymtClmDtl(id),
    queryFn: () => wmService.getCstrnPymtClmDtl(id),
    enabled: Boolean(id),
  })
}

/** 대금청구상세(기성대가, M08). */
export function usePxcndCstPymtClmDtl(id: string) {
  return useQuery({
    queryKey: wmKeys.pxcndCstPymtClmDtl(id),
    queryFn: () => wmService.getPxcndCstPymtClmDtl(id),
    enabled: Boolean(id),
  })
}
