// 업체 요약 카드 (Figma m_summary info_card 1:1 — 10020:82706 실측, 260827 리디자인).
// 흰 카드(보더 divider·r12·p16·그림자): [아이콘 타일(40, blue-dark, 빌딩) + 업체명(19 Bold) + 업체코드 뱃지(green)]
//   + 구분선 + 정보 묶음들(라벨 13 caption 위 / 값 아래 — 사업구분은 뱃지 나열, 나머지는 17 muted 텍스트).
// 사용처: 업체정보 상세(M02)·추가정보신청목록(M03)·군수품무역대리업 등 cm 업체정보 계열 상단.
import type { ReactNode } from 'react'

import { Badge } from '@/ui/common/base/Badge'
import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface BzentySummaryInfoItem {
  label: ReactNode
  /** 문자열이면 17 muted 텍스트로, 노드면 그대로(뱃지 나열 등). */
  value: ReactNode
  /** 값 우측 액션 슬롯(예: G2B 갱신하기 버튼). */
  action?: ReactNode
}

export interface BzentySummaryCardProps {
  /** 업체명(19 Bold). */
  name: ReactNode
  /** 업체코드 뱃지(green pastel). 미지정 시 뱃지 생략. */
  code?: string
  /** 사업구분 뱃지 라벨들 — 지정 시 '사업구분' 묶음으로 맨 앞에 노출. */
  bizCd?: string[]
  /** 추가 정보 묶음(라벨 위/값 아래). 예: 최신 수신일자, 대표자, 사업자등록번호. */
  infos?: BzentySummaryInfoItem[]
  className?: string
}

export function BzentySummaryCard({ name, code, bizCd, infos, className }: BzentySummaryCardProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-krds-8 rounded-[12px] border border-krds-border-divider bg-white p-krds-8 shadow-[0px_0px_5px_0px_rgba(23,43,77,0.1)]',
        className,
      )}
    >
      {/* 타이틀 행 — 아이콘 타일 + 업체명 + 업체코드 뱃지 */}
      <div className="flex w-full items-center gap-krds-7">
        <div
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-krds-8 bg-krds-action-primary-active"
        >
          <Icon name="Apartment" size={24} className="text-white" aria-hidden />
        </div>
        <div className="flex min-w-px flex-1 flex-wrap items-center gap-krds-5">
          <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
            {name}
          </span>
          {code && (
            <Badge type="pastel" color="green">
              {code}
            </Badge>
          )}
        </div>
      </div>

      <div aria-hidden className="h-px w-full bg-krds-border-divider" />

      {/* 사업구분 뱃지 묶음 */}
      {bizCd && bizCd.length > 0 && (
        <div className="flex w-full flex-col gap-krds-3">
          <span className="text-[13px] leading-normal text-krds-text-caption">사업구분</span>
          <div className="flex flex-wrap gap-krds-5">
            {bizCd.map((label) => (
              <Badge key={label} type="pastel" color="blue">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 정보 묶음 — 라벨(13 caption) 위 / 값(17 muted) 아래. action 은 값 우측. */}
      {infos?.map((info, i) => (
        <div key={i} className="flex w-full flex-col gap-krds-3">
          <span className="text-[13px] leading-normal text-krds-text-caption">{info.label}</span>
          <div className="flex w-full items-center gap-krds-5">
            {typeof info.value === 'string' || typeof info.value === 'number' ? (
              <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-muted wrap-break-word">
                {info.value}
              </span>
            ) : (
              <div className="min-w-px flex-1">{info.value}</div>
            )}
            {info.action && <div className="shrink-0">{info.action}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
BzentySummaryCard.displayName = 'BzentySummaryCard'
