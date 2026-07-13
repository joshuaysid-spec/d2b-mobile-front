// MUI-CM-04-M01 일반공지사항(공지사항 목록). 설계서(00.공통 v0.83, slide217 "항목 설명 – 일반 공지사항")
// 의 항목명(영문)을 그대로 사용한다. 검색조건 = dm_searchInfo · 데이터영역 = dl_resultList.
import type { DateRangeValue } from '@/types/search-filter'

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
