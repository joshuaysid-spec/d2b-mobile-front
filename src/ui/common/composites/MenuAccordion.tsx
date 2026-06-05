// Figma menu accordian(9300-29486) 1:1.
// 트리(children 재귀) 데이터를 받아 1/2/3 depth 까지 자동 렌더하는 메뉴 아코디언.
//
// raw/accordion(@radix-ui/react-accordion 기반 shadcn 정본) 을 래핑 — WAI-ARIA Accordion
// 키보드/포커스/aria 를 Radix 가 제공한다. 다단계는 AccordionContent 안에 Accordion 을
// 중첩해 표현한다. chevron 은 raw 의 기본 lucide ChevronDown 을 그대로 사용(사용자 승인 —
// 이 컴포넌트 한정 예외). 크기만 20px(size-5)로 맞춤.
//
// 시각 사양 (Figma):
//   1depth — 45 height · bg white · 1px border(krds-border-disabled) · 19px Bold ink · 우측 chevron
//   2depth — 34 height · 17px Regular ink · 자식 있을 때만 chevron / 없으면 leaf
//   3depth — 31 height · 15px Regular muted · "·" 불릿 · leaf only
//   중첩 들여쓰기 — AccordionContent 좌측 16px(pl-4) 누적.
//
// 데이터:
//   items: MenuItem[]  ·  MenuItem = { id, label, children?, onClick? }
//     - children 있으면 아코디언 토글 / 없으면 leaf(onClick 라우팅)
//
// 상태 (기존 API 유지):
//   uncontrolled — defaultOpenIds
//   controlled   — openIds + onOpenChange (열린 id 들의 평탄 배열)
//
// 사용 예:
//   <MenuAccordion
//     items={[
//       { id: 'plan', label: '조달계획', children: [{ id: 'pj', label: '조달계획관리', onClick }] },
//       { id: 'biz',  label: '계약', children: [
//         { id: 'ec', label: '전자계약', children: [{ id: 'sign', label: '개인동의특약', onClick }] },
//       ] },
//     ]}
//     defaultOpenIds={['plan']}
//   />
import * as React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/raw/accordion'
import { cn } from '@/utils/cn'

export interface MenuItem {
  id: string
  label: React.ReactNode
  children?: MenuItem[]
  /** leaf 클릭 핸들러 — children 없는 경우 트리거. */
  onClick?: () => void
}

export interface MenuAccordionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuItem[]
  /** uncontrolled — 초기 펼침 id 집합. */
  defaultOpenIds?: string[]
  /** controlled — 외부에서 펼침 상태 관리. onOpenChange 함께 필요. */
  openIds?: string[]
  onOpenChange?: (openIds: string[]) => void
}

type Depth = 1 | 2 | 3

const hasKids = (item: MenuItem) => Boolean(item.children && item.children.length > 0)

function MenuAccordion({
  className,
  items,
  defaultOpenIds = [],
  openIds: openIdsProp,
  onOpenChange,
  ...props
}: MenuAccordionProps) {
  const isControlled = openIdsProp !== undefined
  const [internalOpen, setInternalOpen] = React.useState<string[]>(defaultOpenIds)
  const open = isControlled ? openIdsProp : internalOpen

  const setOpen = React.useCallback(
    (next: string[]) => {
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  return (
    <div className={cn('flex w-full flex-col', className)} {...props}>
      <Level items={items} depth={1} open={open} setOpen={setOpen} />
    </div>
  )
}
MenuAccordion.displayName = 'MenuAccordion'

// ─── 한 단계(level) 렌더 ─────────────────────────────────────────────────────
// 자식 있는 항목이 하나도 없으면(=leaf only, 보통 3depth) Accordion 없이 div 로 렌더.
function Level({
  items,
  depth,
  open,
  setOpen,
}: {
  items: MenuItem[]
  depth: Depth
  open: string[]
  setOpen: (next: string[]) => void
}) {
  const toggleIds = items.filter(hasKids).map((i) => i.id)
  // 1depth 박스 사이 12px, 그 이하 서브 메뉴 사이 8px(krds-5).
  const wrapClass = cn(
    'flex w-full flex-col',
    depth === 1 ? 'gap-krds-7' : 'gap-krds-5',
  )

  if (toggleIds.length === 0) {
    return (
      <div className={wrapClass}>
        {items.map((item) => (
          <LeafRow key={item.id} item={item} depth={depth} />
        ))}
      </div>
    )
  }

  return (
    <Accordion
      type="multiple"
      // 이 레벨에 해당하는 열린 id 만 value 로 전달(다른 레벨 id 는 무시).
      value={open.filter((id) => toggleIds.includes(id))}
      onValueChange={(vals) =>
        // 이 레벨 id 들을 새 vals 로 교체, 다른 레벨 상태는 보존 → 단일 평탄 배열 유지.
        setOpen([...open.filter((id) => !toggleIds.includes(id)), ...vals])
      }
      className={wrapClass}
    >
      {items.map((item) =>
        hasKids(item) ? (
          <AccordionItem
            key={item.id}
            value={item.id}
            className={itemClass(depth)}
          >
            <AccordionTrigger className={triggerClass(depth)}>
              <span className="min-w-px flex-1 truncate text-left">
                {item.label}
              </span>
            </AccordionTrigger>
            <AccordionContent className={contentClass(depth)}>
              <Level
                items={item.children!}
                depth={(depth + 1) as Depth}
                open={open}
                setOpen={setOpen}
              />
            </AccordionContent>
          </AccordionItem>
        ) : (
          <LeafRow key={item.id} item={item} depth={depth} />
        ),
      )}
    </Accordion>
  )
}

// ─── 스타일 (Figma 1:1) ──────────────────────────────────────────────────────
function itemClass(depth: Depth) {
  // raw AccordionItem 기본 border-b 제거. 1depth 만 박스 테두리 + radius 12px.
  // overflow-hidden 으로 trigger border-b 가 둥근 모서리 밖으로 새지 않게 클립.
  return depth === 1
    ? 'overflow-hidden rounded-[12px] border border-krds-border-divider bg-background shadow-[0px_0px_10px_0px_#172B4D1A]'
    : 'border-0'
}

function triggerClass(depth: Depth) {
  // raw 기본(py-4 font-medium hover:underline) 오버라이드 + chevron 20px.
  const base =
    'py-0 hover:no-underline [&>svg]:size-5 [&>svg]:shrink-0 text-krds-text-ink'
  if (depth === 1)
    return cn(base, 'h-[45px] px-krds-8 text-[19px] font-bold leading-normal')
  // depth 2 는 bold, depth 3 는 normal.
  return cn(
    base,
    'h-[34px] text-[17px] leading-normal',
    depth === 2 ? 'font-bold' : 'font-normal',
  )
}

function contentClass(depth: Depth) {
  // raw AccordionContent 내부 div 기본 pb-4 pt-0 → 좌측 16px 들여쓰기 + 패딩 조정.
  // 1depth: 서브 메뉴 wrapper 상단에 divider(첫 서브 메뉴 위 경계) + 상하 12px 여백.
  // 닫힌 상태에선 content 가 unmount 되어 border 가 안 보이므로 줄 겹침 없음.
  // pr-4(16px): depth2 chevron 을 depth1 trigger(px-krds-8=16px) chevron 과 우측 정렬.
  // ⚠️ raw 내부 div 가 `pt-0 pb-4` 를 박는데, twMerge 가 커스텀 `py-krds-7` 을
  //    padding 그룹으로 인식 못 해 pt-0 이 안 지워진다. arbitrary 값(토큰 참조)으로
  //    줘야 twMerge 가 충돌로 인식해 pt-0/pb-4 를 덮어쓴다.
  return depth === 1
    ? 'border-t border-krds-border-divider pl-4 pr-4 py-[var(--krds-space-7)]'
    : 'pl-2 pr-0 pt-krds-3 pb-0'
}

// ─── leaf 행 ─────────────────────────────────────────────────────────────────
function LeafRow({ item, depth }: { item: MenuItem; depth: Depth }) {
  if (depth === 3) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        className={cn(
          'flex h-[31px] w-full items-center gap-1 text-left',
          'text-[15px] font-normal leading-normal text-krds-text-ink',
          'focus-visible:bg-krds-bg-primary-faint focus-visible:outline-hidden',
        )}
      >
        <span
          aria-hidden
          className="size-1 shrink-0 rounded-full bg-krds-border-disabled"
        />
        <span className="min-w-px flex-1 truncate">{item.label}</span>
      </button>
    )
  }

  if (depth === 1) {
    // 1depth leaf(드묾) — 박스 테두리 유지.
    return (
      <button
        type="button"
        onClick={item.onClick}
        className={cn(
          'flex h-[45px] w-full items-center rounded-[12px] border border-krds-border-divider bg-background px-krds-8 text-left shadow-[0px_0px_10px_0px_#172B4D1A]',
          'text-[19px] font-bold leading-normal text-krds-text-ink',
          'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-1',
        )}
      >
        <span className="min-w-px flex-1 truncate">{item.label}</span>
      </button>
    )
  }

  // depth 2 leaf
  return (
    <button
      type="button"
      onClick={item.onClick}
      className={cn(
        'flex h-[34px] w-full items-center text-left',
        'text-[17px] font-bold leading-normal text-krds-text-ink',
        'focus-visible:bg-krds-bg-primary-faint focus-visible:outline-hidden',
      )}
    >
      <span className="min-w-px flex-1 truncate">{item.label}</span>
    </button>
  )
}

export { MenuAccordion }
