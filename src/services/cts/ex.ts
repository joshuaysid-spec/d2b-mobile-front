// 이행(EX) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: exKeys.selectXxx / useSelectXxx) — 실 API 목록(no.367~398) 기준.
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로).
// 요청 body 항목명은 상세설계 대기 — 식별자는 설계서 항목명(ctrtNo/avtsmtNo/recrdPblcnNo/clmSeq/orderSeq)으로 전달.
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
//
// ⚠️ 실 API 목록 중 미배선(모바일 소비처 없음 — 반입 전 확인):
//   no.371 검사의뢰기본정보조회(selectInspRqstBscInfo) · no.372 검사의뢰납품목록조회(selectInspRqstDlvgdsList)
//     → 검사의뢰서 '상세' 화면이 모바일에 없다(P10 목록 → P11 조서목록 → M02/M03 상세로 직행).
//        응답 항목명이 설계서에 없어 임의 작명 대신 함수 미생성.
//   no.383 계약정보목록조회(selectCtrtInfoList, /cts/ex/ovsLmtamtCtrt/selectCtrtInfoList.do)
//     → 계약번호조회 공통시트(MUI-EX-02-P79, ui/biz/cm/search/OvsCtrtNoInq)의 결과목록.
//        해당 시트가 아직 인라인 목업이라 배선 시 함께 추가(api.md "미배선 페이지는 인라인 목업 유지").
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_EX } from '@/mocks/ex'
import type {
  DlvdocRsltCmdtyItem,
  DlvdocRsltDtl,
  DlvgdsAvtsmtItem,
  InspDlvdocCmdtyItem,
  InspDlvdocDtl,
  InspDlvdocDtlSbsdPrcm,
  InspDlvdocItem,
  InspDlvdocPrstRequest,
  InspDlvdocPrstResult,
  InspDlvdocSbsdCmdtyItem,
  InspIntgListRequest,
  InspIntgListResult,
  OvsEstmtNtdcDtl,
  OvsEstmtNtdcItemRow,
  OvsEstmtNtdcListResult,
  OvsEstmtRqdcDtl,
  OvsEstmtRqdcItemRow,
  OvsEstmtRqdcListRequest,
  OvsEstmtRqdcListResult,
  OvsOrderNtdcDtl,
  OvsOrderNtdcItemRow,
  OvsOrderNtdcListResult,
  OvsOrderRqdcDtl,
  OvsOrderRqdcItemRow,
  OvsOrderRqdcListRequest,
  OvsOrderRqdcListResult,
  PxcndCmcnInspDtl,
  PxcndCmcnInsptr,
  PxcndCmcnSprv,
} from '@/types/mock/ex'

export const exService = {
  // ── 검사통합목록 (MUI-EX-01-M01) ──────────────────────────────────────────

  /**
   * no.367 검사통합목록조회 — MUI-EX-01-M01 (inspIntgListInq/InspIntgListInqPage).
   * 키워드 필터/더보기 페이징은 페이지 클라이언트 로직(서버 전환 시 req 로 이행).
   */
  async selectInspIntgList(req: InspIntgListRequest = {}): Promise<InspIntgListResult> {
    if (USE_MOCK) {
      const list = MOCK_EX.inspIntgList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<InspIntgListResult, InspIntgListResult>(
      '/cts/ex/inspDlvdoc/selectInspIntgList.do',
      req,
    )
  },

  // ── 납품통지목록 (MUI-EX-01-P10) ──────────────────────────────────────────

  /**
   * no.369 검사의뢰서목록조회 — MUI-EX-01-P10 (inspIntgListInq/DlvgdsAvtsmtListFullPopup).
   * 계약번호에 물린 납품통지 목록(기간 제한 없음, slide13 On-Load).
   * TODO(백엔드 확정): 화면명은 '납품통지목록'이나 실 API 는 '검사의뢰서목록' — 같은 문서(납품통지=검사의뢰서 발행 단위)로
   *   판단해 매핑. 다른 API 면 이 함수의 URL 만 교체.
   */
  async selectInspRqstDocList(ctrtNo: string): Promise<DlvgdsAvtsmtItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.dlvgdsAvtsmtList)
    return apiClient.post<DlvgdsAvtsmtItem[], DlvgdsAvtsmtItem[]>(
      '/cts/ex/inspDlvdoc/selectInspRqstDocList.do',
      { ctrtNo },
    )
  },

  // ── 검사및납품조서목록 (MUI-EX-01-P11) ────────────────────────────────────

  /** no.370 검사및납품조서목록조회 — MUI-EX-01-P11 (inspIntgListInq/InspDlvdocList). 선택 납품통지 기준. */
  async selectInspDlvdocList(ctrtNo: string, avtsmtNo: string): Promise<InspDlvdocItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.inspDlvdocList)
    return apiClient.post<InspDlvdocItem[], InspDlvdocItem[]>(
      '/cts/ex/inspDlvdoc/selectInspDlvdocList.do',
      { ctrtNo, avtsmtNo },
    )
  },

  // ── 검사및납품조서상세(중앙조달) (MUI-EX-01-M02) ──────────────────────────

  /**
   * no.378 검사및납품조서기본정보조회 — MUI-EX-01-M02/T01 (inspDlvdocDtl/InspDlvdocDtlPage).
   * 계약정보+비고+요약(slide20). 식별자 = 조서발행번호(P11 카드의 id).
   */
  async selectInspDlvdocBscInfo(recrdPblcnNo: string): Promise<InspDlvdocDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.inspDlvdocDtl)
    return apiClient.post<InspDlvdocDtl, InspDlvdocDtl>(
      '/cts/ex/inspDlvdoc/selectInspDlvdocBscInfo.do',
      { recrdPblcnNo },
    )
  },

  /** no.379 검사및납품조서납품목록조회 — MUI-EX-01-T02 (inspDlvdocDtl/InspDlvdocDtl_CmdtyList). */
  async selectInspDlvdocDlvgdsList(recrdPblcnNo: string): Promise<InspDlvdocCmdtyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.inspDlvdocCmdtyList)
    return apiClient.post<InspDlvdocCmdtyItem[], InspDlvdocCmdtyItem[]>(
      '/cts/ex/inspDlvdoc/selectInspDlvdocDlvgdsList.do',
      { recrdPblcnNo },
    )
  },

  // ── 검사및납품조서상세(부대조달) (MUI-EX-01-M03) ──────────────────────────

  /**
   * 부대조달 상세(계약정보+업체정보+이행정보) 조회 —
   * MUI-EX-01-M03/T03 (inspDlvdocDtlSbsdPrcm/InspDlvdocDtlSbsdPrcmPage).
   * TODO(백엔드 확정): 실 API 는 중앙/부대 구분 없이 no.378 하나뿐이라 같은 URL 을 쓰되 응답 구성이 달라 함수 분리.
   *   부대조달 전용 메서드가 따로 있으면 URL 만 교체(함수명도 그때 백엔드 메서드명으로).
   */
  async selectInspDlvdocSbsdDtl(recrdPblcnNo: string): Promise<InspDlvdocDtlSbsdPrcm> {
    if (USE_MOCK) return mockDelay(MOCK_EX.inspDlvdocSbsdDtl)
    return apiClient.post<InspDlvdocDtlSbsdPrcm, InspDlvdocDtlSbsdPrcm>(
      '/cts/ex/inspDlvdoc/selectInspDlvdocBscInfo.do',
      { recrdPblcnNo },
    )
  },

  /**
   * 부대조달 물품목록 조회 — MUI-EX-01-T04 (inspDlvdocDtlSbsdPrcm/InspDlvdocDtlSbsdPrcm_CmdtyList).
   * TODO(백엔드 확정): no.379 와 같은 URL(부대조달 응답 변형) — M03 과 동일 사유.
   */
  async selectInspDlvdocSbsdCmdtys(recrdPblcnNo: string): Promise<InspDlvdocSbsdCmdtyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.inspDlvdocSbsdCmdtyList)
    return apiClient.post<InspDlvdocSbsdCmdtyItem[], InspDlvdocSbsdCmdtyItem[]>(
      '/cts/ex/inspDlvdoc/selectInspDlvdocDlvgdsList.do',
      { recrdPblcnNo },
    )
  },

  // ── 기성및준공검사상세 (MUI-EX-01-M04) ────────────────────────────────────

  /**
   * no.375 기성및준공검사기본정보조회 — MUI-EX-01-M04 (pxcndCmcnInspDtl/PxcndCmcnInspDtlPage).
   * 계약정보(slide28 1.1). 식별자 = 계약번호 + 기성차수(M01 공사 카드).
   * TODO(백엔드 확정): 검사관(no.376)·감독관(no.377)이 별도 API 라 응답에 포함되지 않을 수 있다.
   *   현재는 목업이 한 응답에 담고 페이지도 detail.insptrs/sprvs 로 읽는다 — 분리 확인 시 아래 두 함수로 배선 전환.
   */
  async selectPxcndCmcnInspBscInfo(ctrtNo: string, pxcndCycl: string): Promise<PxcndCmcnInspDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.pxcndCmcnInspDtl)
    return apiClient.post<PxcndCmcnInspDtl, PxcndCmcnInspDtl>(
      '/cts/ex/inspDlvdoc/selectPxcndCmcnInspBscInfo.do',
      { ctrtNo, pxcndCycl },
    )
  },

  /** no.376 검사관목록조회 — MUI-EX-01-M04 검사관(dmt_Insptr, slide28 1.2). 소비처 대기(위 TODO). */
  async selectInsptrList(ctrtNo: string, pxcndCycl: string): Promise<PxcndCmcnInsptr[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.pxcndCmcnInspDtl.insptrs)
    return apiClient.post<PxcndCmcnInsptr[], PxcndCmcnInsptr[]>(
      '/cts/ex/inspDlvdoc/selectInsptrList.do',
      { ctrtNo, pxcndCycl },
    )
  },

  /** no.377 감독관목록조회 — MUI-EX-01-M04 감독관(dmt_Sprv, slide28 1.3). 소비처 대기(위 TODO). */
  async selectSprvList(ctrtNo: string, pxcndCycl: string): Promise<PxcndCmcnSprv[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.pxcndCmcnInspDtl.sprvs)
    return apiClient.post<PxcndCmcnSprv[], PxcndCmcnSprv[]>(
      '/cts/ex/inspDlvdoc/selectSprvList.do',
      { ctrtNo, pxcndCycl },
    )
  },

  // ── 검사및납품조서현황목록 (MUI-EX-01-M05) ────────────────────────────────

  /**
   * no.380 검사및납품조서현황 목록조회 — MUI-EX-01-M05 (inspDlvdocPrst/InspDlvdocPrstPage).
   * 키워드 필터/더보기 페이징은 페이지 클라이언트 로직(서버 전환 시 req 로 이행).
   */
  async selectInspDlvdocPrstList(req: InspDlvdocPrstRequest = {}): Promise<InspDlvdocPrstResult> {
    if (USE_MOCK) {
      const list = MOCK_EX.inspDlvdocPrstList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<InspDlvdocPrstResult, InspDlvdocPrstResult>(
      '/cts/ex/inspDlvdoc/selectInspDlvdocPrstList.do',
      req,
    )
  },

  // ── 검사및납품조서결과상세 (MUI-EX-01-M07) ────────────────────────────────

  /**
   * 결과상세(계약정보+업체+정비+이행정보) 조회 —
   * MUI-EX-01-M07/T05 (dlvdocRsltDtl/DlvdocRsltDtlPage).
   * TODO(백엔드 확정): no.378 과 같은 URL(검사 완료 후 결과 응답 변형) — 결과 전용 메서드 확인 시 URL 교체.
   */
  async selectDlvdocRsltDtl(recrdPblcnNo: string): Promise<DlvdocRsltDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.dlvdocRsltDtl)
    return apiClient.post<DlvdocRsltDtl, DlvdocRsltDtl>(
      '/cts/ex/inspDlvdoc/selectInspDlvdocBscInfo.do',
      { recrdPblcnNo },
    )
  },

  /** 결과상세 물품목록 조회 — MUI-EX-01-T06. TODO(백엔드 확정): no.379 와 같은 URL(M07 과 동일 사유). */
  async selectDlvdocRsltCmdtys(recrdPblcnNo: string): Promise<DlvdocRsltCmdtyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.dlvdocRsltCmdtyList)
    return apiClient.post<DlvdocRsltCmdtyItem[], DlvdocRsltCmdtyItem[]>(
      '/cts/ex/inspDlvdoc/selectInspDlvdocDlvgdsList.do',
      { recrdPblcnNo },
    )
  },

  // ── 견적의뢰서 (MUI-EX-02-M71·M72) ────────────────────────────────────────

  /**
   * no.382 견적의뢰서목록조회 — MUI-EX-02-M71 (ovsEstmtRqdcList/OvsEstmtRqdcListPage).
   * On-Load: 수신일 5년전~현재(slide48).
   */
  async selectEstmtRqdcList(req: OvsEstmtRqdcListRequest = {}): Promise<OvsEstmtRqdcListResult> {
    if (USE_MOCK) {
      const list = MOCK_EX.ovsEstmtRqdcList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<OvsEstmtRqdcListResult, OvsEstmtRqdcListResult>(
      '/cts/ex/ovsLmtamtCtrt/selectEstmtRqdcList.do',
      req,
    )
  },

  /**
   * 견적의뢰서상세(계약정보) 조회 — MUI-EX-02-M72/T71 (ovsEstmtRqdcDtl/OvsEstmtRqdcDtlPage).
   * TODO(백엔드 확정): 실 API 는 no.384 견적의뢰서상세목록조회 하나뿐이라 같은 URL 을 쓰되, 헤더(계약정보)와
   *   품목목록(T72)의 반환 타입이 달라 함수 분리. 한 응답에 함께 오면 아래 selectEstmtRqdcDtlList 로 통합.
   */
  async selectOvsEstmtRqdcDtl(clmSeq: string): Promise<OvsEstmtRqdcDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsEstmtRqdcDtl)
    return apiClient.post<OvsEstmtRqdcDtl, OvsEstmtRqdcDtl>(
      '/cts/ex/ovsLmtamtCtrt/selectEstmtRqdcDtlList.do',
      { clmSeq },
    )
  },

  /** no.384 견적의뢰서상세목록조회 — MUI-EX-02-T72 (ovsEstmtRqdcDtl/OvsEstmtRqdcDtl_CmdtyList). */
  async selectEstmtRqdcDtlList(clmSeq: string): Promise<OvsEstmtRqdcItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsEstmtRqdcItems)
    return apiClient.post<OvsEstmtRqdcItemRow[], OvsEstmtRqdcItemRow[]>(
      '/cts/ex/ovsLmtamtCtrt/selectEstmtRqdcDtlList.do',
      { clmSeq },
    )
  },

  // ── 견적통보서 (MUI-EX-02-M73·M74) ────────────────────────────────────────

  /**
   * no.388 견적통보서목록조회 — MUI-EX-02-M73 (ovsEstmtNtdcList/OvsEstmtNtdcListPage).
   * 상단 계약정보 + 연계 견적통보 목록.
   * TODO(백엔드 확정): 상단 계약정보(dm_ctrtInfo)가 이 응답에 포함되는지 — 별도면 no.383 계약정보목록조회 소관.
   */
  async selectEstmtNtdcList(ctrtNo?: string): Promise<OvsEstmtNtdcListResult> {
    if (USE_MOCK) {
      const list = MOCK_EX.ovsEstmtNtdcList
      return mockDelay({ ctrtInfo: MOCK_EX.ovsEstmtNtdcCtrtInfo, list, total: list.length })
    }
    return apiClient.post<OvsEstmtNtdcListResult, OvsEstmtNtdcListResult>(
      '/cts/ex/ovsLmtamtCtrt/selectEstmtNtdcList.do',
      { ctrtNo },
    )
  },

  /**
   * 견적통보서상세(계약정보+품목수) 조회 — MUI-EX-02-M74/T73 (ovsEstmtNtdcDtl/OvsEstmtNtdcDtlPage).
   * TODO(백엔드 확정): no.390 과 같은 URL — M72 헤더와 동일 사유(헤더/품목 분리 여부 미확정).
   */
  async selectOvsEstmtNtdcDtl(clmSeq: string): Promise<OvsEstmtNtdcDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsEstmtNtdcDtl)
    return apiClient.post<OvsEstmtNtdcDtl, OvsEstmtNtdcDtl>(
      '/cts/ex/ovsLmtamtCtrt/selectEstmtNtdcDtlList.do',
      { clmSeq },
    )
  },

  /** no.390 견적통보서상세목록조회 — MUI-EX-02-T74 (ovsEstmtNtdcDtl/OvsEstmtNtdcDtl_CmdtyList). */
  async selectEstmtNtdcDtlList(clmSeq: string): Promise<OvsEstmtNtdcItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsEstmtNtdcItems)
    return apiClient.post<OvsEstmtNtdcItemRow[], OvsEstmtNtdcItemRow[]>(
      '/cts/ex/ovsLmtamtCtrt/selectEstmtNtdcDtlList.do',
      { clmSeq },
    )
  },

  // ── 발주의뢰서 (MUI-EX-02-M75·M76) ────────────────────────────────────────

  /**
   * no.391 발주의뢰서목록조회 — MUI-EX-02-M75 (ovsOrderRqdcList/OvsOrderRqdcListPage).
   * On-Load: 수신일 5년전~현재(slide67).
   */
  async selectOrderRqdcList(req: OvsOrderRqdcListRequest = {}): Promise<OvsOrderRqdcListResult> {
    if (USE_MOCK) {
      const list = MOCK_EX.ovsOrderRqdcList
      return mockDelay({ list, total: list.length })
    }
    return apiClient.post<OvsOrderRqdcListResult, OvsOrderRqdcListResult>(
      '/cts/ex/ovsLmtamtCtrt/selectOrderRqdcList.do',
      req,
    )
  },

  /**
   * 발주의뢰서상세(계약정보) 조회 — MUI-EX-02-M76/T75 (ovsOrderRqdcDtl/OvsOrderRqdcDtlPage).
   * TODO(백엔드 확정): no.393 과 같은 URL — M72 헤더와 동일 사유.
   */
  async selectOvsOrderRqdcDtl(orderSeq: string): Promise<OvsOrderRqdcDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsOrderRqdcDtl)
    return apiClient.post<OvsOrderRqdcDtl, OvsOrderRqdcDtl>(
      '/cts/ex/ovsLmtamtCtrt/selectOrderRqdcDtlList.do',
      { orderSeq },
    )
  },

  /** no.393 발주의뢰서상세목록조회 — MUI-EX-02-T76 (ovsOrderRqdcDtl/OvsOrderRqdcDtl_CmdtyList). */
  async selectOrderRqdcDtlList(orderSeq: string): Promise<OvsOrderRqdcItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsOrderRqdcItems)
    return apiClient.post<OvsOrderRqdcItemRow[], OvsOrderRqdcItemRow[]>(
      '/cts/ex/ovsLmtamtCtrt/selectOrderRqdcDtlList.do',
      { orderSeq },
    )
  },

  // ── 발주통보서 (MUI-EX-02-M77·M78) ────────────────────────────────────────

  /**
   * no.396 발주통보서목록조회 — MUI-EX-02-M77 (ovsOrderNtdcList/OvsOrderNtdcListPage).
   * 상단 계약정보 + 목록. TODO(백엔드 확정): 계약정보 포함 여부는 no.388 과 동일 사유.
   */
  async selectOrderNtdcList(ctrtNo?: string): Promise<OvsOrderNtdcListResult> {
    if (USE_MOCK) {
      const list = MOCK_EX.ovsOrderNtdcList
      return mockDelay({ ctrtInfo: MOCK_EX.ovsEstmtNtdcCtrtInfo, list, total: list.length })
    }
    return apiClient.post<OvsOrderNtdcListResult, OvsOrderNtdcListResult>(
      '/cts/ex/ovsLmtamtCtrt/selectOrderNtdcList.do',
      { ctrtNo },
    )
  },

  /**
   * 발주통보서상세(계약정보+품목수) 조회 — MUI-EX-02-M78/T77 (ovsOrderNtdcDtl/OvsOrderNtdcDtlPage).
   * TODO(백엔드 확정): no.398 과 같은 URL — M72 헤더와 동일 사유.
   */
  async selectOvsOrderNtdcDtl(orderSeq: string): Promise<OvsOrderNtdcDtl> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsOrderNtdcDtl)
    return apiClient.post<OvsOrderNtdcDtl, OvsOrderNtdcDtl>(
      '/cts/ex/ovsLmtamtCtrt/selectOrderNtdcDtlList.do',
      { orderSeq },
    )
  },

  /** no.398 발주통보서상세목록조회 — MUI-EX-02-T78 (ovsOrderNtdcDtl/OvsOrderNtdcDtl_CmdtyList). */
  async selectOrderNtdcDtlList(orderSeq: string): Promise<OvsOrderNtdcItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_EX.ovsOrderNtdcItems)
    return apiClient.post<OvsOrderNtdcItemRow[], OvsOrderNtdcItemRow[]>(
      '/cts/ex/ovsLmtamtCtrt/selectOrderNtdcDtlList.do',
      { orderSeq },
    )
  },
}
