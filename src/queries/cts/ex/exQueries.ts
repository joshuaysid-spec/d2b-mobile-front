// 이행(EX) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: exService(services/cts/ex.ts) · exQueries(이 파일) · exKeys(keys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = keys.ts(함수명 동일).
// 소비처 없는 서비스 함수(no.376 검사관·no.377 감독관)는 훅을 만들지 않는다.
import { useQuery } from '@tanstack/react-query'
import { exService } from '@/services/cts/ex'
import { exKeys } from '@/queries/cts/ex/exKeys'
import type {
  MockInspDlvdocPrstRequest,
  MockInspIntgListRequest,
  MockOvsEstmtRqdcListRequest,
  MockOvsOrderRqdcListRequest,
} from '@/types/mock/ex'

export const exQueries = {
  /** 검사통합목록(M01) — 키워드 세부 필터/더보기 페이징은 페이지 클라이언트 로직 유지(서버 전환 시 req 로 이행). */
  useSelectInspIntgList(req: MockInspIntgListRequest = {}) {
    return useQuery({
      queryKey: exKeys.selectInspIntgList(req),
      queryFn: () => exService.selectInspIntgList(req),
    })
  },

  /** 납품통지목록(P10) — 풀팝업 열릴 때만 조회. */
  useSelectInspRqstDocList(ctrtNo: string, enabled: boolean) {
    return useQuery({
      queryKey: exKeys.selectInspRqstDocList(ctrtNo),
      queryFn: () => exService.selectInspRqstDocList(ctrtNo),
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
  useSelectInspDlvdocBscInfo(recrdPblcnNo: string) {
    return useQuery({
      queryKey: exKeys.selectInspDlvdocBscInfo(recrdPblcnNo),
      queryFn: () => exService.selectInspDlvdocBscInfo(recrdPblcnNo),
      enabled: Boolean(recrdPblcnNo),
    })
  },

  /** 검사및납품조서상세 물품목록(T02). */
  useSelectInspDlvdocDlvgdsList(recrdPblcnNo: string) {
    return useQuery({
      queryKey: exKeys.selectInspDlvdocDlvgdsList(recrdPblcnNo),
      queryFn: () => exService.selectInspDlvdocDlvgdsList(recrdPblcnNo),
      enabled: Boolean(recrdPblcnNo),
    })
  },

  /** 검사및납품조서상세(부대조달, M03). */
  useSelectInspDlvdocSbsdDtl(recrdPblcnNo: string) {
    return useQuery({
      queryKey: exKeys.selectInspDlvdocSbsdDtl(recrdPblcnNo),
      queryFn: () => exService.selectInspDlvdocSbsdDtl(recrdPblcnNo),
      enabled: Boolean(recrdPblcnNo),
    })
  },

  /** 부대조달 물품목록(T04). */
  useSelectInspDlvdocSbsdCmdtys(recrdPblcnNo: string) {
    return useQuery({
      queryKey: exKeys.selectInspDlvdocSbsdCmdtys(recrdPblcnNo),
      queryFn: () => exService.selectInspDlvdocSbsdCmdtys(recrdPblcnNo),
      enabled: Boolean(recrdPblcnNo),
    })
  },

  /** 기성및준공검사상세(M04) — 식별자는 계약번호+기성차수(M01 공사 카드). */
  useSelectPxcndCmcnInspBscInfo(ctrtNo: string, pxcndCycl: string) {
    return useQuery({
      queryKey: exKeys.selectPxcndCmcnInspBscInfo(ctrtNo, pxcndCycl),
      queryFn: () => exService.selectPxcndCmcnInspBscInfo(ctrtNo, pxcndCycl),
      enabled: Boolean(ctrtNo),
    })
  },

  /** 검사및납품조서현황목록(M05). */
  useSelectInspDlvdocPrstList(req: MockInspDlvdocPrstRequest = {}) {
    return useQuery({
      queryKey: exKeys.selectInspDlvdocPrstList(req),
      queryFn: () => exService.selectInspDlvdocPrstList(req),
    })
  },

  /** 검사및납품조서결과상세(M07). */
  useSelectDlvdocRsltDtl(recrdPblcnNo: string) {
    return useQuery({
      queryKey: exKeys.selectDlvdocRsltDtl(recrdPblcnNo),
      queryFn: () => exService.selectDlvdocRsltDtl(recrdPblcnNo),
      enabled: Boolean(recrdPblcnNo),
    })
  },

  /** 결과상세 물품목록(T06). */
  useSelectDlvdocRsltCmdtys(recrdPblcnNo: string) {
    return useQuery({
      queryKey: exKeys.selectDlvdocRsltCmdtys(recrdPblcnNo),
      queryFn: () => exService.selectDlvdocRsltCmdtys(recrdPblcnNo),
      enabled: Boolean(recrdPblcnNo),
    })
  },

  /** 견적의뢰서목록(M71). */
  useSelectEstmtRqdcList(req: MockOvsEstmtRqdcListRequest = {}) {
    return useQuery({
      queryKey: exKeys.selectEstmtRqdcList(req),
      queryFn: () => exService.selectEstmtRqdcList(req),
    })
  },

  /** 견적의뢰서상세(M72). */
  useSelectOvsEstmtRqdcDtl(clmSeq: string) {
    return useQuery({
      queryKey: exKeys.selectOvsEstmtRqdcDtl(clmSeq),
      queryFn: () => exService.selectOvsEstmtRqdcDtl(clmSeq),
      enabled: Boolean(clmSeq),
    })
  },

  /** 견적의뢰서 품목목록(T72). */
  useSelectEstmtRqdcDtlList(clmSeq: string) {
    return useQuery({
      queryKey: exKeys.selectEstmtRqdcDtlList(clmSeq),
      queryFn: () => exService.selectEstmtRqdcDtlList(clmSeq),
      enabled: Boolean(clmSeq),
    })
  },

  /** 견적통보서목록(M73) — 상단 계약정보 + 연계 견적 목록. */
  useSelectEstmtNtdcList(ctrtNo?: string) {
    return useQuery({
      queryKey: exKeys.selectEstmtNtdcList(ctrtNo),
      queryFn: () => exService.selectEstmtNtdcList(ctrtNo),
    })
  },

  /** 견적통보서상세(M74). */
  useSelectOvsEstmtNtdcDtl(clmSeq: string) {
    return useQuery({
      queryKey: exKeys.selectOvsEstmtNtdcDtl(clmSeq),
      queryFn: () => exService.selectOvsEstmtNtdcDtl(clmSeq),
      enabled: Boolean(clmSeq),
    })
  },

  /** 견적통보서 품목목록(T74). */
  useSelectEstmtNtdcDtlList(clmSeq: string) {
    return useQuery({
      queryKey: exKeys.selectEstmtNtdcDtlList(clmSeq),
      queryFn: () => exService.selectEstmtNtdcDtlList(clmSeq),
      enabled: Boolean(clmSeq),
    })
  },

  /** 발주의뢰서목록(M75). */
  useSelectOrderRqdcList(req: MockOvsOrderRqdcListRequest = {}) {
    return useQuery({
      queryKey: exKeys.selectOrderRqdcList(req),
      queryFn: () => exService.selectOrderRqdcList(req),
    })
  },

  /** 발주의뢰서상세(M76). */
  useSelectOvsOrderRqdcDtl(orderSeq: string) {
    return useQuery({
      queryKey: exKeys.selectOvsOrderRqdcDtl(orderSeq),
      queryFn: () => exService.selectOvsOrderRqdcDtl(orderSeq),
      enabled: Boolean(orderSeq),
    })
  },

  /** 발주의뢰서 품목목록(T76). */
  useSelectOrderRqdcDtlList(orderSeq: string) {
    return useQuery({
      queryKey: exKeys.selectOrderRqdcDtlList(orderSeq),
      queryFn: () => exService.selectOrderRqdcDtlList(orderSeq),
      enabled: Boolean(orderSeq),
    })
  },

  /** 발주통보서목록(M77) — 상단 계약정보 + 목록. */
  useSelectOrderNtdcList(ctrtNo?: string) {
    return useQuery({
      queryKey: exKeys.selectOrderNtdcList(ctrtNo),
      queryFn: () => exService.selectOrderNtdcList(ctrtNo),
    })
  },

  /** 발주통보서상세(M78). */
  useSelectOvsOrderNtdcDtl(orderSeq: string) {
    return useQuery({
      queryKey: exKeys.selectOvsOrderNtdcDtl(orderSeq),
      queryFn: () => exService.selectOvsOrderNtdcDtl(orderSeq),
      enabled: Boolean(orderSeq),
    })
  },

  /** 발주통보서 품목목록(T78). */
  useSelectOrderNtdcDtlList(orderSeq: string) {
    return useQuery({
      queryKey: exKeys.selectOrderNtdcDtlList(orderSeq),
      queryFn: () => exService.selectOrderNtdcDtlList(orderSeq),
      enabled: Boolean(orderSeq),
    })
  },
}
