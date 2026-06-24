// 입찰(BD, MUI-BD) 도메인 타입. Design Ref: 02입찰 설계서 1.1~1.4 (MUI-BD-01-M01 입찰공고통합목록).
// 검색조건 value 는 검색필터 공통 value 타입(SearchFilterValue)을 그대로 alias (캐스팅 불필요).
import type { SearchFilterValue } from '@/types/search-filter'

export type BidSearchFilter = SearchFilterValue

/**
 * 입찰공고 통합목록 카드 1건 (MUI-BD-01-M01, 설계서 1.4 데이터영역).
 * 필드명·코드값·형식은 설계서 그대로 — 목업이지만 실제 API 응답처럼 구성(추후 bdService.getList 매핑).
 */
export interface BidPbancItem {
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
  /** 공고일자 (예: '2026-02-12') */
  pbancDt: string
  /** 입찰참가신청 마감일시 (예: '2026-03-16 15:00') */
  bidPtcptAplyDdlnDt: string
  /** 입찰서제출 마감일시 (예: '2026-03-17 15:00') */
  bidDocSbmsnDdlnDt: string
  /** 개찰일시 (예: '2026-03-26 11:00') */
  opbidDt: string
  /**
   * 진행상태명 (설계서 항목명 bidStatNm, slide20·47 / 상위코드 ANTC).
   * 입찰 세부 진행상태 — 개찰전/개찰완료/재입찰/유찰.
   */
  bidStatNm: string
  /**
   * 진행단계 — 단계표시기(StepBar) 구동값. 조달/입찰/계약/이행/대금청구 5단계 중 현재 단계.
   * ⚠️ 설계서 데이터영역에 정의된 항목 아님(상세설계 예정) — 단계표시기 구동용으로 추가(사용자 승인).
   *    실제 단계 세부상태는 bidStatNm(입찰)·implPrgrsStcd(조달) 등 도메인 항목이 별도로 가짐.
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
  /** 사전심사(PQ) 공고 여부 (bfhdSrng) — 신청유형 배지 */
  bfhdSrng: boolean
  /** 입찰참가신청서 대상 여부 (bidPrgrsApfr) — 신청유형 배지 */
  bidPrgrsApfr: boolean
  /** 입찰서(견적서) 제출 가능 여부 (tndr) — 신청유형 배지 */
  tndr: boolean
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
