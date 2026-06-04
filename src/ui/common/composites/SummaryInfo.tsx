// Figma m_summary info(9300-29058) 1:1.
// 기존 base 컴포넌트(Badge, Icon, Button)를 조합하여 만든 요약 정보 박스.
//
// 구성:
//   1) badge swipe row  ── badges 슬롯 (가로 스크롤 + 우측 화살표 자동 노출)
//   2) title area       ── subtitle(17 Regular muted) + 우측 actions(아이콘 버튼들)
//                          + title(19 Bold ink)
//   3) infolist         ── rows[{label, value}] 라벨 좌측 muted, 값 우측 ink
//
// 슬롯 props 모두 optional 이라 사용처가 채우는 슬롯에 따라 다양한 카드 표현 가능.
// 화살표는 TabList 와 동일한 ResizeObserver + scroll 감지로 자동 노출.
//
// 사용 예:
//   <SummaryInfo
//     badges={<><Badge type="pastel" color="blue">구분명</Badge> ... </>}
//     subtitle="판단번호 4000A"
//     title="2026 K5 방독면 수리부속(구매)"
//     actions={<>
//       <button type="button"><Icon name="Refresh" /></button>
//       <button type="button"><Icon name="Star" /></button>
//     </>}
//     rows={[
//       { label: '발주예정월', value: '2026-03' },
//       { label: '예산금액', value: '225,337,550 원' },
//     ]}
//   />
import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface SummaryInfoRow {
  label: React.ReactNode
  value: React.ReactNode
}

export interface SummaryInfoProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 상단 가로 뱃지 행 — <Badge> 들 묶음. overflow 시 우측 화살표 자동. */
  badges?: React.ReactNode
  /** title 위 작은 회색 텍스트 (17 Regular muted). */
  subtitle?: React.ReactNode
  /** 큰 카드 제목 (19 Bold ink, 멀티라인). */
  title?: React.ReactNode
  /** title row 우측 액션 슬롯 — 보통 작은 아이콘 버튼들. */
  actions?: React.ReactNode
  /** 하단 라벨/데이터 행. 라벨 좌측 muted, 값 우측 ink. */
  rows?: SummaryInfoRow[]
  /**
   * 축소 모드 — infolist(rows)를 숨겨 헤더 높이를 줄인다(Figma 9300-43029, 스크롤 시).
   * 배지·subtitle·title 은 유지. 기본 false.
   */
  collapsed?: boolean
}

function SummaryInfo({
  className,
  badges,
  subtitle,
  title,
  actions,
  rows,
  collapsed = false,
  ...props
}: SummaryInfoProps) {
  return (
    <div className={cn('flex w-full flex-col gap-krds-8 p-krds-8', className)} {...props}>
      {badges && <BadgeSwipeRow>{badges}</BadgeSwipeRow>}

      {(subtitle || title || actions) && (
        <div className="flex w-full flex-col gap-1">
          {(subtitle || actions) && (
            <div className="flex w-full items-center justify-between gap-krds-5">
              {subtitle && (
                <span className="min-w-px flex-1 text-[17px] font-normal leading-normal text-krds-text-muted wrap-break-word">
                  {subtitle}
                </span>
              )}
              {actions && <div className="flex shrink-0 items-center gap-krds-5">{actions}</div>}
            </div>
          )}
          {title && (
            <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
              {title}
            </span>
          )}
        </div>
      )}

      {/* infolist — collapsed 시 grid-rows 0fr 로 매끄럽게 접힘(즉시 unmount 점프 방지).
          상위 flex gap 으로 인한 잔여 간격을 없애려 접힘 시 -mt 로 위 gap 을 상쇄. */}
      {rows && rows.length > 0 && (
        <div
          aria-hidden={collapsed}
          className={cn(
            'grid transition-all duration-200 ease-out motion-reduce:transition-none',
            collapsed ? 'grid-rows-[0fr] -mt-krds-8 opacity-0' : 'grid-rows-[1fr] opacity-100',
          )}
        >
          <div className="overflow-hidden">
            <div className="flex w-full flex-col gap-1">
              {rows.map((row, i) => (
                <div key={i} className="flex items-baseline gap-krds-7">
                  <span className="shrink-0 text-[17px] leading-normal text-krds-text-muted">
                    {row.label}
                  </span>
                  <span className="min-w-px flex-1 text-right text-[17px] leading-normal text-krds-text-ink wrap-break-word tabular-nums">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
SummaryInfo.displayName = 'SummaryInfo'

// ─── badge swipe row (overflow 감지 + 우측 화살표 자동) ──────────────────────
function BadgeSwipeRow({ children }: { children: React.ReactNode }) {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const updateState = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  React.useEffect(() => {
    updateState()
    const el = scrollerRef.current
    if (!el) return
    el.addEventListener('scroll', updateState, { passive: true })
    const ro = new ResizeObserver(updateState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateState)
      ro.disconnect()
    }
  }, [updateState])

  return (
    <div className="relative w-full">
      <div
        ref={scrollerRef}
        className="flex w-full items-center gap-krds-5 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </div>
      {canScrollRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
          <div
            aria-hidden
            className="h-full w-4"
            style={{
              background: 'linear-gradient(to right, rgba(255,255,255,0), var(--background) 70%)',
            }}
          />
          <button
            type="button"
            aria-label="다음 뱃지로 스크롤"
            onClick={() => scrollerRef.current?.scrollBy({ left: 120, behavior: 'smooth' })}
            className="pointer-events-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-krds-text-ink"
          >
            <Icon name="ChevronRight" size={20} aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}

export { SummaryInfo }
