// 계약(CT) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// ⚠️ 폐쇄망 반입 후 실백엔드 경로 확정 시 EP 맵만 수정한다(메서드 본문 불변).
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.get/post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_CT } from '@/mocks/ct'
import type {
  CmdtyCtrdocDtl,
  CmdtyCtrdocDtstResult,
  CmdtyCtrtDtstResult,
  CmdtyElctrCtrtPrgrsDtl,
  CmdtyGnrlCtrdocDtl,
  CmdtyMdfcnCtrdocDtl,
  CmdtyMdfcnCtrdocDtstResult,
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

const EP = {
  /** 계약 통합목록 — MUI-CT-01-M01 (ctrtIntgList/CtrtIntgListPage) */
  CTRT_INTG_LIST: '/v1/cts/contracts',
  /** 물품전자계약진행상세 — MUI-CT-01-M03/T01 (cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtlPage) */
  CTRT_PRGRS_DTL: (id: string) => `/v1/cts/contracts/${id}`,
  /** 계약업체+생산공장 — MUI-CT-01-T02 (cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_Artcl) */
  CTRT_BZENTYS: (id: string) => `/v1/cts/contracts/${id}/bzentys`,
  /** 반송/취소 사유 — MUI-CT-01-T03 (cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_RjctRsn) */
  CTRT_RJCT_RSNS: (id: string) => `/v1/cts/contracts/${id}/reject-reasons`,
  /** 첨부서류 — MUI-CT-01-T04 (cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_Adoc) */
  CTRT_ADOCS: (id: string) => `/v1/cts/contracts/${id}/attached-docs`,
  /** 보증서 확인 — MUI-CT-01-M73 (cmdtyElctrCtrtPrgrsDtl/GrnteCnfrmFullPopup) */
  CTRT_GRNTES: (id: string) => `/v1/cts/contracts/${id}/guarantees`,
  /** 인지세 확인 — MUI-CT-01-M74 (cmdtyElctrCtrtPrgrsDtl/StmtxCnfrmFullPopup) */
  CTRT_STMTX: (id: string) => `/v1/cts/contracts/${id}/stamp-taxes`,
  /** 물품계약명세서 — MUI-CT-01-P11 (cmdtyElctrCtrtPrgrsDtl/CmdtyCtrtDtstFullPopup) */
  CMDTY_CTRT_DTST: (id: string) => `/v1/cts/contracts/${id}/item-specs`,
  /** 공사전자계약진행상세 — MUI-CT-01-M09/T09 (cstrnElctrCtrtPrgrsDtl/CstrnElctrCtrtPrgrsDtlPage) */
  CSTRN_CTRT_PRGRS_DTL: (id: string) => `/v1/cts/construction-contracts/${id}`,
  /** 하자담보책임 — MUI-CT-01-T11 (cstrnElctrCtrtPrgrsDtl/CstrnElctrCtrtPrgrsDtl_Flw) */
  CTRT_FLWS: (id: string) => `/v1/cts/contracts/${id}/flaw-warranties`,
  /** 물품일반계약서상세 — MUI-CT-01-M05 (cmdtyGnrlCtrdocDtl/CmdtyGnrlCtrdocDtlPage) */
  CMDTY_GNRL_CTRDOC_DTL: (id: string) => `/v1/cts/general-contracts/${id}`,
  /** 물품수정계약서상세 — MUI-CT-01-M06/T22 (cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtlPage) */
  CMDTY_MDFCN_CTRDOC_DTL: (id: string) => `/v1/cts/modified-contracts/${id}`,
  /** 수정계약명세서 — MUI-CT-01-T23·P13 (cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtst*) */
  CMDTY_MDFCN_CTRDOC_DTST: (id: string) => `/v1/cts/modified-contracts/${id}/item-specs`,
  /** 물품최종계약명세서 — MUI-CT-01-P12 (cmdtyElctrCtrtPrgrsDtl/CmdtyLastCtrdocDtstFullPopup) */
  CTRT_LAST_DTST: (id: string) => `/v1/cts/contracts/${id}/final-item-specs`,
  /** 특수조건 — MUI-CT-01-T24 (cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtl_Spcl) */
  CTRT_SPCL_CND: (id: string) => `/v1/cts/contracts/${id}/special-conditions`,
  /** 물품총액/단가계약서상세 — MUI-CT-01-M07/M08 (cmdtyGramtCtrdocDtl/CmdtyGramtCtrdocDtlPage) */
  CMDTY_CTRDOC_DTL: (id: string, type: CtCtrdocType) =>
    `/v1/cts/${type === 'gramt' ? 'lump-sum' : 'unit-price'}-contracts/${id}`,
  /** 계약명세서(총액/단가) — MUI-CT-01-T14/T17 (cmdtyGramtCtrdocDtl/CmdtyGramtCtrdocDtl_Ctrt) */
  CMDTY_CTRDOC_DTST: (id: string, type: CtCtrdocType) =>
    `/v1/cts/${type === 'gramt' ? 'lump-sum' : 'unit-price'}-contracts/${id}/item-specs`,
  /** 공사계약서상세 — MUI-CT-01-M10/T19 (cstrnCtrdocDtl/CstrnCtrdocDtlPage) */
  CSTRN_CTRDOC_DTL: (id: string) => `/v1/cts/construction-contract-docs/${id}`,
  /** 연대보증 — MUI-CT-01-T21 (cstrnCtrdocDtl/CstrnCtrdocDtl_Grnte) */
  CTRT_JNT_GRNTES: (id: string) => `/v1/cts/contracts/${id}/joint-guarantees`,
  /** 대금지불정보목록 — MUI-CT-01-M15 (pymtDfryInfoList/PymtDfryInfoListPage) */
  PYMT_DFRY_INFO_LIST: '/v1/cts/payment-infos',
  /** 대금지불정보조회 — MUI-CT-01-P16 (pymtDfryInfoList/PymtDfryInfoInqFullPopup) */
  PYMT_DFRY_INFO_INQ: (ctrtNo: string) => `/v1/cts/payment-infos/${ctrtNo}`,
  /** 계약진행상태 — MUI-CT-01-P17 (cmdtyElctrCtrtPrgrsDtl/CtrtPrgrsSttsInqFullPopup) */
  CTRT_PRGRS_STTS: (id: string) => `/v1/cts/contracts/${id}/progress-statuses`,
  /** 국외전자계약진행상세 — MUI-CT-01-M71/T71 (ovsElctrCtrtPrgrsDtl/OvsElctrCtrtPrgrsDtlPage) */
  OVS_CTRT_DTL: (id: string) => `/v1/cts/overseas-contracts/${id}`,
  /** 국외 계좌정보 — MUI-CT-01-T72 (ovsElctrCtrtPrgrsDtl/OvsBacntInfoTab) */
  OVS_BACNT_INFO: (id: string) => `/v1/cts/overseas-contracts/${id}/account-info`,
  /** 국외 계약명세서 — MUI-CT-01-T75 (ovsElctrCtrtPrgrsDtl/OvsCtrtDtstTab) */
  OVS_CTRT_DTST: (id: string) => `/v1/cts/overseas-contracts/${id}/item-specs`,
  /** 국외 첨부서류(+직인등록) — MUI-CT-01-T76 (ovsElctrCtrtPrgrsDtl/OvsElctrCtrtPrgrsDtlTab_Adoc) */
  OVS_CTRT_ADOCS: (id: string) => `/v1/cts/overseas-contracts/${id}/attached-docs`,
  /** 상업계약서상세 — MUI-CT-01-M77/T77 (ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtlPage) */
  OVS_CMBZ_CTRDOC_DTL: (id: string) => `/v1/cts/commercial-contracts/${id}`,
  /** 상업계약서 계약명세서 — MUI-CT-01-T78 (ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtl_Ctrt) */
  OVS_CMBZ_DTST: (id: string) => `/v1/cts/commercial-contracts/${id}/item-spec-groups`,
  /** 상업계약서 계약대상 — MUI-CT-01-T79 (ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtl_Trgt) */
  OVS_CMBZ_TRGT: (id: string) => `/v1/cts/commercial-contracts/${id}/parties`,
  /** 상업계약서명세서 — MUI-CT-01-P78 (ovsCmbzCtrdocDtl/OvsCmbzCtrtDtstFullPopup) */
  OVS_CMBZ_CTRT_DTST: (id: string) => `/v1/cts/commercial-contracts/${id}/item-specs`,
} as const

export const ctService = {
  // ── 계약 통합목록 ──────────────────────────────────────────────────────────

  /** 계약 통합목록 조회 — 목업은 전체 반환(키워드/페이징은 페이지 클라이언트 로직 소관). */
  async getCtrtIntgList(req: CtrtIntgListRequest = {}): Promise<CtrtIntgListResult> {
    if (USE_MOCK) {
      const list = MOCK_CT.ctrtIntgList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.get<CtrtIntgListResult, CtrtIntgListResult>(EP.CTRT_INTG_LIST, {
      params: req,
    })
  },

  // ── 물품전자계약진행상세 (MUI-CT-01-M03) ──────────────────────────────────

  /** 전자계약 진행 상세(상단 요약 + 상세내용 탭) 조회. */
  async getCtrtPrgrsDtl(id: string): Promise<CmdtyElctrCtrtPrgrsDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtPrgrsDtl)
    return apiClient.get<CmdtyElctrCtrtPrgrsDtl, CmdtyElctrCtrtPrgrsDtl>(EP.CTRT_PRGRS_DTL(id))
  },

  /** 계약업체 + 생산공장(계약업체 탭) 조회 — 업체/공장 모두 여러 건 반복 표시. */
  async getCtrtBzentys(id: string): Promise<{ bzentys: CtrtBzenty[]; fctrys: CtrtFctry[] }> {
    if (USE_MOCK) return mockDelay({ bzentys: MOCK_CT.ctrtBzentys, fctrys: MOCK_CT.ctrtFctrys })
    return apiClient.get<
      { bzentys: CtrtBzenty[]; fctrys: CtrtFctry[] },
      { bzentys: CtrtBzenty[]; fctrys: CtrtFctry[] }
    >(EP.CTRT_BZENTYS(id))
  },

  /** 반송/취소 사유(탭) 조회 — 단계별 타이틀 + 본문(세로 제한 없음). */
  async getCtrtRjctRsns(id: string): Promise<CtrtRjctRsn[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtRjctRsns)
    return apiClient.get<CtrtRjctRsn[], CtrtRjctRsn[]>(EP.CTRT_RJCT_RSNS(id))
  },

  /** 첨부서류(탭) 조회 — 계약관 제공/계약업체 등록 2섹션. */
  async getCtrtAdocs(id: string): Promise<CtrtAdocResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtAdocs)
    return apiClient.get<CtrtAdocResult, CtrtAdocResult>(EP.CTRT_ADOCS(id))
  },

  /** 보증서 확인(M73) 조회 — 계약정보 + 보증서정보(반복). */
  async getCtrtGrntes(id: string): Promise<CtrtGrnteResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtGrntes)
    return apiClient.get<CtrtGrnteResult, CtrtGrnteResult>(EP.CTRT_GRNTES(id))
  },

  /** 인지세 확인(M74) 조회 — 계약정보 + 납부정보(반복) + 납부액. */
  async getCtrtStmtx(id: string): Promise<CtrtStmtxResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtStmtx)
    return apiClient.get<CtrtStmtxResult, CtrtStmtxResult>(EP.CTRT_STMTX(id))
  },

  /** 물품계약명세서(P11) 조회 — 계약정보 + 품목(반복). */
  async getCmdtyCtrtDtst(id: string): Promise<CmdtyCtrtDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCtrtDtst)
    return apiClient.get<CmdtyCtrtDtstResult, CmdtyCtrtDtstResult>(EP.CMDTY_CTRT_DTST(id))
  },

  // ── 공사전자계약진행상세 (MUI-CT-01-M09) ──────────────────────────────────

  /** 공사 전자계약 진행 상세(상단 요약 + 상세정보 탭) 조회. */
  async getCstrnCtrtPrgrsDtl(id: string): Promise<CstrnElctrCtrtPrgrsDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cstrnCtrtPrgrsDtl)
    return apiClient.get<CstrnElctrCtrtPrgrsDtl, CstrnElctrCtrtPrgrsDtl>(
      EP.CSTRN_CTRT_PRGRS_DTL(id),
    )
  },

  /** 하자담보책임(탭) 조회 — 여러 건 반복 표시. */
  async getCtrtFlws(id: string): Promise<CtrtCnstpFlw[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtCnstpFlws)
    return apiClient.get<CtrtCnstpFlw[], CtrtCnstpFlw[]>(EP.CTRT_FLWS(id))
  },

  // ── 물품일반/수정계약서상세 (MUI-CT-01-M05/M06) ───────────────────────────

  /** 물품일반계약서 상세(M05) 조회. */
  async getCmdtyGnrlCtrdocDtl(id: string): Promise<CmdtyGnrlCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyGnrlCtrdocDtl)
    return apiClient.get<CmdtyGnrlCtrdocDtl, CmdtyGnrlCtrdocDtl>(EP.CMDTY_GNRL_CTRDOC_DTL(id))
  },

  /** 물품수정계약서 상세(M06/T22) 조회. */
  async getCmdtyMdfcnCtrdocDtl(id: string): Promise<CmdtyMdfcnCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyMdfcnCtrdocDtl)
    return apiClient.get<CmdtyMdfcnCtrdocDtl, CmdtyMdfcnCtrdocDtl>(EP.CMDTY_MDFCN_CTRDOC_DTL(id))
  },

  /** 수정계약명세서(T23·P13) 조회 — 계약정보 + 수정항목 + 품목(반복) + 합계. */
  async getCmdtyMdfcnCtrdocDtst(id: string): Promise<CmdtyMdfcnCtrdocDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyMdfcnCtrdocDtst)
    return apiClient.get<CmdtyMdfcnCtrdocDtstResult, CmdtyMdfcnCtrdocDtstResult>(
      EP.CMDTY_MDFCN_CTRDOC_DTST(id),
    )
  },

  /** 물품최종계약명세서(P12) 조회 — 품목(반복). */
  async getCtrtLastDtst(id: string): Promise<CtrtLastDtstItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtLastDtstItems)
    return apiClient.get<CtrtLastDtstItem[], CtrtLastDtstItem[]>(EP.CTRT_LAST_DTST(id))
  },

  /** 특수조건(T24/T15/T18) 조회. */
  async getCtrtSpclCnd(id: string): Promise<CtrtSpclCnd> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtSpclCnd)
    return apiClient.get<CtrtSpclCnd, CtrtSpclCnd>(EP.CTRT_SPCL_CND(id))
  },

  // ── 물품총액/단가계약서상세 (MUI-CT-01-M07/M08 — 1페이지 + type) ──────────

  /** 물품총액(gramt)/단가(untprc)계약서 상세 조회. */
  async getCmdtyCtrdocDtl(id: string, type: CtCtrdocType): Promise<CmdtyCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCtrdocDtls[type])
    return apiClient.get<CmdtyCtrdocDtl, CmdtyCtrdocDtl>(EP.CMDTY_CTRDOC_DTL(id, type))
  },

  /** 계약명세서(T14/T17) 조회 — 예산구분 그룹별 품목. */
  async getCmdtyCtrdocDtst(id: string, type: CtCtrdocType): Promise<CmdtyCtrdocDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCtrdocDtsts[type])
    return apiClient.get<CmdtyCtrdocDtstResult, CmdtyCtrdocDtstResult>(
      EP.CMDTY_CTRDOC_DTST(id, type),
    )
  },

  // ── 공사계약서상세 (MUI-CT-01-M10) ────────────────────────────────────────

  /** 공사계약서 상세(M10/T19) 조회. */
  async getCstrnCtrdocDtl(id: string): Promise<CstrnCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cstrnCtrdocDtl)
    return apiClient.get<CstrnCtrdocDtl, CstrnCtrdocDtl>(EP.CSTRN_CTRDOC_DTL(id))
  },

  /** 연대보증(T21) 조회 — 여러 건 반복 표시. */
  async getCtrtJntGrntes(id: string): Promise<CtrtJntGrnte[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtJntGrntes)
    return apiClient.get<CtrtJntGrnte[], CtrtJntGrnte[]>(EP.CTRT_JNT_GRNTES(id))
  },

  // ── 대금지불정보 (MUI-CT-01-M15/P16) · 계약진행상태 (P17) ─────────────────

  /** 대금지불정보 목록(M15) 조회 — 키워드/페이징은 페이지 클라이언트 로직 소관. */
  async getPymtDfryInfoList(): Promise<PymtDfryInfoItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.pymtDfryInfoList)
    return apiClient.get<PymtDfryInfoItem[], PymtDfryInfoItem[]>(EP.PYMT_DFRY_INFO_LIST)
  },

  /** 대금지불정보 조회(P16) — 계약건별 지불 상세 내역. */
  async getPymtDfryInfoInq(ctrtNo: string): Promise<PymtDfryInfoInqItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.pymtDfryInfoInqs)
    return apiClient.get<PymtDfryInfoInqItem[], PymtDfryInfoInqItem[]>(
      EP.PYMT_DFRY_INFO_INQ(ctrtNo),
    )
  },

  /** 계약진행상태(P17) 조회 — 계약체결 진행 이력. */
  async getCtrtPrgrsStts(id: string): Promise<CtrtPrgrsStts[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtPrgrsStts)
    return apiClient.get<CtrtPrgrsStts[], CtrtPrgrsStts[]>(EP.CTRT_PRGRS_STTS(id))
  },

  // ── 국외전자계약진행상세 (MUI-CT-01-M71) ──────────────────────────────────

  /** 국외 계약 일반현황(M71/T71) 조회. */
  async getOvsCtrtDtl(id: string): Promise<OvsElctrCtrtDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsElctrCtrtDtl)
    return apiClient.get<OvsElctrCtrtDtl, OvsElctrCtrtDtl>(EP.OVS_CTRT_DTL(id))
  },

  /** 국외 계좌정보(T72) 조회. */
  async getOvsBacntInfo(id: string): Promise<OvsBacntInfo> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsBacntInfo)
    return apiClient.get<OvsBacntInfo, OvsBacntInfo>(EP.OVS_BACNT_INFO(id))
  },

  /** 국외 계약명세서(T75) 조회. */
  async getOvsCtrtDtst(id: string): Promise<OvsCtrtDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCtrtDtst)
    return apiClient.get<OvsCtrtDtstResult, OvsCtrtDtstResult>(EP.OVS_CTRT_DTST(id))
  },

  /** 국외 첨부서류(T76) 조회 — 계약관/계약업체 + 직인등록정보. */
  async getOvsCtrtAdocs(id: string): Promise<OvsCtrtAdocResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCtrtAdocs)
    return apiClient.get<OvsCtrtAdocResult, OvsCtrtAdocResult>(EP.OVS_CTRT_ADOCS(id))
  },

  // ── 상업계약서상세 (MUI-CT-01-M77) ────────────────────────────────────────

  /** 상업계약서 계약현황(M77/T77) 조회. */
  async getOvsCmbzCtrdocDtl(id: string): Promise<OvsCmbzCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCmbzCtrdocDtl)
    return apiClient.get<OvsCmbzCtrdocDtl, OvsCmbzCtrdocDtl>(EP.OVS_CMBZ_CTRDOC_DTL(id))
  },

  /** 상업계약서 계약명세서(T78) 조회 — GRAND-TOTAL + 그룹 목록. */
  async getOvsCmbzDtst(id: string): Promise<OvsCmbzDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCmbzDtst)
    return apiClient.get<OvsCmbzDtstResult, OvsCmbzDtstResult>(EP.OVS_CMBZ_DTST(id))
  },

  /** 상업계약서 계약대상(T79) 조회. */
  async getOvsCmbzTrgt(id: string): Promise<OvsCmbzTrgt> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCmbzTrgt)
    return apiClient.get<OvsCmbzTrgt, OvsCmbzTrgt>(EP.OVS_CMBZ_TRGT(id))
  },

  /** 상업계약서명세서(P78) 조회 — 그룹별 품목 상세. */
  async getOvsCmbzCtrtDtst(id: string): Promise<OvsCmbzCtrtDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCmbzCtrtDtst)
    return apiClient.get<OvsCmbzCtrtDtstResult, OvsCmbzCtrtDtstResult>(EP.OVS_CMBZ_CTRT_DTST(id))
  },
}
