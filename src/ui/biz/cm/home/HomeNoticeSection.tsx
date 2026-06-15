// 메인 홈 공지사항(Figma 7077:85348). 섹션 제목 + 더보기 + TabList(3) + 공지 카드 3(제목+날짜).
// 탭별 최근 3건. 데이터/탭상태는 페이지 소유(controlled). 카드 key=item.id(안정 식별자).
import { Icon } from '@/ui/common/base/Icon'
import { TabList } from '@/ui/common/composites/TabList'

export interface NoticeItem {
  /** 안정적 고유 식별자. */
  id: string
  title: string
  date: string
}

export interface NoticeTab {
  value: string
  label: string
  items: NoticeItem[]
}

export interface HomeNoticeSectionProps {
  tabs: NoticeTab[]
  activeTab: string
  onTabChange: (value: string) => void
  onMore: () => void
  onItemClick: (item: NoticeItem) => void
}

const HomeNoticeSection = ({
  tabs,
  activeTab,
  onTabChange,
  onMore,
  onItemClick,
}: HomeNoticeSectionProps) => {
  const active = tabs.find((t) => t.value === activeTab) ?? tabs[0]

  return (
    <section className="flex flex-col gap-4">
      {/* 제목 + 더보기 */}
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-bold leading-normal text-krds-text-ink">
          공지사항
        </h2>
        <button
          type="button"
          onClick={onMore}
          className="inline-flex items-center gap-1 text-[17px] font-medium text-krds-text-ink focus-visible:outline-hidden"
        >
          더보기
          <Icon name="Add" size={20} aria-hidden />
        </button>
      </div>

      {/* 탭 */}
      <TabList
        fitted
        items={tabs.map((t) => ({ value: t.value, label: t.label }))}
        value={activeTab}
        onChange={onTabChange}
      />

      {/* 공지 카드 리스트 — 항목별 카드: #D1D7E0 테두리 + 16px 패딩 + 그림자(#172B4D 10%) */}
      <ul className="flex flex-col gap-4">
        {active?.items.map((item) => (
          <li
            key={item.id}
            className="rounded-krds-8 border border-krds-border-divider p-4 shadow-[0_0_10px_rgba(23,43,77,0.1)]"
          >
            <button
              type="button"
              onClick={() => onItemClick(item)}
              className="flex w-full flex-col gap-2 text-left focus-visible:outline-hidden"
            >
              <span className="line-clamp-2 text-[19px] font-medium leading-normal text-krds-text-ink">
                {item.title}
              </span>
              <span className="text-[17px] leading-normal text-krds-text-muted">
                {item.date}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
HomeNoticeSection.displayName = 'HomeNoticeSection'

export { HomeNoticeSection }
