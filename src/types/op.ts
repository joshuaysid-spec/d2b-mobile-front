// Design Ref: search-filter.design.md §3.2 — 조달(OP, MUI-OP) 검색조건 value 타입.
// 느슨한 alias — 검색필터 공통 value 타입(SearchFilterValue) 그대로. (빡빡한 union 대신, 캐스팅 불필요)
// 값 키(참고): srchType · taskSeNm · orderPrnmntYm · prcmPlanNm · prcmNo ·
//             rprsItemNm · deptCd · userNm · implPrgrsStcd · inspShcd · bidSecd · ctrtMthdCd
import type { SearchFilterValue } from '@/types/search-filter'

export type OpSearchFilter = SearchFilterValue

// 조달계획 통합목록 카드 1건 (목업/추후 API 응답 매핑) — Design Ref: op-list-page.design §3.1
export interface OpPlanItem {
  /** 카드 식별자 (상세 라우팅 키) */
  id: string
  /** 업무구분 뱃지 (예: '물품') */
  taskSe: string
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
}
