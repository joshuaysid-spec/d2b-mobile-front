// 공통관리(CM, MUI-CM) 도메인 타입.
// cm 하위 화면(인증서·FAQ·공지사항/자료실·마이페이지)의 공유 타입을 한 파일에 모은다.
// (과거 types/cert.ts·faq.ts·notice.ts·mypage.ts 를 도메인 단위로 통합 — CLAUDE.md "타입 정의" 규칙.)
import type { DateRangeValue } from '@/types/search-filter'

// ─────────────────────────────────────────────────────────────────────────────
// 인증서 관리 (MUI-CM-04-M14 / 삭제 P15). 설계서 00.공통 v0.83 slide337·338.
// ⚠️ 인증서 항목은 스마트PKI 솔루션이 제공하며, 설계서에 데이터영역(항목명 영문) 표가 없다.
//    아래 필드명은 화면 표기(발급기관/타이틀명/유효기간) 기준의 잠정 명칭 — 항목명 확정 시 교체 필요.
// ─────────────────────────────────────────────────────────────────────────────

export interface CertItem {
  /** 로컬 식별자(목록 key·삭제 대상 식별). */
  id: string
  /** 발급기관 (예: 한국정보인증, 코스콤). */
  issuer: string
  /** 인증서 타이틀명. */
  certNm: string
  /** 유효기간 만료일 'YYYY-MM-DD'. */
  validUntil: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 자주묻는질문 FAQ (MUI-CM-04-M03). 설계서 00.공통 v0.83 slide233 항목명(영문) 준수.
// 상세 화면이 별도로 없고 목록에서 아코디언으로 답변을 펼친다(질문=qstnTtl, 답변=contsCn).
// ─────────────────────────────────────────────────────────────────────────────

/** 자주묻는질문 목록 데이터영역(dl_resultList) 1건. */
export interface FaqListItem {
  /** 순번(no). */
  no: number
  /** 자주묻는질문 ID(bbsId) — 아코디언 key. 설계서 6자리·Hidden. */
  bbsId: string
  /** 구분(bizFldCd) — FAQ 구분 코드(FAQCD). 상단 탭·배지로 표시. */
  bizFldCd: string
  /** 제목=질문(qstnTtl). 말줄임 없이 전체 표시. */
  qstnTtl: string
  /** 작성일자(regDt) — 'YYYY-MM-DD'. */
  regDt: string
  /** 조회(inqNocs) — 조회횟수. */
  inqNocs: number
  /** 내용=답변(contsCn). 아코디언 펼침 시 표시. */
  contsCn: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 공지사항 (MUI-CM-04-M01 목록 / M02 상세). 설계서 00.공통 v0.83 slide217·225.
// 항목명(영문) 준수. 검색조건 = dm_searchInfo · 데이터영역 = dl_resultList.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 공지사항 목록 데이터영역(dl_resultList) 1건 — 설계서 항목명(영문) 준수.
 * (담당부서/작성자/조회 등은 데이터엔 있으나 카드에는 Figma 기준 제목·긴급·날짜·첨부만 노출)
 */
export interface NoticeListItem {
  /** 순번(no) — 목록 순번. */
  no: number
  /** 공지사항 ID(contsNo) — 상세(MUI-CM-04-M02) 조회 키. 설계서 6자리·Hidden. */
  contsNo: string
  /** 구분(bizFldCd) — 공지사항구분 코드(공통코드 BIZCD). */
  bizFldCd: string
  /** 긴급(emrg) — '긴급' | '일반'. 배지 색 분기(긴급=red / 일반=blue). */
  emrg: '긴급' | '일반'
  /** 상위고정(upFix) — 'Y' | 'N'. 'Y'는 목록 상단 고정 노출. */
  upFix: 'Y' | 'N'
  /** 제목(bbsTtl) — 최대 2줄, 넘치면 말줄임. */
  bbsTtl: string
  /** 첨부(fileCnt) — 첨부파일 개수. 0이면 미표시. */
  fileCnt: number
  /** 담당부서(tkcgDeptNm). */
  tkcgDeptNm: string
  /** 작성자(wrtrNm). */
  wrtrNm: string
  /** 작성일자(regDt) — 'YYYY-MM-DD'. */
  regDt: string
  /** 조회(inqCnt) — 조회횟수. */
  inqCnt: number
}

/**
 * 공지사항 검색조건(dm_searchInfo) — 설계서 항목명(영문) 준수.
 * 구분(bizFldCd 구분설정)은 요청에 따라 검색필터에서 제외한다.
 * 작성일자는 FROM/TO(둘 다 regDt) 범위이므로 DateRangeValue 로 표현한다.
 */
export interface NoticeSearchFilter {
  /** 작성일자 범위(regDt FROM~TO). */
  regDt: DateRangeValue
  /** 제목(bbsTtl). */
  bbsTtl: string
  /** 내용(bbsCn). */
  bbsCn: string
  /** 작성자(wrtrNm). */
  wrtrNm: string
}

/** 공지사항 상세 첨부파일 1건 — dm_noticeInfo fileSn(첨부파일). fileName/fileSize 는 파일조회 표시용. */
export interface NoticeAttachment {
  /** 첨부파일 일련번호(fileSn). */
  fileSn: string
  /** 파일명(표시용). */
  fileName: string
  /** 파일 용량(표시용, 예: '786KB'). */
  fileSize: string
}

/**
 * 공지사항 상세 데이터영역(dm_noticeInfo) — MUI-CM-04-M02 일반공지사항상세(설계서 slide225).
 * 항목명(영문) 준수. 목록 아이템(NoticeListItem)에 없는 상세 필드(게시기간·내용·첨부)를 포함한다.
 */
export interface NoticeDetail {
  /** 공지사항 ID(contsNo). */
  contsNo: string
  /** 제목(bbsTtl). */
  bbsTtl: string
  /** 긴급(emrg) — '긴급' | '일반'. */
  emrg: '긴급' | '일반'
  /** 상위고정(upFix) — 'Y' | 'N'. */
  upFix: 'Y' | 'N'
  /** 작성자(wrtrNm). */
  wrtrNm: string
  /** 담당부서(tkcgDeptNm). */
  tkcgDeptNm: string
  /** 구분(bizFldCd) — 공지사항구분 코드(BIZCD). */
  bizFldCd: string
  /** 게시시작일자(pstgBgngYmd) — 'YYYY-MM-DD'. */
  pstgBgngYmd: string
  /** 게시종료일자(pstgEndYmd) — 'YYYY-MM-DD'. */
  pstgEndYmd: string
  /** 내용(bbsCn). */
  bbsCn: string
  /** 첨부파일(fileSn) 목록. */
  files: NoticeAttachment[]
}

// ─────────────────────────────────────────────────────────────────────────────
// 자료실 / 시스템개선안내 (MUI-CM-04-M25~M32). 설계서 slide220~231.
// 공지사항과 게시판 구조는 유사하나 항목명이 일부 달라 별도 타입으로 둔다.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 자료실 상세 데이터영역(dm_rpstrInfo) — MUI-CM-04-M26/M28/M30(일반/수요부대별/계약관련서식자료실 상세, slide228~230).
 * 공지 상세와 달리 긴급·상위고정·게시기간 없음. 담당부서=deptNm(≠공지 tkcgDeptNm)·제목=rpstrTtl.
 */
export interface RpstrDetail {
  /** 자료실 ID(contsNo). */
  contsNo: string
  /** 제목(rpstrTtl). */
  rpstrTtl: string
  /** 작성자(wrtrNm). */
  wrtrNm: string
  /** 담당부서(deptNm). */
  deptNm: string
  /** 구분(bizFldCd) — 자료실구분 코드(BIZCD). */
  bizFldCd: string
  /** 내용(contsCn). */
  contsCn: string
  /** 첨부파일(fileSn) 목록. */
  files: NoticeAttachment[]
}

/**
 * 시스템개선안내 상세 데이터영역(dm_rpstrInfo) — MUI-CM-04-M32(slide231).
 * 자료실 그룹이나 항목명은 공지형(bbsTtl/tkcgDeptNm) + 게시기간 있음. 긴급·상위고정 없음.
 */
export interface SysImpvDetail {
  /** 게시판 ID(contsNo). */
  contsNo: string
  /** 제목(bbsTtl). */
  bbsTtl: string
  /** 작성자(wrtrNm). */
  wrtrNm: string
  /** 담당부서(tkcgDeptNm). */
  tkcgDeptNm: string
  /** 구분(bizFldCd). */
  bizFldCd: string
  /** 게시시작일(pstgBgngYmd). */
  pstgBgngYmd: string
  /** 게시종료일(pstgEndYmd). */
  pstgEndYmd: string
  /** 내용(bbsCn). */
  bbsCn: string
  /** 첨부파일(fileSn) 목록. */
  files: NoticeAttachment[]
}

/**
 * 자료실 목록 데이터영역(dl_resultList) 1건 — MUI-CM-04-M25/M27/M29(일반/수요부대별/계약관련서식자료실).
 * 설계서 slide220~222 항목명(영문) 준수. 공지사항과 달리 긴급(emrg)·상위고정(upFix)·담당부서(tkcgDeptNm) 없음.
 * 작성자=rgtrId(≠공지 wrtrNm)·조회=inqNocs(≠공지 inqCnt)·제목=rpstrTtl.
 */
export interface RpstrListItem {
  /** 순번(no). */
  no: number
  /** 자료실 ID(contsNo) — 상세 조회 키. */
  contsNo: string
  /** 구분(bizFldCd) — 자료실구분 코드(BIZCD). */
  bizFldCd: string
  /** 제목(rpstrTtl). */
  rpstrTtl: string
  /** 첨부(fileCnt). */
  fileCnt: number
  /** 작성자(rgtrId). */
  rgtrId: string
  /** 작성일자(regDt) — 'YYYY-MM-DD'. */
  regDt: string
  /** 조회(inqNocs) — 조회횟수. */
  inqNocs: number
}

/** 자료실 검색조건(dm_searchInfo) — 구분(bizFldCd)은 요청에 따라 제외. */
export interface RpstrSearchFilter {
  /** 작성일자 범위(regDt FROM~TO). */
  regDt: DateRangeValue
  /** 제목(rpstrTtl). */
  rpstrTtl: string
  /** 내용(contsCn). */
  contsCn: string
  /** 작성자(wrtrNm). */
  wrtrNm: string
}

/**
 * 시스템개선안내 목록 데이터영역(dl_resultList) 1건 — MUI-CM-04-M31.
 * 자료실 그룹이나 항목명은 공지사항형(bbsTtl/wrtrNm/inqCnt). 긴급·상위고정·담당부서 없음.
 * 검색조건은 공지사항과 동일(bbsTtl/bbsCn/wrtrNm)이라 NoticeSearchFilter 를 재사용한다.
 */
export interface SysImpvListItem {
  /** 순번(no). */
  no: number
  /** 게시판 ID(contsNo). */
  contsNo: string
  /** 구분(bizFldCd). */
  bizFldCd: string
  /** 제목(bbsTtl). */
  bbsTtl: string
  /** 첨부(fileCnt). */
  fileCnt: number
  /** 작성자(wrtrNm). */
  wrtrNm: string
  /** 작성일자(regDt). */
  regDt: string
  /** 조회(inqCnt). */
  inqCnt: number
}

// ─────────────────────────────────────────────────────────────────────────────
// 실적증명서 신청 목록 (MUI-CM-04-M06). 설계서 00.공통 v0.84 slide240~241.
// ─────────────────────────────────────────────────────────────────────────────

/** 실적증명서 신청 목록 항목(dl_resultList) — 항목명(영문)은 설계서 그대로. */
export interface PrfmncPrdocItem {
  /** 접수번호 (R, 11) — 목록 key. */
  prfmncRcptNo: string
  /** 계약번호(차수) (R, 11) */
  ctrtNo: string
  /** 계약구분 (R, 2) — 물품/공사 등 */
  ctrtSe: string
  /** 계약건명 (R, 100) */
  ctrtNm: string
  /** 대표품명 (R, 200) */
  rprsItemNm: string
  /** 실적신청금액 (R, 25.3) */
  ctrtAmt: number
  /** 발주기관 (R, 100) — 화면 표기 라벨은 '발급기관'(slide240 목업) */
  orderInst: string
  /** 신청일자 (R, 8) */
  aplyYmd: string
  /** 처리일자 (R, 8, 선택) — 미처리 시 '-' 표시 */
  prcsYmd?: string
  /** 진행상태 (R, 1) — 신청/접수/처리중/발급/반려/보류 */
  prgrsStcd: string
}

/**
 * 실적증명서 신청 목록 검색조건(dm_searchInfo) — 설계서 항목명(영문) 준수.
 * 기간은 FROM/TO(aplyYmdFrom/aplyYmdTo) 범위이므로 DateRangeValue 1키로 표현한다(regDt 컨벤션).
 */
export interface PrfmncPrdocSearchFilter {
  /** 기간(aplyYmdFrom~aplyYmdTo). */
  aplyYmd: DateRangeValue
  /** 계약번호(ctrtNo). */
  ctrtNo: string
  /** 처리상태(prcsStts) — 전체/신청/접수/처리중/발급/반려/보류(코드값 미정). */
  prcsStts: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 실적증명서 확인(상세) (MUI-CM-04-M07 · T01 계약정보 · T03 신청정보 unitB).
// 설계서 00.공통 v0.84 slide243~250(화면) · slide266~270(항목 설명). 항목명(영문)은 설계서 그대로.
// ─────────────────────────────────────────────────────────────────────────────

/** 실적증명서 신청 접수(dm_prfmncPrdocAplyInfo). */
export interface PrfmncPrdocAplyInfo {
  /** 접수번호 (R, 11) */
  prfmncRcptNo: string
  /**
   * 진행상태 코드(UG02).
   * 부대: A접수/P처리중·발급/S신청/R반려/I저장 · 방위사업청: I저장/R접수/G처리중/C처리완료/P발급/Y회송/V보류
   */
  prfmncPrgrsSttsCd: string
  /** 발급번호 (R, 20) — 실적증명서 제출(MUI-CM-04-P20, slide330 1.1)에서 정의. */
  issuNo?: string
}

/** 제출 협회(dl_sbmsnAsctnList) — 실적증명서 제출(MUI-CM-04-P20, slide330 1.3). */
export interface SbmsnAsctnItem {
  /** 제출협회명 (R, 100) */
  sbmsnSttsNm: string
  /** 상태 (R, 2) — 전송중/송신완료/실패/제출취소. 미제출이면 없음(레이블 미표시). */
  sttsVl?: string
  /** 비고 (E, 4000) — 제출취소 시 취소사유. 송신완료 시 입력/버튼 활성화. */
  rmrkCn?: string
}

/** 계약정보(dm_ctrtInfo) — T01 계약정보 탭. */
export interface PrfmncPrdocCtrtInfo {
  /** 계약번호 (R, 35) — 설계서 항목명 "ctrtNo/CtrtOd"(계약번호+차수 조합 표시). */
  ctrtNo: string
  /** 차수 — 설계서 표기 그대로 CtrtOd(대문자 C). 표시: `${ctrtNo}(${CtrtOd})`. */
  CtrtOd: string
  /** 계약구분 (R, 2) — 1:물품/군수품, 2:시설공사, 3:용역 */
  ctrtCnNm: string
  /** 계약건명 (R, 200) */
  ctrtNm: string
  /** 대표품명 (R, 100) */
  rprsItemNm: string
  /** 계약금액 (R, 22) */
  ctrtAmt: number
  /** 발주기관 (R, 200) */
  orderInstNm: string
  /** 계약담당관 (R, 100) */
  picNm: string
  /** 계약담당관 연락처 (R, 100) */
  enPicTel: string
}

/** 신청정보 입력(dm_prfmncPrdocAplyInptInfo 1.3 + 1.4) — 신청정보 탭 공통. */
export interface PrfmncPrdocAplyInptInfo {
  /** 신청인 연락처 (R, 100) */
  entlno: string
  /** 발급수량 (R, 10) */
  dmndQty: string
  /** 제출처 (R, 100) */
  submOrgn: string
  /** 사용목적 (R, 2) */
  usePrpsCd: string
  /** 상세 내용 (R, 200) — 사용목적 '기타'일 경우만 */
  etcUsePrps?: string
  /** 납품/지출년도 (R, 4) */
  prfmncYr?: string
  /** 납품금액 (R, 22) */
  prfmncIdntyAmt?: number
  /** 선금금액 (R, 22) */
  prpamtIdntyAmt?: number
  /** 정산금액 (R, 22) */
  clclnAmt?: number
  /** 착수금액 (R, 22) */
  otstDmndAmt?: number
  /** 중도금액 (R, 22) */
  mdwyDmndAmt?: number
  /** 보증보험번호 (R, 30) */
  grnteInsrncNo?: string
  /** 확인요청사항 (R, 100) */
  idntyDmndMttr?: string
  /** 정산일자 (R, 8) — 사용목적에 따라 납품일자로 바뀌기도 함 */
  clclnYmd?: string
}

/** 시공자(대표)(dm_prfmncPrdocAplyRprsInfo) — T03. */
export interface PrfmncPrdocAplyRprsInfo {
  /** 회사명 (R, 100) */
  bzentyNm: string
  /** 면허번호 (R, 100) */
  lcnsNoVl: string
  /** 대표자 (R, 100) */
  rprsvNm: string
  /** 영업소재지 (R, 200) */
  salsLctnAddr: string
  /** 전화번호 (R, 20) */
  telno: string
}

/** 계약 및 준공(총공사 기준)(dm_prfmncPrdocAplyWholCstrnInfo) — T03. */
export interface PrfmncPrdocAplyWholCstrnInfo {
  /** 계약일자 (R, 8) */
  ctrtYmd: string
  /** 착공일자 (R, 8) */
  bgncstYmd?: string
  /** 준공일자 (R, 8) — 제출유형 5(실적자료 발주기관 확인서)면 '준공예정일자' 표기 */
  cmcnYmd?: string
  /** 공사금액[준공+관급] (R, 22) */
  cstrnAmt: number
  /** 중공금액 (R, 22) — 화면 표기 '준공금액'. 제출유형 5면 '계약금액' 표기 */
  cmcnAmt?: number
  /** 관급금액 (R, 22) */
  gvspAmt?: number
}

/** 계약 및 준공(금차공사 기준)(dm_prfmncPrdocAplyCstrnInfo) — T03. 항목명 접미 `2`. */
export interface PrfmncPrdocAplyCstrnInfo {
  ctrtYmd2?: string
  bgncstYmd2?: string
  cmcnYmd2?: string
  cstrnAmt2?: number
  cmcnAmt2?: number
  gvspAmt2?: number
}

/** 공사설정(dm_prfmncPrdocAplyCstrnTypeInfo) — T03 공사성질. 다중 선택 값의 조합 문자열 표시. */
export interface PrfmncPrdocAplyCstrnTypeInfo {
  /** 건설공사 — cnstrNewCstrnYn/cnstrExpnCstrnYn/cnstrRmdlCstrnYn 값(신규/확장/개보수, 다중) */
  cnstrDivs?: string
  /** 전기/그 밖의 — eltyNewCstrnYn/eltyEpxnCstrnYn/eltyRlocatCstrnYn/eltyEstblCstrnYn/eltyRprwrkYn 값(다중) */
  eltyDivs?: string
}

/** 공동도급 여부(dm_prfmncPrdocAplyJntCtrcInfo) — T03. */
export interface PrfmncPrdocAplyJntCtrcInfo {
  /** 건설공사 (R, 1) — 공동이행방식/분담이행방식/단독도급 */
  jntCtrcCd?: string
}

/**
 * 실적의 종류·시공자 카드·세부정보(dm_prfmncPrdocAplyprfmncTypeInfo) — T03.
 * 시공자(대표)/시공자 1/시공자 2 카드가 같은 영역을 반복 사용.
 */
export interface PrfmncPrdocAplyPrfmncTypeInfo {
  /** 실적의종류 — prfmncCncptDesignYn/…/prfmncEtcYn 값(다중 선택) */
  rsltDivs?: string
  /** 회사명 (E/R, 200) */
  cnstBzentyNm?: string
  /** 사업자등록번호 (E/R, 100) */
  enbrno?: string
  /** 대표자명 (E, 200) */
  rprsvNm?: string
  /** 공사금액 (E, 22) — 화면 표기 '공시금액'(지분율 병기) */
  cstrnAmt?: number
  /** 전체공사 시공금액(관급포함) (E, 22) */
  wholCstrnCnstAmt?: number
  /** 준공금액 (E, 22) — 지분율 병기 */
  cmcnAmt?: number
  /** 관급금액 (E, 22) */
  gvspAmt?: number
  /** 전체공사 시공규모 (E, 4000) */
  wholCstrnCnstSclExpln?: string
  /** 시공회사별 실적공종 또는 PQ공종 시공 규모,방법(공법) (E, 4000) */
  cnstBcoSclMthdCn?: string
  /** 시공회사별 실적공종 또는 PQ공종의 금액 (E, 4000) */
  cnstBcoCnstAmtCn?: string
  /** 시공회사별 실적공종 또는 PQ공종의 중공금액 (E, 4000) */
  cnstBcoCmcnAmtCn?: string
  /** 시공회사별 실적공종 또는 PQ공종의 관급금액 (E, 4000) — ⚠️ 설계서에서 "실적증명 발급일 기준 시공내용"도 같은 항목명으로 중복 정의(오기 추정) */
  cnstBcoGvspAmtCn?: string
}

/** 하도급 내용(dm_prfmncPrdocAplySbctrInfo) — T03. 최대 3건, 정보 없으면 숨김. */
export interface PrfmncPrdocAplySbctrInfo {
  /** 하도급자 (E, 100) */
  sbctrSeNm?: string
  /** 하도급공사규모 및 내용 (E, 100) */
  sbctrCstrnSclCn?: string
  /** 하도급금액 (E, 100) — 화면 표기 '하도금금액[준공+관급]' */
  sbctrAmt?: number
}

/** 최저가 적정성심사관련 시공실적자료(dm_prfmncPrdocAplyLwprcInfo) — T03. */
export interface PrfmncPrdocAplyLwprcInfo {
  /** 구분 (R, 100) — 화면 표기 '시공내용' */
  cnstCn?: string
  /** 사용장비명 (R, 100) */
  useEqpmntNm?: string
  /** 장비규격 (R, 100) */
  eqpmntSpcfctCn?: string
  /** 투입대수 누계 (R, 100) */
  inputCntomCn?: string
  /** 작업량 누계 (R, 100) */
  wkqtyActotCn?: string
  /** 작업시간 누계 (R, 100) */
  jobHrActotCn?: string
  /** 시간당 작업량 (R, 100) */
  ptmWkqtyCn?: string
  /** 기타 참고사항 (R, 100) */
  etcRefMttr?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 국외조달원등록증신청목록 (MUI-CM-04-M21). 설계서 00.공통 v0.84 slide331~333.
// 상세 화면 없음(카드 클릭 = OZ 리포트 연결) — 카드 표시 필드는 상세 영역(dm_ovsSosAplyDtlInfo)
// 항목명을 재사용한다.
// ─────────────────────────────────────────────────────────────────────────────

/** 진행상태(prcsStcd) 코드 — 신청(P)/반려(R)/승인(A). */
export type OvsSosPrcsStcd = 'P' | 'R' | 'A'

/** 국외조달원 신청 목록 항목(dl_resultList + 카드 표시용 상세 항목) — 항목명(영문) 설계서 그대로. */
export interface OvsSosCnfdocItem {
  /** 접수번호 (R, 12) — 목록 key. */
  aplyRcptNo: string
  /** 발급대상 업체 (R, 100) */
  trgtBzentyCdNm: string
  /** 진행상태 (R, 1) — P신청/R반려/A승인 */
  prcsStcd: OvsSosPrcsStcd
  /** 신청일자 (R, 8) */
  aplyYmd: string
  /** 승인일자 (R, 8, 선택) */
  aprvYmd?: string
  /** 발급신청 사유 (R, 4000 — dm_ovsSosAplyDtlInfo) — 카드 2줄 클램프 표시 */
  aplyRsn: string
  /** 반려 사유 (R, 4000, 선택) — 반려 시 발급사유 대신 표시 */
  rjctRsn?: string
  /** 신청인 연락처 (R — dm_ovsSosAplyDtlInfo aplcntEntlno) */
  aplcntEntlno: string
  /** ⚠️ 신청인 성명 — 설계서 영문 항목명 미정의(카드 '신청인' 표기) → 잠정 명칭, 확정 시 교체. */
  aplcntNm: string
  /** ⚠️ 회사명 — 설계서 영문 항목명 미정의(카드 '회사명' 표기) → 잠정 명칭, 확정 시 교체. */
  bzentyNm: string
}

/** 국외조달원 신청 목록 검색조건(dm_searchInfo) — 기간 FROM/TO 는 DateRangeValue 1키(regDt 컨벤션). */
export interface OvsSosCnfdocSearchFilter {
  /** 기간(aplyYmdFrom~aplyYmdTo). */
  aplyYmd: DateRangeValue
  /** 진행상태(prcsStcd) — 전체/신청(P)/반려(R)/승인(A). */
  prcsStcd: string
  /** 발급대상 업체명(trgtBzentyCdNm). */
  trgtBzentyCdNm: string
}

/**
 * 국외조달원등록증신청 — 신청인(dm_ovsSosAplyInfo). 설계서 slide335. MUI-CM-04-P22.
 * 회사명·성명은 자동완성(readonly), 직위·연락처는 편집(비어 있으면 빈 상태).
 */
export interface OvsSosAplyInfo {
  /** 성명 (R, 100) */
  empNm: string
  /** 회사명 (R, 100) */
  bzentyNm: string
  /** 직위 (E, 100) */
  aplcntJbgdNm: string
  /** 연락처 (E, 88) */
  aplcntEntlno: string
}

/** 국외조달원등록증신청 — 조달원 등록증(dm_ovsSosAplyDataInfo). 설계서 slide335. */
export interface OvsSosAplyDataInfo {
  /** 업체명1 (E, 100) — 조달업체선택(P23)으로 선택 */
  bzentyNm1: string
  /** 업체명2 (E, 100) */
  bzentyNm2: string
  /** 발급신청사유 (E, 4000) */
  aplyRsn: string
}

/**
 * 조달업체선택 결과 항목(dl_resultList) — MUI-CM-04-P23 `ovsSosCnfdocChc`.
 * 국외조달원등록증신청(M22)의 [업체선택] 바텀시트 검색 결과. 설계서 00.공통 v0.84 slide343.
 * 항목명(영문)은 설계서 dl_resultList 그대로.
 */
export interface OvsSosBzentyChcItem {
  /** 업체코드 (R, 5) — 목록 key */
  bzentyCd: string
  /** 업체명 (R, 100) */
  bzentyNm: string
  /** 대표자명 (R, 100) */
  rprsvNm: string
  /** 대표전화 (R, 25) */
  rprsvTelno: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 업체정보 (dm_bzentyInfo). 설계서 00.공통 slide191 — MUI-CM-02-M01 사용자정보관리 데이터영역.
//   민원서류발급신청(MUI-CM-04-M04) 상단 업체정보가 "MUI-CM-02-M01 화면 재사용"으로 공유.
// ─────────────────────────────────────────────────────────────────────────────

/** 업체정보 — 항목명(영문)은 설계서 dm_bzentyInfo 그대로. */
export interface BzentyInfo {
  /** 업체명 (R, 100) */
  bzentyNm: string
  /** 사업자등록번호 (R, 10) */
  brno: string
  /** 업체코드 (R, 5) */
  bzentyCd: string
  /** 대표자명 (R, 100) */
  rprsvNm: string
  /** 등록일 (R, 8) */
  bzentyRgstrtYmd: string
  /** 법인등록번호 (R, 13, 선택) */
  crno?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 마이페이지 (MUI-CM-06-M01). 설계서 00.공통 slide75 "업무 캘린더" 데이터영역.
//   - 캘린더에는 ① 관심(찜)한 입찰공고 ② 개인이 작성한 스케줄 을 합쳐 최대 3건 표시.
//   - 공고번호/공고명 항목명은 입찰(bd) 도메인 컨벤션(pbancNo/pbancNm)을 그대로 따른다.
// ─────────────────────────────────────────────────────────────────────────────

/** 캘린더 이벤트 구분 — 배지(물품/공사=관심 입찰공고, 개인=작성 스케줄). */
export type MyPageSchdlSeCd = 'goods' | 'construction' | 'personal'

/** 업무 캘린더 항목(관심 입찰공고 + 개인 스케줄 통합). */
export interface MyPageSchedule {
  /** 로컬 식별자(고유). */
  id: string
  /** 구분 — goods(물품)·construction(공사)=관심 입찰공고 / personal(개인)=작성 스케줄. */
  schdlSeCd: MyPageSchdlSeCd
  /** 일정 일자 'YYYY-MM-DD' — 캘린더 표식·정렬 기준. */
  schdlDt: string
  /** 공고번호(pbancNo) — 관심 입찰공고 항목에만. 클릭 시 해당 입찰공고로 이동. */
  pbancNo?: string
  /** 공고명(pbancNm) — 관심 입찰공고 항목의 제목. */
  pbancNm?: string
  /** 스케줄 내용 — 개인 스케줄 항목의 제목/상세(클릭 시 바텀시트로 표시). */
  schdlCn?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 관심입찰공고 (MUI-CM-06-M05, ItrstBidPbancPage). 설계서 00.공통 v0.84 slide81·82.
//   즐겨찾기(찜)한 입찰공고 목록. 데이터영역 = dl_itrstBidPbancList (항목명 영문 준수).
//   ⚠️ 카드 레이아웃(Figma 10020:87664)은 발주예정월/발주기관/예산금액 행을 쓰나
//      데이터영역(dl_itrstBidPbancList)엔 이 3개가 없다(공고/입찰 마감일시 위주). Figma 표기대로 두되
//      항목명은 입찰(bd) 도메인 관례로 잠정 부여 — API 연동 시 실제 매핑 확인 필요.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 관심입찰공고 목록 데이터영역(dl_itrstBidPbancList) 1건 — 설계서 항목명(영문) 준수.
 * 목록엔 관심(찜) 항목만 노출되므로 itrst 기본 true. 별 토글 해제 시 false(페이지 유지 중엔 목록에 남음).
 */
export interface ItrstBidPbancItem {
  /** 카드 식별자(상세 라우팅 키·목록 key). */
  id: string
  /** 관심 여부 — 별 하이라이트 on/off. 해제해도 페이지 유지 중엔 목록에 남고 별만 off(설계서 slide81). */
  itrst: boolean
  /** 업무구분(taskSeNm) — 물품/용역/공사/국외. 뱃지. 코드 GTSA0001. */
  taskSeNm: string
  /** 계약방법(ctrtMthd) — 수의계약/일반경쟁/제한경쟁 등. 뱃지. 코드 CTMC. */
  ctrtMthd: string
  /** 공고상태 — 정상공고/정정공고/취소공고 등. subtitle 앞 표기(데이터영역 pbancTpcd 계열). */
  pbancStasNm: string
  /** 공고번호-차수(pbancNoCycl) — subtitle. 예 '2026LGM000604191-01'. */
  pbancNoCycl: string
  /** 입찰건명(bidNm) — 카드 제목(2줄 말줄임). */
  bidNm: string
  /** 발주예정월 — 카드 행. ⚠️ 데이터영역 미정의(Figma 레이아웃) — API 연동 시 매핑 확인. */
  orderPrnmntYm: string
  /** 발주기관 — 카드 행. ⚠️ 데이터영역 미정의(Figma) — 매핑 확인. */
  orderInstNm: string
  /** 입찰방법(총액제/단가제) — 카드 행. Figma 라벨은 '계약방법'이나 값은 입찰방법(총액제) — 표기 그대로. */
  bidMthd: string
  /** 예산금액(원 정수) — 카드 행. ⚠️ 데이터영역 미정의(Figma) — 매핑 확인. 천단위 콤마 + ' 원'. */
  bdgtAmt: number
}

// ─────────────────────────────────────────────────────────────────────────────
// 업무캘린더 (MUI-CM-06-M06 TaskCldrPage / P07 일정상세 / P08 등록·수정 / P09 삭제).
//   설계서 00.공통 v0.84 slide84~89. 웹경로: 메인 홈 > 마이페이지 > 업무캘린더.
//   캘린더에 ① 즐겨찾기(찜)한 입찰공고 ② 개인이 등록한 일정 을 함께 표시(업무 있는 날 표식).
//   데이터영역(dl_taskCldrList): 제목 schdlTtl(100·R) · 작성일자 wrtYmd(8·R).
//   ⚠️ schdlDt(일정 일자)·schdlCn(내용)은 데이터영역에 없으나 화면(P07/P08)에 존재해 잠정 영문키 부여.
//      (schdlDt = 캘린더 표식·선택 기준, schdlCn = P07/P08 '내용' 필드) — API 연동 시 실제 매핑 확인.
//   구분(schdlSeCd)·공고번호(pbancNo)·공고명(pbancNm)은 마이페이지 캘린더(MyPageSchedule)와 동일 관례.
// ─────────────────────────────────────────────────────────────────────────────

/** 업무캘린더 항목(관심 입찰공고 + 개인 일정 통합) — 마이페이지 캘린더 구분 코드 재사용. */
export interface TaskCldrItem {
  /** 로컬 식별자(목록 key·상세/삭제 대상 식별). */
  id: string
  /** 구분 — goods(물품)·construction(공사)=관심 입찰공고 / personal(개인)=작성 일정. */
  schdlSeCd: MyPageSchdlSeCd
  /** 일정 일자 'YYYY-MM-DD' — 캘린더 표식·날짜 선택 기준. ⚠️ 데이터영역 미정의(wrtYmd만 존재) — 잠정. */
  schdlDt: string
  /** 제목(schdlTtl) — 개인 일정 제목(P07/P08). 관심 공고는 공고명(pbancNm) 사용. */
  schdlTtl?: string
  /** 내용(schdlCn) — 개인 일정 상세(P07/P08 '내용'). ⚠️ 데이터영역 미정의 — 잠정. */
  schdlCn?: string
  /** 작성일자(wrtYmd) 'YYYY-MM-DD'. */
  wrtYmd?: string
  /** 공고번호(pbancNo) — 관심 입찰공고 항목에만. 클릭 시 해당 입찰공고로 이동. */
  pbancNo?: string
  /** 공고명(pbancNm) — 관심 입찰공고 항목의 제목. */
  pbancNm?: string
}

/** P08 등록/수정 폼 값 — 선택 날짜·제목(필수) + 내용(선택). (스키마: TaskCldrReg.schema.ts) */
export interface TaskCldrRegValues {
  /** 선택 날짜(schdlDt) 'YYYY-MM-DD' — 필수. */
  schdlDt: string
  /** 제목(schdlTtl) — 필수. */
  schdlTtl: string
  /** 내용(schdlCn) — 선택. */
  schdlCn: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 나의진행업무현황 (MUI-CM-06-M02 MyPrgrsHstryPage / 세부스텝팝업 P03 MyPrgrsHstryDtl).
//   설계서 00.공통 v0.84 slide78·79. 진행중인 업무(입찰참가신청/적격심사 등) 목록 + 진행 단계 팝업.
//   ⚠️ slide78·79 엔 항목설명(항목명 영문) 표가 없다. 아래 필드명은 화면 표기 기준 잠정 영문키(관례: bd/cm 도메인) —
//      API 연동 시 실제 데이터영역 매핑 확인 필요.
// ─────────────────────────────────────────────────────────────────────────────

/** 나의진행업무현황 목록(진행중) 1건 — 설계서 slide78 카드 표기 기준. */
export interface MyPrgrsHstryItem {
  /** 카드 식별자(목록 key·상세 라우팅). */
  id: string
  /** 판단번호(prcmNo) — subtitle. 예 '6000A' / '2026-00590'. */
  prcmNo: string
  /** 공고명/입찰건명(bidNm) — 카드 제목. */
  bidNm: string
  /** 신청일시(aplyDt) 'YYYY-MM-DD HH:mm' — 카드 행. ⚠️ 데이터영역 미확인 — 잠정. */
  aplyDt: string
  /** 진행상태(prgrsSttsNm) — 입찰참가신청/적격심사/기술평가/사양서평가 등. 뱃지. ⚠️ 잠정. */
  prgrsSttsNm: string
  /** 업무구분(taskSeNm) — 물품/용역/공사/국외. 뱃지. */
  taskSeNm: string
  /** 계약방법(ctrtMthd) — 수의계약/일반경쟁/제한경쟁 등. 뱃지. */
  ctrtMthd: string
  /**
   * 현재 진행 단계 — 세부 스텝 팝업(P03)의 StepBar 구동값(조달계획~대금청구 중 현재 단계).
   * ⚠️ 데이터영역 미정의 — StepBar 표시용 추가(관례). API 연동 시 진행단계 코드로 대체.
   */
  currentStage: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 나의업무이력현황 (MUI-CM-06-M04 MyTaskHstryPage). 설계서 00.공통 v0.84 slide80.
//   종료된(완료/취소/포기) 업무 이력 목록. 상단 4분기 탭(입찰참가신청/입찰서제출/공개수의협상/계약).
//   ⚠️ slide80 엔 항목설명 표가 없다. 필드명은 화면 표기 기준 잠정 영문키(관심입찰공고 카드와 동일 관례) —
//      API 연동 시 실제 매핑 확인 필요.
// ─────────────────────────────────────────────────────────────────────────────

/** 나의업무이력현황 목록(종료) 1건 — 설계서 slide80 카드 표기 기준. */
export interface MyTaskHstryItem {
  /** 카드 식별자(목록 key·상세 라우팅). */
  id: string
  /** 현황 구분(taskSttsNm) — 입찰참가신청/입찰서제출/공개수의협상/계약. 상단 탭·뱃지. ⚠️ 잠정. */
  taskSttsNm: string
  /** 판단번호(prcmNo) — subtitle. */
  prcmNo: string
  /** 공고명/입찰건명(bidNm) — 카드 제목. */
  bidNm: string
  /** 발주예정월 — 카드 행. ⚠️ 데이터영역 미확인(Figma/화면 표기) — 잠정. */
  orderPrnmntYm: string
  /** 발주기관 — 카드 행. ⚠️ 잠정. */
  orderInstNm: string
  /** 입찰방법(총액제/단가제) — 카드 행(화면 라벨은 '계약방법'). */
  bidMthd: string
  /** 예산금액(원 정수) — 카드 행. 천단위 콤마 + ' 원'. ⚠️ 잠정. */
  bdgtAmt: number
  /** 업무구분(taskSeNm) — 물품/용역/공사/국외. 뱃지. */
  taskSeNm: string
  /** 계약방법(ctrtMthd) — 수의계약/일반경쟁/제한경쟁 등. 뱃지. */
  ctrtMthd: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 개인별수신처 관리 (MUI-CM-06-M12 IndvRcofcMngPage). 설계서 00.공통 v0.84 slide103·104.
//   개인별 수신처 정보 목록(모바일 조회 전용, 상세 없음). 데이터영역 = dl_indvRcofcList (항목명 영문 준수).
// ─────────────────────────────────────────────────────────────────────────────

/** 개인별수신처 목록(dl_indvRcofcList) 1건 — 설계서 항목명(영문) 준수. */
export interface IndvRcofcItem {
  /** 목록 key(로컬 식별). */
  id: string
  /** 전자문서(eldocNm) — 전자문서명(예: '물량배정서'). 100자. 전자문서코드 XSTORECATE. */
  eldocNm: string
  /** 부서(deptNm). 100자. */
  deptNm: string
  /** 수신자ID(rcvrId) — Hidden. 16자. */
  rcvrId: string
  /** 수신부서(rcptnOgnzNm). 100자. */
  rcptnOgnzNm: string
  /** 수신자(rcvrNm). 20자. */
  rcvrNm: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 관심법령 (MUI-CM-06-M13 ItrstSttPage). 설계서 00.공통 v0.84 slide105·106.
//   즐겨찾기(별)한 관심 법령 목록. 클릭 시 외부 브라우저로 법령(sttUrl) 표시. 데이터영역 = dl_itrstSttList.
//   ⚠️ 설계서 slide106 데이터영역은 '법령구분'과 '법령명'이 둘 다 sttNm 으로 표기됨(문서 오기로 판단).
//      TS 키 충돌을 피하려 법령구분을 sttSeNm 으로 잠정 부여 — 항목명 확정 시 교체 필요.
// ─────────────────────────────────────────────────────────────────────────────

/** 관심법령 목록(dl_itrstSttList) 1건 — 설계서 항목명(영문) 준수. */
export interface ItrstSttItem {
  /** 목록 key(로컬 식별). */
  id: string
  /** 관심(별) 여부 — 하이라이트 on/off. 해제해도 페이지 유지 중엔 목록에 남음(설계서 slide105). */
  itrst: boolean
  /** 법령구분(⚠️ 설계서 sttNm 중복 표기 — 법령명과 키 충돌로 sttSeNm 잠정). 200자. 법령구분코드 GTSC0017. */
  sttSeNm: string
  /** 법령약어(sttAbbrNm). 200자. */
  sttAbbrNm: string
  /** 법령명(sttNm). 300자. */
  sttNm: string
  /** 시행일자(sttEnfcYmd) — 'YYYY-MM-DD'. 8자. */
  sttEnfcYmd: string
  /** 링크(sttUrl) — 외부 법령 페이지 URL(관리자 작성). 500자. */
  sttUrl: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 법령조회 = 법령정보 (MUI-CM-04-M24 SttInfoListPage). 설계서 00.공통 v0.84 slide344·345.
//   고객센터 > 법령조회. 법령구분(싱글 셀렉트)·법령명으로 조회, 카드 클릭 시 외부 브라우저로
//   법령 원문(sttUrl) 이동, 즐겨찾기(sttItrst) 토글. 항목명(영문)은 slide345 dl_resultList 정본 그대로.
//   ⚠️ 관심법령(ItrstSttItem)은 slide106 오기로 법령구분을 sttSeNm 으로 뒀으나, M24 는 정본대로 sttType.
// ─────────────────────────────────────────────────────────────────────────────

/** 법령구분(sttType) 코드값 — GTSC0017. '전체'는 필터 전용(데이터값 아님). */
export const STT_TYPES = [
  '법령',
  '대통령령',
  '부령',
  '조례',
  '행정규칙',
  '훈령',
  '예규',
  '고시',
  '지침',
  '공고',
  '임의법령',
] as const
export type SttType = (typeof STT_TYPES)[number]

/** 법령정보조회 검색조건(dm_searchInfo) — 설계서 slide345. */
export interface SttInfoSearchFilter {
  /** 법령구분(sttType) — 전체/11종. '전체'는 필터 전용. */
  sttType: SttType | '전체'
  /** 법령명(sttNm) — Like 검색어. */
  sttNm: string
}

/** 법령정보조회 목록(dl_resultList) 1건 — 설계서 slide345 항목명(영문) 그대로. */
export interface SttInfoItem {
  /** 목록 key(로컬 식별) — 설계서 순번(no)은 표시순서라 안정 key 용 id 로 대체. */
  id: string
  /** 법령구분(sttType) — 200자. 코드 GTSC0017. */
  sttType: SttType
  /** 법령약어(sttAbbrNm) — 200자. */
  sttAbbrNm: string
  /** 법령명(sttNm) — 300자. */
  sttNm: string
  /** 시행일자(sttEnfcYmd) — 'YYYY-MM-DD'. 8자. */
  sttEnfcYmd: string
  /** 링크(sttUrl) — 외부 법령 원문 URL. 500자. */
  sttUrl: string
  /** 즐겨찾기(sttItrst) — 즐겨찾기유무(설계서 R,1자 → UI boolean). */
  sttItrst: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// 나의 게시물 (MUI-CM-06-M17 MyPstPage). 설계서 00.공통 v0.84 slide107.
//   내가 작성한 게시물 목록(제목 + 작성일). 클릭 시 해당 게시물 화면으로 이동.
//   ⚠️ slide107 엔 데이터영역(항목명 영문) 표가 없다. 아래 필드명은 화면 표기 기준 잠정 영문키(관례: cm) —
//      API 연동 시 실제 매핑 확인 필요. (2026-07-13 개정: '작성 위치정보' 삭제)
// ─────────────────────────────────────────────────────────────────────────────

/** 나의 게시물 목록 1건 — 설계서 slide107 화면 표기 기준(잠정 영문키). */
export interface MyPstItem {
  /** 목록 key(로컬 식별·상세 라우팅). */
  id: string
  /** 작성 제목(pstTtl) — 카드 제목(2줄까지, 넘치면 말줄임). ⚠️ 잠정. */
  pstTtl: string
  /** 작성일(wrtYmd) — 'YYYY-MM-DD'. ⚠️ 잠정. */
  wrtYmd: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 디지털캐비닛 (MUI-CM-06-M14 DigitalCabinetPage 폴더목록 / M16 DigitalCabinetFileListPage 파일목록
//   / P15 DigitalCabinetMng 폴더 설정 권한 관리). 설계서 00.공통 v0.84 slide108~112.
//   폴더/파일 생성·삭제는 PC 전용(모바일 조회 + 권한설정). 데이터영역:
//     폴더 dl_digitalCabinetFldrList · 권한 dl_digitalCabinetAuthrtList · 파일 dl_digitalCabinetFileList.
// ─────────────────────────────────────────────────────────────────────────────

/** 폴더 접근권한(authrtSe) — 접근권한코드 GTSC0009(쓰기/읽기/없음). ⚠️ 실제 코드값은 API 연동 시 확인. */
export type DigitalCabinetAuthrtSe = 'write' | 'read' | 'none'

/** 폴더 사용자 권한(dl_digitalCabinetAuthrtList) 1건 — 설계서 항목명(영문) 준수. */
export interface DigitalCabinetAuthrt {
  /** 사용자(userNm). 200자. */
  userNm: string
  /** 권한(authrtSe) — 쓰기/읽기/없음. 접근권한코드 GTSC0009. */
  authrtSe: DigitalCabinetAuthrtSe
  /** 수정일시(mdfcnDt) — 'YYYY-MM-DD HH:mm'. 14자. */
  mdfcnDt?: string
}

/** 디지털캐비닛 폴더(dl_digitalCabinetFldrList) 1건 — 설계서 항목명(영문) 준수. */
export interface DigitalCabinetFldr {
  /** 폴더ID(fldrSn) — Hidden. 10자. 파일목록/권한 조회 키. */
  fldrSn: string
  /** 폴더명(fldrNm). 50자. */
  fldrNm: string
  /** 폴더사이즈(fldrSz) — 표시값(예: '10MB'). 10자. */
  fldrSz: string
  /** 수정자(mdfrNm). 200자. */
  mdfrNm?: string
  /** 등록일시(regDt) — 14자. */
  regDt?: string
  /** 수정일시(mdfcnDt) — 'YYYY-MM-DD HH:mm'. 14자. */
  mdfcnDt?: string
  /** 폴더 권한 목록(P15 권한 설정). */
  authrtList?: DigitalCabinetAuthrt[]
}

/** 디지털캐비닛 폴더 내 파일(dl_digitalCabinetFileList) 1건 — 설계서 항목명(영문) 준수. */
export interface DigitalCabinetFile {
  /** 파일ID(fileId) — Hidden. 38자. */
  fileId: string
  /** 파일명(fileNm). 255자. */
  fileNm: string
  /** 파일사이즈(fileSz) — 표시값(예: '369KB', MB 단위). 10자. */
  fileSz: string
  /** 유효기간(vldPrdEndYmd) — 'YYYY-MM-DD'. 8자. 없으면 '-'. */
  vldPrdEndYmd?: string
  /** 전자문서 여부(eldocYn) — 'Y' | 'N'. */
  eldocYn: 'Y' | 'N'
}

// ─────────────────────────────────────────────────────────────────────────────
// 문서함 (MUI-CM-06-M10 DocBoxPage 목록 / M11 DocBoxDtlPage 상세 / T01·T02·T03 탭).
//   설계서 00.공통 v0.84 slide90~102. 웹경로: 메인 홈 > 마이페이지 > 문서함(> 문서함 상세).
//   받은문서(dl_rcptnDocBoxList)·보낸문서(dl_sendDocBoxList)·임시저장(dl_tmprDocBoxList)·
//   반려함(dl_rjctDocBoxList) 4개 데이터영역을 하나의 목록으로 합쳐 표시(최신순, 카드 상단 레이블로 구분).
//   항목명(영문)은 각 데이터영역 표를 그대로 따른다(같은 의미의 컬럼은 재사용):
//     송신처/반려처 trsmOgnzCd · 수신처 rcptnOgnzCd · 문서명 docNm · 도착일 rcptnDt ·
//     수신일/확인일 rcptIdntyDt · 송신일/반려일 docWrtDt · 작성일 wrtYmd · 반려자 rturId ·
//     반려여부 rjctYn · 반려사유 rjctRsn · 첨언 addCn · 첨부 edmsDocId.
//   ⚠️ 문서구분(받은/보낸/반려/임시)은 데이터영역에 별도 코드컬럼이 없다(검색필터 '문서 구분' 표기 기반) —
//      탭/카드레이블 구동용 파생키 docSeCd/docSeNm 으로 잠정 부여. API 연동 시 실제 구분 코드로 대체.
// ─────────────────────────────────────────────────────────────────────────────

/** 문서구분 — 목록 탭 그룹(받은/보낸/반려/임시저장). ⚠️ 설계서 데이터영역 미정의(파생키). */
export type DocBoxSeCd = 'received' | 'sent' | 'rejected' | 'temp'

/**
 * 문서함 목록(합산) 1건 — 4개 데이터영역(받은/보낸/임시/반려)을 합친 통합 아이템.
 * 타입별로 채워지는 필드가 달라(날짜/기관 라벨) 공통 필드는 모두 optional 로 둔다.
 * 상세(M11) 상단은 이 항목(navigate state)으로 그리고, 본문(문서내용/첨부목록)은 상세 목업으로 보완.
 */
export interface DocBoxItem {
  /** 카드 식별자(목록 key·상세 라우팅). */
  id: string
  /** 문서구분(파생) — 탭 그룹. ⚠️ 데이터영역 미정의(검색필터 문서구분 표기 기반). */
  docSeCd: DocBoxSeCd
  /** 카드 상단 레이블(받은 문서/보낸 문서/임시저장/반려받은 문서/반려한 문서). ⚠️ 잠정(문서구분 표기). */
  docSeNm: string
  /** 문서명(docNm) — 카드 제목. 200자. */
  docNm: string
  /** 송신처/반려처(trsmOgnzCd) — 받은·반려 문서 기관명. 16자. */
  trsmOgnzCd?: string
  /** 수신처(rcptnOgnzCd) — 보낸 문서 기관명. 16자. */
  rcptnOgnzCd?: string
  /** 도착일(rcptnDt) — 받은·반려받은 문서. 'YYYY-MM-DD'. */
  rcptnDt?: string
  /** 수신일·확인일(rcptIdntyDt) — 받은/반려받은=수신일, 보낸=확인일. 'YYYY-MM-DD'. */
  rcptIdntyDt?: string
  /** 송신일·반려일(docWrtDt) — 보낸=송신일, 반려=반려일. 'YYYY-MM-DD'. */
  docWrtDt?: string
  /** 작성일(wrtYmd) — 임시저장 문서. 'YYYY-MM-DD'. 8자. */
  wrtYmd?: string
  /** 반려자(rturId) — 반려한 문서. 16자. */
  rturId?: string
  /** 반려여부(rjctYn) — 'Y'(반려한)/'N'(반려받은). ⚠️ Y/N 의미 상세설계 확인. */
  rjctYn?: 'Y' | 'N'
  /** 반려사유(rjctRsn) — 반려 문서. 4000자. 있으면 상세 반려사유 탭 노출. */
  rjctRsn?: string
  /** 첨언(addCn) — 500자. 있으면 카드 '첨언' 배지 + 상세 첨언상세보기(T02) 탭. */
  addCn?: string
  /** 첨부 EDMS 문서 ID(edmsDocId) — 38자. 있으면 카드 '첨부' 배지 + 상세 첨부파일(T03) 탭. */
  edmsDocId?: string
}

/**
 * 문서함 상세 첨부파일 1건 — 첨부문서다운로드 데이터영역(dl_atchDocList), MUI-CM-06-T03.
 * 설계서 slide95·98 항목명(영문) 준수.
 */
export interface DocBoxAtchFile {
  /** 첨부문서명(fileTtl) — 255자. */
  fileTtl: string
  /** 파일명(fileNm) — 실제 다운로드 파일명(예: '첨부파일명.hwp'). 255자. */
  fileNm: string
  /** 파일크기(표시용, 예: '786KB'). ⚠️ 데이터영역 미정의(화면 '[파일크기]' 표기) — 잠정. */
  fileSize?: string
  /** EDMS 문서 ID(edmsDocId) — 38자. */
  edmsDocId?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 업체정보관리 상세 (MUI-CM-01-M02 상세 / T01 업체일반 / T02 물품(내자) / T03 시설 / T04 국내소재상사).
//   설계서 00.공통 v0.84 slide115~128(문서 P114~127). 웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 상세.
//   자신이 속한 업체 정보 표시. 항목명(영문)은 각 탭 "항목 설명" 데이터영역 표(slide118~120·123·125)를 그대로 따른다.
//   ⚠️ T04 국내소재상사(slide127·128)는 데이터영역(항목명 영문) 표가 설계서에 없어 화면 표기 기준 잠정 영문키 부여.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 업체일반 데이터영역(dm_bzentyGnrlInfo) — MUI-CM-01-T01. 설계서 slide118 항목명(영문) 준수.
 * 사업구분(bizCd)은 여러 개 노출될 수 있어 배열로 둔다(설계서 "사업구분은 여러 개 노출될 수 있음").
 */
export interface BzentyGnrlInfo {
  /** 업체코드(bzentyCd) — 5자. 예 '100F'. */
  bzentyCd: string
  /** 상호명(bzentyNm) — 100자. */
  bzentyNm: string
  /** 영문상호명(bzentyEngNm) — 200자. */
  bzentyEngNm: string
  /** 사업자등록번호(brno) — 10자. 예 '123-45-67890'. */
  brno: string
  /** 국적(ntnCd) — 2자(코드) → 국적명 표시. 예 '대한민국'. */
  ntnCd: string
  /** 개업일자(opbizYmd) — 'YYYY-MM-DD'. 8자. */
  opbizYmd: string
  /** 홈페이지주소(hmpgAddr) — 50자. */
  hmpgAddr: string
  /** 주소(bzentyAddr) — 200자. 우편번호 포함 표시. */
  bzentyAddr: string
  /** 전화번호(rprsvTelno) — 25자. */
  rprsvTelno: string
  /** 팩스번호(rprsvFxno) — 40자. */
  rprsvFxno: string
  /** 법인설립일자(fndnYmd) — 'YYYY-MM-DD'. 8자. */
  fndnYmd: string
  /** 법인등록번호(crno) — 13자. */
  crno: string
  /** 본사사업자번호(hdofcBrno) — 10자. */
  hdofcBrno: string
  /** 종업원수(empCnt) — 10자. 예 '000 명'. */
  empCnt: string
  /** 사업구분(bizCd) — 5자(코드) → 명. 여러 개 노출 가능(물품(내자)/공사/용역/일반용역/외자). */
  bizCd: string[]
  /** 제조구분(entTpcd) — 2자(코드) → 명. 예 '제조'. */
  entTpcd: string
  /** 기업구분1(entShcd1) — 20자. 예 '중소기업'. */
  entShcd1: string
  /** 기업구분2(entShcd2) — 50자. 값이 있을 때만 표시. 예 '원호기업'. */
  entShcd2?: string
  /** 기업구분해당년도(entSeRlvtYr) — 4자. 예 '1999'. */
  entSeRlvtYr: string
  /** 지역코드(rgnCd) — 2자(코드) → 지역명. 예 '11-서울특별시'. */
  rgnCd: string
  /** 공장설립특례해당여부(fctryFndnSpcsYn) — 1자 'Y'/'N' → '해당'/'미해당'. */
  fctryFndnSpcsYn: string
  /** 본/지사(bplcSecd) — 1자(코드) → 명. 예 '1-본사'. */
  bplcSecd: string
}

/** 상태/부정당 데이터영역(dl_bzentySttsList) 1건 — MUI-CM-01-T01. 설계서 slide118 항목명(영문) 준수. */
export interface BzentyStts {
  /** 상태코드(bzentyStcd) — 2자. */
  bzentyStcd: string
  /** 상태명(bzentyStNm) — 20자. 상태구분코드로 상태명 조회. 예 '양도,양수'. */
  bzentyStNm: string
  /** 발생일자(crtrYmd) — 'YYYY-MM-DD'. 8자. */
  crtrYmd: string
  /** 시작일자(bgngYmd) — 'YYYY-MM-DD'. 8자. */
  bgngYmd: string
  /** 종료일자(endYmd) — 'YYYY-MM-DD'. 8자. */
  endYmd: string
  /** 비고(rmrkCn) — 400자. */
  rmrkCn: string
}

/**
 * 수의계약배제 데이터영역(dl_bzentyRlsVltrnsRstricList) 1건 — MUI-CM-01-T01.
 * 설계서 slide119 항목명(영문) 준수. 기본 3개월 필터/전체 조회(dm_bzentyRlsVltrnsRstric 이벤트).
 */
export interface BzentyRlsVltrnsRstric {
  /** 공고번호(pbancNo) — 7자. */
  pbancNo: string
  /** 판단번호(prcmNo) — 38자. */
  prcmNo: string
  /** 공고명(pbancNm) — 100자. 공고번호로 공고명 조회. */
  pbancNm: string
  /** 개찰일자(bdopnYmd) — 'YYYY-MM-DD'. 8자. */
  bdopnYmd: string
  /** 발주기관(orderInstNm) — 200자. */
  orderInstNm: string
  /** 수의계약 배제기간(exclPrd) — 10자. 배제기간 종료일자–시작일자로 기간 설정. */
  exclPrd: string
  /** 계약포기사유(exclRsn) — 200자. */
  exclRsn: string
  /** 등록일자(regDt) — 'YYYY-MM-DD'. 10자. */
  regDt: string
}

/** 대표자 데이터영역(dl_bzentyRprsvList) 1건 — MUI-CM-01-T01. 설계서 slide119 항목명(영문) 준수. */
export interface BzentyRprsv {
  /** 대표대표자여부(rprsvYn) — 1자 'Y'/'N' → '대대표'/'대표'. */
  rprsvYn: string
  /** 대표자명(rprsvNm) — 100자. */
  rprsvNm: string
  /** 대표자영문(rprsvEngNm) — 200자. */
  rprsvEngNm: string
  /** 대표자이메일주소(rprsvEmlAddr) — 50자. */
  rprsvEmlAddr: string
}

/** 입찰대리인 데이터영역(dl_bzentyBidAgtList) 1건 — MUI-CM-01-T01. 설계서 slide120 항목명(영문) 준수. */
export interface BzentyBidAgt {
  /** 직위(agtJbpsNm) — 100자. */
  agtJbpsNm: string
  /** 성명(agtNm) — 100자. */
  agtNm: string
  /** 전화번호(agtEntlno) — 88자. */
  agtEntlno: string
}

/** 등록품목명세 데이터영역(dl_regTrgtItemList) 1건 — MUI-CM-01-T02. 설계서 slide123 항목명(영문) 준수. */
export interface RegTrgtItem {
  /** 품목코드(itemCd) — 10자. */
  itemCd: string
  /** 품류코드(knditmCd) — 2자. */
  knditmCd: string
  /** 품류명(knditmCdNm) — 300자. 품류코드/명으로 표시. */
  knditmCdNm: string
  /** 구분(itemRgstrtSecdNm) — 100자. 품목등재구분(ITRGDVCD). 예 '제조'. */
  itemRgstrtSecdNm: string
  /** 품명(itemCdNm) — 300자. */
  itemCdNm: string
  /** 등록요건(itemRgstrtRqmtNm) — 100자. 등록요건코드로 등록요건명 조회. */
  itemRgstrtRqmtNm: string
  /** 품목적부판정(itemRvwRsltCn) — 200자. 예 '적격'. */
  itemRvwRsltCn: string
}

/** 담당자정보 데이터영역(dm_picInfo) — MUI-CM-01-T02. 설계서 slide123 항목명(영문) 준수. */
export interface PicInfo {
  /** 담당자명(picNm) — 100자. */
  picNm: string
  /** 전화번호(picEntlno) — 88자. */
  picEntlno: string
  /** 팩스번호(picFxno) — 20자. */
  picFxno: string
  /** 이메일주소(picEmlAddr) — 50자. */
  picEmlAddr: string
}

/**
 * 대표품류및조합/단체 데이터영역(dm_knditmListAsctGrpList) 1건 — MUI-CM-01-T02.
 * 설계서 slide123 항목명(영문) 준수. (설계서 대표품류코드 항목명이 knditmCdNm 로 중복 표기돼 코드는 knditmCd 로 둔다.)
 */
export interface KnditmAsctGrp {
  /** 대표품류코드(knditmCd) — 2자. */
  knditmCd: string
  /** 대표품류(knditmCdNm) — 300자. 예 '05 / 피복'. */
  knditmCdNm: string
  /** 업태(bzstatCdNm) — 100자. 업태구분코드 MBTC. 예 '제조'. */
  bzstatCdNm: string
  /** 조합/단체코드(asctCd) — 3자. */
  asctCd: string
  /** 조합/단체(asctCdNm) — 300자. 예 '한국피복공업협동조합'. */
  asctCdNm: string
}

/** 시설정보 데이터영역(dm_bzentyFcltInfo) — MUI-CM-01-T03. 설계서 slide125 항목명(영문) 준수. */
export interface BzentyFcltInfo {
  /** 대표업태(bzstatCdNm) — 100자. 예 '제조'. */
  bzstatCdNm: string
  /** 연락소(전화번호)(lcofcTelno) — 20자. */
  lcofcTelno: string
}

/** 시설면허정보 데이터영역(dl_bzentyFcltLcnsList) 1건 — MUI-CM-01-T03. 설계서 slide125 항목명(영문) 준수. */
export interface BzentyFcltLcns {
  /** 공종(cnstpCdNm) — 100자. 예 '소방공사업'. */
  cnstpCdNm: string
  /** 업종코드(cnstpCd) — 4자. 예 '0001'. */
  cnstpCd: string
  /** 면허번호(lcnsNo) — 60자. */
  lcnsNo: string
  /** 시공능력 공시액(cnstAbltEvlAmt) — 17자. 원 단위 정수 문자열/표시값. */
  cnstAbltEvlAmt: string
  /** 면허유효기간 시작일(lcnsAcqsYmd) — 'YYYY-MM-DD'. 8자. */
  lcnsAcqsYmd: string
  /** 면허유효기간 종료일(lcnsExpryYmd) — 'YYYY-MM-DD'. 8자. */
  lcnsExpryYmd: string
  /** 폐업여부(bzentyStcd) — 2자(상태코드) → 표시. */
  bzentyStcd: string
}

/**
 * 주력분야 데이터영역(dl_bzentyFcltMfrcFldList) 1건 — MUI-CM-01-T03. 설계서 slide125 항목명(영문) 준수.
 * (설계서 업종코드 항목명이 cnstpCdNm 로 중복 표기돼 코드는 cnstpCd 로 둔다 — 공종명과 키 충돌 방지.)
 */
export interface BzentyFcltMfrcFld {
  /** 공종명(cnstpCdNm) — 100자. */
  cnstpCdNm: string
  /** 업종코드(cnstpCd) — 4자. */
  cnstpCd: string
  /** 주력분야(mfrcFldNm) — 100자. */
  mfrcFldNm: string
  /** 주력분야코드(mfrcFldCd) — 3자. */
  mfrcFldCd: string
  /** 해제일(mfrcFldRmvYmd) — 'YYYY-MM-DD'. 8자. 없으면 '-'. */
  mfrcFldRmvYmd: string
  /** 시공능력 공시액(cnstAbltEvlAmt) — 17자. */
  cnstAbltEvlAmt: string
  /** 평가액기준년도(evlAmtCrtrYr) — 4자. */
  evlAmtCrtrYr: string
  /** 지정일자(mfrcFldDsgnYmd) — 'YYYY-MM-DD'. 8자. */
  mfrcFldDsgnYmd: string
  /** 갱신일시(mdfcnDt) — 'YYYY-MM-DD HH:mm'. 14자. */
  mdfcnDt: string
  /** 입찰제한대상(excptnMttrCd) — 1자(특이사항코드) → 표시. */
  excptnMttrCd: string
}

// ── T04 국내소재상사 ──────────────────────────────────────────────────────────
// ⚠️ 국내소재상사(slide127·128)는 설계서에 데이터영역(항목명 영문) 표가 없다. 아래 필드명은
//    화면 표기(영업정보/FSC/법인개인구분/해외관련) 기준 잠정 영문키 — API 연동 시 실제 데이터영역 매핑 확인 필요.

/** 국내소재상사 영업정보 — MUI-CM-01-T04. ⚠️ 설계서 데이터영역 미정의(화면 표기 기준 잠정 영문키). */
export interface DmsAgtSaleInfo {
  /** 연간매출액(anlSaleAmt) — 천원 단위 정수. ⚠️ 잠정. */
  anlSaleAmt: number
  /** 자산규모(astScl) — 천원 단위 정수. ⚠️ 잠정. */
  astScl: number
  /** 여신한도(lncLmt) — 천원 단위 정수. ⚠️ 잠정. */
  lncLmt: number
  /** 주거래은행(mnTrnsBankNm) — 예 '한국외환은행'. ⚠️ 잠정. */
  mnTrnsBankNm: string
  /** 지점(brnchNm) — 예 '계동'. ⚠️ 잠정. */
  brnchNm: string
  /** 군납최초참여일(mlsplyFrstPtcpYmd) — 'YYYY-MM-DD'. ⚠️ 잠정. */
  mlsplyFrstPtcpYmd: string
  /** 거래기간 시작(trnsPrdFrom) — 'YYYY'. ⚠️ 잠정. */
  trnsPrdFrom: string
  /** 거래기간 종료(trnsPrdTo) — 'YYYY'. ⚠️ 잠정. */
  trnsPrdTo: string
  /** Dun's Number(dunsNo). ⚠️ 잠정. */
  dunsNo: string
}

/** 국내소재상사 FSC(Federal Supply Classification) 코드 1건 — MUI-CM-01-T04. ⚠️ 설계서 데이터영역 미정의(잠정). */
export interface DmsAgtFscCode {
  /** FSC 코드(fscCd) — 예 '1111'. ⚠️ 잠정. */
  fscCd: string
  /** 군급명(gunGrdNm) — 예 '기타 항공기 부수품'. ⚠️ 잠정. */
  gunGrdNm: string
}

/** 국내소재상사 법인/개인 구분 정보 — MUI-CM-01-T04. ⚠️ 설계서 데이터영역 미정의(잠정 영문키). */
export interface DmsAgtCorpInfo {
  /** 법인/개인 구분(corpIndvSe) — 'corp'(법인)/'indv'(개인). ⚠️ 잠정. */
  corpIndvSe: 'corp' | 'indv'
  /** 법인등기기관(corpRgstOrgnNm) — 예 '방위사업청'. ⚠️ 잠정. */
  corpRgstOrgnNm: string
  /** 법인등기일자(corpRgstYmd) — 'YYYY-MM-DD'. ⚠️ 잠정. */
  corpRgstYmd: string
  /** 법인등기목적(corpRgstPrps) — 예 '개업'. ⚠️ 잠정. */
  corpRgstPrps: string
  /** 사업자등록기관(bzrnoRgstOrgnNm) — 예 '방위사업청'. ⚠️ 잠정. */
  bzrnoRgstOrgnNm: string
  /** 취급품목(hdlItemNm) — 예 '무기'. ⚠️ 잠정. */
  hdlItemNm: string
  /** 업태(bzstatNm) — 예 '제조'. ⚠️ 잠정. */
  bzstatNm: string
  /** 보안측정부대(scrtMsrUnitNm) — 예 '보안부대'. ⚠️ 잠정. */
  scrtMsrUnitNm: string
  /** 보안측정일자(scrtMsrYmd) — 'YYYY-MM-DD'. ⚠️ 잠정. */
  scrtMsrYmd: string
  /** 보안측정점수(scrtMsrScr) — 예 90. ⚠️ 잠정. */
  scrtMsrScr: number
}

/** 국내소재상사 해외관련 업체정보 1건 — MUI-CM-01-T04. ⚠️ 설계서 데이터영역 미정의(잠정 영문키). */
export interface DmsAgtOvsBzenty {
  /** 업체코드(ovsBzentyCd) — 예 '1111'. ⚠️ 잠정. */
  ovsBzentyCd: string
  /** 업체명(ovsBzentyNm) — 예 'Test Corp'. ⚠️ 잠정. */
  ovsBzentyNm: string
  /** 국적(ovsNtnNm) — 예 '프랑스'. ⚠️ 잠정. */
  ovsNtnNm: string
  /** 전화번호(ovsTelno) — 예 '+33-1-34-88-30-00'. ⚠️ 잠정. */
  ovsTelno: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 조달원확인서 (MUI-CM-01-M19 신청 목록 / P20 신청서). 설계서 00.공통 v0.84 slide131~134(문서 P130~133).
//   웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 국내조달원확인서신청목록(> 신청).
//   항목명(영문)은 데이터영역 표(slide134)를 그대로 따른다.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 조달원확인서 신청 목록 데이터영역(dl_resultList) 1건 — MUI-CM-01-M19. 설계서 slide134 항목명(영문) 준수.
 * 상태(aplyRcptStts)는 '발급'으로 고정된다(신청 시 바로 발급, slide134 비고).
 */
export interface DmstSosCnfdocItem {
  /** 목록 key(로컬 식별). 접수번호가 고유하나 key 안정성 위해 별도 id 부여. */
  id: string
  /** 접수번호(aplyRcptNo) — 12자. 예 '2026051812'. */
  aplyRcptNo: string
  /** 신청인(aplcntNm) — 100자. */
  aplcntNm: string
  /** 신청사유(aplyRsn) — 4000자. 예 '입찰참가용' / '확인용'. */
  aplyRsn: string
  /** 신청날짜(edpPrcsYmd) — 'YYYY-MM-DD'. 8자. */
  edpPrcsYmd: string
  /** 전화번호(aplcntTelno) — 25자. */
  aplcntTelno: string
  /** 상태(aplyRcptStts) — 10자. '발급'으로 고정(신청 시 바로 발급). */
  aplyRcptStts: string
}

/** 조달원확인서 신청 검색조건(dm_searchInfo) — MUI-CM-01-M19. 설계서 slide134 항목명(영문) 준수. */
export interface DmstSosCnfdocSearch {
  /** 신청날짜(F)(edpPrcsYmdFrom) — 기간 시작 'YYYY-MM-DD'. 8자. */
  edpPrcsYmdFrom: string
  /** 신청날짜(T)(edpPrcsYmdTo) — 기간 종료 'YYYY-MM-DD'. 8자. */
  edpPrcsYmdTo: string
  /** 신청자(aplcntNm) — 100자. 부분입력 검색. */
  aplcntNm: string
}

/**
 * 조달원 확인서 신청서 데이터영역(dm_sosCnfdocAplyInfo) — MUI-CM-01-P20. 설계서 slide134 항목명(영문) 준수.
 * 신청인 성명(aplcntNm)·연락처(aplcntTelno)는 ReadOnly(자동완성), 신청사유(aplyRsn)만 Editable·필수.
 * (폼 검증 스키마는 신청사유만 다룬다 — DmstSosCnfdocAply.schema.ts)
 */
export interface DmstSosCnfdocAplyInfo {
  /** 신청인 성명(aplcntNm) — 100자. 자동완성(read-only). */
  aplcntNm: string
  /** 신청인 연락처(aplcntTelno) — 25자. 자동완성(read-only). */
  aplcntTelno: string
  /** 신청사유(aplyRsn) — 4000자. Editable·필수. */
  aplyRsn: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 추가정보 신청 목록 (MUI-CM-01-M03 신청 목록 / P24 검색필터). 설계서 00.공통 v0.84 slide137~139(문서 P136~138).
//   웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 추가정보 신청 목록(> 검색필터).
//   영문 화면 ID: addRegInfoAplyList(앱메뉴 260701a). 항목명(영문)은 데이터영역 표(slide139)를 그대로 따른다.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 추가등록정보 신청 목록 데이터영역(dl_resultList) 1건 — MUI-CM-01-M03. 설계서 slide139 항목명(영문) 준수.
 * 카드 클릭 시 처리상태(prgrsSttsNm) 무관하게 상세(T05 물품(내자)신청 / T06 국내소재상사신청) 진입.
 */
export interface AddRegInfoAplyItem {
  /** 목록 key(로컬 식별). 접수번호가 고유하나 key 안정성 위해 별도 id 부여. */
  id: string
  /** 접수번호(rcptNo) — 12자. 예 '2020101010'. */
  rcptNo: string
  /** 신청일자(aplyYmd) — 'YYYY-MM-DD'. 8자. 예 '2020-10-10'. */
  aplyYmd: string
  /** 전화번호(rprsvTelno) — 25자. 예 '02-1234-5678'. */
  rprsvTelno: string
  /** 업무구분(bizCdNm) — 100자. 물품(내자)/공사/용역/일반용역/외자. */
  bizCdNm: string
  /** 추가정보구분(addInfoCdNm) — 100자. 물품(내자)/국내소재상사. */
  addInfoCdNm: string
  /** 진행(처리)상태(prgrsSttsNm) — 10자. 접수('U')/반송('R')/승인('F'). */
  prgrsSttsNm: string
}

/**
 * 추가등록정보 신청 목록 검색조건(dm_searchInfo) — MUI-CM-01-M03/P24. 설계서 slide139 항목명(영문) 준수.
 * 기간·처리상태·품명은 데이터영역 표에 정의됨. 구분(bizCdNm)은 P24 '구분 설정' 화면 표기 기준 잠정 검색키(⚠️ dm_searchInfo 미정의).
 */
export interface AddRegInfoAplySearch {
  /** 기간(F)(aplyYmdFrom) — 기간 시작 'YYYY-MM-DD'. 8자. 선택. */
  aplyYmdFrom: string
  /** 기간(T)(aplyYmdTo) — 기간 종료 'YYYY-MM-DD'. 8자. 선택. */
  aplyYmdTo: string
  /** 처리상태(prgrsSttsNm) — 10자. 전체('A')/접수('U')/반송('R')/승인('F'). 선택. */
  prgrsSttsNm: string
  /** 품명(itemNm) — 200자. 부분입력 검색. */
  itemNm: string
  /** ⚠️ 구분(bizCdNm) — P24 '구분 설정' select. dm_searchInfo 미정의(잠정 검색키, 확인 필요). */
  bizCdNm?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 군수품무역대리업 신청 및 발급 (MUI-CM-01-M15~M18). 설계서 00.공통 v0.84 slide178~189.
//   M15 신청 및 발급 목록 · M16 신청 내역 상세 · M17 신규(갱신) · M18 변경.
//   데이터영역: dl_dfEqpmntTradAgncAplyList(목록) · dm_dfEqpmntTradAgncAplyInfo(접수/업체) ·
//     dl_dfEqpmntTradAgncAplyAtchFileList(첨부서류) · dl_scrtyMsrmtPrsnlList(보안측정인원).
//   항목명(영문)은 데이터영역 표(slide180·184·188)를 그대로 따른다.
// ─────────────────────────────────────────────────────────────────────────────

/** 군수품무역대리업 신청 목록(dl_dfEqpmntTradAgncAplyList) 1건 — MUI-CM-01-M15. 설계서 slide180. */
export interface DfEqpmntTradeAgncAplyItem {
  /** 목록 key(로컬 식별). 접수번호가 고유하나 key 안정성 위해 별도 id 부여. */
  id: string
  /** 구분(regAplySecd) — 신규/갱신/변경. 1자. */
  regAplySecd: string
  /** 접수번호(rcptNo) — 접수년도(4)+접수일련번호(4). 예 '2026-0020'. */
  rcptNo: string
  /** 요청일자(rcptYmd) — 'YYYY-MM-DD'. 8자. */
  rcptYmd: string
  /** 승인일자(aprvYmd) — 'YYYY-MM-DD'. 없으면 ''. */
  aprvYmd: string
  /** 실효·말소일자(ersrYmd) — 'YYYY-MM-DD'. 없으면 ''. */
  ersrYmd: string
  /** 만료일자(expryYmd) — 'YYYY-MM-DD'. 없으면 ''. */
  expryYmd: string
  /** 진행상황(aprvSecdNm) — 말소/실효/승인/제출/반려/저장. 10자. */
  aprvSecdNm: string
}

/**
 * 군수품무역대리업 신청 접수·업체 정보(dm_dfEqpmntTradAgncAplyInfo) — MUI-CM-01-M16/M17/M18 공용.
 * 설계서 slide180·184·188. 조회결과(ReadOnly). 반려사유(atrzRjctRsn)는 반려 시에만.
 */
export interface DfEqpmntTradeAgncAplyInfo {
  /** 접수번호(rcptNo) — 8자. */
  rcptNo: string
  /** 신청일시(rcptYmd) — 'YYYY-MM-DD'. 8자. */
  rcptYmd: string
  /** 처리일시(atrzYmd) — 'YYYY-MM-DD'. 8자. 없으면 ''. */
  atrzYmd: string
  /** 처리구분(atrzStcd) — 승인('S')/반려('R') 표시명. 1자. */
  atrzStcd: string
  /** 신청구분(regAplySecd) — 신규/갱신/변경. 1자. */
  regAplySecd: string
  /** 업태(bzstatCdNm) — 100자. */
  bzstatCdNm: string
  /** 상호(bzentyNm) — 100자. */
  bzentyNm: string
  /** 대표자성명(rprsvNm) — 100자. */
  rprsvNm: string
  /** 전화번호(bzentyTelno) — 20자. */
  bzentyTelno: string
  /** 팩스번호(bzentyFxno) — 20자. */
  bzentyFxno: string
  /** 이메일주소(bzentyEmlAddr) — 50자. */
  bzentyEmlAddr: string
  /** 사업자번호(brno) — 8자. */
  brno: string
  /** 설립일자(fndnYmd) — 'YYYY-MM-DD'. 8자. */
  fndnYmd: string
  /** 주소(bzentyAddr) — 200자. */
  bzentyAddr: string
  /** 반려사유(atrzRjctRsn) — 500자. 반려 시에만 표시. */
  atrzRjctRsn?: string
}

/**
 * 군수품무역대리업 첨부서류(dl_dfEqpmntTradAgncAplyAtchFileList) 1건 — MUI-CM-01-M16/M17/M18.
 * 설계서 slide180·184·188. fileTtl(첨부서류명, 고정) + fileNm(첨부파일명, 선택). size/required 는 UI 표시용.
 */
export interface DfEqpmntTradeAgncAtchFile {
  /** 첨부 슬롯 식별자(고유). */
  id: string
  /** 첨부서류명(fileTtl) — 200자. 등록신청서/이력서/청렴서약서/고용현황/기타 등. */
  fileTtl: string
  /** 첨부파일명(fileNm) — 300자. 미첨부면 ''. */
  fileNm?: string
  /** 파일 용량(표시용, 데이터영역 외). 예 '786KB'. */
  size?: string
  /** 필수 첨부(*) 표시 여부(설계서 slide182·186 '*'). */
  required?: boolean
  /** ⚠️ 첨부일자 — Figma(10020:83291) 파일 행에 표기(2026-01-01). 설계서 dl_dfEqpmntTradAgncAplyAtchFileList 미정의(잠정 표시용). */
  regYmd?: string
}

/**
 * 군수품무역대리업 보안측정인원(dl_scrtyMsrmtPrsnlList) 1건 — MUI-CM-01-M17/M18. 설계서 slide184·188.
 */
export interface DfEqpmntScrtyMsrmtPrsnl {
  /** 목록 key(로컬 식별). */
  id: string
  /** 성명(taskHdlrNm) — 100자. */
  taskHdlrNm: string
  /** ⚠️ 주민등록번호 — Figma(10020:83291) 보안측정인원 행에 마스킹 표기(260526-*******). 설계서 dl_scrtyMsrmtPrsnlList 미정의(잠정 rrno·표시용). */
  rrno?: string
  /** 적격여부(taskHdlrRsltCd) — 적격/부적격. 1자(적격여부코드). */
  taskHdlrRsltCd: string
  /** 보안측정일(taskHndlYmd) — 'YYYY-MM-DD'. 8자. */
  taskHndlYmd: string
  /** 첨부파일(fileNm) — 300자. */
  fileNm: string
  /** 구분(aprvSecdNm) — 심사대기/수정대기/승인완료. 10자. */
  aprvSecdNm: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 업체정보 추가등록 (MUI-CM-01-M05 물품(내자) / M22 담당자정보 / M23 국내소재상사 + 선택 팝업 P06~P12).
//   설계서 00.공통 v0.84 slide149~177(문서 P148~176). 웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 업체정보 추가 등록.
//   폼 입력값 타입은 각 폼 옆 *.schema.ts(z.infer)에 두고, 여기엔 목록/선택 팝업 아이템·폼 내 표 행 타입만 둔다.
//   ⚠️ 국내소재상사(M23/T06)·등록품목명세 상태 컬럼 등은 설계서 데이터영역(항목명 영문) 표가 없어 화면 표기 기준 잠정 영문키.
//      (FSC 는 상세 DmsAgtFscCode 재사용 — fscCd/gunGrdNm.)
// ─────────────────────────────────────────────────────────────────────────────

/** P06 품류선택(KnditmChc) 1건 — 설계서 slide161(품류코드/품류명). */
export interface KnditmChcItem {
  /** 품류코드(knditmCd) — 예 '11740'. */
  knditmCd: string
  /** 품류명(knditmCdNm) — 예 '피복'. */
  knditmCdNm: string
}

/** P07 조합/단체선택(AsctGrpChc) 1건 — 설계서 slide163(조합코드/단체명). */
export interface AsctGrpChcItem {
  /** 조합/단체코드(asctCd) — 예 '11000'. */
  asctCd: string
  /** 조합/단체명(asctCdNm) — 예 '한국피복공업협동조합'. */
  asctCdNm: string
}

/** P12 주거래은행선택(BankChc) 1건 — 설계서 slide173(코드/은행명). */
export interface BankChcItem {
  /** 은행코드(bankCd) — 예 '00500000'. */
  bankCd: string
  /** 은행명(bankNm) — 예 '농협은행'. */
  bankNm: string
}

/**
 * P08 등록대상품목선택(RegTrgtItemChc) 결과 1건 — 설계서 slide165.
 * 항목명(영문)은 업체정보 상세 등록품목명세(RegTrgtItem) 관례 준수. 삭제여부(delYn)는 slide165 표 컬럼.
 */
export interface RegTrgtItemChcItem {
  /** 품목코드(itemCd) — 예 '1234567890'. */
  itemCd: string
  /** 품명(itemCdNm) — 예 '물컵'. */
  itemCdNm: string
  /** 품류코드(knditmCd) — 예 '05'. */
  knditmCd: string
  /** 품류명(knditmCdNm) — 예 '피복'. */
  knditmCdNm: string
  /** 등록요건(itemRgstrtRqmtNm) — 예 '해당업종 사업자 / 공장등록'. */
  itemRgstrtRqmtNm: string
  /** 삭제여부(delYn) — 'Y'/'N'. slide165 표 컬럼. */
  delYn: 'Y' | 'N'
}

/**
 * P09 품목조회(ItemInq, 품목상세정보) — Figma 10020:85135 / 설계서 slide167.
 * 품목코드 + 업종코드/업종명. ⚠️ 업종코드/명은 slide167 화면 표기(업종코드 12345 / 업종명 기타) 기준 잠정 영문키.
 */
export interface ItemInqDetail {
  /** 품목코드(itemCd) — 예 '1234567890'. */
  itemCd: string
  /** 업종코드(bzstatCd) — 예 '1234'. ⚠️ 잠정. */
  bzstatCd: string
  /** 업종명(bzstatNm) — 예 '제조업'. ⚠️ 잠정. */
  bzstatNm: string
}

/**
 * M05 등록품목명세 폼 표 행(AddRegItemRow) — 설계서 slide151 표 컬럼.
 * 등록품목명세(RegTrgtItem) 항목명 + 상태 컬럼(승인/만료/갱신요청/접수상태).
 * ⚠️ 승인일자/만료일자/갱신요청일/접수상태 항목명은 slide151 화면 표기 기준 잠정 영문키.
 */
export interface AddRegItemRow {
  /** 로컬 식별자(목록 key·선택/삭제 대상). */
  id: string
  /** 품목코드(itemCd). */
  itemCd: string
  /** 품류코드(knditmCd). */
  knditmCd: string
  /** 품류명(knditmCdNm). */
  knditmCdNm: string
  /** 품명(itemCdNm). */
  itemCdNm: string
  /** 구분(itemRgstrtSecdNm) — 예 '제조'. */
  itemRgstrtSecdNm: string
  /** 등록요건(itemRgstrtRqmtNm) — 예 '공장등록'. */
  itemRgstrtRqmtNm: string
  /** 적격여부(itemRvwRsltCn) — 예 '적격'. */
  itemRvwRsltCn: string
  /** 승인일자(aprvYmd) — 'YYYY-MM-DD'. ⚠️ 잠정. */
  aprvYmd: string
  /** 만료일자(expryYmd) — 'YYYY-MM-DD'. ⚠️ 잠정. */
  expryYmd: string
  /** 갱신요청일(rnwlReqYmd) — 'YYYY-MM-DD'. ⚠️ 잠정. */
  rnwlReqYmd: string
  /** 접수상태(rcptSttsNm) — 예 '신청'/'갱신신청'. ⚠️ 잠정. */
  rcptSttsNm: string
}

/**
 * M23/P10 보안측정인원(ScrtyMsrmtPrsn) — 설계서 slide156·169.
 * ⚠️ 설계서에 데이터영역(항목명 영문) 표가 없어 화면 표기 기준 잠정 영문키(성명/적격여부/보안측정일/첨부파일).
 *    인원 정보(성명/적격/측정일)는 필수 아님, 첨부파일만 필수(slide169). (2026-07-01 개정: 주민등록번호 삭제)
 */
export interface ScrtyMsrmtPrsn {
  /** 로컬 식별자(목록 key·선택/삭제 대상). */
  id: string
  /** 성명(prsnNm) — ⚠️ 잠정. */
  prsnNm: string
  /** 적격여부(qualYn) — '적격'/'부적격'. ⚠️ 잠정. */
  qualYn: string
  /** 보안측정일(scrtMsrYmd) — 'YYYY-MM-DD'. ⚠️ 잠정. */
  scrtMsrYmd: string
  /** 첨부파일명(fileName) — 예 '증명서.pdf'. ⚠️ 잠정. */
  fileName: string
}

// ─────────────────────────────────────────────────────────────────────────────
// ── API 요청/응답 타입(추정 — TODO(백엔드 확정)) ──────────────────────────────
//   cmService/도메인 소형 서비스(bzentyService 등)의 요청 파라미터·응답 봉투 타입.
//   설계서 데이터영역에 없는(화면·목업에서만 관찰되는) 형태라 잠정 정의 — 백엔드 스펙 확정 시 교체.
//   ⚠️ services/cm.ts 전용. 페이지는 여전히 위쪽 데이터영역 타입(항목명 영문)만 참조한다.
// ─────────────────────────────────────────────────────────────────────────────

// ── 통합검색 (MUI-MS-01-M09/M10 IntgSrch, MenuPage) ──
/** 통합검색 결과 1건(스텁) — 추후 카테고리별 결과 봉투로 확장. */
export interface SearchResult {
  /** 안정적 고유 식별자. */
  id: string
  /** 검색 결과 제목. */
  title: string
}

/** 최근 검색어 1건(IntgSrch dm_recentSearch) — 태그로 표시(삭제 가능). */
export interface RecentSearch {
  /** 삭제 식별 키. */
  id: string
  /** 검색어. */
  keyword: string
}

/** 자주 찾는/연관 서비스 링크 1건 — NavigationItemList 로 표시. */
export interface SearchServiceLink {
  /** 안정적 고유 식별자. */
  id: string
  /** 서비스(메뉴)명. */
  label: string
}

// ── 연관진행현황 (MUI-CM 연관 건 조회, AnlPrgrsListPage) ──
/** 연관진행현황 1건 — ⚠️ 설계서 데이터영역 미정의(화면 표기 기준 잠정). */
export interface AnlPrgrsItem {
  /** 목록 key. */
  id: string
  /** 업무구분(taskSeNm) — 물품/용역/공사/국외. 뱃지. */
  taskSeNm: string
  /** 통합참조번호(rfrncNo). */
  rfrncNo: string
  /** 사업명/건명(bizNm). */
  bizNm: string
  /** 표시 행(라벨/값) — 카드 상세 행. */
  rows: { label: string; value: string }[]
}

// ── 알림현황 (MUI-MS-01-M13 NotiPrstPage) ──
/** 알림 1건 — ⚠️ 페이지 로컬 타입에서 이관(설계서 데이터영역 미정의, 잠정). */
export interface NotiItem {
  /** 목록 key. */
  id: string
  /** 알림 구분(카테고리) — 입찰/계약/공지 등. */
  category: string
  /** 알림 제목/내용. */
  title: string
  /** 발생일시 'YYYY-MM-DD HH:mm'. */
  date: string
  /** 읽음 여부. */
  read: boolean
}

// ── 조달업체 사용자 관리 (MUI-CM PrcmBzentyUserMngPage) ──
/** 사용자 상태코드 — 정상('Y')/임시('T')/해지('N')/수정('M'). ⚠️ 코드값 백엔드 확정 필요. */
export type UserSttsCd = 'Y' | 'T' | 'N' | 'M'

/** 조달업체 소속 사용자 1건 — ⚠️ 페이지 로컬 타입에서 이관(설계서 데이터영역 미정의, 잠정). */
export interface BzentyUser {
  /** 목록 key. */
  id: string
  /** 사용자ID(userId). */
  userId: string
  /** 성명(userNm). */
  userNm: string
  /** 부서(deptNm). */
  deptNm: string
  /** 전화번호(telno). */
  telno: string
  /** 휴대번호(mbtlNo). */
  mbtlNo: string
  /** 비고(rmrk). */
  rmrk: string
  /** 사용자유형명(userTyNm) — 관리자/일반 등. */
  userTyNm: string
  /** 상태코드(userSttsCd). */
  userSttsCd: UserSttsCd
  /** 상태명(userSttsNm) — 정상/임시/해지 등. */
  userSttsNm: string
}

/** 조달업체 사용자 검색 요청 — criteria(항목) + keyword. */
export interface BzentyUserSearch {
  /** 검색 기준 — 'userNm' | 'userId' | 'deptNm'. */
  criteria: string
  /** 검색어. */
  keyword: string
  /** 페이지(1-base, 선택). */
  page?: number
  /** 페이지 크기(선택). */
  pageSize?: number
}

// ── 만족도 조사 (introduce/SatisfactionSurvey) ──
/** 만족도 조사 제출 요청. */
export interface SatisfactionPayload {
  /** 만족도 — 'veryGood' | 'good' | 'normal' | 'bad' | 'veryBad'. */
  satisfaction: string
  /** 의견(자유 입력, 선택). */
  content: string
}

// ── FAQ / 게시판 (FaqListPage, BoardListView) ──
/** FAQ 목록 조회 요청 — 검색어(제목/내용)·구분·페이징. */
export interface FaqListRequest {
  /** 제목(qstnTtl) 부분검색(선택). */
  qstnTtl?: string
  /** 내용(contsCn) 부분검색(선택). */
  contsCn?: string
  /** 구분(bizFldCd) — FAQ 구분 코드(선택). */
  bizFldCd?: string
  /** 페이지(1-base, 선택). */
  page?: number
  /** 페이지 크기(선택). */
  pageSize?: number
}

/** 게시판 종류 — 공지사항/자료실/시스템개선안내(엔드포인트 분기용). */
export type BoardKind = 'notice' | 'rpstr' | 'sysImpv'

/** 게시판 목록 아이템(종류별 유니온) — getBoardList 반환 원소. */
export type BoardListItem = NoticeListItem | RpstrListItem | SysImpvListItem

/** 게시판 목록 조회 요청 — 종류별 검색조건을 optional 로 합친 봉투. */
export interface BoardListRequest {
  /** 제목(bbsTtl/rpstrTtl) 부분검색(선택). */
  bbsTtl?: string
  /** 제목(자료실 rpstrTtl) 부분검색(선택). */
  rpstrTtl?: string
  /** 내용(bbsCn) 부분검색(선택). */
  bbsCn?: string
  /** 내용(자료실 contsCn) 부분검색(선택). */
  contsCn?: string
  /** 작성자(wrtrNm) 부분검색(선택). */
  wrtrNm?: string
  /** 작성일자 범위(regDt FROM~TO, 선택). */
  regDt?: DateRangeValue
  /** 페이지(1-base, 선택). */
  page?: number
  /** 페이지 크기(선택). */
  pageSize?: number
}

// ── 문서함 (DocBoxPage, DocBoxDtlPage) ──
/** 문서함 목록 조회 요청 — 문서구분(탭)·페이징. */
export interface DocBoxListRequest {
  /** 문서구분(docSeCd) — 받은/보낸/반려/임시저장. */
  docSeCd: DocBoxSeCd
  /** 페이지(1-base, 선택). */
  page?: number
  /** 페이지 크기(선택). */
  pageSize?: number
}

/** 문서함 상세(M11) 응답 — 문서내용 + 첨부목록(상단 요약은 목록 아이템 재사용). */
export interface DocBoxDetail {
  /** 문서내용(docCn). */
  docCn: string
  /** 첨부파일 목록(T03). */
  atchList: DocBoxAtchFile[]
}

// ── 관심입찰공고 (ItrstBidPbancPage) ──
/** 관심입찰공고 목록 조회 요청 — 검색필터에서 파생. */
export interface ItrstBidListRequest {
  /** 개찰일자 범위(bdopnYmd FROM~TO, 선택). */
  bdopnYmd?: DateRangeValue
  /** 통합참조번호(intgRfrncNo, 선택). */
  intgRfrncNo?: string
  /** 공고번호(pbancNo, 선택). */
  pbancNo?: string
  /** 공고품목명(pbancItemNm, 선택). */
  pbancItemNm?: string
  /** 페이지(1-base, 선택). */
  page?: number
  /** 페이지 크기(선택). */
  pageSize?: number
}

// ── 업체정보 추가등록 (dmstLctnColInfoAddReg) ──
/** P08 등록대상 품목 검색 요청 — 품류/품명/업종. */
export interface RegTrgtItemSearch {
  /** 품류코드(knditmCd). */
  knditmCd: string
  /** 품명(itemNm) 부분검색. */
  itemNm: string
  /** 업종코드(bzstatCd). */
  bzstatCd: string
}

/** M05 물품(내자) 추가등록 신청 요청 — 화면 입력값 취합. */
export interface AddRegPayload {
  /** 본/지사(bplcSecd). */
  bplcSecd: string
  /** ISO 여부(isoYn). */
  isoYn: string
  /** 대표자영문(rprsvEngNm). */
  rprsvEngNm: string
  /** 영문주소(addrEng). */
  addrEng: string
  /** 선택 품류(P06). */
  knditm: KnditmChcItem | null
  /** 업태(bzstat). */
  bzstat: string
  /** 선택 조합/단체(P07). */
  asctGrp: AsctGrpChcItem | null
  /** 등록품목명세 행. */
  items: AddRegItemRow[]
  /** 약관 동의. */
  agreed: boolean
}

/** M23 국내소재상사 추가등록 신청 요청 — 화면 입력값 취합. */
export interface AddRegDmsAgtPayload {
  /** 본/지사(bplcSecd). */
  bplcSecd: string
  /** ISO 여부(isoYn). */
  isoYn: string
  /** 대표자영문(rprsvEngNm). */
  rprsvEngNm: string
  /** 영문주소(addrEng). */
  addrEng: string
  /** 법인/개인 구분(corpIndvSe). */
  corpIndvSe: string
  /** 법인등기기관(corpRgstOrgnNm). */
  corpRgstOrgnNm: string
  /** 법인등기일자(corpRgstYmd). */
  corpRgstYmd: string
  /** 법인등기목적(corpRgstPrps). */
  corpRgstPrps: string
  /** 취급품목(hdlItemNm). */
  hdlItemNm: string
  /** 업태(bzstatNm). */
  bzstatNm: string
  /** 사업자등록기관(bzrnoRgstOrgnNm). */
  bzrnoRgstOrgnNm: string
  /** 보안측정부대(scrtMsrUnitNm). */
  scrtMsrUnitNm: string
  /** 보안측정일자(scrtMsrYmd). */
  scrtMsrYmd: string
  /** 보안측정결과(scrtMsrRslt). */
  scrtMsrRslt: string
  /** 보안측정인원. */
  persons: ScrtyMsrmtPrsn[]
  /** FSC 코드 목록. */
  fscList: DmsAgtFscCode[]
  /** 연간매출액(anlSaleAmt). */
  anlSaleAmt: string
  /** 자산규모(astScl). */
  astScl: string
  /** 여신한도(lncLmt). */
  lncLmt: string
  /** 선택 주거래은행(P12). */
  bank: BankChcItem | null
  /** 지점(brnchNm). */
  brnchNm: string
  /** 군납최초참여일(mlsplyFrstPtcpYmd). */
  mlsplyFrstPtcpYmd: string
  /** 거래기간 시작(trnsPrdFrom). */
  trnsPrdFrom: string
  /** 거래기간 종료(trnsPrdTo). */
  trnsPrdTo: string
  /** Dun's Number(dunsNo). */
  dunsNo: string
  /** 약관 동의. */
  agreed: boolean
}

/** 추가정보 신청 상세(T05 물품(내자)/T06 국내소재상사) 응답 — 구분별로 채워지는 필드가 달라 optional. */
export interface AddRegInfoAplyDetail {
  /** T05 등록품목명세. */
  regTrgtItemList?: RegTrgtItem[]
  /** T05 담당자정보. */
  picInfo?: PicInfo
  /** T05 대표품류/조합·단체. */
  knditmAsctGrpList?: KnditmAsctGrp[]
  /** T06 보안측정인원. */
  scrtyMsrmtPrsnlList?: ScrtyMsrmtPrsn[]
  /** T06 FSC 코드. */
  fscList?: DmsAgtFscCode[]
}

// ── 군수품무역대리업 (dfEqpmntTradeAgnc) ──
/** M17 신규/갱신 신청 요청 — 구분(mode) + 첨부. */
export interface DfEqpmntTradeAgncAplyPayload {
  /** 신청 구분 — 'new'(신규) | 'renew'(갱신). */
  mode: 'new' | 'renew'
  /** 첨부서류. */
  files: DfEqpmntTradeAgncAtchFile[]
}

/** M18 변경 신청 요청 — 첨부(구분 없음). */
export interface DfEqpmntTradeAgncChgPayload {
  /** 첨부서류. */
  files: DfEqpmntTradeAgncAtchFile[]
}

// ── 업체정보관리 상세 (bzentyService, MUI-CM-01-M02) ──
/** 업체일반(T01) 상세 응답 — 일반 + 상태/수배/대표자/입찰대리인. */
export interface BzentyGnrlDetail {
  /** 업체일반. */
  gnrlInfo: BzentyGnrlInfo
  /** 상태/부정당. */
  sttsList: BzentyStts[]
  /** 수의계약배제. */
  rlsVltrnsList: BzentyRlsVltrnsRstric[]
  /** 대표자. */
  rprsvList: BzentyRprsv[]
  /** 입찰대리인. */
  bidAgtList: BzentyBidAgt[]
}

/** 물품(내자)(T02) 상세 응답 — 등록품목명세 + 담당자 + 대표품류/조합. */
export interface BzentyCmdtyInfo {
  /** 등록품목명세. */
  regTrgtItemList: RegTrgtItem[]
  /** 담당자정보. */
  picInfo: PicInfo
  /** 대표품류/조합·단체. */
  knditmAsctGrpList: KnditmAsctGrp[]
}

/** 시설(T03) 상세 응답 — 시설정보 + 면허 + 주력분야. */
export interface BzentyFcltDetail {
  /** 시설정보. */
  fcltInfo: BzentyFcltInfo
  /** 시설면허. */
  lcnsList: BzentyFcltLcns[]
  /** 주력분야. */
  mfrcList: BzentyFcltMfrcFld[]
}
