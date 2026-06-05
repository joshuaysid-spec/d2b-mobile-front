// Figma m_tab(9300-28541) 1:1.
// items 배열을 Tab 으로 매핑 + 가로 스크롤(overflow-x-auto) + gap 8.
// 활성 탭이 변경되면 자동 scrollIntoView 로 가시 영역에 들어오게 한다.
//
// scrollButtons 옵션:
//   'auto' (기본) — 스크롤이 필요할 때만 좌/우 화살표 자동 노출 (ResizeObserver + scroll 감지)
//   'always'      — 항상 양쪽 화살표 노출
//   'none'        — 화살표 미노출, 자연 스와이프만
//
// 화살표 옆에는 그라데이션 fade(20px) 가 함께 표시돼 잘림 표현.
//
// 사용 예:
//   const [tab, setTab] = useState('bid')
//   <TabList
//     value={tab}
//     onChange={setTab}
//     items={[
//       { value: 'bid', label: '입찰' },
//       { value: 'notice', label: '공고' },
//     ]}
//   />
import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { Tab } from '@/ui/common/base/Tab'
import { cn } from '@/utils/cn'

export interface TabItem {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export type TabListScrollButtons = 'auto' | 'always' | 'none'

export interface TabListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[]
  /** 활성 탭 value. */
  value: string
  /** 탭 클릭 핸들러. */
  onChange: (value: string) => void
  /** 좌/우 스크롤 화살표 노출 정책. 기본 'auto'. */
  scrollButtons?: TabListScrollButtons
}

function TabList({
  className,
  items,
  value,
  onChange,
  scrollButtons = 'auto',
  ...props
}: TabListProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  // 스크롤 가능 여부 측정 — 'auto' 모드에서만 의미. resize/scroll 시 갱신.
  const updateScrollState = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  React.useEffect(() => {
    updateScrollState()
    const el = scrollerRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState, items.length])

  // 활성 탭이 바뀌면 화면에 보이도록 자동 스크롤.
  React.useEffect(() => {
    const tabEl = tabRefs.current[value]
    if (!tabEl) return
    tabEl.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
  }, [value])

  const showLeft =
    scrollButtons === 'always' || (scrollButtons === 'auto' && canScrollLeft)
  const showRight =
    scrollButtons === 'always' || (scrollButtons === 'auto' && canScrollRight)

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <div
      className={cn('relative w-full bg-background pt-krds-8', className)}
      {...props}
    >
      <div
        ref={scrollerRef}
        role="tablist"
        className="flex w-full items-center gap-krds-5 overflow-x-auto overflow-y-hidden scrollbar-none [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((item) => (
          <Tab
            key={item.value}
            ref={(el) => {
              tabRefs.current[item.value] = el
            }}
            selected={item.value === value}
            disabled={item.disabled}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </Tab>
        ))}
      </div>

      {showLeft && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-krds-8">
          <div className="pointer-events-auto flex h-12 items-center">
            {/* 버튼 뒤(사각 모서리 포함)는 흰색으로 덮어 탭이 비치지 않게 */}
            <span className="flex h-full items-center bg-background">
              <button
                type="button"
                aria-label="이전 탭으로 스크롤"
                onClick={() => scrollBy(-160)}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-krds-border-field bg-background text-krds-text-ink"
              >
                <Icon name="ArrowBackIosNew" size={20} aria-hidden />
              </button>
            </span>
            {/* 탭 위로 흰색→투명 그라데이션 fade — 화살표 안쪽 탭이 서서히 사라지게 */}
            <div
              aria-hidden
              className="h-full w-5 bg-gradient-to-r from-background to-transparent"
            />
          </div>
        </div>
      )}

      {showRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pt-krds-8">
          <div className="pointer-events-auto flex h-12 items-center">
            {/* 탭 위로 투명→흰색 그라데이션 fade — 화살표 안쪽 탭이 서서히 사라지게 */}
            <div
              aria-hidden
              className="h-full w-5 bg-gradient-to-r from-transparent to-background"
            />
            {/* 버튼 뒤(사각 모서리 포함)는 흰색으로 덮어 탭이 비치지 않게 */}
            <span className="flex h-full items-center bg-background">
              <button
                type="button"
                aria-label="다음 탭으로 스크롤"
                onClick={() => scrollBy(160)}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-krds-border-field bg-background text-krds-text-ink"
              >
                <Icon name="ArrowForwardIos" size={20} aria-hidden />
              </button>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
TabList.displayName = 'TabList'

export { TabList }
