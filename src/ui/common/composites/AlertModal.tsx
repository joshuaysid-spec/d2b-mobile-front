// Figma m_modal — node 9300-28651 / 9300-28663 / 9300-28665.
//
// 가운데 정렬 알림 모달. 외곽 dim(black/50) + 328 고정폭 카드 + 옵션 아이콘(36px) + 메인/보조 텍스트 + 1~2 버튼.
//
// raw/dialog 조합 + Content/Overlay 만 primitive:
//  - raw(@/ui/raw/dialog) 에서 가져오는 것: Dialog(Root) · DialogPortal · DialogTitle · DialogDescription.
//    (raw 의 Dialog/Portal 은 사실상 DialogPrimitive.X 재export 라 동작 동일하지만, 통일성 위해 raw 경유.)
//  - primitive(@radix-ui/react-dialog) 로 직접 쓰는 것: DialogPrimitive.Content · DialogPrimitive.Overlay.
//    raw 는 bare Content 를 export 안 함 — raw 의 DialogContent 는 닫기 X 가 강제로 박혀 있고
//    overlay(bg-black/80)·중앙 폭(max-w-lg)이 고정이라 328 알림 카드 디자인과 충돌. 따라서 위치/딤
//    제어가 필요한 Content·Overlay 만 primitive 로 직접 구성한다(raw DialogContent 는 미사용).
//  - raw 의 DialogTitle/DialogDescription 도 기본 className(text-lg / text-muted-foreground)을 KRDS·sr-only
//    로 덮어써야 해 cn() 으로 오버라이드한다(tailwind-merge 가 충돌 해결).
//
// Props:
//   open / onOpenChange         — Radix Dialog open state 제어
//   variant?                    — 'check' | 'error' | 'info'(기본) | 'none'  · 36px 알림 아이콘 자동 매핑
//   icon?                       — ReactNode · 주입 시 variant 매핑 무시하고 그대로 렌더
//   title?                      — 17 Bold 메인 메시지 (text-center)
//   description?                — 17 Regular 보조 메시지 (text-center)
//   primaryAction               — { label, onClick? } · 필수. 풀폭(1버튼) 또는 우측(2버튼) primary
//   secondaryAction?            — { label, onClick? } · 주입 시 좌측 secondary 추가 → 2버튼 split
//   dismissable?                — 기본 false. true 면 Esc / 외부 클릭으로 닫힘 허용
//   className?                  — 모달 카드(DialogContent) 추가 className
//
// onClick 핸들러는 호출 후 onOpenChange(false) 자동 호출. 핸들러 없어도 닫힘은 동작.
//
// 사용 예 1) 단일 확인 모달
//   <AlertModal
//     open={open}
//     onOpenChange={setOpen}
//     variant="check"
//     title="신청이 완료되었습니다"
//     primaryAction={{ label: '확인' }}
//   />
//
// 사용 예 2) 위험 액션 확인 (2버튼)
//   <AlertModal
//     open={open}
//     onOpenChange={setOpen}
//     variant="error"
//     title="삭제하시겠습니까?"
//     description="삭제된 데이터는 복구할 수 없습니다."
//     secondaryAction={{ label: '취소' }}
//     primaryAction={{ label: '삭제', onClick: handleDelete }}
//   />
//
// 사용 예 3) 아이콘 없는 안내
//   <AlertModal
//     open={open}
//     onOpenChange={setOpen}
//     variant="none"
//     title="알림"
//     description="저장되었습니다."
//     primaryAction={{ label: '확인' }}
//   />
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import {
  Dialog,
  DialogPortal,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@/ui/raw/dialog'
import { Icon, type IconName } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'
import { ButtonGroup, type ButtonGroupItem } from '@/ui/common/composites/ButtonGroup'

export type AlertModalVariant = 'check' | 'error' | 'info' | 'none'

export interface AlertModalAction {
  label: React.ReactNode
  onClick?: () => void
}

export interface AlertModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 36px 알림 아이콘 variant. 기본 'info'. 'none' 이면 아이콘 미표시. */
  variant?: AlertModalVariant
  /** 직접 주입 시 variant 매핑 대신 이 노드를 36px 영역에 그대로 표시. */
  icon?: React.ReactNode
  /** 17 Bold 메인 메시지. */
  title?: React.ReactNode
  /** 17 Regular 보조 메시지. */
  description?: React.ReactNode
  /** 필수 primary 액션. 1버튼 모드 시 풀폭. */
  primaryAction: AlertModalAction
  /** 주입 시 좌측 secondary 추가 → 2버튼 split 모드. */
  secondaryAction?: AlertModalAction
  /** 기본 false — alert 는 명시적 액션 필요. true 면 Esc / 외부 클릭으로 닫힘. */
  dismissable?: boolean
  /**
   * 타이틀+X 닫기 변형(Figma m_modal_contents 8308:67237, v0.87 검토 7·11·57 계열) —
   * true 면 아이콘 없이 타이틀(19 Bold) 좌측 + X 닫기 우측, 본문 좌측 정렬로 렌더.
   */
  titleClose?: boolean
  className?: string
}

// variant → (Icon name, color 토큰) 매핑. hex 직접 금지 — 토큰 변수만.
const VARIANT_ICON: Record<
  Exclude<AlertModalVariant, 'none'>,
  { name: IconName; color: string }
> = {
  check: {
    name: 'CheckCircle',
    color: 'var(--krds-d2b-blue-check)',
  },
  // 삭제(error) — Warning 아이콘(FILLED_BY_DEFAULT 라 채움) · 색은 pink(#ff6d93).
  error: {
    name: 'Warning',
    color: 'var(--krds-d2b-pink)',
  },
  // info — 완료(check) 와 동일하게 CheckCircle · blue-check.
  info: {
    name: 'CheckCircle',
    color: 'var(--krds-d2b-blue-check)',
  },
}

const AlertModal = ({
  open,
  onOpenChange,
  variant = 'info',
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  dismissable = false,
  titleClose = false,
  className,
}: AlertModalProps) => {
  const close = React.useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const handlePrimary = React.useCallback(() => {
    primaryAction.onClick?.()
    close()
  }, [primaryAction, close])

  const handleSecondary = React.useCallback(() => {
    secondaryAction?.onClick?.()
    close()
  }, [secondaryAction, close])

  // 아이콘 렌더 — icon prop 우선, 그 다음 variant 매핑. variant='none'·titleClose 변형이면 미표시.
  const renderIcon = (): React.ReactNode => {
    if (titleClose) return null
    if (icon !== undefined) return icon
    if (variant === 'none') return null
    const mapping = VARIANT_ICON[variant]
    return <Icon name={mapping.name} size={36} color={mapping.color} aria-hidden />
  }

  // ButtonGroup items 구성 — secondaryAction 주입 시 [secondary, primary] split, 아니면 단일 primary
  const buttonItems: ButtonGroupItem[] = React.useMemo(
    () =>
      secondaryAction
        ? [
            {
              label: secondaryAction.label,
              variant: 'secondary',
              onClick: handleSecondary,
            },
            {
              label: primaryAction.label,
              variant: 'primary',
              onClick: handlePrimary,
            },
          ]
        : [
            {
              label: primaryAction.label,
              variant: 'primary',
              onClick: handlePrimary,
            },
          ],
    [secondaryAction, primaryAction.label, handleSecondary, handlePrimary],
  )

  const buttonLayout = secondaryAction ? 'split' : 'single'

  const iconNode = renderIcon()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        {/* Overlay — raw 의 bg-black/80 대신 알림 딤(bg-black/50) 이 필요해 primitive 로 직접 구성. */}
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/50',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'duration-200',
          )}
        />
        {/* Content — 중앙 정렬 + 328 고정폭 + 닫기 X 없는 알림 카드 위치 제어가 필요해 primitive 로 직접 구성. */}
        <DialogPrimitive.Content
          onInteractOutside={(e) => {
            if (!dismissable) e.preventDefault()
          }}
          onEscapeKeyDown={(e) => {
            if (!dismissable) e.preventDefault()
          }}
          className={cn(
            // 위치: 데스크톱 중앙 정렬
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            // width: Figma 328 고정 + 작은 화면 안전 마진(좌우 16px)
            'w-[328px] max-w-[calc(100vw-32px)]',
            // height: 키보드 올라올 때 안 가리도록 dvh 기반 + 내부 스크롤
            'max-h-[calc(100dvh-32px)] overflow-y-auto',
            // 카드 스타일
            'flex flex-col gap-krds-7 bg-white',
            'rounded-krds-xl px-krds-7 py-krds-8',
            // 애니메이션
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'duration-200',
            className,
          )}
        >
          {/* contents — 기본: 아이콘 + title + description 센터. titleClose: 타이틀 좌+X, 본문 좌측 정렬. */}
          <div
            className={cn(
              'flex w-full flex-col gap-krds-5',
              titleClose ? 'items-start' : 'items-center',
            )}
          >
            {iconNode && (
              <div className="flex h-9 w-9 items-center justify-center">
                {iconNode}
              </div>
            )}

            {/* Title — a11y 위해 항상 렌더. title 미주입 시 sr-only 빈값.
                raw DialogTitle 의 기본 text-lg 는 cn() 으로 KRDS 스타일에 덮어씀. */}
            {titleClose ? (
              <div className="flex w-full items-start gap-krds-5">
                <DialogTitle className="min-w-px flex-1 text-left text-[19px] font-bold leading-normal text-krds-text-ink">
                  {title ?? <span className="sr-only">알림</span>}
                </DialogTitle>
                <DialogClose
                  aria-label="닫기"
                  className="inline-flex shrink-0 items-center justify-center rounded-krds-8 p-2.5 -m-2.5 mt-[-7px] text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon name="Close" size={24} aria-hidden />
                </DialogClose>
              </div>
            ) : title ? (
              <DialogTitle
                className={cn(
                  'w-full text-center text-krds-body-md font-bold leading-normal',
                  'text-krds-text-ink',
                )}
              >
                {title}
              </DialogTitle>
            ) : (
              <DialogTitle className="sr-only">알림</DialogTitle>
            )}

            {description ? (
              <DialogDescription
                className={cn(
                  'w-full text-krds-body-md font-normal leading-normal text-krds-text-ink',
                  titleClose ? 'text-left' : 'text-center',
                )}
              >
                {description}
              </DialogDescription>
            ) : (
              // Radix Dialog 는 Description 누락 시 콘솔 경고 — sr-only 빈값으로 폴백.
              <DialogDescription className="sr-only" />
            )}
          </div>

          {/* button group — 1버튼 single / 2버튼 split */}
          <ButtonGroup items={buttonItems} layout={buttonLayout} />
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}
AlertModal.displayName = 'AlertModal'

export { AlertModal }
