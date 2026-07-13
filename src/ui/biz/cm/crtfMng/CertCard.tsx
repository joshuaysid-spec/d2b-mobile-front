// 인증서 카드 — 발급기관 + 타이틀명 + 유효기간. 인증서 관리/삭제/내보내기에서 공유.
// footer 슬롯(예: 인증서 삭제 버튼) · onClick(선택 카드, 예: 내보내기 목록) 지원.
import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'
import type { CertItem } from '@/types/cert'

export interface CertCardProps {
  cert: CertItem
  /** 카드 하단 슬롯(예: 인증서 삭제 버튼). */
  footer?: ReactNode
  /** 지정 시 카드 전체 클릭(선택) — button 으로 렌더. */
  onClick?: () => void
  className?: string
}

export function CertCard({ cert, footer, onClick, className }: CertCardProps) {
  const inner = (
    <>
      <div className="flex flex-col gap-0.5">
        <span className="text-[17px] font-medium leading-normal text-krds-text-ink">
          {cert.issuer}
        </span>
        <span className="text-[19px] font-bold leading-normal text-krds-text-ink">
          {cert.certNm}
        </span>
        <span className="text-[17px] leading-normal text-krds-text-muted">
          {cert.validUntil}까지 유효함
        </span>
      </div>
      {footer}
    </>
  )
  const base =
    'flex w-full flex-col gap-4 rounded-[12px] border border-krds-border-divider bg-background p-4 shadow-krds-card'

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          base,
          'text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
          className,
        )}
      >
        {inner}
      </button>
    )
  }
  return <div className={cn(base, className)}>{inner}</div>
}
CertCard.displayName = 'CertCard'
