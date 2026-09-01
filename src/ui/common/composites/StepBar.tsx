// Figma Step bar(9300-28323) 1:1.
// atomic 을 별도 파일로 분리하지 않고 한 composite 안에 모두 정의 (사용자 요청).
// items[] + orientation 만 받아 vertical/horizontal 모두 표현한다.
//
// 데이터 스키마:
//   { label, state, depth?: 1|2 }
//   state: 'done' | 'doing' | 'todo' | 'done-red'
//
// 디자인 사양 요약 (Figma 픽셀 기준):
//   1depth chip — h-40 pill: 좌 dot 20 + 텍스트 19 Bold
//     done   : bg white  + border step-blue + dot bg step-blue + check / 텍스트 step-blue
//     doing  : bg danger + border 0 + dot border white + 텍스트 white
//     todo   : bg white  + border step-blue + dot border step-blue (빈) / 텍스트 step-blue
//   2depth row — h-44: 좌 connector(2px 세로선) + dot 14 + 텍스트 17
//     done   : dot bg step-blue + 12 check, 텍스트 ink 17 Regular
//     done-red: dot bg danger + 12 check, 텍스트 ink 17 Regular
//     doing  : dot bg danger (빈), 텍스트 danger 17 Bold
//     todo   : dot bg field grey, 텍스트 ink 17 Regular
//
// vertical 모드는 2depth connector 가 항목 사이를 잇는다(마지막 항목은 connector 안 그림).
// horizontal 은 1depth chip 을 가로 나열하고, 칩 사이를 8px×1px step-blue 연결선(Figma line)으로 잇는다
//   (디자인상 horizontal-2depth 없음).
//   - 가로 스와이프 스크롤 유지 + 우측 끝 펼침(▾) 버튼 → '진행현황' 바텀시트(세로 StepBar 전체 + 확인)로 전개.
//     (좌/우 사이드 스크롤 화살표는 폐지 — Figma 9300-28323/28417.)
import * as React from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { cn } from '@/utils/cn'

export type StepState = 'done' | 'doing' | 'todo' | 'done-red'
export type StepDepth = 1 | 2

export interface StepItem {
  label: React.ReactNode
  state: StepState
  /** 들여쓰기/dot 사이즈. 기본 1. */
  depth?: StepDepth
  /** vertical(진행현황 바텀시트) 항목 클릭 — 있으면 행이 버튼이 된다(연관 목록 이동 등). */
  onClick?: () => void
}

export interface StepBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StepItem[]
  /** 기본 'vertical'. */
  orientation?: 'vertical' | 'horizontal'
  /**
   * horizontal 펼침(▾) 바텀시트에 보일 세로 StepBar 항목.
   * 생략 시 items 사용(보통 컴팩트 1depth 가로 항목을 그대로 세로로 표시).
   * 상세 진행현황(1·2depth 혼합)을 보이려면 depth 포함 배열을 주입.
   */
  sheetItems?: StepItem[]
  /** 펼침 바텀시트 제목. 기본 '진행현황'. */
  sheetTitle?: string
}

// ─── 1depth chip (pill) ──────────────────────────────────────────────────────
function Chip1Depth({
  label,
  state,
  className,
}: {
  label: React.ReactNode
  state: StepState
  className?: string
}) {
  // done-red 는 1depth 에 정의된 디자인 없음 → done 처럼 처리
  const isDoing = state === 'doing'
  const wrapCls = cn(
    'inline-flex h-10 shrink-0 items-center gap-krds-3 rounded-krds-full pl-krds-5 pr-krds-7',
    isDoing ? 'bg-krds-action-danger' : 'border border-krds-step-blue bg-background',
    className,
  )
  const textCls = cn(
    'text-[19px] font-bold leading-normal whitespace-nowrap',
    isDoing ? 'text-white' : 'text-krds-step-blue',
  )
  return (
    <div className={wrapCls}>
      <Dot1Depth state={state} />
      <span className={textCls}>{label}</span>
    </div>
  )
}

function Dot1Depth({ state }: { state: StepState }) {
  // 20×20 동그라미
  if (state === 'done' || state === 'done-red') {
    return (
      <span className="flex size-5 items-center justify-center rounded-full bg-krds-step-blue text-white">
        <Icon name="Check" size={14} aria-hidden />
      </span>
    )
  }
  if (state === 'doing') {
    return <span className="block size-5 rounded-full border border-white" />
  }
  // todo
  return <span className="block size-5 rounded-full border border-krds-step-blue" />
}

// ─── 2depth row (with connector) ────────────────────────────────────────────
function Row2Depth({
  label,
  state,
  isFirst,
  isLast,
}: {
  label: React.ReactNode
  state: StepState
  isFirst: boolean
  isLast: boolean
}) {
  // dot 색
  const dotColorCls = (() => {
    switch (state) {
      case 'done':
        return 'bg-krds-step-blue'
      case 'done-red':
        return 'bg-krds-action-danger'
      case 'doing':
        return 'bg-krds-action-danger'
      case 'todo':
      default:
        return 'bg-krds-border-field'
    }
  })()
  const showCheck = state === 'done' || state === 'done-red'
  const textCls = cn(
    'min-w-px flex-1 text-[17px] leading-[1.3]',
    state === 'doing' ? 'font-bold text-krds-action-danger' : 'font-normal text-krds-text-ink',
  )
  return (
    <div className="flex w-full items-center gap-krds-3">
      {/* connector + dot column — 너비 40px (pl-20 + dot center) */}
      <div className="relative flex h-11 shrink-0 items-start pl-5 pr-3">
        {/* 세로 connector 라인(#C1D1EE=border-field) — dot 중심(22px) 기준 위/아래 반쪽.
            위쪽: 첫 항목이 아니면(윗 알약/dot 과 연결). 아래쪽: 마지막 항목이 아니면(아랫 항목과 연결).
            항목 사이 gap 0 + 1depth 알약(전체너비, dot 내장)이 노드 → 조달계획~대금청구 끊김 없이 이어짐. */}
        {!isFirst && (
          <span
            aria-hidden
            className="absolute left-[20px] top-0 h-[22px] w-0.5 bg-krds-border-field"
          />
        )}
        {!isLast && (
          <span
            aria-hidden
            className="absolute left-[20px] top-[22px] h-[22px] w-0.5 bg-krds-border-field"
          />
        )}
        {/* dot — 14×14, top 15px (Figma) */}
        <span
          className={cn(
            'absolute left-[14px] top-[15px] flex size-[14px] items-center justify-center rounded-full text-white',
            dotColorCls,
          )}
        >
          {showCheck && <Icon name="Check" size={10} aria-hidden />}
        </span>
      </div>
      <p className={textCls}>{label}</p>
    </div>
  )
}

// ─── horizontal (가로 스와이프 스크롤 + 우측 펼침 버튼 → 진행현황 바텀시트) ──────────
// 칩을 가로로 나열하고 좌우 스와이프로 스크롤한다(좌/우 사이드 화살표 폐지).
// 우측 끝 펼침(▾) 버튼 터치 → '진행현황' 바텀시트에 세로 StepBar 전체(+확인)를 띄운다.
function StepBarHorizontal({
  className,
  items,
  sheetItems,
  sheetTitle = '진행현황',
  ...props
}: Omit<StepBarProps, 'orientation'>) {
  const [sheetOpen, setSheetOpen] = React.useState(false)
  // 바텀시트에 보일 세로 목록 — 별도 주입 없으면 가로 항목을 그대로 세로로.
  // 항목에 onClick 이 있으면 클릭 즉시 시트를 닫고 실행(확인 버튼 없이 바로 이동/전환).
  const fullItems = (sheetItems ?? items).map((it) =>
    it.onClick
      ? {
          ...it,
          onClick: () => {
            setSheetOpen(false)
            it.onClick?.()
          },
        }
      : it,
  )

  // 칩이 많아 doing 칩이 화면 밖일 수 있음 → 렌더/항목 변경 시 doing 칩을 보이는 위치로 스크롤.
  const listRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const list = listRef.current
    const doing = list?.querySelector<HTMLElement>('[data-step-state="doing"]')
    if (!list || !doing) return
    // 컨테이너 내부 가로 스크롤만 조정(scrollIntoView 는 조상 세로 스크롤까지 움직일 수 있어 직접 계산).
    const target = doing.offsetLeft - (list.clientWidth - doing.offsetWidth) / 2
    list.scrollLeft = Math.max(0, target)
  }, [items])

  return (
    <div className={cn('relative w-full bg-background', className)} {...props}>
      <div
        ref={listRef}
        role="list"
        aria-label="진행 단계"
        // 가로 스크롤 영역 키보드 접근(KWCAG/axe scrollable-region-focusable) — 초점 진입 + 방향키 스크롤.
        tabIndex={0}
        // 칩 사이 간격은 연결선(8px line)이 담당 → 가로 gap 0. 우측 펼침 버튼 자리만큼 pr 확보.
        className="flex w-full items-center overflow-x-auto overflow-y-hidden scrollbar-none pr-16 [&::-webkit-scrollbar]:hidden focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {/* 칩 사이 연결선 — Figma 8px×1px step-blue. 첫 칩 앞엔 없음(i>0). */}
            {i > 0 && <span aria-hidden className="h-px w-krds-5 shrink-0 bg-krds-step-blue" />}
            <div role="listitem" data-step-state={item.state}>
              <Chip1Depth label={item.label} state={item.state} />
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* 우측 끝 펼침(▾) 버튼 — 터치 시 진행현황 바텀시트. 좌/우 스크롤 화살표 대체. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
        {/* 칩 위로 투명→#ECF1FA fade — 버튼 안쪽 칩이 서서히 사라지게 */}
        <div
          aria-hidden
          className="h-full w-5 bg-gradient-to-r from-transparent to-krds-bg-primary-faint"
        />
        <span className="pointer-events-auto flex h-full items-center bg-krds-bg-primary-faint">
          <button
            type="button"
            aria-label="진행현황 전체 보기"
            aria-haspopup="dialog"
            onClick={() => setSheetOpen(true)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-krds-border-field bg-background text-krds-text-ink"
          >
            <Icon name="ArrowForwardIos" size={20} aria-hidden className="rotate-90" />
          </button>
        </span>
      </div>

      {/* 진행현황 바텀시트 — 세로 StepBar 전체.
          하단 버튼 없음(v0.87 검토 6번 기획 확정: 바로가기/닫기 제거, 단계 클릭으로 바로 이동·X로 닫기). */}
      <BottomSheet open={sheetOpen} onOpenChange={setSheetOpen} title={sheetTitle}>
        <StepBar orientation="vertical" items={fullItems} />
      </BottomSheet>
    </div>
  )
}

// ─── StepBar ────────────────────────────────────────────────────────────────
function StepBar({
  className,
  items,
  orientation = 'vertical',
  sheetItems,
  sheetTitle,
  ...props
}: StepBarProps) {
  if (orientation === 'horizontal') {
    return (
      <StepBarHorizontal
        className={className}
        items={items}
        sheetItems={sheetItems}
        sheetTitle={sheetTitle}
        {...props}
      />
    )
  }

  // vertical — 연속 rail 타임라인. 항목 사이 gap 0(선 연속), 1depth 는 full-width 알약(dot 내장),
  // 2depth 는 dot+텍스트(좌측 connector). connector 가 모든 항목을 위/아래로 이어 끊기지 않는다.
  return (
    <div
      className={cn('flex w-full flex-col items-stretch', className)}
      role="list"
      aria-label="진행 단계"
      {...props}
    >
      {items.map((item, i) => {
        const depth = item.depth ?? 1
        const nextDepth = items[i + 1]?.depth ?? 1
        // 연속 1depth 사이엔 2depth connector 가 없어 라인이 안 보인다 → 살짝 띄우고(gap) 짧은 세로선 추가.
        // (1depth→2depth 는 2depth row 가 위쪽 connector 를 그리므로 불필요)
        const gapConnector = depth === 1 && i < items.length - 1 && nextDepth === 1
        const content =
          depth === 1 ? (
            // full-width 알약 + dot 을 connector(x≈21)에 맞춰 pl-krds-7(12px)
            <Chip1Depth
              label={item.label}
              state={item.state}
              className="flex w-full pl-krds-7 gap-krds-5"
            />
          ) : (
            <Row2Depth
              label={item.label}
              state={item.state}
              isFirst={i === 0}
              isLast={i === items.length - 1}
            />
          )
        return (
          <div key={i} role="listitem" className="w-full">
            {item.onClick ? (
              // onClick 이 있으면 행 전체를 버튼으로 — 진행현황 시트에서 단계 클릭 → 연관 목록 이동 등.
              <button type="button" onClick={item.onClick} className="block w-full text-left">
                {content}
              </button>
            ) : (
              content
            )}
            {gapConnector && (
              // dot 중심(x≈21) 아래로 짧은 세로 연결선(#C1D1EE=border-field). 칩에 붙여 연속(흰 여백 없음).
              <span aria-hidden className="ml-[20px] block h-2.5 w-0.5 bg-krds-border-field" />
            )}
          </div>
        )
      })}
    </div>
  )
}
StepBar.displayName = 'StepBar'

export { StepBar }
