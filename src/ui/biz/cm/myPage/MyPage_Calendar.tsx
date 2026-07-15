// MUI-CM-06-M01 마이페이지 > 업무 캘린더 섹션 (설계서 00.공통 slide75 / Figma 10020:84072).
// 구성: 헤더("업무 캘린더" + [더보기 +]) → 월 캘린더(업무 있는 날 표식) → 일정 카드(최대 3건).
//
// Figma 실측(px, 1:1):
//   헤더: min-h 56 · px16 · border-top 1px · bg #ecf1fa(primary-faint) · 제목 19px Bold · 더보기 17px Medium + add 20px.
//   캘린더: 328폭(좌우 16 여백) · 상단 16.
//   카드: 328폭 · p16 · rounded 12 · border #d1d7e0 · shadow 0 0 5px rgba(23,43,77,.1) · gap16(본문↔chevron).
//         본문 gap4(데이터행↔제목), 데이터행 gap8(배지↔공고번호). 공고번호 17px Regular #555, 제목 19px Bold. 우측 ArrowForwardIos 20px.
import { useState } from 'react'
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import { Icon } from '@/ui/common/base/Icon'
import { Calendar } from '@/ui/common/base/Calendar'
import { cn } from '@/utils/cn'
import type { MyPageSchedule, MyPageSchdlSeCd } from '@/types/cm'

// 구분별 배지 라벨/색. 개인(personal)은 Figma 상 중립(회색) 배지이나 Badge 팔레트에 gray 가
// 없어 yellow 로 근사(보고 대상). 물품=blue · 공사=green.
const SCHDL_BADGE: Record<MyPageSchdlSeCd, { label: string; color: 'blue' | 'green' | 'yellow' }> = {
  goods: { label: '물품', color: 'blue' },
  construction: { label: '공사', color: 'green' },
  personal: { label: '개인', color: 'yellow' },
}

interface ScheduleCardProps {
  schedule: MyPageSchedule
  onClick: () => void
}

// 일정 카드 — 도메인 전용 조립물. Figma m_card(type2, 92h) 1:1.
function ScheduleCard({ schedule, onClick }: ScheduleCardProps) {
  const badge = SCHDL_BADGE[schedule.schdlSeCd]
  // 관심 입찰공고면 공고명, 개인 스케줄이면 스케줄 내용을 제목으로.
  const title = schedule.pbancNm ?? schedule.schdlCn ?? ''
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-krds-8 rounded-[12px] border border-krds-border-divider bg-background p-krds-8 text-left',
        'shadow-[0px_0px_5px_0px_rgba(23,43,77,0.1)]',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
      )}
    >
      <div className="flex min-w-px flex-1 flex-col gap-krds-3">
        <div className="flex items-center gap-krds-5">
          <Badge type="pastel" color={badge.color}>
            {badge.label}
          </Badge>
          {schedule.pbancNo && (
            <span className="min-w-px flex-1 truncate text-krds-body-md leading-normal text-krds-text-muted">
              {schedule.pbancNo}
            </span>
          )}
        </div>
        <span className="truncate text-krds-body-lg font-bold leading-normal text-krds-text-ink">
          {title}
        </span>
      </div>
      <Icon name="ArrowForwardIos" size={20} aria-hidden className="shrink-0 text-krds-text-ink" />
    </button>
  )
}

interface MyPageCalendarProps {
  /** 관심 입찰공고 + 개인 스케줄(합쳐 최대 3건 표시). */
  schedules: MyPageSchedule[]
  /** 초기 표시 월 'YYYY-MM' (선택) — 미지정 시 이번 달. */
  initialMonth?: string
  /** [더보기] — 업무 캘린더 전체 화면 이동. */
  onMore: () => void
  /** 일정 카드 클릭 — 부모가 입찰공고 이동/바텀시트 분기. */
  onSelectSchedule: (schedule: MyPageSchedule) => void
}

export function MyPageCalendar({
  schedules,
  initialMonth,
  onMore,
  onSelectSchedule,
}: MyPageCalendarProps) {
  // 캘린더 선택 날짜 — 기본값 '오늘'(디폴트 오늘 선택). 조회 필터는 추후 API 연동.
  const [selected, setSelected] = useState<string | null>(() => dayjs().format('YYYY-MM-DD'))
  const scheduledDates = schedules.map((s) => s.schdlDt)
  // 6~7 항목 합쳐 최대 3건 표시(설계서).
  const visible = schedules.slice(0, 3)

  return (
    <section className="flex flex-col">
      {/* 헤더 — 업무 캘린더(섹션 헤더 bg-faint) + 더보기 */}
      <div className="flex min-h-[56px] w-full items-center gap-krds-8 border-t border-krds-border-divider bg-krds-bg-primary-faint px-krds-8">
        <h2 className="min-w-px flex-1 text-krds-body-lg font-bold leading-normal text-krds-text-ink">
          업무 캘린더
        </h2>
        <button
          type="button"
          onClick={onMore}
          className="flex shrink-0 items-center gap-1 text-krds-body-md font-medium leading-normal text-krds-text-ink"
        >
          더보기
          <Icon name="Add" size={20} aria-hidden />
        </button>
      </div>

      {/* 월 캘린더 — 328폭(자동 중앙 정렬) · 상단 16. 업무 있는 날짜 dot 표식. */}
      <div className="pt-krds-8">
        <Calendar
          mode="single"
          value={selected}
          onChange={(v) => setSelected(v as string)}
          scheduledDates={scheduledDates}
          initialMonth={initialMonth}
        />
      </div>

      {/* 일정 카드(최대 3건) — px16 pt16 pb16, 카드 간격 16. */}
      {visible.length > 0 && (
        <div className="flex flex-col gap-krds-8 px-krds-8 pb-krds-8 pt-krds-8">
          {visible.map((s) => (
            <ScheduleCard key={s.id} schedule={s} onClick={() => onSelectSchedule(s)} />
          ))}
        </div>
      )}
    </section>
  )
}
MyPageCalendar.displayName = 'MyPageCalendar'
