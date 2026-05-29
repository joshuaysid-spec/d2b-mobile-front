// Figma m_bottom sheet 9300-28974 — 1:1 모바일(360w) 풀폭 바텀시트.
//
// raw/dialog 조합 + Content/Overlay 만 primitive:
//  - raw(@/ui/raw/dialog) 에서 가져오는 것: Dialog(Root) · DialogPortal · DialogClose ·
//    DialogTitle · DialogDescription. (raw 의 Dialog/Portal/Close 는 사실상 DialogPrimitive.X
//    재export 라 동작 동일하지만, 통일성 위해 raw 경유로 import.)
//  - primitive(@radix-ui/react-dialog) 로 직접 쓰는 것: DialogPrimitive.Content · DialogPrimitive.Overlay.
//    raw 는 bare Content 를 export 안 함 — raw 의 DialogContent 는 화면 중앙 고정 + 닫기 X +
//    overlay(bg-black/80) 가 다 박혀 있어 하단 슬라이드 바텀시트엔 안 맞음. 따라서 위치/딤
//    제어가 필요한 Content·Overlay 만 primitive 로 직접 구성한다(raw DialogContent 는 미사용).
//  - raw 의 DialogTitle/DialogDescription 도 기본 className(text-lg 등)을 KRDS 로 덮어써야 해
//    cn() 으로 오버라이드한다(tailwind-merge 가 충돌 해결).
//
// 레이아웃 (Figma):
//  - 컨테이너: bg-white, rounded-t-[16px], 상단 슬라이드인
//  - 패딩: pt-[20px] pb-[16px] px-[16px], 영역 간 gap-16
//  - title: 19 Bold ink, items-start, close icon 24px (살짝 위쪽 정렬 pt-[3px])
//  - body: flex-1 overflow-y-auto, 17 Regular ink 기본
//  - footer: 옵션. onConfirm 주입 시 자동으로 풀폭 primary "확인" 버튼 생성
//
// 닫힘 경로 (4가지, dismissable=true 기본):
//  1. 배경(dim) 클릭 — Radix onInteractOutside
//  2. X 버튼 클릭 — DialogClose
//  3. Esc 키 — Radix onEscapeKeyDown
//  4. onConfirm 주입 시 확인 버튼 클릭 → onConfirm() 호출 후 자동 닫힘
//
// safe-area: pb 는 max(16px, env(safe-area-inset-bottom)) 로 iOS 홈 인디케이터 보호.
// 키보드 안전: maxHeight 는 vh(=lvh, Large Viewport Height) 기준 고정값 — 키보드가 떠도
//   시트 높이가 줄지 않아 본문이 키보드 아래로 잘리지 않는다. (dvh 는 키보드 시 더 짧아져 부적합)
//
// 컴포넌트는 console.log 안 함 — 콘솔 출력은 사용처(Demo) 책임 (관심사 분리).
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import {
  Dialog,
  DialogPortal,
  DialogClose,
  DialogTitle,
} from '@/ui/raw/dialog'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 시트 상단 타이틀 (19 Bold ink) */
  title: React.ReactNode
  /**
   * 확인 콜백. 주입 시 자동으로 풀폭 primary "확인" 버튼이 footer 에 표시되고
   * 클릭 시 호출 + 시트 자동 닫힘. footer prop 이 있으면 그게 우선.
   */
  onConfirm?: () => void
  /** 확인 버튼 라벨. 기본 "확인". onConfirm 와 함께. */
  confirmLabel?: React.ReactNode
  /** 커스텀 footer (보통 ButtonGroup). onConfirm 보다 우선. */
  footer?: React.ReactNode
  /** Esc / dim 클릭으로 닫을지. 기본 true. */
  dismissable?: boolean
  /** 시트 본문 최대 높이 (vh 단위). 기본 90 (90vh) */
  maxHeightVh?: number
  className?: string
  children?: React.ReactNode
}

const BottomSheet = ({
  open,
  onOpenChange,
  title,
  onConfirm,
  confirmLabel = '확인',
  footer,
  dismissable = true,
  maxHeightVh = 90,
  className,
  children,
}: BottomSheetProps) => {
  // footer 우선순위: 명시된 footer > onConfirm 자동 버튼 > 없음
  const resolvedFooter = React.useMemo(
    () =>
      footer
        ? footer
        : onConfirm
          ? (
              <Button
                variant="primary"
                size="default"
                className="w-full"
                onClick={() => {
                  onConfirm()
                  onOpenChange(false)
                }}
              >
                {confirmLabel}
              </Button>
            )
          : null,
    [footer, onConfirm, confirmLabel, onOpenChange],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        {/* Overlay — raw 의 bg-black/80 대신 바텀시트 딤(bg-black/50) 이 필요해 primitive 로 직접 구성. */}
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/50',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        {/* Content — 하단 고정 + 슬라이드인 위치 제어가 필요해 primitive 로 직접 구성. */}
        <DialogPrimitive.Content
          onInteractOutside={(e) => {
            if (!dismissable) e.preventDefault()
          }}
          onEscapeKeyDown={(e) => {
            if (!dismissable) e.preventDefault()
          }}
          style={{
            maxHeight: `${maxHeightVh}vh`,
            // iOS 홈 인디케이터 영역 보호 — Tailwind arbitrary 가 env() 안의 콤마를 못 다뤄 inline style 사용.
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          }}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 flex flex-col gap-4 bg-white',
            'rounded-t-[16px] shadow-krds-3',
            'pt-[20px] px-[16px]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            'duration-200',
            className,
          )}
        >
          {/* Title container — title 좌측 + close 우측, gap-16, items-start */}
          <div className="flex items-start justify-between gap-4">
            <DialogTitle
              className={cn(
                'min-w-0 flex-1',
                'text-[19px] font-bold leading-normal text-krds-text-ink',
              )}
            >
              {title}
            </DialogTitle>
            <DialogClose
              aria-label="닫기"
              className={cn(
                // 히트 영역 44px 확보 — p-2.5(10px) 로 24+20=44, -m-2.5 로 레이아웃 시프트 상쇄.
                // mt-[-7px] 로 Figma close pt-[3px](상단 살짝 내림) 시각 위치 보존.
                'inline-flex shrink-0 items-center justify-center rounded-krds-8 p-2.5 -m-2.5 mt-[-7px] text-krds-text-ink',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              <Icon name="Close" size={24} aria-hidden />
            </DialogClose>
          </div>

          {/* Body — scrollable, 17 Regular ink */}
          <div className="flex-1 overflow-y-auto text-krds-body-md text-krds-text-ink">
            {children}
          </div>

          {/* Footer — onConfirm 주입 또는 footer prop 명시 시 렌더 */}
          {resolvedFooter && <div>{resolvedFooter}</div>}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}
BottomSheet.displayName = 'BottomSheet'

export { BottomSheet }
