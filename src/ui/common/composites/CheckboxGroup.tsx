// Figma "checkbox group container"(9300-27895) 1:1.
// RadioButtonGroup 의 다중 선택(체크박스) 버전 — RadioGroup 같은 radix 그룹 프리미티브가
// 체크박스엔 없으므로, 선택값 배열 상태를 직접 관리하고 base Checkbox 칩을 나열한다.
// direction: horizontal(기본) | vertical.
// swipeable(기본 false): horizontal 일 때 wrap 대신 가로 스크롤 + 좌우 스와이프 화살표
//   (Figma m_button_arrow_swiper) 노출. 스크롤 위치에 따라 화살표/그라데이션이 자동 토글.
import * as React from 'react'

import { Checkbox } from '@/ui/common/base/Checkbox'
import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface CheckboxGroupItem {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export interface CheckboxGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** 체크박스 항목 목록 */
  items: CheckboxGroupItem[]
  /** 선택된 값 배열 (controlled) */
  value?: string[]
  /** 초기 선택 값 배열 (uncontrolled) */
  defaultValue?: string[]
  /** 선택 변경 콜백 */
  onValueChange?: (value: string[]) => void
  /** 'horizontal' — 가로(기본) · 'vertical' — 세로 스택 */
  direction?: 'horizontal' | 'vertical'
  /** horizontal 일 때 wrap 대신 가로 스크롤 + 좌우 화살표 노출. 기본 false. */
  swipeable?: boolean
  /** 그룹 전체 비활성 */
  disabled?: boolean
  /** 각 Checkbox 칩에 적용할 className */
  itemClassName?: string
}

/** Figma m_button_arrow_swiper — 40px 원형 화살표 + 그라데이션 페이드 */
function ArrowSwiper({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const button = (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      onClick={onClick}
      className="pointer-events-auto flex size-10 shrink-0 items-center justify-center rounded-full border border-krds-border-field bg-background"
    >
      <Icon
        name={side === 'left' ? 'ArrowBackIosNew' : 'ArrowForwardIos'}
        size={20}
        className="text-krds-text-primary"
        aria-hidden
      />
    </button>
  )
  const gradient = (
    <div
      className={cn(
        'h-full w-5 shrink-0',
        side === 'left'
          ? 'bg-gradient-to-r from-background to-transparent'
          : 'bg-gradient-to-r from-transparent to-background',
      )}
    />
  )
  return (
    <div
      className={cn(
        // 컨테이너는 클릭 통과(pointer-events-none) — 버튼만 auto 로 받음
        'pointer-events-none absolute top-1/2 flex h-12 -translate-y-1/2 items-center',
        side === 'left' ? 'left-0' : 'right-0',
      )}
    >
      {side === 'left' ? (
        <>
          <span className="flex h-full items-center bg-background">{button}</span>
          {gradient}
        </>
      ) : (
        <>
          {gradient}
          <span className="flex h-full items-center bg-background">{button}</span>
        </>
      )}
    </div>
  )
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      className,
      items,
      value,
      defaultValue,
      onValueChange,
      direction = 'horizontal',
      swipeable = false,
      disabled,
      itemClassName,
      ...props
    },
    ref,
  ) => {
    // controlled / uncontrolled 선택 상태
    const [internal, setInternal] = React.useState<string[]>(defaultValue ?? [])
    const isControlled = value !== undefined
    const selected = isControlled ? value : internal

    const toggle = React.useCallback(
      (itemValue: string, checked: boolean) => {
        const next = checked ? [...selected, itemValue] : selected.filter((v) => v !== itemValue)
        if (!isControlled) setInternal(next)
        onValueChange?.(next)
      },
      [selected, isControlled, onValueChange],
    )

    // ── 스와이프(가로 스크롤) 상태 ────────────────────────────────
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const [canLeft, setCanLeft] = React.useState(false)
    const [canRight, setCanRight] = React.useState(false)
    const useSwiper = swipeable && direction === 'horizontal'

    const updateArrows = React.useCallback(() => {
      const el = scrollRef.current
      if (!el) return
      setCanLeft(el.scrollLeft > 1)
      setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
    }, [])

    React.useEffect(() => {
      if (!useSwiper) return
      const el = scrollRef.current
      if (!el) return
      updateArrows()
      const ro = new ResizeObserver(updateArrows)
      ro.observe(el)
      return () => ro.disconnect()
    }, [useSwiper, updateArrows, items])

    const scrollBy = (dir: 'left' | 'right') => {
      const el = scrollRef.current
      if (!el) return
      el.scrollBy({ left: (dir === 'left' ? -1 : 1) * el.clientWidth * 0.8, behavior: 'smooth' })
    }

    const chips = items.map(({ value: v, label, disabled: itemDisabled }) => (
      <Checkbox
        key={v}
        value={v}
        label={label}
        checked={selected.includes(v)}
        disabled={disabled || itemDisabled}
        onCheckedChange={(c) => toggle(v, c === true)}
        className={cn(
          useSwiper ? 'shrink-0' : direction === 'horizontal' && 'flex-1',
          itemClassName,
        )}
      />
    ))

    // 세로 스택
    if (direction === 'vertical') {
      return (
        <div ref={ref} className={cn('flex flex-col gap-2 [&>label]:w-full', className)} {...props}>
          {chips}
        </div>
      )
    }

    // 가로 + 스와이프
    if (useSwiper) {
      return (
        <div ref={ref} className={cn('relative', className)} {...props}>
          <div
            ref={scrollRef}
            onScroll={updateArrows}
            // 스크롤바 숨김 — globals.css 의 전역 스크롤바(* {…})는 unlayered 라 Tailwind 유틸 클래스
            // ([scrollbar-width:none])로는 못 이김. 인라인 style(scrollbarWidth)은 이긴다(TabList/SummaryInfo 동일 패턴).
            className="flex items-center gap-2 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            {chips}
          </div>
          {canLeft && <ArrowSwiper side="left" onClick={() => scrollBy('left')} />}
          {canRight && <ArrowSwiper side="right" onClick={() => scrollBy('right')} />}
        </div>
      )
    }

    // 가로 wrap (기본)
    return (
      <div ref={ref} className={cn('flex flex-wrap gap-2', className)} {...props}>
        {chips}
      </div>
    )
  },
)
CheckboxGroup.displayName = 'CheckboxGroup'

export { CheckboxGroup }
