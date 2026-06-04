// 조달계획 상세 요약정보 (Figma m_summary info 9300-37462). MUI-OP-01-M03 상단 카드.
// 구성: 배지 스와이프(가로 스크롤) + 타이틀영역(메타텍스트 + 알림/인쇄 아이콘버튼 + 카드 제목)
//       + infolist(라벨/값 행). 데이터 무소유 — 페이지가 props 로 주입.
// 참고: Figma 배지 스와이프의 화살표 버튼은 가로 스크롤로 대체(스와이프). 아이콘버튼 37×37.
import * as React from 'react'

import { Badge } from '@/ui/common/base/Badge'
import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface SummaryInfoRow {
  label: React.ReactNode
  value: React.ReactNode
}

export interface SummaryInfoProps {
  /** 상단 배지(가로 스와이프). 예: ['물품', '수의계약'] */
  badges: string[]
  /** 메타텍스트(판단번호 등) — 17 Medium ink */
  meta: React.ReactNode
  /** 카드 제목 — 19 Bold ink */
  title: React.ReactNode
  /** 라벨/값 정보 행 (label 좌 · value 우) */
  rows: SummaryInfoRow[]
  /** 알림추가 아이콘 버튼 클릭 */
  onNotify?: () => void
  /** 인쇄 아이콘 버튼 클릭 */
  onPrint?: () => void
  /**
   * 축소 모드 — infolist(라벨/값 행)를 숨겨 헤더 높이를 줄인다(Figma 9300-43029).
   * 스크롤 시 페이지가 토글. 배지·메타·제목은 두 상태 공통이라 컴포넌트 1개로 처리.
   */
  collapsed?: boolean
  className?: string
}

// 37×37 유틸 아이콘 버튼 (border + rounded-8 + 24 아이콘) — 컴포넌트 내부 전용
function IconUtilButton({
  icon,
  label,
  onClick,
}: {
  icon: 'NotificationAdd' | 'Print'
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'flex size-[37px] shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-field bg-background text-krds-text-ink',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:opacity-70',
      )}
    >
      <Icon name={icon} size={24} aria-hidden />
    </button>
  )
}

export function SummaryInfo({
  badges,
  meta,
  title,
  rows,
  onNotify,
  onPrint,
  collapsed = false,
  className,
}: SummaryInfoProps) {
  return (
    <div className={cn('flex w-full flex-col gap-krds-8 bg-white p-krds-8', className)}>
      {/* 배지 스와이프 — 가로 스크롤 */}
      <div
        className="flex w-full items-center gap-krds-5 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {badges.map((b, i) => (
          <Badge key={i} type="pastel" color="blue" className="shrink-0">
            {b}
          </Badge>
        ))}
      </div>

      {/* 타이틀 영역 */}
      <div className="flex w-full flex-col gap-krds-5">
        <div className="flex w-full items-center gap-krds-5">
          <p className="min-w-px flex-1 text-[17px] font-medium leading-normal text-krds-text-ink">
            {meta}
          </p>
          <div className="flex shrink-0 items-center gap-krds-5">
            <IconUtilButton icon="NotificationAdd" label="알림 추가" onClick={onNotify} />
            <IconUtilButton icon="Print" label="인쇄" onClick={onPrint} />
          </div>
        </div>
        <p className="w-full text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
          {title}
        </p>
      </div>

      {/* infolist — 라벨(좌) / 값(우). 축소 모드(스크롤)에서는 숨김. */}
      {!collapsed && (
      <div className="flex w-full flex-col gap-krds-5">
        {rows.map((row, i) => (
          <div key={i} className="flex w-full items-start gap-krds-5">
            <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-muted">
              {row.label}
            </span>
            <span className="min-w-px flex-1 text-right text-[17px] leading-normal text-krds-text-muted">
              {row.value}
            </span>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}
SummaryInfo.displayName = 'SummaryInfo'
