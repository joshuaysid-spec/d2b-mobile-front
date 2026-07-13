// MUI-CM-04-M03 자주묻는질문(FAQ). 설계서 00.공통 v0.83 slide233 항목명(영문) 준수.
// 상세 화면이 별도로 없고 목록에서 아코디언으로 답변을 펼친다(질문=qstnTtl, 답변=contsCn).

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
