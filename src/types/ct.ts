// 계약(CT) 도메인 타입 — 설계서 03.계약 v0.83 데이터영역 항목명(영문) 그대로.
// 도메인당 1파일 원칙: CT 화면 타입은 전부 이 파일에 섹션 주석으로 구분해 추가한다.
import type { SearchFilterValue } from '@/types/search-filter'

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-M01 계약통합목록 (slide18~22)
// ────────────────────────────────────────────────────────────────────────────

/** 계약통합목록 검색필터 값 — 키는 설계서 검색조건 항목명(slide20 1.1) 그대로. */
export type CtSearchFilter = SearchFilterValue

/** 계약통합목록 카드 1건 — 설계서 데이터영역(slide20~21 1.2) 항목명 그대로. */
export interface CtrtIntgListItem {
  /** 목록 key/상세 라우팅용 고유 식별자 — `${ctrtNo}-${ctrtCycl}` (클라 생성, 배열 인덱스 key 금지). */
  id: string
  /** 번호 — 조회결과 자료 순번. */
  rnum: number
  /** 업무구분 — 물품/용역/공사/국외. */
  taskSecd: string
  /** 진행상태 — 서류요청/서류등록/서류반려/체결의뢰 (공통코드: 물품 UA22 · 공사 UB57 — 확정 시 코드값 전환). */
  ctrtPrgrsStcd: string
  /** 계약일자 (YYYY-MM-DD). */
  ctrtYmd: string
  /** 판단(공사)번호 — 물품=판단번호, 공사=공사번호. */
  prcmNo: string
  /** 계약번호 (11자리). */
  ctrtNo: string
  /** 계약번호차수. */
  ctrtCycl: string
  /** 계약건명. */
  ctrtNm: string
  /** 발주기관명. */
  orderInstNm: string
  /** 계약금액 (17,2). */
  ctrtAmt: number
  /** 계약방법 (상위코드: CTMC). */
  ctrtMthdCd: string
  /** 입찰방법 (상위코드: BDTC) — 카드 '입찰구분' 레이블(총액제/단가제) 구동. */
  bidMthdCd: string
  /** 수정계약사유 (상위코드: MRC) — 수정계약 건만. */
  mdfcnRncd?: string
  /** 계약담당. */
  ofcctrNm: string
  /** 첨언 — 있으면 카드에 '첨언' 뱃지. */
  addCn?: string
  /** 첨부(문서ID) — 있으면 카드에 '첨부' 뱃지. */
  docId?: string
  /** 전자서명 — 260617 개정 항목추가. 카드 전자서명 행(예: '1 / 4') 표시값. */
  elsgnVl?: string
  /**
   * 계약상태 표시레이블(계약진행/계약수정/계약최종/계약확정/계약해지/해제) — 카드 뱃지 구동.
   * ⚠️ 설계서 데이터영역 미정의 임시 항목(BD 진행상태 선례와 동일 패턴) — 상세설계 확정 시 교체.
   */
  ctrtStatNm?: string
  /**
   * 계약서유형 표시명 — '계약최종(타 계약서)' 카드의 상세 분기(M05 일반/M07 총액/M08 단가) 구동.
   * ⚠️ 설계서 데이터영역 미정의 임시 항목 — 분기 기준(CRTC 코드) 확정 시 교체.
   */
  ctrdocTpNm?: string
}

/** 계약통합목록 조회 요청 — 서버 필터/페이징 전환 시 filter·page 를 여기로 이행. */
export interface CtrtIntgListRequest {
  filter?: CtSearchFilter
}

/** 계약통합목록 조회 결과. */
export interface CtrtIntgListResult {
  list: CtrtIntgListItem[]
  total: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-M03 물품전자계약진행상세 (slide23~32) — 탭: T01 상세내용 · T02 계약업체
//   · T03 반송/취소사유 · T04 첨부서류. 항목명은 설계서 항목설명(slide28~30) 그대로.
// ────────────────────────────────────────────────────────────────────────────

/** 계약 상세정보(T01 상세내용) — slide28 계약상세정보 데이터영역. */
export interface CmdtyElctrCtrtPrgrsDtl {
  /** 계약번호 (11). */
  ctrtNo: string
  /** 계약번호차수 — 문서정보 표기(계약번호 (차수)). */
  ctrtCycl: string
  /** 계약서유형 (상위코드: CRTC) — 대여(7/J/8/K)·리스(5/H) 조건부 항목 표시 구동. */
  ctrdocTpcd: string
  /** 계약서유형 표시명(예: 물품제조구매계약서). */
  ctrdocTpNm: string
  /** 계약명 (300). */
  ctrtNm: string
  /** 판단번호 (38). */
  prcmNo: string
  /** 발주기관 (200). */
  orderInstNm: string
  /** 계약방법 (상위코드: CTMC) — 표시명. */
  ctrtMthdCd: string
  /** 수의계약사유 (상위코드: PCRC) — 없으면 '-'. */
  pvctRncd?: string
  /** 계약진행상태 (상위코드: UA22) — 진행단계별 바로가기 버튼 매트릭스(slide32) 구동. */
  ctrtPrgrsStcd: string
  /** 물가변동계약금액조정방법 (상위코드: PARA). */
  pfrAplcnMthdCd?: string
  /** 계약일자 (yyyy-mm-dd). */
  ctrtYmd: string
  /** 계약시작일자 (yyyy-mm-dd) — 계약기간 시작. */
  ctrtBgngYmd: string
  /** 계약종료일자 (yyyy-mm-dd) — 계약기간 끝. */
  ctrtEndYmd: string
  /** 납품시작일자 (yyyy-mm-dd) — 물품 계약만. */
  dlvgdsBgngYmd?: string
  /** 납품종료일자 (yyyy-mm-dd) — 물품 계약만. */
  dlvgdsEndYmd?: string
  /** 납품장소/위치/반납장소 (100) — 설계서상 동일 항목명(dlvgdsPlcNm) 공유. */
  dlvgdsPlcNm?: string
  /** 하자보수보증금율 (9,4) — 일반용역 계약만. */
  dfrpGrnteAmtRt?: number
  /** 대여목적 (500) — 대여계약서(7/J/8/K)만. */
  rntlPrps?: string
  /** 리스구분 (상위코드: UA46) — 리스계약(5/H)만. */
  leaseSecd?: string
  /** 리스료 지급기준 (상위코드: PDC) — 리스계약만. */
  lsfeeGiveCrtrCd?: string
  /** 리스료 (15) — 리스계약만. */
  qtrLsfee?: number
  /** 리스료 기준금액 (17) — 리스계약만. */
  lsfeeCrtrAmt?: number
  /** 지출관/재무관 연락처 (20) — 설계서상 동일 항목명(finrTelno) 2건 → [지출관, 재무관]. */
  finrTelno?: string[]
  /** 계약금액-일반예산 (17,2). */
  bscbgtCtrtAmt: number
  /** 계약금액-국채 (17,2). */
  govbndCtrtAmt: number
  /** 계약금액-합계 (17,2). */
  sumAmt: number
  /** 총부기금액 (17,2). */
  tbkpngAmt: number
  /** 계약보증금 (17,2). */
  grnteAmt: number
  /** 지체상금률 (9,4). */
  lqdmgRt: number
  /** 품목별 합계 — 계약금액 표(Figma 154603)에 표시. ⚠️ 설계서 항목표 미정의 임시 키(확정 시 교체). */
  itemSumAmt?: number
  /** 담당자 정보 — 구분(tkcgSecd 표시명: 계약담당 등) + 계급/성명(picNm). slide29 1.2. */
  managers: { tkcgSecd: string; picNm: string }[]
  /** 상단 요약(SummaryInfo) 뱃지 — 업무구분(목록 아이템과 동일 표시 항목). */
  taskSecd: string
  /** 상단 요약 뱃지 2 — 입찰방법(상위코드 BDTC, 예: 경쟁입찰). */
  bidMthdCd: string
  /** 상단 요약 뱃지 3 — 계약상태 표시레이블(목록과 동일 임시 키). */
  ctrtStatNm?: string
  /** 상단 요약 행 — 계약금액(목록 ctrtAmt 와 동일). */
  ctrtAmt: number
}

/** 계약업체(T02/T10) 1건 — slide29 1.3(물품) + slide44 1.2(공사 확장 필드). */
export interface CtrtBzenty extends CtrtBzentyCstrnExt {
  /** 목록 key(사업자등록번호 기반 — 배열 인덱스 key 금지). */
  id: string
  /** 계약업체명 (100). */
  bzentyNm: string
  /** 사업자등록번호 (10, 000-00-00000 표기). */
  brno: string
  /** 대표자 (100). */
  rprsvNm: string
  /** 금융기관 (7, WTB_PBT209/WTB_PDT209) — 표시명. */
  fnstCd: string
  /** 예금주 (100). */
  dpstrNm: string
  /** 전자서명일 (yyyy-mm-dd hh:mm:ss). */
  elsgnDt: string
  /** 보증금납부방법 (상위코드: GMCC) — 표시명(전자보증 등). */
  depsPayMthdCd: string
  /** 보증금액 (17,2). */
  grnteAmt: number
  /** 계좌실명번호 (64) — 설계서상 계좌번호와 동일 항목명(enacno) → 실명/계좌 분리 보관. */
  enacno: string
  /** 계좌번호 (64) — 마스킹 표시(*****). */
  acnutNo: string
}

// 공사(T10) 확장 필드 — slide44 1.2 계약업체 데이터영역(물품 대비 추가 항목).
export interface CtrtBzentyCstrnExt {
  /** 업체구분 표시(레이블 '계약유형': 대표/구성) — 항목표 미정의 임시(M73 bzentySeCd 재사용). */
  bzentySeCd?: string
  /** 전자서명여부 (1) — Y/N. */
  signYn?: string
  /** 전화번호 (20). */
  telno?: string
  /** 법인번호 (13). */
  crno?: string
  /** 주소 (200). */
  lctnAddr?: string
}

/** 생산공장(T02 하단, 방위사업청 계약만) 1건 — slide30 1.5 생산공장 데이터영역. */
export interface CtrtFctry {
  id: string
  /** 생산공장 (200) — 명칭. */
  fctryAddr: string
  /** 위치 (200) — 주소지. */
  fctryDaddr: string
  /** 우편번호 (6). */
  fctryOzip: string
}

/** 반송/취소 사유(T03) 1건 — slide29 1.4 + 단계별 타이틀(slide26/32). */
export interface CtrtRjctRsn {
  id: string
  /** 사유 타이틀 — 낙찰단가반송사유/제출서류반송사유/계약서 반송 사유/계약 취소 사유. */
  title: string
  /** 반송/취소 사유 (400). */
  rjctRsn: string
}

/** 첨부서류(T04) 1건 — slide30 1.6(계약관 제공)/1.7(계약업체 등록) 데이터영역. */
export interface CtrtAdocFile {
  id: string
  /** 계약 서류명 (상위코드: UA26) — 표시명(물품제조구매계약서/계약명세서 등). */
  ctrtAdocCd: string
  /** 계약 서류파일 (300) — 첨부파일명. 없으면 '-' 표시. */
  fileNm: string
  /** 파일 크기 표시(예: '786KB') — 정보 없으면 '-' 표시(응답 필드명 미정, 임시). */
  fileSize?: string
}

/** 첨부서류 탭 조회 결과 — 계약관 제공/계약업체 등록 2섹션. */
export interface CtrtAdocResult {
  /** 계약관 첨부서류(계약참조서류, slide30 1.6). */
  refDocs: CtrtAdocFile[]
  /** 계약업체 첨부서류(계약제출서류, slide30 1.7). */
  sbmsnDocs: CtrtAdocFile[]
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-M09 공사전자계약진행상세 (slide38~47) — 탭: T09 상세정보 · T10 계약업체
//   · T11 하자담보책임 · T12 첨부서류(M03 T04 구조 재사용). 항목명 slide43~45 그대로.
// ────────────────────────────────────────────────────────────────────────────

/** 공사 계약 상세정보(T09) — slide43~44 데이터영역. */
export interface CstrnElctrCtrtPrgrsDtl {
  /** 계약번호 (11). */
  ctrtNo: string
  /** 계약번호차수 — 문서정보 표기(계약번호+계약회차). */
  ctrtCycl: string
  /** 계약유형 (상위코드: UB02) — 표시명(공사계약서 등). */
  fcltLbsvcSecd: string
  /** 계약건명 (300). */
  ctrtNm: string
  /** 공사번호 (38). */
  prcmNo: string
  /** 발주처 (200). */
  orderInstNm: string
  /** 계약방법 (상위코드: CTMC). */
  ctrtMthdCd: string
  /** 수의계약사유 (상위코드: PCRC) — 없으면 '-'. */
  pvctRncd?: string
  /** 계약진행상태 (상위코드: UA22). */
  ctrtPrgrsStcd: string
  /** 하자담보유무 (1) — Y/N. */
  flwGrnteYn: string
  /** 착공년월일 (yyyy-mm-dd). */
  bgncstYmd: string
  /** 준공년월일 (yyyy-mm-dd). */
  cmcnYmd: string
  /** 기타사항 (4000). */
  etcMttr?: string
  /** 계약일자 (yyyy-mm-dd). */
  ctrtYmd: string
  /** 계약시작일자 (yyyy-mm-dd). */
  ctrtBgngYmd: string
  /** 계약종료일자 (yyyy-mm-dd). */
  ctrtEndYmd: string
  /** 낙찰자확정일자 (yyyy-mm-dd). */
  scbdrCfmtnYmd?: string
  /** 입찰일자 (yyyy-mm-dd). */
  bidYmd?: string
  /** 물가변동계약금액조정방법 (상위코드: PARA). */
  pfrAplcnMthdCd?: string
  /** 입찰방법 (상위코드: BDTC) — 총액제 등. */
  bidMthdCd: string
  /** 처리사유 (200). */
  prcsRsn?: string
  /** 수정사유 (상위코드: CC). */
  mdfcnCtrtRncd?: string
  /** 관련근거 (500). */
  relBssCn?: string
  /** 계약금액-일반예산 (17,2). */
  bscbgtCtrtAmt: number
  /** 계약금액-국채 (17,2). */
  govbndCtrtAmt: number
  /** 계약금액-합계 (17,2). */
  sumAmt: number
  /** 총부기금액 (17,2). */
  tbkpngAmt: number
  /** 계약보증금 (17,2). */
  grnteAmt: number
  /** 지체상금률 (9,4). */
  lqdmgRt: number
  /** 공채매입금액 (17). */
  pbdbtPrchsAmt?: number
  /** 낙찰율 (9,4). */
  scbrt?: number
  /** 낙찰금액 (20,3). */
  scsbdAmt?: number
  /** 예정금액 (17,2). */
  prnmntAmt?: number
  /** 국민주택채권매입금액 (17) — 채권매입 방법 안내 표시(추가요구사항 응용1-06). */
  nhbdPrchsAmt?: number
  /** 담당자 정보 — 구분(계약담당관 등) + 성명/계급. */
  managers: { tkcgSecd: string; picNm: string }[]
  /** 상단 요약 뱃지/행 — 업무구분/입찰방법/계약상태/계약금액(M03 과 동일 표시 항목). */
  taskSecd: string
  ctrtStatNm?: string
  ctrtAmt: number
}

/** 하자담보책임(T11) 1건 — slide45 1.3 데이터영역(여러 건 반복). */
export interface CtrtCnstpFlw {
  id: string
  /** 공종명 (200). */
  cnstpNm: string
  /** 공종별 계약금액(원) (17,2). */
  cnstpCtrtAmt: number
  /** 하자보수 보증율(%) (9,4). */
  dfrpGrnteAmtRt: number
  /** 하자담보책임기간(년) (100). */
  wrtrspPrdCn: string
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-M05 물품일반계약서상세 (slide63~68) — 탭 없음(단일 콘텐츠).
// 항목명 slide66~67 그대로. M04 확정상세는 M03 과 화면 동일(slide33 참고사항) — 별도 타입 없음.
// ────────────────────────────────────────────────────────────────────────────

/** 물품일반계약서 상세 — slide66~67 데이터영역. */
export interface CmdtyGnrlCtrdocDtl {
  /** 계약번호 (11). */
  ctrtNo: string
  /** 계약번호차수 — 문서정보 표기. */
  ctrtCycl: string
  /** 판단번호 (38). */
  prcmNo: string
  /** 발주처 (200). */
  orderInstNm: string
  /** 계약유형 (상위코드: CRTC) — 표시명. */
  ctrdocTpcd: string
  /** 통합참조번호 (54). */
  intgRfrncNo: string
  /** 계약방법 (상위코드: CTMC). */
  ctrtMthdCd: string
  /** 계약일자 (yyyy-mm-dd). */
  ctrtYmd: string
  /** 증권번호 (30). */
  scrtNo?: string
  /** 수의계약사유 (상위코드: PCRC). */
  pvctRncd?: string
  /** 기타사항 (4000). */
  etcMttr?: string
  /** 계약금액-본조 (17,2). */
  bscbgtCtrtAmt: number
  /** 계약금액-국채 (17,2). */
  govbndCtrtAmt: number
  /** 계약금액-합계 (17,2). */
  sumAmt: number
  /** 계약금액-총부기금액(총제조부기금액) (17,2). */
  tcstrnBkpngAmt: number
  /** 계약보증금 (17,2). */
  grnteAmt: number
  /** 지체상금율 (9,4). */
  lqdmgRt: number
  /** 납부방법 (상위코드: GMCC). */
  depsPayMthdCd?: string
  /** 물가변동계약금액조정방법 (상위코드: PARA). */
  pfrAplcnMthdCd?: string
  /** 납품일자 (yyyy-mm-dd). */
  dlvgdsYmd?: string
  /** 납품장소 (100). */
  dlvgdsPlcNm?: string
  /** 계약대상자 — 상호(bzentyNm)/사업자등록번호(brno)/대표자(rprsvNm)/전화번호(telno)/
   *  주소(bzentyAddr)/금융기관(fnstCd)/계좌번호(actno)/예금주(dpstrNm). slide65 4]. */
  bzenty: {
    bzentyNm: string
    brno: string
    rprsvNm: string
    telno: string
    bzentyAddr: string
    fnstCd: string
    actno: string
    dpstrNm: string
  }
  /** 담당자 정보 — 구매/원가/계약담당 성명+계급(slide67 1.2). [{구분, 성명 계급}] 표시용 정규화. */
  managers: { tkcgSecd: string; picNm: string }[]
  /** 상단 요약 — 뱃지(업무구분/계약방법)·타이틀(품명)·행(계약일자/발주기관/계약금액). */
  taskSecd: string
  rprsItemNm: string
  ctrtAmt: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-M06 물품수정계약서상세 (slide76~82) — 탭: T22 상세정보 · T23 수정계약명세서
//   · T24 특수조건. 항목명 slide80~82 그대로.
// ────────────────────────────────────────────────────────────────────────────

/** 물품수정계약서 상세(T22) — slide80 데이터영역. */
export interface CmdtyMdfcnCtrdocDtl {
  /** 계약번호 (11). */
  ctrtNo: string
  /** 계약번호차수. */
  ctrtCycl: string
  /** 계약일자 (yyyy-mm-dd). */
  ctrtYmd: string
  /** 원계약번호 (11). */
  orgctNo: string
  /** 원계약일자 (yyyy-mm-dd). */
  orgctYmd: string
  /** 품명 (200). */
  rprsItemNm: string
  /** 수정계약사유 (상위코드: MRC). */
  mdfcnRncd: string
  /** 기타사항 (4000). */
  etcMttr?: string
  /** 계약금액-증액 (17,2). */
  mdfcnCtrtIncrsAmt: number
  /** 계약금액-감액 (17,2). */
  mdfcnCtrtCtbkAmt: number
  /** 추가보증금-계약 (17,2). */
  grnteAmt: number
  /** 추가보증금-차액 (17,2). */
  diffAmt: number
  /** 보증금구분 (상위코드: GDC) — 표시명(예: [K]공제조합보증서). */
  depsSecd: string
  /** 업체정보 — 상호/사업자등록번호/대표자/전화번호/주소/금융기관/계좌번호/예금주(slide77). */
  bzenty: {
    bzentyNm: string
    brno: string
    rprsvNm: string
    telno: string
    bzentyAddr: string
    fnstCd: string
    actno: string
    dpstrNm: string
  }
  /** 담당자 정보 — 계약담당공무원(ofcctrNm) 등. */
  managers: { tkcgSecd: string; picNm: string }[]
  /**
   * 상단 요약 — 공고번호(slide76 문서정보 'pbancNo 99001') ⚠️ 설계서 항목표 미정의 임시 키(BD 선례).
   */
  pbancNo?: string
  /** 상단 요약 뱃지 — 업무구분/입찰구분/계약방법/계약상태(slide76: 물품/총액제/수의계약/계약수정). */
  taskSecd: string
  bidMthdCd: string
  ctrtMthdCd: string
  ctrtStatNm?: string
  /** 상단 요약 행 — 계약일자/발주기관/계약금액. */
  orderInstNm: string
  ctrtAmt: number
}

/** 수정계약명세서 품목(T23·P13 공용) 1건 — slide81·96 데이터영역. */
export interface CtrtMdfcnDtstItem {
  id: string
  /** 순번. */
  rnum: number
  /** 구분 (10) — 품목구분(1:추가/5:취소) + Flag(1:을/2:으로) 표시명. */
  se: string
  /** 조달요구번호 (15). */
  prcmRqtNo: string
  /** 군급-재고번호 (9). */
  invtNo?: string
  /** 군구분 (상위코드: RS). */
  prcmRqtInstCd: string
  /** 품명 (WTB_PVB166). */
  fscCd: string
  /** 예산구분 (상위코드: UZ03). */
  bgtCd: string
  /** 예산항목 (상위코드: KB). */
  bgtSecd?: string
  /** 사업명/사업ID (50). */
  biz?: string
  /** 승인일자 (yyyy-mm-dd). */
  aprvYmd?: string
  /** 단위 (상위코드: UI). */
  unitCd?: string
  /** 수량 (15,2). */
  ctrtQty?: number
  /** 단가 (17,2). */
  ctrtUntprc?: number
  /** 금액 (17,2). */
  itemAmt?: number
  /** 규격번호 (20). */
  spcfctNo?: string
  /** 납지별수량 (15,2). */
  plcdlvQty?: number
  /** 증감내역(수량) (17,2). */
  qtyIcdcDsctn?: number
  /** 증감내역(금액) (17,2). */
  amtIcdcDsctn?: number
  /** 검사형태 (상위코드: ITC). */
  inspShp?: string
  /** 납기 (yyyy-mm-dd). */
  dudt?: string
  /** 납지 (40). */
  plcdlv?: string
}

/** 물품수정계약명세서(P13) 조회 결과 — 계약정보 + 수정항목 + 품목(반복) + 합계(slide95~96). */
export interface CmdtyMdfcnCtrdocDtstResult {
  ctrtInfo: {
    ctrtNo: string
    /** 수정계약차수 (7). */
    mdfcnCtrtCycl: string
    ctrtNm: string
    bzentyNm: string
  }
  /** 수정항목 (mdfcnArtclNm — 단위/단가/납기/품목추가 등). */
  mdfcnArtclNm: string
  items: CtrtMdfcnDtstItem[]
  /** 계약품목 합계 — 수량/금액/증감내역(수량)/증감내역(금액). */
  sums: {
    sumCtrtQty: number
    sumCtrtAmt: number
    sumQqtyIcdcDsctn: number
    sumAmtIcdcDsctn: number
  }
}

/** 물품최종계약명세서(P12) 품목 1건 — slide92 데이터영역. */
export interface CtrtLastDtstItem {
  id: string
  /** 계약번호 (11). */
  ctrtNo: string
  /** 조달요구번호 (15). */
  prcmRqtNo: string
  /** 재고번호 (9). */
  invtNo: string
  /** 품명 (WTB_PVB166). */
  fscCd: string
  /** 계약수량 (15,2). */
  ctrtQty: number
  /** 계약단가 (17,2). */
  ctrtUntprc: number
  /** 계약금액 (17,2). */
  ctrtAmt: number
  /** 납기 (yyyy-mm-dd). */
  dudt: string
  /** 납지 (40). */
  plcdlv: string
  /** 납기납지별수량 (15,2). */
  plcdlvQty: number
}

/** 특수조건(T24) — slide82: spclCnd (512). */
export interface CtrtSpclCnd {
  spclCnd: string
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-M10 공사계약서상세 (slide69~75) — 탭: T19 상세정보 · T20 하자담보책임(CtrtCnstpFlw
//   재사용) · T21 연대보증. 항목명 slide73~74 그대로.
// ────────────────────────────────────────────────────────────────────────────

/** 공사계약서 상세(T19) — slide73~74 데이터영역. */
export interface CstrnCtrdocDtl {
  /** 계약번호 (11). */
  ctrtNo: string
  /** 계약번호차수. */
  ctrtCycl: string
  /** 계약유형 (상위코드: UB02) — 표시명. */
  fcltLbsvcSecd: string
  /** 계약건명 (300). */
  ctrtNm: string
  /** 공사번호 (38). */
  prcmNo: string
  /** 발주처 (200). */
  orderInstNm: string
  /** 계약방법 (상위코드: CTMC). */
  ctrtMthdCd: string
  /** 납부방법 (상위코드: GMCC). */
  depsPayMthdCd?: string
  /** 착공년월일 (yyyy-mm-dd). */
  bgncstYmd: string
  /** 준공년월일 (yyyy-mm-dd). */
  cmcnYmd: string
  /** 계약일자 (yyyy-mm-dd). */
  ctrtYmd: string
  /** 기타사항 (4000). */
  etcMttr?: string
  /** 수의계약사유 (상위코드: PCRC). */
  pvctRncd?: string
  /** 물가변동계약금액조정방법 (상위코드: PARA). */
  pfrAplcnMthdCd?: string
  /** 계약금액-본조 (17,2). */
  bscbgtCtrtAmt: number
  /** 계약금액-국채 (17,2). */
  govbndCtrtAmt: number
  /** 계약금액-합계 (17,2). */
  sumAmt: number
  /** 총부기금액 (17,2). */
  tcstrnBkpngAmt: number
  /** 계약보증금 (17,2). */
  grnteAmt: number
  /** 지체상금률 (9,4). */
  lqdmgRt: number
  /** 계약대상자 — 상호/사업자/대표자/전화/주소/금융기관/계좌번호/예금주(slide70). */
  bzenty: {
    bzentyNm: string
    brno: string
    rprsvNm: string
    telno: string
    bzentyAddr: string
    fnstCd: string
    actno: string
    dpstrNm: string
  }
  /** 담당자 정보 — 계약담당(ofcctrNm/ofcctrEchlnCd) 정규화. */
  managers: { tkcgSecd: string; picNm: string }[]
  /** 상단 요약 — 뱃지(업무구분/계약방법)·타이틀(계약건명)·행. */
  taskSecd: string
  ctrtStatNm?: string
  ctrtAmt: number
}

/** 연대보증(T21) 1건 — slide74 1.3 데이터영역(여러 건 반복). */
export interface CtrtJntGrnte {
  id: string
  /** 순번. */
  rnum: number
  /** 상호 (100). */
  bzentyNm: string
  /** 금융기관 (7). */
  fnstCd: string
  /** 사업자등록번호 (10). */
  brno: string
  /** 계좌번호 (20). */
  actno: string
  /** 대표자 (100). */
  rprsvNm: string
  /** 예금주 (100). */
  dpstrNm: string
  /** 주소 (200). */
  bzentyAddr: string
  /** 전화번호 (20). */
  telno: string
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-M07 물품총액계약서상세 · M08 물품단가계약서상세 (slide48~62)
// — 같은 3탭 구조(상세정보/계약명세서/특수조건), 단가제만 부서명·조달판단번호 추가(slide57)
//   → 1페이지 + type 파라미터(CtCtrdocType). 항목명 slide52~54·60~61 그대로.
// ────────────────────────────────────────────────────────────────────────────

/** 총액제(M07, gramt) / 단가제(M08, untprc) 구분. */
export type CtCtrdocType = 'gramt' | 'untprc'

/** 물품총액/단가계약서 상세(T13/T16 공용) — slide52·60 데이터영역. */
export interface CmdtyCtrdocDtl {
  /** 물품명 (200). */
  rprsItemNm: string
  /** 계약번호 (11). */
  ctrtNo: string
  /** 계약번호차수. */
  ctrtCycl: string
  /** 계약일자 (yyyy-mm-dd). */
  ctrtYmd: string
  /** 공고번호 (7). */
  pbancNo: string
  /** 입찰방법 (상위코드: BDTC) — 총액제/단가제. */
  bidMthdCd: string
  /** 계약방법 (상위코드: CTMC). */
  ctrtMthdCd: string
  /** 납품일자 (yyyy-mm-dd). */
  dlvgdsYmd?: string
  /** 납품장소 (100). */
  dlvgdsPlcNm?: string
  /** 기타사항 (4000). */
  etcMttr?: string
  /** 물가변동율적용방법 (상위코드: PARA). */
  pfrAplcnMthdCd?: string
  /** 부서명 (상위코드: RIC) — 단가제(M08)만(slide61 1.1). */
  deptCd?: string
  /** 조달판단번호 (38) — 단가제(M08)만. */
  prcmNo?: string
  /** 본조 (17,2). */
  bscbgtCtrtAmt: number
  /** 국채 (17,2). */
  govbndCtrtAmt: number
  /** 합계 (17,2). */
  sumAmt: number
  /** 총제조부기금액 (17,2). */
  tbkpngAmt: number
  /** 계약보증금 (17,2). */
  grnteAmt: number
  /** 지체상금율 (9,4). */
  lqdmgRt: number
  /** 업체정보 — 상호/사업자/대표자/전화/주소/금융기관/계좌번호/예금주 + 납부방법(260622 추가). */
  bzenty: {
    bzentyNm: string
    brno: string
    rprsvNm: string
    telno: string
    bzentyAddr: string
    fnstCd: string
    actno: string
    dpstrNm: string
    /** 납부방법 (상위코드: GMCC — M07 은 항목확인불가 메모). */
    payMthdCd?: string
  }
  /** 담당자 정보. */
  managers: { tkcgSecd: string; picNm: string }[]
  /** 상단 요약 — 뱃지(업무구분/입찰방법)·행(계약일자/발주기관/계약금액). */
  taskSecd: string
  ctrtStatNm?: string
  orderInstNm: string
  ctrtAmt: number
}

/** 계약 명세정보(T14/T17 공용) — 예산구분 그룹 내 품목 1건. 총액제/단가제 항목 세트가 다름
 *  (slide53·61 1.2) — 값 있는 필드만 렌더. */
export interface CtrtDtstGroupItem {
  id: string
  /** 공동계약업체 (100) — 총액제(T14). */
  bzentyNm?: string
  /** 조달요구번호 (15) — 총액제. */
  prcmRqtNo?: string
  /** 재고번호 (9). */
  invtNo?: string
  /** 품명 (WTB_PVB166). */
  fscCd?: string
  /** 적용장비 (상위코드: AC) — 총액제. */
  aplcnEqpmntCd?: string
  /** 군구분 (상위코드: RS) — 총액제. */
  prcmRqtInstCd?: string
  /** 예산항목 (상위코드: KB) — 총액제. */
  bgtSecd?: string
  /** 항목번호 (3) — 단가제(T17). */
  clsfNo?: string
  /** 단위 (상위코드: UI) — 단가제. */
  unitCd?: string
  /** 수량(예정) (15,2) — 단가제. */
  ctrtQty?: number
  /** 단가 (17,2) — 단가제. */
  ctrtUntprc?: number
  /** 금액(예정) (17,2) — 단가제. */
  itemAmt?: number
  /** 도면번호 (21) — 단가제. */
  flrplnNo?: string
  /** 규격번호 (20) — 단가제. */
  spcfctNo?: string
  /** 부품번호 (32) — 단가제. */
  prtsNo?: string
  /** 검사형태 (상위코드: ITC) — 단가제. */
  inspShp?: string
  /** 납기 (yyyy-mm-dd) — 단가제. */
  dudt?: string
  /** 납지 (40) — 단가제. */
  plcdlv?: string
  /** 납지수량 (15,2) — 단가제. */
  plcdlvQty?: number
}

/** 계약 명세정보 — 예산구분(장기국채/총계/예산별 소계) 그룹 반복(slide50·58). */
export interface CtrtDtstGroup {
  id: string
  /** 예산구분 그룹 라벨 — 장기국채/총계/예산별 소계 등. */
  bgtCd: string
  items: CtrtDtstGroupItem[]
}

/** 계약명세서 탭(T14/T17) 조회 결과 — 부서명/조달판단번호 헤더 + 예산구분 그룹. */
export interface CmdtyCtrdocDtstResult {
  deptCd: string
  prcmNo: string
  groups: CtrtDtstGroup[]
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-M73 보증서 확인팝업 — 데이터영역은 국외 보증서 탭(T73, slide160~161)과 동일:
//   dm_ctrtInfo(계약정보) + dm_wtgrInfo(보증서정보). 항목명 slide161 그대로.
// ────────────────────────────────────────────────────────────────────────────

/** 보증서 정보(dm_wtgrInfo) 1건. */
export interface CtrtGrnteInfo {
  id: string
  /** 계약업체 (5) — 표시명. */
  ctrtBzentyCd: string
  /** 업체구분 (2) — 대표업체/구성업체. */
  bzentySeCd: string
  /** 납부방법 (1) — 전자보증서 등. */
  payMthdCd: string
  /** 납부일자 (yyyy-mm-dd). */
  payYmd: string
  /** 보증서증권번호 (30). */
  wtgrScrtNo: string
  /** 보증시작일자 (yyyy-mm-dd). */
  grnteBgngYmd: string
  /** 보증종료일자 (yyyy-mm-dd). */
  grnteEndYmd: string
  /** 보증금 (25,3). */
  grnteAmt: number
  /** 보증기관명 (200). */
  grnteInstNm: string
  /** 보증금면제사유 (1) — 없으면 '-'. */
  depsExmptnRsnCd?: string
  /** 계약일자 (yyyy-mm-dd). */
  ctrtYmd: string
}

/** 보증서 확인팝업 조회 결과 — 계약정보(dm_ctrtInfo) + 보증서정보(dm_wtgrInfo, 반복). */
export interface CtrtGrnteResult {
  ctrtInfo: { ctrtNo: string; ctrtYmd: string }
  wtgrInfos: CtrtGrnteInfo[]
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-M74 인지세 확인팝업 — 데이터영역은 국외 인지세 탭(T74, slide162~163)과 동일:
//   dm_ctrtInfo + dl_stmtxPayInfo + dm_payAmt. 항목명 slide163 그대로.
// ────────────────────────────────────────────────────────────────────────────

/** 인지세 납부정보(dl_stmtxPayInfo) 1건. */
export interface CtrtStmtxPayInfo {
  id: string
  /** 계약번호 (35). */
  ctrtNo: string
  /** 사용여부 (1) — 사용/미사용 표시. */
  useYn: string
  /** 업체코드 (5). */
  bzentyCd: string
  /** 업체명 (200). */
  bzentyNm: string
  /** 사업자번호 (100). */
  enbrno: string
  /** 납부번호 (20). */
  payNo: string
  /** 납부일자 (yyyy-mm-dd). */
  payYmd: string
  /** 납부금액 (25,3). */
  payAmt: number
  /** 비고 (4000). */
  rmrkCn?: string
}

/** 인지세 확인팝업 조회 결과 — 계약정보 + 납부정보(반복) + 납부액(dm_payAmt). */
export interface CtrtStmtxResult {
  ctrtInfo: { ctrtYr: string; ctrtNo: string; ctrtOd: string }
  payInfos: CtrtStmtxPayInfo[]
  payAmt: {
    /** 납부대상액 (25,3). */
    payTrgtAmt: number
    /** 납부액 (25,3). */
    payAmt: number
    /** 부족액 (25,3). */
    unpaidAmt: number
  }
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-P11 물품계약명세서 (slide87~90) — 계약정보 + 계약품목정보(반복).
// 항목명 slide88~89 그대로.
// ────────────────────────────────────────────────────────────────────────────

/** 계약 품목정보 1건 — slide88 1.2(+slide89 계속, 260623 군급-재고번호 등 추가분 포함). */
export interface CtrtDtstItem {
  id: string
  /** 순번. */
  rnum: number
  /** 항목번호 (3, '000 000 0000' 표기). */
  clsfNo: string
  /** 예산구분 (상위코드: UZ03) — 일반예산 등. */
  bgtCd: string
  /** 조달요구번호 (15). */
  prcmRqtNo: string
  /** 품명 (WTB_PVB166) — 표시명. */
  fscCd: string
  /** 규격번호 (20). */
  spcfctNo: string
  /** 규격종류 (상위코드: CSC). */
  spcfctKndCd: string
  /** 단위 (상위코드: UI) — EA/M 등. */
  unitCd: string
  /** 수량(예정) (15,2). */
  ctrtQty: number
  /** 군급-재고번호 (9) — 260623 추가. */
  invtNo?: string
  /** 부품번호 (32) — 260623 추가. */
  prtsNo?: string
  /** 적용장비 (32) — 260623 추가(설계서상 prtsNo 와 동일 항목명 → 별도 보관). */
  aplyEqpmnt?: string
  /** 납지 (40). */
  plcdlv: string
  /** 단가 (17,2) — 260623 추가. */
  ctrtUntprc?: number
  /** 참조번호(도면번호) (32) — 260623 추가. */
  flrplnNo?: string
  /** 납지별수량 (15,2). */
  dlvQty: number
  /** 납기 (yyyy-mm-dd). */
  dudt: string
  /** 금액 (17,2). */
  itemAmt: number
}

/** 물품계약명세서 조회 결과 — 계약정보(slide88 1.1) + 품목(반복). */
export interface CmdtyCtrtDtstResult {
  ctrtInfo: {
    /** 계약번호 (11). */
    ctrtNo: string
    /** 계약번호차수 — 표기(계약번호 (차수)). */
    ctrtCycl: string
    /** 판단번호 (38). */
    prcmNo: string
    /** 발주기관 (200). */
    orderInstNm: string
    /** 계약명 (300). */
    ctrtNm: string
    /** 집행유형 (상위코드: ETC) — 구매 등. */
    bizTpcd: string
    /** 계약금액 (17,2). */
    ctrtAmt: number
    /** 일반예산금액 (17,2). */
    bscbgtCtrtAmt: number
    /** 국채금액 (17,2). */
    govbndCtrtAmt: number
  }
  items: CtrtDtstItem[]
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-M15 대금지불정보목록 · P16 대금지불정보조회 (slide100~103)
//   · P17 계약진행상태 (slide84~86). 항목명 slide101·103·85~86 그대로.
// ────────────────────────────────────────────────────────────────────────────

/** 대금지불정보 목록(M15) 1건 — slide101 1.2 데이터영역. */
export interface PymtDfryInfoItem {
  /** 목록 key — 증빙번호 기반(클라 생성). */
  id: string
  /** 순번. */
  rnum: number
  /** 수표발행일 (yyyy-mm-dd). */
  checkPblcnYmd: string
  /** 증빙번호 (6). */
  evdncNo: string
  /** 계약번호 (11). */
  ctrtNo: string
  /** 계약건명 (300). */
  ctrtNm: string
  /** 업무구분 (200). */
  taskSeNm: string
  /** 지출금액 (17,2). */
  expndAmt: number
  /** 지체상금액 (17,2). */
  lqdmgAmt: number
  /** 국고환수액 (17,2). */
  nttrRdmAmt: number
  /** 업체명 (100). */
  bzentyNm: string
}

/** 대금지불정보조회(P16) 결과 1건 — slide103 1.2 데이터영역. */
export interface PymtDfryInfoInqItem {
  id: string
  /** 지출일자 (yyyy-mm-dd). */
  expndYmd: string
  /** 계약번호 (11). */
  ctrtNo: string
  /** 지출관증빙번호 (7). */
  dsbofrEvdncNo: string
  /** 지출금 (17,2). */
  expndAmt: number
  /** 업체명 (100). */
  bzentyNm: string
  /** 반납구분 (100). */
  rtnSe?: string
}

/** 계약진행상태(P17) 이력 1건 — slide85(국내)·86(국외 추가필드) 데이터영역. */
export interface CtrtPrgrsStts {
  id: string
  /** 처리상태 (상위코드: UA22 — 국외는 prcsStts 표시명). */
  ctrtPrgrsStcd: string
  /** 처리부대/업체 (300). */
  prcsSbsdBzenty: string
  /** 처리일시 (yyyy-mm-dd hh:mm:ss). */
  prcsDt: string
  /** 처리담당자 (100) — 국외 계약만 표시(slide84). */
  prcsPic?: string
  /** 반려사유 (4000) — 국외 계약만, 없으면 미표시. */
  rjctRsn?: string
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-M71 국외전자계약진행상세 (slide149~169) — 탭: T71 일반현황 · T72 계좌정보
//   · T73 보증서(M73 재사용) · T74 인지세(M74 재사용) · T75 계약명세서 · T76 첨부서류.
// 항목명 slide152~154·157~158·165·168 그대로. 표시 통화 포함 값은 표시 문자열로 보관.
// ────────────────────────────────────────────────────────────────────────────

/** 국외 계약 일반현황(T71) — dm_ctrtInfo(slide152~153) + 계약금액/구매형태/업체/담당자. */
export interface OvsElctrCtrtDtl {
  /** 계약번호 (35). */
  ctrtNo: string
  /** 계약차수 표기(문서정보 'KD… (00)'). */
  ctrtCycl: string
  /** 공고번호 — 문서정보(slide149). ⚠️ 항목표 미정의 임시 키(M06 선례). */
  pbancNo?: string
  /** 통합참조번호 (50). */
  intgRfrncNo?: string
  /** 계약건명 (500). */
  ctrtNm: string
  /** 계약일자 (yyyy-mm-dd). */
  ctrtYmd: string
  /** 전자계약상태 — 표시명(서류요청 등). */
  elctrCtrtPrgrsSttsCd: string
  /** 발주기관 (200). */
  orderInstNm: string
  /** 군구분. */
  prcmRqtInstCd?: string
  /** 사업구분 — 표시명(전력운영사업 등). */
  bizSeCd?: string
  /** 계약업체 — 표시명(TESLA 등). */
  ctrtBzentyCd?: string
  /** 계약금액 (25,3) — 표시 문자열(예: '1,000.00'). */
  ctrtAmt?: string
  /** 계약사유. */
  ctrtRsnCd?: string
  /** 계약구분 — 표시명(제조계약서 등). */
  ctrtPrgrsCd?: string
  /** 보증기간 — 표시(예: '24개월'). */
  grntePrdDayCnt?: string
  /** 담당자. */
  picId?: string
  /** 기능구분. */
  fwkSeCd?: string
  /** 일반조건코드. */
  gnrlCndCd?: string
  /** 일반조건 — 표시명. */
  gnrlCndNm?: string
  /** 무역대리점. */
  bzentyCd?: string
  /** 국가 — 표시명(미국 등). */
  ntnCd?: string
  /** 물품부호(물품번호). */
  cmdtySgn?: string
  /** 생산자. */
  prdctnBzentyCd?: string
  /** 계약방법 (50). */
  ctrtMthdNm?: string
  /** 화폐구분 — 표시명(미 달러 등). */
  crncCd?: string
  /** 수의사유. */
  pvctRsnCd?: string
  /** 지불조건 — 표시명(인수도조건 등). */
  pymtDfryCndCd?: string
  /** 보증금예치율 (5,2) — 표시(예: '10'). */
  grnteAmtDepstRt?: string
  /** 가격조건 — 표시명(Free Carrier: 운송인인도조건 등). */
  prcCndCd?: string
  /** 검사조건 — 표시명(공급자 2년 보증형태 등). */
  inspShpCd?: string
  /** 품목수 (10). */
  itemCnt?: string
  /** 집행유형 — 표시명(구매 등). */
  bizTypeCd?: string
  /** 예상납기일 (yyyy-mm-dd). */
  expcDudtYmd?: string
  /** 사업승인일자 (yyyy-mm-dd). */
  bizAprvYmd?: string
  /** 품목군 — 표시명(수리부속 등). */
  implTypeItemCd?: string
  /** 최종선적일 (yyyy-mm-dd). */
  lastShpgYmd?: string
  /** 절충조건. */
  ofstCndCd?: string
  /** 절충사업관리번호. */
  ofstBizMngNo?: string
  /** UN CPC — 항목표에 영문명 미기재(임시 unCpc). */
  unCpc?: string
  /** 납기월 (2). */
  dudtMm?: string
  /** 승인일자 (yyyy-mm-dd). */
  aprvYmd?: string
  /** 분할선적유무 (Y/N). */
  prttnShpgYn?: string
  /** 분할선적횟수. */
  prttnShpgNmtm?: string
  /** 지체한도율 (9,4) — 표시(예: '10(%)'). */
  arrsLimRt?: string
  /** 지체상금율 (9,4) — 표시. */
  lqdmgRt?: string
  /** 감가율 (5,2) — 표시. */
  rdprcRt?: string
  /** 감가금액 (25,3) — 표시. */
  rdprcAmt?: string
  /** 계약보증금 (25,3) — 표시. */
  ctrtGrnteAmt?: string
  /** 납부방법 — 표시명(전자보증서 등). */
  payMthdCd?: string
  /** 운송방법 — 표시명(선박 등). */
  trnsMthdCd?: string
  /** 증권번호 (30). */
  scrtNo?: string
  /** 인지세 사용여부. */
  stmtxAplcnCd?: string
  /** 인지세 금액 — 표시(예: '0 원'). */
  stmtxPayAmt?: string
  /** 계약금액(dm_ctrtAmt) — 외화/원화/달러(통화 표기 포함 표시 문자열). */
  ctrtAmts: { ctrtFrcncyAmt: string; ctrtKrwAmt: string; ctrtUsdAmt: string }
  /** 구매형태(dm_prchsShp) — AOG/URGENT/ROUTINE 별 납품기한·지체한도율·감가율. */
  prchsShps: { id: string; label: string; dudt: string; arrsLimRt: string; rdprcRt: string }[]
  /** 계약 업체정보(dl_ctrtBzenty, slide154 1.4 — 반복). */
  bzentys: {
    id: string
    ctrtBzentyNm: string
    enbrno: string
    rprsvNm: string
    fnstCd: string
    dpstrNm: string
    elsgnYmd: string
    depsPayMthdCd: string
    /** 보증금액 — 통화 표기 포함(예: '10,000 USD'). */
    grnteAmt: string
    bacntRlnmNo: string
    enacno: string
  }[]
  /** 담당자 정보. */
  managers: { tkcgSecd: string; picNm: string }[]
  /** 상단 요약 — 업무구분 뱃지(국외)·계약금액 표시(예: '3,933.29 USD'). */
  taskSecd: string
  summaryAmt: string
}

/** 국외 계좌정보(T72) — slide156~158 (dm_ctrtInfo/dm_ctrtBzentyInfo/dm_bacntInfo/dm_dsgnPtr/dm_mkrPtr). */
export interface OvsBacntInfo {
  ctrtInfo: { ctrtNo: string; orderInstNm: string; crtrNm: string; bizTypeCd: string }
  bzentyInfo: {
    ctrtBzentyNm: string
    enbrno: string
    rprsvNm: string
    bzentyAddr: string
    bzentyAddr2?: string
  }
  bacntInfo: {
    fnstCd: string
    fnstEnbrno: string
    fnstNm: string
    atrzMthCd: string
    dpstrNm: string
    bacntRlnmNo?: string
    enacno: string
  }
  dsgnPtr?: { dsgnPtrNm?: string; ptrAddr?: string; ptrEntlno?: string; ptrFxno?: string }
  mkrPtr?: { mkrNm?: string; mkrNtnNm?: string }
}

/** 국외 계약명세서(T75) 품목 1건 — dl_ctrtItemList(slide165). */
export interface OvsCtrtDtstItem {
  id: string
  /** 순번. */
  regSn: number
  /** 항목번호 (5). */
  artclNo: string
  /** 조달요구번호 (15). */
  prcmRqtNo: string
  /** 단위 (100). */
  unitNm: string
  /** 수량 (15,2). */
  itemQty: number
  /** 군급-재고번호 (30). */
  fscCdInvtNo: string
  /** 부품번호 (32). */
  prtsNo?: string
  /** 적용장비 (100). */
  aplcnEqpmnt?: string
  /** 납지 (10). */
  plcdlvCd: string
  /** 단가 (25,3). */
  itemUntprc: number
  /** 품명 (200). */
  itemNm: string
  /** 예산구분 (2). */
  bgtSeCd?: string
  /** 납기 (yyyy-mm-dd). */
  dudtYmd?: string
  /** 계약금액원화 (25,3). */
  ctrtAmt: number
}

/** 국외 계약명세서(T75) 조회 결과 — 계약정보(dm_ctrtInfo) + 품목 + 단가합계. */
export interface OvsCtrtDtstResult {
  ctrtInfo: {
    ctrtNo: string
    /** 판단번호 (38). */
    jdgmtNo: string
    orderInstNm: string
    crtrNm: string
    bizTypeCd: string
    /** 계약금원화/외화/달러 — 통화 표기 포함 표시 문자열. */
    ctrtFrcncyAmt: string
    ctrtAmt: string
    ctrtUsdAmt: string
  }
  items: OvsCtrtDtstItem[]
  /** 품목 단가 합계 금액 (25,3). */
  sumAmt: number
}

/** 국외 첨부서류(T76) — 국내 구조 + 직인등록정보(dl_ofslReg) 추가(slide167~168). */
export interface OvsCtrtAdocResult {
  /** 계약관 첨부서류(dl_ctrtRfrncDcmnt) — ctrtDcmntNm/ctrtDcmntFile. */
  refDocs: { id: string; ctrtDcmntNm: string; ctrtDcmntFile: string; fileSize?: string }[]
  /** 계약업체 첨부서류(dl_ctrtSbmsnDcmnt). */
  sbmsnDocs: { id: string; ctrtDcmntNm: string; ctrtDcmntFile: string; fileSize?: string }[]
  /** 직인등록정보(dl_ofslReg) — 업체/직인파일명/등록여부. */
  ofslRegs: { id: string; bzentyNm: string; ofslFileNm: string; ofslFileRegYn: string }[]
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-01-M77 상업계약서상세 (slide178~184) — 탭: T77 계약현황 · T78 계약명세서 · T79 계약대상
//   + P78 상업계약서명세서 (slide185~186). 항목명 slide182~183·186 그대로.
// ────────────────────────────────────────────────────────────────────────────

/** 상업계약서 계약현황(T77) — dm_ctrtDtlInfo(slide182). 통화 표기 포함 값은 표시 문자열. */
export interface OvsCmbzCtrdocDtl {
  /** 계약담당부서 (100). */
  ofcctrDeptNm: string
  /** 담당자성명 (200). */
  picNm: string
  /** 계약번호 (35). */
  ctrtNo: string
  /** 구매요청번호(P.R.NO., 10) — 260625 누락 보완 항목. */
  prchsDmndNo: string
  /** 품목명 (200). */
  itemNm: string
  /** 사업구분 — 표시명. */
  bizSeCd: string
  /** 계약방법 (50). */
  ctrtMthdNm: string
  /** 계약형태 — 표시명(확정계약 등). */
  ctrtShpCd: string
  /** 화폐단위 (3). */
  crncCd: string
  /** 계약금액(외화) — 본조/당년국채/장기국채/계. */
  frcncyAmts: {
    bscbgtFrcncyAmt: string
    thsyrGovbndFrcncyAmt: string
    ltrmGovbndFrcncyAmt: string
    gramtFrcncy: string
  }
  /** 계약금액(원화) — 본조/당년국채/장기국채/계. */
  krwAmts: { bscbgtAmt: string; thsyrGovbndAmt: string; ltrmGovbndAmt: string; gramt: string }
  /** 계약 추가 정보 — slide179. */
  addInfo: {
    /** 계약보증금 — 표시(예: '100,000 KRW'). */
    ctrtGrnteAmt: string
    /** 계약보증금율 (5,2) — 표시(예: '10.00 %'). */
    ctrtGrnteAmtRt: string
    /** 지체상금율 (9,4) — 표시. */
    lqdmgRt: string
    /** 선급금 — 표시(예: '0.00 USD'). */
    prpamt: string
    /** 선급금율 (5,2) — 표시. */
    prpamtRt: string
    /** 품질보증기간 (10) — 표시(예: '0 일'). */
    qltyGrntePrd: string
    /** 운송방법 — 표시명. */
    trnsMthdCd: string
    /** 선적지 (20). */
    shplc: string
    /** 가격조건 — 표시명. */
    prcCndCd: string
    /** 최종납기일(예상) (yyyy-mm-dd). */
    lastDudtYmd: string
    /** 검사조건. */
    inspShpCd?: string
    /** 분할선적횟수. */
    prttnShpgNmtm?: string
  }
  /** 계약 안내 사항 — 고정문(slide179). */
  guideCn: string
  /** 붙임서류 목록(slide179). */
  attachedDocs: string[]
  /** 상단 요약 — 공고번호(임시 키)·품목명 타이틀·계약일자/발주기관/계약금액. */
  pbancNo?: string
  taskSecd: string
  ctrtYmd: string
  orderInstNm: string
  summaryAmt: string
}

/** 상업계약서 계약명세서(T78) — dl_ctrtDtst(slide183) + GRAND-TOTAL(dm_gramt). */
export interface OvsCmbzDtstResult {
  /** GRAND-TOTAL — 표시(예: '100.00 USD'). */
  gramt: string
  /** 명세서 목록 — 번호/PR.No./Group No./SUB-TOTAL. */
  groups: { id: string; no: number; prchsDmndNo: string; groupNo: string; itemGramt: string }[]
}

/** 상업계약서 계약대상(T79) — dm_ctrtRlt(slide183). */
export interface OvsCmbzTrgt {
  /** 계약담당 공무원 — 표시(방위사업청 계약관). */
  ofcctrNm: string
  /** 계약 상대자. */
  bzenty: {
    ctrtBzentyNm: string
    ctrtBzentyAddr: string
    rprsvNm: string
    ctrtBzentyEntlno: string
    ctrtBzentyFxno: string
    enbrno: string
    /** DUNS NO. — 항목표 미기재 표시 항목(임시). */
    dunsNo?: string
  }
  /** 무역대리점 - 연대보증인(없으면 미표시). */
  agent?: { bzentyNm: string; bzentyAddr: string; bzentyEntlno: string; bzentyFxno: string }
}

/** 상업계약서명세서(P78) — dm_ctrtInfo + dl_ctrtDtst(slide186). */
export interface OvsCmbzCtrtDtstResult {
  ctrtInfo: {
    ctrtNo: string
    prchsDmndNo: string
    /** Project — 계약건명 (500). */
    ctrtNm: string
    groupNo: string
    /** Firm — 계약업체명. */
    ctrtBzentyNm: string
    /** Type of Bid — 계약방법. */
    ctrtMthdNm: string
    crncCd: string
  }
  /** 품목 목록 — L/I·Stock-No·Part-No 등(단가/총금액은 통화 표기 포함 표시 문자열). */
  items: {
    id: string
    artclNo: string
    prcmRqtNo: string
    invtNo: string
    prtsNo?: string
    itemNm: string
    bgtSeCd?: string
    unitNm: string
    itemQty: number
    itemUntprc: string
    gramt: string
  }[]
  /** SUB-TOTAL — 표시(예: '340.00'). */
  itemGramt: string
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-CT-03 해지/해제 계열 (설계서 03.계약 v0.83 slide104~144)
//   M01 해지/해제 목록 · M02 물품일반 상세 · M03 일반총액제 · M04 일반단가제
//   · M05 수정계약 · M06 공사계약. 항목명은 설계서 항목설명(slide106·112~113·119~121·
//   127~129·135~137·143) 그대로. 계약명세서/특수조건/첨부서류는 CT-01 결과 타입 재사용.
// ⚠️ 카드 클릭 → 계약유형별 상세 분기(slide107)의 라우팅 판별 필드는 설계서 데이터영역
//   미정의 → 임시 키 dtlRouteCd(TODO). 나머지 항목명은 설계서 그대로.
// ────────────────────────────────────────────────────────────────────────────

/** 해지/해제 상세 라우팅 구분 — 카드 클릭 분기(M02~M06). ⚠️ 설계서 미정의 임시 키. */
export type CncltnRmvRouteCd = 'gnrl' | 'gramt' | 'untprc' | 'mdfcn' | 'cstrn'

/** 해지/해제 목록(M01) 카드 1건 — slide106 1.2 데이터영역 항목명 그대로. */
export interface CncltnRmvListItem {
  /** 목록 key/상세 라우팅용 고유 식별자 — `${ctrtNo}-${ctrtCycl}` (배열 인덱스 key 금지). */
  id: string
  /** 번호 — 조회결과 자료 순번. */
  rnum: number
  /** 업무구분 — 물품/용역/공사(국외는 목록 대상 아님, slide105 국외 비활성화). */
  taskSecd: string
  /** 판단(공사)번호 — 물품=판단번호, 공사=공사번호(slide104 문서정보). */
  prcmNo: string
  /** 계약번호 (11). */
  ctrtNo: string
  /** 차수. */
  ctrtCycl: string
  /** 계약건명. */
  ctrtNm: string
  /** 계약일자 (YYYY-MM-DD). */
  ctrtYmd: string
  /** 해지해제일자 (YYYY-MM-DD). */
  cncltnRmvYmd: string
  /** 발주기관. */
  orderInstNm: string
  /** 계약금액 (17,2). */
  ctrtAmt: number
  /** 계약방법 (상위코드: CTMC). */
  ctrtMthdCd: string
  /** 입찰구분 (상위코드: BDTC) — 카드 '입찰구분' 뱃지(총액제/단가제). */
  bidMthdCd: string
  /** 구분 — 해지/해제(cncltnRmvSecd 표시명, 1:해지 2:해제). */
  cncltnRmvSecd: string
  /** 진행상태 — 계약해지/계약해제/해지해제확정 등 카드 계약상태 뱃지(slide104 표시레이블). */
  cncltnRmvStatNm: string
  /** 해지해제사유 (500). */
  cncltnRmvRsn: string
  /** 계약담당 (상위코드: PCC + 담당관명). */
  fcltPicNm: string
  /** 상세 라우팅 구분 — 카드 클릭 분기(slide107). ⚠️ 설계서 미정의 임시 키. */
  dtlRouteCd: CncltnRmvRouteCd
}

/** 해지/해제 목록 조회 요청 — 서버 필터/페이징 전환 시 filter·page 를 여기로 이행. */
export interface CncltnRmvListRequest {
  filter?: SearchFilterValue
}

/** 해지/해제 목록 조회 결과. */
export interface CncltnRmvListResult {
  list: CncltnRmvListItem[]
  total: number
}

/** 물품 해지/해제 상세정보(M02 T01) — slide109·112 데이터영역. */
export interface CmdtyCncltnRmvDtl {
  /** 계약번호 (11). */
  ctrtNo: string
  /** 차수 — 문서정보 표기. */
  ctrtCycl: string
  /** 계약서유형 (상위코드: CRTC) — 표시명(물품제조구매계약서 등). */
  ctrdocTpcd: string
  /** 계약명 (300). */
  ctrtNm: string
  /** 판단번호 (38). */
  prcmNo: string
  /** 발주기관 (200). */
  orderInstNm: string
  /** 계약방법 (상위코드: CTMC). */
  ctrtMthdCd: string
  /** 수의계약사유 (상위코드: PCRC) — 없으면 '-'. */
  pvctRncd?: string
  /** 계약진행상태 (상위코드: UA22). */
  ctrtPrgrsStcd: string
  /** 계약일자 (yyyy-mm-dd). */
  ctrtYmd: string
  /** 계약시작일자 (yyyy-mm-dd) — 계약기간 시작. */
  ctrtBgngYmd: string
  /** 계약종료일자 (yyyy-mm-dd) — 계약기간 끝. */
  ctrtEndYmd: string
  /** 해지해제구분 (1:해지 2:해제) — 표시명. */
  cncltnRmvSecd: string
  /** 해지해제일자 (yyyy-mm-dd). */
  cncltnRmvYmd: string
  /** 해지해제사유 (500). */
  cncltnRmvRsn: string
  /** 물가변동계약금액조정방법 (상위코드: PARA). */
  pfrAplcnMthdCd?: string
  /** 계약금액-일반예산(본조) (17,2). */
  bscbgtCtrtAmt: number
  /** 계약금액-국채 (17,2). */
  govbndCtrtAmt: number
  /** 계약금액-합계 (17,2). */
  sumAmt: number
  /** 총제조부기금액 (17,2). */
  tbkpngAmt: number
  /** 계약보증금 (17,2). */
  grnteAmt: number
  /** 지체상금율 (9,4). */
  lqdmgRt: number
  /** 담당자 정보 — 구분(rlprSecd 표시명) + 성명/계급(picNm). slide112 1.2. */
  managers: { tkcgSecd: string; picNm: string }[]
  /** 상단 요약 — 뱃지(업무구분/계약방법/계약상태)·타이틀(품명)·행(해지해제일자/발주기관/계약금액). */
  taskSecd: string
  ctrtStatNm?: string
  rprsItemNm: string
  ctrtAmt: number
}

/** 해지해제 통보내용(M02 T03) 1건 — slide113 1.5 데이터영역. */
export interface CncltnRmvNoti {
  id: string
  /** 통보차수 (7). */
  ctrtCycl: string
  /** 통지일시 (yyyy-mm-dd hh:mm:ss). */
  ctrtPrgrsSttsDt: string
  /** 통보메일내용 (4000). */
  rjctRsn: string
}

/** 해지해제 정보(M02 T03) 조회 결과 — 통보내용(반복) + 참조서류(slide111·113 1.4). */
export interface CncltnRmvNotiResult {
  notis: CncltnRmvNoti[]
  /** 해지해제 참조서류 — cncltnRmvDmndAdocNm(서류명)/fileNm(첨부파일명). CtrtAdocFile 재사용. */
  adocs: CtrtAdocFile[]
}

/** 해지/해제 일반계약(총액제 M03/단가제 M04) 상세정보(T04/T07) — slide119~120·127~128. */
export interface CncltnRmvGnrlCtrtDtl {
  /** 물품명 (200). */
  rprsItemNm: string
  /** 계약번호 (11). */
  ctrtNo: string
  /** 차수. */
  ctrtCycl: string
  /** 계약일자 (yyyy-mm-dd). */
  ctrtYmd: string
  /** 공고번호 (7). */
  pbancNo: string
  /** 입찰방법 (상위코드: BDTC) — 총액제/단가제. */
  bidMthdCd: string
  /** 계약방법 (상위코드: CTMC). */
  ctrtMthdCd: string
  /** 납품일자 (yyyy-mm-dd). */
  dlvgdsYmd?: string
  /** 납품장소 (100). */
  dlvgdsPlcNm?: string
  /** 기타사항 (4000). */
  etcMttr?: string
  /** 해지해제일 (yyyy-mm-dd). */
  cncltnRmvYmd: string
  /** 해지해제사유 (500). */
  cncltnRmvRsn: string
  /** 물가변동율적용방법 (상위코드: PARA). */
  pfrAplcnMthdCd?: string
  /** 납부방법 (상위코드: GMCC). */
  payMthdCd?: string
  /** 본조 (17,2). */
  bscbgtCtrtAmt: number
  /** 국채 (17,2). */
  govbndCtrtAmt: number
  /** 합계 (17,2). */
  sumAmt: number
  /** 총제조부기금액 (17,2). */
  tbkpngAmt: number
  /** 계약보증금 (17,2). */
  grnteAmt: number
  /** 지체상금율 (9,4). */
  lqdmgRt: number
  /** 업체정보 — 상호/사업자/대표자/전화/주소/금융기관/계좌번호/예금주(slide119). */
  bzenty: {
    bzentyNm: string
    brno: string
    rprsvNm: string
    telno: string
    bzentyAddr: string
    fnstCd: string
    actno: string
    dpstrNm: string
  }
  /** 담당자 정보. */
  managers: { tkcgSecd: string; picNm: string }[]
  /** 상단 요약 — 뱃지(업무구분/입찰방법/계약상태)·행(해지해제일자/발주기관/계약금액). */
  taskSecd: string
  ctrtStatNm?: string
  orderInstNm: string
  ctrtAmt: number
}

/** 해지/해제 수정계약 상세정보(M05 T10) — slide135 데이터영역(CmdtyMdfcnCtrdocDtl + 해지해제). */
export interface CncltnRmvMdfcnCtrtDtl {
  /** 계약번호 (11). */
  ctrtNo: string
  /** 차수. */
  ctrtCycl: string
  /** 계약일자 (yyyy-mm-dd). */
  ctrtYmd: string
  /** 원계약번호 (11). */
  orgctNo: string
  /** 원계약일자 (yyyy-mm-dd). */
  orgctYmd: string
  /** 품명 (WTB_PVB166) — 표시명. */
  rprsItemNm: string
  /** 수정계약사유 (상위코드: MRC). */
  mdfcnRncd: string
  /** 기타사항 (4000). */
  etcMttr?: string
  /** 해지해제일 (yyyy-mm-dd). */
  cncltnRmvYmd: string
  /** 해지해제사유 (500). */
  cncltnRmvRsn: string
  /** 계약금액-증액 (17,2). */
  mdfcnCtrtIncrsAmt: number
  /** 계약금액-감액 (17,2). */
  mdfcnCtrtCtbkAmt: number
  /** 추가보증금-계약 (17,2). */
  grnteAmt: number
  /** 추가보증금-차액 (17,2). */
  diffAmt: number
  /** 보증금구분 (상위코드: GDC) — 표시명. */
  depsSecd: string
  /** 업체정보 — 상호/사업자/대표자/전화/주소/금융기관/계좌번호/예금주(slide131). */
  bzenty: {
    bzentyNm: string
    brno: string
    rprsvNm: string
    telno: string
    bzentyAddr: string
    fnstCd: string
    actno: string
    dpstrNm: string
  }
  /** 담당자 정보 — 계약담당공무원(ofcctrNm) 등. */
  managers: { tkcgSecd: string; picNm: string }[]
  /** 상단 요약 — 공고번호(임시 키)·뱃지(업무구분/입찰구분/계약상태)·행(해지해제일자/발주기관/계약금액). */
  pbancNo?: string
  taskSecd: string
  bidMthdCd: string
  ctrtStatNm?: string
  orderInstNm: string
  ctrtAmt: number
}

/** 해지/해제 공사계약 상세정보(M06 T13) — slide141·143 데이터영역. */
export interface CstrnCncltnRmvDtl {
  /** 계약번호 (11). */
  ctrtNo: string
  /** 차수. */
  ctrtCycl: string
  /** 계약건명 (300). */
  ctrtNm: string
  /** 공사번호 (38). */
  prcmNo: string
  /** 장/단기 구분 (상위코드: UB50) — 표시명. */
  lshtmSecd: string
  /** 수의계약사유 (상위코드: PCRC) — 없으면 '-'. */
  pvctRncd?: string
  /** 계약진행상태 (상위코드: UA22). */
  ctrtPrgrsStcd: string
  /** 착공년월일 (yyyy-mm-dd). */
  bgncstYmd: string
  /** 준공년월일 (yyyy-mm-dd). */
  cmcnYmd: string
  /** 기타사항 (4000). */
  etcMttr?: string
  /** 물가변동계약금액조정방법 (상위코드: PARA). */
  pfrAplcnMthdCd?: string
  /** 해지해제구분 (1:해지확정 2:해제확정) — 표시명. */
  cncltnRmvSecd: string
  /** 해지해제일자 (yyyy-mm-dd). */
  cncltnRmvYmd: string
  /** 해지해제확정사유 (200). */
  cncltnRmvCfmtnRsn: string
  /** 계약금액-일반예산 (17,2). */
  bscbgtCtrtAmt: number
  /** 계약금액-국채 (17,2). */
  govbndCtrtAmt: number
  /** 계약금액-합계 (17,2). */
  sumAmt: number
  /** 품목별 합계 (17,2). */
  itemSumAmt: number
  /** 총공사부기금액 (17,2). */
  tcstrnBkpngAmt: number
  /** 계약보증금 (17,2). */
  grnteAmt: number
  /** 지체상금률 (9,4). */
  lqdmgRt: number
  /** 담당자 정보 — 구분 + 부대/성명/계급(deptNm 포함 표시, slide141). */
  managers: { tkcgSecd: string; picNm: string }[]
  /** 상단 요약 — 뱃지(업무구분/계약방법/계약상태)·타이틀(계약건명)·행(해지해제일자/발주기관/계약금액). */
  taskSecd: string
  ctrtMthdCd: string
  ctrtStatNm?: string
  orderInstNm: string
  ctrtAmt: number
}

// ── TODO(백엔드 확정) ────────────────────────────────────────────────────────
// - 검색조건 mdfcnCtrtDmndrcofc(수정계약요청수신)·mdfcnRncd(수정계약사유): 설계서에 '항목 확인 불가.
//   항목명과 코드 전달'(slide18 4-2) — 코드 확정 시 검색필터 UI 추가.
// - ctrtPrgrsStcd/ctrtMthdCd/bidMthdCd 코드값: 목업은 표시명 문자열(공통코드 확정 시 코드+명 매핑 전환).
// - M03 상세: ctrdocTpNm(계약서유형 표시명)·acnutNo(계좌번호 분리)·CtrtRjctRsn.title/CtrtAdocFile.fileSize 등
//   표시 보조 필드는 설계서 항목표에 없는 파생 항목 — 백엔드 응답 확정 시 정리.
// - P11 품목정보: 납지별수량(dlvQty)·금액(itemAmt)은 설계서상 수량(ctrtQty)·계약금액(ctrtAmt)과 동일
//   항목명이라 충돌 회피용 임시 분리 키 — 응답 구조 확정 시 정리.
