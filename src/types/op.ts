// Design Ref: search-filter.design.md §3.2 — 조달(OP, MUI-OP) 검색조건 value 타입.
// 느슨한 alias — 검색필터 공통 value 타입(SearchFilterValue) 그대로. (빡빡한 union 대신, 캐스팅 불필요)
// 값 키(참고): srchType · taskSeNm · orderPrnmntYm · prcmPlanNm · prcmNo ·
//             rprsItemNm · deptCd · userNm · implPrgrsStcd · inspShcd · bidSecd · ctrtMthdCd
import type { SearchFilterValue } from '@/types/search-filter'

export type OpSearchFilter = SearchFilterValue

/**
 * 검색유형 — 기획서 srchType. 조달계획/사전규격/연간조달계획.
 * 카드 클릭 라우팅 분기에 사용: 'spec' → 사전규격상세(/op/spec/:id), 그 외 → 조달계획상세(/op/:id).
 */
export type OpSrchType = 'plan' | 'spec' | 'annual'

// 조달계획 통합목록 데이터(dlt_prcmPlanList, 기획서 p15 1.4) 카드 1건 (목업/추후 API 매핑).
export interface OpPlanItem {
  /** 카드 식별자 (상세 라우팅 키) */
  id: string
  /** 검색유형 — 'spec'(사전규격)이면 사전규격상세로 라우팅. */
  srchType: OpSrchType
  /** 업무구분(taskSeNm) — 물품/용역/공사/국외. '국외'면 국외 조달(국내/국외 분기 기준). */
  taskSeNm: string
  /** 계약방법 뱃지 (예: '수의계약') */
  ctrtMthdNm: string
  /** 판단번호 (예: '6000A') — 카드 subtitle(주요 정보) */
  prcmNo: string
  /** 카드 제목 (예: "'26년 K5방독면") */
  title: string
  /** 발주예정월 (예: '2026-03') */
  orderPrnmntYm: string
  /** 발주기관 (예: '화력총괄계약팀') */
  orderDeptNm: string
  /** 계약방법 (예: '총액제') */
  ctrtMthd: string
  /** 예산금액 (원, 정수) — 표시 시 천단위 콤마 + ' 원' */
  budgetAmt: number
  /**
   * 진행단계 — 단계표시기(StepBar) 구동값. 조달/입찰/계약/이행/대금청구 5단계 중 현재 단계.
   * ⚠️ 설계서 데이터영역 미정의(상세설계 예정) — 단계표시기 구동용으로 추가(사용자 승인).
   *    진행상태 implPrgrsStcd(조달계획/공고게시/계약대기/계약완료)는 조달 세부상태로 별개.
   */
  prgrsStg?: string
}
