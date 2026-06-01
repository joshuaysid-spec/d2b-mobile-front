// Design Ref: search-filter.design.md §3.2 (v2) — 조달계획(MUI-OP) 검색조건 value 타입.
// Figma MUI-OP-01-M02(node 9300-37302) 아코디언 섹션 기준. SearchFilterValue 와 구조 호환.
import type { DateRangeValue } from '@/types/search-filter'

/** 검색유형 (srchType) */
export type ProcurementSearchType = 'plan' | 'spec' | 'annual'
/** 업무구분 (taskSeNm) — 다중선택 */
export type ProcurementTaskSe =
  | 'all'
  | 'goods'
  | 'service'
  | 'construction'
  | 'overseas'
/** 진행상태 (implPrgrsStcd) */
export type ProcurementProgress = 'all' | 'plan' | 'posted' | 'waiting' | 'done'

/** 조달계획 검색필터 value (SearchFilterValue 호환) */
export interface ProcurementSearchFilter {
  /** 검색유형 (radio) */
  srchType: ProcurementSearchType
  /** 업무구분 (다중선택) — 이번 사이클 미구현(아코디언 빈 영역). 추후 checkbox */
  taskSeNm?: ProcurementTaskSe[]
  /** 일자 설정(발주예정월). 임시 일 단위 — TODO: 월 단위(YYYY-MM) */
  orderPrnmntYm: DateRangeValue
  /** 검색어 — 제목 */
  prcmPlanNm: string
  /** 검색어 — 판단번호 */
  prcmNo: string
  /** 검색어 — 대표품명 (선택필드, 공통팝업 P71 TODO) */
  rprsItemNm: string
  /** 검색어 — 발주기관 (선택필드, 공통팝업 P04 TODO) */
  deptCd: string
  /** 검색어 — 담당자 */
  userNm: string
  /** 구분설정 — 진행상태 */
  implPrgrsStcd: ProcurementProgress
  /** 구분설정 — 기능 (옵션 추후 확정) */
  inspShcd: string
  /** 구분설정 — 입찰형태 (옵션 추후 확정) */
  bidSecd: string
  /** 구분설정 — 계약방법 (옵션 추후 확정) */
  ctrtMthdCd: string
}
