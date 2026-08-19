// MUI-CM-06-M06 업무캘린더 (TaskCldrPage) — 설계서 00.공통 v0.84 slide84~89.
// 웹경로: 메인 홈 > 마이페이지 > 업무캘린더. 셸(AppLayout) 안 + sub헤더(뒤로+타이틀 '업무캘린더'). 3뎁스라 BottomNav 숨김.
// M06 은 Figma 전용 노드가 없어 마이페이지 캘린더 섹션(MyPage_Calendar)·base Calendar 를 확장해 조립한다.
//
// 구성(위→아래):
//   ① 월 캘린더(base Calendar) — 즐겨찾기(찜) 공고 + 개인 일정이 있는 날 dot 표식.
//   ② 선택 날짜 헤더('2026년 8월 12일') — bg-primary-faint.
//   ③ 선택 날짜의 일정 카드(전체) — 관심 공고(공고번호+공고명) / 개인 일정(제목). 없으면 '표시할 일정이 없습니다.'
//   ④ 일정 등록하기 버튼 → M08 등록 시트.
// 바텀시트(M07 상세·M08 등록/수정)는 컨테이너(BottomSheet)를 페이지가 소유, 콘텐츠만 분리(TaskCldrDtl/TaskCldrReg).
// 삭제(M09)는 AlertModal + 완료 토스트. 데이터=목업(설계서 항목명/형식), 동작=API 경계 스텁(console.log + '// 추후 …').
import { useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { Calendar } from '@/ui/common/base/Calendar'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { Toast } from '@/ui/common/composites/Toast'
import { TaskCldrDtl } from '@/ui/biz/cm/taskCldr/TaskCldrDtl'
import { TaskCldrReg, type TaskCldrRegHandle } from '@/ui/biz/cm/taskCldr/TaskCldrReg'
import type { TaskCldrRegSchemaValues } from '@/ui/biz/cm/taskCldr/TaskCldrReg.schema'
import { cn } from '@/utils/cn'
import type { TaskCldrItem, MyPageSchdlSeCd } from '@/types/cm'

// 구분별 배지 — 물품=blue · 공사=green · 개인=yellow(근사, MyPage_Calendar 와 동일 관례).
const SCHDL_BADGE: Record<MyPageSchdlSeCd, { label: string; color: 'blue' | 'green' | 'yellow' }> = {
  goods: { label: '물품', color: 'blue' },
  construction: { label: '공사', color: 'green' },
  personal: { label: '개인', color: 'yellow' },
}

// ── 목업 (설계서 slide84 예시 + 항목명/형식) ─────────────────────────────────
// 날짜는 '오늘' 기준 상대값 — 캘린더 기본 노출 월에 표식이 보이도록. API 연동 시 실제 일자로 교체.
const schdlDt = (offset: number) => dayjs().add(offset, 'day').format('YYYY-MM-DD')
// ⚠️ 임시 목업 — API 연동 시 이 상수와 아래 로직을 교체(cmService.selectTaskCldrList / getSchdlDtl).
const MOCK_TASK_CLDR: TaskCldrItem[] = [
  {
    id: '1',
    schdlSeCd: 'goods',
    schdlDt: schdlDt(0), // 오늘
    pbancNo: '공고번호 000 00 0000',
    pbancNm: '입찰공고명이 표시됩니다',
  },
  {
    id: '2',
    schdlSeCd: 'construction',
    schdlDt: schdlDt(0), // 오늘(같은 날 2건 이상 표시 확인)
    pbancNo: '공고번호 000 00 0000',
    pbancNm: '작성한 스케줄이 있는 경우 표시됩니다',
  },
  {
    id: 'p1',
    schdlSeCd: 'personal',
    schdlDt: schdlDt(0), // 오늘
    schdlTtl: '작성한 스케줄이 있는 경우 표시됩니다.',
    schdlCn: '1. 사용자가 작성한 내용 1\n2. 사용자가 작성한 내용 2\n3. 사용자가 작성한 내용 3',
    wrtYmd: schdlDt(0),
  },
  {
    id: '3',
    schdlSeCd: 'goods',
    schdlDt: schdlDt(3),
    pbancNo: '공고번호 000 00 0000',
    pbancNm: '입찰공고명이 표시됩니다',
  },
  {
    id: 'p2',
    schdlSeCd: 'personal',
    schdlDt: schdlDt(6),
    schdlTtl: '납품기한 확인',
    schdlCn: '간편 아침식 제조 납품 기한 최종 확인',
    wrtYmd: schdlDt(1),
  },
]

// 일정 카드 — 도메인 전용 조립물(MyPage_Calendar ScheduleCard 와 동일 시각). 관심 공고=공고번호+공고명 / 개인=제목.
function ScheduleCard({ item, onClick }: { item: TaskCldrItem; onClick: () => void }) {
  const badge = SCHDL_BADGE[item.schdlSeCd]
  const title = item.pbancNm ?? item.schdlTtl ?? ''
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
          {item.pbancNo && (
            <span className="min-w-px flex-1 truncate text-krds-body-md leading-normal text-krds-text-muted">
              {item.pbancNo}
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

export function TaskCldrPage() {
  const navigate = useNavigate()
  // 마이페이지(M01) 캘린더에서 날짜를 눌러 진입하면 그 날짜(schdlDt)가 선택된 상태로 연다.
  //   Calendar 는 value 로 표시 월(cursor)을 잡으므로 다른 달 날짜여도 그 달이 열린다.
  //   [더보기] 로 진입하면 state 없음 → 오늘.
  const navState = useLocation().state as { schdlDt?: string } | null

  // 일정 목록(목업) — 등록/수정/삭제 시 로컬 반영(API 연동 시 서버 재조회로 교체).
  const [items, setItems] = useState<TaskCldrItem[]>(MOCK_TASK_CLDR)
  // 선택 날짜 — 진입 시 전달된 날짜, 없으면 오늘.
  const [selected, setSelected] = useState<string>(
    () => navState?.schdlDt ?? dayjs().format('YYYY-MM-DD'),
  )

  // 바텀시트/모달/토스트 상태.
  const [detailItem, setDetailItem] = useState<TaskCldrItem | null>(null) // M07 상세
  const [regSheet, setRegSheet] = useState<{ mode: 'reg' | 'edit'; target: TaskCldrItem | null } | null>(null) // M08 등록/수정
  const [deleteTarget, setDeleteTarget] = useState<TaskCldrItem | null>(null) // M09 삭제 확인
  const [toast, setToast] = useState<string | null>(null)
  const regRef = useRef<TaskCldrRegHandle>(null)

  const scheduledDates = useMemo(() => items.map((it) => it.schdlDt), [items])
  const dayItems = useMemo(() => items.filter((it) => it.schdlDt === selected), [items, selected])
  const dateHeader = dayjs(selected).format('YYYY년 M월 D일')

  // ── 동작 스텁 (API 연동 시 services/queries 로 교체) ──
  // 카드 클릭 — 관심 공고면 해당 공고 이동, 개인 일정이면 M07 상세 바텀시트.
  const handleCardClick = (item: TaskCldrItem) => {
    if (item.schdlSeCd === 'personal') {
      setDetailItem(item)
      return
    }
    // 관심(찜) 입찰공고 → 입찰공고 상세(MUI-BD-01-M02). URL 에 식별자를 두지 않아 일정 항목을 state 로 넘긴다
    // (⚠️ 일정 항목은 공고 상세가 기대하는 아이템 타입이 아니라 상단 요약 일부가 빈다 — API 연동 시 공고 조회로 대체).
    navigate('/bd/bidPbancDtl', { state: item })
  }

  // 등록 시트 열기 — 선택 날짜를 기본값으로.
  const openReg = () => setRegSheet({ mode: 'reg', target: null })
  // 수정 시트 열기(M07 → 수정) — 대상 일정 프리필.
  const openEdit = (item: TaskCldrItem) => {
    setDetailItem(null)
    setRegSheet({ mode: 'edit', target: item })
  }

  // M08 제출(등록/수정) — 목업 반영 + 시트 닫기.
  const handleRegSubmit = (values: TaskCldrRegSchemaValues) => {
    if (regSheet?.mode === 'edit' && regSheet.target) {
      const id = regSheet.target.id
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, schdlDt: values.schdlDt, schdlTtl: values.schdlTtl, schdlCn: values.schdlCn } : it,
        ),
      )
      console.log('[TaskCldr] 일정 수정', id, values) // 추후: cmService.updateSchdl(id, values)
    } else {
      const newItem: TaskCldrItem = {
        id: `personal-${Date.now()}`,
        schdlSeCd: 'personal',
        schdlDt: values.schdlDt,
        schdlTtl: values.schdlTtl,
        schdlCn: values.schdlCn,
        wrtYmd: dayjs().format('YYYY-MM-DD'),
      }
      setItems((prev) => [...prev, newItem])
      setSelected(values.schdlDt) // 등록한 날짜로 선택 이동
      console.log('[TaskCldr] 일정 등록', newItem) // 추후: cmService.createSchdl(values)
    }
    setRegSheet(null)
  }

  // M07 → 삭제 → M09 확인 모달.
  const openDelete = (item: TaskCldrItem) => {
    setDetailItem(null)
    setDeleteTarget(item)
  }
  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    const id = deleteTarget.id
    setItems((prev) => prev.filter((it) => it.id !== id))
    console.log('[TaskCldr] 일정 삭제', id) // 추후: cmService.deleteSchdl(id)
    setDeleteTarget(null)
    setToast('삭제되었습니다.')
  }

  const regDefaultValues: TaskCldrRegSchemaValues = regSheet?.target
    ? {
        schdlDt: regSheet.target.schdlDt,
        schdlTtl: regSheet.target.schdlTtl ?? '',
        schdlCn: regSheet.target.schdlCn ?? '',
      }
    : { schdlDt: selected, schdlTtl: '', schdlCn: '' }

  return (
    <div className="flex w-full flex-col">
      {/* ① 월 캘린더 — 업무 있는 날 dot. 328폭 자동 중앙, 상하 16. */}
      <div className="px-krds-8 pt-krds-8">
        <Calendar
          mode="single"
          value={selected}
          onChange={(v) => setSelected(v as string)}
          scheduledDates={scheduledDates}
        />
      </div>

      {/* ② 선택 날짜 헤더 — bg-primary-faint. */}
      <div className="flex min-h-[56px] w-full items-center border-t border-krds-border-divider bg-krds-bg-primary-faint px-krds-8">
        <h2 className="text-krds-body-lg font-bold leading-normal text-krds-text-ink">{dateHeader}</h2>
      </div>

      {/* ③ 선택 날짜 일정 카드(전체) / 없으면 안내. ④ 일정 등록하기 버튼. */}
      <div className="flex flex-col gap-krds-8 px-krds-8 pb-krds-8 pt-krds-8">
        {dayItems.length > 0 ? (
          dayItems.map((it) => <ScheduleCard key={it.id} item={it} onClick={() => handleCardClick(it)} />)
        ) : (
          <p className="py-krds-8 text-center text-krds-body-md text-krds-text-muted">
            표시할 일정이 없습니다.
          </p>
        )}

        <Button variant="secondary" className="w-full" onClick={openReg}>
          <Icon name="Add" size={20} aria-hidden />
          일정 등록하기
        </Button>
      </div>

      {/* M07 일정 상세 정보 — footer: [삭제][수정] (컨테이너/footer 페이지 소유). */}
      <BottomSheet
        open={detailItem !== null}
        onOpenChange={(open) => !open && setDetailItem(null)}
        title="일정 상세 정보"
        footer={
          detailItem && (
            <ButtonGroup
              layout="asymmetric"
              items={[
                { label: '삭제', variant: 'secondary', onClick: () => openDelete(detailItem) },
                { label: '수정', variant: 'primary', onClick: () => openEdit(detailItem) },
              ]}
            />
          )
        }
      >
        {detailItem && <TaskCldrDtl item={detailItem} />}
      </BottomSheet>

      {/* M08 일정 등록/수정 — 동일 폼(mode 로 타이틀/버튼만 구분). footer: [취소][등록|수정]. */}
      <BottomSheet
        open={regSheet !== null}
        onOpenChange={(open) => !open && setRegSheet(null)}
        title={regSheet?.mode === 'edit' ? '일정 수정' : '일정 등록'}
        footer={
          regSheet && (
            <ButtonGroup
              layout="asymmetric"
              items={[
                { label: '취소', variant: 'secondary', onClick: () => setRegSheet(null) },
                {
                  label: regSheet.mode === 'edit' ? '수정' : '등록',
                  variant: 'primary',
                  onClick: () => regRef.current?.submit(),
                },
              ]}
            />
          )
        }
      >
        {regSheet && (
          <TaskCldrReg ref={regRef} defaultValues={regDefaultValues} onSubmit={handleRegSubmit} />
        )}
      </BottomSheet>

      {/* M09 삭제 확인 (설계서 slide88) */}
      <AlertModal
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        variant="error"
        title="일정 삭제"
        description="업무 캘린더에 등록된 일정을 삭제합니다. 삭제된 일정은 복구할 수 없습니다. 정말 삭제할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '삭제', onClick: handleConfirmDelete }}
      />

      {/* 삭제 완료 토스트 (설계서 slide86) */}
      <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
        {toast}
      </Toast>
    </div>
  )
}
TaskCldrPage.displayName = 'TaskCldrPage'
