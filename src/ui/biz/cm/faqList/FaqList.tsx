// 자주묻는질문 아코디언(MUI-CM-04-M03) — Figma 10020-87532(m_accordian).
// 질문 클릭 시 답변을 펼친다. 다중 열림(다른 질문을 눌러도 이전 답변은 닫히지 않음, 설계서 slide232).
// 기존 공통 AccordionSection 은 타이틀 고정높이/말줄임/화살표가 달라 맞지 않아, FAQ 전용 disclosure 로 조립
//   (aria-expanded/aria-controls 로 접근성 유지). 질문/답변 = Q/A 배지 + 구분 배지.
import { Badge } from '@/ui/common/base/Badge'
import { Icon } from '@/ui/common/base/Icon'
import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { cn } from '@/utils/cn'

/** 아코디언 1건 뷰 데이터 — 페이지가 목업/도메인 아이템에서 매핑해 주입. */
export interface FaqItemView {
  /** 고유 id(bbsId) — key·aria-controls. */
  id: string
  /** 구분(bizFldCd) 배지 라벨. */
  category: string
  /** 질문(qstnTtl) — 말줄임 없이 전체 표시. */
  question: string
  /** 답변(contsCn) — 펼침 시 표시. */
  answer: string
}

export interface FaqListProps {
  items: FaqItemView[]
  /** 열린 질문 id 집합(다중 열림). */
  openIds: Set<string>
  /** 질문 토글. */
  onToggle: (id: string) => void
  /** 빈 목록 문구. */
  emptyText?: React.ReactNode
}

function FaqList({ items, openIds, onToggle, emptyText = '자주묻는 질문이 없습니다.' }: FaqListProps) {
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
      {items.map((it) => {
        const open = openIds.has(it.id)
        return (
          <div key={it.id} className="flex w-full flex-col">
            <SectionDivider />
            {/* 질문 — 클릭 시 답변 토글. Q 배지 + 구분 배지 + 질문(말줄임 없음). */}
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`faq-answer-${it.id}`}
              onClick={() => onToggle(it.id)}
              className="flex w-full items-center gap-krds-8 bg-background px-4 py-4 text-left focus-visible:outline-hidden"
            >
              <div className="flex min-w-px flex-1 flex-col gap-krds-3">
                <div className="flex flex-wrap items-center gap-krds-5">
                  <Badge type="pastel" color="blue">
                    Q
                  </Badge>
                  <Badge type="pastel" color="blue">
                    {it.category}
                  </Badge>
                </div>
                <span className="text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                  {it.question}
                </span>
              </div>
              <Icon
                name="ExpandMore"
                size={20}
                aria-hidden
                className={cn('shrink-0 transition-transform duration-200', open && 'rotate-180')}
              />
            </button>
            {/* 답변 — 펼침 시. A 배지 + 답변 내용(여러 줄 그대로). */}
            {open && (
              <div
                id={`faq-answer-${it.id}`}
                role="region"
                className="flex w-full flex-col items-start gap-krds-5 bg-krds-bg-primary-faint px-4 py-krds-6"
              >
                <Badge type="pastel" color="blue" className="size-[27px] shrink-0 p-0">
                  A
                </Badge>
                <p className="w-full whitespace-pre-wrap text-[17px] leading-normal text-krds-text-ink wrap-break-word">
                  {it.answer}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
FaqList.displayName = 'FaqList'

export { FaqList }
