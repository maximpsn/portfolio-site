import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import Image from './Image'
import { isResponsiveImage, type ImageSource } from '../../lib/responsiveImage'
import './Video.css'

export type VideoSource = {
  src: string
  /** Например 'video/webm' или 'video/mp4'. Порядок важен: браузер берёт первый подходящий. */
  type: string
}

type VideoProps = {
  /** Сначала WebM (легче), потом MP4 (H.264) — для Safari и всего остального. */
  sources: VideoSource[]
  /** Обложка: первый кадр ролика, импорт `./poster.jpg?img`. Даёт размытое превью и шиммер. */
  poster: ImageSource
  /** sizes для обложки — такой же, как был бы у картинки на этом месте. */
  sizes?: string
  /** Пропорции, если обложка — не адаптивная картинка. */
  aspectRatio?: number
  className?: string
  /** Видео на первом экране: обложка грузится сразу. */
  priority?: boolean
  loop?: boolean
}

function prefersStaticMedia(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true
  }

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return connection?.saveData === true
}

/**
 * Декоративное видео (muted autoplay loop) с бережной загрузкой:
 *  - пока ролик не на экране, качается только обложка (с размытым превью и шиммером);
 *  - файл видео начинает грузиться, когда ролик появляется в зоне видимости;
 *  - играет, только пока виден, и останавливается, когда уходит с экрана;
 *  - проявляется поверх обложки, когда реально пошли кадры;
 *  - при «уменьшить движение» или экономии трафика остаётся обложка.
 *
 * Пример:
 *   import poster from '../assets/videos/demo-poster.jpg?img'
 *   <Video poster={poster} sizes="(max-width: 700px) 100vw, 700px"
 *          sources={[{ src: '/videos/demo.webm', type: 'video/webm' },
 *                    { src: '/videos/demo.mp4', type: 'video/mp4' }]} />
 */
function Video({
  sources,
  poster,
  sizes,
  aspectRatio,
  className,
  priority = false,
  loop = true,
}: VideoProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [staticOnly] = useState(() => prefersStaticMedia())
  const [activated, setActivated] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (staticOnly || !root) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current

        if (entry.isIntersecting) {
          setActivated(true)
          video?.play().catch(() => {
            // Автоплей заблокирован (например, режим энергосбережения) — остаётся обложка.
          })
        } else {
          video?.pause()
        }
      },
      // Начинаем грузить чуть заранее, до того как ролик въедет в экран.
      { rootMargin: '200px 0px', threshold: 0 },
    )

    observer.observe(root)
    return () => observer.disconnect()
  }, [staticOnly])

  // Как только источники подставлены — пробуем запустить (если ролик ещё на экране).
  useEffect(() => {
    const video = videoRef.current
    if (!activated || !video) {
      return
    }

    video.load()
    video.play().catch(() => {})
  }, [activated])

  const ratio = aspectRatio ?? (isResponsiveImage(poster) ? poster.img.w / poster.img.h : undefined)
  const rootClassName = ['smart-video', playing ? 'smart-video--playing' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      style={ratio ? ({ aspectRatio: String(ratio) } as CSSProperties) : undefined}
    >
      <Image
        source={poster}
        sizes={sizes}
        priority={priority}
        className="smart-video__poster"
        imgClassName="smart-video__poster-image"
      />

      {staticOnly ? null : (
        <video
          ref={videoRef}
          className="smart-video__video"
          muted
          loop={loop}
          playsInline
          preload="none"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
        >
          {activated
            ? sources.map((source) => <source key={source.src} src={source.src} type={source.type} />)
            : null}
        </video>
      )}
    </div>
  )
}

export default Video
