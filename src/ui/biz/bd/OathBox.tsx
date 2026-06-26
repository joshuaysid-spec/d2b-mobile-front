// 신청서 서약문 박스 (Figma 9300-43269). 입찰포기(P03)·입찰취소(P04)·입찰참가등록반려(P07) 공용.
// 디자인: bg #f5f9ff(krds-bg-blue-pastel) · radius 12 · padding 16 · gap 8 · 가운데 정렬,
//   텍스트 17px Bold · #425679(krds-text-info, 슬레이트). 1행 문구만 화면별로 다르고 날짜/귀하 행은 공통.
// 도메인 전용 조립물 — statement(서약 문구)만 주입받는다.

export interface OathBoxProps {
  /** 서약 문구(1행) — 화면별로 다름(포기합니다 / 취소하오니 무효 처리…). */
  statement: string
}

export function OathBox({ statement }: OathBoxProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-krds-5 rounded-[12px] bg-krds-bg-blue-pastel p-krds-8 text-center">
      <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">{statement}</p>
      <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">0000 년 00 월 00 일</p>
      <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">000000 재무관 귀하</p>
    </div>
  )
}
OathBox.displayName = 'OathBox'
