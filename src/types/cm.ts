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
