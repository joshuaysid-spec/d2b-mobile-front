// Figma m_popup_header (node 9300-28484) 기반 — 화면 전체를 덮는 풀스크린 팝업.
// 헤더만 Figma 에 정의되어 있고, 본문(body) + 옵션 footer 는 우리 컨벤션으로 구성한다.
// raw/dialog 의 DialogContent 는 화면 중앙 카드 구조라 맞지 않아 → Radix Dialog 프리미티브 직접 사용.
//
// 구조 (위에서 아래로):
//   ┌─ Header (h-72, bg-krds-bg-primary-faint, border-b krds-border-divider)
//   │   title(19 Bold ink, flex-1 truncate) │ utilities (각 70w × 66h: [초기화]?[닫기])
//   ├─ Body  — flex-1 overflow-y-auto bg-background
//   └─ Footer (옵션) — pb safe-area
//
// Props:
// ┌──────────────┬─────────────────────────────────┬──────────────────────────────────────────┐
// │ open         │ boolean                         │ 표시 여부 (controlled)                   │
// │ onOpenChange │ (open: boolean) => void         │ 열림/닫힘 변경                           │
// │ title        │ ReactNode                       │ 19 Bold 타이틀                           │
// │ rightActions │ FullPopupAction[]?              │ 우측 액션 (최대 2개). 미주입 시 자동 닫기 │
// │ footer       │ ReactNode?                      │ 하단 footer (보통 ButtonGroup)           │
// │ dismissable  │ boolean = true                  │ Esc / 외부 클릭 닫힘 허용                │
// │ className    │ string?                         │ Content 추가 클래스                      │
// │ children     │ ReactNode                       │ 본문                                     │
// └──────────────┴─────────────────────────────────┴──────────────────────────────────────────┘
//
// 사용 예:
//   // 1) 기본 — 닫기 1개 자동
//   <FullPopup open={open} onOpenChange={setOpen} title="공지사항">
//     <NoticeList />
//   </FullPopup>
//
//   // 2) 초기화 + 닫기 (필터 팝업 패턴)
//   <FullPopup
//     open={open}
//     onOpenChange={setOpen}
//     title="조건 검색"
//     rightActions={[
//       { icon: 'Refresh', label: '초기화', onClick: handleReset },
//       { icon: 'Close',   label: '닫기',   onClick: () => setOpen(false) },
//     ]}
//     footer={<Button variant="primary" className="w-full">검색</Button>}
//   >
//     <FilterForm />
//   </FullPopup>
//
//   // 3) 커스텀 아이콘(ReactNode) 사용
//   <FullPopup
//     open={open}
//     onOpenChange={setOpen}
//     title="상세 정보"
//     rightActions={[{ icon: <CustomSvg />, label: '닫기', onClick: () => setOpen(false) }]}
//   >
//     ...
//   </FullPopup>
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface FullPopupAction {
  /** Material 아이콘 이름(REGISTRY 키) 또는 커스텀 ReactNode */
  icon: IconName | React.ReactNode
  /** 15 Bold 라벨 ("닫기" / "초기화" 등). 시각 텍스트이자 버튼 aria-label 로 쓰여 string 으로 강제. */
  label: string
  /** 클릭 핸들러. 미주입 시 클릭해도 자동 닫힘 동작 없음(사용자 책임). */
  onClick?: () => void
}

export interface FullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 19 Bold 타이틀 */
  title: React.ReactNode
  /** 우측 액션. 미주입 시 자동으로 닫기 1개 표시. 2개까지 권장. */
  rightActions?: FullPopupAction[]
  /** 하단 footer(보통 ButtonGroup). 옵션. */
  footer?: React.ReactNode
  /** Esc / 외부 클릭으로 닫을지. 기본 true. */
  dismissable?: boolean
  className?: string
  children?: React.ReactNode
}

// ──────────────────────────────────────────────────────────────────────────
// Internal: 우측 유틸리티 버튼 (70w × 66h, 아이콘 24 + 15 Bold 라벨, gap-3)
// ──────────────────────────────────────────────────────────────────────────
interface UtilityButtonProps {
  icon: IconName | React.ReactNode
  label: string
  onClick?: () => void
}

const UtilityButton = ({ icon, label, onClick }: UtilityButtonProps) => {
  const iconNode =
    typeof icon === 'string' ? (
      <Icon name={icon as IconName} size={24} aria-hidden />
    ) : (
      <span
        aria-hidden
        className="inline-flex h-[24px] w-[24px] items-center justify-center"
      >
        {icon}
      </span>
    )

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'inline-flex h-[66px] w-[70px] shrink-0 flex-col items-center justify-center gap-[3px] rounded-krds-8',
        'text-krds-text-ink',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
        'active:opacity-70',
      )}
    >
      {iconNode}
      <span className="text-[15px] font-bold leading-[1.2]">{label}</span>
    </button>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// FullPopup
// ──────────────────────────────────────────────────────────────────────────
const FullPopup = ({
  open,
  onOpenChange,
  title,
  rightActions,
  footer,
  dismissable = true,
  className,
  children,
}: FullPopupProps) => {
  // rightActions 미주입 시 자동 닫기 1개. onOpenChange 참조 안정성 위해 useMemo.
  const actions: FullPopupAction[] = React.useMemo(
    () =>
      rightActions && rightActions.length > 0
        ? rightActions
        : [{ icon: 'Close', label: '닫기', onClick: () => onOpenChange(false) }],
    [rightActions, onOpenChange],
  )

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Full screen 이라 dim 은 투명 — 시멘틱만 유지 */}
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-transparent',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        <DialogPrimitive.Content
          onInteractOutside={(e) => {
            if (!dismissable) e.preventDefault()
          }}
          onEscapeKeyDown={(e) => {
            if (!dismissable) e.preventDefault()
          }}
          className={cn(
            'fixed inset-0 z-50 flex flex-col bg-background',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            'duration-300 ease-out',
            className,
          )}
        >
          {/* Safe-area-top 스페이서 — 노치/Dynamic Island 영역만큼 헤더와 같은 배경으로 채움.
              헤더 콘텐츠 높이(h-72)를 safe-area 와 분리해 Figma 1:1 고정 유지. */}
          <div
            aria-hidden
            className="shrink-0 bg-krds-bg-primary-faint"
            style={{ height: 'env(safe-area-inset-top)' }}
          />

          {/* Header — h-72 고정(Figma 1:1) */}
          <div
            className={cn(
              'flex h-[72px] shrink-0 items-center gap-[16px] border-b border-krds-border-divider bg-krds-bg-primary-faint',
              'pl-[16px]',
            )}
          >
            <DialogPrimitive.Title
              className={cn(
                'min-w-0 flex-1 truncate text-[19px] font-bold leading-normal text-krds-text-ink',
              )}
            >
              {title}
            </DialogPrimitive.Title>

            <div className="flex shrink-0 items-center">
              {actions.slice(0, 2).map((action, i) => (
                <UtilityButton
                  key={i}
                  icon={action.icon}
                  label={action.label}
                  onClick={action.onClick}
                />
              ))}
            </div>
          </div>

          {/* Body — flex-1 scrollable */}
          <div className="flex-1 overflow-y-auto bg-background">{children}</div>

          {/* Footer — 옵션, safe-area-bottom 보호 */}
          {footer && (
            <div
              className={cn(
                'shrink-0 bg-background px-krds-8 pt-krds-5',
                'pb-[max(16px,env(safe-area-inset-bottom))]',
              )}
            >
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
FullPopup.displayName = 'FullPopup'

export { FullPopup }
