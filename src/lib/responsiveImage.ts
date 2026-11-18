/**
 * Результат импорта `./photo.jpg?img` / `?img-small` (плагин responsive-images в vite.config.mjs).
 */
export type ResponsiveImage = {
  /** Ключ — формат (avif, webp), значение — srcset. */
  sources: Record<string, string>
  /** Fallback-картинка (WebP наибольшей ширины) и исходные размеры. */
  img: { src: string; w: number; h: number }
  /** CSS-значение background-image: размытое превью картинки. */
  placeholder: string
}

/** Картинка либо обычный URL (svg-заглушки, внешние ссылки). */
export type ImageSource = string | ResponsiveImage

export function isResponsiveImage(source: ImageSource): source is ResponsiveImage {
  return typeof source !== 'string'
}

/** URL самой большой версии — для лайтбокса и предзагрузки. */
export function largestSrc(source: ImageSource): string {
  if (!isResponsiveImage(source)) {
    return source
  }

  const srcset = source.sources.webp ?? Object.values(source.sources)[0]
  const candidates = srcset?.split(',').map((entry) => entry.trim().split(/\s+/)[0]) ?? []
  return candidates[candidates.length - 1] ?? source.img.src
}
