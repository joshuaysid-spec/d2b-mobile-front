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

  // ── 진행 상태값 (버튼 분기·타이틀 상태표시 구동용) ───────────────────────────
  // ⚠️ 설계서 데이터영역 미정의(상세설계 예정) — 상태별 버튼 노출(slide68)/타이틀 표시를 구동하기 위한
  //    임시 항목(사용자 승인). 상세설계에서 영문 항목명이 확정되면 그 이름으로 교체한다.
  /** 입찰참가신청서 상태 (apfrStatNm) — '신청'|'미동의'|'등록확정'. 등록확정 시 입찰서 작성 가능 */
  apfrStatNm?: '신청' | '미동의' | '등록확정'
  /** 입찰서 상태 (tndrStatNm) — '미제출'|'제출'|'완료'|'입찰취소' */
  tndrStatNm?: '미제출' | '제출' | '완료' | '입찰취소'
  /** 입찰등록심사 시점 (applInsp) — 'pre'(사전등록심사)|'post'(사후등록심사). 사후면 등록확정 전에도 입찰서 작성 */
  applInsp?: 'pre' | 'post'
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
