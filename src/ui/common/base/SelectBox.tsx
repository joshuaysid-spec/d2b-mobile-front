// raw/select 비중 최대화 원칙으로 구성한다.
//
// [raw/select 에서 그대로 import 해 쓰는 부분]
//   Select(Root) · SelectContent · SelectGroup · SelectValue
//   → 구조에 고정 자식이 없어(또는 children 슬롯이라) KRDS className 만 입히면 그대로 재사용 가능.
//   특히 SelectContent 는 raw 안에서 Portal/Viewport/ScrollUp·DownButton 까지 모두 감싸주므로
//   드롭다운 컨테이너 구현을 raw 에 위임한다.
//
// [@radix-ui/react-select 직접 유지 — raw 로 대체 불가한 2곳]
//   1) Trigger: raw/select 의 SelectTrigger 는 {children} 뒤에 lucide ChevronDown 을
//      "고정 자식"으로 박아두어, Figma 칩 트리거(자체 ArrowForwardIos 아이콘 + 회전 애니메이션 +
//      flex-1 truncate 텍스트 래퍼) 구조로 바꿀 수 없다. → SelectPrimitive.Trigger 직접 사용.
//   2) Item: raw/select 의 SelectItem 은 좌측에 체크마크 ItemIndicator span(pl-8)을
//      "고정 구조"로 포함한다. KRDS 디자인은 체크 인디케이터 없이 배경/볼드로 선택을 표현하므로
//      className 만으로 제거 불가. → SelectPrimitive.Item + ItemText 직접 사용.
import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'

import { Icon } from '@/ui/common/base/Icon'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectValue,
} from '@/ui/raw/select'
import { cn } from '@/utils/cn'

export interface SelectBoxItem {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export interface SelectBoxProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  placeholder?: string
  error?: boolean
  items: SelectBoxItem[]
}

interface SelectBoxTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  error?: boolean
}

const SelectBoxTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectBoxTriggerProps
>(({ className, children, error = false, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'group flex h-12 w-full items-center gap-krds-3 rounded-krds-8 border px-krds-6',
      'text-krds-body-md text-krds-text-ink transition-colors',
      'focus:outline-hidden focus-visible:outline-hidden',
      'data-placeholder:text-krds-text-disabled',
      !error && [
        'border-krds-border-field bg-background',
        'data-[state=open]:border-2 data-[state=open]:border-primary',
      ],
      error && [
        'border-krds-border-danger bg-krds-bg-danger-subtle',
        'data-[state=open]:border-2 data-[state=open]:border-krds-border-danger',
      ],
      'disabled:cursor-not-allowed disabled:border-krds-border-disabled',
      'disabled:bg-krds-bg-disabled-soft disabled:text-krds-text-disabled',
      className,
    )}
    {...props}
  >
    <span className="flex-1 truncate text-left">{children}</span>
    <Icon
      name="ArrowForwardIos"
      size={20}
      className={cn(
        // arrow_forward_ios(›) 를 90° 회전해 아래(⌄) → 열림 시 위(⌃). 화살표 아이콘 통일.
        'shrink-0 rotate-90 transition-transform duration-200',
        'group-data-[state=open]:rotate-[270deg]',
      )}
      aria-hidden
    />
  </SelectPrimitive.Trigger>
))
SelectBoxTrigger.displayName = 'SelectBoxTrigger'

const SelectBoxItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'flex h-10 w-full cursor-default select-none items-center',
      'rounded-krds-sm px-krds-6 text-krds-body-md text-krds-text-ink outline-hidden',
      'data-highlighted:bg-krds-bg-primary-subtle',
      'data-[state=checked]:bg-krds-bg-primary-subtle data-[state=checked]:font-bold data-[state=checked]:text-krds-text-primary',
      'data-disabled:pointer-events-none data-disabled:bg-krds-bg-disabled-soft data-disabled:text-krds-text-disabled',
      className,
    )}
    {...props}
  >
    {/* 긴 옵션명은 한 줄 말줄임 — 드롭다운 폭(트리거 폭)을 넘지 않게(SelectContent max-w 와 세트). */}
    <SelectPrimitive.ItemText className="block min-w-0 flex-1 truncate">
      {children}
    </SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectBoxItem.displayName = 'SelectBoxItem'

function SelectBox({
  placeholder = '선택하세요.',
  error = false,
  items,
  ...props
}: SelectBoxProps) {
  return (
    <Select {...props}>
      <SelectBoxTrigger error={error}>
        <SelectValue placeholder={placeholder} />
      </SelectBoxTrigger>
      <SelectContent
        className={cn(
          'rounded-krds-8 border-krds-border-field bg-background shadow-krds-2',
          // 드롭다운 폭 = 트리거 폭 고정(raw viewport 는 min-w 만 지정) — 긴 옵션이 화면을 넘지 않게.
          'max-w-(--radix-select-trigger-width)',
        )}
      >
        <SelectGroup>
          {items.map(({ value, label, disabled }) => (
            <SelectBoxItem key={value} value={value} disabled={disabled}>
              {label}
            </SelectBoxItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
SelectBox.displayName = 'SelectBox'

export { SelectBox, SelectBoxTrigger, SelectBoxItem }
