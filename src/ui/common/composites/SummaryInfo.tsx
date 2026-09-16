// Figma m_summary info(9300-29058) 1:1.
// 기존 base 컴포넌트(Badge, Icon, Button)를 조합하여 만든 요약 정보 박스.
//
// 구성:
//   1) badge swipe row  ── badges 데이터 배열 (가로 스크롤 + 우측 화살표 자동 노출)
//   2) title area       ── subtitle(17 Regular muted) + 우측 actions(아이콘 버튼들)
//                          + title(19 Bold ink)
//   3) infolist         ── rows[{label, value}] 라벨 좌측 muted, 값 우측 ink
//
// 슬롯 props 모두 optional 이라 사용처가 채우는 슬롯에 따라 다양한 카드 표현 가능.
// 화살표는 TabList 와 동일한 ResizeObserver + scroll 감지로 자동 노출.
//
// 사용 예:
//   <SummaryInfo
//     badges={[{ label: '구분명' }, { label: '수의계약', color: 'red' }]}
//     subtitle="판단번호 4000A"
//     title="2026 K5 방독면 수리부속(구매)"
//     actions={<>
//       <button type="button"><Icon name="Refresh" /></button>
//       <button type="button"><Icon name="KidStar" /></button>
//     </>}
//     rows={[
//       { label: '발주예정월', value: '2026-03' },
//       { label: '예산금액', value: '225,337,550 원' },
//     ]}
//   />
import * as React from 'react'

import { Badge, type BadgeProps } from '@/ui/common/base/Badge'
import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface SummaryInfoRow {
  label: React.ReactNode
  value: React.ReactNode
}

export interface SummaryInfoBadge {
  /** 렌더 key — 같은 배열 내 유일해야 함. API 연동(동적 배열) 시 안정적 식별자 권장. 없으면 인덱스 폴백. */
  key?: string
  /** 배지 라벨 텍스트. */
  label: React.ReactNode
  /** Badge type — 기본 pastel. */
  type?: BadgeProps['type']
  /** Badge color — 기본 blue. */
  color?: BadgeProps['color']
}

export interface SummaryInfoProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 상단 가로 뱃지 행 — 데이터 배열로 받아 내부에서 <Badge> 렌더. 비어있으면 생략. overflow 시 우측 화살표 자동. */
  badges?: SummaryInfoBadge[]
  /** title 위 작은 회색 텍스트 (17 Regular muted). */
  subtitle?: React.ReactNode
  /** 큰 카드 제목 (19 Bold ink, 멀티라인). */
  title?: React.ReactNode
  /** title row 우측 액션 슬롯 — 보통 작은 아이콘 버튼들. */
  actions?: React.ReactNode
  /** 하단 라벨/데이터 행. 라벨 좌측 muted, 값 우측 ink. */
  rows?: SummaryInfoRow[]
  /**
   * 축소 모드 — true 면 카드 전체(배지·제목·rows)를 grid-rows 0fr 로 통째로 접어 높이를 0 으로(스크롤 시).
   * sticky 헤더에서 StepBar 와 동일하게 완전히 숨겨진다. 기본 false.
   */
  collapsed?: boolean
  /**
   * 좌우 패딩 제거 — true 면 본문 좌우 패딩(px-krds-8)을 0 으로(세로 패딩 py-krds-8 은 유지).
   * 이미 좌우 패딩이 있는 컨테이너(BottomSheet 본문 px-16 등) 안에서 이중 패딩을 막을 때. 기본 false.
   */
  flushX?: boolean
}

function SummaryInfo({
  className,
  badges,
  subtitle,
  title,
  actions,
  rows,
  collapsed = false,
  flushX = false,
  ...props
}: SummaryInfoProps) {
  // collapsed 시 카드 전체를 grid-rows 0fr 로 접는다(높이 0). 핵심 3겹 구조:
  //   ① grid(높이 컨트롤러, padding 없음) → ② overflow-hidden(클리핑) → ③ 실제 내용+padding(함께 접힘).
  // padding 을 ③ 안쪽에 둬야 접힐 때 잔여 높이 없이 0 이 된다.
  // 라벨이 빈 배지는 렌더하지 않는다 — 상세 화면들이 `label: detail?.xxx ?? ''` 로 넘기는 탓에
  //   값이 없을 때 빈 알약이 보이던 문제(2026-09-16). 배지가 전부 비면 배지 줄 자체를 숨긴다.
  const shownBadges = (badges ?? []).filter(
    (b) => !(b.label == null || b.label === '' || b.label === false),
  )

  return (
    <div
      // aria-hidden 은 collapse(true)일 때만 — false 를 DOM 에 내보내면 일부 보조기술(iOS VoiceOver) 오작동.
      aria-hidden={collapsed ? true : undefined}
      className={cn(
        'grid w-full transition-all duration-200 ease-out motion-reduce:transition-none',
        collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
        className,
      )}
      {...props}
    >
      <div className="overflow-hidden">
        <div
          className={cn('flex w-full flex-col gap-krds-8 py-krds-8', flushX ? 'px-0' : 'px-krds-8')}
        >
          {shownBadges.length > 0 && (
            <BadgeSwipeRow>
              {shownBadges.map((badge, i) => (
                <Badge key={badge.key ?? i} type={badge.type} color={badge.color}>
                  {badge.label}
                </Badge>
              ))}
            </BadgeSwipeRow>
          )}

          {(subtitle || title || actions) && (
            <div className="flex w-full flex-col gap-1">
              {(subtitle || actions) && (
                <div className="flex w-full items-center justify-between gap-krds-5">
                  {subtitle && (
                    <span className="min-w-px flex-1 text-[17px] font-normal leading-normal text-krds-text-muted wrap-break-word">
                      {subtitle}
                    </span>
                  )}
                  {actions && (
                    <div className="flex shrink-0 items-center gap-krds-5">{actions}</div>
                  )}
                </div>
              )}
              {title && (
                <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                  {title}
                </span>
              )}
            </div>
          )}

          {/* infolist — 라벨 좌측 muted, 값 우측 ink. */}
          {rows && rows.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  )
}
SummaryInfo.displayName = 'SummaryInfo'

// ─── badge swipe row (overflow 감지 + 우측 화살표 자동) ──────────────────────
function BadgeSwipeRow({ children }: { children: React.ReactNode }) {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const updateState = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 1)
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
      {canScrollLeft && (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-start pr-10"
          style={{
            background: 'linear-gradient(to left, rgba(255,255,255,0), var(--background) 60%)',
          }}
        >
          <button
            type="button"
            aria-label="이전 뱃지로 스크롤"
            onClick={() => scrollerRef.current?.scrollBy({ left: -120, behavior: 'smooth' })}
            className="pointer-events-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-krds-text-ink"
          >
            <Icon name="ChevronLeft" size={20} aria-hidden />
          </button>
        </div>
      )}
      {canScrollRight && (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end pl-10"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,0), var(--background) 60%)',
          }}
        >
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
