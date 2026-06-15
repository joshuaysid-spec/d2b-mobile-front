// 메인 홈 주요 서비스 바로가기(Figma 7077:85249). 섹션 제목 + 3열 아이콘 그리드.
// 아이콘은 iconSrc 있으면 이미지, 없으면 placeholder 박스(60×60). 슬라이드/캐러셀 없음 — 단일 그리드.
import type { ReactNode } from 'react'

export interface ServiceShortcut {
  /** 안정적 고유 키. */
  id: string
  /** 표시 라벨. 줄바꿈 등 위해 ReactNode 허용(<br/> 등). */
  label: ReactNode
  /** 아이콘 이미지 src. 없으면 placeholder 박스 표시. */
  iconSrc?: string
  onClick?: () => void
}

export interface ServiceShortcutGridProps {
  items: ServiceShortcut[]
}

const ServiceShortcutGrid = ({ items }: ServiceShortcutGridProps) => {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-[24px] font-bold leading-normal text-krds-text-ink">
        주요 서비스 바로가기
      </h2>

      <ul className="grid grid-cols-3 gap-x-2 gap-y-6 rounded-krds-xl bg-krds-bg-primary-faint px-5 py-[30px]">
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
    </section>
  )
}
ServiceShortcutGrid.displayName = 'ServiceShortcutGrid'

export { ServiceShortcutGrid }
