// MUI-CM-06-M01 마이페이지 > 업무 캘린더 섹션 (설계서 00.공통 slide75·slide81 / Figma 10020:84072).
// 구성: 헤더("업무 캘린더" + [더보기 +]) → 월 캘린더(업무 있는 날 표식) → 선택 일자의 일정 카드(최대 3건).
//
// 동작(2026-08-03 요청 확정):
//   - 날짜 클릭 → 업무캘린더(MUI-CM-06-M06)로 **새 페이지 이동**(그 날짜가 선택된 상태). 그 날짜의 일정
//     전체 목록·없을 때의 '표시할 일정이 없습니다.'는 M06 이 담당한다 — 하단 카드 영역은 날짜에 반응하지 않는다.
//   - 카드 영역 = 관심(찜) 공고(위) + 개인 스케줄(아래) 순, 같은 구분 안에서는 최신순으로 최대 3건.
//   - [더보기] → M06(날짜 미지정=오늘) · 카드 클릭 → 관심 공고=공고 상세 / 개인=바텀시트(P07).
//
// Figma 실측(px, 1:1):
//   헤더: min-h 56 · px16 · border-top 1px · bg #ecf1fa(primary-faint) · 제목 19px Bold · 더보기 17px Medium + add 20px.
//   캘린더: 328폭(좌우 16 여백) · 상단 16.
//   카드: 328폭 · p16 · rounded 12 · border #d1d7e0 · shadow 0 0 5px rgba(23,43,77,.1) · gap16(본문↔chevron).
//         본문 gap4(데이터행↔제목), 데이터행 gap8(배지↔공고번호). 공고번호 17px Regular #555, 제목 19px Bold. 우측 ArrowForwardIos 20px.
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import { Icon } from '@/ui/common/base/Icon'
import { Calendar } from '@/ui/common/base/Calendar'
import { cn } from '@/utils/cn'
import type { MyPageSchedule, MyPageSchdlSeCd } from '@/types/mock/cm'

// 구분별 배지 라벨. Figma(10020:84091 m_label badge)는 물품/공사/개인 모두 동일한 중립
// pastel-blue(bg #f5f9ff / border #c1d1ee / text #0f316e) → 색을 구분별로 가르지 않고 전부 blue.
const SCHDL_BADGE: Record<MyPageSchdlSeCd, { label: string; color: 'blue' }> = {
  goods: { label: '물품', color: 'blue' },
  construction: { label: '공사', color: 'blue' },
  personal: { label: '개인', color: 'blue' },
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
  /** 날짜 클릭 'YYYY-MM-DD' — 부모가 업무캘린더(M06)로 그 날짜 선택 상태로 이동. */
  onSelectDate: (schdlDt: string) => void
}

export function MyPageCalendar({
  schedules,
  initialMonth,
  onMore,
  onSelectSchedule,
  onSelectDate,
}: MyPageCalendarProps) {
  // 캘린더 선택 날짜 — 기본값 '오늘'(디폴트 오늘 선택). 조회 필터는 추후 API 연동.
  const [selected, setSelected] = useState<string | null>(() => dayjs().format('YYYY-MM-DD'))
  // [오늘] 버튼(Figma 10020:83891, 2026-08-03 기능 추가) — 다른 달로 이동해 있어도 오늘로 복귀.
  //   Calendar 는 표시 월을 내부 상태로 가져 initialMonth 만으론 못 되돌림 → key 재마운트로 이번 달 복귀.
  const [calKey, setCalKey] = useState(0)
  const goToday = () => {
    setSelected(dayjs().format('YYYY-MM-DD')) // 오늘 날짜 선택(포인트)
    setCalKey((k) => k + 1) // 표시 월을 이번 달로 리셋
  }
  const scheduledDates = schedules.map((s) => s.schdlDt)
  // 6~7 항목 합쳐 최대 3건 표시(설계서). 날짜 선택과 무관 — 날짜별 목록은 M06 이 담당.
  //   정렬: ① 관심(찜) 공고(물품·공사) 먼저 → 개인 스케줄 맨 뒤, ② 같은 구분 안에서는 최신순
  //   (작성일 wrtYmd 내림차순). wrtYmd 없는 항목은 그 구분의 뒤로 — 정렬 기준 확정 시 그 항목명으로 교체.
  const visible = useMemo(() => {
    const seRank = (s: MyPageSchedule) => (s.schdlSeCd === 'personal' ? 1 : 0)
    return [...schedules]
      .sort(
        (a, b) => seRank(a) - seRank(b) || (b.wrtYmd ?? '').localeCompare(a.wrtYmd ?? ''),
      )
      .slice(0, 3)
  }, [schedules])

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

      {/* 월 캘린더 — 328폭(자동 중앙 정렬) · 상단 16. 업무 있는 날짜 dot 표식.
          data-coach = 앱 이용안내(M16) 코치마크 하이라이트 측정 지점(월 캘린더만 — 헤더/일정 카드 제외). */}
      <div data-coach="mypage-calendar" className="pt-krds-8">
        <Calendar
          key={calKey}
          mode="single"
          value={selected}
          // 날짜 클릭 → 선택 표시 후 업무캘린더(M06)로 그 날짜 선택 상태로 이동(하단 카드 영역은 그대로).
          onChange={(v) => {
            const d = v as string
            setSelected(d)
            onSelectDate(d)
          }}
          scheduledDates={scheduledDates}
          initialMonth={calKey > 0 ? undefined : initialMonth}
        />
      </div>

      {/* [오늘] — 오늘 날짜로 선택/표시 월 복귀(Figma 10020:83891 캘린더 하단 좌측 pill) */}
      <div className="px-krds-8 pt-krds-3">
        <button
          type="button"
          onClick={goToday}
          className="rounded-full border border-krds-border-field bg-background px-krds-8 py-krds-3 text-[15px] font-medium leading-normal text-krds-text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring active:bg-krds-bg-primary-faint"
        >
          오늘
        </button>
      </div>

      {/* 일정 카드(최대 3건) — px16 pt16 pb16, 카드 간격 16. 일정이 하나도 없으면 안내(M06 과 동일 문구). */}
      <div className="flex flex-col gap-krds-8 px-krds-8 pb-krds-8 pt-krds-8">
        {visible.length > 0 ? (
          visible.map((s) => (
            <ScheduleCard key={s.id} schedule={s} onClick={() => onSelectSchedule(s)} />
          ))
        ) : (
          <p className="py-krds-8 text-center text-krds-body-md text-krds-text-muted">
            표시할 일정이 없습니다.
          </p>
        )}
      </div>
    </section>
  )
}
MyPageCalendar.displayName = 'MyPageCalendar'
