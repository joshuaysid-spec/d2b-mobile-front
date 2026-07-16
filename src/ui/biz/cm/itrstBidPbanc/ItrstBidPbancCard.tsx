// MUI-CM-06-M05 관심입찰공고 > 카드 (Figma 10020:87730 m_card type4). 도메인 전용 조립물.
//
// Figma 실측(px, 1:1 → krds 토큰):
//   카드: bg white · border 1px #d1d7e0(border-divider) · rounded 12 · p16(krds-8) · drop-shadow 0 0 5 rgba(23,43,77,.1)
//         · 세로 gap 8(krds-5, contents↔infolist).
//   contents: 세로 gap 8(krds-5).
//     ├ row1(badge+star): 가로 gap 16(krds-8) · items-start. 배지그룹 flex-1(wrap, gap 8=krds-5) · 별 24px shrink-0.
//     └ title area: 세로 gap 2(krds-2).
//         · subtitle(공고상태+공고번호) 17px **Medium** #1d1d1d(ink) 1줄 말줄임.  ← 공통 Card(muted/Regular)와 다름
//         · title(입찰건명) 19px **Bold** #1d1d1d(ink) 2줄 말줄임.
//   infolist: 세로 gap 4(krds-3). 각 행 가로 gap 8(krds-5) items-start.
//         · 라벨 17px Regular #555(muted) 좌 flex-1 · 값 17px Regular #555(muted) 우 flex-1 text-right.  ← 값도 muted
//   별: kid_star. on=파랑 채움(text-primary #0054e9, fill 1) / off=아웃라인(text-disabled-soft, fill 0).
//
// 카드 전체 클릭=상세 이동, 별 클릭=관심 토글(두 액션). 중첩 <button> 을 피하려고 stretched-link 패턴:
//   컨테이너 div + 전면 덮는 nav <button>(z-0) + 콘텐츠(pointer-events-none, z-10) + 별 <button>(pointer-events-auto).
import { Badge } from '@/ui/common/base/Badge'
import { Icon } from '@/ui/common/base/Icon'
import type { ItrstBidPbancItem } from '@/types/cm'

interface ItrstBidPbancCardProps {
  item: ItrstBidPbancItem
  /** 카드 클릭 — 해당 입찰공고 상세로 이동. */
  onOpen: () => void
  /** 별(관심) 토글 — 켜기/끄기. */
  onToggleStar: () => void
}

export function ItrstBidPbancCard({ item, onOpen, onToggleStar }: ItrstBidPbancCardProps) {
  const rows: { label: string; value: string }[] = [
    { label: '발주예정월', value: item.orderPrnmntYm },
    { label: '발주기관', value: item.orderInstNm },
    { label: '계약방법', value: item.bidMthd },
    { label: '예산금액', value: `${item.bdgtAmt.toLocaleString()} 원` },
  ]

  return (
    <div className="relative flex w-full flex-col gap-krds-5 rounded-[12px] border border-krds-border-divider bg-background p-krds-8 shadow-[0px_0px_5px_0px_rgba(23,43,77,0.1)]">
      {/* 전면 nav 버튼 — 카드 전체 클릭(상세 이동). 콘텐츠(pointer-events-none) 뒤(z-0)에서 클릭을 받는다. */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${item.bidNm} 상세보기`}
        className="absolute inset-0 z-0 rounded-[12px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
      />

      {/* 콘텐츠 — pointer-events-none 로 클릭을 뒤의 nav 버튼으로 통과시키되, 별만 pointer-events-auto. */}
      <div className="pointer-events-none relative z-10 flex flex-col gap-krds-5">
        {/* type4-contents */}
        <div className="flex flex-col gap-krds-5">
          {/* row1 — 배지 그룹 + 별 */}
          <div className="flex items-start gap-krds-8">
            <div className="flex min-w-px flex-1 flex-wrap items-center gap-krds-5">
              <Badge type="pastel" color="blue">
                {item.taskSeNm}
              </Badge>
              <Badge type="pastel" color="blue">
                {item.ctrtMthd}
              </Badge>
            </div>
            <button
              type="button"
              onClick={onToggleStar}
              aria-pressed={item.itrst}
              aria-label={item.itrst ? '관심공고 해제' : '관심공고 등록'}
              className="pointer-events-auto -m-1 shrink-0 rounded-full p-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
            >
              <Icon
                name="KidStar"
                size={24}
                fill={item.itrst ? 1 : 0}
                aria-hidden
                className={item.itrst ? 'text-krds-text-primary' : 'text-krds-text-disabled-soft'}
              />
            </button>
          </div>

          {/* title area — subtitle(공고상태+공고번호, Medium ink) + title(입찰건명, Bold ink) */}
          <div className="flex flex-col gap-krds-2">
            <span className="truncate text-[17px] font-medium leading-normal text-krds-text-ink">
              {item.pbancStasNm} {item.pbancNoCycl}
            </span>
            <span className="line-clamp-2 text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
              {item.bidNm}
            </span>
          </div>
        </div>

        {/* infolist — 라벨/값 모두 muted(#555) 17px Regular */}
        <div className="flex flex-col gap-krds-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-krds-5">
              <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-muted">
                {row.label}
              </span>
              <span className="min-w-px flex-1 text-right text-[17px] leading-normal text-krds-text-muted wrap-break-word">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
ItrstBidPbancCard.displayName = 'ItrstBidPbancCard'
