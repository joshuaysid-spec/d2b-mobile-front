// 메인 홈 주요 서비스 바로가기(Figma 7077:85249). 섹션 제목 + 3열 아이콘 그리드(스와이프 캐러셀).
// 아이콘은 실제 에셋 미제공 → placeholder 박스(60×60). src/아이콘 확정 시 IconSlot 만 교체.
// items 를 페이지당 6개(3열×2행)로 나눠 Carousel 로 스와이프/화살표 전환.
import { Carousel } from '@/ui/common/composites/Carousel'

export interface ServiceShortcut {
  /** 안정적 고유 키. */
  id: string
  label: string
  /** 아이콘 이미지 src. 없으면 placeholder 박스 표시. */
  iconSrc?: string
  onClick?: () => void
}

export interface ServiceShortcutGridProps {
  items: ServiceShortcut[]
  /** 한 페이지에 보일 항목 수(기본 6 = 3열×2행). */
  itemsPerPage?: number
}

// 페이지당 항목 묶기.
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// 한 페이지(3열 그리드).
function GridPage({ items }: { items: ServiceShortcut[] }) {
  return (
    <ul className="grid h-full grid-cols-3 content-start gap-x-2 gap-y-6 rounded-krds-xl bg-krds-bg-primary-faint px-5 py-[30px]">
      {items.map((item) => (
        <li key={item.id} className="flex justify-center">
          <button
            type="button"
            onClick={item.onClick}
            className="flex w-full flex-col items-center gap-2 focus-visible:outline-hidden"
          >
            {/* 아이콘 — iconSrc 있으면 이미지, 없으면 placeholder 박스(에셋 확정 시 교체) */}
            <span
              aria-hidden
              className="flex size-[60px] items-center justify-center rounded-2xl border border-krds-border-primary-soft bg-white"
            >
              {item.iconSrc ? (
                <img src={item.iconSrc} alt="" className="size-10" />
              ) : (
                <span className="size-10 rounded-lg bg-krds-border-field" />
              )}
            </span>
            <span className="text-center text-[17px] font-medium leading-snug text-krds-text-ink">
              {item.label}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

const ServiceShortcutGrid = ({
  items,
  itemsPerPage = 6,
}: ServiceShortcutGridProps) => {
  const pages = chunk(items, itemsPerPage)

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-[24px] font-bold leading-normal text-krds-text-ink">
        주요 서비스 바로가기
      </h2>

      <Carousel
        ariaLabel="주요 서비스 바로가기"
        className="gap-5"
        pages={pages.map((pageItems) => (
          <GridPage items={pageItems} />
        ))}
      />
    </section>
  )
}
ServiceShortcutGrid.displayName = 'ServiceShortcutGrid'

export { ServiceShortcutGrid }
