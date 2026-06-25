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

// 조달계획 통합목록 데이터(설계서 dlt_prcmPlanList) 카드 1건 — 항목명 설계서 그대로.
export interface OpPlanItem {
  /** 카드 식별자 (상세 라우팅 키) */
  id: string
  /** 검색유형(srchType) — 'spec'(사전규격)이면 사전규격상세로 라우팅. */
  srchType: OpSrchType
  /** 순번 (no) */
  no: number
  /** 업무구분(taskSeNm) — 물품/용역/공사/국외. '국외'면 국외 조달(국내/국외 분기 기준). */
  taskSeNm: string
  /** 판단번호(prcmNo, 예: '6000A') — 카드 subtitle */
  prcmNo: string
  /** 발주예정월(orderPrnmntYm, yyyy-mm) */
  orderPrnmntYm: string
  /** 제목(prcmPlanNm) — 카드 title */
  prcmPlanNm: string
  /** 발주기관(deptCd, 상위코드 RIC — 조회결과는 기관명) */
  deptCd: string
  /** 담당자(userNm) */
  userNm: string
  /** 계약방법(ctrtMthdCd, 상위코드 CTMC — 조회결과는 계약방법명) */
  ctrtMthdCd: string
  /** 입찰방법(bidMthdCd, 상위코드 BDTC — 조회결과는 입찰방법명) */
  bidMthdCd: string
  /** 예산금액(drctnAmt, 원 정수) — 표시 시 천단위 콤마 + ' 원' */
  drctnAmt: number
  /** 진행상태(implPrgrsStcd) — 조달계획/공고게시/계약대기/계약완료 */
  implPrgrsStcd: string
  /**
   * 진행단계 — 단계표시기(StepBar) 구동값(조달/입찰/계약/이행/대금청구).
   * ⚠️ 설계서 데이터영역 미정의(상세설계 예정) — 단계표시기 구동용 추가(사용자 승인). implPrgrsStcd 와 별개.
   */
  prgrsStg?: string
}

/**
 * 조달계획 상세 응답 — 목록→상세 표준(navigate state + id 조회, CLAUDE.md "목록 → 상세 데이터 전달").
 * 헤더/요약은 목록 아이템(OpPlanItem)과 동일 필드. 상세 전용 섹션(집행계획·판단내역 등)은
 * 추후 설계서 데이터영역 기준으로 확장한다.
 */
export type OpPlanDetail = OpPlanItem
