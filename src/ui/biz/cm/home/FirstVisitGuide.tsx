// 메인 홈 처음 방문 안내(Figma 7077:85457). 섹션 제목 + 가이드 행 3(아이콘+제목+설명+자세히보기).
// 사전준비안내/국내조달안내/국외조달안내. 동작은 페이지 소유(onDetail 스텁/라우트).
import { Icon, type IconName } from '@/ui/common/base/Icon'

export interface GuideItem {
  /** 안정적 고유 식별자. */
  id: string
  iconName: IconName
  title: string
  desc: string
  onDetail?: () => void
}

export interface FirstVisitGuideProps {
  items: GuideItem[]
}

const FirstVisitGuide = ({ items }: FirstVisitGuideProps) => {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-[24px] font-bold leading-normal text-krds-text-ink">
        처음 방문하셨나요?
      </h2>

      <ul className="flex flex-col gap-6">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-3">
            {/* 아이콘 + 제목 */}
            <div className="flex items-center gap-2">
              <Icon
                name={item.iconName}
                size={24}
                className="text-krds-text-ink"
                aria-hidden
              />
              <span className="text-[19px] font-bold leading-normal text-krds-text-ink">
                {item.title}
              </span>
            </div>

            {/* 설명 + 자세히보기 */}
            <div className="flex flex-col gap-2 pl-8">
              <p className="text-[17px] leading-normal text-krds-text-ink wrap-break-word">
                {item.desc}
              </p>
              <button
                type="button"
                onClick={item.onDetail}
                // 동일 텍스트 링크 3개 구분(WCAG 2.4.4) — 접근명에 항목 제목 포함.
                aria-label={`${item.title} 자세히보기`}
                className="inline-flex w-fit items-center gap-1 text-[17px] font-medium text-krds-text-ink focus-visible:outline-hidden"
              >
                자세히보기
                <Icon name="TrendingFlat" size={20} aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
FirstVisitGuide.displayName = 'FirstVisitGuide'

export { FirstVisitGuide }
