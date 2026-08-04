// 업무지원(TS) 도메인 타입 — 설계서 06.업무지원-모바일 v0.82 항목설명(항목명 영문) 그대로.
// 화면별 섹션 주석으로 구분(도메인당 1파일 원칙 — CLAUDE.md "타입 정의").

// ────────────────────────────────────────────────────────────────────────────
// MUI-TS-01-M01 사전의향서목록 (slide9~11) — bfhdLoiList/BfhdLoiListPage
//   검색필터: MUI-TS-01-P04 (SearchFilter schema — 접수기간 월 단위, 2026-07-24 화면수정).
// ────────────────────────────────────────────────────────────────────────────

/** 사전의향서목록 검색조건 (slide11 1.1) — On-Load: 접수기간 현재일자. */
export interface BfhdLoiListRequest {
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
export interface BfhdLoiItem {
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

export interface BfhdLoiListResult {
  list: BfhdLoiItem[]
  total: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-TS-01-M02 사전의향서상세 (slide12~17) — bfhdLoiDtl/BfhdLoiDtlPage
//   탭: T01 상세내용(BfhdLoiDtl) · T02 품목명세서(BfhdLoiDtl_ItemList) · P03 의견작성(BfhdLoiWrt).
// ────────────────────────────────────────────────────────────────────────────

/** 사전의향서상세 — 집행계획(slide16 1.2) + 문의처(1.3) + 요약 표시항목. */
export interface BfhdLoiDtl {
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
export interface BfhdLoiSpcfctItem {
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
export interface BfhdLoiOpnnRequest {
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
