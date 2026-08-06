// Figma m_card(9300-28728) 1:1.
// 이미 만들어진 base/composites 컴포넌트(Badge, Icon, ButtonGroup ...)를 슬롯 props 로 받아
// 다양한 type(default_list / type2 / type3 / type4)을 표현한다. 카드 자체는 슬롯 컨테이너 역할.
//
// 슬롯 prop:
//   badges    — <Badge> 들 묶음(ReactNode). 상단 row(wrap, gap 8).
//   subtitle  — "주요 정보" 같은 작은 윗줄 (17px Regular muted).
//   title     — 큰 카드 제목 (19px Bold ink, 2줄 초과 시 … 말줄임 — 전문은 상세 화면이 표시).
//   rows      — [{ label, value }] 라벨/데이터 행. label 17 Regular muted 좌, value 17 ink.
//               value 정렬: 기본 우측, type2(trailing 있음)는 좌측. value 가 ReactNode 라 자유.
//   trailing  — 카드 우측 끝 슬롯 (옆 Badge/화살표 아이콘 등). 기본은 rows 와 가로 정렬.
//   trailingAlign — trailing 을 어디에 맞출지. 'rows'(기본, 기존 동작) / 'card'(카드 전체 높이 기준
//               세로 중앙 — 본문(배지·제목·rows·footer) 전체가 좌측 컬럼이 되고 그 옆에 붙는다).
//   footer    — 카드 하단 영역 (ButtonGroup, 액션 등).
//   onClick   — 카드 전체 클릭 핸들러. 주어지면 button 처럼 동작 + hover/focus 스타일.
//
// 모든 슬롯은 optional 이라 사용처가 필요한 것만 채워 type별 layout 을 구성한다.
//   default_list — badges + subtitle + title + rows (4행)
//   type2(compact) — title + rows + trailing
//   type3        — badges + subtitle + title + rows (number 위주, divider)
//   type4        — badges + subtitle + title + rows + footer
import * as React from 'react'

import { cn } from '@/utils/cn'

export interface CardRow {
  label?: React.ReactNode
  value: React.ReactNode
}

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  badges?: React.ReactNode
  subtitle?: React.ReactNode
  title?: React.ReactNode
  rows?: CardRow[]
  /** rows 영역과 가로로 나란히 — 우측 끝 슬롯 (Badge, 아이콘 등). */
  trailing?: React.ReactNode
  /**
   * trailing 정렬 기준. 기본 'rows'(rows 행과 가로 정렬 — 기존 동작).
   * 'card' = 본문 전체를 좌측 컬럼으로 묶고 그 옆에 세로 중앙 배치(제목이 여러 줄이어도 겹치지 않음).
   */
  trailingAlign?: 'rows' | 'card'
  footer?: React.ReactNode
  /** 카드 전체 클릭 — 주어지면 button role + 호버/포커스 스타일. */
  onClick?: () => void
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      badges,
      subtitle,
      title,
      rows,
      trailing,
      trailingAlign = 'rows',
      footer,
      onClick,
      ...props
    },
    ref,
  ) => {
    const interactive = Boolean(onClick)
    const Container = interactive ? 'button' : 'div'
    // 'card' 정렬이면 trailing 을 rows 행에서 빼고 본문 컬럼 옆(세로 중앙)에 붙인다.
    const cardTrailing = trailingAlign === 'card' ? trailing : undefined
    const rowsTrailing = cardTrailing ? undefined : trailing

    const body = (
      <>
        {badges && (
          <div className="flex flex-wrap items-start gap-krds-5">{badges}</div>
        )}

        {(subtitle || title) && (
          <div className="flex flex-col gap-1">
            {subtitle && (
              <span className="text-[17px] font-normal leading-normal text-krds-text-muted">
                {subtitle}
              </span>
            )}
            {title && (
              // 2줄 초과 시 … 말줄임(2026-08-06 요청 — 설계서 '카드 title 2줄 말줄임'). 전문은 상세 화면이 표시.
              <span className="line-clamp-2 text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                {title}
              </span>
            )}
          </div>
        )}

        {(rows || rowsTrailing) && (
          <div className="flex w-full items-center gap-krds-7">
            {rows && rows.length > 0 && (
              <div className="flex min-w-px flex-1 flex-col gap-1">
                {rows.map((row, i) => (
                  <div key={i} className="flex items-baseline gap-krds-7">
                    {row.label != null && (
                      <span className="shrink-0 text-[17px] leading-normal text-krds-text-muted">
                        {row.label}
                      </span>
                    )}
                    <span
                      className={cn(
                        'min-w-px flex-1 text-[17px] leading-normal text-krds-text-ink wrap-break-word',
                        // type2(compact, trailing 있음)는 데이터를 왼쪽 정렬, 그 외 타입은 우측 정렬.
                        trailing ? 'text-left' : 'text-right',
                      )}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {rowsTrailing && (
              <div className="flex shrink-0 items-center gap-krds-5">
                {rowsTrailing}
              </div>
            )}
          </div>
        )}

        {footer && <div className="w-full">{footer}</div>}
      </>
    )

    return (
      <Container
        // @ts-expect-error — Container 가 button 또는 div 라 ref 타입 분기 생략
        ref={ref}
        type={interactive ? 'button' : undefined}
        onClick={onClick}
        className={cn(
          'flex w-full rounded-krds-8 border border-krds-border-field bg-background p-krds-8 text-left',
          // 'card' 정렬: 본문 컬럼 + trailing 을 가로로 나란히(세로 중앙). 그 외: 기존 세로 스택.
          cardTrailing ? 'flex-row items-center gap-krds-7' : 'flex-col gap-krds-5',
          interactive &&
            'cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      >
        {cardTrailing ? (
          <>
            <div className="flex min-w-px flex-1 flex-col gap-krds-5">{body}</div>
            <div className="flex shrink-0 items-center gap-krds-5">{cardTrailing}</div>
          </>
        ) : (
          body
        )}
      </Container>
    )
  },
)
Card.displayName = 'Card'

export { Card }
