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
   * 단계표시기(StepBar) 구동값 — 조달/입찰/계약/이행/대금청구 5단계 중 현재 단계.
   */
  bidStatNm: string
}
