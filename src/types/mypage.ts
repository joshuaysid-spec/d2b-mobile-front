// MUI-CM-06-M01 마이페이지(MyPage) 도메인 타입.
// 설계서(00.공통 slide75)의 "업무 캘린더" 데이터영역을 기준으로 정의한다.
//   - 캘린더에는 ① 관심(찜)한 입찰공고 ② 개인이 작성한 스케줄 을 합쳐 최대 3건 표시.
//   - 공고번호/공고명 항목명은 입찰(bd) 도메인 컨벤션(pbancNo/pbancNm)을 그대로 따른다
//     (설계서 MyPage 데이터영역에 별도 영문 항목명 표가 없어 도메인 표준 키 재사용).

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
