// MUI-MS-01-M12 전체메뉴 — 1depth 메뉴 그룹 카드. Figma "menu group"(9623-17687 / 9623-17692 / 9623-17698) 1:1.
//
// 구조:
//   menu group (카드: border #d1d7e0 · rounded-12 · shadow-card · overflow-clip)
//     └ 1depth_atomic (헤더 버튼: px16 py8 · 19px Bold · expand_more chevron) → 2depth 토글
//          └ 2depth menu group (헤더 하단 1px divider · p16 · gap8)
//               ├ 2depth menu (17px Bold · py4)               ← 단순 항목
//               └ 2depth menu + 3depth (17px Bold + chevron)  ← children 있으면 펼침
//                    └ 3depth menu group (gap8)
//                         └ 3depth_atomic (pl8 py4 · 4px bullet + 15px Medium)
//
// AccordionSection(공통 base) 대신 raw Radix accordion 프리미티브로 직접 조립한 이유:
//   AccordionSection 은 h-56 고정 + blue/white 바 + arrow_forward_ios(90°/270° 회전) 으로 박혀 있어
//   이 디자인(45px 카드 헤더 · expand_more 0°/180° 회전 · rounded-12 shadow 카드 · 무(無) 행 divider)을
//   triggerClassName/contentClassName 만으로 표현 불가(chevron 글리프/회전·헤더 높이·카드 chrome 이 구조적 차이).
//   raw Radix 를 직접 써서 키보드/포커스/애니메이션(a11y) 은 그대로 보존한다.
import {
  Accordion as RawAccordion,
  AccordionContent as RawAccordionContent,
  AccordionItem as RawAccordionItem,
  AccordionTrigger as RawAccordionTrigger,
} from '@/ui/raw/accordion'
import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'
import type { MenuGroup as MenuGroupData, MenuItem } from '@/ui/biz/cm/menu/menuData'

export interface MenuGroupProps {
  /** 1depth 메뉴 그룹 데이터(title + 2depth items, 선택적 3depth children). */
  group: MenuGroupData
  /** 메뉴 항목(2depth · 3depth leaf) 클릭 콜백. */
  onItemClick: (item: { id: string; label: string }) => void
}

// raw 의 고정 lucide chevron(svg)을 숨기고, expand_more 를 직접 렌더(열림 시 180° 회전).
const CHEVRON =
  '[&>svg]:hidden text-krds-text-ink shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180'

/** 3depth 가 있는 2depth — 중첩 Radix 아코디언. */
function MenuItemWithChildren({
  item,
  onItemClick,
}: {
  item: MenuItem
  onItemClick: MenuGroupProps['onItemClick']
}) {
  return (
    <RawAccordion type="single" collapsible className="w-full">
      <RawAccordionItem value={item.id} className="border-b-0">
        <RawAccordionTrigger
          className={cn(
            'group flex w-full items-center gap-krds-3 rounded-krds-8 py-krds-3 hover:no-underline',
            'text-left text-[17px] font-bold leading-normal text-krds-text-ink',
          )}
        >
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          <Icon name="ExpandMore" size={20} aria-hidden className={CHEVRON} />
        </RawAccordionTrigger>
        <RawAccordionContent className="flex flex-col gap-krds-5 pb-0 pt-krds-5">
          {item.children?.map((leaf) => (
            <button
              key={leaf.id}
              type="button"
              onClick={() => onItemClick(leaf)}
              className={cn(
                'flex w-full items-start gap-krds-5 rounded-krds-8 py-krds-3 pl-krds-5 text-left',
                'focus-visible:outline-hidden active:bg-krds-bg-primary-faint',
              )}
            >
              {/* 4px 불릿(sidemenu-4D-bullet) — 텍스트 첫 줄에 정렬. */}
              <span
                aria-hidden
                className="mt-[9px] size-1 shrink-0 rounded-krds-full bg-krds-text-ink"
              />
              <span className="min-w-0 flex-1 text-[15px] font-medium leading-normal text-krds-text-ink">
                {leaf.label}
              </span>
            </button>
          ))}
        </RawAccordionContent>
      </RawAccordionItem>
    </RawAccordion>
  )
}
MenuItemWithChildren.displayName = 'MenuItemWithChildren'

function MenuGroup({ group, onItemClick }: MenuGroupProps) {
  return (
    <RawAccordion type="single" collapsible>
      <RawAccordionItem
        value={group.id}
        className={cn(
          'overflow-clip rounded-krds-xl border border-krds-border-divider bg-white shadow-krds-card',
        )}
      >
        {/* 1depth_atomic — 헤더 버튼: px16 py8(≈45px) · 19px Bold · expand_more. */}
        <RawAccordionTrigger
          className={cn(
            'group flex w-full items-center gap-krds-5 bg-white px-krds-8 py-krds-5 hover:no-underline',
            'text-left text-[19px] font-bold leading-normal text-krds-text-ink',
          )}
        >
          <span className="min-w-0 flex-1 truncate">{group.title}</span>
          <Icon name="ExpandMore" size={20} aria-hidden className={CHEVRON} />
        </RawAccordionTrigger>

        {/* 2depth menu group — 헤더 하단 1px divider · p16 · gap8. */}
        <RawAccordionContent className="flex flex-col gap-krds-5 border-t border-krds-border-divider bg-white p-krds-8">
          {group.items.map((item) =>
            item.children?.length ? (
              <MenuItemWithChildren
                key={item.id}
                item={item}
                onItemClick={onItemClick}
              />
            ) : (
              <button
                key={item.id}
                type="button"
                onClick={() => onItemClick(item)}
                className={cn(
                  'flex w-full items-center rounded-krds-8 py-krds-3 text-left',
                  'text-[17px] font-bold leading-normal text-krds-text-ink',
                  'focus-visible:outline-hidden active:bg-krds-bg-primary-faint',
                )}
              >
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </button>
            ),
          )}
        </RawAccordionContent>
      </RawAccordionItem>
    </RawAccordion>
  )
}
MenuGroup.displayName = 'MenuGroup'

export { MenuGroup }
