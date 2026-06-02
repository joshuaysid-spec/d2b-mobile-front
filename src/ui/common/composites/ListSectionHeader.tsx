// Figma list section_top(9300-36835) 1:1.
// 목록 상단 바: "총 N건"(좌) + page size 컴팩트 텍스트 셀렉트("10개 ∨", 우).
// page size 는 m_select_text 스타일(보더 없는 텍스트+chevron) — SelectBox(보더 h-48)와 달라
//   raw/select 컨테이너 + base SelectBoxItem 재사용 + 컴팩트 트리거를 직접 구성.
//   (RadioButtonGroup/CheckboxGroup 처럼 composites 에서 raw 사용 — 승인된 패턴)
import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'

import { Icon } from '@/ui/common/base/Icon'
import { SelectBoxItem } from '@/ui/common/base/SelectBox'
import { Select, SelectContent, SelectGroup, SelectValue } from '@/ui/raw/select'
import { cn } from '@/utils/cn'

export interface ListSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 총 건수 — "총 {total}{unit}". */
  total: number
  /** 현재 page size. */
  pageSize: number
  /** 선택 가능한 page size 옵션. 기본 [10, 20, 50]. */
  pageSizeOptions?: number[]
  /** page size 변경 콜백. */
  onPageSizeChange: (size: number) => void
  /** 건수 단위. 기본 '건'. */
  unit?: string
}

const ListSectionHeader = React.forwardRef<HTMLDivElement, ListSectionHeaderProps>(
  (
    {
      className,
      total,
      pageSize,
      pageSizeOptions = [10, 20, 50],
      onPageSizeChange,
      unit = '건',
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        'flex min-h-[56px] w-full items-center justify-between gap-krds-5',
        className,
      )}
      {...props}
    >
      <span className="text-[17px] font-bold leading-normal text-krds-text-ink">
        총 {total.toLocaleString()}
        {unit}
      </span>

      <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
        <SelectPrimitive.Trigger
          aria-label="페이지당 건수"
          className={cn(
            'group flex shrink-0 items-center gap-krds-3 text-[17px] text-krds-text-ink outline-hidden',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
          )}
        >
          <SelectValue />
          <Icon
            name="ArrowForwardIos"
            size={20}
            className="shrink-0 rotate-90 transition-transform duration-200 group-data-[state=open]:rotate-[270deg]"
            aria-hidden
          />
        </SelectPrimitive.Trigger>
        <SelectContent className="rounded-krds-8 border-krds-border-field bg-background shadow-krds-2">
          <SelectGroup>
            {pageSizeOptions.map((n) => (
              <SelectBoxItem key={n} value={String(n)}>
                {n}개
              </SelectBoxItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
)
ListSectionHeader.displayName = 'ListSectionHeader'

export { ListSectionHeader }
