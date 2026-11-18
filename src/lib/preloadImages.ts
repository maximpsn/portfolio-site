import { isResponsiveImage, type ImageSource } from './responsiveImage'

type PreloadItem = {
  source: ImageSource
  /** Тот же sizes, что у картинки на странице, — тогда браузер выберет и закэширует тот же файл. */
  sizes?: string
}

// Держим ссылки, пока картинки грузятся, чтобы сборщик мусора не отменил загрузку.
const pending = new Set<HTMLImageElement>()

/**
 * Фоновая предзагрузка. Для адаптивных картинок собирается отсоединённый <picture>
 * с теми же source/srcset/sizes, что на странице: браузер сам выберет формат и ширину.
 */
export function preloadImages(items: PreloadItem[]) {
  items.forEach(({ source, sizes }) => {
    const img = document.createElement('img')

    if (isResponsiveImage(source)) {
      const picture = document.createElement('picture')

      ;(['avif', 'webp'] as const).forEach((format) => {
        const srcset = source.sources[format]
        if (!srcset) {
          return
        }

        const element = document.createElement('source')
        element.type = `image/${format}`
        element.srcset = srcset
        if (sizes) {
          element.sizes = sizes
        }
        picture.appendChild(element)
      })

      picture.appendChild(img)
      img.src = source.img.src
    } else {
      img.src = source
    }

    pending.add(img)
    const release = () => pending.delete(img)
    img.addEventListener('load', release, { once: true })
    img.addEventListener('error', release, { once: true })
  })
}
