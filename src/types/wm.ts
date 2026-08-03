// 대금청구/사후(WM) 도메인 타입 — 설계서 05.대금청구및사후-모바일 v0.83 항목설명(항목명 영문) 그대로.
// 화면별 섹션 주석으로 구분(도메인당 1파일 원칙 — CLAUDE.md "타입 정의").

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M01 대금청구통합목록 (slide16~21) — pymtClmIntgList/PymtClmIntgListPage
// ────────────────────────────────────────────────────────────────────────────

/** 대금청구통합목록 검색조건 (dmt_PymtClmIntgSrch, slide20 1.1) — 서버 필터 전환 시 사용. */
export interface PymtClmIntgListRequest {
  /** 계약시작일자 (ctrtBgngYmd, 8). */
  ctrtBgngYmd?: string
  /** 계약종료일자 (ctrtEndYmd, 8). */
  ctrtEndYmd?: string
  /** 계약번호 (ctrtNo, 11) — 계약번호검색 공통팝업(P79). */
  ctrtNo?: string
  /** 계약명 (ctrtNm, 300). */
  ctrtNm?: string
  /** 업무구분 (taskSeCd, 1) — 물품/용역/공사/국외. */
  taskSeCd?: string
}

/** 대금청구목록 1건 (dlt_pymtClmList, slide20 1.2 — 0701 개정 업체명/입찰방법/계약종류/계약일자 포함). */
export interface PymtClmListItem {
  /** 목록 key 용 고유 식별자 — `${ctrtNo}-${ctrtCycl}` (클라 생성, 배열 인덱스 key 금지). */
  id: string
  /** 번호 (no) — 그리드 rownum. */
  no: number
  /** 업무구분 (taskSeCd, 1) — 물품/용역/공사/국외. 카드 뱃지. */
  taskSeCd: string
  /** 계약번호 (ctrtNo, 11). */
  ctrtNo: string
  /** 계약번호차수 — 카드 계약번호+회차 표기(slide16 4-2). ⚠️ dlt 미정의 — CT 항목명(ctrtCycl) 재사용. */
  ctrtCycl: string
  /** 계약명 (ctrtNm, 300). */
  ctrtNm: string
  /** 업체명 (bzentyNm, 100). */
  bzentyNm: string
  /** 입찰방법 (bidMthdNm, 상위코드 BDTC) — 총액제/단가제 뱃지. */
  bidMthdNm: string
  /** 계약종류 (jntCtrtCdNm) — 하도급/공동계약/주계약. */
  jntCtrtCdNm: string
  /** 계약일자 (ctrtYmd, 8). */
  ctrtYmd: string
  /** 계약금액 (ctrtAmt, 17). */
  ctrtAmt: number
  /** 계약방법 표시레이블(일반경쟁~역경매, slide16 4-1) — ⚠️ dlt 미정의, CT 항목명(ctrtMthdCd) 재사용. */
  ctrtMthdCd: string
  /** 발주기관 — 카드 행 표시항목(slide16 목업). ⚠️ dlt 미정의 — CT 항목명(orderInstNm) 재사용. */
  orderInstNm: string
  /**
   * 진행중 대금청구 보유 여부 — 카드 클릭 시 P13 신청목록 시트/토스트 분기(slide17).
   * ⚠️ 설계서 분기 조건 항목 미정의(BD 선례 임시 키) — 상세설계 확정 시 교체.
   */
  pymtClmExstYn: 'Y' | 'N'
}

export interface PymtClmIntgListResult {
  list: PymtClmListItem[]
  total: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-P13 대금청구신청목록 (slide19~21) — pymtClmIntgList/PymtClmIntgAplyList (바텀시트 콘텐츠)
// ────────────────────────────────────────────────────────────────────────────

/**
 * 대금청구 신청 1건 — ⚠️ 설계서 항목설명(dlt_pymtClmAplyList, slide20 1.3)이 목록(1.2)과 동일 내용으로
 * 복사돼 있어 화면 목업(slide19: 청구번호/청구서종류/청구금액/확정구분/세액여부/작성일자/청구일자/진행상태)
 * 기준 임시 항목명으로 정의(BD 선례) — 상세설계 확정 시 대조.
 */
export interface PymtClmAplyItem {
  /** 목록 key/상세 라우팅용 고유 식별자 — `${clmNo}-${clmOdr}` (클라 생성). */
  id: string
  /** 번호 (no). */
  no: number
  /** 청구번호 (clmNo, 임시) — 예: 12315. */
  clmNo: string
  /** 청구차수 (clmOdr, 임시) — 카드 표기 `청구번호 12315 - 42`. */
  clmOdr: string
  /**
   * 청구서 종류명 (clmDocNm, 임시) — 선금신청서/착중도금신청서/대금청구서/사후정산청구서.
   * 카드 제목 + 상세 화면 분기(M02/M03/M05~M08/M13, slide21 이벤트) 구동.
   */
  clmDocNm: string
  /** 청구금액 (clmAmt, 임시). */
  clmAmt: number
  /** 확정구분 (cnfmSeNm, 임시) — 미확정 시 '-'. */
  cnfmSeNm: string
  /** 세액여부(세액) (txamt, 임시) — 금액 표시. */
  txamt: number
  /** 작성일자 (wrtYmd, 임시). */
  wrtYmd: string
  /** 청구일자 (clmYmd, 임시). */
  clmYmd: string
  /** 진행상태 (prgrsStNm, 임시) — 진행중/진행완료 뱃지. */
  prgrsStNm: string
  /** 업무구분 (taskSeCd) — 상세 분기 보조. */
  taskSeCd: string
  /**
   * 대금청구서 유형 구분 — 중앙/부대/공사/기성대가 상세(M05~M08) 분기 구동.
   * ⚠️ 설계서 분기 조건 항목 미정의(BD 선례 임시 키) — 상세설계 확정 시 교체.
   */
  prcmSeNm: '중앙' | '부대' | '공사' | '기성대가'
}

// ────────────────────────────────────────────────────────────────────────────
// 상세 화면 공통 — 요약(SummaryInfo) 표시항목 (M02/M03 등 slide22 타이틀 영역).
// dlt_pymtClmList 카드와 동일 구성 — 항목명 재사용(⚠️ ctrtCycl/ctrtMthdCd/orderInstNm 은 임시, M01 참고).
// ────────────────────────────────────────────────────────────────────────────

/** 대금/사후 상세 요약 표시항목 — M02/M03 페이지 상단 SummaryInfo 구동. */
export interface WmDtlSummary {
  taskSeCd: string
  ctrtMthdCd: string
  ctrtNo: string
  ctrtCycl: string
  ctrtNm: string
  ctrtYmd: string
  orderInstNm: string
  ctrtAmt: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M02 선금신청서상세 (slide22~28) — prpayApfrDtl/PrpayApfrDtlPage
//   탭: T01 신청정보(PrpayApfrDtl) · T02 세부신청내역(PrpayApfrDtl_AplyDtsm) · T23 지급상태(공용)
// ────────────────────────────────────────────────────────────────────────────

/** 선금신청서상세 — 차수(dmt_prpayApfrCyclInfo) + 계약내용(dmt_ctrtCnInfo) + 신청금액(dmt_aplyAmtInfo)
 *  + 공급자(dmt_splrInfo, slide27 1.5) + 요약. */
export interface PrpayApfrDtl extends WmDtlSummary {
  // ── 공급자 정보 (dmt_splrInfo) ──
  /** 작성자명 (wrtrNm, 100). */
  wrtrNm: string
  /** 직책 (wrtrJbttlNm, 100). */
  wrtrJbttlNm: string
  /** 휴대폰번호 (wrtrEnmtno, 64, 암호화휴대전화번호). */
  wrtrEnmtno: string
  // ── 계약내용 (dmt_ctrtCnInfo, slide26 1.2) ──
  /** 납기 (dlvgdsYmd, 8) — 화면은 기간 표기(slide22). */
  dlvgdsYmd: string
  /** 비고 (mainBizCn, 100). */
  mainBizCn: string
  // ── 신청정보 (dmt_prpayApfrCyclInfo + dmt_aplyAmtInfo) ──
  /** 차수 (ctrtCyclNo → 설계서 항목명 ctrtCycl, 18) — 계약번호-신청차수. 요약 ctrtCycl 과 구분해 별도 보관. */
  aplyCtrtCycl: string
  /** 수신자 (rcptnOgnzCd, 상위코드 RIC) — 표시명. */
  rcptnOgnzCd: string
  /** 신청일자 (dmndDt, 8). */
  dmndDt: string
  /** 신청금액 (aplyAmt, 17). */
  aplyAmt: number
  /** 신청금액(일금) 한글 표기 — 화면 표시항목(slide22, 0701 일금 누락 주기). ⚠️ 항목명 미정의 임시(aplyAmtHngl). */
  aplyAmtHngl: string
  /** 지출원인금액 — ⚠️ 설계서(slide26 1.3)가 aplyAmt 로 중복 표기(오타로 판단), 임시 키(expndCauseAmt). */
  expndCauseAmt: number
}

/** 선금 세부신청내역 1건 (dmt_aplyDsctnInfo, slide26 1.4) — 구분별 반복(재료비 수입/국내/간접 · 노무비 직접/간접 ·
 *  경비 직접/간접 · 일반관리비 · 기타 · 합계). */
export interface PrpayAplyDsctnItem {
  /** 목록 key — 구분명(고유). */
  id: string
  /** 구분 (prpayAplyDsctnAmtSeNm) — 금액구분명. */
  prpayAplyDsctnAmtSeNm: string
  /** 대상금액 (trgtAmt, 17). */
  trgtAmt: number
  /** 신청금액 기사용 (arusAplyAmt, 17). */
  arusAplyAmt: number
  /** 신청금액 사용예정 (usePrnmntAplyAmt, 17). */
  usePrnmntAplyAmt: number
  /** 신청금액 계 (aplySumAmt, 17). */
  aplySumAmt: number
  /** 신청금액의 비율 (aplyAmtRt) — 신청금액계/대상금액*100(화면 계산). */
  aplyAmtRt: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M03 착·중도금신청서상세 (slide29~35) — dpsmnItrpyApfrDtl/DpsmnItrpyApfrDtlPage
//   탭: T03 신청정보(DpsmnItrpyApfrDtl) · T04 세부신청내역(DpsmnItrpyApfrDtl_AplyDtsm) · T23 지급상태(공용)
// ────────────────────────────────────────────────────────────────────────────

/** 착·중도금신청서상세 — dmt_dpsmnItrpyApfrInfo + 계약내용 + 신청금액 + 공급자 + 요약 (slide33). */
export interface DpsmnItrpyApfrDtl extends WmDtlSummary {
  // ── 공급자 정보 (dmt_splrInfo) ──
  wrtrNm: string
  wrtrJbttlNm: string
  wrtrEnmtno: string
  // ── 계약내용 (dmt_ctrtCnInfo, slide33 1.2 — 선금과 달리 품명·납기(dudtYmd 기간)·착수금 구분) ──
  /** 품명 (itemNm, 50) — 0703 화면수정 반영. */
  itemNm: string
  /** 납기(최종) (dudtYmd) — 납기 최소~최대 기간 표기. */
  dudtYmd: string
  /** 비고 (mainBizCn, 100). */
  mainBizCn: string
  /** 착수금/착·중도금 구분 (fravItrpySecd, 1) — '1':착수금 · '2':착·중도금. 신청구분 행 표시. */
  fravItrpySecd: '1' | '2'
  // ── 신청정보 (dmt_dpsmnItrpyApfrInfo + dmt_aplyAmtInfo) ──
  /** 차수 (설계서 항목명 ctrtCycl, 18) — 계약번호-신청차수. */
  aplyCtrtCycl: string
  /** 수신자 (rcptnOgnzCd, 상위코드 RIC). */
  rcptnOgnzCd: string
  /** 신청일자 (dmndDt, 8). */
  dmndDt: string
  /** 신청금액 (aplyAmt, 17). */
  aplyAmt: number
  /** 신청금액 한글 표기(일금) — ⚠️ 항목명 미정의 임시(aplyAmtHngl). */
  aplyAmtHngl: string
}

/** 착·중도금 세부신청내역 1건 (dmt_aplyDsctnInfo, slide33 1.4) — 선금과 달리 기사용/사용예정 대신
 *  신청금액·승인된 전 차수 수령금액의 합계. */
export interface DpsmnItrpyAplyDsctnItem {
  /** 목록 key — 구분명(고유). */
  id: string
  /** 구분 (dpsmnItrpyAplyDsctnSeNm). */
  dpsmnItrpyAplyDsctnSeNm: string
  /** 대상금액 (trgtAmt, 17). */
  trgtAmt: number
  /** 신청금액 (aplyAmt, 17). */
  aplyAmt: number
  /** 승인된 전 차수 수령금액의 합계 (aplyStotAmt, 17). */
  aplyStotAmt: number
  /** 신청금액의 비율 (aplyAmtRt) — (신청금액/대상금액)*100. */
  aplyAmtRt: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-T23 지급상태 (slide36~37) — prpayDpsmnItrpyGiveStts/PrpayDpsmnItrpyGiveStts
//   선금/착·중도금/사후정산 상세 공용 탭.
// ────────────────────────────────────────────────────────────────────────────

/** 지급상태 1건 (dlt_prgrsSttsList, slide37 1.1). */
export interface GiveSttsItem {
  /** 목록 key — `${ctrtNo}-${ctrtCycl}` (클라 생성). */
  id: string
  /** 신청년도 (rqstYr, 4). */
  rqstYr: string
  /** 계약번호 (ctrtNo, 11). */
  ctrtNo: string
  /** 신청차수 (ctrtCycl, 18). */
  ctrtCycl: string
  /** 신청금액 (giveClmAmt, 17). */
  giveClmAmt: number
  /** 진행상태 (expndStcd, 상위코드 EPDS) — 표시명. */
  expndStcd: string
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M05 대금청구 상세(중앙조달) (slide38~45) — centerPrcmPymtClmDtl/CenterPrcmPymtClmDtlPage
//   탭: T05 계약정보(_Ctrt) · T06 공급자정보(_Splr) · T07 대금신청금액(_Pymt) · T08 세금계산서(_Txiv)
//   · 진행상태(T23 공용).
// ────────────────────────────────────────────────────────────────────────────

/** 대금신청대상 1건 (dlt_pymtAplyTrgtList, slide43 1.2). */
export interface PymtAplyTrgtItem {
  /** 목록 key — `${avtsmtNo}-${dlvdocNo}` (클라 생성). */
  id: string
  /** 통지번호 (avtsmtNo, 3). */
  avtsmtNo: string
  /** 조서발행번호 (dlvdocNo, 17). */
  dlvdocNo: string
  /** 합격일자 (srngYmd, 8). */
  srngYmd: string
  /** 납품일자 (dlvgdsYmd, 8) — 없으면 '-'. */
  dlvgdsYmd?: string
  /** 예산구분 (bgtSecd, 상위코드 KB) — 표시명. */
  bgtSecd: string
  /** 금액 (dlvgdsAmt, 17). */
  dlvgdsAmt: number
  /** 감액 (ctbkAmt, 17). */
  ctbkAmt: number
  /** 지체상금 (lqdmg, 17). */
  lqdmg: number
}

/** 세금계산서 품목 1건 (dlt_txBllList, slide44 1.5). */
export interface TxBllItem {
  /** 목록 key — `${bllPblcnYmd}-${itemNm}` (클라 생성). */
  id: string
  /** 월일 (bllPblcnYmd, 8). */
  bllPblcnYmd: string
  /** 품목 (itemNm, 200) — 없으면 '-'. */
  itemNm: string
  /** 수량 (dlvgdsQty, 15). */
  dlvgdsQty: number
  /** 단가 (ctrtUntprc, 17). */
  ctrtUntprc: number
  /** 공급가액 (splyEqvl, 17). */
  splyEqvl: number
  /** 세액 (txamt, 17). */
  txamt: number
}

/** 대금청구 상세(중앙조달) — 계약정보(dmt_ctrtInfo) + 대금신청대상 + 공급자(dmt_splrInfo)
 *  + 대금신청금액(dmt_pymtAplyAmtInfo) + 세금계산서 + 요약 (slide43~44). */
export interface CenterPrcmPymtClmDtl extends WmDtlSummary {
  // ── 계약정보 (dmt_ctrtInfo, slide43 1.1) ──
  /** 일자구분(계약일자 표시, regDt, 8). */
  regDt: string
  /** 청구번호 (birqNo, 15). */
  birqNo: string
  /** 대금신청대상 목록 (dlt_pymtAplyTrgtList). */
  pymtAplyTrgts: PymtAplyTrgtItem[]
  // ── 공급자정보 (dmt_splrInfo, slide43 1.3) ──
  /** 상호(업체명) (bzentyNm, 100). */
  bzentyNm: string
  /** 대표명 (rprsvNm, 100). */
  rprsvNm: string
  /** 청구인성명 (clmtNm, 100). */
  clmtNm: string
  /** 연락처 (clmtTelno, 20). */
  clmtTelno: string
  /** SMS수신번호 (enmtno, 64, 암호화휴대전화번호). */
  enmtno: string
  /** 주소 (bzentyAddr, 200). */
  bzentyAddr: string
  // ── 대금신청금액 (dmt_pymtAplyAmtInfo, slide44 1.4) ──
  /** 일자구분 (ymdSeCd, 'I':합격월 · 'D':납품월) — 첫 행 라벨(합격일자/납품일자) 구동. */
  ymdSeCd: 'I' | 'D'
  /** 일자구분 값 — 화면 표시일자(slide41). ⚠️ 항목명 미정의 임시(aplyYmd). */
  aplyYmd: string
  /** 세액여부 (vatSecd, 'A':있음 · 'B':없음) — 없음이면 세액 '-' 표기(slide41 4-1). */
  vatSecd: 'A' | 'B'
  /** 납품금액 (dlvgdsAmt, 17). */
  dlvgdsAmt: number
  /** 납품 공급가액 (dlvgdsSplyEqvl, 17). */
  dlvgdsSplyEqvl: number
  /** 납품 세액 (dlvgdsTxamt, 17). */
  dlvgdsTxamt: number
  /** 공제금액 (ddcAmt, 17). */
  ddcAmt: number
  /** 공제 공급가액 (ddcSplyEqvl, 17). */
  ddcSplyEqvl: number
  /** 공제 세액 (ddcTxamt, 17). */
  ddcTxamt: number
  /** 공제내역 (ddcDsctnNm, 100) — 없으면 '-'. */
  ddcDsctnNm: string
  /** 청구금액 (clmAmt, 17). */
  clmAmt: number
  /** 면제원제출 (exmptnSbmsnYn, 'Y' 제출) — 미제출 '-'. */
  exmptnSbmsnYn: string
  /** 보증보험증권제출 (grnteInsrncScrtSbmsnYn, 'Y' 제출) — 미제출 '-'. */
  grnteInsrncScrtSbmsnYn: string
  /** 비고 (rmrkCn, 4000). */
  rmrkCn: string
  // ── 세금계산서 (slide44 1.5) ──
  /** 세금계산서 선택여부 (txivChcYn, 'Y':선택) — 선택 시에만 세금계산서 탭 내용 노출(slide38). */
  txivChcYn: 'Y' | 'N'
  /** 세금계산서번호 — 화면 표시항목(slide42). ⚠️ 항목설명은 txivChcYn 과 병기(오기로 판단), 임시(txivNo). */
  txivNo: string
  /** 세금계산서 품목 목록 (dlt_txBllList). */
  txBlls: TxBllItem[]
}

// ────────────────────────────────────────────────────────────────────────────
// 첨부파일 탭 공통 (dlt_adocList, slide53 1.5 등) — M06 T12 · M07 T15 · M08 T19 동일 구성.
// ────────────────────────────────────────────────────────────────────────────

/** 첨부서류 1건 (dlt_adocList). */
export interface WmAdocItem {
  /** 목록 key — 등록 순번 등 고유값(클라 생성). */
  id: string
  /** 첨부서류명 (docNm, 200). */
  docNm: string
  /** 첨부파일명 (fileNm, 300) — 없으면 '-'. */
  fileNm: string
  /** 파일크기 (fileSize, 10) — 표시 문자열(예: '786KB'), 없으면 '-'. */
  fileSize: string
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M06 대금청구상세(부대조달) (slide46~54) — sbsdPrcmPymtClmDtl/SbsdPrcmPymtClmDtlPage
//   탭: T09 계약정보(_Ctrt) · T10 대금신청업체정보(_PymtBzenty) · T11 대금신청금액(_PymtAply) · T12 첨부파일(_Atch).
// ────────────────────────────────────────────────────────────────────────────

/** 부대조달 대금신청대상 1건 (dlt_pymtAplyTrgtList, slide52 1.2 — 중앙과 항목명 상이). */
export interface SbsdPymtAplyTrgtItem {
  /** 목록 key — `${avtsmtNo}-${recrdPblcnNo}` (클라 생성). */
  id: string
  /** 통지번호 (avtsmtNo, 3). */
  avtsmtNo: string
  /** 조서발행번호 (recrdPblcnNo, 20). */
  recrdPblcnNo: string
  /** 합격일자 (rcpmDt, 8). */
  rcpmDt: string
  /** 납품일자 (dlvgdsYmd, 8) — 없으면 '-'. */
  dlvgdsYmd?: string
  /** 예산구분 (bgtCd, 상위코드 UZ03 — 전년국채/본조/당년국채) — 표시명. */
  bgtCd: string
  /** (납품)금액 (dlvgdsAmt, 17). */
  dlvgdsAmt: number
  /** 감액 (ctbkAmt, 17). */
  ctbkAmt: number
  /** 지체상금 (lqdmg, 17). */
  lqdmg: number
}

/** 대금청구상세(부대조달) — 계약정보(dmt_ctrtInfo) + 신청대상 + 업체정보(dmt_pymtAplyBzentyInfo)
 *  + 대금신청금액(dmt_pymtAplyAmtInfo) + 첨부(dlt_adocList) + 요약 (slide52~53). */
export interface SbsdPrcmPymtClmDtl extends WmDtlSummary {
  // ── 계약정보 (slide52 1.1) ──
  /** 신청일자 (aplyYmd, 8). */
  aplyYmd: string
  /** 대금신청번호 (birqNo, 15). */
  birqNo: string
  /** 대금신청대상 목록. */
  pymtAplyTrgts: SbsdPymtAplyTrgtItem[]
  // ── 대금신청업체정보 (slide52 1.3) ──
  /** 상호 (bzentyNm, 100). */
  bzentyNm: string
  /** 대표명 (rprsvNm, 100). */
  rprsvNm: string
  /** 청구인성명 (clmtNm, 100). */
  clmtNm: string
  /** 연락처 (clmtTelno, 20). */
  clmtTelno: string
  /** 주소 (bzentyAddr, 120). */
  bzentyAddr: string
  // ── 대금신청금액 (slide53 1.4) ──
  /** 지급구분 (giveSecd, 상위코드 EPNC — 선금 등) — 표시명. */
  giveSecd: string
  /** 세액여부 (vatSecd, 상위코드 VATA — 과세/면세/영세) — 표시명. */
  vatSecd: string
  /** 납품(선급)금액 (dlvgdsAmt, 17). */
  dlvgdsAmt: number
  /** 공급가액 (splyEqvl, 17). */
  splyEqvl: number
  /** 세액 (vatAmt, 17). */
  vatAmt: number
  /** 공제금액 (ddcAmt, 17). */
  ddcAmt: number
  /** 공제 공급가액 — ⚠️ 설계서(slide53)가 ddcAmt 로 중복 표기(오타), M05 항목명(ddcSplyEqvl) 재사용. */
  ddcSplyEqvl: number
  /** 공제 세액 (txamtDdcAmt, 17). */
  txamtDdcAmt: number
  /** 공제내역 (ddcDsctnNm, 100) — 없으면 '-'. */
  ddcDsctnNm: string
  /** 실지급금액 (giveClmAmt, 17). */
  giveClmAmt: number
  /** 신고구분 (cfmtnYn — 확정/예정) — 표시명. */
  cfmtnYn: string
  /** 비고 (birqRmrkCn, 100). */
  birqRmrkCn: string
  /** 첨부서류 목록 (dlt_adocList). */
  adocs: WmAdocItem[]
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M07 대금청구상세(공사) (slide55~60) — cstrnPymtClmDtl/CstrnPymtClmDtlPage
//   탭: T13 계약정보(_Ctrt) · T14 대가지급업체(_GiveBzenty) · T15 첨부파일(_Atch).
// ────────────────────────────────────────────────────────────────────────────

/** 대가지급업체 1건 (dlt_giveBzentyList, slide59 1.2). */
export interface GiveBzentyItem {
  /** 목록 key — `${bzentyNm}-${enacno}` (클라 생성). */
  id: string
  /** 업체유형 (fbctnSecd, 상위코드 UB54) — 표시명, 없으면 '-'. */
  fbctnSecd: string
  /** 업체명 (bzentyNm, 100). */
  bzentyNm: string
  /** 신청금액 (aplyAmt, 17). */
  aplyAmt: number
  /** 은행명 (dlngFnstNm, 100). */
  dlngFnstNm: string
  /** 계좌번호 (enacno, 64, 암호화계좌번호). */
  enacno: string
  /** 계좌실명번호 — ⚠️ 설계서(slide59)가 enacno 로 중복 표기(오타), 임시 키(enacnoRlnm). */
  enacnoRlnm: string
  /** 예금주 (dpstrNm, 100). */
  dpstrNm: string
}

/** 대금청구상세(공사) — 계약정보(dmt_ctrtInfo) + 비고(dmt_birqRmrkCnInfo) + 대가지급업체 + 첨부 + 요약 (slide59). */
export interface CstrnPymtClmDtl extends WmDtlSummary {
  /** 공사기간 (bgncstYmd, 8) — 화면은 기간 표기(slide56). */
  bgncstYmd: string
  /** 업체명(대표) (rprsvNm, 100). */
  rprsvNm: string
  /** 검사일자 (inspYmd). */
  inspYmd: string
  /** 지급구분 (giveSecd, 상위코드 UB56) — 표시명, 없으면 '-'. */
  giveSecd: string
  /** 기성금액 (pxcndAmt, 17). */
  pxcndAmt: number
  /** 신청금액 (aplyAmt, 17). */
  aplyAmt: number
  /** 비고 (birqRmrkCn, 100, dmt_birqRmrkCnInfo) — 변경내역 표시(slide56). */
  birqRmrkCn: string
  /** 대가지급업체 목록 (dlt_giveBzentyList). */
  giveBzentys: GiveBzentyItem[]
  /** 첨부서류 목록 (dlt_adocList). */
  adocs: WmAdocItem[]
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M08 대금청구상세(기성대가) (slide61~68) — pxcndCstPymtClmDtl/PxcndCstPymtClmDtlPage
//   탭: T16 계약정보(_Ctrt) · T17 기성대가신청금액(_PxcndPymt) · T18 세금계산서(_Txiv) · T19 첨부파일(_Atch).
// ────────────────────────────────────────────────────────────────────────────

/** 대금청구상세(기성대가) — 계약정보 + 대금신청업체(dmt_pymtAplyBzentyInfo) + 기성대가 신청금액
 *  (dmt_PxcndCstAplyAmtInfo) + 세금계산서(dlt_txivList) + 첨부 + 요약 (slide67~68). */
export interface PxcndCstPymtClmDtl extends WmDtlSummary {
  // ── 대금신청 업체정보 (slide67 1.2) ──
  /** 상호 (bzentyNm, 100). */
  bzentyNm: string
  /** 대표명 (rprsvNm, 100). */
  rprsvNm: string
  /** 청구인성명 (clmtNm, 100). */
  clmtNm: string
  /** 연락처 (clmtTelno, 20). */
  clmtTelno: string
  // ── 기성대가 신청 금액 (dmt_PxcndCstAplyAmtInfo, slide67 1.3) ──
  /** 지급구분 (giveSecd, 상위코드 EPNC) — 표시명(기성대가 등). */
  giveSecd: string
  /** 세액여부 (vatSecd) — 표시명(과세/면세/영세, slide63 1-2). */
  vatSecd: string
  /** 기성금액 (dlvgdsAmt, 17). */
  dlvgdsAmt: number
  /** 공급가액 (dlvgdsSplyEqvl, 17). */
  dlvgdsSplyEqvl: number
  /** 세액 (dlvgdsTxamt, 17). */
  dlvgdsTxamt: number
  /** 공제금액 (ddcAmt, 17). */
  ddcAmt: number
  /** 공제 공급가액 (ddcSplyEqvl, 17). */
  ddcSplyEqvl: number
  /** 공제 세액 (ddcTxamt, 17). */
  ddcTxamt: number
  /** 공제내역 (ddcDsctnNm, 100) — 없으면 '-'. */
  ddcDsctnNm: string
  /** 실지급금액 (giveClmAmt, 17). */
  giveClmAmt: number
  /** 신고구분 (cfmtnYn — 확정/예정) — 표시명. */
  cfmtnYn: string
  /** 선급금 (prpamt, 17). */
  prpamt: number
  /** 총기성율 (tpxcndRt, 9) — %. */
  tpxcndRt: number
  /** 총기성금 (tpxcndAmt, 17). */
  tpxcndAmt: number
  /** 선금정산액 (prpayClclnAmt, 17). */
  prpayClclnAmt: number
  /** 금회정산액 (tstmClclnAmt, 17). */
  tstmClclnAmt: number
  /** 비고 (birqRmrkCn, 100). */
  birqRmrkCn: string
  // ── 세금계산서 (dlt_txivList, slide68 1.5 — 중앙(M05)과 동일 구성) ──
  /** 세금계산서 선택여부 (txivChcYn). */
  txivChcYn: 'Y' | 'N'
  /** 세금계산서번호 — ⚠️ M05 와 동일 사유 임시 키(txivNo). */
  txivNo: string
  /** 세금계산서 품목 목록. */
  txBlls: TxBllItem[]
  /** 첨부서류 목록 (dlt_adocList). */
  adocs: WmAdocItem[]
}
