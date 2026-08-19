// 계약(CT) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: ctService(services/bds/ct.ts) · ctQueries(이 파일) · ctKeys(keys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = keys.ts(함수명 동일).
// 조회는 useQuery 훅, 저장/제출은 페이지 핸들러에서 서비스 직접 await(useMutation 미도입).
import { useQuery } from '@tanstack/react-query'
import { ctService } from '@/services/bds/ct'
import { ctKeys } from '@/queries/bds/ct/keys'
import type { CncltnRmvListRequest, CtCtrdocType, CtrtIntgListRequest } from '@/types/ct'

export const ctQueries = {
  /** 계약 통합목록 — 키워드 세부 필터/더보기 페이징은 페이지 클라이언트 로직 유지(서버 전환 시 req 로 이행). */
  useSelectCtrtIntgList(req: CtrtIntgListRequest = {}) {
    return useQuery({
      queryKey: ctKeys.selectCtrtIntgList(req),
      queryFn: () => ctService.selectCtrtIntgList(req),
    })
  },

  /** 전자계약 진행 상세(물품 M03) — 목록 state 는 placeholder 로 쓰지 않음(필드 구성이 달라 조회로 확정). */
  useSelectCtrtPrgrsDtl(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCtrtPrgrsDtl(id),
      queryFn: () => ctService.selectCtrtPrgrsDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 공사 전자계약 진행 상세(M09). */
  useSelectCstrnCtrtPrgrsDtl(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCstrnCtrtPrgrsDtl(id),
      queryFn: () => ctService.selectCstrnCtrtPrgrsDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 하자담보책임 탭(T11). */
  useSelectCtrtFlws(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCtrtFlws(id),
      queryFn: () => ctService.selectCtrtFlws(id),
      enabled: Boolean(id),
    })
  },

  /** 계약업체 + 생산공장 탭. */
  useSelectCtrtBzentys(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCtrtBzentys(id),
      queryFn: () => ctService.selectCtrtBzentys(id),
      enabled: Boolean(id),
    })
  },

  /** 반송/취소 사유 탭. */
  useSelectCtrtRjctRsns(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCtrtRjctRsns(id),
      queryFn: () => ctService.selectCtrtRjctRsns(id),
      enabled: Boolean(id),
    })
  },

  /** 첨부서류 탭. */
  useSelectCtrtAdocs(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCtrtAdocs(id),
      queryFn: () => ctService.selectCtrtAdocs(id),
      enabled: Boolean(id),
    })
  },

  /** 보증서 확인(M73) — 팝업 열릴 때만 조회(enabled). */
  useSelectCtrtGrntes(id: string, enabled: boolean) {
    return useQuery({
      queryKey: ctKeys.selectCtrtGrntes(id),
      queryFn: () => ctService.selectCtrtGrntes(id),
      enabled: Boolean(id) && enabled,
    })
  },

  /** 인지세 확인(M74) — 팝업 열릴 때만 조회(enabled). */
  useSelectCtrtStmtx(id: string, enabled: boolean) {
    return useQuery({
      queryKey: ctKeys.selectCtrtStmtx(id),
      queryFn: () => ctService.selectCtrtStmtx(id),
      enabled: Boolean(id) && enabled,
    })
  },

  /** 물품계약명세서(P11·P14 공용) — 팝업 열릴 때만 조회(enabled). */
  useSelectCmdtyCtrtDtst(id: string, enabled: boolean) {
    return useQuery({
      queryKey: ctKeys.selectCmdtyCtrtDtst(id),
      queryFn: () => ctService.selectCmdtyCtrtDtst(id),
      enabled: Boolean(id) && enabled,
    })
  },

  /** 물품일반계약서 상세(M05). */
  useSelectCmdtyGnrlCtrdocDtl(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCmdtyGnrlCtrdocDtl(id),
      queryFn: () => ctService.selectCmdtyGnrlCtrdocDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 물품수정계약서 상세(M06/T22). */
  useSelectCmdtyMdfcnCtrdocDtl(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCmdtyMdfcnCtrdocDtl(id),
      queryFn: () => ctService.selectCmdtyMdfcnCtrdocDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 수정계약명세서(T23 탭은 즉시, P13 팝업은 열릴 때만 — enabled 로 제어). */
  useSelectCmdtyMdfcnCtrdocDtst(id: string, enabled = true) {
    return useQuery({
      queryKey: ctKeys.selectCmdtyMdfcnCtrdocDtst(id),
      queryFn: () => ctService.selectCmdtyMdfcnCtrdocDtst(id),
      enabled: Boolean(id) && enabled,
    })
  },

  /** 물품최종계약명세서(P12) — 팝업 열릴 때만 조회. */
  useSelectCtrtLastDtst(id: string, enabled: boolean) {
    return useQuery({
      queryKey: ctKeys.selectCtrtLastDtst(id),
      queryFn: () => ctService.selectCtrtLastDtst(id),
      enabled: Boolean(id) && enabled,
    })
  },

  /** 특수조건(T24/T15/T18). */
  useSelectCtrtSpclCnd(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCtrtSpclCnd(id),
      queryFn: () => ctService.selectCtrtSpclCnd(id),
      enabled: Boolean(id),
    })
  },

  /** 물품총액(gramt)/단가(untprc)계약서 상세(M07/M08). */
  useSelectCmdtyCtrdocDtl(id: string, type: CtCtrdocType) {
    return useQuery({
      queryKey: ctKeys.selectCmdtyCtrdocDtl(id, type),
      queryFn: () => ctService.selectCmdtyCtrdocDtl(id, type),
      enabled: Boolean(id),
    })
  },

  /** 계약명세서 탭(T14/T17). */
  useSelectCmdtyCtrdocDtst(id: string, type: CtCtrdocType) {
    return useQuery({
      queryKey: ctKeys.selectCmdtyCtrdocDtst(id, type),
      queryFn: () => ctService.selectCmdtyCtrdocDtst(id, type),
      enabled: Boolean(id),
    })
  },

  /** 공사계약서 상세(M10/T19). */
  useSelectCstrnCtrdocDtl(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCstrnCtrdocDtl(id),
      queryFn: () => ctService.selectCstrnCtrdocDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 연대보증 탭(T21). */
  useSelectCtrtJntGrntes(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCtrtJntGrntes(id),
      queryFn: () => ctService.selectCtrtJntGrntes(id),
      enabled: Boolean(id),
    })
  },

  /** 대금지불정보 목록(M15). */
  useSelectPymtDfryInfoList() {
    return useQuery({
      queryKey: ctKeys.selectPymtDfryInfoList,
      queryFn: () => ctService.selectPymtDfryInfoList(),
    })
  },

  /** 대금지불정보 조회(P16) — 팝업 열릴 때만 조회. */
  useSelectPymtDfryInfoInq(ctrtNo: string, enabled: boolean) {
    return useQuery({
      queryKey: ctKeys.selectPymtDfryInfoInq(ctrtNo),
      queryFn: () => ctService.selectPymtDfryInfoInq(ctrtNo),
      enabled: Boolean(ctrtNo) && enabled,
    })
  },

  /** 계약진행상태(P17) — 팝업 열릴 때만 조회. */
  useSelectCtrtPrgrsStts(id: string, enabled: boolean) {
    return useQuery({
      queryKey: ctKeys.selectCtrtPrgrsStts(id),
      queryFn: () => ctService.selectCtrtPrgrsStts(id),
      enabled: Boolean(id) && enabled,
    })
  },

  /** 국외 계약 일반현황(M71/T71). */
  useSelectOvsCtrtDtl(id: string) {
    return useQuery({
      queryKey: ctKeys.selectOvsCtrtDtl(id),
      queryFn: () => ctService.selectOvsCtrtDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 국외 계좌정보 탭(T72). */
  useSelectOvsBacntInfo(id: string) {
    return useQuery({
      queryKey: ctKeys.selectOvsBacntInfo(id),
      queryFn: () => ctService.selectOvsBacntInfo(id),
      enabled: Boolean(id),
    })
  },

  /** 국외 계약명세서 탭(T75). */
  useSelectOvsCtrtDtst(id: string) {
    return useQuery({
      queryKey: ctKeys.selectOvsCtrtDtst(id),
      queryFn: () => ctService.selectOvsCtrtDtst(id),
      enabled: Boolean(id),
    })
  },

  /** 국외 첨부서류 탭(T76). */
  useSelectOvsCtrtAdocs(id: string) {
    return useQuery({
      queryKey: ctKeys.selectOvsCtrtAdocs(id),
      queryFn: () => ctService.selectOvsCtrtAdocs(id),
      enabled: Boolean(id),
    })
  },

  /** 상업계약서 계약현황(M77/T77). */
  useSelectOvsCmbzCtrdocDtl(id: string) {
    return useQuery({
      queryKey: ctKeys.selectOvsCmbzCtrdocDtl(id),
      queryFn: () => ctService.selectOvsCmbzCtrdocDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 상업계약서 계약명세서 탭(T78). */
  useSelectOvsCmbzDtst(id: string) {
    return useQuery({
      queryKey: ctKeys.selectOvsCmbzDtst(id),
      queryFn: () => ctService.selectOvsCmbzDtst(id),
      enabled: Boolean(id),
    })
  },

  /** 상업계약서 계약대상 탭(T79). */
  useSelectOvsCmbzTrgt(id: string) {
    return useQuery({
      queryKey: ctKeys.selectOvsCmbzTrgt(id),
      queryFn: () => ctService.selectOvsCmbzTrgt(id),
      enabled: Boolean(id),
    })
  },

  /** 상업계약서명세서(P78) — 팝업 열릴 때만 조회. */
  useSelectOvsCmbzCtrtDtst(id: string, enabled: boolean) {
    return useQuery({
      queryKey: ctKeys.selectOvsCmbzCtrtDtst(id),
      queryFn: () => ctService.selectOvsCmbzCtrtDtst(id),
      enabled: Boolean(id) && enabled,
    })
  },

  // ── 해지/해제 계열 (MUI-CT-03) ────────────────────────────────────────────

  /** 해지/해제 목록(M01) — 키워드/더보기 페이징은 페이지 클라이언트 로직 유지. */
  useSelectCncltnRmvList(req: CncltnRmvListRequest = {}) {
    return useQuery({
      queryKey: ctKeys.selectCncltnRmvList(req),
      queryFn: () => ctService.selectCncltnRmvList(req),
    })
  },

  /** 물품 해지/해제 상세정보(M02/T01). */
  useSelectCmdtyCncltnRmvDtl(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCmdtyCncltnRmvDtl(id),
      queryFn: () => ctService.selectCmdtyCncltnRmvDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 물품 해지/해제 계약업체 탭(T02). */
  useSelectCmdtyCncltnRmvBzentys(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCmdtyCncltnRmvBzentys(id),
      queryFn: () => ctService.selectCmdtyCncltnRmvBzentys(id),
      enabled: Boolean(id),
    })
  },

  /** 해지/해제 정보 탭(T03) — 통보내용 + 참조서류. */
  useSelectCmdtyCncltnRmvNoti(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCmdtyCncltnRmvNoti(id),
      queryFn: () => ctService.selectCmdtyCncltnRmvNoti(id),
      enabled: Boolean(id),
    })
  },

  /** 해지/해제 일반계약(총액 gramt / 단가 untprc) 상세정보(M03/M04). */
  useSelectCncltnRmvGnrlCtrtDtl(id: string, type: CtCtrdocType) {
    return useQuery({
      queryKey: ctKeys.selectCncltnRmvGnrlCtrtDtl(id, type),
      queryFn: () => ctService.selectCncltnRmvGnrlCtrtDtl(id, type),
      enabled: Boolean(id),
    })
  },

  /** 해지/해제 일반계약 계약명세서 탭(T05/T08). */
  useSelectCncltnRmvGnrlCtrtDtst(id: string, type: CtCtrdocType) {
    return useQuery({
      queryKey: ctKeys.selectCncltnRmvGnrlCtrtDtst(id, type),
      queryFn: () => ctService.selectCncltnRmvGnrlCtrtDtst(id, type),
      enabled: Boolean(id),
    })
  },

  /** 해지/해제 특수조건 탭(T06/T09/T12). */
  useSelectCncltnRmvSpcl(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCncltnRmvSpcl(id),
      queryFn: () => ctService.selectCncltnRmvSpcl(id),
      enabled: Boolean(id),
    })
  },

  /** 해지/해제 수정계약 상세정보(M05/T10). */
  useSelectCncltnRmvMdfcnCtrtDtl(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCncltnRmvMdfcnCtrtDtl(id),
      queryFn: () => ctService.selectCncltnRmvMdfcnCtrtDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 해지/해제 수정계약 계약명세서 탭(T11). */
  useSelectCncltnRmvMdfcnCtrtDtst(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCncltnRmvMdfcnCtrtDtst(id),
      queryFn: () => ctService.selectCncltnRmvMdfcnCtrtDtst(id),
      enabled: Boolean(id),
    })
  },

  /** 해지/해제 공사계약 상세정보(M06/T13). */
  useSelectCstrnCncltnRmvDtl(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCstrnCncltnRmvDtl(id),
      queryFn: () => ctService.selectCstrnCncltnRmvDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 해지/해제 공사계약 첨부서류 탭(T14). */
  useSelectCstrnCncltnRmvAdocs(id: string) {
    return useQuery({
      queryKey: ctKeys.selectCstrnCncltnRmvAdocs(id),
      queryFn: () => ctService.selectCstrnCncltnRmvAdocs(id),
      enabled: Boolean(id),
    })
  },
}
