// 국방전자조달시스템 로고 — Image 베이스 컴포넌트 위에 얹은 브랜드 아톰.
// Header(126×21) · Footer(196×32) 등에서 재사용. 크기는 size prop 또는 className 으로 조정.
//
// 에셋: 기본 src 는 `src/assets/images/logo-datbis.svg` (Figma 9300-27768 정본 SVG).
//   다른 로고가 필요하면 src prop 으로 주입.
//
// 사용 예:
//   <Logo />                       // 기본(header 크기 126×21)
//   <Logo size="footer" />         // 196×32
//   <Logo className="h-6 w-auto" /> // 임의 크기
//   <Logo src="/custom-logo.svg" />
import { Image } from '@/ui/common/base/Image'
import { cn } from '@/utils/cn'
import defaultLogo from '@/assets/images/logo-datbis.svg'

export type LogoSize = 'header' | 'footer'

export interface LogoProps {
  /** 로고 이미지 경로. 기본 placeholder SVG. */
  src?: string
  /** 접근성 대체 텍스트. 기본 "국방전자조달시스템". */
  alt?: string
  /** 사전 정의 크기. header(126×21) | footer(196×32). className 주입 시 무시. */
  size?: LogoSize
  /** 크기/여백 직접 지정 — size 프리셋을 덮어씀. */
  className?: string
}

const SIZE_CLASS: Record<LogoSize, string> = {
  header: 'h-[21px] w-[126px]',
  footer: 'h-[32px] w-[196px]',
}

const Logo = ({
  src = defaultLogo,
  alt = '국방전자조달시스템',
  size = 'header',
  className,
}: LogoProps) => (
  <Image
    src={src}
    alt={alt}
    objectFit="contain"
    loading="eager"
    className={cn(SIZE_CLASS[size], className)}
  />
)
Logo.displayName = 'Logo'

export { Logo }
