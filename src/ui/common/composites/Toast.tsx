// Figma m_toast_popup(9300-28497) 1:1.
//
// 위치 사양 (Figma comment):
//   페이지 하단에서 16px 위 · 너비 해상도 유동 · 좌우 여백 16px
//   → fixed bottom-4 left-4 right-4
//
// 시각:
//   bg rgba(15,49,110,0.9)  — D2B blue-dark 90% 알파 (action-primary-active 와 같은 hex + alpha)
//   padding 8 16, rounded-8, 15px Bold white
//
// 동작:
//   open=true 일 때 표시, duration(ms) 경과 후 자동으로 onClose 호출
//   duration=0 또는 undefined 이면 자동 닫힘 없음(수동 onClose 호출)
//   open false→true 변화 시 fade-in (opacity transition)
//
// 사용 예:
//   const [open, setOpen] = useState(false)
//   <Button onClick={() => setOpen(true)}>저장</Button>
//   <Toast open={open} onClose={() => setOpen(false)} duration={2000}>
//     저장되었습니다.
//   </Toast>
import * as React from 'react'

import { cn } from '@/utils/cn'

export interface ToastProps {
  /** 표시 여부. */
  open: boolean
  /** duration(ms) 경과 후 호출. duration 미주입/0 시 자동 호출 안 함. */
  onClose?: () => void
  /** 자동 닫힘까지의 시간(ms). 기본 2000. 0 또는 undefined 이면 자동 닫힘 없음. */
  duration?: number
  /** 토스트 메시지. */
  children: React.ReactNode
  /** 추가 className(z-index, 위치 미세 조정 등). */
  className?: string
}

function Toast({
  open,
  onClose,
  duration = 2000,
  children,
  className,
}: ToastProps) {
  React.useEffect(() => {
    if (!open) return
    if (!duration || duration <= 0) return
    const id = window.setTimeout(() => onClose?.(), duration)
    return () => window.clearTimeout(id)
  }, [open, duration, onClose])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!open}
      className={cn(
        'pointer-events-none fixed inset-x-4 bottom-4 z-100',
        'flex items-center rounded-krds-8 px-krds-8 py-krds-5',
        'text-[15px] font-bold leading-normal text-white wrap-break-word',
        'transition-opacity duration-200',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
        className,
      )}
      style={{ backgroundColor: 'rgba(15, 49, 110, 0.9)' }}
    >
      <p className="min-w-px flex-1 wrap-break-word">{children}</p>
    </div>
  )
}
Toast.displayName = 'Toast'

export { Toast }
