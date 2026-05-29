// 이미지 컴포넌트 — native <img> 래퍼.
// 기본 동작:
//  - loading="lazy" 기본 (스크롤 진입 시 로드)
//  - alt 필수 (접근성). 장식용은 alt="" 명시.
//  - fallback prop — onError 시 자동으로 대체 src 로 교체
//  - objectFit prop — cover(기본)/contain/fill/none/scale-down
import * as React from 'react'

import { cn } from '@/utils/cn'

export type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'loading'> {
  src: string
  /** 접근성 — 항상 작성. 장식 이미지는 alt="" 로 명시. */
  alt: string
  /** 로드 실패 시 자동으로 대체할 src. */
  fallback?: string
  /** CSS object-fit 값. 기본 'cover'. */
  objectFit?: ObjectFit
  /** lazy(기본) | eager. */
  loading?: 'lazy' | 'eager'
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      fallback,
      objectFit = 'cover',
      loading = 'lazy',
      className,
      style,
      onError,
      ...rest
    },
    ref,
  ) => {
    const [currentSrc, setCurrentSrc] = React.useState(src)
    const [errored, setErrored] = React.useState(false)

    // src prop 이 외부에서 변경되면 currentSrc 재동기화
    React.useEffect(() => {
      setCurrentSrc(src)
      setErrored(false)
    }, [src])

    const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
      if (fallback && !errored && currentSrc !== fallback) {
        setErrored(true)
        setCurrentSrc(fallback)
      }
      onError?.(e)
    }

    return (
      <img
        ref={ref}
        src={currentSrc}
        alt={alt}
        loading={loading}
        onError={handleError}
        className={cn('block max-w-full', className)}
        style={{ objectFit, ...style }}
        {...rest}
      />
    )
  },
)
Image.displayName = 'Image'

export { Image }
