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

// 우측 셀렉트 트리거 두 가지 — row variant 와 독립.
//   text  — 보더 없는 컴팩트 텍스트("10개 ∨", 현행). 목록 인셋 영역.
//   box   — 네이비 보더 pill(Figma m_select_text 9304-77809): border/text #0F316E(krds-text-primary-active)
//           + rounded-8 + h34. 리스트 화면(정렬/페이지 셀렉트)에서 사용.
//   ※ 드롭다운(SelectBoxItem)은 선택 항목 파란 배경/텍스트가 이미 적용돼 9304-77890 과 일치 — 공통.
const selectTriggerVariants = cva(
  cn(
    'group flex shrink-0 items-center outline-hidden',
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
  ),
  {
    variants: {
      selectVariant: {
        text: 'gap-krds-3 text-[17px] text-krds-text-ink',
        box: 'h-[34px] gap-krds-2 rounded-krds-8 border border-krds-text-primary-active px-krds-5 text-[17px] text-krds-text-primary-active',
      },
    },
    defaultVariants: { selectVariant: 'text' },
  },
)

// 좌측 "총 N건" 텍스트 색 — 버전별로 다름.
const totalTextColor: Record<NonNullable<VariantProps<typeof listSectionHeaderVariants>['variant']>, string> = {
  default: 'text-krds-text-primary-active',
  background: 'text-krds-text-primary-active',
}

export interface ListSectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof listSectionHeaderVariants> {
  /** 총 건수 — "총 {total}{unit}". leftSlot 주입 시 생략 가능. */
  total?: number
  /**
   * 좌측 영역 커스텀 노드 — 주입 시 "총 N건" 대신 렌더(같은 Figma list section_top 변형).
   * 예: 관심입찰공고(MUI-CM-06-M05)는 좌측이 검색필터 버튼.
   */
  leftSlot?: React.ReactNode
  /** 현재 page size. 정렬 모드(sortOptions 주입) 시 생략 가능. */
  pageSize?: number
  /** 선택 가능한 page size 옵션. 기본 [10, 20, 50]. */
  pageSizeOptions?: number[]
  /** page size 변경 콜백. 정렬 모드 시 생략 가능. */
  onPageSizeChange?: (size: number) => void
  /**
   * 정렬 옵션 — 주입 시 우측 셀렉트가 pageSize 대신 **정렬 셀렉트**로 렌더된다(예: 최신순/과거순).
   * pageSize 관련 props 는 무시(정렬 모드). 미주입 시 기존 pageSize 동작 100% 유지(backward-compatible).
   */
  sortOptions?: { value: string; label: string }[]
  /** 현재 정렬 값(sortOptions 의 value). 정렬 모드에서만. */
  sortValue?: string
  /** 정렬 변경 콜백. 정렬 모드에서만. */
  onSortChange?: (value: string) => void
  /** 건수 단위. 기본 '건'. */
  unit?: string
  /** 우측 셀렉트 트리거 디자인. 'text'(기본·보더 없는 텍스트) · 'box'(네이비 보더 pill, 리스트 화면용). */
  selectVariant?: 'text' | 'box'
}

const ListSectionHeader = React.forwardRef<HTMLDivElement, ListSectionHeaderProps>(
  (
    {
      className,
      total,
      leftSlot,
      pageSize,
      pageSizeOptions = [10, 20, 50],
      onPageSizeChange,
      sortOptions,
      sortValue,
      onSortChange,
      unit = '건',
      variant = 'default',
      selectVariant = 'text',
      ...props
    },
    ref,
  ) => {
    // 정렬 모드 — sortOptions 주입 시 우측 셀렉트가 정렬(최신순/과거순 등), 아니면 기존 pageSize.
    const sortMode = !!sortOptions && sortOptions.length > 0
    return (
    <div
      ref={ref}
      className={cn(listSectionHeaderVariants({ variant }), className)}
      {...props}
    >
      {/* 좌측 — leftSlot 우선(검색필터 버튼 등). 없으면 "총 N건". */}
      {leftSlot ?? (
        <span
          className={cn(
            'text-[17px] font-bold leading-normal',
            totalTextColor[variant ?? 'default'],
          )}
        >
          총 {(total ?? 0).toLocaleString()}
          {unit}
        </span>
      )}

      {/* 우측 셀렉트 — 정렬 모드(sortOptions)면 정렬 셀렉트, 아니면 기존 pageSize 셀렉트. 트리거 스타일 공통. */}
      {sortMode ? (
        <Select value={sortValue} onValueChange={(v) => onSortChange?.(v)}>
          <SelectPrimitive.Trigger
            aria-label="정렬"
            className={cn(selectTriggerVariants({ selectVariant }))}
          >
            <SelectValue />
            <Icon
              name="ArrowDropDown"
              size={selectVariant === 'box' ? 20 : 25}
              className="shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </SelectPrimitive.Trigger>
          <SelectContent
            align="end"
            className="rounded-krds-8 border-krds-border-field bg-background shadow-krds-2"
          >
            <SelectGroup>
              {sortOptions!.map((o) => (
                <SelectBoxItem key={o.value} value={o.value}>
                  {o.label}
                </SelectBoxItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <Select
          value={pageSize != null ? String(pageSize) : undefined}
          onValueChange={(v) => onPageSizeChange?.(Number(v))}
        >
          <SelectPrimitive.Trigger
            aria-label="페이지당 건수"
            className={cn(selectTriggerVariants({ selectVariant }))}
          >
            <SelectValue />
            <Icon
              name="ArrowDropDown"
              size={selectVariant === 'box' ? 20 : 25}
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
      )}
    </div>
    )
  },
)
ListSectionHeader.displayName = 'ListSectionHeader'

export { ListSectionHeader }
