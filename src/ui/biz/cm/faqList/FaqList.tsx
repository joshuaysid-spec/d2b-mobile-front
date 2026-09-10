// 자주묻는질문 목록(MUI-CM-04-M03) — Figma 10020-87532(m_accordian) 행 레이아웃.
// 질문 클릭 시 상세(FaqDtlPage)로 이동 — 공지사항 목록→상세와 동일 프로세스(2026-09-10 사용자 요청, 구 아코디언 펼침 폐기).
// 기존 공통 CardList 는 카드형이라 FAQ 행(순번 + 구분 배지 / 질문 + 화살표) 레이아웃과 달라 FAQ 전용 행으로 조립.
import { Badge } from '@/ui/common/base/Badge'
import { Icon } from '@/ui/common/base/Icon'
import { SectionDivider } from '@/ui/common/base/SectionDivider'

/** 목록 1건 뷰 데이터 — 페이지가 목업/도메인 아이템에서 매핑해 주입. */
export interface FaqItemView {
  /** 고유 id(bbsId) — key. */
  id: string
  /** 순번(no) — 질문 앞 넘버링(설계서 slide242). */
  no: number
  /** 구분(bizFldCd) 배지 라벨. */
  category: string
  /** 질문(qstnTtl) — 말줄임 없이 전체 표시. */
  question: string
  /** 행 클릭(상세 이동). */
  onClick: () => void
}

export interface FaqListProps {
  items: FaqItemView[]
  /** 빈 목록 문구. */
  emptyText?: React.ReactNode
}

function FaqList({ items, emptyText = '자주묻는 질문이 없습니다.' }: FaqListProps) {
  if (items.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-krds-8 py-10 text-center">
        <Icon name="Error" size={34} className="text-[#C1D1EE]" aria-hidden />
        <p className="text-krds-body-md text-krds-text-subtle">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col">
      {items.map((it) => (
        <div key={it.id} className="flex w-full flex-col">
          <SectionDivider />
          {/* 질문 행 — 클릭 시 상세 이동. 순번(넘버링) + 구분 배지 + 질문(말줄임 없음) + 이동 화살표. */}
          <button
            type="button"
            onClick={it.onClick}
            className="flex w-full items-center gap-krds-8 bg-background px-4 py-4 text-left focus-visible:outline-hidden active:opacity-70"
          >
            <div className="flex min-w-px flex-1 flex-col gap-krds-3">
              <div className="flex flex-wrap items-center gap-krds-5">
                <span className="text-[17px] font-bold leading-normal text-krds-text-primary">
                  {it.no}
                </span>
                <Badge type="pastel" color="blue">
                  {it.category}
                </Badge>
              </div>
              <span className="text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                {it.question}
              </span>
            </div>
            <Icon name="ChevronRight" size={20} aria-hidden className="shrink-0" />
          </button>
        </div>
      ))}
    </div>
  )
}
FaqList.displayName = 'FaqList'

export { FaqList }
