// Design Ref: search-filter.design.md §3.2 — 조달(OP, MUI-OP) 검색조건 value 타입.
// 느슨한 alias — 검색필터 공통 value 타입(SearchFilterValue) 그대로. (빡빡한 union 대신, 캐스팅 불필요)
// 값 키(참고): srchType · taskSeNm · orderPrnmntYm · prcmPlanNm · prcmNo ·
//             rprsItemNm · deptCd · userNm · implPrgrsStcd · inspShcd · bidSecd · ctrtMthdCd
import type { SearchFilterValue } from '@/types/search-filter'

export type MockOpSearchFilter = SearchFilterValue

/**
 * 검색유형 — 기획서 srchType. 조달계획/사전규격/연간조달계획.
 * 카드 클릭 라우팅 분기에 사용: 'spec' → 사전규격상세(/op/spec/:id), 그 외 → 조달계획상세(/op/:id).
 */
export type MockOpSrchType = 'plan' | 'spec' | 'annual'

// 조달계획 통합목록 데이터(설계서 dlt_prcmPlanList) 카드 1건 — 항목명 설계서 그대로.
// 연간조달계획(annual)은 데이터영역이 아예 다르다(dlt_anlPrcmPlanList → MockOpAnlPrcmPlanItem).
export interface MockOpPlanItem {
  /** 카드 식별자 (상세 라우팅 키) */
  id: string
  /** 검색유형(srchType) — 'spec'(사전규격)이면 사전규격상세로 라우팅. */
  srchType: 'plan' | 'spec'
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
 * 헤더/요약은 목록 아이템(MockOpPlanItem)과 동일 필드. 상세 전용 섹션(집행계획·판단내역 등)은
 * 추후 설계서 데이터영역 기준으로 확장한다.
 */
export type MockOpPlanDetail = MockOpPlanItem

// ── OP 서비스(services/op.ts) 요청/응답 타입(추정 — TODO(백엔드 확정)) ──
// 페이지는 아직 목업 구동(services 미소비)이라 아래 형태는 잠정. 실백엔드 확정 시 이 섹션 + 매핑만 교체.

/** 조달계획 통합목록 조회 요청 — MUI-OP-01-M02 (getList). */
export interface MockOpListRequest {
  /** 검색유형(srchType) — 조달계획/사전규격/연간조달계획. */
  srchType: MockOpSrchType
  /** 빠른검색어(keyword) — 입력 시에만. */
  keyword?: string
  /** 빠른검색 대상(searchTarget) — prcmPlanNm/prcmNo/stockNo/prcmReqNo. */
  searchTarget?: string
  /** 페이지(1부터) — 생략 시 전체 반환(현 클라이언트 페이징). 서버 페이징 전환 시 필수화. */
  page?: number
  /** 페이지 크기(10/30/50) — 생략 시 전체 반환. */
  pageSize?: number
  /** 상세필터 확정값(SearchFilter) — 선택. */
  filter?: MockOpSearchFilter
}

/**
 * 통합목록 카드 1건 — 검색유형(srchType)으로 판별하는 유니온.
 * 조달계획/사전규격(dlt_prcmPlanList)과 연간조달계획(dlt_anlPrcmPlanList)은 표시 항목이 완전히 다르다.
 */
export type MockOpListItem = MockOpPlanItem | MockOpAnlPrcmPlanItem

/** 목록 조회 결과 — 카드 목록 + 총건수(더보기/페이징 구동). */
export interface MockOpListResult {
  /** 현재 페이지 카드 목록. */
  list: MockOpListItem[]
  /** 전체 건수(총 N건 표시·더보기 종료 판정). */
  total: number
}

/** 입찰공고 알림신청 요청 — 조달계획상세 알림신청(MUI-OP-01-P10). */
export interface MockOpNotifyRequest {
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
export interface MockOpItemSpec {
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
export interface MockOpOpinion {
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

/**
 * 업체의견 등록/수정 요청 — MUI-OP-01-P07 (insert/updateBzentyOpnn, 실 API no.9·no.10).
 * ⚠️ 항목명 잠정 — 화면 미배선(등록 팝업은 아직 목업). 상세설계 확정 시 교체.
 */
export interface MockOpOpnnRequest {
  /** 대상 조달계획/사전규격 식별자 — 판단번호(prcmNo). */
  prcmNo: string
  /** 업체의견 식별자 — 수정(no.10) 시에만. */
  opnnId?: string
  /** 제목(title). */
  title: string
  /** 내용(cn). */
  cn: string
  /** 공개여부(isPublic). */
  isPublic: boolean
}

// ── 국외 연간조달계획 상세 — MUI-OP-01-M78 (ovsPrcmPlanDtl/OvsPrcmPlanDtlPage) ──────
// 설계서 01.조달계획 v0.84 slide22(항목설명 dlt_anlPrcmPlanList) + slide76~77(화면).
// M78 은 "목록 데이터 전체 표시"라 연간조달계획 목록 데이터영역 1건이 곧 상세 데이터다.
// ⚠️ 여기서 'Anl' 은 **연간**(dml_anlPrcmPlanSrch/dlt_anlPrcmPlanList)이다 —
//    연관조달계획상세(P12, AnlPrcmPlanDtl)와 철자가 같지만 다른 화면이니 혼동하지 말 것.

/** 연간조달계획 1건(dlt_anlPrcmPlanList) — 목록 카드 표시분 + 상세 전체 항목. */
export interface MockOpAnlPrcmPlanItem {
  /** 카드 식별자(상세 조회 키) — 설계서 데이터영역 미정의, 프론트 목록 key 용. */
  id: string
  /** 검색유형(srchType) — 연간조달계획 고정. MockOpPlanItem 과의 판별자. */
  srchType: 'annual'
  /** 순번(no). */
  no: number
  /** 업무구분(taskSeNm) — 연간조달계획은 '국외' 고정(설계서 slide76 '기본 노출 국외'). */
  taskSeNm: string
  /** 군구분(prcmRqtInstCd). */
  prcmRqtInstCd: string
  /** 조달요구번호(prcmRqtNo). */
  prcmRqtNo: string
  /** 재고번호(fscCdNtnItemIdntfNo = 군급코드 + 국가품목식별번호). 클릭 시 목록정보조회(P76). */
  fscCdNtnItemIdntfNo: string
  /** 부품번호(prtsNo). */
  prtsNo: string
  /** 품질 등급(inspShcd). */
  inspShcd: string
  /** 생산자 부호(prdcrSgn). */
  prdcrSgn: string
  /** 생산자 중복(prdcrDpcn). */
  prdcrDpcn: string
  /** 단위(unitCd). */
  unitCd: string
  /** 수량(drctnQty). */
  drctnQty: number
  /** 지시단가(USD)(drctnUntprc). */
  drctnUntprc: number
  /** 지시예산(USD)(drctnAmt). */
  drctnAmt: number
  /** 품명(itemNm). */
  itemNm: string
  /** 규격번호(spcfctNo). */
  spcfctNo: string
  /** 장비부호(aplcnEqpmntCd). */
  aplcnEqpmntCd: string
  /** 장비명(aplcnEqpmntNm). */
  aplcnEqpmntNm: string
  /** 구매요청번호(prgrNo). */
  prgrNo: string
  /** 항목 번호(clsfNo). */
  clsfNo: string
  /**
   * 기능 — ⚠️ 설계서(slide20 검색조건·slide22 데이터영역)가 품질 등급과 **같은 영문키 `inspShcd`**
   * 를 적어 두 항목을 구분할 수 없다. 한 객체에 같은 키를 둘 수 없어 임시 키 `functnNm` 사용
   * (검색필터 구분설정의 기능 키는 `functnCd`). 상세설계 확정 시 실제 항목명으로 교체.
   */
  functnNm: string
  /** 진행상태(frcptlItemMsprgStcd) — 조달계획/공고게시/계약대기/계약완료. */
  frcptlItemMsprgStcd: string
  /** 품류(itemFwkCd). */
  itemFwkCd: string
  /**
   * 접수기간 — 카드/요약 표시 항목(설계서 slide76·77 화면)이나 데이터영역(slide22)에 영문키가
   * 없다. 임시 키 `rcptPd`(yyyy-mm-dd ~ yyyy-mm-dd) — 상세설계 확정 시 교체.
   */
  rcptPd: string
}

/** 품목별 검색 요청 — 품목별 검색(MUI-OP-01-P71, searchItems). */
export interface MockOpItemSearchRequest {
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
export interface MockOpItemSearchResult {
  /** 재고번호(invtNo). */
  invtNo: string
  /** 부품번호(prtsNo). */
  prtsNo: string
  /** 품명(itemNm). */
  itemNm: string
}

/** 생산자 검색 요청 — 생산자 검색(MUI-OP-01-P72, searchProducers). */
export interface MockOpProducerSearchRequest {
  /** 생산자명(prdctnNm) — 부분일치. */
  prdctnNm?: string
}

/** 생산자 검색 결과 1건(dl_resultList). */
export interface MockOpProducerSearchResult {
  /** 생산자코드(CAGE). */
  cage: string
  /** 생산자명(prdctnNm). */
  prdctnNm: string
}

/** 발주부서(기관) 검색 요청 — 발주부서 검색(MUI-BD-01-P04, searchDepts). */
export interface MockOpDeptSearchRequest {
  /** 발주기관명(keyword) — 부분일치. */
  keyword?: string
}

/** 발주부서(기관) 검색 결과 1건(dl_resultList). */
export interface MockOpDeptSearchResult {
  /** 발주기관(부서)명(instNm). */
  instNm: string
  /** 기관구분(instSe) — 육군/군수사/교육사/학교/경리단 등. */
  instSe: string
}

// ── 목록정보조회(군수품 목록) — MUI-OP-01-P76 ~ P77 ────────────────────────
// 설계서 01.조달계획 v0.82 slide77~84. 연간조달계획 상세(/op/ovs/:id)의 3탭 + 업체정보 시트.
// 항목명(영문)은 설계서 "항목 설명" 표 그대로 — 임의 작명 금지.

/**
 * 목록정보조회 3탭 공통 조회 요청.
 * - `niin` 없음 = 해당 연간조달계획이 보유한 **디폴트 값** 조회(진입 시 표시)
 * - `niin` 있음 = NIIN 검색 결과 조회(디폴트 값 아래에 이어서 표시)
 * TODO(백엔드 확정): 설계서 검색조건(dm_searchInfo)에는 재고번호(invtNo)만 정의돼 있어
 *   계획 식별자 파라미터명이 미정이다. 반입 시 planId 키를 실제 규격에 맞춘다.
 */
export interface MockWarSplInqRequest {
  /** 연간조달계획 식별자 — 디폴트 값 조회 기준. */
  planId: string
  /** 검색 NIIN(국가품목 식별번호). 비면 디폴트 조회. */
  niin?: string
}

/** 식별정보 데이터 영역(dm_itemInfo) — 형상자료(T73) 상단. */
export interface MockWarSplItemInfo {
  /** 재고번호(invtNo). */
  invtNo: string
  /** 영문품명(itemNmEng). */
  itemNmEng: string
  /** 한글품명(itemNmKor). */
  itemNmKor: string
  /** 군급(fsc). */
  fsc: string
}

/** 참조번호 데이터 영역(dl_refList) 1건 — 형상자료(T73) 하단. */
export interface MockWarSplRefNo {
  /** 목록 key 용 식별자 — 설계서 미정의(참조번호 중복 가능). */
  id: string
  /** 참조번호(rfrncNo). */
  rfrncNo: string
  /** 구분(type) — 도면번호/기타 등. */
  type: string
  /** 생산자부호(prdctnCd) — 업체정보(P77) 조회 키. */
  prdctnCd: string
  /** 생산자명(prdctnNm). */
  prdctnNm: string
}

/** 형상자료(MUI-OP-01-T73 WarSplList_Cnfg) 조회 결과. */
export interface MockWarSplCnfg {
  itemInfo: MockWarSplItemInfo
  refList: MockWarSplRefNo[]
}

/** 식별자료 데이터 영역(dm_idntfInfo) — 식별자료(MUI-OP-01-T74 WarSplList_Idntf). */
export interface MockWarSplIdntf {
  /** 군급분류(fsc). */
  fsc: string
  /** 영문품명(itemNmEng). */
  itemNmEng: string
  /** 한글품명(itemNmKor). */
  itemNmKor: string
  /** FIIG 긴요도부호(FCC) — 장비의 안전을 관리하는 코드. */
  fcc: string
  /** 취소이유 부호(DRC) — 물리적 파괴나 변형이 필요한 정도를 구분하는 코드. */
  drc: string
  /** 품목식별 지침서번호(FIIG 순번). */
  fiigNo: string
  /** 품명부호(INC) — 표준화된 이름으로 식별하기 위해 부여된 식별번호. */
  inc: string
  /** 자동자료처리 장비부호(ADPEC). */
  adpec: string
  /** 귀금속 지시부호(PMIC). */
  pmic: string
  /** 참조/부분 서술형 원인부호(RPDMRC). */
  rpdmrc: string
  /** 대체재고 번호(sbstInvtNo). */
  sbstInvtNo: string
  /** 품목식별 형태부호(TIIC). */
  tiic: string
  /** 품종 구분번호(CS). */
  cs: string
  /** 제조국부호(NTL). */
  ntl: string
  /** 재고번호 식별부호(IS) — ⚠️ 설계서 항목명이 `ls`(소문자 L)로 표기됨. 설계서 그대로 유지. */
  ls: string
  /** 비군사화 부호(DEMIL). */
  demil: string
  /** 정전기 방전부호(ESDC). */
  esdc: string
  /** 품목식별번호 상태부호(NSC). */
  nsc: string
  /** 위험물자부호(HMIC). */
  hmic: string
  /** 위험특성부호(HCC). */
  hcc: string
  /** 목록화담당자(picNm). */
  picNm: string
  /** 국가품목 식별번호(NIIN) 부여일자(niinYmd). */
  niinYmd: string
  /** 자료변경일자(chgYmd). */
  chgYmd: string
}

/** 참고자료 데이터 영역(dl_refList) 1건 — 참고자료(MUI-OP-01-T75 WarSplList_Ref). */
export interface MockWarSplRef {
  /** 목록 key 용 식별자 — 설계서 미정의(참고번호 중복 가능). */
  id: string
  /** 참고번호 R/N(refNo). */
  refNo: string
  /** 생산자 NSCM(nscm) — 제조업체에 부여된 5자리 고유 식별부호. */
  nscm: string
  /** 형태 RNFC(rnfc). */
  rnfc: string
  /** 범주 RNCC(rncc). */
  rncc: string
  /** 분류 RNVC(rnvc). */
  rnvc: string
  /** 가용성 DAC(dac). */
  dac: string
  /** 조치 RNAA(rnaa). */
  rnaa: string
  /** 상태 RNSC(rnsc). */
  rnsc: string
  /** 교정 RNJC(rnjc) — ⚠️ 화면 목업은 'RNIC' 표기, 항목설명 1.7 은 RNJC/rnjc. 항목설명을 따름. */
  rnjc: string
  /** 설계 SADC(sadc) — 민군공용부호. 항목설명 1.7 에만 존재(화면 목업 컬럼 없음). */
  sadc: string
}

/** 업체정보 데이터 영역(dm_bzentyInfo) — 업체정보(MUI-OP-01-P77 WarSplList_BzEnty). */
export interface MockWarSplBzEnty {
  /** 업체명(bzentyNm). */
  bzentyNm: string
  /** 대표자(rprsvNm). */
  rprsvNm: string
  /** 본사주소(addr). */
  addr: string
  /** 사업자번호(bzmnNo). */
  bzmnNo: string
  /** 전화번호(tlno). */
  tlno: string
  /** FAX(fxno). */
  fxno: string
}

// ── 품목별 가격자료 — MUI-OP-01-P75 (prcDataList/PrcDataList) ───────────────
// 설계서 01.조달계획 v0.82 slide72(화면 p71) + slide73~74(항목설명 p72~73).
// 항목명(영문)은 설계서 "항목 설명" 표 그대로 — 임의 작명 금지.

/**
 * 품목별 가격자료 검색조건(dm_searchInfo, slide73) — 전 필드 부분 입력 가능.
 * TODO(백엔드 확정): 획득구분 코드값(acqstnTypeCd, 자리수 8)은 설계서에 라벨만 정의
 *   (상업실적사/FMS실적가/BOA청구가/CSP구매가/업체공표(견적)가/무관정보가) — 코드 미정.
 */
export interface MockPrcDataSearchRequest {
  /** 획득구분(acqstnTypeCd) — '전체' 선택 시 생략. */
  acqstnTypeCd?: string
  /** 군급(fsc). */
  fsc?: string
  /** NIIN — 국가식별코드(niin). */
  niin?: string
  /** 부품번호(prtsNo). */
  prtsNo?: string
  /** 품명(itemNm). */
  itemNm?: string
}

/** 품목별 가격자료 검색결과 1건(dl_resultList, slide74 — 22항목). */
export interface MockPrcDataItem {
  /** 순번(no). */
  no: number
  /** 획득구분(acqstnTypeCd). */
  acqstnTypeCd: string
  /** 획득구분명(acqstnTypeNm). */
  acqstnTypeNm: string
  /** 군급(fsc). */
  fsc: string
  /** NIIN — 국가식별코드(niin). */
  niin: string
  /** 부품번호(prtsNo). */
  prtsNo: string
  /** 단위(unitNm). */
  unitNm: string
  /** 규격번호(spcfctNo). */
  spcfctNo: string
  /** 적용장비(aplcnEqpmntCd). */
  aplcnEqpmntCd: string
  /** 적용장비명(aplcnEqpmntNm). */
  aplcnEqpmntNm: string
  /** 품명(itemNm). */
  itemNm: string
  /** 화폐(crncNm). */
  crncNm: string
  /** 화폐구분명(crncEngNm). */
  crncEngNm: string
  /** 국가(ntnCd). */
  ntnCd: string
  /** 국가명(ntnNm). */
  ntnNm: string
  /** 단가(untprc). */
  untprc: string
  /** 수량(qty). */
  qty: string
  /** 계약일자(ctrtYmd). */
  ctrtYmd: string
  /** 업체(bzentyCd). */
  bzentyCd: string
  /** 업체명(bzentyNm). */
  bzentyNm: string
  /** 획득일자(acqstnYmd). */
  acqstnYmd: string
  /** 계약번호(획득근거)(ctrtNo). */
  ctrtNo: string
}

/** 품목별 가격자료 조회 결과 — 결과 목록 + 총건수('총 N건' 표시). */
export interface MockPrcDataResult {
  list: MockPrcDataItem[]
  total: number
}
