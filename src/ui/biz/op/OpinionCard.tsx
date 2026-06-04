// 업체의견 카드 (Figma card group 11032-28516). MUI-OP-01-M05.
// 의견 카드: 배지(공개/비공개) + 회사명(17 Medium) + 제목(19 Bold) + infolist(이름/입력일시).
// 답변(reply): 분기 아이콘(ㄴ)으로 들여쓰기 + 카드(배지에 '답변' solid 추가) — 의견 바로 아래 표시.
// rounded-12 + 옅은 그림자 카드(기존 Card 의 rounded-8 과 달라 셸을 직접 구성). 배지는 Badge 재사용.
import { memo } from 'react'

import { Badge } from '@/ui/common/base/Badge'
import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface OpinionData {
  /** 공개 여부 — true=공개(파랑 배지) / false=비공개(빨강 배지) */
  isPublic: boolean
  /** 작성 회사명 (17 Medium) */
  company: string
  /** 의견 제목 (19 Bold) */
  title: string
  /** 작성자 이름 */
  name: string
  /** 입력일시 */
  datetime: string
}

export interface OpinionCardProps {
  opinion: OpinionData
  /** 답변 — 있으면 ㄴ 들여쓰기 카드로 의견 바로 아래 표시 */
  reply?: OpinionData
  /** 의견 카드 클릭(상세보기 팝업) */
  onOpinionClick?: () => void
  /** 답변 카드 클릭(답변 상세 팝업) */
  onReplyClick?: () => void
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-start gap-krds-5">
      <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-muted">
        {label}
      </span>
      <span className="min-w-px flex-1 text-right text-[17px] leading-normal text-krds-text-muted">
        {value}
      </span>
    </div>
  )
}

// 의견/답변 공통 카드 셸 (rounded-12 + 옅은 그림자)
function CardShell({
  data,
  isReply = false,
  onClick,
}: {
  data: OpinionData
  isReply?: boolean
  onClick?: () => void
}) {
  const interactive = Boolean(onClick)
  const Container = interactive ? 'button' : 'div'
  return (
    <Container
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-krds-5 rounded-[12px] border border-krds-border-divider bg-white p-krds-8 text-left',
        'drop-shadow-[0_0_5px_rgba(23,43,77,0.1)]',
        interactive &&
          'cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
      )}
    >
      {/* 배지 — 공개/비공개 (+ 답변) */}
      <div className="flex flex-wrap items-center gap-krds-5">
        <Badge type="pastel" color={data.isPublic ? 'blue' : 'red'}>
          {data.isPublic ? '공개' : '비공개'}
        </Badge>
        {isReply && (
          <Badge type="solid" color="blue">
            답변
          </Badge>
        )}
      </div>

      {/* 회사명 + 제목 */}
      <div className="flex w-full flex-col gap-0.5">
        <p className="truncate text-[17px] font-medium leading-normal text-krds-text-ink">
          {data.company}
        </p>
        <p className="truncate text-[19px] font-bold leading-normal text-krds-text-ink">
          {data.title}
        </p>
      </div>

      {/* infolist */}
      <div className="flex w-full flex-col gap-krds-3">
        <InfoRow label="이름" value={data.name} />
        <InfoRow label="입력일시" value={data.datetime} />
      </div>
    </Container>
  )
}

export const OpinionCard = memo(function OpinionCard({
  opinion,
  reply,
  onOpinionClick,
  onReplyClick,
}: OpinionCardProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <CardShell data={opinion} onClick={onOpinionClick} />
      {reply && (
        <div className="flex w-full items-start gap-krds-5">
          <span className="shrink-0 pt-krds-5 text-krds-text-muted" aria-hidden>
            <Icon name="SubdirectoryArrowRight" size={16} />
          </span>
          <div className="min-w-px flex-1">
            <CardShell data={reply} isReply onClick={onReplyClick} />
          </div>
        </div>
      )}
    </div>
  )
})
OpinionCard.displayName = 'OpinionCard'
