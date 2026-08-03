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

// ── TODO(백엔드 확정) — 검사및납품조서 검색조건(dml_InspDlvdocSrchCnd, slide15 1.1)은
//    M05 검사및납품조서현황(그룹 5) 배선 시 요청 타입으로 추가 예정.
