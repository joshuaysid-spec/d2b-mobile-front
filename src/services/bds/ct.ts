// 계약(CT) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: ctKeys.selectXxx / useSelectXxx) — 실규격 확정 전 임시 명명(select~ 스타일).
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로 확정 시 해당 함수만 수정).
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_CT } from '@/mocks/ct'
import type {
  CmdtyCncltnRmvDtl,
  CmdtyCtrdocDtl,
  CmdtyCtrdocDtstResult,
  CmdtyCtrtDtstResult,
  CmdtyElctrCtrtPrgrsDtl,
  CmdtyGnrlCtrdocDtl,
  CmdtyMdfcnCtrdocDtl,
  CmdtyMdfcnCtrdocDtstResult,
  CncltnRmvGnrlCtrtDtl,
  CncltnRmvListRequest,
  CncltnRmvListResult,
  CncltnRmvMdfcnCtrtDtl,
  CncltnRmvNotiResult,
  CstrnCncltnRmvDtl,
  CstrnCtrdocDtl,
  CstrnElctrCtrtPrgrsDtl,
  CtCtrdocType,
  CtrtAdocResult,
  CtrtBzenty,
  CtrtCnstpFlw,
  CtrtFctry,
  CtrtGrnteResult,
  CtrtIntgListRequest,
  CtrtIntgListResult,
  CtrtJntGrnte,
  CtrtLastDtstItem,
  CtrtPrgrsStts,
  CtrtRjctRsn,
  CtrtSpclCnd,
  CtrtStmtxResult,
  OvsBacntInfo,
  OvsCmbzCtrdocDtl,
  OvsCmbzCtrtDtstResult,
  OvsCmbzDtstResult,
  OvsCmbzTrgt,
  OvsCtrtAdocResult,
  OvsCtrtDtstResult,
  OvsElctrCtrtDtl,
  PymtDfryInfoInqItem,
  PymtDfryInfoItem,
} from '@/types/ct'

export const ctService = {
  // ── 계약 통합목록 ──────────────────────────────────────────────────────────

  /**
   * 계약 통합목록 조회 — MUI-CT-01-M01 (ctrtIntgList/CtrtIntgListPage).
   * 목업은 전체 반환(키워드/페이징은 페이지 클라이언트 로직 소관).
   */
  async selectCtrtIntgList(req: CtrtIntgListRequest = {}): Promise<CtrtIntgListResult> {
    if (USE_MOCK) {
      const list = MOCK_CT.ctrtIntgList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<CtrtIntgListResult, CtrtIntgListResult>('/v1/cts/contracts', req)
  },

  // ── 물품전자계약진행상세 (MUI-CT-01-M03) ──────────────────────────────────

  /**
   * 전자계약 진행 상세(상단 요약 + 상세내용 탭) 조회 — MUI-CT-01-M03/T01
   * (cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtlPage).
   */
  async selectCtrtPrgrsDtl(id: string): Promise<CmdtyElctrCtrtPrgrsDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtPrgrsDtl)
    return apiClient.post<CmdtyElctrCtrtPrgrsDtl, CmdtyElctrCtrtPrgrsDtl>(`/v1/cts/contracts/${id}`)
  },

  /**
   * 계약업체 + 생산공장(계약업체 탭) 조회 — MUI-CT-01-T02
   * (cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_Artcl). 업체/공장 모두 여러 건 반복 표시.
   */
  async selectCtrtBzentys(id: string): Promise<{ bzentys: CtrtBzenty[]; fctrys: CtrtFctry[] }> {
    if (USE_MOCK) return mockDelay({ bzentys: MOCK_CT.ctrtBzentys, fctrys: MOCK_CT.ctrtFctrys })
    return apiClient.post<
      { bzentys: CtrtBzenty[]; fctrys: CtrtFctry[] },
      { bzentys: CtrtBzenty[]; fctrys: CtrtFctry[] }
    >(`/v1/cts/contracts/${id}/bzentys`)
  },

  /**
   * 반송/취소 사유(탭) 조회 — MUI-CT-01-T03 (cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_RjctRsn).
   * 단계별 타이틀 + 본문(세로 제한 없음).
   */
  async selectCtrtRjctRsns(id: string): Promise<CtrtRjctRsn[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtRjctRsns)
    return apiClient.post<CtrtRjctRsn[], CtrtRjctRsn[]>(`/v1/cts/contracts/${id}/reject-reasons`)
  },

  /**
   * 첨부서류(탭) 조회 — MUI-CT-01-T04 (cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_Adoc).
   * 계약관 제공/계약업체 등록 2섹션.
   */
  async selectCtrtAdocs(id: string): Promise<CtrtAdocResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtAdocs)
    return apiClient.post<CtrtAdocResult, CtrtAdocResult>(`/v1/cts/contracts/${id}/attached-docs`)
  },

  /**
   * 보증서 확인 조회 — MUI-CT-01-M73 (cmdtyElctrCtrtPrgrsDtl/GrnteCnfrmFullPopup).
   * 계약정보 + 보증서정보(반복).
   */
  async selectCtrtGrntes(id: string): Promise<CtrtGrnteResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtGrntes)
    return apiClient.post<CtrtGrnteResult, CtrtGrnteResult>(`/v1/cts/contracts/${id}/guarantees`)
  },

  /**
   * 인지세 확인 조회 — MUI-CT-01-M74 (cmdtyElctrCtrtPrgrsDtl/StmtxCnfrmFullPopup).
   * 계약정보 + 납부정보(반복) + 납부액.
   */
  async selectCtrtStmtx(id: string): Promise<CtrtStmtxResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtStmtx)
    return apiClient.post<CtrtStmtxResult, CtrtStmtxResult>(`/v1/cts/contracts/${id}/stamp-taxes`)
  },

  /**
   * 물품계약명세서 조회 — MUI-CT-01-P11 (cmdtyElctrCtrtPrgrsDtl/CmdtyCtrtDtstFullPopup).
   * 계약정보 + 품목(반복).
   */
  async selectCmdtyCtrtDtst(id: string): Promise<CmdtyCtrtDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCtrtDtst)
    return apiClient.post<CmdtyCtrtDtstResult, CmdtyCtrtDtstResult>(
      `/v1/cts/contracts/${id}/item-specs`,
    )
  },

  // ── 공사전자계약진행상세 (MUI-CT-01-M09) ──────────────────────────────────

  /**
   * 공사 전자계약 진행 상세(상단 요약 + 상세정보 탭) 조회 — MUI-CT-01-M09/T09
   * (cstrnElctrCtrtPrgrsDtl/CstrnElctrCtrtPrgrsDtlPage).
   */
  async selectCstrnCtrtPrgrsDtl(id: string): Promise<CstrnElctrCtrtPrgrsDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cstrnCtrtPrgrsDtl)
    return apiClient.post<CstrnElctrCtrtPrgrsDtl, CstrnElctrCtrtPrgrsDtl>(
      `/v1/cts/construction-contracts/${id}`,
    )
  },

  /**
   * 하자담보책임(탭) 조회 — MUI-CT-01-T11 (cstrnElctrCtrtPrgrsDtl/CstrnElctrCtrtPrgrsDtl_Flw).
   * 여러 건 반복 표시.
   */
  async selectCtrtFlws(id: string): Promise<CtrtCnstpFlw[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtCnstpFlws)
    return apiClient.post<CtrtCnstpFlw[], CtrtCnstpFlw[]>(`/v1/cts/contracts/${id}/flaw-warranties`)
  },

  // ── 물품일반/수정계약서상세 (MUI-CT-01-M05/M06) ───────────────────────────

  /** 물품일반계약서 상세 조회 — MUI-CT-01-M05 (cmdtyGnrlCtrdocDtl/CmdtyGnrlCtrdocDtlPage). */
  async selectCmdtyGnrlCtrdocDtl(id: string): Promise<CmdtyGnrlCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyGnrlCtrdocDtl)
    return apiClient.post<CmdtyGnrlCtrdocDtl, CmdtyGnrlCtrdocDtl>(
      `/v1/cts/general-contracts/${id}`,
    )
  },

  /** 물품수정계약서 상세 조회 — MUI-CT-01-M06/T22 (cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtlPage). */
  async selectCmdtyMdfcnCtrdocDtl(id: string): Promise<CmdtyMdfcnCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyMdfcnCtrdocDtl)
    return apiClient.post<CmdtyMdfcnCtrdocDtl, CmdtyMdfcnCtrdocDtl>(
      `/v1/cts/modified-contracts/${id}`,
    )
  },

  /**
   * 수정계약명세서 조회 — MUI-CT-01-T23·P13 (cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtst*).
   * 계약정보 + 수정항목 + 품목(반복) + 합계.
   */
  async selectCmdtyMdfcnCtrdocDtst(id: string): Promise<CmdtyMdfcnCtrdocDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyMdfcnCtrdocDtst)
    return apiClient.post<CmdtyMdfcnCtrdocDtstResult, CmdtyMdfcnCtrdocDtstResult>(
      `/v1/cts/modified-contracts/${id}/item-specs`,
    )
  },

  /**
   * 물품최종계약명세서 조회 — MUI-CT-01-P12 (cmdtyElctrCtrtPrgrsDtl/CmdtyLastCtrdocDtstFullPopup).
   * 품목(반복).
   */
  async selectCtrtLastDtst(id: string): Promise<CtrtLastDtstItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtLastDtstItems)
    return apiClient.post<CtrtLastDtstItem[], CtrtLastDtstItem[]>(
      `/v1/cts/contracts/${id}/final-item-specs`,
    )
  },

  /** 특수조건 조회 — MUI-CT-01-T24/T15/T18 (cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtl_Spcl). */
  async selectCtrtSpclCnd(id: string): Promise<CtrtSpclCnd> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtSpclCnd)
    return apiClient.post<CtrtSpclCnd, CtrtSpclCnd>(`/v1/cts/contracts/${id}/special-conditions`)
  },

  // ── 물품총액/단가계약서상세 (MUI-CT-01-M07/M08 — 1페이지 + type) ──────────

  /**
   * 물품총액(gramt)/단가(untprc)계약서 상세 조회 — MUI-CT-01-M07/M08
   * (cmdtyGramtCtrdocDtl/CmdtyGramtCtrdocDtlPage).
   */
  async selectCmdtyCtrdocDtl(id: string, type: CtCtrdocType): Promise<CmdtyCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCtrdocDtls[type])
    return apiClient.post<CmdtyCtrdocDtl, CmdtyCtrdocDtl>(
      `/v1/cts/${type === 'gramt' ? 'lump-sum' : 'unit-price'}-contracts/${id}`,
    )
  },

  /**
   * 계약명세서(총액/단가) 조회 — MUI-CT-01-T14/T17 (cmdtyGramtCtrdocDtl/CmdtyGramtCtrdocDtl_Ctrt).
   * 예산구분 그룹별 품목.
   */
  async selectCmdtyCtrdocDtst(id: string, type: CtCtrdocType): Promise<CmdtyCtrdocDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCtrdocDtsts[type])
    return apiClient.post<CmdtyCtrdocDtstResult, CmdtyCtrdocDtstResult>(
      `/v1/cts/${type === 'gramt' ? 'lump-sum' : 'unit-price'}-contracts/${id}/item-specs`,
    )
  },

  // ── 공사계약서상세 (MUI-CT-01-M10) ────────────────────────────────────────

  /** 공사계약서 상세 조회 — MUI-CT-01-M10/T19 (cstrnCtrdocDtl/CstrnCtrdocDtlPage). */
  async selectCstrnCtrdocDtl(id: string): Promise<CstrnCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cstrnCtrdocDtl)
    return apiClient.post<CstrnCtrdocDtl, CstrnCtrdocDtl>(
      `/v1/cts/construction-contract-docs/${id}`,
    )
  },

  /** 연대보증 조회 — MUI-CT-01-T21 (cstrnCtrdocDtl/CstrnCtrdocDtl_Grnte). 여러 건 반복 표시. */
  async selectCtrtJntGrntes(id: string): Promise<CtrtJntGrnte[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtJntGrntes)
    return apiClient.post<CtrtJntGrnte[], CtrtJntGrnte[]>(
      `/v1/cts/contracts/${id}/joint-guarantees`,
    )
  },

  // ── 대금지불정보 (MUI-CT-01-M15/P16) · 계약진행상태 (P17) ─────────────────

  /**
   * 대금지불정보 목록 조회 — MUI-CT-01-M15 (pymtDfryInfoList/PymtDfryInfoListPage).
   * 키워드/페이징은 페이지 클라이언트 로직 소관.
   */
  async selectPymtDfryInfoList(): Promise<PymtDfryInfoItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.pymtDfryInfoList)
    return apiClient.post<PymtDfryInfoItem[], PymtDfryInfoItem[]>('/v1/cts/payment-infos')
  },

  /**
   * 대금지불정보 조회 — MUI-CT-01-P16 (pymtDfryInfoList/PymtDfryInfoInqFullPopup).
   * 계약건별 지불 상세 내역.
   */
  async selectPymtDfryInfoInq(ctrtNo: string): Promise<PymtDfryInfoInqItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.pymtDfryInfoInqs)
    return apiClient.post<PymtDfryInfoInqItem[], PymtDfryInfoInqItem[]>(
      `/v1/cts/payment-infos/${ctrtNo}`,
    )
  },

  /**
   * 계약진행상태 조회 — MUI-CT-01-P17 (cmdtyElctrCtrtPrgrsDtl/CtrtPrgrsSttsInqFullPopup).
   * 계약체결 진행 이력.
   */
  async selectCtrtPrgrsStts(id: string): Promise<CtrtPrgrsStts[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtPrgrsStts)
    return apiClient.post<CtrtPrgrsStts[], CtrtPrgrsStts[]>(
      `/v1/cts/contracts/${id}/progress-statuses`,
    )
  },

  // ── 국외전자계약진행상세 (MUI-CT-01-M71) ──────────────────────────────────

  /** 국외 계약 일반현황 조회 — MUI-CT-01-M71/T71 (ovsElctrCtrtPrgrsDtl/OvsElctrCtrtPrgrsDtlPage). */
  async selectOvsCtrtDtl(id: string): Promise<OvsElctrCtrtDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsElctrCtrtDtl)
    return apiClient.post<OvsElctrCtrtDtl, OvsElctrCtrtDtl>(`/v1/cts/overseas-contracts/${id}`)
  },

  /** 국외 계좌정보 조회 — MUI-CT-01-T72 (ovsElctrCtrtPrgrsDtl/OvsBacntInfoTab). */
  async selectOvsBacntInfo(id: string): Promise<OvsBacntInfo> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsBacntInfo)
    return apiClient.post<OvsBacntInfo, OvsBacntInfo>(
      `/v1/cts/overseas-contracts/${id}/account-info`,
    )
  },

  /** 국외 계약명세서 조회 — MUI-CT-01-T75 (ovsElctrCtrtPrgrsDtl/OvsCtrtDtstTab). */
  async selectOvsCtrtDtst(id: string): Promise<OvsCtrtDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCtrtDtst)
    return apiClient.post<OvsCtrtDtstResult, OvsCtrtDtstResult>(
      `/v1/cts/overseas-contracts/${id}/item-specs`,
    )
  },

  /**
   * 국외 첨부서류(+직인등록) 조회 — MUI-CT-01-T76
   * (ovsElctrCtrtPrgrsDtl/OvsElctrCtrtPrgrsDtlTab_Adoc). 계약관/계약업체 + 직인등록정보.
   */
  async selectOvsCtrtAdocs(id: string): Promise<OvsCtrtAdocResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCtrtAdocs)
    return apiClient.post<OvsCtrtAdocResult, OvsCtrtAdocResult>(
      `/v1/cts/overseas-contracts/${id}/attached-docs`,
    )
  },

  // ── 상업계약서상세 (MUI-CT-01-M77) ────────────────────────────────────────

  /** 상업계약서 계약현황 조회 — MUI-CT-01-M77/T77 (ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtlPage). */
  async selectOvsCmbzCtrdocDtl(id: string): Promise<OvsCmbzCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCmbzCtrdocDtl)
    return apiClient.post<OvsCmbzCtrdocDtl, OvsCmbzCtrdocDtl>(
      `/v1/cts/commercial-contracts/${id}`,
    )
  },

  /**
   * 상업계약서 계약명세서 조회 — MUI-CT-01-T78 (ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtl_Ctrt).
   * GRAND-TOTAL + 그룹 목록.
   */
  async selectOvsCmbzDtst(id: string): Promise<OvsCmbzDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCmbzDtst)
    return apiClient.post<OvsCmbzDtstResult, OvsCmbzDtstResult>(
      `/v1/cts/commercial-contracts/${id}/item-spec-groups`,
    )
  },

  /** 상업계약서 계약대상 조회 — MUI-CT-01-T79 (ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtl_Trgt). */
  async selectOvsCmbzTrgt(id: string): Promise<OvsCmbzTrgt> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCmbzTrgt)
    return apiClient.post<OvsCmbzTrgt, OvsCmbzTrgt>(`/v1/cts/commercial-contracts/${id}/parties`)
  },

  /** 상업계약서명세서 조회 — MUI-CT-01-P78 (ovsCmbzCtrdocDtl/OvsCmbzCtrtDtst). 그룹별 품목 상세. */
  async selectOvsCmbzCtrtDtst(id: string): Promise<OvsCmbzCtrtDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCmbzCtrtDtst)
    return apiClient.post<OvsCmbzCtrtDtstResult, OvsCmbzCtrtDtstResult>(
      `/v1/cts/commercial-contracts/${id}/item-specs`,
    )
  },

  // ── 해지/해제 계열 (MUI-CT-03) ────────────────────────────────────────────

  /**
   * 해지/해제 목록 조회 — MUI-CT-03-M01 (ctrtCncltnRmvList/CtrtCncltnRmvListPage).
   * 키워드/페이징은 페이지 클라이언트 로직 소관.
   */
  async selectCncltnRmvList(req: CncltnRmvListRequest = {}): Promise<CncltnRmvListResult> {
    if (USE_MOCK) {
      const list = MOCK_CT.cncltnRmvList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<CncltnRmvListResult, CncltnRmvListResult>('/v1/cts/cancellations', req)
  },

  /**
   * 물품 해지/해제 상세정보 조회 — MUI-CT-03-M02/T01
   * (cmdtyCtrtCncltnRmvDtl/CmdtyCtrtCncltnRmvDtl_Cn).
   */
  async selectCmdtyCncltnRmvDtl(id: string): Promise<CmdtyCncltnRmvDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCncltnRmvDtl)
    return apiClient.post<CmdtyCncltnRmvDtl, CmdtyCncltnRmvDtl>(`/v1/cts/cancellations/${id}`)
  },

  /**
   * 물품 해지/해제 계약업체 조회 — MUI-CT-03-T02
   * (cmdtyCtrtCncltnRmvDtl/CmdtyCtrtCncltnRmvDtl_Artcl). 여러 업체 반복.
   */
  async selectCmdtyCncltnRmvBzentys(id: string): Promise<CtrtBzenty[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCncltnRmvBzentys)
    return apiClient.post<CtrtBzenty[], CtrtBzenty[]>(`/v1/cts/cancellations/${id}/bzentys`)
  },

  /**
   * 해지/해제 정보(통보내용+참조서류) 조회 — MUI-CT-03-T03
   * (cmdtyCtrtCncltnRmvDtl/CmdtyCtrtCncltnRmvDtl_SpclCnd). 통보내용(반복) + 참조서류.
   */
  async selectCmdtyCncltnRmvNoti(id: string): Promise<CncltnRmvNotiResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCncltnRmvNoti)
    return apiClient.post<CncltnRmvNotiResult, CncltnRmvNotiResult>(
      `/v1/cts/cancellations/${id}/notices`,
    )
  },

  /**
   * 해지/해제 일반계약(총액 gramt / 단가 untprc) 상세정보 조회 — MUI-CT-03-M03/M04
   * (cncltnRmvGnrlCtrt*Dtl/*_Cn).
   */
  async selectCncltnRmvGnrlCtrtDtl(id: string, type: CtCtrdocType): Promise<CncltnRmvGnrlCtrtDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cncltnRmvGnrlCtrtDtls[type])
    return apiClient.post<CncltnRmvGnrlCtrtDtl, CncltnRmvGnrlCtrtDtl>(
      `/v1/cts/cancellations/${type === 'gramt' ? 'lump-sum' : 'unit-price'}/${id}`,
    )
  },

  /**
   * 해지/해제 일반계약 계약명세서 조회 — MUI-CT-03-T05/T08 (cncltnRmvGnrlCtrt*Dtl/*_Artcl).
   * 예산구분 그룹별 품목(CmdtyCtrdocDtstResult 재사용).
   */
  async selectCncltnRmvGnrlCtrtDtst(
    id: string,
    type: CtCtrdocType,
  ): Promise<CmdtyCtrdocDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cncltnRmvGnrlCtrtDtsts[type])
    return apiClient.post<CmdtyCtrdocDtstResult, CmdtyCtrdocDtstResult>(
      `/v1/cts/cancellations/${type === 'gramt' ? 'lump-sum' : 'unit-price'}/${id}/item-specs`,
    )
  },

  /** 해지/해제 특수조건 조회 — MUI-CT-03-T06/T09/T12 (cncltnRmv*Dtl/*_Spcl). */
  async selectCncltnRmvSpcl(id: string): Promise<CtrtSpclCnd> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cncltnRmvSpcl)
    return apiClient.post<CtrtSpclCnd, CtrtSpclCnd>(
      `/v1/cts/cancellations/${id}/special-conditions`,
    )
  },

  /**
   * 해지/해제 수정계약 상세정보 조회 — MUI-CT-03-M05/T10
   * (cncltnRmvMdfcnCtrtDtl/CncltnRmvMdfcnCtrtDtl_Cn).
   */
  async selectCncltnRmvMdfcnCtrtDtl(id: string): Promise<CncltnRmvMdfcnCtrtDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cncltnRmvMdfcnCtrtDtl)
    return apiClient.post<CncltnRmvMdfcnCtrtDtl, CncltnRmvMdfcnCtrtDtl>(
      `/v1/cts/cancellations/modified/${id}`,
    )
  },

  /**
   * 해지/해제 수정계약 계약명세서 조회 — MUI-CT-03-T11
   * (cncltnRmvMdfcnCtrtDtl/CncltnRmvMdfcnCtrtDtl_Ctrt). CmdtyMdfcnCtrdocDtstResult 재사용.
   */
  async selectCncltnRmvMdfcnCtrtDtst(id: string): Promise<CmdtyMdfcnCtrdocDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cncltnRmvMdfcnCtrtDtst)
    return apiClient.post<CmdtyMdfcnCtrdocDtstResult, CmdtyMdfcnCtrdocDtstResult>(
      `/v1/cts/cancellations/modified/${id}/item-specs`,
    )
  },

  /**
   * 해지/해제 공사계약 상세정보 조회 — MUI-CT-03-M06/T13
   * (cstrnCtrtCncltnRmvDtl/CstrnCtrtCncltnRmvDtl_Cn).
   */
  async selectCstrnCncltnRmvDtl(id: string): Promise<CstrnCncltnRmvDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cstrnCncltnRmvDtl)
    return apiClient.post<CstrnCncltnRmvDtl, CstrnCncltnRmvDtl>(
      `/v1/cts/cancellations/construction/${id}`,
    )
  },

  /**
   * 해지/해제 공사계약 첨부서류 조회 — MUI-CT-03-T14
   * (cstrnCtrtCncltnRmvDtl/CstrnCtrtCncltnRmvDtl_Adoc). 해지해제/계약업체 2섹션(CtrtAdocResult 재사용).
   */
  async selectCstrnCncltnRmvAdocs(id: string): Promise<CtrtAdocResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cstrnCncltnRmvAdocs)
    return apiClient.post<CtrtAdocResult, CtrtAdocResult>(
      `/v1/cts/cancellations/construction/${id}/attached-docs`,
    )
  },
}
