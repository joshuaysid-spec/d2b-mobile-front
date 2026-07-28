// 계약(CT) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 조회는 useQuery 훅, 저장/제출은 페이지 핸들러에서 서비스 직접 await(useMutation 미도입).
// queryKey 는 ctKeys 로 중앙 관리 — 무효화/프리페치 시 여기서만 참조.
import { useQuery } from '@tanstack/react-query'
import { ctService } from '@/services/ct'
import type { CncltnRmvListRequest, CtCtrdocType, CtrtIntgListRequest } from '@/types/ct'

export const ctKeys = {
  ctrtIntgList: (req: CtrtIntgListRequest) => ['ct', 'ctrtIntgList', req] as const,
  ctrtPrgrsDtl: (id: string) => ['ct', 'ctrtPrgrsDtl', id] as const,
  ctrtBzentys: (id: string) => ['ct', 'ctrtBzentys', id] as const,
  ctrtRjctRsns: (id: string) => ['ct', 'ctrtRjctRsns', id] as const,
  ctrtAdocs: (id: string) => ['ct', 'ctrtAdocs', id] as const,
  ctrtGrntes: (id: string) => ['ct', 'ctrtGrntes', id] as const,
  ctrtStmtx: (id: string) => ['ct', 'ctrtStmtx', id] as const,
  cmdtyCtrtDtst: (id: string) => ['ct', 'cmdtyCtrtDtst', id] as const,
  cstrnCtrtPrgrsDtl: (id: string) => ['ct', 'cstrnCtrtPrgrsDtl', id] as const,
  ctrtFlws: (id: string) => ['ct', 'ctrtFlws', id] as const,
  cmdtyGnrlCtrdocDtl: (id: string) => ['ct', 'cmdtyGnrlCtrdocDtl', id] as const,
  cmdtyMdfcnCtrdocDtl: (id: string) => ['ct', 'cmdtyMdfcnCtrdocDtl', id] as const,
  cmdtyMdfcnCtrdocDtst: (id: string) => ['ct', 'cmdtyMdfcnCtrdocDtst', id] as const,
  ctrtLastDtst: (id: string) => ['ct', 'ctrtLastDtst', id] as const,
  ctrtSpclCnd: (id: string) => ['ct', 'ctrtSpclCnd', id] as const,
  cmdtyCtrdocDtl: (id: string, type: CtCtrdocType) => ['ct', 'cmdtyCtrdocDtl', type, id] as const,
  cmdtyCtrdocDtst: (id: string, type: CtCtrdocType) =>
    ['ct', 'cmdtyCtrdocDtst', type, id] as const,
  cstrnCtrdocDtl: (id: string) => ['ct', 'cstrnCtrdocDtl', id] as const,
  ctrtJntGrntes: (id: string) => ['ct', 'ctrtJntGrntes', id] as const,
  pymtDfryInfoList: ['ct', 'pymtDfryInfoList'] as const,
  pymtDfryInfoInq: (ctrtNo: string) => ['ct', 'pymtDfryInfoInq', ctrtNo] as const,
  ctrtPrgrsStts: (id: string) => ['ct', 'ctrtPrgrsStts', id] as const,
  ovsCtrtDtl: (id: string) => ['ct', 'ovsCtrtDtl', id] as const,
  ovsBacntInfo: (id: string) => ['ct', 'ovsBacntInfo', id] as const,
  ovsCtrtDtst: (id: string) => ['ct', 'ovsCtrtDtst', id] as const,
  ovsCtrtAdocs: (id: string) => ['ct', 'ovsCtrtAdocs', id] as const,
  ovsCmbzCtrdocDtl: (id: string) => ['ct', 'ovsCmbzCtrdocDtl', id] as const,
  ovsCmbzDtst: (id: string) => ['ct', 'ovsCmbzDtst', id] as const,
  ovsCmbzTrgt: (id: string) => ['ct', 'ovsCmbzTrgt', id] as const,
  ovsCmbzCtrtDtst: (id: string) => ['ct', 'ovsCmbzCtrtDtst', id] as const,
  cncltnRmvList: (req: CncltnRmvListRequest) => ['ct', 'cncltnRmvList', req] as const,
  cmdtyCncltnRmvDtl: (id: string) => ['ct', 'cmdtyCncltnRmvDtl', id] as const,
  cmdtyCncltnRmvBzentys: (id: string) => ['ct', 'cmdtyCncltnRmvBzentys', id] as const,
  cmdtyCncltnRmvNoti: (id: string) => ['ct', 'cmdtyCncltnRmvNoti', id] as const,
  cncltnRmvGnrlCtrtDtl: (id: string, type: CtCtrdocType) =>
    ['ct', 'cncltnRmvGnrlCtrtDtl', type, id] as const,
  cncltnRmvGnrlCtrtDtst: (id: string, type: CtCtrdocType) =>
    ['ct', 'cncltnRmvGnrlCtrtDtst', type, id] as const,
  cncltnRmvSpcl: (id: string) => ['ct', 'cncltnRmvSpcl', id] as const,
  cncltnRmvMdfcnCtrtDtl: (id: string) => ['ct', 'cncltnRmvMdfcnCtrtDtl', id] as const,
  cncltnRmvMdfcnCtrtDtst: (id: string) => ['ct', 'cncltnRmvMdfcnCtrtDtst', id] as const,
  cstrnCncltnRmvDtl: (id: string) => ['ct', 'cstrnCncltnRmvDtl', id] as const,
  cstrnCncltnRmvAdocs: (id: string) => ['ct', 'cstrnCncltnRmvAdocs', id] as const,
}

/** 계약 통합목록 — 키워드 세부 필터/더보기 페이징은 페이지 클라이언트 로직 유지(서버 전환 시 req 로 이행). */
export function useCtrtIntgList(req: CtrtIntgListRequest = {}) {
  return useQuery({
    queryKey: ctKeys.ctrtIntgList(req),
    queryFn: () => ctService.getCtrtIntgList(req),
  })
}

/** 전자계약 진행 상세(물품 M03) — 목록 state 는 placeholder 로 쓰지 않음(필드 구성이 달라 조회로 확정). */
export function useCtrtPrgrsDtl(id: string) {
  return useQuery({
    queryKey: ctKeys.ctrtPrgrsDtl(id),
    queryFn: () => ctService.getCtrtPrgrsDtl(id),
    enabled: Boolean(id),
  })
}

/** 공사 전자계약 진행 상세(M09). */
export function useCstrnCtrtPrgrsDtl(id: string) {
  return useQuery({
    queryKey: ctKeys.cstrnCtrtPrgrsDtl(id),
    queryFn: () => ctService.getCstrnCtrtPrgrsDtl(id),
    enabled: Boolean(id),
  })
}

/** 하자담보책임 탭(T11). */
export function useCtrtFlws(id: string) {
  return useQuery({
    queryKey: ctKeys.ctrtFlws(id),
    queryFn: () => ctService.getCtrtFlws(id),
    enabled: Boolean(id),
  })
}

/** 계약업체 + 생산공장 탭. */
export function useCtrtBzentys(id: string) {
  return useQuery({
    queryKey: ctKeys.ctrtBzentys(id),
    queryFn: () => ctService.getCtrtBzentys(id),
    enabled: Boolean(id),
  })
}

/** 반송/취소 사유 탭. */
export function useCtrtRjctRsns(id: string) {
  return useQuery({
    queryKey: ctKeys.ctrtRjctRsns(id),
    queryFn: () => ctService.getCtrtRjctRsns(id),
    enabled: Boolean(id),
  })
}

/** 첨부서류 탭. */
export function useCtrtAdocs(id: string) {
  return useQuery({
    queryKey: ctKeys.ctrtAdocs(id),
    queryFn: () => ctService.getCtrtAdocs(id),
    enabled: Boolean(id),
  })
}

/** 보증서 확인(M73) — 팝업 열릴 때만 조회(enabled). */
export function useCtrtGrntes(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ctKeys.ctrtGrntes(id),
    queryFn: () => ctService.getCtrtGrntes(id),
    enabled: Boolean(id) && enabled,
  })
}

/** 인지세 확인(M74) — 팝업 열릴 때만 조회(enabled). */
export function useCtrtStmtx(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ctKeys.ctrtStmtx(id),
    queryFn: () => ctService.getCtrtStmtx(id),
    enabled: Boolean(id) && enabled,
  })
}

/** 물품계약명세서(P11·P14 공용) — 팝업 열릴 때만 조회(enabled). */
export function useCmdtyCtrtDtst(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ctKeys.cmdtyCtrtDtst(id),
    queryFn: () => ctService.getCmdtyCtrtDtst(id),
    enabled: Boolean(id) && enabled,
  })
}

/** 물품일반계약서 상세(M05). */
export function useCmdtyGnrlCtrdocDtl(id: string) {
  return useQuery({
    queryKey: ctKeys.cmdtyGnrlCtrdocDtl(id),
    queryFn: () => ctService.getCmdtyGnrlCtrdocDtl(id),
    enabled: Boolean(id),
  })
}

/** 물품수정계약서 상세(M06/T22). */
export function useCmdtyMdfcnCtrdocDtl(id: string) {
  return useQuery({
    queryKey: ctKeys.cmdtyMdfcnCtrdocDtl(id),
    queryFn: () => ctService.getCmdtyMdfcnCtrdocDtl(id),
    enabled: Boolean(id),
  })
}

/** 수정계약명세서(T23 탭은 즉시, P13 팝업은 열릴 때만 — enabled 로 제어). */
export function useCmdtyMdfcnCtrdocDtst(id: string, enabled = true) {
  return useQuery({
    queryKey: ctKeys.cmdtyMdfcnCtrdocDtst(id),
    queryFn: () => ctService.getCmdtyMdfcnCtrdocDtst(id),
    enabled: Boolean(id) && enabled,
  })
}

/** 물품최종계약명세서(P12) — 팝업 열릴 때만 조회. */
export function useCtrtLastDtst(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ctKeys.ctrtLastDtst(id),
    queryFn: () => ctService.getCtrtLastDtst(id),
    enabled: Boolean(id) && enabled,
  })
}

/** 특수조건(T24/T15/T18). */
export function useCtrtSpclCnd(id: string) {
  return useQuery({
    queryKey: ctKeys.ctrtSpclCnd(id),
    queryFn: () => ctService.getCtrtSpclCnd(id),
    enabled: Boolean(id),
  })
}

/** 물품총액(gramt)/단가(untprc)계약서 상세(M07/M08). */
export function useCmdtyCtrdocDtl(id: string, type: CtCtrdocType) {
  return useQuery({
    queryKey: ctKeys.cmdtyCtrdocDtl(id, type),
    queryFn: () => ctService.getCmdtyCtrdocDtl(id, type),
    enabled: Boolean(id),
  })
}

/** 계약명세서 탭(T14/T17). */
export function useCmdtyCtrdocDtst(id: string, type: CtCtrdocType) {
  return useQuery({
    queryKey: ctKeys.cmdtyCtrdocDtst(id, type),
    queryFn: () => ctService.getCmdtyCtrdocDtst(id, type),
    enabled: Boolean(id),
  })
}

/** 공사계약서 상세(M10/T19). */
export function useCstrnCtrdocDtl(id: string) {
  return useQuery({
    queryKey: ctKeys.cstrnCtrdocDtl(id),
    queryFn: () => ctService.getCstrnCtrdocDtl(id),
    enabled: Boolean(id),
  })
}

/** 연대보증 탭(T21). */
export function useCtrtJntGrntes(id: string) {
  return useQuery({
    queryKey: ctKeys.ctrtJntGrntes(id),
    queryFn: () => ctService.getCtrtJntGrntes(id),
    enabled: Boolean(id),
  })
}

/** 대금지불정보 목록(M15). */
export function usePymtDfryInfoList() {
  return useQuery({
    queryKey: ctKeys.pymtDfryInfoList,
    queryFn: () => ctService.getPymtDfryInfoList(),
  })
}

/** 대금지불정보 조회(P16) — 팝업 열릴 때만 조회. */
export function usePymtDfryInfoInq(ctrtNo: string, enabled: boolean) {
  return useQuery({
    queryKey: ctKeys.pymtDfryInfoInq(ctrtNo),
    queryFn: () => ctService.getPymtDfryInfoInq(ctrtNo),
    enabled: Boolean(ctrtNo) && enabled,
  })
}

/** 계약진행상태(P17) — 팝업 열릴 때만 조회. */
export function useCtrtPrgrsStts(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ctKeys.ctrtPrgrsStts(id),
    queryFn: () => ctService.getCtrtPrgrsStts(id),
    enabled: Boolean(id) && enabled,
  })
}

/** 국외 계약 일반현황(M71/T71). */
export function useOvsCtrtDtl(id: string) {
  return useQuery({
    queryKey: ctKeys.ovsCtrtDtl(id),
    queryFn: () => ctService.getOvsCtrtDtl(id),
    enabled: Boolean(id),
  })
}

/** 국외 계좌정보 탭(T72). */
export function useOvsBacntInfo(id: string) {
  return useQuery({
    queryKey: ctKeys.ovsBacntInfo(id),
    queryFn: () => ctService.getOvsBacntInfo(id),
    enabled: Boolean(id),
  })
}

/** 국외 계약명세서 탭(T75). */
export function useOvsCtrtDtst(id: string) {
  return useQuery({
    queryKey: ctKeys.ovsCtrtDtst(id),
    queryFn: () => ctService.getOvsCtrtDtst(id),
    enabled: Boolean(id),
  })
}

/** 국외 첨부서류 탭(T76). */
export function useOvsCtrtAdocs(id: string) {
  return useQuery({
    queryKey: ctKeys.ovsCtrtAdocs(id),
    queryFn: () => ctService.getOvsCtrtAdocs(id),
    enabled: Boolean(id),
  })
}

/** 상업계약서 계약현황(M77/T77). */
export function useOvsCmbzCtrdocDtl(id: string) {
  return useQuery({
    queryKey: ctKeys.ovsCmbzCtrdocDtl(id),
    queryFn: () => ctService.getOvsCmbzCtrdocDtl(id),
    enabled: Boolean(id),
  })
}

/** 상업계약서 계약명세서 탭(T78). */
export function useOvsCmbzDtst(id: string) {
  return useQuery({
    queryKey: ctKeys.ovsCmbzDtst(id),
    queryFn: () => ctService.getOvsCmbzDtst(id),
    enabled: Boolean(id),
  })
}

/** 상업계약서 계약대상 탭(T79). */
export function useOvsCmbzTrgt(id: string) {
  return useQuery({
    queryKey: ctKeys.ovsCmbzTrgt(id),
    queryFn: () => ctService.getOvsCmbzTrgt(id),
    enabled: Boolean(id),
  })
}

/** 상업계약서명세서(P78) — 팝업 열릴 때만 조회. */
export function useOvsCmbzCtrtDtst(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ctKeys.ovsCmbzCtrtDtst(id),
    queryFn: () => ctService.getOvsCmbzCtrtDtst(id),
    enabled: Boolean(id) && enabled,
  })
}

// ── 해지/해제 계열 (MUI-CT-03) ──────────────────────────────────────────────

/** 해지/해제 목록(M01) — 키워드/더보기 페이징은 페이지 클라이언트 로직 유지. */
export function useCncltnRmvList(req: CncltnRmvListRequest = {}) {
  return useQuery({
    queryKey: ctKeys.cncltnRmvList(req),
    queryFn: () => ctService.getCncltnRmvList(req),
  })
}

/** 물품 해지/해제 상세정보(M02/T01). */
export function useCmdtyCncltnRmvDtl(id: string) {
  return useQuery({
    queryKey: ctKeys.cmdtyCncltnRmvDtl(id),
    queryFn: () => ctService.getCmdtyCncltnRmvDtl(id),
    enabled: Boolean(id),
  })
}

/** 물품 해지/해제 계약업체 탭(T02). */
export function useCmdtyCncltnRmvBzentys(id: string) {
  return useQuery({
    queryKey: ctKeys.cmdtyCncltnRmvBzentys(id),
    queryFn: () => ctService.getCmdtyCncltnRmvBzentys(id),
    enabled: Boolean(id),
  })
}

/** 해지/해제 정보 탭(T03) — 통보내용 + 참조서류. */
export function useCmdtyCncltnRmvNoti(id: string) {
  return useQuery({
    queryKey: ctKeys.cmdtyCncltnRmvNoti(id),
    queryFn: () => ctService.getCmdtyCncltnRmvNoti(id),
    enabled: Boolean(id),
  })
}

/** 해지/해제 일반계약(총액 gramt / 단가 untprc) 상세정보(M03/M04). */
export function useCncltnRmvGnrlCtrtDtl(id: string, type: CtCtrdocType) {
  return useQuery({
    queryKey: ctKeys.cncltnRmvGnrlCtrtDtl(id, type),
    queryFn: () => ctService.getCncltnRmvGnrlCtrtDtl(id, type),
    enabled: Boolean(id),
  })
}

/** 해지/해제 일반계약 계약명세서 탭(T05/T08). */
export function useCncltnRmvGnrlCtrtDtst(id: string, type: CtCtrdocType) {
  return useQuery({
    queryKey: ctKeys.cncltnRmvGnrlCtrtDtst(id, type),
    queryFn: () => ctService.getCncltnRmvGnrlCtrtDtst(id, type),
    enabled: Boolean(id),
  })
}

/** 해지/해제 특수조건 탭(T06/T09/T12). */
export function useCncltnRmvSpcl(id: string) {
  return useQuery({
    queryKey: ctKeys.cncltnRmvSpcl(id),
    queryFn: () => ctService.getCncltnRmvSpcl(id),
    enabled: Boolean(id),
  })
}

/** 해지/해제 수정계약 상세정보(M05/T10). */
export function useCncltnRmvMdfcnCtrtDtl(id: string) {
  return useQuery({
    queryKey: ctKeys.cncltnRmvMdfcnCtrtDtl(id),
    queryFn: () => ctService.getCncltnRmvMdfcnCtrtDtl(id),
    enabled: Boolean(id),
  })
}

/** 해지/해제 수정계약 계약명세서 탭(T11). */
export function useCncltnRmvMdfcnCtrtDtst(id: string) {
  return useQuery({
    queryKey: ctKeys.cncltnRmvMdfcnCtrtDtst(id),
    queryFn: () => ctService.getCncltnRmvMdfcnCtrtDtst(id),
    enabled: Boolean(id),
  })
}

/** 해지/해제 공사계약 상세정보(M06/T13). */
export function useCstrnCncltnRmvDtl(id: string) {
  return useQuery({
    queryKey: ctKeys.cstrnCncltnRmvDtl(id),
    queryFn: () => ctService.getCstrnCncltnRmvDtl(id),
    enabled: Boolean(id),
  })
}

/** 해지/해제 공사계약 첨부서류 탭(T14). */
export function useCstrnCncltnRmvAdocs(id: string) {
  return useQuery({
    queryKey: ctKeys.cstrnCncltnRmvAdocs(id),
    queryFn: () => ctService.getCstrnCncltnRmvAdocs(id),
    enabled: Boolean(id),
  })
}
