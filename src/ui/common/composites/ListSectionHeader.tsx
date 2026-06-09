// Figma list section_top(9300-36835) 1:1.
// 목록 상단 바: "총 N건"(좌) + page size 컴팩트 텍스트 셀렉트("10개 ∨", 우).
// page size 는 m_select_text 스타일(보더 없는 텍스트+chevron) — SelectBox(보더 h-48)와 달라
//   raw/select 컨테이너 + base SelectBoxItem 재사용 + 컴팩트 트리거를 직접 구성.
//   (RadioButtonGroup/CheckboxGroup 처럼 composites 에서 raw 사용 — 승인된 패턴)
import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cva, type VariantProps } from 'class-variance-authority'

import { Icon } from '@/ui/common/base/Icon'
import { SelectBoxItem } from '@/ui/common/base/SelectBox'
import { Select, SelectContent, SelectGroup, SelectValue } from '@/ui/raw/select'
import { cn } from '@/utils/cn'

// 두 가지 버전:
//   default    — 투명 배경(현행). 목록 인셋 영역에서 사용.
//   background  — 배경 바(Figma): bg #ECF1FA(krds-bg-primary-faint) + 상단 1px #D1D7E0(krds-border-divider)
//                + 고정 높이 56px + 좌측 텍스트 #0F316E(krds-text-primary-active)
const listSectionHeaderVariants = cva('flex w-full items-center justify-between gap-krds-5', {
  variants: {
    variant: {
      default: 'min-h-[56px]',
      background: 'h-[56px] border-t border-krds-border-divider bg-krds-bg-primary-faint px-4',
    },
  },
  defaultVariants: { variant: 'default' },
})

// 좌측 "총 N건" 텍스트 색 — 버전별로 다름.
const totalTextColor: Record<NonNullable<VariantProps<typeof listSectionHeaderVariants>['variant']>, string> = {
  default: 'text-krds-text-primary-active',
  background: 'text-krds-text-primary-active',
}

export interface ListSectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof listSectionHeaderVariants> {
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
      variant = 'default',
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(listSectionHeaderVariants({ variant }), className)}
      {...props}
    >
      <span
        className={cn(
          'text-[17px] font-bold leading-normal',
          totalTextColor[variant ?? 'default'],
        )}
      >
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
            name="ArrowDropDown"
            size={25}
            className="shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </SelectPrimitive.Trigger>
        {/* align="end": dropdown 우측 끝을 트리거(화살표) 우측에 맞춰 오른쪽 오버플로우 방지 */}
        <SelectContent
          align="end"
          className="rounded-krds-8 border-krds-border-field bg-background shadow-krds-2"
        >
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
