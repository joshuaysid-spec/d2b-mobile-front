// Figma 검색조건 search area(9300-36826) 1:1.
// 목록 페이지 상단의 "빠른 검색" 영역. 도메인 무관 — props/콜백으로 동작.
// 구성(세로):
//   1) 검색대상 체크칩(CheckboxGroup, 다중) + 우측 필터 아이콘 버튼(→ 풀팝업 open)
//   2) 검색어 InputBox
//   3) 검색 Button(primary, full-width, Search 아이콘)
// 상세 필터(풀팝업)는 onFilterClick 으로 위임 — 이 컴포넌트는 모름.
import * as React from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { CheckboxGroup } from '@/ui/common/composites/CheckboxGroup'
import { cn } from '@/utils/cn'

export interface SearchConditionProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  /** 검색대상 칩 목록 (예: 조달명/판단번호). */
  targets: { value: string; label: React.ReactNode }[]
  /** 선택된 검색대상 값. */
  selectedTargets: string[]
  onTargetsChange: (value: string[]) => void
  /** 검색어. */
  keyword: string
  onKeywordChange: (value: string) => void
  /** 필터 아이콘 클릭 → 상세 필터 풀팝업 open(소비자 위임). */
  onFilterClick: () => void
  /** 필터 버튼 활성(on) 상태 — 필터가 적용 중임을 강조. 기본 false(off). */
  filterActive?: boolean
  /** 검색 버튼 클릭. */
  onSearch: () => void
  /** 검색어 placeholder. 기본 '내용을 입력하세요.'. */
  placeholder?: string
  /** 검색어 입력 후 Enter 검색 여부. 기본 true. */
  searchOnEnter?: boolean
}

const SearchCondition = React.forwardRef<HTMLDivElement, SearchConditionProps>(
  (
    {
      className,
      targets,
      selectedTargets,
      onTargetsChange,
      keyword,
      onKeywordChange,
      onFilterClick,
      filterActive = false,
      onSearch,
      placeholder = '내용을 입력하세요.',
      searchOnEnter = true,
      ...props
    },
    ref,
  ) => (
    <div ref={ref} className={cn('flex w-full flex-col gap-krds-7', className)} {...props}>
      {/* 1) 검색대상 칩 + 필터 버튼 */}
      <div className="flex items-center gap-krds-5">
        <CheckboxGroup
          className="min-w-px flex-1"
          itemClassName="flex-none"
          items={targets}
          value={selectedTargets}
          onValueChange={onTargetsChange}
          single={true}
        />
        <button
          type="button"
          aria-label="상세 검색 필터"
          aria-pressed={filterActive}
          onClick={onFilterClick}
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-primary text-krds-text-primary',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
            // on/off 동일 — 흰 배경 + 1px primary 보더(위 border). on 의 inset shadow 는
            // 흰 배경 전환 후 보더가 2px 로 보이는 문제가 있어 제거(aria-pressed 로 상태만 노출).
            'bg-background',
          )}
        >
          <Icon name="Tune" size={24} aria-hidden />
        </button>
      </div>

      {/* 2) 검색어 */}
      <InputBox
        value={keyword}
        placeholder={placeholder}
        onChange={(e) => onKeywordChange(e.target.value)}
        onClear={() => onKeywordChange('')}
        onKeyDown={(e) => {
          if (searchOnEnter && e.key === 'Enter') onSearch()
        }}
      />

      {/* 3) 검색 버튼 */}
      <Button variant="primary" className="w-full" onClick={onSearch}>
        <Icon name="Search" size={20} aria-hidden />
        검색
      </Button>
    </div>
  ),
)
SearchCondition.displayName = 'SearchCondition'

export { SearchCondition }
