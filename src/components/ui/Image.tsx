import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { isResponsiveImage, type ImageSource } from '../../lib/responsiveImage'
import './Image.css'

type ImageProps = {
  source: ImageSource
  alt?: string
  /** Атрибут sizes: какой ширины картинка на экране. Без него браузер считает 100vw. */
  sizes?: string
  /** Картинка на первом экране: грузим сразу и с высоким приоритетом, а не лениво. */
  priority?: boolean
  /** Класс обёртки <picture> (в ней превью и шиммер). */
  className?: string
  /** Класс самого <img>. */
  imgClassName?: string
  /** Шиммер поверх превью, пока грузится. Для мелких иконок можно выключить. */
  shimmer?: boolean
}

type LoadState = 'loading' | 'loaded' | 'instant'

const FORMAT_ORDER = ['avif', 'webp'] as const

/**
 * Картинка с размытым превью и шиммером на время загрузки.
 * Превью — настоящие цвета и композиция картинки (вшито в бандл, ~200 байт),
 * поверх — мягкий шиммер (появляется, только если загрузка затянулась),
 * после загрузки оригинал плавно проявляется. Если картинка уже в кэше — сразу, без анимации.
 */
function Image({
  source,
  alt = '',
  sizes,
  priority = false,
  className,
  imgClassName,
  shimmer = true,
}: ImageProps) {
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [state, setState] = useState<LoadState>('loading')
  const responsive = isResponsiveImage(source)
  const src = responsive ? source.img.src : source

  useLayoutEffect(() => {
    const image = imageRef.current
    // Уже в кэше браузера — показываем без проявления.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(image && image.complete && image.naturalWidth > 0 ? 'instant' : 'loading')
  }, [src])

  const handleLoad = () => {
    setState((current) => (current === 'instant' ? current : 'loaded'))
  }

  const wrapperClassName = ['smart-image', shimmer ? 'smart-image--shimmer' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  const style = responsive
    ? ({ '--smart-image-placeholder': source.placeholder } as CSSProperties)
    : undefined

  return (
    <picture className={wrapperClassName} data-state={state} style={style}>
      {responsive
        ? FORMAT_ORDER.filter((format) => source.sources[format]).map((format) => (
            <source key={format} type={`image/${format}`} srcSet={source.sources[format]} sizes={sizes} />
          ))
        : null}
      <img
        ref={imageRef}
        alt={alt}
        className={imgClassName ? `smart-image__img ${imgClassName}` : 'smart-image__img'}
        src={src}
        width={responsive ? source.img.w : undefined}
        height={responsive ? source.img.h : undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleLoad}
      />
    </picture>
  )
}

export default Image
