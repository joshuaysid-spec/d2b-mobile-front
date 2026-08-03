// 대금청구/사후(WM) 도메인 타입 — 설계서 05.대금청구및사후-모바일 v0.83 항목설명(항목명 영문) 그대로.
// 화면별 섹션 주석으로 구분(도메인당 1파일 원칙 — CLAUDE.md "타입 정의").

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M01 대금청구통합목록 (slide16~21) — pymtClmIntgList/PymtClmIntgListPage
// ────────────────────────────────────────────────────────────────────────────

/** 대금청구통합목록 검색조건 (dmt_PymtClmIntgSrch, slide20 1.1) — 서버 필터 전환 시 사용. */
export interface PymtClmIntgListRequest {
  /** 계약시작일자 (ctrtBgngYmd, 8). */
  ctrtBgngYmd?: string
  /** 계약종료일자 (ctrtEndYmd, 8). */
  ctrtEndYmd?: string
  /** 계약번호 (ctrtNo, 11) — 계약번호검색 공통팝업(P79). */
  ctrtNo?: string
  /** 계약명 (ctrtNm, 300). */
  ctrtNm?: string
  /** 업무구분 (taskSeCd, 1) — 물품/용역/공사/국외. */
  taskSeCd?: string
}

/** 대금청구목록 1건 (dlt_pymtClmList, slide20 1.2 — 0701 개정 업체명/입찰방법/계약종류/계약일자 포함). */
export interface PymtClmListItem {
  /** 목록 key 용 고유 식별자 — `${ctrtNo}-${ctrtCycl}` (클라 생성, 배열 인덱스 key 금지). */
  id: string
  /** 번호 (no) — 그리드 rownum. */
  no: number
  /** 업무구분 (taskSeCd, 1) — 물품/용역/공사/국외. 카드 뱃지. */
  taskSeCd: string
  /** 계약번호 (ctrtNo, 11). */
  ctrtNo: string
  /** 계약번호차수 — 카드 계약번호+회차 표기(slide16 4-2). ⚠️ dlt 미정의 — CT 항목명(ctrtCycl) 재사용. */
  ctrtCycl: string
  /** 계약명 (ctrtNm, 300). */
  ctrtNm: string
  /** 업체명 (bzentyNm, 100). */
  bzentyNm: string
  /** 입찰방법 (bidMthdNm, 상위코드 BDTC) — 총액제/단가제 뱃지. */
  bidMthdNm: string
  /** 계약종류 (jntCtrtCdNm) — 하도급/공동계약/주계약. */
  jntCtrtCdNm: string
  /** 계약일자 (ctrtYmd, 8). */
  ctrtYmd: string
  /** 계약금액 (ctrtAmt, 17). */
  ctrtAmt: number
  /** 계약방법 표시레이블(일반경쟁~역경매, slide16 4-1) — ⚠️ dlt 미정의, CT 항목명(ctrtMthdCd) 재사용. */
  ctrtMthdCd: string
  /** 발주기관 — 카드 행 표시항목(slide16 목업). ⚠️ dlt 미정의 — CT 항목명(orderInstNm) 재사용. */
  orderInstNm: string
  /**
   * 진행중 대금청구 보유 여부 — 카드 클릭 시 P13 신청목록 시트/토스트 분기(slide17).
   * ⚠️ 설계서 분기 조건 항목 미정의(BD 선례 임시 키) — 상세설계 확정 시 교체.
   */
  pymtClmExstYn: 'Y' | 'N'
}

export interface PymtClmIntgListResult {
  list: PymtClmListItem[]
  total: number
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-P13 대금청구신청목록 (slide19~21) — pymtClmIntgList/PymtClmIntgAplyList (바텀시트 콘텐츠)
// ────────────────────────────────────────────────────────────────────────────

/**
 * 대금청구 신청 1건 — ⚠️ 설계서 항목설명(dlt_pymtClmAplyList, slide20 1.3)이 목록(1.2)과 동일 내용으로
 * 복사돼 있어 화면 목업(slide19: 청구번호/청구서종류/청구금액/확정구분/세액여부/작성일자/청구일자/진행상태)
 * 기준 임시 항목명으로 정의(BD 선례) — 상세설계 확정 시 대조.
 */
export interface PymtClmAplyItem {
  /** 목록 key/상세 라우팅용 고유 식별자 — `${clmNo}-${clmOdr}` (클라 생성). */
  id: string
  /** 번호 (no). */
  no: number
  /** 청구번호 (clmNo, 임시) — 예: 12315. */
  clmNo: string
  /** 청구차수 (clmOdr, 임시) — 카드 표기 `청구번호 12315 - 42`. */
  clmOdr: string
  /**
   * 청구서 종류명 (clmDocNm, 임시) — 선금신청서/착중도금신청서/대금청구서/사후정산청구서.
   * 카드 제목 + 상세 화면 분기(M02/M03/M05~M08/M13, slide21 이벤트) 구동.
   */
  clmDocNm: string
  /** 청구금액 (clmAmt, 임시). */
  clmAmt: number
  /** 확정구분 (cnfmSeNm, 임시) — 미확정 시 '-'. */
  cnfmSeNm: string
  /** 세액여부(세액) (txamt, 임시) — 금액 표시. */
  txamt: number
  /** 작성일자 (wrtYmd, 임시). */
  wrtYmd: string
  /** 청구일자 (clmYmd, 임시). */
  clmYmd: string
  /** 진행상태 (prgrsStNm, 임시) — 진행중/진행완료 뱃지. */
  prgrsStNm: string
  /** 업무구분 (taskSeCd) — 상세 분기 보조(중앙/부대/공사/기성 구분은 상세설계 확정 시). */
  taskSeCd: string
}
