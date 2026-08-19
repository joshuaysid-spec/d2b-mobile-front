// 이행(EX) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: exService(services/bds/ex.ts) · exQueries(이 파일) · exKeys(keys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = keys.ts(함수명 동일).
import { useQuery } from '@tanstack/react-query'
import { exService } from '@/services/bds/ex'
import { exKeys } from '@/queries/bds/ex/keys'
import type {
  InspDlvdocPrstRequest,
  InspIntgListRequest,
  OvsEstmtRqdcListRequest,
  OvsOrderRqdcListRequest,
} from '@/types/ex'

export const exQueries = {
  /** 검사통합목록(M01) — 키워드 세부 필터/더보기 페이징은 페이지 클라이언트 로직 유지(서버 전환 시 req 로 이행). */
  useSelectInspIntgList(req: InspIntgListRequest = {}) {
    return useQuery({
      queryKey: exKeys.selectInspIntgList(req),
      queryFn: () => exService.selectInspIntgList(req),
    })
  },

  /** 납품통지목록(P10) — 풀팝업 열릴 때만 조회. */
  useSelectDlvgdsAvtsmtList(ctrtNo: string, enabled: boolean) {
    return useQuery({
      queryKey: exKeys.selectDlvgdsAvtsmtList(ctrtNo),
      queryFn: () => exService.selectDlvgdsAvtsmtList(ctrtNo),
      enabled: Boolean(ctrtNo) && enabled,
    })
  },

  /** 검사및납품조서목록(P11) — 바텀시트 열릴 때만 조회. */
  useSelectInspDlvdocList(ctrtNo: string, avtsmtNo: string, enabled: boolean) {
    return useQuery({
      queryKey: exKeys.selectInspDlvdocList(ctrtNo, avtsmtNo),
      queryFn: () => exService.selectInspDlvdocList(ctrtNo, avtsmtNo),
      enabled: Boolean(ctrtNo) && Boolean(avtsmtNo) && enabled,
    })
  },

  /** 검사및납품조서상세(M02) — 목록 state 는 placeholder 로 쓰지 않음(필드 구성이 달라 조회로 확정). */
  useSelectInspDlvdocDtl(id: string) {
    return useQuery({
      queryKey: exKeys.selectInspDlvdocDtl(id),
      queryFn: () => exService.selectInspDlvdocDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 검사및납품조서상세 물품목록(T02). */
  useSelectInspDlvdocCmdtys(id: string) {
    return useQuery({
      queryKey: exKeys.selectInspDlvdocCmdtys(id),
      queryFn: () => exService.selectInspDlvdocCmdtys(id),
      enabled: Boolean(id),
    })
  },

  /** 검사및납품조서상세(부대조달, M03). */
  useSelectInspDlvdocSbsdDtl(id: string) {
    return useQuery({
      queryKey: exKeys.selectInspDlvdocSbsdDtl(id),
      queryFn: () => exService.selectInspDlvdocSbsdDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 부대조달 물품목록(T04). */
  useSelectInspDlvdocSbsdCmdtys(id: string) {
    return useQuery({
      queryKey: exKeys.selectInspDlvdocSbsdCmdtys(id),
      queryFn: () => exService.selectInspDlvdocSbsdCmdtys(id),
      enabled: Boolean(id),
    })
  },

  /** 기성및준공검사상세(M04). */
  useSelectPxcndCmcnInspDtl(id: string) {
    return useQuery({
      queryKey: exKeys.selectPxcndCmcnInspDtl(id),
      queryFn: () => exService.selectPxcndCmcnInspDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 검사및납품조서현황목록(M05). */
  useSelectInspDlvdocPrstList(req: InspDlvdocPrstRequest = {}) {
    return useQuery({
      queryKey: exKeys.selectInspDlvdocPrstList(req),
      queryFn: () => exService.selectInspDlvdocPrstList(req),
    })
  },

  /** 검사및납품조서결과상세(M07). */
  useSelectDlvdocRsltDtl(id: string) {
    return useQuery({
      queryKey: exKeys.selectDlvdocRsltDtl(id),
      queryFn: () => exService.selectDlvdocRsltDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 결과상세 물품목록(T06). */
  useSelectDlvdocRsltCmdtys(id: string) {
    return useQuery({
      queryKey: exKeys.selectDlvdocRsltCmdtys(id),
      queryFn: () => exService.selectDlvdocRsltCmdtys(id),
      enabled: Boolean(id),
    })
  },

  /** 견적의뢰서목록(M71). */
  useSelectOvsEstmtRqdcList(req: OvsEstmtRqdcListRequest = {}) {
    return useQuery({
      queryKey: exKeys.selectOvsEstmtRqdcList(req),
      queryFn: () => exService.selectOvsEstmtRqdcList(req),
    })
  },

  /** 견적의뢰서상세(M72). */
  useSelectOvsEstmtRqdcDtl(id: string) {
    return useQuery({
      queryKey: exKeys.selectOvsEstmtRqdcDtl(id),
      queryFn: () => exService.selectOvsEstmtRqdcDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 견적의뢰서 품목목록(T72). */
  useSelectOvsEstmtRqdcItems(id: string) {
    return useQuery({
      queryKey: exKeys.selectOvsEstmtRqdcItems(id),
      queryFn: () => exService.selectOvsEstmtRqdcItems(id),
      enabled: Boolean(id),
    })
  },

  /** 견적통보서목록(M73) — 상단 계약정보 + 연계 견적 목록. */
  useSelectOvsEstmtNtdcList(ctrtNo?: string) {
    return useQuery({
      queryKey: exKeys.selectOvsEstmtNtdcList(ctrtNo),
      queryFn: () => exService.selectOvsEstmtNtdcList(ctrtNo),
    })
  },

  /** 견적통보서상세(M74). */
  useSelectOvsEstmtNtdcDtl(id: string) {
    return useQuery({
      queryKey: exKeys.selectOvsEstmtNtdcDtl(id),
      queryFn: () => exService.selectOvsEstmtNtdcDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 견적통보서 품목목록(T74). */
  useSelectOvsEstmtNtdcItems(id: string) {
    return useQuery({
      queryKey: exKeys.selectOvsEstmtNtdcItems(id),
      queryFn: () => exService.selectOvsEstmtNtdcItems(id),
      enabled: Boolean(id),
    })
  },

  /** 발주의뢰서목록(M75). */
  useSelectOvsOrderRqdcList(req: OvsOrderRqdcListRequest = {}) {
    return useQuery({
      queryKey: exKeys.selectOvsOrderRqdcList(req),
      queryFn: () => exService.selectOvsOrderRqdcList(req),
    })
  },

  /** 발주의뢰서상세(M76). */
  useSelectOvsOrderRqdcDtl(id: string) {
    return useQuery({
      queryKey: exKeys.selectOvsOrderRqdcDtl(id),
      queryFn: () => exService.selectOvsOrderRqdcDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 발주의뢰서 품목목록(T76). */
  useSelectOvsOrderRqdcItems(id: string) {
    return useQuery({
      queryKey: exKeys.selectOvsOrderRqdcItems(id),
      queryFn: () => exService.selectOvsOrderRqdcItems(id),
      enabled: Boolean(id),
    })
  },

  /** 발주통보서목록(M77) — 상단 계약정보 + 목록. */
  useSelectOvsOrderNtdcList(ctrtNo?: string) {
    return useQuery({
      queryKey: exKeys.selectOvsOrderNtdcList(ctrtNo),
      queryFn: () => exService.selectOvsOrderNtdcList(ctrtNo),
    })
  },

  /** 발주통보서상세(M78). */
  useSelectOvsOrderNtdcDtl(id: string) {
    return useQuery({
      queryKey: exKeys.selectOvsOrderNtdcDtl(id),
      queryFn: () => exService.selectOvsOrderNtdcDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 발주통보서 품목목록(T78). */
  useSelectOvsOrderNtdcItems(id: string) {
    return useQuery({
      queryKey: exKeys.selectOvsOrderNtdcItems(id),
      queryFn: () => exService.selectOvsOrderNtdcItems(id),
      enabled: Boolean(id),
    })
  },
}
