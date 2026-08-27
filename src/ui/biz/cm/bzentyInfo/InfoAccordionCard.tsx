// 업체정보 계열 공용 섹션 카드 (Figma m_accordian 1:1 — 10020:82706/82764 실측, 260827 리디자인).
// 흰 카드(보더 divider·r12·p16·그림자) + 타이틀(19 Bold)+접기 화살표 + 구분선 + 정보행(label 좌/value 우, 17 muted)
//   + [더보기] (previewCount 지정 시 — 접힘 상태에서 앞 N행만 노출, 버튼 = 보더 primary·17 Bold·h48 풀폭).
// 여러 건 목록 섹션은 rows 에 'divider' 를 끼워 항목 경계를 구분한다.
// 사용처: 업체정보 상세(M02 T01~T04)·추가정보신청(M03)·군수품무역대리업 등 cm 업체정보 계열 화면.
import { useState } from 'react'
import type { ReactNode } from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

/** 정보 행 1개 — badge 는 값 우측 밖에 붙는 뱃지 슬롯(예: 적격·폐업·상태코드). */
export interface InfoCardRow {
  label: ReactNode
  value: ReactNode
  /** 값 우측 뱃지(shrink-0). Figma: [label flex-1][value flex-1 우측정렬][badge] */
  badge?: ReactNode
  /** true 면 값 슬롯을 뱃지 나열로 대체(기업구분 중소기업·원호기업 등) — value 에 뱃지 노드를 직접 전달. */
  valueIsNode?: boolean
}

export type InfoCardRowInput = InfoCardRow | 'divider'

export interface InfoAccordionCardProps {
  title: ReactNode
  rows: InfoCardRowInput[]
  /** 접힘 상태에서 노출할 행 수. 미지정 = 전체 노출(더보기 없음). */
  previewCount?: number
  /** rows 위에 붙는 커스텀 콘텐츠(수의계약배제 전체/3개월 토글 등). */
  children?: ReactNode
  className?: string
}

export function InfoAccordionCard({
  title,
  rows,
  previewCount,
  children,
  className,
}: InfoAccordionCardProps) {
  const [open, setOpen] = useState(true)
  const [showAll, setShowAll] = useState(false)

  const hasMore = previewCount != null && rows.length > previewCount && !showAll
  let visible = hasMore ? rows.slice(0, previewCount) : rows
  // 슬라이스 끝이 divider 로 끝나면 잘라낸다(항목 경계만 남는 모양 방지).
  while (visible.length > 0 && visible[visible.length - 1] === 'divider')
    visible = visible.slice(0, -1)

  return (
    <section
      className={cn(
        'flex w-full flex-col gap-krds-8 rounded-[12px] border border-krds-border-divider bg-white p-krds-8 shadow-[0px_0px_5px_0px_rgba(23,43,77,0.1)]',
        className,
      )}
    >
      {/* 타이틀 + 접기 화살표 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-krds-8 text-left"
      >
        <span className="min-w-px flex-1 text-[19px] font-bold leading-normal text-krds-text-ink">
          {title}
        </span>
        <Icon
          name="ExpandMore"
          size={20}
          aria-hidden
          className={cn('shrink-0 text-krds-text-ink transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <>
          <div aria-hidden className="h-px w-full bg-krds-border-divider" />

          {children}

          {/* 정보행 — label 좌 / value 우측정렬, 둘 다 17 muted(Figma #555). */}
          <div className="flex w-full flex-col gap-krds-3">
            {visible.map((row, i) =>
              row === 'divider' ? (
                <div key={`div-${i}`} aria-hidden className="my-krds-3 h-px w-full bg-krds-border-divider" />
              ) : (
                <div key={i} className="flex w-full items-start gap-krds-5">
                  <span className="min-w-px flex-[1_0_0] text-[17px] leading-normal text-krds-text-muted">
                    {row.label}
                  </span>
                  {row.valueIsNode ? (
                    <div className="flex flex-wrap items-center justify-end gap-krds-5">{row.value}</div>
                  ) : (
                    <span className="min-w-px flex-[1_0_0] text-right text-[17px] leading-normal text-krds-text-muted wrap-break-word">
                      {row.value}
                    </span>
                  )}
                  {row.badge && <div className="shrink-0">{row.badge}</div>}
                </div>
              ),
            )}
          </div>

          {/* 더보기 — Figma m_button(보더 #0054e9·r8·h48·17 Bold·풀폭) */}
          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="flex h-12 w-full items-center justify-center rounded-krds-8 border border-krds-action-primary bg-white text-[17px] font-bold leading-normal text-krds-action-primary"
            >
              더보기
            </button>
          )}
        </>
      )}
    </section>
  )
}
InfoAccordionCard.displayName = 'InfoAccordionCard'
