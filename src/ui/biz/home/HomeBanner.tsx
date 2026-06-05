// 메인 홈 배너(Figma 7077:85383 알림판). 배너 통이미지(Image) 여러 장을 스와이프 캐러셀로.
// 각 배너는 "통이미지 하나". 실제 이미지 에셋 미제공 → src 미주입 시 placeholder 박스.
import { Image } from '@/ui/common/base/Image'
import { Carousel } from '@/ui/common/composites/Carousel'

export interface BannerSlide {
  /** 안정적 고유 키. */
  id: string
  /** 배너 통이미지 src. 미주입 시 placeholder. */
  src?: string
  alt: string
  onClick?: () => void
}

export interface HomeBannerProps {
  banners: BannerSlide[]
}

// 배너 한 장(통이미지). Figma 328×448 비율.
function BannerImage({ slide }: { slide: BannerSlide }) {
  const inner = slide.src ? (
    <Image
      src={slide.src}
      alt={slide.alt}
      objectFit="cover"
      className="aspect-[328/448] w-full rounded-2xl"
    />
  ) : (
    <div
      aria-label={slide.alt}
      role="img"
      className="flex aspect-[328/448] w-full items-center justify-center rounded-2xl bg-krds-bg-primary-faint text-[17px] font-bold text-krds-border-field"
    >
      배너
    </div>
  )

  if (slide.onClick) {
    return (
      <button
        type="button"
        onClick={slide.onClick}
        aria-label={slide.alt}
        className="block w-full overflow-hidden rounded-2xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
      >
        {inner}
      </button>
    )
  }
  return inner
}

const HomeBanner = ({ banners }: HomeBannerProps) => {
  return (
    <section>
      <Carousel
        ariaLabel="배너"
        pages={banners.map((slide) => (
          <div className="px-0.5">
            <BannerImage slide={slide} />
          </div>
        ))}
      />
    </section>
  )
}
HomeBanner.displayName = 'HomeBanner'

export { HomeBanner }
