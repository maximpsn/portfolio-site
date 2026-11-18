import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'
import sharp from 'sharp'

/**
 * Адаптивные картинки. Импорт `./photo.jpg?img` (или `?img-small` для иконок и аватаров)
 * отдаёт объект ResponsiveImage (см. src/lib/responsiveImage.ts):
 *   - sources: srcset для AVIF и WebP в нескольких ширинах (через vite-imagetools);
 *   - img: fallback-src и исходные размеры;
 *   - placeholder: крошечная размытая версия картинки (~200 байт), вшитая как data URL.
 * Ширины больше исходной не генерируются.
 */
const IMAGE_PRESETS = {
  img: [480, 800, 1200, 1600],
  'img-small': [64, 128, 256, 400],
}

const PREFIX = '\0responsive-image:'

async function blurPlaceholder(file) {
  const { data, info } = await sharp(file)
    .resize(16, 16, { fit: 'inside' })
    .webp({ quality: 40 })
    .toBuffer({ resolveWithObject: true })

  // Размытие делает сам SVG-фильтр — так превью мягкое на любом размере, без «пикселей».
  const w = info.width * 40
  const h = info.height * 40
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>` +
    `<filter id='b' color-interpolation-filters='sRGB'>` +
    `<feGaussianBlur stdDeviation='20'/>` +
    `<feColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/>` +
    `<feFlood x='0' y='0' width='100%' height='100%'/>` +
    `<feComposite operator='out' in='s'/>` +
    `<feComposite in2='SourceGraphic'/>` +
    `<feGaussianBlur stdDeviation='20'/>` +
    `</filter>` +
    `<image width='100%' height='100%' x='0' y='0' preserveAspectRatio='none' style='filter: url(%23b);' ` +
    `href='data:image/webp;base64,${data.toString('base64')}'/>` +
    `</svg>`

  return `url("data:image/svg+xml;charset=utf-8,${svg.replace(/"/g, "'").replace(/</g, '%3C').replace(/>/g, '%3E')}")`
}

function responsiveImages() {
  return {
    name: 'responsive-images',
    enforce: 'pre',
    async resolveId(source, importer) {
      const match = source.match(/^(.*)\?(img|img-small)$/)
      if (!match) {
        return null
      }

      const resolved = await this.resolve(match[1], importer, { skipSelf: true })
      return resolved ? `${PREFIX}${match[2]}:${resolved.id}` : null
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) {
        return null
      }

      const rest = id.slice(PREFIX.length)
      const separator = rest.indexOf(':')
      const preset = rest.slice(0, separator)
      const file = rest.slice(separator + 1)

      this.addWatchFile(file)

      const { width: originalWidth = 0 } = await sharp(file).metadata()
      const presetWidths = IMAGE_PRESETS[preset]
      const widths = presetWidths.filter((w) => w < originalWidth)
      if (originalWidth <= presetWidths[presetWidths.length - 1]) {
        widths.push(originalWidth)
      }

      const placeholder = await blurPlaceholder(file)
      const pictureImport = `${file}?w=${widths.join(';')}&format=avif;webp&as=picture`

      return (
        `import picture from ${JSON.stringify(pictureImport)};\n` +
        `export default { ...picture, placeholder: ${JSON.stringify(placeholder)} };\n`
      )
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [responsiveImages(), imagetools(), react()],
})
