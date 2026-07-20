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

// ── OP 서비스(services/op.ts) 요청/응답 타입(추정 — TODO(백엔드 확정)) ──
// 페이지는 아직 목업 구동(services 미소비)이라 아래 형태는 잠정. 실백엔드 확정 시 이 섹션 + 매핑만 교체.

/** 조달계획 통합목록 조회 요청 — MUI-OP-01-M02 (getList). */
export interface OpListRequest {
  /** 검색유형(srchType) — 조달계획/사전규격/연간조달계획. */
  srchType: OpSrchType
  /** 빠른검색어(keyword) — 입력 시에만. */
  keyword?: string
  /** 빠른검색 대상(searchTarget) — prcmPlanNm/prcmNo/stockNo/prcmReqNo. */
  searchTarget?: string
  /** 페이지(1부터) — 생략 시 전체 반환(현 클라이언트 페이징). 서버 페이징 전환 시 필수화. */
  page?: number
  /** 페이지 크기(10/30/50) — 생략 시 전체 반환. */
  pageSize?: number
  /** 상세필터 확정값(SearchFilter) — 선택. */
  filter?: OpSearchFilter
}

/** 목록 조회 결과 — 카드 목록 + 총건수(더보기/페이징 구동). */
export interface OpListResult {
  /** 현재 페이지 카드 목록. */
  list: OpPlanItem[]
  /** 전체 건수(총 N건 표시·더보기 종료 판정). */
  total: number
}

/** 입찰공고 알림신청 요청 — 조달계획상세 알림신청(MUI-OP-01-P10). */
export interface OpNotifyRequest {
  /** 대상 조달계획 식별자(id). */
  id: string
  /** 휴대번호(phone) — 하이픈 제거 숫자. */
  phone: string
  /** 광고성 정보 수신 동의(agree). */
  agree: boolean
}

/**
 * 품목명세서 1건 — 품목명세서 탭(MUI-OP-01-M04, getItemSpecs).
 * 필드는 설계서 slide25 항목 기준(잠정) — 단가/금액은 비공개('- 원').
 */
export interface OpItemSpec {
  /** 순번(no). */
  no: number
  /** 재고번호(invtNo) — 목록정보조회(P75/P76) 참조 키. */
  invtNo: string
  /** 품명(itemNm). */
  itemNm: string
  /** 규격번호(specNo). */
  specNo: string
  /** 수량(qty). */
  qty: string
  /** 단위(unit). */
  unit: string
}

/**
 * 업체의견 1건 — 업체의견 탭(MUI-OP-01-M05, getOpinions). 답변(reply)은 선택.
 * 필드는 설계서 slide26 예시 기준(잠정).
 */
export interface OpOpinion {
  /** 안정 고유 식별자(id). */
  id: string
  /** 공개여부(isPublic) — 비공개는 작성자만 열람. */
  isPublic: boolean
  /** 업체명(company). */
  company: string
  /** 제목(title). */
  title: string
  /** 작성자명(name). */
  name: string
  /** 작성일시(datetime, 'yyyy-mm-dd hh:mm'). */
  datetime: string
}

/** 국외 조달계획 집행결과 1건 — 국외 상세 결과목록(MUI-OP-01-M74, getOverseasPlanResults). */
export interface OpOverseasPlanResult {
  /** 안정 고유 식별자(id). */
  id: string
  /** 조달요구번호(prcmReqNo). */
  prcmReqNo: string
  /** 품명(itemNm). */
  itemNm: string
  /** 계약금액(USD, ctrtAmtUsd) — 표시 시 '$' + 콤마. */
  ctrtAmtUsd: number
}

/** 품목별 검색 요청 — 품목별 검색(MUI-OP-01-P71, searchItems). */
export interface OpItemSearchRequest {
  /** 요구년도(year, 필수). */
  year: string
  /** 품명(itemNm) — 부분일치. */
  itemNm?: string
  /** 재고번호(invtNo) — 부분일치. */
  invtNo?: string
  /** 부품번호(prtsNo) — 부분일치. */
  prtsNo?: string
}

/** 품목별 검색 결과 1건(dl_resultList). */
export interface OpItemSearchResult {
  /** 재고번호(invtNo). */
  invtNo: string
  /** 부품번호(prtsNo). */
  prtsNo: string
  /** 품명(itemNm). */
  itemNm: string
}

/** 생산자 검색 요청 — 생산자 검색(MUI-OP-01-P72, searchProducers). */
export interface OpProducerSearchRequest {
  /** 생산자명(prdctnNm) — 부분일치. */
  prdctnNm?: string
}

/** 생산자 검색 결과 1건(dl_resultList). */
export interface OpProducerSearchResult {
  /** 생산자코드(CAGE). */
  cage: string
  /** 생산자명(prdctnNm). */
  prdctnNm: string
}

/** 발주부서(기관) 검색 요청 — 발주부서 검색(MUI-BD-01-P04, searchDepts). */
export interface OpDeptSearchRequest {
  /** 발주기관명(keyword) — 부분일치. */
  keyword?: string
}

/** 발주부서(기관) 검색 결과 1건(dl_resultList). */
export interface OpDeptSearchResult {
  /** 발주기관(부서)명(instNm). */
  instNm: string
  /** 기관구분(instSe) — 육군/군수사/교육사/학교/경리단 등. */
  instSe: string
}
