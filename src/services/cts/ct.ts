// 계약(CT) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: ctKeys.selectXxx / useSelectXxx) — 실 API 목록(no.314~362) 기준.
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로).
// 요청 body 항목명은 상세설계 대기 — 식별자는 설계서 항목명(ctrtNo/ctrtCycl)으로 전달(아래 ctrtKey).
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
//
// ⚠️ ct 는 화면(계약서 유형별 상세·탭)이 실 API 보다 훨씬 많다 — 한 API 를 여러 함수가 공유한다.
//   no.326 계약서상세조회  : 물품일반/수정/총액/단가/공사 계약서 + 물품·공사 진행상세 + 그 탭들(계약업체·반송사유·
//                            첨부서류·하자담보·특수조건·연대보증·보증서·인지세)
//   no.327 계약명세서조회  : 물품/총액·단가/수정/최종 명세서 + 해지해제 일반·수정계약 명세서
//   no.362 계약해지해제상세정보조회 : 해지/해제 물품·일반(총액/단가)·수정·공사 상세 + 그 탭들
//   반환 타입이 화면마다 달라 함수는 분리하고 URL 만 공유한다(ex no.378 선례). 전용 메서드 확인 시 해당 함수의 URL 만 교체.
//
// ⚠️ 실 API 목록 중 미배선(모바일 소비처 없음 — 반입 전 확인):
//   no.334 진행상태목록조회(selectPrgrsSttsList) · no.343 보증서상세목록조회(selectWtgrDtlList)
//     → 국외 계약에 국내 P17(계약진행상태)·보증서 드릴다운에 해당하는 화면이 모바일에 없다. 함수만 두고 소비처 대기.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_CT } from '@/mocks/ct'
import type {
  MockCmdtyCncltnRmvDtl,
  MockCmdtyCtrdocDtl,
  MockCmdtyCtrdocDtstResult,
  MockCmdtyCtrtDtstResult,
  MockCmdtyElctrCtrtPrgrsDtl,
  MockCmdtyGnrlCtrdocDtl,
  MockCmdtyMdfcnCtrdocDtl,
  MockCmdtyMdfcnCtrdocDtstResult,
  MockCncltnRmvGnrlCtrtDtl,
  MockCncltnRmvListRequest,
  MockCncltnRmvListResult,
  MockCncltnRmvMdfcnCtrtDtl,
  MockCncltnRmvNotiResult,
  MockCstrnCncltnRmvDtl,
  MockCstrnCtrdocDtl,
  MockCstrnElctrCtrtPrgrsDtl,
  MockCtCtrdocType,
  MockCtrtAdocResult,
  MockCtrtBzenty,
  MockCtrtCnstpFlw,
  MockCtrtFctry,
  MockCtrtGrnteInfo,
  MockCtrtGrnteResult,
  MockCtrtIntgListRequest,
  MockCtrtIntgListResult,
  MockCtrtJntGrnte,
  MockCtrtLastDtstItem,
  MockCtrtPrgrsStts,
  MockCtrtRjctRsn,
  MockCtrtSpclCnd,
  MockCtrtStmtxResult,
  MockOvsBacntInfo,
  MockOvsCmbzCtrdocDtl,
  MockOvsCmbzCtrtDtstResult,
  MockOvsCmbzDtstResult,
  MockOvsCmbzTrgt,
  MockOvsCtrtAdocResult,
  MockOvsCtrtDtstResult,
  MockOvsElctrCtrtDtl,
  MockPymtDfryInfoInqItem,
  MockPymtDfryInfoItem,
} from '@/types/mock/ct'

// 목록 카드의 id 는 `${ctrtNo}-${ctrtCycl}` 합성 키(types/ct.ts) — 요청 body 는 설계서 항목명 2개로 분리해 보낸다.
const ctrtKey = (id: string) => {
  const [ctrtNo, ctrtCycl] = id.split('-')
  return { ctrtNo, ctrtCycl }
}

export const ctService = {
  // ── 계약 통합목록 ──────────────────────────────────────────────────────────

  /**
   * no.314 계약통합목록조회 — MUI-CT-01-M01 (ctrtIntgList/CtrtIntgListPage).
   * 목업은 전체 반환(키워드/페이징은 페이지 클라이언트 로직 소관).
   */
  async selectCtrtIntgList(req: MockCtrtIntgListRequest = {}): Promise<MockCtrtIntgListResult> {
    if (USE_MOCK) {
      const list = MOCK_CT.ctrtIntgList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<MockCtrtIntgListResult, MockCtrtIntgListResult>(
      '/cts/ct/ctrtInfo/selectCtrtIntgList.do',
      req,
    )
  },

  // ── 물품전자계약진행상세 (MUI-CT-01-M03) ──────────────────────────────────

  /**
   * 전자계약 진행 상세(상단 요약 + 상세내용 탭) 조회 — MUI-CT-01-M03/T01
   * (cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtlPage).
   * TODO(백엔드 확정): no.326 계약서상세조회 공유(파일 상단 ⚠️) — 진행상세 전용 메서드 확인 시 URL 교체.
   */
  async selectCtrtPrgrsDtl(id: string): Promise<MockCmdtyElctrCtrtPrgrsDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtPrgrsDtl)
    return apiClient.post<MockCmdtyElctrCtrtPrgrsDtl, MockCmdtyElctrCtrtPrgrsDtl>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 계약업체 + 생산공장(계약업체 탭) 조회 — MUI-CT-01-T02
   * (cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_Artcl). 업체/공장 모두 여러 건 반복 표시.
   * TODO(백엔드 확정): no.326 공유 — 상세 응답에 포함되면 selectCtrtPrgrsDtl 반환값에서 읽도록 통합.
   */
  async selectCtrtBzentys(id: string): Promise<{ bzentys: MockCtrtBzenty[]; fctrys: MockCtrtFctry[] }> {
    if (USE_MOCK) return mockDelay({ bzentys: MOCK_CT.ctrtBzentys, fctrys: MOCK_CT.ctrtFctrys })
    return apiClient.post<
      { bzentys: MockCtrtBzenty[]; fctrys: MockCtrtFctry[] },
      { bzentys: MockCtrtBzenty[]; fctrys: MockCtrtFctry[] }
    >('/cts/ct/ctrtInfo/selectCtrdocDtlInq.do', ctrtKey(id))
  },

  /**
   * 반송/취소 사유(탭) 조회 — MUI-CT-01-T03 (cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_RjctRsn).
   * 단계별 타이틀 + 본문(세로 제한 없음). TODO(백엔드 확정): no.326 공유(T02 와 동일 사유).
   */
  async selectCtrtRjctRsns(id: string): Promise<MockCtrtRjctRsn[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtRjctRsns)
    return apiClient.post<MockCtrtRjctRsn[], MockCtrtRjctRsn[]>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 첨부서류(탭) 조회 — MUI-CT-01-T04 (cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_Adoc).
   * 계약관 제공/계약업체 등록 2섹션.
   * TODO(백엔드 확정): 국외는 no.350 계약서류목록조회가 따로 있으나 국내 첨부서류 API 는 실목록에 없어 no.326 공유.
   */
  async selectCtrtAdocs(id: string): Promise<MockCtrtAdocResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtAdocs)
    return apiClient.post<MockCtrtAdocResult, MockCtrtAdocResult>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 보증서 확인 조회 — MUI-CT-01-M73 (cmdtyElctrCtrtPrgrsDtl/GrnteCnfrmFullPopup).
   * 계약정보 + 보증서정보(반복).
   * TODO(백엔드 확정): 국외는 no.341 보증서조회가 따로 있으나 국내(CtrtInfoController) 보증서 API 는 실목록에 없어
   *   no.326 공유. 국내 전용 메서드 확인 시 URL 교체(국외 탭은 아래 selectWtgr).
   */
  async selectCtrtGrntes(id: string): Promise<MockCtrtGrnteResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtGrntes)
    return apiClient.post<MockCtrtGrnteResult, MockCtrtGrnteResult>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 인지세 확인 조회 — MUI-CT-01-M74 (cmdtyElctrCtrtPrgrsDtl/StmtxCnfrmFullPopup).
   * 계약정보 + 납부정보(반복) + 납부액.
   * TODO(백엔드 확정): 국외는 no.345 인지세납부목록조회가 따로 있으나 국내 인지세 API 는 실목록에 없어 no.326 공유.
   */
  async selectCtrtStmtx(id: string): Promise<MockCtrtStmtxResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtStmtx)
    return apiClient.post<MockCtrtStmtxResult, MockCtrtStmtxResult>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  /**
   * no.327 계약명세서조회 — MUI-CT-01-P11 (cmdtyElctrCtrtPrgrsDtl/CmdtyCtrtDtstFullPopup).
   * 계약정보 + 품목(반복). 구 `selectCmdtyCtrtDtst`.
   */
  async selectCtrtDtstInq(id: string): Promise<MockCmdtyCtrtDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCtrtDtst)
    return apiClient.post<MockCmdtyCtrtDtstResult, MockCmdtyCtrtDtstResult>(
      '/cts/ct/ctrtInfo/selectCtrtDtstInq.do',
      ctrtKey(id),
    )
  },

  // ── 공사전자계약진행상세 (MUI-CT-01-M09) ──────────────────────────────────

  /**
   * 공사 전자계약 진행 상세(상단 요약 + 상세정보 탭) 조회 — MUI-CT-01-M09/T09
   * (cstrnElctrCtrtPrgrsDtl/CstrnElctrCtrtPrgrsDtlPage).
   * TODO(백엔드 확정): no.326 공유(물품 M03 과 동일 URL, 응답 구성만 다름).
   */
  async selectCstrnCtrtPrgrsDtl(id: string): Promise<MockCstrnElctrCtrtPrgrsDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cstrnCtrtPrgrsDtl)
    return apiClient.post<MockCstrnElctrCtrtPrgrsDtl, MockCstrnElctrCtrtPrgrsDtl>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 하자담보책임(탭) 조회 — MUI-CT-01-T11 (cstrnElctrCtrtPrgrsDtl/CstrnElctrCtrtPrgrsDtl_Flw).
   * 여러 건 반복 표시. TODO(백엔드 확정): no.326 공유(T02 와 동일 사유).
   */
  async selectCtrtFlws(id: string): Promise<MockCtrtCnstpFlw[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtCnstpFlws)
    return apiClient.post<MockCtrtCnstpFlw[], MockCtrtCnstpFlw[]>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  // ── 물품일반/수정계약서상세 (MUI-CT-01-M05/M06) ───────────────────────────

  /**
   * no.326 계약서상세조회 — MUI-CT-01-M05 (cmdtyGnrlCtrdocDtl/CmdtyGnrlCtrdocDtlPage).
   * 계약서 유형별 상세가 이 API 하나를 공유한다(파일 상단 ⚠️) — 물품일반계약서가 대표 소비처.
   * 구 `selectCmdtyGnrlCtrdocDtl`.
   */
  async selectCtrdocDtlInq(id: string): Promise<MockCmdtyGnrlCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyGnrlCtrdocDtl)
    return apiClient.post<MockCmdtyGnrlCtrdocDtl, MockCmdtyGnrlCtrdocDtl>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 물품수정계약서 상세 조회 — MUI-CT-01-M06/T22 (cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtlPage).
   * TODO(백엔드 확정): no.326 공유(M05 와 동일 URL, 응답 구성만 다름).
   */
  async selectCmdtyMdfcnCtrdocDtl(id: string): Promise<MockCmdtyMdfcnCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyMdfcnCtrdocDtl)
    return apiClient.post<MockCmdtyMdfcnCtrdocDtl, MockCmdtyMdfcnCtrdocDtl>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 수정계약명세서 조회 — MUI-CT-01-T23·P13 (cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtst*).
   * 계약정보 + 수정항목 + 품목(반복) + 합계. TODO(백엔드 확정): no.327 공유.
   */
  async selectCmdtyMdfcnCtrdocDtst(id: string): Promise<MockCmdtyMdfcnCtrdocDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyMdfcnCtrdocDtst)
    return apiClient.post<MockCmdtyMdfcnCtrdocDtstResult, MockCmdtyMdfcnCtrdocDtstResult>(
      '/cts/ct/ctrtInfo/selectCtrtDtstInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 물품최종계약명세서 조회 — MUI-CT-01-P12 (cmdtyElctrCtrtPrgrsDtl/CmdtyLastCtrdocDtstFullPopup).
   * 품목(반복). TODO(백엔드 확정): no.327 공유 — '최종' 구분값이 필요하면 body 에 추가.
   */
  async selectCtrtLastDtst(id: string): Promise<MockCtrtLastDtstItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtLastDtstItems)
    return apiClient.post<MockCtrtLastDtstItem[], MockCtrtLastDtstItem[]>(
      '/cts/ct/ctrtInfo/selectCtrtDtstInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 특수조건 조회 — MUI-CT-01-T24/T15/T18 (cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtl_Spcl).
   * TODO(백엔드 확정): no.326 공유(T02 와 동일 사유).
   */
  async selectCtrtSpclCnd(id: string): Promise<MockCtrtSpclCnd> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtSpclCnd)
    return apiClient.post<MockCtrtSpclCnd, MockCtrtSpclCnd>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  // ── 물품총액/단가계약서상세 (MUI-CT-01-M07/M08 — 1페이지 + type) ──────────

  /**
   * 물품총액(gramt)/단가(untprc)계약서 상세 조회 — MUI-CT-01-M07/M08
   * (cmdtyGramtCtrdocDtl/CmdtyGramtCtrdocDtlPage).
   * TODO(백엔드 확정): no.326 공유 — 총액/단가는 계약 자체의 유형이라 body 구분값 없이 호출한다(type 은 목업 선택용).
   *   유형 파라미터가 필요하면 body 에 추가.
   */
  async selectCmdtyCtrdocDtl(id: string, type: MockCtCtrdocType): Promise<MockCmdtyCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCtrdocDtls[type])
    return apiClient.post<MockCmdtyCtrdocDtl, MockCmdtyCtrdocDtl>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 계약명세서(총액/단가) 조회 — MUI-CT-01-T14/T17 (cmdtyGramtCtrdocDtl/CmdtyGramtCtrdocDtl_Ctrt).
   * 예산구분 그룹별 품목. TODO(백엔드 확정): no.327 공유(M07/M08 과 동일 사유 — type 은 목업 선택용).
   */
  async selectCmdtyCtrdocDtst(id: string, type: MockCtCtrdocType): Promise<MockCmdtyCtrdocDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCtrdocDtsts[type])
    return apiClient.post<MockCmdtyCtrdocDtstResult, MockCmdtyCtrdocDtstResult>(
      '/cts/ct/ctrtInfo/selectCtrtDtstInq.do',
      ctrtKey(id),
    )
  },

  // ── 공사계약서상세 (MUI-CT-01-M10) ────────────────────────────────────────

  /**
   * 공사계약서 상세 조회 — MUI-CT-01-M10/T19 (cstrnCtrdocDtl/CstrnCtrdocDtlPage).
   * TODO(백엔드 확정): no.326 공유(M05 와 동일 URL, 응답 구성만 다름).
   */
  async selectCstrnCtrdocDtl(id: string): Promise<MockCstrnCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cstrnCtrdocDtl)
    return apiClient.post<MockCstrnCtrdocDtl, MockCstrnCtrdocDtl>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 연대보증 조회 — MUI-CT-01-T21 (cstrnCtrdocDtl/CstrnCtrdocDtl_Grnte). 여러 건 반복 표시.
   * TODO(백엔드 확정): no.326 공유(T02 와 동일 사유).
   */
  async selectCtrtJntGrntes(id: string): Promise<MockCtrtJntGrnte[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtJntGrntes)
    return apiClient.post<MockCtrtJntGrnte[], MockCtrtJntGrnte[]>(
      '/cts/ct/ctrtInfo/selectCtrdocDtlInq.do',
      ctrtKey(id),
    )
  },

  // ── 대금지불정보 (MUI-CT-01-M15/P16) · 계약진행상태 (P17) ─────────────────

  /**
   * no.331 대금지불정보목록조회 — MUI-CT-01-M15 (pymtDfryInfoList/PymtDfryInfoListPage).
   * 키워드/페이징은 페이지 클라이언트 로직 소관. 구 `selectPymtDfryInfoList`.
   */
  async selectPymtDfryInfoListInq(): Promise<MockPymtDfryInfoItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.pymtDfryInfoList)
    return apiClient.post<MockPymtDfryInfoItem[], MockPymtDfryInfoItem[]>(
      '/cts/ct/ctrtInfo/selectPymtDfryInfoListInq.do',
    )
  },

  /**
   * no.333 대금지불정보조회 — MUI-CT-01-P16 (pymtDfryInfoList/PymtDfryInfoInqFullPopup).
   * 계약건별 지불 상세 내역(식별자 = 목록 항목의 계약번호).
   */
  async selectPymtDfryInfoInq(ctrtNo: string): Promise<MockPymtDfryInfoInqItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.pymtDfryInfoInqs)
    return apiClient.post<MockPymtDfryInfoInqItem[], MockPymtDfryInfoInqItem[]>(
      '/cts/ct/ctrtInfo/selectPymtDfryInfoInq.do',
      { ctrtNo },
    )
  },

  /**
   * no.330 계약진행상태코드조회 — MUI-CT-01-P17 (cmdtyElctrCtrtPrgrsDtl/CtrtPrgrsSttsInqFullPopup).
   * 계약체결 진행 이력. 구 `selectCtrtPrgrsStts`.
   */
  async selectCtrtPrgrsSttsCdInq(id: string): Promise<MockCtrtPrgrsStts[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtPrgrsStts)
    return apiClient.post<MockCtrtPrgrsStts[], MockCtrtPrgrsStts[]>(
      '/cts/ct/ctrtInfo/selectCtrtPrgrsSttsCdInq.do',
      ctrtKey(id),
    )
  },

  // ── 국외전자계약진행상세 (MUI-CT-01-M71) ──────────────────────────────────

  /**
   * no.335 계약서상세조회(국외) — MUI-CT-01-M71/T71 (ovsElctrCtrtPrgrsDtl/OvsElctrCtrtPrgrsDtlPage).
   * 구 `selectOvsCtrtDtl`.
   */
  async selectCtrdocDtl(id: string): Promise<MockOvsElctrCtrtDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsElctrCtrtDtl)
    return apiClient.post<MockOvsElctrCtrtDtl, MockOvsElctrCtrtDtl>(
      '/cts/ct/ovsElctrCtrt/selectCtrdocDtl.do',
      ctrtKey(id),
    )
  },

  /** no.339 계좌정보조회 — MUI-CT-01-T72 (ovsElctrCtrtPrgrsDtl/OvsBacntInfoTab). 구 `selectOvsBacntInfo`. */
  async selectBacntInfo(id: string): Promise<MockOvsBacntInfo> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsBacntInfo)
    return apiClient.post<MockOvsBacntInfo, MockOvsBacntInfo>(
      '/cts/ct/ovsElctrCtrt/selectBacntInfo.do',
      ctrtKey(id),
    )
  },

  /**
   * no.341 보증서조회 — MUI-CT-01-T73 (ovsElctrCtrtPrgrsDtl/OvsWtgrTab).
   * 데이터영역은 국내 보증서 확인팝업(M73)과 동일하나 컨트롤러가 달라 함수 분리(국내는 selectCtrtGrntes).
   */
  async selectWtgr(id: string): Promise<MockCtrtGrnteResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtGrntes)
    return apiClient.post<MockCtrtGrnteResult, MockCtrtGrnteResult>(
      '/cts/ct/ovsElctrCtrt/selectWtgr.do',
      ctrtKey(id),
    )
  },

  /**
   * no.343 보증서상세목록조회 — 국외 보증서 드릴다운. 소비처 대기(파일 상단 ⚠️).
   * 현재는 no.341 응답의 wtgrInfos 가 탭에 그대로 표시된다 — 분리 확인 시 OvsWtgrTab 을 이 함수로 전환.
   */
  async selectWtgrDtlList(id: string): Promise<MockCtrtGrnteInfo[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtGrntes.wtgrInfos)
    return apiClient.post<MockCtrtGrnteInfo[], MockCtrtGrnteInfo[]>(
      '/cts/ct/ovsElctrCtrt/selectWtgrDtlList.do',
      ctrtKey(id),
    )
  },

  /**
   * no.345 인지세납부목록조회 — MUI-CT-01-T74 (ovsElctrCtrtPrgrsDtl/OvsStmtxTab).
   * 데이터영역은 국내 인지세 확인팝업(M74)과 동일하나 컨트롤러가 달라 함수 분리(국내는 selectCtrtStmtx).
   */
  async selectStmtxPayList(id: string): Promise<MockCtrtStmtxResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtStmtx)
    return apiClient.post<MockCtrtStmtxResult, MockCtrtStmtxResult>(
      '/cts/ct/ovsElctrCtrt/selectStmtxPayList.do',
      ctrtKey(id),
    )
  },

  /** no.347 계약명세서목록조회 — MUI-CT-01-T75 (ovsElctrCtrtPrgrsDtl/OvsCtrtDtstTab). 구 `selectOvsCtrtDtst`. */
  async selectCtrtDtstList(id: string): Promise<MockOvsCtrtDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCtrtDtst)
    return apiClient.post<MockOvsCtrtDtstResult, MockOvsCtrtDtstResult>(
      '/cts/ct/ovsElctrCtrt/selectCtrtDtstList.do',
      ctrtKey(id),
    )
  },

  /**
   * no.350 계약서류목록조회 — MUI-CT-01-T76
   * (ovsElctrCtrtPrgrsDtl/OvsElctrCtrtPrgrsDtlTab_Adoc). 계약관/계약업체 + 직인등록정보.
   * 구 `selectOvsCtrtAdocs`.
   */
  async selectCtrtDcmntList(id: string): Promise<MockOvsCtrtAdocResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCtrtAdocs)
    return apiClient.post<MockOvsCtrtAdocResult, MockOvsCtrtAdocResult>(
      '/cts/ct/ovsElctrCtrt/selectCtrtDcmntList.do',
      ctrtKey(id),
    )
  },

  /**
   * no.334 진행상태목록조회(국외) — 소비처 대기(파일 상단 ⚠️).
   * 국내 P17(계약진행상태)에 대응하나 국외 상세에는 해당 팝업/탭이 없다. 반환 타입은 국내와 동일 가정.
   */
  async selectPrgrsSttsList(id: string): Promise<MockCtrtPrgrsStts[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ctrtPrgrsStts)
    return apiClient.post<MockCtrtPrgrsStts[], MockCtrtPrgrsStts[]>(
      '/cts/ct/ovsElctrCtrt/selectPrgrsSttsList.do',
      ctrtKey(id),
    )
  },

  // ── 상업계약서상세 (MUI-CT-01-M77) ────────────────────────────────────────

  /**
   * no.352 상업계약서상세정보조회 — MUI-CT-01-M77/T77 (ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtlPage).
   * 구 `selectOvsCmbzCtrdocDtl`.
   */
  async selectCmbzCtrdocDtlInfo(id: string): Promise<MockOvsCmbzCtrdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCmbzCtrdocDtl)
    return apiClient.post<MockOvsCmbzCtrdocDtl, MockOvsCmbzCtrdocDtl>(
      '/cts/ct/ovsElctrCtrt/selectCmbzCtrdocDtlInfo.do',
      ctrtKey(id),
    )
  },

  /**
   * no.353 상업계약명세서정보조회 — MUI-CT-01-T78 (ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtl_Ctrt).
   * GRAND-TOTAL + 그룹 목록. 구 `selectOvsCmbzDtst`.
   */
  async selectCmbzCtrtDtstInfo(id: string): Promise<MockOvsCmbzDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCmbzDtst)
    return apiClient.post<MockOvsCmbzDtstResult, MockOvsCmbzDtstResult>(
      '/cts/ct/ovsElctrCtrt/selectCmbzCtrtDtstInfo.do',
      ctrtKey(id),
    )
  },

  /**
   * 상업계약서 계약대상 조회 — MUI-CT-01-T79 (ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtl_Trgt).
   * TODO(백엔드 확정): no.352 공유(상세정보 응답의 일부일 가능성 — 분리 확인 시 URL 교체).
   */
  async selectOvsCmbzTrgt(id: string): Promise<MockOvsCmbzTrgt> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCmbzTrgt)
    return apiClient.post<MockOvsCmbzTrgt, MockOvsCmbzTrgt>(
      '/cts/ct/ovsElctrCtrt/selectCmbzCtrdocDtlInfo.do',
      ctrtKey(id),
    )
  },

  /**
   * 상업계약서명세서 조회 — MUI-CT-01-P78 (ovsCmbzCtrdocDtl/OvsCmbzCtrtDtst). 그룹별 품목 상세.
   * TODO(백엔드 확정): no.353 공유 — T78(그룹 목록)과 반환 타입이 달라 함수 분리.
   */
  async selectOvsCmbzCtrtDtst(id: string): Promise<MockOvsCmbzCtrtDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.ovsCmbzCtrtDtst)
    return apiClient.post<MockOvsCmbzCtrtDtstResult, MockOvsCmbzCtrtDtstResult>(
      '/cts/ct/ovsElctrCtrt/selectCmbzCtrtDtstInfo.do',
      ctrtKey(id),
    )
  },

  // ── 해지/해제 계열 (MUI-CT-03) ────────────────────────────────────────────

  /**
   * no.361 계약해지해제목록조회 — MUI-CT-03-M01 (ctrtCncltnRmvList/CtrtCncltnRmvListPage).
   * 키워드/페이징은 페이지 클라이언트 로직 소관. 구 `selectCncltnRmvList`.
   */
  async selectCtrtCncltnRmvListInq(req: MockCncltnRmvListRequest = {}): Promise<MockCncltnRmvListResult> {
    if (USE_MOCK) {
      const list = MOCK_CT.cncltnRmvList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<MockCncltnRmvListResult, MockCncltnRmvListResult>(
      '/cts/ct/ctrtCncltnRmv/selectCtrtCncltnRmvListInq.do',
      req,
    )
  },

  /**
   * no.362 계약해지해제상세정보조회 — MUI-CT-03-M02/T01
   * (cmdtyCtrtCncltnRmvDtl/CmdtyCtrtCncltnRmvDtl_Cn). 해지/해제 상세는 계약 유형별 화면이 이 API 를 공유한다
   * (파일 상단 ⚠️) — 물품이 대표 소비처. 구 `selectCmdtyCncltnRmvDtl`.
   */
  async selectCtrtCncltnRmvDtlInfoInq(id: string): Promise<MockCmdtyCncltnRmvDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCncltnRmvDtl)
    return apiClient.post<MockCmdtyCncltnRmvDtl, MockCmdtyCncltnRmvDtl>(
      '/cts/ct/ctrtCncltnRmv/selectCtrtCncltnRmvDtlInfoInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 물품 해지/해제 계약업체 조회 — MUI-CT-03-T02
   * (cmdtyCtrtCncltnRmvDtl/CmdtyCtrtCncltnRmvDtl_Artcl). 여러 업체 반복.
   * TODO(백엔드 확정): no.362 공유 — 상세 응답에 포함되면 selectCtrtCncltnRmvDtlInfoInq 반환값에서 읽도록 통합.
   */
  async selectCmdtyCncltnRmvBzentys(id: string): Promise<MockCtrtBzenty[]> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCncltnRmvBzentys)
    return apiClient.post<MockCtrtBzenty[], MockCtrtBzenty[]>(
      '/cts/ct/ctrtCncltnRmv/selectCtrtCncltnRmvDtlInfoInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 해지/해제 정보(통보내용+참조서류) 조회 — MUI-CT-03-T03
   * (cmdtyCtrtCncltnRmvDtl/CmdtyCtrtCncltnRmvDtl_SpclCnd). 통보내용(반복) + 참조서류.
   * TODO(백엔드 확정): no.362 공유(T02 와 동일 사유).
   */
  async selectCmdtyCncltnRmvNoti(id: string): Promise<MockCncltnRmvNotiResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cmdtyCncltnRmvNoti)
    return apiClient.post<MockCncltnRmvNotiResult, MockCncltnRmvNotiResult>(
      '/cts/ct/ctrtCncltnRmv/selectCtrtCncltnRmvDtlInfoInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 해지/해제 일반계약(총액 gramt / 단가 untprc) 상세정보 조회 — MUI-CT-03-M03/M04
   * (cncltnRmvGnrlCtrt*Dtl/*_Cn).
   * TODO(백엔드 확정): no.362 공유 — 총액/단가는 계약 자체의 유형이라 body 구분값 없이 호출(type 은 목업 선택용).
   */
  async selectCncltnRmvGnrlCtrtDtl(id: string, type: MockCtCtrdocType): Promise<MockCncltnRmvGnrlCtrtDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cncltnRmvGnrlCtrtDtls[type])
    return apiClient.post<MockCncltnRmvGnrlCtrtDtl, MockCncltnRmvGnrlCtrtDtl>(
      '/cts/ct/ctrtCncltnRmv/selectCtrtCncltnRmvDtlInfoInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 해지/해제 일반계약 계약명세서 조회 — MUI-CT-03-T05/T08 (cncltnRmvGnrlCtrt*Dtl/*_Artcl).
   * 예산구분 그룹별 품목(MockCmdtyCtrdocDtstResult 재사용).
   * TODO(백엔드 확정): 명세서는 해지/해제 여부와 무관하다고 보아 no.327 계약명세서조회 공유.
   */
  async selectCncltnRmvGnrlCtrtDtst(
    id: string,
    type: MockCtCtrdocType,
  ): Promise<MockCmdtyCtrdocDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cncltnRmvGnrlCtrtDtsts[type])
    return apiClient.post<MockCmdtyCtrdocDtstResult, MockCmdtyCtrdocDtstResult>(
      '/cts/ct/ctrtInfo/selectCtrtDtstInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 해지/해제 특수조건 조회 — MUI-CT-03-T06/T09/T12 (cncltnRmv*Dtl/*_Spcl).
   * TODO(백엔드 확정): no.362 공유(T02 와 동일 사유).
   */
  async selectCncltnRmvSpcl(id: string): Promise<MockCtrtSpclCnd> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cncltnRmvSpcl)
    return apiClient.post<MockCtrtSpclCnd, MockCtrtSpclCnd>(
      '/cts/ct/ctrtCncltnRmv/selectCtrtCncltnRmvDtlInfoInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 해지/해제 수정계약 상세정보 조회 — MUI-CT-03-M05/T10
   * (cncltnRmvMdfcnCtrtDtl/CncltnRmvMdfcnCtrtDtl_Cn). TODO(백엔드 확정): no.362 공유(M03/M04 와 동일 사유).
   */
  async selectCncltnRmvMdfcnCtrtDtl(id: string): Promise<MockCncltnRmvMdfcnCtrtDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cncltnRmvMdfcnCtrtDtl)
    return apiClient.post<MockCncltnRmvMdfcnCtrtDtl, MockCncltnRmvMdfcnCtrtDtl>(
      '/cts/ct/ctrtCncltnRmv/selectCtrtCncltnRmvDtlInfoInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 해지/해제 수정계약 계약명세서 조회 — MUI-CT-03-T11
   * (cncltnRmvMdfcnCtrtDtl/CncltnRmvMdfcnCtrtDtl_Ctrt). MockCmdtyMdfcnCtrdocDtstResult 재사용.
   * TODO(백엔드 확정): no.327 공유(T05/T08 과 동일 사유).
   */
  async selectCncltnRmvMdfcnCtrtDtst(id: string): Promise<MockCmdtyMdfcnCtrdocDtstResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cncltnRmvMdfcnCtrtDtst)
    return apiClient.post<MockCmdtyMdfcnCtrdocDtstResult, MockCmdtyMdfcnCtrdocDtstResult>(
      '/cts/ct/ctrtInfo/selectCtrtDtstInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 해지/해제 공사계약 상세정보 조회 — MUI-CT-03-M06/T13
   * (cstrnCtrtCncltnRmvDtl/CstrnCtrtCncltnRmvDtl_Cn). TODO(백엔드 확정): no.362 공유(M03/M04 와 동일 사유).
   */
  async selectCstrnCncltnRmvDtl(id: string): Promise<MockCstrnCncltnRmvDtl> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cstrnCncltnRmvDtl)
    return apiClient.post<MockCstrnCncltnRmvDtl, MockCstrnCncltnRmvDtl>(
      '/cts/ct/ctrtCncltnRmv/selectCtrtCncltnRmvDtlInfoInq.do',
      ctrtKey(id),
    )
  },

  /**
   * 해지/해제 공사계약 첨부서류 조회 — MUI-CT-03-T14
   * (cstrnCtrtCncltnRmvDtl/CstrnCtrtCncltnRmvDtl_Adoc). 해지해제/계약업체 2섹션(MockCtrtAdocResult 재사용).
   * TODO(백엔드 확정): no.362 공유(T02 와 동일 사유).
   */
  async selectCstrnCncltnRmvAdocs(id: string): Promise<MockCtrtAdocResult> {
    if (USE_MOCK) return mockDelay(MOCK_CT.cstrnCncltnRmvAdocs)
    return apiClient.post<MockCtrtAdocResult, MockCtrtAdocResult>(
      '/cts/ct/ctrtCncltnRmv/selectCtrtCncltnRmvDtlInfoInq.do',
      ctrtKey(id),
    )
  },
}
