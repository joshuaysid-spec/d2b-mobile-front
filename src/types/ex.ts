// 이행(EX) 도메인 타입 — 설계서 04.이행-모바일 v0.83 항목설명(항목명 영문) 그대로.
// 화면별 섹션 주석으로 구분(도메인당 1파일 원칙 — CLAUDE.md "타입 정의").

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-M01 검사통합목록 (slide10~12) — inspIntgListInq/InspIntgListInqPage
// ────────────────────────────────────────────────────────────────────────────

/** 검사통합목록 검색조건 (dml_InspIntgListSrchCnd, slide12 1.1) — 서버 필터 전환 시 사용. */
export interface InspIntgListRequest {
  /** 계약시작일자 (ctrtBgngYmd, 8). */
  ctrtBgngYmd?: string
  /** 계약종료일자 (ctrtEndYmd, 8). */
  ctrtEndYmd?: string
  /** 계약번호 (ctrtNo, 11) — 계약번호검색 공통팝업(P79). */
  ctrtNo?: string
  /** 계약명 (ctrtNm, 300). */
  ctrtNm?: string
  /** 업무구분 (taskSecd) — 국내조달-물품/용역/공사, 국외조달, 전체. */
  taskSecd?: string
  /** 기성준공구분코드 (pxcndCmcnSecd, 상위코드 UB64) — 전체/기성/준공. */
  pxcndCmcnSecd?: string
}

/** 검사통합목록 1건 (dlt_InspIntgList, slide12 1.2). */
export interface InspIntgListItem {
  /** 목록 key/라우팅용 고유 식별자 — `${ctrtNo}-${ctrtCycl}` (클라 생성, 배열 인덱스 key 금지). */
  id: string
  /** 번호 — 조회결과 자료 순번 (no, 10). */
  no: number
  /** 업무구분 (taskSecd) — 물품/용역/공사. 카드 뱃지 + P10/M04 분기 구동. */
  taskSecd: string
  /** 계약일자 (ctrtYmd, 8). */
  ctrtYmd: string
  /** 계약번호 (ctrtNo, 11). */
  ctrtNo: string
  /**
   * 계약번호차수 — 카드 계약번호 표기(계약번호+차수, slide10 4-4).
   * ⚠️ dlt_InspIntgList 미정의(0629 누락 주기) — CT 도메인 항목명(ctrtCycl) 재사용, 상세설계 확정 시 대조.
   */
  ctrtCycl: string
  /** 기성차수 (pxcndCycl, 7) — 공사 건만. */
  pxcndCycl?: string
  /** 기성준공구분코드 (pxcndCmcnSecd, 상위코드 UB64) — 공사 건만(기성/준공). */
  pxcndCmcnSecd?: string
  /** 계약명 (ctrtNm, 300). */
  ctrtNm: string
  /** 계약업체명 (ctrtBzentyNm, 100). */
  ctrtBzentyNm: string
  /** 계약금액 (ctrtAmt, 17,2). */
  ctrtAmt: number
  /** 납품기성금액 (dlvgdsPxcndAmt, 17,2). */
  dlvgdsPxcndAmt?: number
  /** 검사일자 (inspYmd, 8, yyyy-mm-dd). */
  inspYmd?: string
  /**
   * 예산구분 표시레이블(전년국채/본조/당년국채, slide10 4-1) — 카드 뱃지 구동.
   * ⚠️ dlt_InspIntgList 미정의 — P10 항목명(bgtSecdNm) 재사용, 상세설계 확정 시 대조.
   */
  bgtSecdNm: string
  /**
   * 진행상태 표시레이블(저장/검사의뢰완료/검사반려/검사저장/검사완료/출납완료/조달접수/조달반려/
   * 납품조서반려/청구저장/대금청구, slide10) — 카드 뱃지 구동.
   * ⚠️ dlt_InspIntgList 미정의 — P11 항목명(dlvdocPrgrsStcd, 상위코드 GTSA0003) 재사용.
   */
  dlvdocPrgrsStcd: string
}

export interface InspIntgListResult {
  list: InspIntgListItem[]
  total: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-P10 납품통지목록 (slide13, 15) — inspIntgListInq/DlvgdsAvtsmtListFullPopup
// ────────────────────────────────────────────────────────────────────────────

/** 납품통지목록 1건 (dmt_dlvntcList, slide15 1.2). */
export interface DlvgdsAvtsmtItem {
  /** 목록 key 용 고유 식별자 — `${ctrtNo}-${avtsmtNo}` (클라 생성). */
  id: string
  /** 번호 (no, 10). */
  no: number
  /** 통지번호 (avtsmtNo, 3). */
  avtsmtNo: string
  /** 계약명 (ctrtNm, 300). */
  ctrtNm: string
  /** 예산구분 (bgtSecdNm, 상위코드 KB(중앙)/UZ03(부대)). */
  bgtSecdNm: string
  /** 계약수량 (ctrtQty, 15,2). */
  ctrtQty: number
  /** 작성수량 (wrtQty, 15,2). */
  wrtQty: number
  /** 납품완료수량 (dlvgdsCmptnQty, 15,2). */
  dlvgdsCmptnQty: number
  /** 계약금액 (ctrtAmt, 17,2). */
  ctrtAmt: number
  /**
   * 계약단가 — 카드 표시항목(slide13 목업).
   * ⚠️ dmt_dlvntcList 미정의 — 임시 항목명(ctrtUprc), 상세설계 확정 시 대조.
   */
  ctrtUprc: number
  /** 납기일자 (dudtYmd, 8, yyyy-mm-dd). */
  dudtYmd: string
  /** 납지명 (plcdlvNm, 200). */
  plcdlvNm: string
  /**
   * 업무구분 표시레이블(물품/용역, slide13 목업 뱃지) —
   * ⚠️ dmt_dlvntcList 미정의 — M01 항목명(taskSecd) 재사용.
   */
  taskSecd: string
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-P11 검사및납품조서목록 (slide14~16) — inspIntgListInq/InspDlvdocList (바텀시트 콘텐츠)
// ────────────────────────────────────────────────────────────────────────────

/** 검사및납품조서목록 1건 (dlt_InspDlvdocList, slide15 1.3 + slide16 계속). */
export interface InspDlvdocItem {
  /** 목록 key/상세 라우팅용 고유 식별자 — `${recrdPblcnNo}` (조서발행번호 고유). */
  id: string
  /** 번호 (no, 10). */
  no: number
  /** 계약차수 (ctrtCycl, 7). */
  ctrtCycl: string
  /** 조서발행번호 (recrdPblcnNo, 20) — 예: M2025MST000200-0001. */
  recrdPblcnNo: string
  /** 예산구분코드명 (bgtSecdNm, 상위코드 KB). */
  bgtSecdNm: string
  /** 납품금액 (dlvgdsAmt, 17,2). */
  dlvgdsAmt: number
  /** 작성수량 (wrtQty, 15,2). */
  wrtQty: number
  /** 납품조서진행상태코드 (dlvdocPrgrsStcd, 2, 상위코드 GTSA0003) — 진행상태 뱃지. */
  dlvdocPrgrsStcd: string
  /** 납지명 (plcdlvNm, 200). */
  plcdlvNm: string
  /** 지체일수 (arrsDayCnt, 7). */
  arrsDayCnt: number
  /** 지체상금 (lqdmg, 17,2). */
  lqdmg: number
  /**
   * 업무구분 표시레이블(물품 등, slide14 목업 뱃지) — ⚠️ dlt_InspDlvdocList 미정의, M01 항목명 재사용.
   */
  taskSecd: string
  /**
   * 부대조달 여부 — 카드 클릭 시 중앙조달(M02)/부대조달(M03) 상세 분기 + '부대' 뱃지(slide14).
   * ⚠️ 설계서 분기 조건 항목 미정의(BD 진행상태 선례 패턴, 임시 키) — 상세설계 확정 시 교체.
   */
  sbsdPrcmYn: 'Y' | 'N'
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-M02 검사및납품조서상세(중앙조달) (slide17~20) — inspDlvdocDtl/InspDlvdocDtlPage
//   탭: T01 상세정보(InspDlvdocDtl) · T02 물품목록(InspDlvdocDtl_CmdtyList)
// ────────────────────────────────────────────────────────────────────────────

/** 검사및납품조서상세 — 계약정보(dmt_CtrtInfo, slide20 1.1) + 비고(dmt_Rmrk) + 요약 표시항목. */
export interface InspDlvdocDtl {
  /** 계약번호 (ctrtNo, 11). */
  ctrtNo: string
  /** 계약번호차수 — 문서정보 표기(계약번호 (차수), slide17 1-2). ⚠️ dmt_CtrtInfo 미정의(CT 선례 재사용). */
  ctrtCycl: string
  /** 통지번호 (avtsmtNo, 3). */
  avtsmtNo: string
  /** 예산구분코드명 (bgtSecdNm, 상위코드 KB). */
  bgtSecdNm: string
  /** 납기 (dudtYmd, 8) — ⚠️ 화면 목업(slide17)은 기간(시작~종료) 표기, 항목설명은 단일 일자(상세설계 확정 필요). */
  dudtYmd: string
  /** 납지명 (plcdlvNm, 200). */
  plcdlvNm: string
  /**
   * 납품요구일시 — 화면 표시항목(slide17 계약 상세정보, 예: 2026-10-15 08:00).
   * ⚠️ dmt_CtrtInfo 미정의 — 임시 항목명(dlvgdsDmndDt), 상세설계 확정 시 대조.
   */
  dlvgdsDmndDt: string
  /** 비고 (rmrkCn, 4000, dmt_Rmrk). */
  rmrkCn: string
  // ── 요약(SummaryInfo)·뱃지 표시항목 — 목록(M01) 항목명 재사용(slide17 타이틀 영역) ──
  /** 업무구분 뱃지 (taskSecd). */
  taskSecd: string
  /** 진행상태 뱃지 (dlvdocPrgrsStcd, 상위코드 GTSA0003). */
  dlvdocPrgrsStcd: string
  /** 계약명 (ctrtNm, 300) — 문서 제목(2줄 말줄임). */
  ctrtNm: string
  /** 계약일자 (ctrtYmd, 8). */
  ctrtYmd: string
  /** 계약금액 (ctrtAmt, 17,2). */
  ctrtAmt: number
}

/** 물품목록 1건 (dlt_CmdtyList, slide20 1.2). */
export interface InspDlvdocCmdtyItem {
  /** 목록 key 용 고유 식별자 — `${prcmRqtNo}-${invtNo}` (클라 생성). */
  id: string
  /** 조달요구번호 (prcmRqtNo, 15). */
  prcmRqtNo: string
  /** 재고번호 (invtNo, 9). */
  invtNo: string
  /** 품목명 (itemNm, 200). */
  itemNm: string
  /** 단위코드 (unitCd, 2). */
  unitCd: string
  /** 계약수량 (ctrtQty, 15,2). */
  ctrtQty: number
  /** 기 작성수량 — 누적 작성수량 (acmlWrtQty, 15,2). */
  acmlWrtQty: number
  /** 금번 납품수량 (tstmDlvgdsQty, 15,2) — M02 는 조회 화면이라 표시 전용. */
  tstmDlvgdsQty: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-M03 검사및납품조서상세(부대조달) (slide21~26) — inspDlvdocDtlSbsdPrcm/InspDlvdocDtlSbsdPrcmPage
//   탭: T03 상세정보(InspDlvdocDtlSbsdPrcm) · T04 물품목록(InspDlvdocDtlSbsdPrcm_CmdtyList)
// ────────────────────────────────────────────────────────────────────────────

/** 검사및납품조서상세(부대조달) — 계약정보(dmt_CtrtInfo, slide24 1.1 + slide25 1.4)
 *  + 계약자 정보(dmt_CtrtrInfo, slide24 1.2) + 요약 표시항목. */
export interface InspDlvdocDtlSbsdPrcm {
  /** 계약번호 (ctrtNo, 11). */
  ctrtNo: string
  /** 계약번호차수 — 문서정보 표기. ⚠️ dmt_CtrtInfo 미정의(CT 선례 재사용). */
  ctrtCycl: string
  /** 통지번호 (avtsmtNo, 3). */
  avtsmtNo: string
  /** 예산구분 (bgtSecdNm, 상위코드 KB). */
  bgtSecdNm: string
  /** 납품조서번호 (dlvdocNo, 17). */
  dlvdocNo: string
  /** 납기일자 (dudtYmd, 8). */
  dudtYmd: string
  /** 납지명 (plcdlvNm, 200). */
  plcdlvNm: string
  /**
   * 검사희망일 — 화면 표시항목(slide22 계약 상세정보).
   * ⚠️ dmt_CtrtInfo 미정의 — 임시 항목명(inspHopeYmd), 상세설계 확정 시 대조.
   */
  inspHopeYmd: string
  /** 비고 (rmrkCn, 4000). */
  rmrkCn: string
  // ── 계약 업체 정보 (dmt_CtrtrInfo, slide24 1.2) ──
  /** 계약업체명 (ctrtBzentyNm, 100). */
  ctrtBzentyNm: string
  /** 계약업체주소 (ctrtBzentyAddr, 200). */
  ctrtBzentyAddr: string
  /** 대표자 (rprsvNm, 100). */
  rprsvNm: string
  /** 배송업체 (dlvBzentyNm, 100). */
  dlvBzentyNm: string
  // ── 이행 정보 (dmt_CtrtInfo, slide25 1.4) ──
  /** 개시일자 (strtYmd, 8). */
  strtYmd: string
  /** 검수일자 (igiYmd, 8). */
  igiYmd: string
  /** 납품일자 (dlvgdsYmd, 8). */
  dlvgdsYmd: string
  /** 출납번호 (rcpmNo, 20). */
  rcpmNo: string
  /** 합격일자 (passYmd, 8). */
  passYmd: string
  /** 기술검사기관명 (techInspInstNm, 200). */
  techInspInstNm: string
  /** 기술검사관명 (techInsptrNm, 100). */
  techInsptrNm: string
  /** 물량검사관소속명 (amtmtrInsptrOgdpNm, 100). */
  amtmtrInsptrOgdpNm: string
  /** 물량검사관명 (amtmtrInsptrNm, 100). */
  amtmtrInsptrNm: string
  /** 출납관소속명 (acofOgdpNm, 100). */
  acofOgdpNm: string
  /** 출납관명 (acofNm, 100). */
  acofNm: string
  /** 출납관전화번호 (acofTelno, 20). */
  acofTelno: string
  // ── 요약(SummaryInfo)·뱃지 표시항목 — 목록(M01) 항목명 재사용(slide21 타이틀 영역) ──
  /** 업무구분 뱃지 (taskSecd). */
  taskSecd: string
  /** 진행상태 뱃지 (dlvdocPrgrsStcd). */
  dlvdocPrgrsStcd: string
  /** 계약명 (ctrtNm, 300). */
  ctrtNm: string
  /** 계약일자 (ctrtYmd, 8). */
  ctrtYmd: string
  /** 계약금액 (ctrtAmt, 17,2). */
  ctrtAmt: number
}

/** 부대조달 물품목록 1건 (dlt_CmdtyList, slide24 1.3) — 중앙(T02)과 달리 총계약수량(tctrtQty). */
export interface InspDlvdocSbsdCmdtyItem {
  /** 목록 key 용 고유 식별자 — `${prcmRqtNo}-${invtNo}` (클라 생성). */
  id: string
  /** 조달요구번호 (prcmRqtNo, 15). */
  prcmRqtNo: string
  /** 재고번호 (invtNo, 9). */
  invtNo: string
  /** 품목명 (itemNm, 200). */
  itemNm: string
  /** 단위코드 (unitCd, 2). */
  unitCd: string
  /** 총계약수량 (tctrtQty, 15,2). */
  tctrtQty: number
  /** 기 작성수량 (acmlWrtQty, 15,2). */
  acmlWrtQty: number
  /** 금번 납품수량 (tstmDlvgdsQty, 15,2). */
  tstmDlvgdsQty: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-M04 기성및준공검사상세 (slide27~29) — pxcndCmcnInspDtl/PxcndCmcnInspDtlPage
//   단일 탭(상세정보) — M01 공사 계약 카드 클릭 시 진입.
// ────────────────────────────────────────────────────────────────────────────

/** 검사관 1명 (dmt_Insptr, slide28 1.2). */
export interface PxcndCmcnInsptr {
  /** 검사관소속명 (insptrOgdpNm, 100). */
  insptrOgdpNm: string
  /** 검사관계급명 (insptrEchlnNm, 100). */
  insptrEchlnNm: string
  /** 검사관명 (insptrNm, 100). */
  insptrNm: string
}

/** 감독관 1명 (dmt_Sprv, slide28 1.3). */
export interface PxcndCmcnSprv {
  /** 감독관소속 (sprvOgdpNm, 100). */
  sprvOgdpNm: string
  /** 감독관계급 (sprvEchlnNm, 100). */
  sprvEchlnNm: string
  /** 감독관명 (sprvNm, 100). */
  sprvNm: string
}

/** 기성및준공검사상세 — 계약정보(dmt_CtrtInfo, slide28 1.1) + 검사관/감독관 + 요약 표시항목. */
export interface PxcndCmcnInspDtl {
  /** 계약번호 (ctrtNo, 11). */
  ctrtNo: string
  /** 계약번호차수 — 문서정보 표기. ⚠️ dmt_CtrtInfo 미정의(CT 선례 재사용). */
  ctrtCycl: string
  /** 계약명 (ctrtNm, 300). */
  ctrtNm: string
  /** 계약일자 (ctrtYmd, 8). */
  ctrtYmd: string
  /** 계약금액(원) (ctrtAmt, 17,2). */
  ctrtAmt: number
  /** 기성차수 (pxcndCycl, 7). */
  pxcndCycl: string
  /** 검사구분 — 화면 표시항목(slide27). ⚠️ dmt_CtrtInfo 미정의 — M01 항목명(pxcndCmcnSecd) 재사용. */
  pxcndCmcnSecd: string
  /** 검사일자 (inspYmd, 8). */
  inspYmd: string
  /** 기성금액(원) (pxcndAmt, 17,2). */
  pxcndAmt: number
  /** 기성비율 (pxcndRt, 9,4) — % 표시. */
  pxcndRt: number
  /** 착공일자 (bgncstYmd, 8). */
  bgncstYmd: string
  /** 실준공일자 (rlccYmd, 8). */
  rlccYmd: string
  /** 준공기한 (cmcnTermYmd, 8). */
  cmcnTermYmd: string
  /** 준공계제출일자 (cmdocSbmsnYmd, 8). */
  cmdocSbmsnYmd: string
  /** 준공내용 (cmcnCn, 200). */
  cmcnCn: string
  /** 검사관 목록 (dmt_Insptr). */
  insptrs: PxcndCmcnInsptr[]
  /** 감독관 목록 (dmt_Sprv). */
  sprvs: PxcndCmcnSprv[]
  // ── 요약(SummaryInfo)·뱃지 표시항목 — 목록(M01) 항목명 재사용(slide27 타이틀 영역) ──
  /** 업무구분 뱃지 (taskSecd) — 공사. */
  taskSecd: string
  /** 예산구분 뱃지 (bgtSecdNm). */
  bgtSecdNm: string
  /** 진행상태 뱃지 (dlvdocPrgrsStcd). */
  dlvdocPrgrsStcd: string
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-M05 검사및납품조서현황목록 (slide30~33) — inspDlvdocPrst/InspDlvdocPrstPage
//   검색필터: MUI-EX-01-P09 (SearchFilter schema — 조서발행번호는 P06 공통시트).
// ────────────────────────────────────────────────────────────────────────────

/** 검사및납품조서현황 검색조건 (dml_InspDlvdocPrstSrchCnd, slide33 1.1) — 서버 필터 전환 시 사용. */
export interface InspDlvdocPrstRequest {
  /** 계약시작일자 (ctrtBgngYmd, 8). */
  ctrtBgngYmd?: string
  /** 계약종료일자 (ctrtEndYmd, 8). */
  ctrtEndYmd?: string
  /** 계약번호 (ctrtNo, 11) — 계약번호검색 공통팝업(P79). */
  ctrtNo?: string
  /** 계약명 (ctrtNm, 300). */
  ctrtNm?: string
  /** 업무구분명 (taskSeNm) — 국내조달-물품/용역/공사, 국외조달, 전체. */
  taskSeNm?: string
}

/** 검사및납품조서현황 1건 (dlt_InspDlvdocPrst, slide33 1.2). */
export interface InspDlvdocPrstItem {
  /** 목록 key/라우팅용 고유 식별자 — `${ctrtNo}-${avtsmtNo}` (클라 생성). */
  id: string
  /** 번호 (no, 10). */
  no: number
  /** 업무구분명 (taskSeNm) — 물품/용역/공사. 카드 뱃지 + 상세 분기 구동. */
  taskSeNm: string
  /** 계약번호 (11) — ⚠️ 설계서 표기는 ctrtNm(오타로 판단, 계약명과 중복)이라 ctrtNo 로 사용. */
  ctrtNo: string
  /** 계약번호차수 — 카드 계약번호 표기. ⚠️ dlt 미정의(M01 과 동일 사유). */
  ctrtCycl: string
  /** 계약명 — 카드 제목. ⚠️ dlt 미정의(카드 표시항목) — M01 항목명(ctrtNm) 재사용. */
  ctrtNm: string
  /** 통지번호 (avtsmtNo, 3). */
  avtsmtNo: string
  /** 조서발행번호 (recrdPblcnNo, 20). */
  recrdPblcnNo: string
  /** 합격일자 (passYmd, 8) — 미합격 시 빈 값('-') 표시. */
  passYmd?: string
  /** 납품일자 (dlvgdsYmd, 8) — 미납품 시 빈 값('-') 표시. */
  dlvgdsYmd?: string
  /** 납품금액 (dlvgdsAmt, 17,2). */
  dlvgdsAmt: number
  /** 납지명 (plcdlvNm, 200). */
  plcdlvNm: string
  /**
   * 납품조서진행상태코드 (dlvdocPrgrsStcd, 2) — 'E'검사의뢰완료·'IX'검사반려·'N'저장·'EY'대금청구·
   * 'IN'검사저장·'I'검사완료·'A'출납완료·'R'조달접수·'X'조달반려·'EX'납품조서반려·'EN'청구저장.
   * 목업은 표시명 문자열 사용(코드 확정 시 코드→명 매핑 전환).
   */
  dlvdocPrgrsStcd: string
  /** 계약일자 — 카드 행 표시항목. ⚠️ dlt 미정의 — M01 항목명(ctrtYmd) 재사용. */
  ctrtYmd: string
  /** 계약금액 — 카드 행 표시항목. ⚠️ dlt 미정의 — M01 항목명(ctrtAmt) 재사용. */
  ctrtAmt: number
  /** 예산구분 뱃지 — ⚠️ dlt 미정의 — bgtSecdNm 재사용. */
  bgtSecdNm: string
  /** 부대조달 여부 — 상세 분기(M03/M07) 임시 키(P11 과 동일). */
  sbsdPrcmYn: 'Y' | 'N'
}

export interface InspDlvdocPrstResult {
  list: InspDlvdocPrstItem[]
  total: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-M07 검사및납품조서결과상세 (slide36~40) — dlvdocRsltDtl/DlvdocRsltDtlPage
//   탭: T05 상세정보(DlvdocRsltDtl) · T06 물품목록(DlvdocRsltDtl_CmdtyList)
// ────────────────────────────────────────────────────────────────────────────

/** 검사및납품조서결과상세 — 계약정보(dmt_CtrtInfo, slide39 1.1) + 계약자(dmt_CtrtrInfo)
 *  + 정비조회(dmt_MtncInq) + 납품조서결과(dmt_DlvdocRslt) + 요약 표시항목. */
export interface DlvdocRsltDtl {
  /** 계약번호 (ctrtNo, 11). */
  ctrtNo: string
  /** 계약번호차수 — 문서정보 표기. ⚠️ 미정의(CT 선례 재사용). */
  ctrtCycl: string
  /** 통지번호 (avtsmtNo, 3). */
  avtsmtNo: string
  /** 예산구분명 (bgtSeNm, 상위코드: 전년국채/본조/당년국채) — ⚠️ M01 계열의 bgtSecdNm 과 표기 상이(설계서 그대로). */
  bgtSeNm: string
  /** 납품장소명 (dlvgdsPlcNm, 100). */
  dlvgdsPlcNm: string
  /** 납품기한일자 (dlvtrmYmd, 8). */
  dlvtrmYmd: string
  /** 조서발행번호 (recrdPblcnNo, 20). */
  recrdPblcnNo: string
  /** 비고 (rmrkCn, dmt_Rmrk). */
  rmrkCn: string
  // ── 계약 업체 정보 (dmt_CtrtrInfo, slide39 1.2) ──
  /** 계약업체명 (ctrtBzentyNm, 100). */
  ctrtBzentyNm: string
  /** 계약업체주소 (ctrtBzentyAddr, 200). */
  ctrtBzentyAddr: string
  /** 대표자명 (rprsvNm, 100). */
  rprsvNm: string
  /** 배송업체 (dlvBzentyNm, 100). */
  dlvBzentyNm: string
  // ── 정비 정보 (dmt_MtncInq, slide39 1.3) ──
  /** 계약정비일수 (ctrtMtncDayCnt, 7). */
  ctrtMtncDayCnt: number
  /** 실정비일수 (rlmtDayCnt, 7). */
  rlmtDayCnt: number
  /** 입고일 (wrhsYmd, 8). */
  wrhsYmd: string
  /** 정비지시일 (mtncDrctnYmd, 8). */
  mtncDrctnYmd: string
  /** 출고일자 (spmtYmd, 8). */
  spmtYmd: string
  // ── 이행 정보 (dmt_DlvdocRslt, slide40 1.6) ──
  /** 개시일자 (strtYmd, 8). */
  strtYmd: string
  /** 검수일자 (igiYmd, 8). */
  igiYmd: string
  /** 납품일자 (dlvgdsYmd, 8). */
  dlvgdsYmd: string
  /** 출납번호 (rcpmNo, 20). */
  rcpmNo: string
  /** 합격일자 (passYmd, 8). */
  passYmd: string
  /**
   * 기술검사기관~출납관전화번호 — ⚠️ slide40 1.6 의 영문 항목명 표기가 한글명과 어긋나(오타로 판단)
   * 동일 구성인 M03 이행 정보 항목명을 재사용. 상세설계 확정 시 대조.
   */
  techInspInstNm: string
  techInsptrNm: string
  amtmtrInsptrOgdpNm: string
  amtmtrInsptrNm: string
  acofOgdpNm: string
  acofNm: string
  acofTelno: string
  // ── 요약(SummaryInfo)·뱃지 표시항목 (slide36 타이틀 영역 — M05 카드와 동일 구성) ──
  taskSeNm: string
  dlvdocPrgrsStcd: string
  ctrtNm: string
  ctrtYmd: string
  ctrtAmt: number
}

/** M07 물품목록 1건 (dlt_CmdtyList, slide39 1.4) — 부대조달(T04)과 동일 구성이라 타입 재사용. */
export type DlvdocRsltCmdtyItem = InspDlvdocSbsdCmdtyItem
