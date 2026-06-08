// 메인 홈 빠른조달검색(Figma 7077:85210). bg-primary-faint 박스.
// 구성: 로고(placeholder) + OR칩(공고명/G2B공고번호, 단일선택) + 검색필터 버튼 + 검색입력 + 검색버튼.
//
// OR칩 = 라디오 역할(둘 중 하나). 선택칩=파란 채움/흰글자, 미선택=흰bg/파란보더/파란글자.
// 검색필터 버튼: filterActive(설정값 있음)=파란 채움/흰 아이콘, 아니면 흰bg/파란보더/파란 아이콘 (설계서 rule 5).
// 검색입력 placeholder 는 선택칩에 따라 바뀐다(공고명/ G2B 공고번호).
//
// 데이터/동작은 페이지 소유 — 본 컴포넌트는 controlled(값+핸들러 주입).
import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'
import logoText from '@/assets/images/logoText.svg'
import filterMain from '@/assets/images/filterMain.svg'

/** 빠른검색 대상 — 공고명 | G2B 공고번호 (OR, 단일선택). */
export type SearchTarget = 'name' | 'g2bNo'

export interface QuickProcurementSearchProps {
  /** 현재 선택된 검색 대상. */
  target: SearchTarget
  onTargetChange: (t: SearchTarget) => void
  /** 검색어(controlled). */
  keyword: string
  onKeywordChange: (v: string) => void
  /** 검색 실행. */
  onSearch: () => void
  /** 검색필터 풀팝업 열기. */
  onOpenFilter: () => void
  /** 검색필터에 설정값이 있으면 true → 필터 아이콘 ON(파란 채움). */
  filterActive: boolean
}

const TARGETS: { value: SearchTarget; label: string; placeholder: string }[] = [
  { value: 'name', label: '공고명', placeholder: '공고명을 입력해주세요.' },
  { value: 'g2bNo', label: 'G2B 공고번호', placeholder: 'G2B 공고번호를 입력해주세요.' },
]

// OR칩 한 개 — 파일 내부 인라인.
function TargetChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border py-2 pl-3 pr-3.5',
        'text-[17px] font-bold leading-normal whitespace-nowrap',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
        selected
          ? 'border-krds-action-primary bg-krds-action-primary text-white'
          : 'border-krds-action-primary bg-white text-krds-action-primary',
      )}
    >
      <Icon name="Check" size={25} aria-hidden />
      {label}
    </button>
  )
}

const QuickProcurementSearch = ({
  target,
  onTargetChange,
  keyword,
  onKeywordChange,
  onSearch,
  onOpenFilter,
  filterActive,
}: QuickProcurementSearchProps) => {
  const placeholder =
    TARGETS.find((t) => t.value === target)?.placeholder ?? ''

  return (
    <section className="flex w-full flex-col items-center bg-krds-bg-primary-faint px-4 pb-6 pt-5">
      <div className="flex w-full max-w-[328px] flex-col items-center">
        {/* 로고 — 빠른조달검색 브랜드 이미지(logoText.svg) */}
        <img
          src={logoText}
          alt="빠른조달검색"
          className="my-2.5 h-auto w-[140px]"
        />

        {/* OR칩 + 검색필터 버튼 */}
        <div
          role="radiogroup"
          aria-label="검색 대상"
          className="flex w-full items-center justify-center gap-2.5 py-2.5"
        >
          {TARGETS.map((t) => (
            <TargetChip
              key={t.value}
              label={t.label}
              selected={target === t.value}
              onClick={() => onTargetChange(t.value)}
            />
          ))}

          {/* 검색필터 버튼 (42px) — 흰 배경 + filterMain.svg 아이콘 */}
          <button
            type="button"
            aria-label="검색필터"
            aria-pressed={filterActive}
            onClick={onOpenFilter}
            className={cn(
              'flex size-[42px] shrink-0 items-center justify-center rounded-full border border-krds-action-primary bg-white',
              'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
            )}
          >
            <img src={filterMain} alt="" aria-hidden className="size-5" />
          </button>
        </div>

        {/* 검색입력 — 3px 파란보더 pill */}
        <div className="flex w-full items-center rounded-full border-[3px] border-krds-action-primary bg-white py-3 pl-6 pr-3 drop-shadow-[0_10px_5px_rgba(23,43,77,0.1)]">
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch()
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            className="min-w-px flex-1 bg-transparent text-[22px] font-bold leading-snug text-krds-text-ink outline-hidden placeholder:text-krds-border-field"
          />
          <button
            type="button"
            aria-label="검색"
            onClick={onSearch}
            className="flex shrink-0 items-center justify-center rounded-full p-1.5 text-krds-action-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring"
          >
            <Icon name="Search" size={32} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  )
}
QuickProcurementSearch.displayName = 'QuickProcurementSearch'

export { QuickProcurementSearch }
