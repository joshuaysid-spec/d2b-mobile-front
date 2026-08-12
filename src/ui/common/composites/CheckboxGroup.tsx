// Figma "checkbox group container"(9300-27895) 1:1.
// RadioButtonGroup 의 다중 선택(체크박스) 버전 — RadioGroup 같은 radix 그룹 프리미티브가
// 체크박스엔 없으므로, 선택값 배열 상태를 직접 관리하고 base Checkbox 칩을 나열한다.
// direction: horizontal(기본) | vertical.
// swipeable(기본 false): horizontal 일 때 wrap 대신 가로 스크롤 + 좌우 스와이프 화살표
//   (Figma m_button_arrow_swiper) 노출. 스크롤 위치에 따라 화살표/그라데이션이 자동 토글.
import * as React from 'react'

import { Checkbox } from '@/ui/common/base/Checkbox'
import { Icon } from '@/ui/common/base/Icon'
import { useScrollSelectedIntoView } from '@/hooks/useScrollSelectedIntoView'
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
  /**
   * 라디오처럼 한 번에 하나만 선택. 다른 항목을 체크하면 기존 선택이 자동 해제된다.
   * (모양은 체크박스 그대로 — 선택된 항목을 다시 누르면 해제되어 선택 없음 상태 가능)
   * `selectAll` 과 함께 쓰면 '전체' 의미가 없으므로 selectAll 은 무시된다.
   */
  single?: boolean
  /** 그룹 전체 비활성 */
disabled?: boolean
  /** 각 Checkbox 칩에 적용할 className */
  itemClassName?: string
  /**
   * 상단 '전체' 선택 체크박스 노출. true 또는 { label, disabled, value } 객체.
   * - 체크 → 모든(비활성 제외) 항목 선택 / 해제 → 모두 해제
   * - 개별 항목이 모두 선택되면 '전체'가 자동 체크, 하나라도 빠지면 자동 해제(파생 상태)
   * - disabled: '전체' 칩만 비활성(개별 항목 disabled 와 별개). 선택 가능 항목이 하나뿐이라
   *   '전체' 조작이 무의미할 때 등.
   * - value: '전체' 자체의 코드값(예: 공통코드 '0'). 지정 시 전체 선택 상태면 onValueChange 배열에
   *   이 값도 포함된다(개별 조작으로 전부 채워져도 자동 포함, 하나라도 빠지면 자동 제거).
   *   items 에 이 값을 넣지 말 것 — '전체' 칩이 그 항목이다.
   */
  selectAll?: boolean | { label?: React.ReactNode; disabled?: boolean; value?: string }
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
      single = false,
      disabled,
      itemClassName,
      selectAll,
      ...props
    },
    ref,
  ) => {
    // controlled / uncontrolled 선택 상태
    const [internal, setInternal] = React.useState<string[]>(defaultValue ?? [])
    const isControlled = value !== undefined
    const selected = isControlled ? value : internal

    const commit = React.useCallback(
      (next: string[]) => {
        if (!isControlled) setInternal(next)
        onValueChange?.(next)
      },
      [isControlled, onValueChange],
    )

    // ── '전체' 선택 ──────────────────────────────────────────────
    // 토글 대상 = 비활성 제외 항목 값. '전체' 체크 여부는 별도 상태 없이 selected 에서 파생한다
    // (모두 선택 → 체크 / 하나라도 빠지면 해제). 개별 변경에도 자동으로 일관 유지.
    const allValues = React.useMemo(
      () => items.filter((i) => !i.disabled).map((i) => i.value),
      [items],
    )
    const allChecked =
      allValues.length > 0 && allValues.every((v) => selected.includes(v))

    // '전체' 코드값(selectAll.value) — 지정 시 전체 선택 여부에 따라 배열에 자동 포함/제거해
    // PC 웹 전송 규격("0 1 2 3 4")과 일치시킨다. 개별 조작으로 전부 채워져도 동일 적용.
    // '전체' 칩이 비활성(disabled)이거나 single(전체 무의미) 모드면 값 주입도 하지 않는다.
    const masterValue =
      typeof selectAll === 'object' && !selectAll.disabled && !single
        ? selectAll.value
        : undefined
    const syncMasterValue = React.useCallback(
      (next: string[]) => {
        if (!masterValue) return next
        const all = allValues.length > 0 && allValues.every((v) => next.includes(v))
        if (all) return next.includes(masterValue) ? next : [masterValue, ...next]
        return next.filter((v) => v !== masterValue)
      },
      [masterValue, allValues],
    )

    const toggle = React.useCallback(
      (itemValue: string, checked: boolean) => {
        if (single) {
          // 라디오 동작: 체크 → 그 항목만 / 현재 항목 해제 → 선택 없음
          commit(checked ? [itemValue] : [])
          return
        }
        commit(
          syncMasterValue(
            checked ? [...selected, itemValue] : selected.filter((v) => v !== itemValue),
          ),
        )
      },
      [single, selected, commit, syncMasterValue],
    )

    const toggleAll = React.useCallback(
      (checked: boolean) => {
        // 비활성 외 값만 일괄 추가/제거. (비활성 항목의 기존 선택은 건드리지 않음)
        commit(
          syncMasterValue(
            checked
              ? Array.from(new Set([...selected, ...allValues]))
              : selected.filter((v) => !allValues.includes(v)),
          ),
        )
      },
      [selected, allValues, commit, syncMasterValue],
    )

    // single(라디오 동작)에서는 '전체' 선택이 모순이므로 무시한다.
    const showSelectAll = !!selectAll && !single
    const selectAllLabel =
      (typeof selectAll === 'object' && selectAll.label) || '전체'
    // '전체' 칩만 별도 비활성 (개별 항목 disabled 와 무관)
    const selectAllDisabled = typeof selectAll === 'object' && !!selectAll.disabled

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

    // 초기 스크롤: '첫(가장 왼쪽) 선택 항목'을 보이게 한다(범용 규칙 — useScrollSelectedIntoView 주석 참고).
    // 스크롤러 직속 자식 = [masterChip?(전체), ...chips] 순서이므로, master 가 있으면 +1 오프셋.
    const firstSelectedItemIndex = React.useMemo(() => {
      const i = items.findIndex((it) => selected.includes(it.value))
      return i < 0 ? undefined : i + (showSelectAll ? 1 : 0)
    }, [items, selected, showSelectAll])
    useScrollSelectedIntoView(scrollRef, firstSelectedItemIndex, { enabled: useSwiper })

    const scrollBy = (dir: 'left' | 'right') => {
      const el = scrollRef.current
      if (!el) return
      el.scrollBy({ left: (dir === 'left' ? -1 : 1) * el.clientWidth * 0.8, behavior: 'smooth' })
    }

    const chipClassName = cn(
      // 칩 최소 너비 — 가장 작은 체크박스도 74px 보장
      'min-w-[74px]',
      // swiper 는 줄어들지 않게 shrink-0. horizontal wrap 은 flex-1 로 늘리지 않고 74px 기준 유지.
      useSwiper && 'shrink-0',
      itemClassName,
    )

    // '전체' 마스터 칩 — selectAll 일 때만. 체크 상태는 allChecked(파생).
    // 단 '전체'가 비활성(selectAllDisabled)이면 체크 해제 상태로 표시한다.
    //   (allChecked 는 '비활성 제외 항목' 기준이라, 선택 가능 항목이 모두 선택되면 true 가 되어
    //    비활성인데도 체크된 두꺼운 스타일로 보이던 문제 방지)
    const masterChip = showSelectAll ? (
      <Checkbox
        key="__all__"
        label={selectAllLabel}
        checked={selectAllDisabled ? false : allChecked}
        disabled={disabled || allValues.length === 0 || selectAllDisabled}
        onCheckedChange={(c) => toggleAll(c === true)}
        className={chipClassName}
      />
    ) : null

    const chips = items.map(({ value: v, label, disabled: itemDisabled }) => (
      <Checkbox
        key={v}
        value={v}
        label={label}
        checked={selected.includes(v)}
        disabled={disabled || itemDisabled}
        onCheckedChange={(c) => toggle(v, c === true)}
        className={chipClassName}
      />
    ))

    // 세로 스택
    if (direction === 'vertical') {
      return (
        <div ref={ref} className={cn('flex flex-col gap-2 [&>label]:w-full', className)} {...props}>
          {masterChip}
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
            // p-1: 선택 시 border-2 / 포커스 링(ring-2 + offset-2 = 4px)이 스크롤 끝(특히 마지막 칩 우측)에서 잘리지 않도록 여백 확보
            className="flex items-center gap-2 overflow-x-auto p-1 scroll-smooth [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            {masterChip}
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
        {masterChip}
        {chips}
      </div>
    )
  },
)
CheckboxGroup.displayName = 'CheckboxGroup'

export { CheckboxGroup }
