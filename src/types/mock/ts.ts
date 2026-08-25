// 업무지원(TS) 도메인 타입 — 설계서 06.업무지원-모바일 v0.82 항목설명(항목명 영문) 그대로.
// 화면별 섹션 주석으로 구분(도메인당 1파일 원칙 — CLAUDE.md "타입 정의").

// ────────────────────────────────────────────────────────────────────────────
// MUI-TS-01-M01 사전의향서목록 (slide9~11) — bfhdLoiList/BfhdLoiListPage
//   검색필터: MUI-TS-01-P04 (SearchFilter schema — 접수기간 월 단위, 2026-07-24 화면수정).
// ────────────────────────────────────────────────────────────────────────────

/** 사전의향서목록 검색조건 (slide11 1.1) — On-Load: 접수기간 현재일자. */
export interface MockBfhdLoiListRequest {
  /** 접수기간(FROM) (rcptYmdFr, 8). */
  rcptYmdFr?: string
  /** 접수기간(TO) (rcptYmdTo, 8). */
  rcptYmdTo?: string
  /** 제목 (bfhdLoiTtl, 256). */
  bfhdLoiTtl?: string
  /** 재고번호 (mdfcnInvtNo, 13). */
  mdfcnInvtNo?: string
  /** 발주부서 (deptCd, 16) — 부서검색 공통팝업(DeptInq). */
  deptCd?: string
  /** 담당자 (userNm, 100). */
  userNm?: string
}

/** 사전의향서목록 1건 (slide11 1.2). */
export interface MockBfhdLoiItem {
  /** 목록 key/상세 라우팅용 고유 식별자 — 사전의향서 번호(bfhdLoiNo, slide16 1.1) 사용. */
  id: string
  /** 순번 (no, 20). */
  no: number
  /** 접수일자 (rcptYmd, 16) — 기간 표기(yyyy-mm-dd ~ yyyy-mm-dd). */
  rcptYmd: string
  /** 제목 (bfhdLoiTtl, 256) — 카드 제목(2줄 말줄임). */
  bfhdLoiTtl: string
  /**
   * 진행상태 (prgrsStcd, 3) — 제출/미제출/빈값(slide9: 빈값=임시저장·제출 전, 미제출=임시저장,
   * 제출=제출 완료·수정 불가). 빈값이면 뱃지 미노출.
   */
  prgrsStcd: string
  /** 발주부서 (deptCd, 상위코드 RIC) — 표시명. */
  deptCd: string
  /** 담당자 (userNm, 100). */
  userNm: string
}

export interface MockBfhdLoiListResult {
  list: MockBfhdLoiItem[]
  total: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-TS-01-M02 사전의향서상세 (slide12~17) — bfhdLoiDtl/BfhdLoiDtlPage
//   탭: T01 상세내용(MockBfhdLoiDtl) · T02 품목명세서(BfhdLoiDtl_ItemList) · P03 의견작성(BfhdLoiWrt).
// ────────────────────────────────────────────────────────────────────────────

/** 사전의향서상세 — 집행계획(slide16 1.2) + 문의처(1.3) + 요약 표시항목. */
export interface MockBfhdLoiDtl {
  /** 사전의향서 번호 (bfhdLoiNo, 14). */
  bfhdLoiNo: string
  // ── 집행계획 (slide16 1.2) ──
  /** 제목 (bfhdLoiTtl, 256). */
  bfhdLoiTtl: string
  /** 접수시작일 (rcptBgngYmd, 8). */
  rcptBgngYmd: string
  /** 접수종료일 (rcptEndYmd, 8). */
  rcptEndYmd: string
  // ── 문의처 (slide16 1.3) ──
  /** 부서명 (deptCd, 상위코드 RIC) — 표시명. */
  deptCd: string
  /** 담당자 (userNm, 100). */
  userNm: string
  /** 연락처 (telNum, 20) — 복수 표기 가능(slide13 목업: 유선/휴대). */
  telNum: string
  // ── 요약(SummaryInfo)·뱃지 표시항목 (slide12 타이틀 영역) ──
  /** 진행상태 뱃지 (prgrsStcd) — 제출/미제출/빈값. */
  prgrsStcd: string
  /**
   * 접수만료 여부 — '만료' 뱃지(slide12)·의견작성 입력폼 미노출(slide14: 제출 기간 경과 시) 구동.
   * ⚠️ 항목설명 미정의 임시 키(expryYn) — 상세설계 확정 시 교체.
   */
  expryYn: 'Y' | 'N'
}

/** 품목명세서 1건 (물품명세서 목록, slide17 1.4). */
export interface MockBfhdLoiSpcfctItem {
  /** 목록 key — `${prcmRqtNo}-${no}` (클라 생성). */
  id: string
  /** 순번 (no, 20). */
  no: number
  /** 제조/구매 (mnftrPrchsSecd, 1) — 제조/구매/의견작성 선택값. 빈값=미선택. */
  mnftrPrchsSecd: string
  /** 의견 (etcOpnnCn, 4000) — [제조/구매]가 '의견작성'일 경우 입력값. */
  etcOpnnCn: string
  /** 조달요구번호 (prcmRqtNo, 15). */
  prcmRqtNo: string
  /** 재고번호 (mdfcnInvtNo, 13). */
  mdfcnInvtNo: string
  /** 품명 (itemNm, 200). */
  itemNm: string
  /** 단위 (unitCd, 2). */
  unitCd: string
  /** 부서 (deptCd, 16) — 표시명. */
  deptCd: string
  /** 최초조달원 (frstSosCd, 상위코드 SPU) — 표시명. */
  frstSosCd: string
  /** 현재조달원 (implInstCd, 상위코드 PRS) — 표시명. */
  implInstCd: string
  /** 장기사업구분 (lshtmSecd, 상위코드 UB50) — 표시명. */
  lshtmSecd: string
  /** 예산구분 (bgtSecd, 상위코드 KB) — 표시명. */
  bgtSecd: string
  /** 정비품목구분 (mtncItemSecd, 상위코드 RCC) — 표시명. */
  mtncItemSecd: string
  /** 규격번호 (spcfctNo, 20). */
  spcfctNo: string
  /** 요구일자 (rqtYmd, 8). */
  rqtYmd: string
  /** 조달지시구분 (prcmDrctnSecd, 상위코드 POD) — 표시명. */
  prcmDrctnSecd: string
  /** 요구수량 (rqtQty, 15,2). */
  rqtQty: number
  /** 요구단가 (rqtUntprc, 17,2). */
  rqtUntprc: number
  /** 요구금액 (rqtAmt, 17,2). */
  rqtAmt: number
}

/**
 * 의견작성(P03) 저장/제출 요청 (slide15) — 제조/구매 선택(mnftrPrchsSecd) + 의견(etcOpnnCn).
 * mode: 'save'=임시저장(진행상태 미제출) · 'submit'=제출(수정 불가).
 */
export interface MockBfhdLoiOpnnRequest {
  /** 사전의향서 번호 (bfhdLoiNo). */
  bfhdLoiNo: string
  /** 품목 식별자 — 조달요구번호(prcmRqtNo). */
  prcmRqtNo: string
  /** 제조/구매 (mnftrPrchsSecd) — 제조/구매/의견작성. */
  mnftrPrchsSecd: string
  /** 의견 (etcOpnnCn, 4000). */
  etcOpnnCn: string
  /** 임시저장/제출 구분. */
  mode: 'save' | 'submit'
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-TS-04-M01 세금계산서계약목록 (slide22, 24~25) — txivList_CtrtList/TxivList_CtrtListPage
//   검색필터: MUI-TS-04-P05 (계약연도·계약번호). 카드 클릭 → P02 세금계산서목록 바텀시트.
// ────────────────────────────────────────────────────────────────────────────

/** 계약목록 검색조건 (dml_SrchCtrtList, slide25 1.1) — 계약년도 like 'yyyy%'. */
export interface MockTxivCtrtListRequest {
  /** 계약년도 (ctrtYmd, like 'yyyy%') — 기본 현재 연도. */
  ctrtYmd?: string
  /** 계약번호 (ctrtNo, 11). */
  ctrtNo?: string
}

/** 계약목록 1건 (dlt_CtrtList, slide25 1.2). */
export interface MockTxivCtrtItem {
  /** 목록 key — 계약번호(ctrtNo) 사용. */
  id: string
  /** 계약번호 (ctrtNo, 11). */
  ctrtNo: string
  /** 계약일자 (ctrtYmd, 8). */
  ctrtYmd: string
  /** 계약종류 (bidxMtnm, 상위코드 BDTC alias — 표시값 개발 시 확인 주기). */
  bidxMtnm: string
  /** 계약건명 (rpstItnm — 물품/용역/공사 테이블 alias). */
  rpstItnm: string
  /** 업체코드 (bzentyCd, 5). */
  bzentyCd: string
  /** 업체명 (bzentyNm, 100). */
  bzentyNm: string
  /** 계약담당자명 (userNm, 100). */
  userNm: string
}

export interface MockTxivCtrtListResult {
  list: MockTxivCtrtItem[]
  total: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-TS-04-P02 세금계산서목록 (slide23, 26) — txivList_CtrtList/TxivList (바텀시트 콘텐츠)
// ────────────────────────────────────────────────────────────────────────────

/** 세금계산서목록 1건 (dlt_TxivList, slide26 1.3). */
export interface MockTxivItem {
  /** 목록 key/상세 라우팅용 고유 식별자 — 계산서발행번호(pblcnNo) 사용. */
  id: string
  /** 구분 (reqDivsNm) — 일반/수정 (reqDivs 'R'·'U':일반 / 'UR':수정 alias). */
  reqDivsNm: string
  /** 진행상태 (txivPrgrsStcd) — A작성/C폐기/F서명실패/S전자서명/Y승인/R반려/T국세청SEND. 표시명. */
  txivPrgrsStcd: string
  /** 수정사유 (txivMdfcnRncd) — 01 착오정정/02 공급가액 변동/03 환입/04 계약해제. 없으면 미노출. */
  txivMdfcnRncd?: string
  /** 계산서발행번호 (pblcnNo, 15). */
  pblcnNo: string
  /** 계약번호 (ctrtNo, 11). */
  ctrtNo: string
  /** 발행일자 (bllPblcnYmd, 8). */
  bllPblcnYmd: string
  /** 계약건명 (rpstItnm). */
  rpstItnm: string
  /** 계약금액 (contAmnt, 17,2). */
  contAmnt: number
  /** 공급가액 (splyEqvl, 17,2). */
  splyEqvl: number
  /** 계약담당자 — 카드 행 표시항목(slide23). ⚠️ dlt_TxivList 미정의 — 계약목록 항목명(userNm) 재사용. */
  userNm: string
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-TS-04-M03 세금계산서상세 (slide28~30) — txivDtl/TxivDtlPage
//   세금계산서작성 데이터 영역(dmt_TxivWrtInfo) — 조회/작성 동일 화면(모바일은 조회 전용).
// ────────────────────────────────────────────────────────────────────────────

/** 세금계산서상세 (dmt_TxivWrtInfo, slide29~30 1.1). */
export interface MockTxivDtl {
  /**
   * 계약번호 (ctrtNo, 11) — ⚠️ 항목명(한글)은 조달구분(sOption)에 따라
   * 계약번호(부대/중앙)·재무관증빙번호(FMS)·청구번호(상업조달)로 변경(slide29) — 라벨 분기는 상세설계 확정 시.
   */
  ctrtNo: string
  /** 발행번호 (pblcnNo, 15). */
  pblcnNo: string
  /** 책번호 (bookNo, 3). */
  bookNo: string
  /** 일련번호 (regSn, 10). */
  regSn: string
  // ── 공급자 정보 ──
  /** 사업자번호(공급자) (splrBrno, 10). */
  splrBrno: string
  /** 대표명(공급자) (splrRprsvNm, 100). */
  splrRprsvNm: string
  /** 상호(공급자) (splrBzentyNm, 100). */
  splrBzentyNm: string
  /** 업태(공급자) (splrBzstatCd, 상위코드 MBTC) — 표시명. */
  splrBzstatCd: string
  /** 주소(공급자) (splrAddr, 150). */
  splrAddr: string
  /** 업종(공급자) (splrTpbizNm, 100). */
  splrTpbizNm: string
  /** 청구인성명(공급자) (splrPicNm, 100). */
  splrPicNm: string
  /** 연락처(공급자) (splrEntlno, 88, 암호화). */
  splrEntlno: string
  /** 부서명(공급자) (splrTkcgDeptNm, 200). */
  splrTkcgDeptNm: string
  /** E-Mail(공급자) (splrEmlAddr, 50). */
  splrEmlAddr: string
  // ── 공급받는자 정보 ──
  /** 사업자번호(공급받는자) (splrcpBrno, 10). */
  splrcpBrno: string
  /** 대표명(공급받는자) (splrcpRprsvNm, 100). */
  splrcpRprsvNm: string
  /** 상호(공급받는자) (splrcpBzentyNm, 100). */
  splrcpBzentyNm: string
  /** 업태(공급받는자) (splrcpBzstatCd, 상위코드 MBTC) — 표시명. */
  splrcpBzstatCd: string
  /** 주소(공급받는자) (splrcpAddr, 150). */
  splrcpAddr: string
  /** 업종(공급받는자) (splrcpTpbizNm, 100). */
  splrcpTpbizNm: string
  // ── 계약서 일반정보 ──
  /** 세액구분 (vatSecd, 상위코드 VATA) — 과세/면세/영세 표시명. */
  vatSecd: string
  /** 신고구분 (cfmtnYn, 1:확정 2:예정) — 표시명. */
  cfmtnYn: string
  /** 계산서일자 (splyYmd, 8). */
  splyYmd: string
  /** 품목(계약건명) (itemNm, 200). */
  itemNm: string
  /** 수량 (dlvgdsQty, 15,2). */
  dlvgdsQty: number
  /** 단가 (ctrtUntprc, 17,2). */
  ctrtUntprc: number
  /** 공급가액 (splyEqvl, 17,2). */
  splyEqvl: number
  /** 세액 (vatAmt, 17,2). */
  vatAmt: number
  /** 비고 (rmrkCn, 4000). */
  rmrkCn: string
  // ── 요약(SummaryInfo)·뱃지 표시항목 — P02 목록 항목명 재사용(slide28 요약 정보) ──
  reqDivsNm: string
  txivPrgrsStcd: string
  txivMdfcnRncd?: string
  rpstItnm: string
  contAmnt: number
  bllPblcnYmd: string
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-TS-04-M04 세금계산서진행현황 (slide31~33) — txivPrgrsPrst/TxivPrgrsPrstPage
// ────────────────────────────────────────────────────────────────────────────

/** 진행현황 검색조건 (dmt_SrchTxivPrgrsPrst, slide33 1.1). */
export interface MockTxivPrgrsPrstRequest {
  /** 발행일자 시작일 (bllPblcnYmd). */
  bllPblcnYmdFr?: string
  /** 발행일자 종료일 (bllPblcnYmd). */
  bllPblcnYmdTo?: string
  /** 계약번호 (ctrtNo, 11). */
  ctrtNo?: string
  /** 진행상태 (txivPrgrsStcd). */
  txivPrgrsStcd?: string
}

/** 진행현황 1건 (dlt_TxivPrgrsPrst, slide33 1.2) — 세금계산서목록 + 제출일시/국세청결과. */
export interface MockTxivPrgrsPrstItem {
  /** 목록 key/상세 라우팅용 고유 식별자 — 계산서발행번호(pblcnNo) 사용. */
  id: string
  reqDivsNm: string
  txivPrgrsStcd: string
  txivMdfcnRncd?: string
  pblcnNo: string
  ctrtNo: string
  bllPblcnYmd: string
  rpstItnm: string
  contAmnt: number
  splyEqvl: number
  /** 비고 (rmrkCn, 4000). */
  rmrkCn: string
  /** 제출일시 (splrWrtDt) — 공급자 서명일시. */
  splrWrtDt: string
  /** 국세청결과 (elsgnRsltCd, 10) — 없으면 '-'. */
  elsgnRsltCd: string
}

export interface MockTxivPrgrsPrstResult {
  list: MockTxivPrgrsPrstItem[]
  total: number
}
