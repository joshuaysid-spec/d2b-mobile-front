// 입찰(BD, MUI-BD) 도메인 타입. Design Ref: 02입찰 설계서 1.1~1.4 (MUI-BD-01-M01 입찰공고통합목록).
// 검색조건 value 는 검색필터 공통 value 타입(SearchFilterValue)을 그대로 alias (캐스팅 불필요).
import type { SearchFilterValue } from '@/types/search-filter'

export type BidSearchFilter = SearchFilterValue

/**
 * 입찰공고 통합목록 카드 1건 (MUI-BD-01-M01, 설계서 데이터영역 dlt_bidPbancIntgList) — 항목명 설계서 그대로.
 */
export interface BidPbancItem {
  /** 카드 식별자 (상세 라우팅 키) */
  id: string
  /** 순번(rnum) */
  rnum: number
  /** 공고구분(pbancTpcd, 상위코드 ANTC) — 정상공고/정정공고/취소공고/긴급공고 등. 상태 뱃지 */
  pbancTpcd: string
  /** G2B 공고번호(g2BBidPbancNo) — 카드 subtitle */
  g2BBidPbancNo: string
  /** G2B 공고차수(g2BBidPbancCycl) */
  g2BBidPbancCycl: string
  /** 통합참조번호(rfrncNo) */
  rfrncNo: string
  /** 입찰건명/공고명(rprsItemNm) — 카드 title(2줄 말줄임) */
  rprsItemNm: string
  /** 공사명(csrtName) */
  csrtName: string
  /** 발주기관(orderInstNm) */
  orderInstNm: string
  /** 생산능력제출마감일시(prdcpIdntySmdocDdlnDt) */
  prdcpIdntySmdocDdlnDt: string
  /** 입찰참가등록마감일시(bidClrsDt) */
  bidClrsDt: string
  /** 입찰서제출마감일시(tndrSbmsnDdlnDt) */
  tndrSbmsnDdlnDt: string
  /** 기초예가금액(brprc, 원 정수) — 표시 시 천단위 콤마 + ' 원' */
  brprc: number
  /**
   * 진행단계 — 단계표시기(StepBar) 구동값(조달/입찰/계약/이행/대금청구).
   * ⚠️ 설계서 데이터영역 미정의(상세설계 예정) — 단계표시기 구동용 추가(사용자 승인).
   */
  prgrsStg?: string
  /**
   * 업무구분 (taskSeNm) — 물품/용역/공사/국외. 카드 클릭 시 국내(/bd/:id)·국외(/bd/ovs/:id) 상세 라우팅 분기 구동.
   * ⚠️ 목록 데이터영역(dlt_bidPbancIntgList)엔 미정의 — 검색조건(dml_bidPbancSrchCnd)의 TaskSeNm ·
   *   입찰진행 목록(BidPrgrsItem.taskSeNm) 항목명 재사용(BD 임시키 관례).
   */
  taskSeNm?: string
}

/**
 * 개찰목록 카드 1건 (MUI-BD-08-M01, 설계서 02입찰 slide144 Layout).
 * "개찰일시가 도래한 이후 개찰 처리 및 결과를 확인하기 위한 통합 목록조회 화면."
 * 카드 표시는 입찰공고 목록과 동일 스타일이나, 정보행은 설계서대로 공고일자·개찰일시 2행만 사용.
 * 필드명·코드값·형식은 설계서 그대로 — 목업이지만 실제 API 응답처럼 구성(추후 bdService.getBdopnList 매핑).
 */
export interface BdopnItem {
  /** 카드 식별자 (상세 라우팅 키) */
  id: string
  /** 입찰공고번호 (예: '2026LGM000604191-01') — 카드 subtitle */
  bidPbancNo: string
  /** 입찰건명 (예: '(26-물품-04) 간편한 아침식 제조 및 납품') — 카드 제목(2줄 말줄임) */
  bidPbancNm: string
  /** 공고상태 (정상공고/정정공고/취소공고/연기공고/재공고/갱신공고/긴급공고/사전심사 등) — 상태 뱃지 */
  pbancStasNm: string
  /** 업무구분 (물품/용역/공사/국외) — 뱃지 */
  taskSeNm: string
  /** 입찰방식 (경쟁입찰/공개수의/사전심사 등) — 뱃지 */
  bidMthdNm: string
  /** 공고일자 (예: '2026-02-12') — 카드 1행 */
  pbancDt: string
  /** 개찰일시 (예: '2026-03-26 11:00') — 카드 2행 */
  opbidDt: string
}
/**
 * 입찰진행 목록 카드 1건 (MUI-BD-03-M01, 설계서 slide68 데이터영역 dlt_bidPrgrsList).
 * "조달업체가 신청한 입찰 내역" — 항목명/코드값 설계서 그대로(추후 bdService.getBidProgressList 매핑).
 */
export interface BidPrgrsItem {
  /** 번호 (rNum) — 조회 번호. 카드 식별자/상세 라우팅 키 */
  rNum: string
  /** 업무구분 (taskSeNm) — 물품/용역/공사/국외 */
  taskSeNm: string
  /** 공고번호 (pbancNo) */
  pbancNo: string
  /** 판단번호(공사번호) (prcmNo) — 조달번호 */
  prcmNo: string
  /** 입찰건명 (bidNm) */
  bidNm: string
  /** 통합참조번호 (rfrncNo) */
  rfrncNo: string
  /** 발주기관연락처 (orderInstTelno) */
  orderInstTelno: string
  /** 계약방법 (ctrtMthdNm) */
  ctrtMthdNm: string
  /** 입찰방법 (bidMthdNm) */
  bidMthdNm: string
  /** 입찰참가등록마감일시 (bidClrsDt) */
  bidClrsDt: string
  /** 입찰서접수마감일시 (tndrSbmsnDdlnDt) */
  tndrSbmsnDdlnDt: string
  /** 업체구분 (bzentySeNm) — 대표/구성 */
  bzentySeNm: string
  /** 사전심사(PQ) 공고 여부 (bfhdSrng) — 사전심사 공고인 경우 버튼 보이기. 신청유형 배지 */
  bfhdSrng: boolean
  /** 입찰참가신청서 대상 여부 (bidPrgrsApfr) — 신청유형 배지 */
  bidPrgrsApfr: boolean
  /** 입찰서(견적서) 제출 가능 여부 (tndr) — 신청유형 배지 */
  tndr: boolean
  /** 기술평가 공고 여부 (techEvl) — 기술평가 공고인 경우 버튼 보이기 (설계서 slide67) */
  techEvl: boolean
  /** 생산능력서류제출 대상 여부 (prdcpDcmntSbms) — 대상 공고인 경우 버튼 보이기 (설계서 slide67) */
  prdcpDcmntSbms: boolean

  // ── 등록 상태 (설계서 타 데이터영역 정의 항목 — 입찰서 작성 분기 slide68) ──────────
  /** 등록확정여부 (bidRegCfmtnYn) — 'Y'|'N'. 등록확정 시 입찰서 작성 가능 (설계서 slide76 입찰등록결과 데이터영역) */
  bidRegCfmtnYn?: 'Y' | 'N'
  /** 등록심사시점 (tndrSbmsnPntmCd) — 'pre'(사전등록심사)|'post'(사후등록심사). 사후면 등록확정 전에도 입찰서 작성
   *  (설계서 slide156 공고정보 dmt_pbancInfo. 실제 코드값은 상세설계 예정이라 의미값으로 임시 표기) */
  tndrSbmsnPntmCd?: 'pre' | 'post'

  // ── 진행 상태값 (버튼 분기·타이틀 상태표시 구동용) ───────────────────────────
  // ⚠️ 설계서 데이터영역 미정의(상세설계 예정) — 상태별 버튼 노출(slide68)/타이틀 표시를 구동하기 위한
  //    임시 항목(사용자 승인). 상세설계에서 영문 항목명이 확정되면 그 이름으로 교체한다.
  /** 입찰참가신청서 상태 (apfrStatNm) — '신청'|'미동의'. 등록확정은 bidRegCfmtnYn(설계서 항목)으로 판단 */
  apfrStatNm?: '신청' | '미동의'
  /** 입찰서 상태 (tndrStatNm) — '미제출'|'제출'|'완료'|'입찰취소' */
  tndrStatNm?: '미제출' | '제출' | '완료' | '입찰취소'
  /** 입찰참가등록반려 신청 여부 (regRjctYn) — false=신청전(등록반려 버튼)·true=신청후(반려신청조회 버튼) */
  regRjctYn?: boolean
  /** 사전심사(PQ) 결과 유무 (bfhdSrngRsltYn) — 결과 있을 때 사전심사 결과조회 버튼 노출 */
  bfhdSrngRsltYn?: boolean
  /** 기술평가 결과 유무 (techEvlRsltYn) — 결과 있을 때 기술평가 결과조회 버튼 노출 */
  techEvlRsltYn?: boolean
}

/**
 * 입찰공고 상세 응답 — 목록→상세 표준. 헤더/요약은 목록 아이템(BidPbancItem)과 동일 필드.
 * 상세 전용 섹션(일반정보/기초예비가격/품목명세서 등)은 추후 설계서 데이터영역 기준 확장.
 */
export type BidPbancDetail = BidPbancItem

/**
 * 입찰진행 상세 응답 — 목록→상세 표준. 목록 아이템(BidPrgrsItem) + 상세 전용(항목번호 clsfNo 등).
 */
export type BidPrgrsDetail = BidPrgrsItem & { clsfNo?: string }

/**
 * 이행/적격심사상세 – 일반정보 공고정보 (MUI-BD-10-M01, 설계서 slide166 데이터영역 dmt_pbancInfo).
 * 항목명(영문)·자리수는 설계서 그대로. 대표품명/비고는 콘텐츠 표시 항목(데이터영역 외).
 */
export interface ImpltElgbSrngPbancInfo {
  /** 입찰건명 (bidNm, 200) */
  bidNm: string
  /** 대표품명 — 콘텐츠 표시(데이터영역 외) */
  rprsCmdtyNm: string
  /** 지시년도 (drctnYr, 4) */
  drctnYr: string
  /** 공고번호 (pbancNo, 7) */
  pbancNo: string
  /** 통합참조번호 (rfrncNo, 13) */
  rfrncNo: string
  /** 발주기관 (orderInstNm, 200) */
  orderInstNm: string
  /** 판단번호 (prcmNo, 38) */
  prcmNo: string
  /** 항목번호 (clsfNo, 3) */
  clsfNo: string
  /** 계약방법 (ctrtMthdCd → 표시명) */
  ctrtMthdNm: string
  /** 입찰방법 (bidMthdCd → 표시명) */
  bidMthdNm: string
  /** 개찰일시 (bdopnDt) */
  bdopnDt: string
  /** 신청마감일시 (srngPrgrsDdlnDt) */
  srngPrgrsDdlnDt: string
  /** 적용양식 (cmdtyLbsvcElgbSrngCd → 표시명) */
  cmdtyLbsvcElgbSrngNm: string
  /** 비고 — 콘텐츠 표시(데이터영역 외) */
  rmrk: string
}

/**
 * 이행/적격심사상세 – 입찰결과 (MUI-BD-10-M02, 설계서 slide166 데이터영역 dmt_bidRslt).
 */
export interface ImpltElgbSrngBidRslt {
  /** 낙찰순위 (scsbdRnk, 10) */
  scsbdRnk: string
  /** 투찰금액 (bdngAmt, 17,2) — 표시 시 콤마 + ' 원' */
  bdngAmt: string
  /** 투찰률 (scbrt, 9,4) — (입찰가격-A)/(예정가격-A)*100. 표시 시 ' %' */
  scbrt: string
  /** 상태 (srngPrgrsStcd → 표시명) — 예: '대상통보' */
  srngPrgrsStNm: string
  /** 반려사유 (rjctRsn, 4000) — 반려 시에만 값 */
  rjctRsn: string
}

/**
 * 이행/적격심사결과상세 – 심사결과 (MUI-BD-10-M04 물품, 설계서 slide170 데이터영역 dmt_srngRslt).
 * 물품(Cmdty) 라벨 기준(제조능력=srngScr2, 재무상태=srngScr4). 용역/공사 등은 라벨만 상이.
 */
export interface ImpltElgbSrngResult {
  /** 이행실적 (srngScr1, 5,2) */
  srngScr1: string
  /** 제조능력 (srngScr2, 5,2) — 물품 라벨 */
  srngScr2: string
  /** 재무상태 (srngScr4, 5,2) — 물품 라벨 */
  srngScr4: string
  /** 입찰가격 (srngScr7, 5,2) — 표시 시 콤마 + ' 원' */
  srngScr7: string
  /** 신인도 (srngScr5, 5,2) */
  srngScr5: string
  /** 결격사유 (srngScr8, 5,2) */
  srngScr8: string
  /** 기타1 — slide169 표시 항목 */
  etc1: string
  /** 기타2 — slide169 표시 항목 */
  etc2: string
  /** 점수총계 (tscr, 15,2) — 표시 시 ' 점' */
  tscr: string
  /** 판정결과 (jgmtRsltCd → 표시명) */
  jgmtRsltNm: string
}

/**
 * 국외 입찰결과조회 요약(카드=상세 상단 공통, MUI-BD-09-M71 slide402 m_summary info).
 * 개찰목록 국외(단가제) 카드와 상세 상단이 동일 값을 공유 — 카드 클릭 시 navigate state 로 전달.
 */
export interface OvsBidRsltSummary {
  /** 업무구분 배지 (taskSeNm) — 국외 */
  taskSeNm: string
  /** 입찰유형 배지 (bidTypeNm) — 단가제 */
  bidTypeNm: string
  /** 입찰방식 배지 (bidMthdNm) — 경쟁입찰 */
  bidMthdNm: string
  /** 통합참조번호 (intgRfrncNo) — subtitle */
  intgRfrncNo: string
  /** 공고번호 (pbancNo) — subtitle */
  pbancNo: string
  /** 사업명 (bizNm) — title */
  bizNm: string
  /** 입찰업체 (bidBzentyNm) — 예: 'A 해외업체' */
  bidBzentyNm: string
  /** 구매요청번호 (prchsDmndNo) */
  prchsDmndNo: string
  /** 입찰참가등록마감일시 (regDdlnDt) */
  regDdlnDt: string
  /** 입찰서제출마감일시 (bdngDdlnDt) */
  bdngDdlnDt: string
  /** 개찰일자 (bdopnDt) */
  bdopnDt: string
}

/**
 * 국외 입찰결과조회 - 일반정보 (MUI-BD-09-M71, 설계서 slide403 일반 데이터 영역).
 * ⚠️ M71 데이터영역에 영문 항목명 미표기 → 국외 입찰서 상세(OvsTndrDtlItem) 관례 차용.
 * 개찰목록 국외(단가제) 카드 → 이 화면 진입. navigate state / 페이지 fallback 목업 타입.
 */
export interface OvsBidRsltGeneral {
  /** 공고번호 (pbancNo) — 예: 'EFD0007-2' */
  pbancNo: string
  /** 공고구분 (pbancSeNm) — 정상공고 등 */
  pbancSeNm: string
  /** 공고일자 (pbancDt) */
  pbancDt: string
  /** 구매요청번호 (prchsDmndNo) */
  prchsDmndNo: string
  /** 통합참조번호 (intgRfrncNo) */
  intgRfrncNo: string
  /** 사업명 (bizNm) — 요약 title */
  bizNm: string
  /** 입찰유형 (bidTypeNm) — 단가제/총액제 */
  bidTypeNm: string
  /** 입찰매체 (bidMdmNm) — 전자입찰 등 */
  bidMdmNm: string
  /** 계약방법 (ctrtMthdNm) — 일반경쟁 등 */
  ctrtMthdNm: string
  /** 입찰방식 (bidMth) — 일반투찰 등 */
  bidMth: string
  /** 총금액 (totAmt) — USD 표시(예: '$ 126,000.18') */
  totAmt: string
  /** 환율적용일자 (exchrtAplcnYmd) */
  exchrtAplcnYmd: string
  /** 공고 품목수 (pbancItemCnt) */
  pbancItemCnt: string
  /** 개찰일시 (bdopnDt) */
  bdopnDt: string
  /** 입찰참가등록마감일시 (regDdlnDt) */
  regDdlnDt: string
  /** 입찰서제출마감일시 (bdngDdlnDt) */
  bdngDdlnDt: string
  /** 담당 부서명 (picDeptNm) */
  picDeptNm: string
  /** 담당자 (picNm) */
  picNm: string
  /** 연락처 유선 (picTlno) */
  picTlno: string
  /** 연락처 휴대 (picMblTelno) */
  picMblTelno: string
}

/**
 * 국외 입찰결과조회 - 입찰결과(단가제) 목록 1건 (MUI-BD-09-M72, 설계서 slide404 입찰결과 단가제 데이터영역).
 */
export interface OvsBidRsltUnitPriceItem {
  /** 항목번호 (clsfNo) */
  clsfNo: string
  /** 품명 (prdctNm) — 예: '500MD' */
  prdctNm: string
  /** 재고번호 (stckNo) */
  stckNo: string
  /** 부품번호 (partNo) */
  partNo: string
  /** 단위 (unit) — 예: 'EA' */
  unit: string
  /** 수량 (qty) */
  qty: string
  /** 지시단가 (drctnUprc) — 원 */
  drctnUprc: string
  /** 입찰단가 (bidUprc) — 원 */
  bidUprc: string
  /** 달러단가 (usdUprc) — USD */
  usdUprc: string
  /** 달러금액 (usdAmt) — USD */
  usdAmt: string
  /** 입찰결과 (bidRsltNm) — 낙찰/조건부/동가낙찰 */
  bidRsltNm: string
}

/**
 * 국외 입찰결과조회 - 입찰결과(총액제) 목록 1건 (MUI-BD-09-M73, 설계서 slide405 입찰결과 총액제 데이터영역).
 * 총액제는 업체별 결과(입찰업체/사업자번호/지시금액/입찰금액/달러금액/입찰결과). 현황 요약 없음.
 */
export interface OvsBidRsltTotalItem {
  /** 순번 (seq) — 목록 key. ⚠️ 설계서 미표기, React key 용 */
  seq: string
  /** 입찰업체 (bidBzentyNm) — 예: 'A 국외업체' */
  bidBzentyNm: string
  /** 사업자번호 (bizRegNo) — 예: '123-45-67890' */
  bizRegNo: string
  /** 지시금액 (drctnAmt) — 원 */
  drctnAmt: string
  /** 입찰금액 (bidAmt) — 원 */
  bidAmt: string
  /** 달러금액 (usdAmt) — USD */
  usdAmt: string
  /** 입찰결과 (bidRsltNm) — 낙찰/조건부 낙찰/동가 낙찰/유찰 */
  bidRsltNm: string
}

/**
 * 국외 입찰결과현황(단가제) 요약 (MUI-BD-09-M72, 설계서 slide404 입찰결과현황 데이터영역).
 * 결과품목 소계(건수) + 원/달러 금액 소계 — 낙찰/조건부/동가낙찰/소계.
 */
export interface OvsBidRsltUnitPriceStatus {
  /** 총 참여품목수 (totItemCnt) */
  totItemCnt: string
  /** 총 낙찰 (totScsbdCnt) */
  totScsbdCnt: string
  /** 결과품목 건수 — 낙찰/조건부/동가낙찰/소계 */
  cnt: { scsbd: string; cndl: string; eqv: string; sub: string }
  /** 화폐금액(원) — 낙찰/조건부/동가낙찰/소계 */
  krw: { scsbd: string; cndl: string; eqv: string; sub: string }
  /** 달러금액(USD) — 낙찰/조건부/동가낙찰/소계 */
  usd: { scsbd: string; cndl: string; eqv: string; sub: string }
}

/**
 * 국외 공개수의협상계획상세 요약(카드=상세 상단 공통, MUI-BD-12-M71 slide411).
 * 개찰목록 국외·수의계약 카드 → 이 화면 진입(수의계약 배지 조건일 때만). navigate state.
 * ⚠️ 영문 항목명 = 국외 상세(OvsTndrDtl/OvsBidRslt) 관례 차용(설계서 데이터영역 영문 미표기).
 */
export interface OvsRlsVltrnsSummary {
  /** 업무구분 배지 (taskSeNm) — 국외. UI 배지값(설계서 데이터영역 항목 아님) */
  taskSeNm: string
  /** 계약방법 배지 (ctrtMthdNm) — 수의계약 */
  ctrtMthdNm: string
  /** 통합참조번호 (intgRfrncNo) — subtitle */
  intgRfrncNo: string
  /** 공고번호 (pbancNo) — subtitle */
  pbancNo: string
  /** 사업명 (bizNm) — title */
  bizNm: string
  /** 구매요청번호 (prchsDmndNo) */
  prchsDmndNo: string
  /** 총금액 (sumDrctnAmt) — USD 표시 */
  sumDrctnAmt: string
  /** 견적서제출마감일시 (etdcDdlnDt) */
  etdcDdlnDt: string
  /** 개찰일자 (bdopnDt) */
  bdopnDt: string
}

/** 국외 공개수의협상계획상세 - 일반정보 (MUI-BD-12-M71/T71, slide412 공고일반). */
export interface OvsRlsVltrnsGeneral {
  pbancNo: string
  /** 공고구분 (pbancType) */
  pbancType: string
  /** 공고일자 (pbancRqstYmd) */
  pbancRqstYmd: string
  prchsDmndNo: string
  intgRfrncNo: string
  /** 사업명 (bizNm) */
  bizNm: string
  /** 계약방법 (ctrtMthdNm) */
  ctrtMthdNm: string
  /** 총금액 (sumDrctnAmt) — USD */
  sumDrctnAmt: string
  /** 공고품목수 (itemQty) */
  itemQty: string
  /** 환율적용일자 (exchrtAplcnYmd) */
  exchrtAplcnYmd: string
  /** 개찰일시 (bdopnDt) */
  bdopnDt: string
  /** 견적서제출마감일시 (etdcDdlnDt) */
  etdcDdlnDt: string
  /** 담당부서 (picDeptNm) */
  picDeptNm: string
  /** 담당자 (picNm) */
  picNm: string
  /** 연락처 (picTlno) */
  picTlno: string
  /** 휴대번호 — UI 표기용(설계서 데이터영역에 대응 항목 없음, 연락처=picTlno 1개) */
  picMblTelno: string
}

/** 국외 공개수의협상계획상세 - 품목정보 목록 1건 (MUI-BD-12-M72/T72, slide413 품목목록). */
export interface OvsRlsVltrnsItem {
  /** 항목번호 (clsfNo) */
  clsfNo: string
  /** 품질등급 (qltyGrd) — 예: 'A' */
  qltyGrd: string
  /** 첨부문서 유무 (atchDocYn) — 예: 'O' */
  atchDocYn: string
  /** 재고번호 (stckNo) */
  stckNo: string
  /** 부품번호 (partNo) */
  partNo: string
  /** 규격번호 (specNo) */
  specNo: string
  /** 품명 (prdctNm) */
  prdctNm: string
  /** 납기기준일자 (dlvyBaseYmd) */
  dlvyBaseYmd: string
  /** 단위 (unit) */
  unit: string
  /** 본조수량 (mainQty) */
  mainQty: string
  /** 당국수량 (currQty) */
  currQty: string
  /** 장국수량 (futrQty) */
  futrQty: string
  /** 본조예산 (mainBdgt) — 원 */
  mainBdgt: string
  /** 당국예산 (currBdgt) — 원 */
  currBdgt: string
  /** 장국예산 (futrBdgt) — 원 */
  futrBdgt: string
  /** 수량합계 (qtySum) */
  qtySum: string
  /** 화폐단위 (crncyUnit) — 예: '미 달러' */
  crncyUnit: string
  /** 지시단가 (drctnUprc) */
  drctnUprc: string
  /** 지시금액 (drctnAmt) */
  drctnAmt: string
  /** 장비부호 (equipCd) */
  equipCd: string
  /** 장비명 (equipNm) */
  equipNm: string
}

/**
 * 국외 공개수의협상 견적서 업체정보 (작성 M75/slide421 · 조회 M79/slide431·434~435).
 * 항목명 = 설계서 데이터영역 영문(dm_aplyBzenty / dm_bidBzenty).
 */
export interface OvsRlsVltrnsEtdcBzenty {
  /** 신청업체 (dm_aplyBzenty) */
  aply: {
    /** 업체코드 (sbtBzentyCd) */
    sbtBzentyCd: string
    /** 업체명 (sbtBzentyNm) */
    sbtBzentyNm: string
    /** 대표자 (sbtRprsvNm) */
    sbtRprsvNm: string
    /** 전화번호 (sbtTlno) */
    sbtTlno: string
    /** 팩스 (sbtFxno) */
    sbtFxno: string
    /** 사업자번호 (sbtBzmnNo) — 사업자등록번호 또는 DUNS NUM */
    sbtBzmnNo: string
    /** 주소 (sbtAddr) */
    sbtAddr: string
  }
  /** 입찰업체 (dm_bidBzenty) */
  bid: {
    /** 업체코드 (splyBzentyCd) */
    splyBzentyCd: string
    /** 업체명 (splyBzentyNm) */
    splyBzentyNm: string
    /** 대표자 (splyRprsvNm) */
    splyRprsvNm: string
    /** 이메일 (splyEmlAddr) */
    splyEmlAddr: string
    /** 전화번호 (splyTlno) */
    splyTlno: string
    /** 팩스 (splyFxno) */
    splyFxno: string
    /** 사업자번호 (splyBzmnNo) — 사업자등록번호 또는 DUNS NUM */
    splyBzmnNo: string
    /** 주소 (splyAddr) */
    splyAddr: string
  }
}

/** 국외 공개수의협상견적서제출 - 스탭3 입찰참여품목(단가제) 1건 (MUI-BD-12-M76/T76, slide422·435). 항목명 = 설계서 데이터영역 영문(dl_bidItemList). */
export interface OvsRlsVltrnsEtdcItem {
  /** 항목번호 (frcptlArtclNo) */
  frcptlArtclNo: string
  /** 재고번호 (invtNo) */
  invtNo: string
  /** 부품번호 (prtsNo) */
  prtsNo: string
  /** 품명 (itemNm) */
  itemNm: string
  /** 단위 (unitNm) */
  unitNm: string
  /** 수량 (qty) */
  qty: string
  /** 지시단가 (drctnUntprc) */
  drctnUntprc: string
  /** 화폐단위 (crncNm) — 예: '미 달러' */
  crncNm: string
  // ── 입력 항목(견적 작성) ──
  /** 품목대체구분 (itemSbstSe) — 'Y'|'N'. Y 시 수정재고/부품번호·대체첨부문서 입력 */
  itemSbstSe: 'Y' | 'N'
  /** 수정재고번호 (mdfcnInvtNo) — itemSbstSe=Y 입력 */
  mdfcnInvtNo: string
  /** 수정부품번호 (mdfcnPrtsNo) — itemSbstSe=Y 입력 */
  mdfcnPrtsNo: string
  /** 견적단가 (estmtUntprc) — 입력 */
  estmtUntprc: string
}

/**
 * 국외 공개수의협상견적서상세(조회) - 입찰품목 1건 (MUI-BD-12-M80/T80, slide432·435).
 * 항목명 = 설계서 데이터영역 영문(dl_bidItemList). 읽기전용 표시값. itemSbstSe='Y' 시 품목대체첨부문서·수정재고/부품번호 노출.
 */
export interface OvsRlsVltrnsEtdcDtlItem {
  /** 항목번호 (frcptlArtclNo) */
  frcptlArtclNo: string
  /** 재고번호 (invtNo) */
  invtNo: string
  /** 부품번호 (prtsNo) */
  prtsNo: string
  /** 품명 (itemNm) */
  itemNm: string
  /** 단위 (unitNm) */
  unitNm: string
  /** 수량 (qty) */
  qty: string
  /** 지시단가 (drctnUntprc) */
  drctnUntprc: string
  /** 품목대체구분 (itemSbstSe) — 'Y'|'N' */
  itemSbstSe: 'Y' | 'N'
  /** 품목대체첨부문서 파일명 (itemSbstDocEn) — itemSbstSe='Y' 시 값 (예: 'File.pdf') */
  itemSbstDocEn: string
  /** 수정재고번호 (mdfcnInvtNo) — itemSbstSe='Y' 시 값 */
  mdfcnInvtNo: string
  /** 수정부품번호 (mdfcnPrtsNo) — itemSbstSe='Y' 시 값 */
  mdfcnPrtsNo: string
  /** 견적단가 (estmtUntprc) */
  estmtUntprc: string
  /** 견적금액 (estmtAmt) */
  estmtAmt: string
  /** 화폐단위 (crncNm) — 예: 'USD (미 달러)' */
  crncNm: string
}

/** 국외 공개수의협상계획상세 - 첨부서류 1건 (MUI-BD-12-M73/T73, slide414 첨부파일). */
export interface OvsRlsVltrnsAtchDoc {
  /** 식별자 (id) — 목록 key */
  id: string
  /** 구분 (docSeNm) — 공고문안/일반조건/특수조건/기타첨부 */
  docSeNm: string
  /** 첨부파일명 (fileNm) */
  fileNm: string
  /** 파일크기 (fileSz) */
  fileSz: string
}

/**
 * 신청서 작성 플로우 종류 — 전자서명(M21)/신청완료(M08)의 표시 텍스트 분기 구동값.
 * 설계서 slide132·133: "사전심사(PQ), 입찰참가신청, 입찰서에 따라 표시 텍스트 변경".
 */
export type AplyFlowType = 'pq' | 'apfr' | 'tndr'

/**
 * 전자서명(MUI-BD-04-M21)·신청완료(MUI-BD-06-M08) 진입 시 navigate state.
 * 견적서작성하기/입찰참가신청서 제출 → 전자서명(Elsgn) → 신청완료(AplyCmptn) 로 흐른다.
 */
export interface AplyFlowState {
  /** 요약 헤더 구동용 입찰진행 항목 */
  detail: BidPrgrsItem
  /** 작성 유형 — 사전심사(PQ)/입찰참가신청/입찰서. 표시 텍스트 분기 */
  aplyType: AplyFlowType
  // ── 신청완료(M08) 표시 항목 ───────────────────────────────────────────────
  // ⚠️ 설계서 데이터영역 미정의(상세설계 예정) — 신청완료 표시용 임시 항목(사용자 승인 rcptNo/rcptDt).
  //    상세설계에서 영문 항목명이 확정되면 그 이름으로 교체한다.
  /** 접수번호 (rcptNo) — 예: '0000 000 0000' */
  rcptNo?: string
  /** 접수일시 (rcptDt) — 예: '2025-10-31 12:30' */
  rcptDt?: string
}
