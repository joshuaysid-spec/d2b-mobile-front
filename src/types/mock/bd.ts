// 입찰(BD, MUI-BD) 도메인 타입. Design Ref: 02입찰 설계서 1.1~1.4 (MUI-BD-01-M01 입찰공고통합목록).
// 검색조건 value 는 검색필터 공통 value 타입(SearchFilterValue)을 그대로 alias (캐스팅 불필요).
import type { SearchFilterValue } from '@/types/search-filter'

export type BidSearchFilter = SearchFilterValue

/**
 * 입찰공고 통합목록 카드 1건 (MUI-BD-01-M01) — PC 실 인터페이스
 * `TempbidPbancIntgList.IBidPbancList`(2026-08-24 판독본) 키/타입 그대로.
 * 구 설계서 dlt_bidPbancIntgList 임시 키(g2BBidPbancNo/rprsItemNm/brprc 등) 전량 교체.
 * 식별자는 pbancNo(+pbancOd) — 카드 key 는 rnum.
 */
export interface BidPbancItem {
  /** 순번 (rnum) */
  rnum: string
  /** 조달번호 (prcmNo) */
  prcmNo: string
  /** 업무구분 (taskSeCd) */
  taskSeCd: string
  /** 업무구분명 (taskSeNm) — 물품/용역/공사/국외. 카드 클릭 시 국내/국외 상세 라우팅 분기 구동 */
  taskSeNm: string
  /** 사업영역코드 (bizRlmCd) */
  bizRlmCd: string
  /** 업무영역코드 (taskRlmCd) */
  taskRlmCd: string
  /** 입찰구분 (bidSeCd) */
  bidSeCd: string
  /** 입찰구분명 (bidSeNm) — 경쟁입찰/공개수의. 카드 뱃지 */
  bidSeNm: string
  /** g2b공고번호 (g2bPbancNoOd) — 카드 subtitle */
  g2bPbancNoOd: string
  /** 공고구분 (pbancSeCd) */
  pbancSeCd: string
  /** 공고구분명 (pbancSeNm) — 정상공고/정정공고/취소공고/긴급공고 등. 상태 뱃지 */
  pbancSeNm: string
  /** 공고년도 (drctnYr) */
  drctnYr: string
  /** 공고번호 (pbancNo) — 상세 조회 식별자 */
  pbancNo: string
  /** 공고차수 (pbancOd) */
  pbancOd: string
  /** 공고일자 (pbancYmd) */
  pbancYmd: string
  /** 기관입찰공고번호 (instBidPbancNo) */
  instBidPbancNo: string
  /** 입찰공고차수 (bidPbancOd) */
  bidPbancOd: string
  /** 통합참조번호 (intgRfrncNo) */
  intgRfrncNo: string
  /** 판단번호 (jdgmtNo) */
  jdgmtNo: string
  /** 공고/통합참조번호 (anmtNum) */
  anmtNum: string
  /** 입찰건명 (bizNm) — 카드 title(2줄 말줄임) */
  bizNm: string
  /** 발주기관코드 (deptCd) */
  deptCd: string
  /** 발주기관명 (deptNm) */
  deptNm: string
  /** 구매요청번호 (prchsDmndNo) */
  prchsDmndNo: string
  /** 계약방법코드 (ctrtMthdCd) */
  ctrtMthdCd: string
  /** 계약방법명 (ctrtMthdNm) */
  ctrtMthdNm: string
  /** 입찰방법 (bidMthdCd) */
  bidMthdCd: string
  /** 입찰방법명 (bidMthdNm) */
  bidMthdNm: string
  /** 입찰참가마감일시 (bidRegDdlnDt) */
  bidRegDdlnDt: string
  /** 입찰서제출마감일시 (tndrSbmsnDdlnDt) */
  tndrSbmsnDdlnDt: string
  /** 개찰일시 (bdopnDt) */
  bdopnDt: string
  /** 기초예가상태 (bsicStat) */
  bsicStat: string
  /** 기초예가적용여부 (bidPrtcpQlfcYn) */
  bidPrtcpQlfcYn: string
  /** 기초예가금액 (bsicExpt) — 표시 시 천단위 콤마 + ' 원' */
  bsicExpt: string
  /** 기초예가메세지 (bsicExptMsg) */
  bsicExptMsg: string
  /** 입찰구분형태코드 (bidShpSeCd) */
  bidShpSeCd: string
  /** 입찰구분형태명 (bidShpSeNm) */
  bidShpSeNm: string
  /** 공고취소여부 (pbancRtrcnYn) */
  pbancRtrcnYn: string
  /** 입찰구분Text (bidSeNmText) */
  bidSeNmText: string
  /** g2b공고번호차수Text (g2bPbancNoOdText) */
  g2bPbancNoOdText: string
  /** 입찰참가등록마감일시Text (bidRegDdlnDtText) */
  bidRegDdlnDtText: string
  /** 계약방법Text (ctrtMthdNmText) */
  ctrtMthdNmText: string
  /** 공고일자Text (pbancYmdText) */
  pbancYmdText: string
  /**
   * 진행단계 — 단계표시기(StepBar) 구동값(조달/입찰/계약/이행/대금청구).
   * ⚠️ 실 인터페이스(IBidPbancList) 미존재 — 단계표시기 구동용 임시(사용자 승인 유지).
   */
  prgrsStg?: string
  /**
   * 생산능력제출마감일시 (prdcpIdntySmdocDdlnDt) — 카드/상세 요약 표시행.
   * ⚠️ 실 인터페이스(IBidPbancList) 미존재 — 구 설계서 항목명 유지(원본 대조 필요).
   */
  prdcpIdntySmdocDdlnDt?: string
}

/**
 * 입찰공고 통합목록 검색 요청 (MUI-BD-01-M01/M02) — PC 실 인터페이스
 * `TempbidPbancIntgList.ISrchMap`/`ISearchParam`(2026-08-24 판독본, 동일 필드 구성) 키 그대로.
 * 현재 목록 화면은 클라이언트 필터라 미전송 — 서버 검색 전환 시 SearchFilterValue → 이 맵으로 변환.
 */
export interface BidPbancListSrchMap {
  /** 탭구분 (tabSeCd) */
  tabSeCd?: string
  /** 업무구분 (taskSeCd) */
  taskSeCd?: string
  /** 검색일자구분 (srchYmdSe) */
  srchYmdSe?: string
  /** 검색시작일자 (srchBgngYmd) */
  srchBgngYmd?: string
  /** 검색종료일자 (srchEndYmd) */
  srchEndYmd?: string
  /** 발주기관명 (deptCdNm) */
  deptCdNm?: string
  /** 발주기관코드 (deptCd) */
  deptCd?: string
  /** 입찰건명 (bidPbancNm) */
  bidPbancNm?: string
  /** 검색번호구분 (srchNoSeCd) */
  srchNoSeCd?: string
  /** 검색번호 (srchNo) */
  srchNo?: string
  /** 공고구분 (pbancSeCd) */
  pbancSeCd?: string
  /** 입찰구분 (bidSeCd) */
  bidSeCd?: string
  /** 진행상태 (prgrsSttsCd — 판독본 한글명 '공고구분' 표기는 오기로 보임) */
  prgrsSttsCd?: string
  /** 지역명 (rgnNm) */
  rgnNm?: string
  /** 지역코드 (rgnCd) */
  rgnCd?: string
  /** 면허정보명 (lcnsInfoNm) */
  lcnsInfoNm?: string
  /** 면허정보코드 (lcnsInfoCd) */
  lcnsInfoCd?: string
  /** 품목명 (itemNm) */
  itemNm?: string
  /** 품목코드 (itemCd) */
  itemCd?: string
  /** 군구분 (miltSeCd) */
  miltSeCd?: string
  /** 기능 (fwkCd) */
  fwkCd?: string
  /** 조달요청기관코드 (prcmRqtInstCd — 판독본 한글명 '군구분') */
  prcmRqtInstCd?: string
  /** 입찰매체 (bidMediaCd) */
  bidMediaCd?: string
  /** 추정가격MIN (prsmpPrprcMin) */
  prsmpPrprcMin?: string
  /** 추정가격MAX (prsmpPrprcMax) */
  prsmpPrprcMax?: string
  /** 입찰형태구분코드 (bidShpSeCd) */
  bidShpSeCd?: string
  /** 계약방법 (ctrtMthdCd) */
  ctrtMthdCd?: string
  /** 낙찰방법 (scsbdMthdCd) */
  scsbdMthdCd?: string
  /** 신기술여부 (ntchYn) */
  ntchYn?: string
  /** 국외공고번호 (ovsPbancNo) */
  ovsPbancNo?: string
}

/**
 * 개찰목록 카드 1건 (MUI-BD-08-M01, 설계서 02입찰 slide144 Layout).
 * "개찰일시가 도래한 이후 개찰 처리 및 결과를 확인하기 위한 통합 목록조회 화면."
 * 카드 표시는 입찰공고 목록과 동일 스타일이나, 정보행은 설계서대로 공고일자·개찰일시 2행만 사용.
 * 필드명·코드값·형식은 설계서 그대로 — 목업이지만 실제 API 응답처럼 구성(추후 bdService.selectBdopnList 매핑).
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
  /**
   * 이행/적격심사결과 탭 유형 판별 임시 키 ([[ImpltElgbSrngTyCd]]).
   * ⚠️ TODO(설계서 영문ID 미확인 — 임시 확정, BD 선례): 설계서(02입찰 v1.83)에 유형 판별용 코드 항목이
   *   정의돼 있지 않아 신 화면ID 소문자('t04'~'t21')로 임시 부여. 값 없으면 심사결과 탭은 물품(t05) 기본.
   */
  srngTyCd?: ImpltElgbSrngTyCd
  /**
   * 이행/적격심사 상태 ('심사포기' 등) — 포기신청 팝업의 작성(P02)/조회(P03) 분기용.
   * ⚠️ TODO(설계서 영문ID 미확인 — 임시 키, BD 상태필드 선례): slide274 비고 "이행/적격심사 상태가
   *   심사포기인 경우 조회 항목으로 속성 변경" 만 있고 상태 항목 자체는 데이터영역에 정의돼 있지 않다.
   */
  impltElgbSrngStatNm?: string
}
/**
 * 입찰진행 목록 카드 1건 (MUI-BD-03-M01, 설계서 02입찰 v1.83 slide69 화면 · slide71 데이터영역 dlt_bidPrgrsList).
 * "조달업체가 신청한 입찰 내역" — 항목명/코드값 설계서 그대로(추후 bdService.selectBidPrgrsListForBzenty 매핑).
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
  /** 입찰참가등록마감일시 (bidClrsDt) — 카드 '입찰참가신청 마감일시' 행 */
  bidClrsDt: string
  /** 입찰서접수마감일시 (tndrSbmsnDdlnDt) — 카드 '입찰서제출마감일시' 행 */
  tndrSbmsnDdlnDt: string
  /** 업체구분 (bzentySeNm) — 대표/구성 */
  bzentySeNm: string
  /**
   * 공고일자 (pbancYmd, 8자리 yyyy-MM-dd) — 카드 1행. 진행일 도래 판정 기준(미도래 시 상세 진입 차단).
   * ⚠️ 목록 데이터영역(dlt_bidPrgrsList, slide71)엔 미정의 — 카드 표시가 요구하는 항목이라
   *   설계서 타 데이터영역의 확정 항목명(slide150·151 공고일자 pbancYmd)을 그대로 재사용(BD 임시키 관례).
   */
  pbancYmd?: string
  /**
   * 개찰일시 (bdopnDt, yyyy-MM-dd HH:mm) — 카드 4행.
   * ⚠️ dlt_bidPrgrsList 미정의 — 설계서 확정 항목명(slide119·132 개찰일시 bdopnDt) 재사용.
   */
  bdopnDt?: string
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
  /**
   * 입찰참가신청서 상태 (apfrStatNm) — 설계서 slide169 상태값 흐름 그대로.
   *   '신청'                        → 신청서 작성(MUI-BD-04-M01)
   *   '신청완료'|'미동의'|'동의완료' → 입찰참가신청조회(MUI-BD-04-M22)
   *   등록불가/등록확정/반려        → 입찰등록심사 결과조회(MUI-BD-03-M05).
   *     등록확정은 bidRegCfmtnYn, 반려는 regRjctYn(설계서 항목)으로 판단.
   */
  apfrStatNm?: '신청' | '신청완료' | '미동의' | '동의완료'
  /** 입찰서 상태 (tndrStatNm) — '미제출'|'제출'|'완료'|'입찰포기'|'입찰취소'. 포기/취소는 신청서 조회(P09/P10) 분기 */
  tndrStatNm?: '미제출' | '제출' | '완료' | '입찰포기' | '입찰취소'
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
 * 이행/적격심사상세 – 일반정보 공고정보 (MUI-BD-10-T01(구 M01 — v1.83 재편), 설계서 slide166 데이터영역 dmt_pbancInfo).
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
 * 이행/적격심사상세 – 입찰결과 (MUI-BD-10-T02(구 M02 — v1.83 재편), 설계서 slide166 데이터영역 dmt_bidRslt).
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
 * 이행/적격심사결과상세 – 심사결과 (MUI-BD-10-T05(구 M04 — v1.83 재편) 물품, 설계서 slide170 데이터영역 dmt_srngRslt).
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

// ── 이행/적격심사결과 유형별 심사결과 탭 (MUI-BD-10-T04~T21, 설계서 02입찰 v1.83 slide173~282) ────────
// 입찰결과상세에서 이행/적격심사결과가 있을 때 노출되는 '심사결과' 탭. 유형(물품/용역/공사/중기청 계열/폐기물용역 등)
// 18종으로 갈리며, 구조가 3가지 family(A: flat srngScr 표 · B/C: 심사분야 채점 루브릭)로 나뉜다.

/**
 * 심사결과 탭 유형 판별 임시 키 (신 화면ID 소문자).
 * ⚠️ TODO(설계서 영문ID 미확인 — 임시 확정, BD 선례 apfrStatNm/tndrStatNm 등과 동일 방식):
 *   설계서에 유형 판별 코드 항목이 없어 't04'~'t21'로 임시 부여. 값 없으면 물품(t05) 기본.
 * - t04 통사(g2b, 설계서 디자인 슬라이드 부재로 보류) · t05 물품(기구현 [[Implt]]) · t06 용역
 * - t07~t16 중기청 계열(10억미만 물품/제조/구매 연·고시금액) · t17 공사 · t18 기술용역
 * - t19 3억미만공사 · t20 고시금액미만용역 · t21 고시금액미만폐기물용역
 */
export type ImpltElgbSrngTyCd =
  | 't04' | 't05' | 't06' | 't07' | 't08' | 't09' | 't10' | 't11' | 't12'
  | 't13' | 't14' | 't15' | 't16' | 't17' | 't18' | 't19' | 't20' | 't21'

/**
 * A군(물품/용역/공사/기술용역) 심사결과 값 — 데이터영역 dmt_srngRslt(srngScr1~8 + 총계/판정).
 * 8개 심사항목의 라벨은 유형별로 다르나(용역/공사/기술용역은 srngScr1~8 = 표시 순서) 값 형식은 공통.
 * 물품(T05)만 표시 라벨이 데이터영역과 달라 기존 [[ImpltElgbSrngResult]]를 그대로 사용(재작성 금지).
 * 값 형식: srngScr* = 5,2 · 입찰가격 열은 콤마+' 원' · tscr = 15,2(' 점') · jgmtRsltNm = 판정명.
 */
export interface ImpltElgbSrngScoreSet {
  srngScr1: string
  srngScr2: string
  srngScr3: string
  srngScr4: string
  srngScr5: string
  srngScr6: string
  srngScr7: string
  srngScr8: string
  /** 점수총계 (tscr, 15,2) */
  tscr: string
  /** 판정결과 (jgmtRsltCd → 표시명) */
  jgmtRsltNm: string
}

/**
 * B/C군 심사 루브릭 한 행 — 심사항목/배점(만점)/심사평점(내 업체 점수).
 * ⚠️ 심사항목은 설계서에 영문 항목명 미표기(한글 라벨만) → 표시 전용 문자열로 둔다(신규 키 신설 안 함).
 * 배점/평점 미확정은 undefined → 화면에서 '-'.
 */
export interface ImpltElgbSrngRubricRow {
  /** 심사항목 라벨 (설계서 한글 그대로) */
  item: string
  /** 배점(만점) — 설계서 표기(예: '30', '+3 ~ -2') */
  allot?: string
  /** 심사평점 — 내 업체 점수(목업; 추후 scwin.getImpltElgbSrngRsltDtlInfo) */
  score?: string
}

/**
 * B/C군 심사분야(대분류) 단위 섹션 — 예: 'I. 당해물품납품이행능력' / '(가) 당해물품 납품이행능력'.
 * 하위 심사항목 rows 를 아코디언 1섹션 + 표 1개로 렌더.
 */
export interface ImpltElgbSrngRubricSection {
  /** 심사분야명 */
  field: string
  /** 분야 소계 배점(있으면 타이틀 우측 표기) */
  allot?: string
  rows: ImpltElgbSrngRubricRow[]
}

/**
 * 유형별 심사 루브릭 (B/C군) — 심사분야 섹션들 + 총계/판정.
 * 공용 렌더러 [[ImpltElgblRsltRubric]]가 이 데이터를 아코디언+표로 렌더한다.
 */
export interface ImpltElgbSrngRubric {
  sections: ImpltElgbSrngRubricSection[]
  /** 점수총계(심사평점 계) */
  tscr?: string
  /** 판정결과(적격/부적격 등) */
  jgmtRsltNm?: string
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
 * 국외 입찰결과조회 - 일반정보 (MUI-BD-09-T71(구 M71 — v1.83 재편), 설계서 slide403 일반 데이터 영역).
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
 * 국외 입찰결과조회 - 입찰결과(단가제) 목록 1건 (MUI-BD-09-T72(구 M72 — v1.83 재편), 설계서 slide404 입찰결과 단가제 데이터영역).
 * TODO(원본 대조): PC 실 인터페이스 판독본(ovsBidRslt.IResultUnitPrice)은 col1~col11 자리표시 키
 * (지시단가/입찰단가/달러단가/달러금액/입찰결과)라 실키로 볼 수 없어 미반영 — PC 확정 시 교체.
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
 * 국외 입찰결과조회 - 입찰결과(총액제) 목록 1건 (MUI-BD-09-T73(구 M73 — v1.83 재편), 설계서 slide405 입찰결과 총액제 데이터영역).
 * 총액제는 업체별 결과(입찰업체/사업자번호/지시금액/입찰금액/달러금액/입찰결과). 현황 요약 없음.
 * TODO(원본 대조): PC 판독본(ovsBidRsltDtl.IResultUnitPrice)도 col1~col9 자리표시 키라 미반영.
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
 * 국외 입찰결과현황(단가제) 요약 (MUI-BD-09-T72(구 M72 — v1.83 재편), 설계서 slide404 입찰결과현황 데이터영역).
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

/** 국외 공개수의협상계획상세 - 일반정보 (MUI-BD-12-T71(구 M71 — v1.83 재편), slide412 공고일반). */
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

/** 국외 공개수의협상계획상세 - 품목정보 목록 1건 (MUI-BD-12-T72(구 M72 — v1.83 재편), slide413 품목목록). */
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

/** 국외 공개수의협상견적서제출 - 스탭3 입찰참여품목(단가제) 1건 (MUI-BD-12-T76(구 M76 — v1.83 재편), slide422·435). 항목명 = 설계서 데이터영역 영문(dl_bidItemList). */
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
 * 국외 공개수의협상견적서상세(조회) - 입찰품목 1건 (MUI-BD-12-T80(구 M80 — v1.83 재편), slide432·435).
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

/** 국외 공개수의협상계획상세 - 첨부서류 1건 (MUI-BD-12-T73(구 M73 — v1.83 재편), slide414 첨부파일). */
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
 * 국외 공개수의협상결과조회 - 상단 요약 (MUI-BD-12-M83, slide441).
 * 배지 국외/수의계약/입찰유형 + subtitle(통합참조번호·공고번호) + title(사업명) + 요약행(입찰업체·구매요청번호·공고일자·개찰일자).
 */
export interface OvsRlsVltrnsSrngRsltSummary {
  /** 업무구분 배지 (taskSeNm) — 국외. UI 배지값 */
  taskSeNm: string
  /** 계약방법 배지 (ctrtMthdNm) — 수의계약 */
  ctrtMthdNm: string
  /** 입찰유형 배지 (bidTypeNm) — 단가제 */
  bidTypeNm: string
  /** 통합참조번호 (intgRfrncNo) — subtitle */
  intgRfrncNo: string
  /** 공고번호 (pbancNo) — subtitle */
  pbancNo: string
  /** 사업명 (bizNm) — title */
  bizNm: string
  /** 입찰업체명 (splyBzentyNm) — 요약행 */
  splyBzentyNm: string
  /** 구매요청번호 (prchsDmndNo) — 요약행 */
  prchsDmndNo: string
  /** 공고일자 (pbancRqstYmd) — 요약행 */
  pbancRqstYmd: string
  /** 개찰일자 (bdopnDt) — 요약행 */
  bdopnDt: string
}

/**
 * 국외 공개수의협상결과조회 - 조회결과 1건 (MUI-BD-12-T83(구 M83 — v1.83 재편), slide443·445).
 * 항목명 = 설계서 데이터영역 영문(dl_bidRsltList).
 */
export interface OvsRlsVltrnsSrngRsltItem {
  /** 순번 (no) */
  no: string
  /** 신청업체코드 (sbtBzentyCd) */
  sbtBzentyCd: string
  /** 신청업체명 (sbtBzentyNm) */
  sbtBzentyNm: string
  /** 입찰업체코드 (splyBzentyCd) */
  splyBzentyCd: string
  /** 입찰업체명 (splyBzentyNm) */
  splyBzentyNm: string
  /** 제출서류 유무 (docSbmsnYn) — 'O'|'X' */
  docSbmsnYn: string
  /** 견적금액 (estmtAmt) */
  estmtAmt: string
  /** 화폐단위 (crncNm) */
  crncNm: string
  /** 순위 (rnk) */
  rnk: string
  /** 낙찰여부 (scsbdYn) — 낙찰/탈락 */
  scsbdYn: string
  /** 탈락사유 (rsn) */
  rsn: string
  /** 계약포기일자 (abndDt) */
  abndDt: string
  /** 계약포기사유 (abndRsn) */
  abndRsn: string
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

// ── 국외 입찰공고 상세 (MUI-BD-01-M71 · T71~T73(구 M71~M73 — v1.83 재편), 설계서 slide289~296) ─────────────────

/**
 * 품목목록 1건 — 품목 목록 탭(T72). PC 실 인터페이스 `ovsBidPbancDtl.IResultItem`
 * (2026-08-24 판독본) 키/타입 그대로(chk 그리드 체크 열은 제외 — 선택 상태는 화면 로컬).
 * 구 설계서 dl_itemList 키(frcptlArtclNo/unitNm/bscbgtQty 등) 교체.
 */
export interface OvsBidItem {
  /** 항목번호 (artclNo) */
  artclNo: string
  /** 품질등급 (inspShpCd) */
  inspShpCd: string
  /** 첨부문서유무 (docYn) — Y/N */
  docYn: string
  /** 첨부문서id (docId) */
  docId: string
  /** 보관함여부 (lockerYn) — Y/N. 업체담당자인 경우에만 표시 */
  lockerYn: string
  /** 재고번호 (invtNo) */
  invtNo: string
  /** 부품번호 (prtsNo) */
  prtsNo: string
  /** 규격번호 (spcfctNo) */
  spcfctNo: string
  /** 품명 (itemNm) */
  itemNm: string
  /** 납기기준일자 (dudtYmd) */
  dudtYmd: string
  /** 단위 (bidUnitCd) */
  bidUnitCd: string
  /** 본조수량 (bonSumDrctnQty) */
  bonSumDrctnQty: string
  /** 당국수량 (dangSumDrctnQty) */
  dangSumDrctnQty: string
  /** 장국수량 (jangSumDrctnQty) */
  jangSumDrctnQty: string
  /** 본조예산 (bonSumDrctnUsdAmt) */
  bonSumDrctnUsdAmt: string
  /** 당국예산 (dangSumDrctnUsdAmt) */
  dangSumDrctnUsdAmt: string
  /** 장국예산 (jangSumDrctnUsdAmt) */
  jangSumDrctnUsdAmt: string
  /** 수량합계 (sumDrctnQty) */
  sumDrctnQty: string
  /** 화폐단위 (crncCd) */
  crncCd: string
  /** 지시단가 (drctnUntprc) */
  drctnUntprc: number
  /** 지시금액 (sumDrctnUsdAmt) */
  sumDrctnUsdAmt: string
  /** 장비부호 (aplcnEqpmntCd) */
  aplcnEqpmntCd: string
  /** 장비명 (aplcnEqpmntNm) */
  aplcnEqpmntNm: string
}

/**
 * 첨부서류 1건 — 첨부파일 탭(T73)·품목 첨부파일조회(P76). PC 실 인터페이스
 * `ovsBidPbancDtl.IResultAttach`(2026-08-24 판독본) 키/타입 그대로(chk 제외).
 * 구 no/atchDocNm/atchFileNm 키 교체 — 목록 key·다운로드 식별자는 fileId.
 */
export interface OvsAtchDoc {
  /** 첨부서류명 (docTitl) */
  docTitl: string
  /** 첨부파일명 (fileNm) */
  fileNm: string
  /** 파일크기 (fileSz) — byte */
  fileSz: number
  /** 파일ID (fileId) — 다운로드/목록 key */
  fileId: string
}

// ── 국외 보관함 목록 (MUI-CM-01-M71, 설계서 slide301·306·307) ───────────────────

/**
 * 국외 보관함 공고 1건 (MUI-CM-01-M71) — PC 실 인터페이스 `ovsLockerPbanList.IDataList1`
 * (2026-08-24 판독본) 키/타입 그대로. 구 tmprBidCnEn/bidPrtcpAplyYn(Y/N)·pbancYr 교체.
 */
export interface OvsLockerPbanItem {
  /** 라우팅 키 — 통합참조번호(intgRfrncNo) 사용 (직접 URL 진입 테스트 가능) */
  id: string
  /** 통합참조번호 (intgRfrncNo) */
  intgRfrncNo: string
  /** 공고번호 (pbancNo) */
  pbancNo: string
  /** 공고차수 (pbancOd) */
  pbancOd: string
  /** 구매요청번호 (prchsDmndNo) */
  prchsDmndNo: string
  /** 사업명 (bizNm) */
  bizNm: string
  /** 입찰내역 (tmprBidCn) — 구 tmprBidCnEn(Y/N). TODO(원본 대조): 값 도메인(Y/N vs 상태문자열) 미확정 */
  tmprBidCn: string
  /** 입찰업체명 (splyBzentyNm) — 미작성 시 '미작성' 표기(설계서 slide301) */
  splyBzentyNm: string
  /** 입찰참가신청 (bidPrtcpAply) — 구 bidPrtcpAplyYn(Y/N). TODO(원본 대조): 값 도메인 미확정 */
  bidPrtcpAply: string
  /** 부정당내역 (creditYn) */
  creditYn: string
  /** 입찰참가등록마감일시 (regDdlnDt) */
  regDdlnDt: string
  /** 입찰서제출마감일시 (bdngDdlnDt) */
  bdngDdlnDt: string
  /** 개찰일자 (bdopnYmd) */
  bdopnYmd: string
  /** 환율적용일자 (exchrtAplcnYmd) */
  exchrtAplcnYmd: string
  /** 입찰방식 (bidMth) — 경쟁입찰/공개수의/사전심사 */
  bidMth: string
  /** 보관함품목수 (lockerItemQty) */
  lockerItemQty: string
  // ── ⚠️ 실 인터페이스(IDataList1) 미존재 임시 항목 (기존 승인 관례: 임시 영문키 + 주석) ──────────
  /** 공고년도 (pbancYr) — ⚠️ 판독본 미존재. 상세(M72) 일반정보 표시용 잔존(원본 대조 필요) */
  pbancYr?: string
  /** 입찰내역 작성상태 — 최종 와이어프레임(260709 M71)의 표시 레이블(입찰내역 작성/미작성/완료)·카드 버튼 분기 구동값.
   *  ⚠️ 판독본 미존재 — 실 tmprBidCn 의 값 도메인이 상태문자열로 확정되면 그쪽으로 통합.
   *  tmprBidCn(Y/N 가정)과의 정합: 미작성=N, 작성/완료=Y */
  tmprBidCnStts: '미작성' | '작성' | '완료'
  /** 입찰참가신청 작성상태 — 카드 상태버튼 분기 구동값(260709 확정: 작성(저장)=[입찰참가신청 작성수정] ·
   *  완료=[입찰진행 바로가기]). ⚠️ 판독본 미존재 — 실 bidPrtcpAply 값 도메인 확정 시 통합.
   *  bidPrtcpAply(Y/N 가정)와의 정합: 완료=Y, 미신청/작성=N */
  bidPrtcpAplyStts: '미신청' | '작성' | '완료'
  /** 입찰구분(단가제/총액제) — 카드 표시 레이블(slide301)·입찰내역 M77/M78 분기 구동값. 상세설계 확정 시 교체 */
  bidPrcSysNm: '단가제' | '총액제'
  /** 계약방식 표시명 — 상세 일반정보(slide304) 표시 항목. 데이터영역 미정의, 상세설계 확정 시 교체 */
  ctrtMthdNm: string
}

// ── 입찰내역 작성 (MUI-BD-01-M76 · T74~T76(구 M76~M78 — v1.83 재편), 설계서 slide312~319) ─────────────────────

/** 공고일반 데이터 영역 (dm_bscPbancInfo, 설계서 slide316) */
export interface BscPbancInfo {
  /** 공고번호 (7자리) */
  pbancNo: string
  /** 공고차수 (2자리) */
  pbancOd: string
  /** 구매요청번호 */
  prchsDmndNo: string
  /** 통합참조번호 */
  intgRfrncNo: string
  /** 사업명 */
  bizNm: string
  /** 입찰방식 */
  bidMth: string
  /** 계약방법 */
  ctrtMthdNm: string
  /** 입찰참가등록마감일시 */
  regDdlnDt: string
  /** 입찰서제출마감일시 */
  bdngDdlnDt: string
  /** 개찰일시 */
  bdopnDt: string
  /** 환율적용일자 */
  exchrtAplcnYmd: string
  /** 담당부서 */
  picDeptNm: string
  /** 담당자 */
  picNm: string
  /** 연락처 */
  picTlno: string
  /**
   * ⚠️ 설계서(M76~M78) 미정의 항목 — 단가제(M77)/총액제(M78) 분기 구분값.
   * 국내 설계서의 입찰방법(bidMthdNm: '단가제'|'총액제') 키를 임시 차용(기존 승인 관례).
   */
  bidMthdNm: '단가제' | '총액제'
}

/** 입찰내역(단가제) 데이터 영역 (dl_ititbBidCnList, 설계서 slide317) */
export interface ItitbBidCnItem {
  /** 항목번호 (5자리) */
  frcptlArtclNo: string
  /** 재고번호 (9자리) */
  invtNo: string
  /** 부품번호 (32자리) */
  prtsNo: string
  /** 품명 */
  itemNm: string
  /** 단위 */
  unitNm: string
  /** 수량 */
  qty: string
  /** 지시단가 */
  drctnUntprc: string
  /** 품목대체구분 — As it is('A') / Replace('R') */
  itemSbstSe: 'A' | 'R'
  /** 품목대체첨부문서 — Replace 인 경우 활성/필수. 목업은 업로드된 파일명 보관 */
  itemSbstDocEn: string
  /** 수정재고번호 — Replace 인 경우 활성/필수 */
  mdfcnInvtNo: string
  /** 수정부품번호 — Replace 인 경우 활성/필수 */
  mdfcnPrtsNo: string
  /** MOQ구분 — Y/N */
  moqYn: 'Y' | 'N'
  /** MOQ수량 — Y 인 경우 활성/필수 */
  moqQty: string
  /** MOQ첨부문서 — Y 인 경우 활성/필수. 목업은 업로드된 파일명 보관 */
  moqDocEn: string
  /** 납기(본조) — 국가 예산 납기일자 */
  bscbgtDudtYmd: string
  /** 납기(당국) — 당해년도 국채 납기일자 */
  athrtDudtYmd: string
  /** 납기(장국) — 장기국채 납기일자 */
  ltbndDudtYmd: string
  /** 달러환산율 (ReadOnly — 화폐단위 변경 시 재계산) */
  usdExrt: string
  /** 입찰업체 */
  splyBzentyNm: string
  /** 입찰단가 (Editable — 변경 시 입찰금액/달러단가/달러금액 재계산) */
  bdngTccrUntprc: string
  /** 입찰금액 (ReadOnly = 입찰단가 × 수량) */
  bdngTccrAmt: string
  /** 화폐단위 */
  crncNm: string
  /** 달러단가 (ReadOnly = 입찰단가 × 달러환산율) */
  bdngUsdUntprc: string
  /** 달러금액 (ReadOnly = 입찰금액 × 달러환산율) */
  bdngUsdAmt: string
}

/** 입찰품목(총액제) 데이터 영역 (dl_alonbsItemList, 설계서 slide318) */
export interface AlonbsItem {
  /** 항목번호 */
  frcptlArtclNo: string
  /** 재고번호 */
  invtNo: string
  /** 부품번호 */
  prtsNo: string
  /** 품명 */
  itemNm: string
  /** 단위 */
  unitNm: string
  /** 수량 */
  qty: string
}

/** 입찰내역(총액제) 데이터 영역 (dl_alonbsBidCnInfo, 설계서 slide318) */
export interface AlonbsBidCnInfo {
  /** 입찰업체 */
  splyBzentyNm: string
  /** 화폐단위 */
  crncNm: string
  /** 입찰금액 (Editable — 변경 시 달러금액 재계산) */
  bdngTccrAmt: string
  /** 달러금액 (ReadOnly) */
  bdngUsdAmt: string
  /** 달러환산율 (ReadOnly) */
  usdExrt: string
}

// ── 이전공고입찰내역등록 (MUI-BD-01-P79(구 M79 — v1.83 재편), 설계서 slide320·322·323) ────────────────

/**
 * 보관함 이전공고 1건 — PC 실 인터페이스 이전공고입찰내역등록
 * `ovsBfrTmprBidBidCnRegPopup.IDataList1`(2026-08-24 판독본) 키/타입 그대로.
 */
export interface BfrPbancInfoItem {
  /** 순번 (no) */
  no: string
  /** 공고번호 (pbancNo) */
  pbancNo: string
  /** 공고차수 (pbancOd) */
  pbancOd: string
  /** 구매요청번호 (prchsDmndNo) */
  prchsDmndNo: string
  /** 개찰일자 (bdopnYmd) */
  bdopnYmd: string
  /** 참가품목수 (prtcpItemQty) */
  prtcpItemQty: string
  /** ⚠️ 판독본(IDataList1) 미존재 — 와이어프레임 카드 타이틀(RECOIL) 표기용 임시.
   *  항목명은 BD 도메인 공통 '대표품명(rprsItemNm)' 재사용(원본 대조 필요). */
  rprsItemNm: string
}

/**
 * 입찰내역 1건 — PC 실 인터페이스 `ovsBfrTmprBidBidCnRegPopup.IDataList11`
 * (2026-08-24 판독본) 키/타입 그대로(chk 제외).
 */
export interface BfrPbancBidCnItem {
  /** 순번 (no) */
  no: string
  /** 재고번호 (invtNo) */
  invtNo: string
  /** 부품번호 (prtsNo) */
  prtsNo: string
  /** 품명 (itemNm) */
  itemNm: string
  /** 품목대체구분 (itemSbstSe) */
  itemSbstSe: string
  /** 품목대체첨부문서 (itemSbstDocEn) */
  itemSbstDocEn: string
  /** 수정재고번호 (mdfcnInvtNo) */
  mdfcnInvtNo: string
  /** 수정부품번호 (mdfcnPrtsNo) */
  mdfcnPrtsNo: string
  /** MOQ구분 (moqYn) */
  moqYn: string
  /** MOQ수량 (moqQty) */
  moqQty: string
  /** MOQ첨부문서 (moqDocEn) */
  moqDocEn: string
  /** 입찰업체 (splyBzentyNm) */
  splyBzentyNm: string
  /** 입찰단가 (bdngTccrUntprc) */
  bdngTccrUntprc: number
  /** 입찰금액 (bdngTccrAmt) */
  bdngTccrAmt: number
  /** 화폐단위 (crncNm) */
  crncNm: string
}

// ── 국외 입찰참가신청서 작성 (MUI-BD-04-M71 · T71~T75 · P75·P76(구 M71~M77 — v1.83 재편), 설계서 slide324~347) ────

/** 서약서 데이터 영역 (MUI-BD-04-P03, 설계서 slide332 dl_resultInfo). */
export interface OvsProbWrotAgreResultInfo {
  /** 서약일자 (wrotAgreYmd, 8) — 당일일자를 표시 */
  wrotAgreYmd: string
  /** 담당자명 (picNm, 200) — 로그인한 조달업체사용자의 명 */
  picNm: string
  /** 업체명 (sbtBzentyNm, 200) — 로그인한 조달업체사용자의 업체명 */
  sbtBzentyNm: string
  /** 발주기관명 (prcmRqtInstNm, 200) — 공고의 발주기관명 */
  prcmRqtInstNm: string
}

/** 공고일반 데이터 영역 (MUI-BD-04-T72(구 M72 — v1.83 재편), 설계서 slide338 dm_bscPbancInfo). */
export interface OvsBscPbancInfo {
  /** 공고번호 (pbancNo, 7) */
  pbancNo: string
  /** 공고차수 (pbancOd, 2) */
  pbancOd: string
  /** 개찰일자 (bdopnYmd, 8) — 화면 표시는 개찰일시 */
  bdopnYmd: string
  /** 입찰보증금총액 (bidGrnteAmt, 25) — 달러금액 */
  bidGrnteAmt: string
}

/**
 * 신청업체 데이터 영역 (dm_sbtInfo — 작성 MUI-BD-04-T72(구 M72 — v1.83 재편) slide338 · 상세 MUI-BD-04-M78 slide353 공용).
 * 두 화면의 설계서 정의(항목명·자리수)가 동일해 하나로 통합.
 */
export interface OvsSbtInfo {
  /** 신청업체 업체코드 (sbtBzentyCd, 5) */
  sbtBzentyCd: string
  /** 신청업체 업체명 (sbtBzentyNm, 200) */
  sbtBzentyNm: string
  /** 신청업체 대표자 (sbtRprsvNm, 200) */
  sbtRprsvNm: string
  /** 신청업체 전화번호 (sbtTlno, 11) */
  sbtTlno: string
  /** 신청업체 팩스 (sbtFxno, 40) */
  sbtFxno: string
  /** 신청업체 사업자등록번호 또는 DUNS NUM (sbtBzmnNo, 20) */
  sbtBzmnNo: string
  /** 신청업체 주소 (sbtAddr, 600) */
  sbtAddr: string
}

/**
 * 입찰업체 데이터 영역 (dm_splyInfo — 작성 MUI-BD-04-T73(구 M73 — v1.83 재편) slide338 · 상세 MUI-BD-04-M78 slide353 공용).
 * 두 화면의 설계서 정의(항목명·자리수)가 동일해 하나로 통합.
 */
export interface OvsSplyInfo {
  /** 입찰업체 업체코드 (splyBzentyCd, 5) — 속성 E */
  splyBzentyCd: string
  /** 입찰업체 업체명 (splyBzentyNm, 200) */
  splyBzentyNm: string
  /** 입찰업체 대표자 (splyRprsvNm, 200) */
  splyRprsvNm: string
  /** 입찰업체 이메일 (splyEmlAddr, 100) */
  splyEmlAddr: string
  /** 입찰업체 전화번호 (splyTlno, 11) */
  splyTlno: string
  /** 입찰업체 팩스 (splyFxno, 40) */
  splyFxno: string
  /** 입찰업체 사업자등록번호 또는 DUNS NUM (splyBzmnNo, 20) */
  splyBzmnNo: string
  /** 입찰업체 주소 (splyAddr, 600) */
  splyAddr: string
}

/**
 * 입찰참가사업 및 입찰보증금 1건 (MUI-BD-04-T74(구 M74 — v1.83 재편), 설계서 slide339 dl_bizList·dl_bizExmptnList 공통 R 필드).
 * 편집(E) 필드(chckBidGrnteAmt·grntePayMth·wtgrNo·grnteInstNm·grntePyslDocNo)는 Stp3 의 입력 상태로 관리.
 */
export interface OvsBidPrtcpBizItem {
  /** 구매요청번호 (prchsDmndNo, 10) — 목록 key */
  prchsDmndNo: string
  /** 사업명 (bizNm, 100) */
  bizNm: string
  /** 입찰품목수 (bdngItemQty, 15) */
  bdngItemQty: string
  /** 입찰총금액 (bdngTccrAmt, 25) — 달러금액 */
  bdngTccrAmt: string
  /** 입찰보증금 (bidGrnteAmt, 25) — 달러금액 */
  bidGrnteAmt: string
  /** 연대보증서 파일명 (gurnAgreDocNo, 38) — 보증금면제 목록(dl_bizExmptnList) 전용 */
  gurnAgreDocNo?: string
  /** 지급각서 파일명 (giveWrtprmDocNo, 38) — 보증금면제 목록(dl_bizExmptnList) 전용 */
  giveWrtprmDocNo?: string
}

/** 입찰보증서 1건 (MUI-BD-04-P75, 설계서 slide343 dl_resultList). */
export interface OvsBidWtgrItem {
  /** 보증서번호 (wtgrNo, 30) — 목록 key */
  wtgrNo: string
  /** 개찰일자 (bdopnYmd, 8) */
  bdopnYmd: string
  /** 입찰건명 (bidNm, 100) */
  bidNm: string
  /** 보증금액 (grnteAmt, 25) */
  grnteAmt: string
  /** 보증채권자 (crdtrRprsvNm, 200) */
  crdtrRprsvNm: string
  /** 계약자 (ctrtrNm, 200) */
  ctrtrNm: string
  /** 발행자 (isrRprsvNm, 200) */
  isrRprsvNm: string
}

/** 보증서정보 상세 (MUI-BD-04-P76, 설계서 slide346~347 dl_wtgrInfo + dl_IsrInfo + dl_ctrtInfo). */
export interface OvsBidWtgrInfo {
  /** 증권번호 (wtgrNo, 30) */
  wtgrNo: string
  /** 보증금액 (grnteAmt, 25) */
  grnteAmt: string
  /** 보증기간 (grnteBgngPrd, 16) */
  grnteBgngPrd: string
  /** 보증료 (grfe, 21) */
  grfe: string
  /** 보증금율 (grnteAmtDepstRt, 5) */
  grnteAmtDepstRt: string
  /** 보증계약자 상호 (ctrtBzentyNm, 200) */
  ctrtBzentyNm: string
  /** 보증계약자 대표자 (ctrtRprsvNm, 200) */
  ctrtRprsvNm: string
  /** 보증채권자 상호 (crdtrBzentyNm, 200) */
  crdtrBzentyNm: string
  /** 보증채권자 대표자 (crdtrRprsvNm, 200) */
  crdtrRprsvNm: string
  /** 특기사항 (spcltMttr, 500) */
  spcltMttr: string
  /** 보증문 (grntePhrsCn, 1000) */
  grntePhrsCn: string
  /** 발행일자 (pblcnYmd, 8) */
  pblcnYmd: string
  // ── 발행자 데이터 영역 (dl_IsrInfo) ──────────────────────────────────────
  /** 발행자 상호 (isrBzentyNm, 200) */
  isrBzentyNm: string
  /** 발행자 대표자 (isrRprsvNm, 200) */
  isrRprsvNm: string
  /** 발행자 주소 (isrAddr, 100) */
  isrAddr: string
  /** 대리인 성명 (agtNm, 200) */
  agtNm: string
  /** 대리인 부서 (agtDeptNm, 100) */
  agtDeptNm: string
  /** 담당자 성명 (picNm, 200) */
  picNm: string
  /** 담당자 전화 (picTlno, 11) */
  picTlno: string
  /** 담당자 FAX (picFxno, 40) */
  picFxno: string
  // ── 보증계약 데이터 영역 (dl_ctrtInfo, 주계약) ───────────────────────────
  /** 입찰건명 (bidNm, 100) */
  bidNm: string
  /** 입찰금액 (bdngTccrAmt, 25) */
  bdngTccrAmt: string
  /** 입찰번호 (bidNo, 27) */
  bidNo: string
  /** 입찰서제출마감일자 (bdngDdlnDt, 14) */
  bdngDdlnDt: string
}

// ── 국외 입찰참가신청서 상세 (MUI-BD-04-M78·P82, 설계서 slide349~358) ────────────

/** 공고일반 (dm_bscPbancInfo, slide353) + 화면 식별값 */
export interface OvsBidPrtcpApfrDetail {
  pbancNo: string // 공고번호 (7)
  pbancOd: string // 공고차수 (2)
  bdopnYmd: string // 개찰일자 — 화면표기는 '개찰일시'(slide349) 라 일시 형식으로 목업
  bidGrnteAmt: number // 입찰보증금총액 (달러금액)
  intgRfrncNo: string // 통합참조번호 (dl_resultInfo, slide358)
  pbancNm: string // ⚠️ 설계서 미정의 임시 항목 — 요약 헤더 공고명 표기(예: MD부품 국외경쟁입찰)
  pbancTpcd?: string // ⚠️ 공고유형 배지(긴급공고) — 국내 dlt_bidPbancIntgList 항목 재사용
}

/** 입찰참가사업 및 입찰보증금 - 보증금비면제 (dl_bizList, slide354) */
export interface OvsBidBizItem {
  prchsDmndNo: string // 구매요청번호 (고유 — 목록 key)
  bizNm: string // 사업명
  bdngItemQty: number // 입찰품목수
  bdngTccrAmt: number // 입찰금액 (달러)
  bidGrnteAmt: number // 입찰보증금 (달러)
  chckBidGrnteAmt: number // 입찰보증금(확인입력)
  grntePayMth: string // 보증금납부방법
  wtgrNo: string // 보증금증권번호
  grnteInstNm: string // 보증기관명
  grntePyslDocNo?: string // 입찰보증금납부서 파일명
}

/** 입찰참가사업 및 입찰보증금 - 보증금면제 (dl_bizExmptnList, slide354) */
export interface OvsBidBizExmptnItem {
  prchsDmndNo: string // 구매요청번호 (고유 — 목록 key)
  bizNm: string // 사업명
  bdngItemQty: number // 입찰품목수
  bdngTccrAmt: number // 입찰금액 (달러)
  bidGrnteAmt: number // 입찰보증금 (달러)
  chckBidGrnteAmt: number // 입찰보증금(확인입력)
  gurnAgreDocNo: string // 연대보증서 파일명
  giveWrtprmDocNo: string // 지급각서 파일명
}

/** 입찰참가신청서취소(P82) 대상 사업 — dl_resultInfo(slide358)의 사업 식별 부분집합 */
export interface OvsRtrcnTarget {
  prchsDmndNo: string // 구매요청번호
  bizNm: string // 사업명
  rtrcnItemQty: number // 취소신청품목수(대상 사업의 입찰품목수)
}

// ── 국외 입찰서제출 (MUI-BD-06-M71, 설계서 slide366·370) ────────────────────────

/** 공고일반 데이터 영역 (dm_bscPbancInfo, 설계서 slide370) */
export interface OvsTndrSbmsnDetail {
  /** 공고번호 (pbancNo, 7) */
  pbancNo: string
  /** 공고차수 (pbancOd, 2) */
  pbancOd: string
  /** 구매요청번호 (prchsDmndNo, 10) */
  prchsDmndNo: string
  /** 통합참조번호 (intgRfrncNo, 30) */
  intgRfrncNo: string
  /** 사업명 (bizNm, 100) */
  bizNm: string
  /** 입찰방식 (bidMth, 100) — 예: 일반투찰 */
  bidMth: string
  /** 계약방법 (ctrtMthdNm, 100) — 예: 일반경쟁 */
  ctrtMthdNm: string
  /** 입찰참가등록마감일시 (regDdlnDt, 14) */
  regDdlnDt: string
  /** 입찰서제출마감일시 (bdngDdlnDt, 14) */
  bdngDdlnDt: string
  /** 개찰일시 (bdopnDt, 14) */
  bdopnDt: string
  /** 환율적용일자 (exchrtAplcnYmd, 8) */
  exchrtAplcnYmd: string
  /** 담당부서 (picDeptNm, 100) */
  picDeptNm: string
  /** 담당자 (picNm, 200) */
  picNm: string
  /** 연락처 (picTlno, 11) */
  picTlno: string
  /** 입찰방법 (bidMthdNm) — 스탭2 단가제(M72)/총액제(M73) 분기.
   *  ⚠️ 설계서 dm_bscPbancInfo 미정의(상세설계 예정) — 국내 BidPrgrsItem.bidMthdNm 관례를 따른 임시 항목. */
  bidMthdNm?: '단가제' | '총액제'
}

// ── 국외 입찰서 상세 (MUI-BD-06-M75 · T75~T79(구 M75~M79 — v1.83 재편), 설계서 slide375~384) ───────────────────

/**
 * 국외 입찰서 상세 공고일반 항목 (설계서 slide380 데이터영역 dm_bscPbancInfo) — 항목명(영문) 설계서 그대로.
 * 국외 입찰진행 상세 → 이 화면 진입 시 navigate state 로 전달되는 항목 타입.
 */
export interface OvsTndrDtlItem {
  /** 공고번호 (pbancNo, 7) */
  pbancNo: string
  /** 공고차수 (pbancOd, 2) — 표시는 '공고번호-차수' */
  pbancOd: string
  /** 구매요청번호 (prchsDmndNo, 10) */
  prchsDmndNo: string
  /** 통합참조번호 (intgRfrncNo, 30) */
  intgRfrncNo: string
  /** 사업명 (bizNm, 100) */
  bizNm: string
  /** 입찰방식 (bidMth, 100) — 일반투찰 등 */
  bidMth: string
  /** 계약방법 (ctrtMthdNm, 100) */
  ctrtMthdNm: string
  /** 입찰참가등록마감일시 (regDdlnDt, 14) */
  regDdlnDt: string
  /** 입찰서제출마감일시 (bdngDdlnDt, 14) */
  bdngDdlnDt: string
  /** 개찰일시 (bdopnDt, 14) */
  bdopnDt: string
  /** 환율적용일자 (exchrtAplcnYmd, 8) */
  exchrtAplcnYmd: string
  /** 담당부서 (picDeptNm, 100) */
  picDeptNm: string
  /** 담당자 (picNm, 200) */
  picNm: string
  /** 연락처 (picTlno, 11) */
  picTlno: string

  // ── 설계서 미정의(상세설계 예정) 임시 항목 — BD 진행 상태필드 임시 영문키 관례(사용자 승인)와 동일 ──
  /** 업무구분 (taskSeNm) — 국내 dlt_bidPrgrsList 항목 차용. 요약 배지(국외) */
  taskSeNm?: string
  /** 입찰서 상태 (tndrStatNm) — 국내 임시 항목과 동일. '제출' 일 때 투찰취소 바로가기 노출 */
  tndrStatNm?: '미제출' | '제출' | '완료' | '입찰포기' | '입찰취소'
  /** 총액제 여부 (alonbsYn) — ⚠️ 설계서 미정의. 입찰참여품목 탭 단가제(M77)/총액제(M78) 분기 구동
   *  (설계서 총액제 데이터영역 접두 dl_alonbs* 차용). 상세설계 확정 시 그 이름으로 교체 */
  alonbsYn?: 'Y' | 'N'
  /** 담당자 휴대전화 (picMblTelno) — ⚠️ 설계서 미정의. 레이아웃(slide375)의 연락처 2행 표시용 임시 항목 */
  picMblTelno?: string
}

// ══════════════════════════════════════════════════════════════════════════
// 서비스 레이어(src/services/bd.ts) 계약 타입 — 페이지 로컬 UI 타입을 승격(단일 소스).
// 페이지들은 아직 자체 인라인 타입을 쓰며, 서비스 배선 시 여기서 import 하도록 교체된다.
// 백엔드 미확정이라 필드는 설계서/목업 기준 추정 — 실백엔드 확정 시 필드명/형식만 맞춘다.
// ══════════════════════════════════════════════════════════════════════════

// ── API 요청 타입(추정 — TODO(백엔드 확정)) ──

/**
 * 목록/개찰/입찰진행 공용 검색·페이징 요청.
 * 목록 페이지가 빠른검색(keyword/searchTarget)·상세필터(filter)·더보기(page)를 매핑해 전달.
 * (현 목업 단계는 페이지가 클라 필터/페이징을 소유 — 파라미터는 실연동 대비 형태만 확정)
 */
export interface BidListSearchRequest {
  /** 빠른검색어 */
  keyword?: string
  /** 빠른검색 대상 필드(예: rprsItemNm/bidPbancNm) */
  searchTarget?: string
  /** 더보기 페이지(1-base) */
  page?: number
  /** 페이지 크기 */
  pageSize?: number
  /** 상세필터 확정값(검색필터 공통 value) */
  filter?: SearchFilterValue
}

/** 등록업체 검색 요청 (MUI-BD-04-P11). */
export interface RegBzentySrchRequest {
  /** 검색유형 — '업체명' | '사업자번호' */
  srchType: string
  /** 검색어 */
  keyword: string
}

/**
 * 입찰서 저장 페이로드 (MUI-BD-06 tndrWrt) — 스탭별 부분 저장 → 제출 시 전체.
 * 모든 필드 옵셔널(스탭마다 일부만 전송). 항목명은 설계서 데이터영역 기준.
 */
export interface TndrSavePayload {
  /** 공고번호(식별) */
  pbancNo?: string
  /** 입찰금액(₩) */
  bdngAmt?: string
  /** 입찰단가(₩) */
  bdngUntprc?: string
  /** 입찰수량 */
  bdngQty?: string
  /** 복수예비가격 선택 1 */
  rsrvPrcChcNo1?: string
  /** 복수예비가격 선택 2 */
  rsrvPrcChcNo2?: string
  /** 동가낙찰 선추첨 선택 1 */
  smprcScsbdChcCd1?: string
  /** 동가낙찰 선추첨 선택 2 */
  smprcScsbdChcCd2?: string
  /** 동가낙찰 선추첨 선택 3 */
  smprcScsbdChcCd3?: string
  /** 동가낙찰 선추첨 선택 4 */
  smprcScsbdChcCd4?: string
  /** 동가낙찰 선추첨 선택 5 */
  smprcScsbdChcCd5?: string
}

// ── API 응답 타입(추정 — TODO(백엔드 확정)) — 페이지 로컬 UI 타입 승격 ──

/**
 * 라벨/값 표시행 — 조회성 화면(공고정보/업체정보/보증/심사결과 등)의 표 공용 표현.
 * 백엔드 확정 시 화면별 데이터영역 타입(dm_*)으로 분해 예정.
 */
export interface BidLabeledRow {
  label: string
  value: string
}

/** 접수결과 — 전자서명/제출 후 접수번호·일시 (MUI-BD-04-M21 → M08 신청완료). */
export interface BidAplyReceipt {
  /** 접수번호 (rcptNo) — 예: '0000 000 0000' */
  rcptNo: string
  /** 접수일시 (rcptDt) — 예: '2025-10-31 12:30' */
  rcptDt: string
}

/** 첨부파일 1건(다운로드 목록 표현) — guid 발급 전 목업은 파일명/크기만. */
export interface BidAtchFileInfo {
  id: string
  fileNm: string
  fileSz: string
}

/** 입찰진행 현황 1건 (MUI-BD-01-T06(구 M12 — v1.83 재편) 입찰진행 탭). */
export interface BidProgressRow {
  id: string
  /** 공고번호 */
  pbancNo: string
  /** 재입찰자수 */
  rebidderCnt: string
  /** 항목번호 */
  itemNo: string
  /** 공고명 */
  pbancNm: string
  /** 입찰서제출마감일시 */
  bidDocDdln: string
  /** 개찰일시 */
  opbidDt: string
  /** 진행상태 */
  prgrsStas: string
}

/** 입찰결과(내 업체) 1건 (MUI-BD-09-T03(구 M03 — v1.83 재편)). */
export interface BidRsltRow {
  id: string
  /** 순번 */
  seq: string
  /** 차수 */
  cycle: string
  /** 업체코드 */
  bizCode: string
  /** 사업자등록번호 */
  bizRegNo: string
  /** 업체명 */
  bizName: string
  /** 대표자 */
  ceo: string
  /** 결과 */
  result: string
}

/** 협상결과 1건 (MUI-BD-09-T04(구 M04 — v1.83 재편)). */
export interface NegoRsltRow {
  id: string
  /** 차수 */
  cycle: string
  /** 업체코드 */
  bizCode: string
  /** 업체명 */
  bizName: string
  /** 대표자 */
  ceo: string
  /** 견적단가 */
  estPrice: string
  /** 낙찰률 */
  winRate: string
  /** 결과 */
  result: string
}

/** 입찰결과 품목정보 1건 (MUI-BD-09-T02(구 M02 — v1.83 재편)). */
export interface BidRsltProductItem {
  id: string
  /** 항목번호 */
  itemNo: string
  /** 재고번호 */
  stockNo: string
  /** 품명 */
  name: string
  /** 규격 */
  spec: string
  /** 단위 */
  unit: string
  /** 수량 */
  qty: string
  /** 단가 */
  unitPrice: string
  /** 금액 */
  amount: string
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-BD-09-P02 복수예비가격 (설계서 02입찰 v1.88 slide246~248, 2026-08-13 화면 추가)
//   입찰결과 탭(T03)의 '복수예가조회' 버튼 → Prprc 팝업.
// ────────────────────────────────────────────────────────────────────────────

/** 생성된 복수예비가격 1건 (dmt_plrlRsrvPrc, slide247 1.1). */
export interface PlrlRsrvPrcItem {
  /** 번호 (regSn, 10) */
  regSn: string
  /** 금액 (prprc, 17,2) */
  prprc: number
  /** 횟수 (chcNmtm, 10) — 업체가 선택한 번호의 횟수 */
  chcNmtm: number
}

/** 업체가 선택한 번호 1건 (dmt_chcNo, slide247 1.2). */
export interface PlrlRsrvPrcChcNoItem {
  /** 번호 (regSn, 10) */
  regSn: string
  /** 금액 (prprc, 17,2) */
  prprc: number
  /** 업체명 (bzentyNm, 100) — 마스킹 정책 적용 대상 */
  bzentyNm: string
}

/** 복수예비가격 조회 응답 (scwin.getPlrlRsrvPrcInfo, slide248). */
export interface PlrlRsrvPrcInfo {
  plrlRsrvPrc: PlrlRsrvPrcItem[]
  chcNo: PlrlRsrvPrcChcNoItem[]
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-BD-09-P03 동가낙찰결과 (설계서 02입찰 v1.88 slide249~250, 2026-08-13 화면 추가)
//   입찰결과 탭(T03)의 '동가낙찰결과' 버튼 → SmprcScsbdRslt 팝업.
// ────────────────────────────────────────────────────────────────────────────

/** 동가낙찰결과(자동추첨) 1건 (dlt_smprcScsbdRslt, slide250 1.1). */
export interface SmprcScsbdRsltItem {
  /** 번호 (no, 10) — 입찰서 제출 순서 */
  no: string
  /** 사업자등록번호 (brno, 10) */
  brno: string
  /** 상호명 (bzentyNm, 100) */
  bzentyNm: string
  /** 입찰서제출일시 (regDt) */
  regDt: string
  /** 당첨여부 (smprcScsbdBzentyYn, 1) — 표시명('당첨'/'-') */
  smprcScsbdBzentyYn: string
}

/** 동가낙찰결과(가위바위보) 1건 (dlt_smprcScsbdRslt, slide250 1.2). */
export interface SmprcScsbdRpsItem {
  /** 업체코드 (bzentyCd, 5) */
  bzentyCd: string
  /** 업체명 (bzentyNm, 100) */
  bzentyNm: string
  /** 1차 (smprcScsbdRslt1, 10) */
  smprcScsbdRslt1: string
  /** 2차 (smprcScsbdRslt2, 10) */
  smprcScsbdRslt2: string
  /** 3차 (smprcScsbdRslt3, 10) */
  smprcScsbdRslt3: string
  /** 4차 (smprcScsbdRslt4, 10) */
  smprcScsbdRslt4: string
  /** 5차 (smprcScsbdRslt5, 10) */
  smprcScsbdRslt5: string
}

/** 동가낙찰결과 조회 응답 (scwin.getSmprcScsbdRsltInfo, slide250). */
export interface SmprcScsbdRsltInfo {
  /** 업체정보(자동추첨) */
  smprcScsbdRslt: SmprcScsbdRsltItem[]
  /** 가위바위보 결과 — 없으면 빈 배열 */
  rps: SmprcScsbdRpsItem[]
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-BD-09-P04 평가위원별기술평가점수상세조회 (설계서 02입찰 v1.88 slide251~252, 2026-08-13 화면 추가)
//   입찰결과 탭(T03) 업체 행의 '기술점수' 버튼 → EvlMbcmtTechEvlScrDtl 팝업.
// ────────────────────────────────────────────────────────────────────────────

/** 평가위원별 기술평가점수 1건 (dlt_evlMbcmtTechEvlScrInfo, slide252 1.1). */
export interface EvlMbcmtTechEvlScrItem {
  /** 업체명 (bzentyNm, 100) */
  bzentyNm: string
  /** 평가위원 (evlMbcmtNm, 100) — 비공개인 경우 제공하지 않음 */
  evlMbcmtNm?: string
  /** 평가점수 (evlScr, 8,5) — 비공개인 경우 제공하지 않음 */
  evlScr?: number
  /** 비공개사유 (prvtRsn, 500) — 비공개인 경우 제공 */
  prvtRsn?: string
}

/** 사전심사(PQ) 결과 (MUI-BD-02-M02) — 공고/업체/심사 요약 + 첨부. */
export interface PqResultResponse {
  pbancInfo: BidLabeledRow[]
  bzentyInfo: BidLabeledRow[]
  srngRslt: BidLabeledRow[]
  atchFiles: BidAtchFileInfo[]
}

/** 공동수급(JSD) 투자자 업체 1건 (MUI-BD-03-M05). */
export interface JsdBzenty {
  /** 공동수급업체명 */
  jsdBzentyNm: string
  /** 업체명 */
  bzentyNm: string
  /** 공동수급 형태명 */
  jsdShNm: string
  /** 투자율 */
  invstRt: string
}

/**
 * 입찰참가신청 공동수급업체 1건 (MUI-BD-04-M10, 설계서 slide121 데이터영역 dlt_jsdBzentyList).
 * 편집(E) 항목은 bzentyNm·invstRt 둘뿐이고 나머지는 조회결과 표시(R).
 * (MUI-BD-03-M05 입찰등록결과의 JsdBzenty 와는 다른 데이터영역 — 항목 구성이 다르다.)
 */
export interface JsdBzentyAply {
  id: string
  /** 구분 (jsdBzentyNm, 100) — 대표/구성 */
  jsdBzentyNm: string
  /** 공동수급업체 (bzentyNm, 100) — 업체명 검색하여 입력 */
  bzentyNm: string
  /** 이행방식 (jsdShNm, 상위코드 UB13) — A(분담)/B(공동)/C(분담·공동)/D(주계약자관리)/N(단독) */
  jsdShNm: string
  /** 공동분담업종 (cnstpNm, 상위코드 GU9) — 공사만 표시(물품은 숨김) */
  cnstpNm: string
  /** 출자비율(%) (invstRt, 9,2) — 물품 B=출자비율 / A=분담비율 */
  invstRt: string
  /** 입찰보증금 (bidGrnteAmt, 17,2) */
  bidGrnteAmt: string
  /** 납부방법 (depsPayMthdCd, 상위코드 GMCB) */
  depsPayMthdCd: string
  /** 시공능력평가액 (cnstAbltEvlAmt, 17) — 공사만 표시(물품은 숨김) */
  cnstAbltEvlAmt: string
  /** 동의여부 (argeYn, 1) — 'Y'|'N'. 속성 R(조회 결과 표시만, 동의 처리 액션 없음) */
  argeYn?: 'Y' | 'N'
}

/** 입찰등록결과 (MUI-BD-03-M05). */
export interface BidRegResultResponse {
  pbancInfo: BidLabeledRow[]
  bzentyInfo: BidLabeledRow[]
  bidGrnte: BidLabeledRow[]
  jsdBzentyList: JsdBzenty[]
  regSrngRslt: BidLabeledRow[]
}

/** 전자서명 인증서 1건 (MUI-BD-04-M21). */
export interface ElsgnCert {
  id: string
  /** 인증서명 */
  certNm: string
  /** 유효기간 만료일시 */
  vldPdEndDt: string
}

/** 입찰 품목 1건 (MUI-BD-04-M06 입찰참가신청 · MUI-BD-06-M02 입찰서, dl 품목목록). */
export interface BidItemListRow {
  rNum: string
  /** 항목번호 */
  clsfNo: string
  /** 세부품명번호 */
  fscCdNtnItemIdntfNo: string
  /** 품명 */
  itemNm: string
  /** 규격번호 */
  spcfctNo: string
  /** 단위 */
  unitNm: string
  /** 지시수량 */
  drctnQty: string
  /** 지시단가 */
  drctnUntprc: string
  /** 지시금액 */
  drctnAmt: string
}

/** 공사실적/면허 1건 (MUI-BD-04-M07). */
export interface CnstwkLcnsRow {
  id: string
  no: string
  /** 공사명 */
  cnstwkNm: string
  /** 면허정보 */
  lcnsInfo: string
  /** 행정처분기관구분 */
  admDspsInstSe: string
  /** 등록일자 */
  regDt: string
  /** 시공능력평가액 */
  cnstrcAbltEvlAmt: string
  /** 기준연도 */
  stdYr: string
}

/**
 * 입찰보증금 조회결과 (MUI-BD-04-M08, 설계서 slide121 데이터영역 dmt_bidGrnte 의 R 항목).
 * 편집(E) 항목(depsPayMthdCd·depsExmptnRncd·bidGrnteAmt)은 화면 입력 상태로 관리하고,
 * 투찰가능금액(bdngPsbltyAmt)은 입찰보증금 입력 시 계산된다.
 */
export interface BidGrnteInfo {
  /**
   * 증권번호 조회결과 (scrtNo, 30) — 1개면 자동입력 · 2개 이상이면 셀렉트박스 선택 · 없으면 직접입력.
   * 1개 이상인 경우에만 개찰일자/보증금액/계약자/발행자를 노출한다.
   */
  scrtNoList: string[]
  /** 개찰일자/입찰일자 (bidYmd, 8) — 같은 컬럼, 업무구분별 표기 다름 */
  bidYmd: string
  /** 보증금액 (grnteAmt, 17,2) */
  grnteAmt: string
  /** 계약자 (ctrtrBzentyNm, 100) */
  ctrtrBzentyNm: string
  /** 발행자 (isrBzentyNm, 100) */
  isrBzentyNm: string
}

/** 등록업체 검색결과 1건 (MUI-BD-04-P11) — getRegBzentyDetail 반환에도 사용. */
export interface RegBzentyRow {
  id: string
  /** 사업자등록번호 */
  bizRegNo: string
  /** 업체명 */
  bizNm: string
}

/** 캐비닛(디지털 문서함) 파일 1건 (MUI-BD-04-P13). */
export interface CabinetFile {
  id: string
  fileNm: string
  fileSz: number
}

/** 동의서 1건 (MUI-BD-04-M14 입찰참가신청 · MUI-BD-06-M07 입찰서). */
export interface AgreementDoc {
  id: string
  title: string
  body: string[]
  /** 'agree'(동의/미동의) | 'select'(선택형) */
  variant?: string
  /** 보증금액 표기 — 입찰보증금지급각서(M07) 전용 */
  bondAmount?: string
  /** 유의사항 목록 */
  notice?: string[]
  /** 외부 링크 */
  link?: { label: string; url: string }
}

/** 서약서 1건 (MUI-BD-04-M01). */
export interface WrotDoc {
  id: string
  title: string
  body: string[]
  variant: 'agree' | 'select'
  /** 서명 표시행 */
  signature?: string[]
}

/** 면허정보 검색결과 1건 (MUI-BD-01-P05). */
export interface LicenseResult {
  /** 면허코드 */
  lcnsCd: string
  /** 면허명 */
  lcnsNm: string
}

/** 지역 검색결과 1건 (MUI-BD-01-P03). */
export interface RegionResult {
  /** 시/도 */
  sido: string
  /** 시/군/구 */
  sigungu: string
}

/** 셀렉트 옵션 공용 (국외 입찰업체 목록 등). */
export interface BidSelectOption {
  value: string
  label: string
}

/** 환율정보 통화 옵션 (MUI-BD-01-T75/T76(구 M77/M78 — v1.83 재편)) — 달러환산율 포함. */
export interface CrncOption {
  value: string
  label: string
  /** 달러환산율 */
  usdExrt: number
}

/**
 * 국외 환율정보 1건 (MUI-BD-01-M74) — PC 실 인터페이스 `ovsExchrtListPopup.IResult`
 * (2026-08-24 판독본) 키/타입 그대로.
 */
export interface OvsExchrtItem {
  /** 순번 (rnum) */
  rnum: string
  /** 화폐 (crncNm) */
  crncNm: string
  /** 국가 (ntnNm) */
  ntnNm: string
  /** 매도율 (ttsrt) */
  ttsrt: number
  /** 기준율 (trdStdrt) */
  trdStdrt: number
  /** 달러환산율 (usdExrt) */
  usdExrt: number
}

/**
 * 국외 목표가공개품목 1건 (MUI-BD-01-M75) — PC 실 인터페이스
 * `ovsGoalPrcRlsItemListPopup.IResult`(2026-08-24 판독본) 키/타입 그대로(goalAmt 추가·artclNo/unitCd 교체).
 * 수량/예산 필드의 string·number 혼재는 판독본 원본 그대로.
 */
export interface OvsGoalPrcRlsItem {
  /** 항목번호 (artclNo) */
  artclNo: string
  /** 재고번호 (invtNo) */
  invtNo: string
  /** 부품번호 (prtsNo) */
  prtsNo: string
  /** 규격번호 (spcfctNo) */
  spcfctNo: string
  /** 품명 (itemNm) */
  itemNm: string
  /** 납기기준일자 (dudtYmd) */
  dudtYmd: string
  /** 단위 (unitCd) */
  unitCd: string
  /** 본조수량 (bscbgtQty) */
  bscbgtQty: string
  /** 당국수량 (athrtQty) */
  athrtQty: string
  /** 장국수량 (ltbndQty) */
  ltbndQty: string
  /** 본조예산 (bscbgtDrctnAmt) */
  bscbgtDrctnAmt: number
  /** 당국예산 (athrtDrctnAmt) */
  athrtDrctnAmt: string
  /** 장국예산 (ltbndDrctnAmt) */
  ltbndDrctnAmt: string
  /** 수량합계 (sumQty) */
  sumQty: string
  /** 지시단가 (drctnUntprc) */
  drctnUntprc: number
  /** 지시금액 (drctnAmt) */
  drctnAmt: number
  /** 장비부호 (aplcnEqpmntCd) */
  aplcnEqpmntCd: string
  /** 장비명 (aplcnEqpmntNm) */
  aplcnEqpmntNm: string
  /** 목표가 (goalAmt) */
  goalAmt: number
}

/**
 * 국외 보관함 입찰품목 1건 (MUI-CM-01-M73) — PC 실 인터페이스 보관함품목관리
 * `ovsLockerItemRegPopup.IDataList1`(2026-08-24 판독본) 키/타입 그대로(chk 제외).
 */
export interface OvsLockerBidItem {
  /** 렌더 key — 통합참조번호+항목번호 조합 (프론트 생성) */
  id: string
  /** 공고번호 (pbancNo) */
  pbancNo: string
  /** 공고차수 (pbancOd) */
  pbancOd: string
  /** 통합참조번호 (intgRfrncNo) */
  intgRfrncNo: string
  /** 구매요청번호 (prchsDmndNo) */
  prchsDmndNo: string
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
  drctnUntprc: number
  /** 화폐단위 (crncNm) — 예: 미달러 */
  crncNm: string
  /** 보관함여부 (lockerYn) — Y/N */
  lockerYn: 'Y' | 'N'
  /** 입찰내역작성여부 (tmprBidCnEn) — Y/N */
  tmprBidCnEn: 'Y' | 'N'
  /** 화폐코드 — 지시단가 표기의 USD. ⚠️ 판독본(IDataList1) 미존재 임시(원본 대조 필요) */
  crncCd: string
}

/**
 * 국외 입찰공고 상세 공고일반 (MUI-BD-01-T71(구 M71 — v1.83 재편)) — PC 실 인터페이스
 * `ovsBidPbancDtl.IResultPbanc`(2026-08-24 판독본) 키/타입 그대로.
 * 국외 입찰결과(no.168)·입찰참가신청조회(no.103)·입찰서제출(no.124)의 공고상세 응답도
 * 이 타입을 공유 — 해당 컨트롤러 응답 판독본은 없어 no.45 기준(원본 대조 필요).
 */
export interface OvsBidPbancDetail {
  /** 공고번호 (pbancNo) */
  pbancNo: string
  /** 공고차수 (pbancOd) */
  pbancOd: string
  /** 공고번호-차수 (pbancNoOd) */
  pbancNoOd: string
  /** 공고구분 (pbancTypeNm) */
  pbancTypeNm: string
  /** 공고의뢰일자 (pbancRqstYmd) */
  pbancRqstYmd: string
  /** 환율적용일자 (exchrtAplcnYmd) */
  exchrtAplcnYmd: string
  /** 구매요청번호 (prchsDmndNo) */
  prchsDmndNo: string
  /** 통합참조번호 (referNumb) */
  referNumb: string
  /** 사업명 (dtlBizNm) */
  dtlBizNm: string
  /** 개찰일시 (bdopnDt) */
  bdopnDt: string
  /** 입찰참가등록마감일시 (bidRegDdlnDt) */
  bidRegDdlnDt: string
  /** 입찰서제출마감일시 (tndrSbmsnDdlnDt) */
  tndrSbmsnDdlnDt: string
  /** 입찰유형 (bidTypeNm) — 단가제/총액제 */
  bidTypeNm: string
  /** 입찰매체 (bidMediaNm) */
  bidMediaNm: string
  /** 계약방법 (ctrtMthdNm) */
  ctrtMthdNm: string
  /** 낙찰방법 (scsbdMthdNm) */
  scsbdMthdNm: string
  /** 공고품목수 (itemCnt) */
  itemCnt: number
  /** 담당부서 (deptNm) */
  deptNm: string
  /** 담당자 (picNm) */
  picNm: string
  /** 연락처 (tlno) */
  tlno: string
  /** 환율정보개수 (exrtCnt) */
  exrtCnt: string
  /** 인증서개수 (ecrtCnt) */
  ecrtCnt: string
  /** 입찰참가등록마감여부 (bidRegEndYn) */
  bidRegEndYn: string
  /** 첨부문서Id (docId) */
  docId: string
  /** 조달번호 (prcmNo) */
  prcmNo: string
  // ── ⚠️ 판독본(IResultPbanc) 미존재 임시 항목 — 화면 표시행 유지용(원본 대조 필요) ──
  /** 입찰방식 (bidMth) — 예: 일반투찰. 구 설계서 표시행 */
  bidMth?: string
  /** 총금액 (sumDrctnAmt) — 달러 표기. 구 설계서 표시행 */
  sumDrctnAmt?: string
}

/**
 * 국외 입찰공고 공지사항 1건 — PC 실 인터페이스 `ovsBidPbancDtl.IResultNoti`
 * (2026-08-24 판독본) 키 그대로. 상세(M71) 상단 공지 영역.
 */
export interface OvsBidPbancNtc {
  /** 공지내용 (ntcCn) */
  ntcCn: string
  /** 공지일자 (ntcDt) */
  ntcDt: string
}

/** 국외 입찰참가신청서 등록결과 1건 (MUI-BD-04-P83). */
export interface OvsBidRegRsltItem {
  no: string
  /** 구매요청번호 */
  prchsDmndNo: string
  /** 사업명 */
  bizNm: string
  /** 확정결과 */
  cfmtnRslt: string
  /** 사유 */
  rsn?: string
  /** 확정일자 */
  cfmtnYmd?: string
}

/** 국외 입찰서 첨부문서 1건 (MUI-BD-06-T79(구 M79 — v1.83 재편)). */
export interface OvsTndrDoc {
  id: string
  /** 첨부서류명 */
  atchDocNm: string
  /** 첨부파일명 */
  atchFileNm: string
  /** 파일크기 */
  fileSz: string
}

/**
 * 국외 입찰서 입찰참여품목(단가제) 1건 (MUI-BD-06-T72(구 M72 — v1.83 재편) 작성 · MUI-BD-06-T77(구 M77 — v1.83 재편) 상세 공용 superset).
 * 작성(M72) 화면은 splyBzentyNm 를, 상세(M77) 화면은 입찰단가/금액·달러 필드를 추가로 표시.
 */
export interface OvsTndrItitbItem {
  /** 항목번호 (5) */
  frcptlArtclNo: string
  /** 재고번호 (9) */
  invtNo: string
  /** 부품번호 (32) */
  prtsNo: string
  /** 품명 (200) */
  itemNm: string
  /** 단위 (2) */
  unitNm: string
  /** 수량 (15) */
  qty: string
  /** 지시단가 (25) */
  drctnUntprc: string
  /** 화폐단위 (100) */
  crncNm: string
  /** 품목대체구분 — As it is / Replace */
  itemSbstSe: string
  /** 품목대체첨부문서 — 'O' | '' */
  itemSbstDocEn: 'O' | ''
  /** 수정재고번호 (13) */
  mdfcnInvtNo: string
  /** 수정부품번호 (32) */
  mdfcnPrtsNo: string
  /** MOQ구분 — Y/N */
  moqYn: 'Y' | 'N'
  /** MOQ수량 (15) */
  moqQty: string
  /** MOQ첨부문서 — 'O' | '' */
  moqDocEn: 'O' | ''
  /** 납기(본조) (8) */
  bscbgtDudtYmd: string
  /** 납기(당국) (8) */
  athrtDudtYmd: string
  /** 납기(장국) (8) */
  ltbndDudtYmd: string
  /** 달러환산율 (15) */
  usdExrt: string
  /** 입찰업체 (200) — 작성(M72) 화면 전용 */
  splyBzentyNm?: string
  /** 입찰단가 (25) — 상세(M77) 화면 전용 */
  bdngTccrUntprc?: string
  /** 입찰금액 (25) — 상세(M77) 화면 전용 */
  bdngTccrAmt?: string
  /** 달러단가 (25) — 상세(M77) 화면 전용 */
  bdngUsdUntprc?: string
  /** 달러금액 (25) — 상세(M77) 화면 전용 */
  bdngUsdAmt?: string
}
