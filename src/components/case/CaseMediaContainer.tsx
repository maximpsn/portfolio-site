import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent as ReactMouseEvent, Touch as ReactTouch, TouchEvent as ReactTouchEvent } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import type { ControllerRef, RenderSlideProps } from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import './CaseMediaContainer.css'
import './LightboxYarl.css'
import LightboxIconButton from '../buttons/LightboxIconButton'

import placeholderImage from '/image-placeholder.svg'

type CaseMediaContainerResolution = 'large' | 'medium' | 'small' | 'xsmall'

type CaseMediaContainerProps = {
  className?: string
  resolution?: CaseMediaContainerResolution
  src?: string
  alt?: string
  slides?: { src: string; alt?: string }[]
  index?: number
}

type LightboxSlideProps = {
  src: string
  alt?: string
  boxStyle: CSSProperties
  aspect?: number
  onClose: () => void
}

const MIN_SCALE = 1
const MAX_SCALE = 3
const WHEEL_STEP = 0.25

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value))
}

function LightboxSlide({ src, alt, boxStyle, aspect, onClose }: LightboxSlideProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const boxRef = useRef<HTMLDivElement | null>(null)
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null)
  const [scale, setScale] = useState(1)
  const [originX, setOriginX] = useState(50)
  const [originY, setOriginY] = useState(50)

  useEffect(() => {
    const root = rootRef.current
    if (!root) {
      return undefined
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const rect = root.getBoundingClientRect()
      setOriginX(((event.clientX - rect.left) / rect.width) * 100)
      setOriginY(((event.clientY - rect.top) / rect.height) * 100)
      setScale((s) => clampScale(s + (event.deltaY < 0 ? WHEEL_STEP : -WHEEL_STEP)))
    }

    root.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      root.removeEventListener('wheel', handleWheel)
    }
  }, [])

  const pinchDistance = (a: ReactTouch, b: ReactTouch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      pinchRef.current = { dist: pinchDistance(event.touches[0], event.touches[1]), scale }
    }
  }

  const handleTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2 && pinchRef.current) {
      event.preventDefault()
      const start = pinchRef.current
      const current = pinchDistance(event.touches[0], event.touches[1])
      setScale(clampScale(start.scale * (current / start.dist)))
    }
  }

  const handleTouchEnd = () => {
    pinchRef.current = null
  }

  const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (scale > 1) {
      return
    }

    const box = boxRef.current
    if (!box || !aspect || !Number.isFinite(aspect)) {
      onClose()
      return
    }

    const boxRect = box.getBoundingClientRect()
    const boxAspect = boxRect.height > 0 ? boxRect.width / boxRect.height : 1

    let visualWidth: number
    let visualHeight: number

    if (aspect > boxAspect) {
      visualWidth = boxRect.width
      visualHeight = boxRect.width / aspect
    } else {
      visualHeight = boxRect.height
      visualWidth = boxRect.height * aspect
    }

    const visualX = boxRect.left + (boxRect.width - visualWidth) / 2
    const visualY = boxRect.top + (boxRect.height - visualHeight) / 2

    const inImage =
      event.clientX >= visualX &&
      event.clientX <= visualX + visualWidth &&
      event.clientY >= visualY &&
      event.clientY <= visualY + visualHeight

    if (!inImage) {
      onClose()
    }
  }

  const zoomedStyle: CSSProperties = {
    ...boxStyle,
    transform: `scale(${scale})`,
    transformOrigin: `${originX}% ${originY}%`,
  }

  return (
    <div
      ref={rootRef}
      className="case-stage-slide"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div ref={boxRef} className="case-stage-slide__box" style={zoomedStyle}>
        <img src={src} alt={alt ?? ''} className="case-stage-slide__image" />
      </div>
    </div>
  )
}

const resolutionFromViewport = (): CaseMediaContainerResolution => {
  if (typeof window === 'undefined') {
    return 'large'
  }

  const width = window.innerWidth

  if (width >= 1300) {
    return 'large'
  }

  if (width >= 600) {
    return 'medium'
  }

  if (width >= 400) {
    return 'small'
  }

  return 'xsmall'
}

const WIDTH_BY_RESOLUTION = {
  large: '700px',
  medium: '700px',
  small: '450px',
  xsmall: '450px',
} as const

const RADIUS_BY_RESOLUTION = {
  large: 'var(--radius-24)',
  medium: 'var(--radius-24)',
  small: 'var(--radius-20)',
  xsmall: 'var(--radius-20)',
} as const

function CaseMediaContainer({
  className,
  resolution,
  src = placeholderImage,
  alt = '',
  slides,
  index = 0,
}: CaseMediaContainerProps) {
  const [autoResolution, setAutoResolution] = useState<CaseMediaContainerResolution>(resolutionFromViewport)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [viewport, setViewport] = useState({ w: 0, h: 0 })
  const baseAspectRef = useRef(1)
  const aspectRef = useRef<Record<string, number>>({})
  const controllerRef = useRef<ControllerRef>(null)

  useEffect(() => {
    if (!lightboxOpen) {
      return
    }

    const rafId = window.requestAnimationFrame(() => {
      controllerRef.current?.focus()
    })

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [lightboxOpen])

  useEffect(() => {
    const handleResize = () => {
      setAutoResolution(resolutionFromViewport())
      setViewport({ w: window.innerWidth, h: window.innerHeight })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const activeResolution: CaseMediaContainerResolution = resolution ?? autoResolution
  const blockClassName = className ? `case-media ${className}` : 'case-media'

  const lightboxSlides = slides && slides.length > 0
    ? slides
    : [{ src }]

  const slideSrcs = lightboxSlides.map((slide) => slide.src).join('\u0000')

  useEffect(() => {
    const imgs = lightboxSlides
      .map((slide) => slide.src)
      .map((src) => {
        const img = new Image()
        img.src = src
        return img
      })

    let cancelled = false

    const awaited = imgs.map(
      (img) =>
        new Promise<number>((resolve) => {
          const done = () => resolve(img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : NaN)
          if (img.complete) {
            done()
          } else {
            img.onload = done
            img.onerror = done
          }
        }),
    )

    Promise.all(awaited).then((ratios) => {
      if (cancelled) {
        return
      }

      const valid = ratios.filter((ratio) => Number.isFinite(ratio) && ratio > 0)

      baseAspectRef.current = valid.length > 0 ? Math.max(...valid) : 1

      lightboxSlides.forEach((slide, i) => {
        aspectRef.current[slide.src] = ratios[i]
      })
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideSrcs])

  const aspect = baseAspectRef.current
  const maxStageHeight = viewport.h * 0.9
  let stageWidth = viewport.w
  let stageHeight = viewport.w / aspect

  if (viewport.w > 0 && maxStageHeight > 0 && stageHeight > maxStageHeight) {
    stageHeight = maxStageHeight
    stageWidth = maxStageHeight * aspect
  }

  const renderSlide = ({ slide }: RenderSlideProps) => {
    const imageSlide = slide as { src?: string; alt?: string }
    const isPortrait = viewport.h > viewport.w
    const boxStyle: CSSProperties = isPortrait
      ? { width: '100%', height: '100%' }
      : ({ '--stage-w': `${stageWidth}px`, '--stage-h': `${stageHeight}px` } as CSSProperties)

    const slideSrc = imageSlide.src ?? ''

    return (
      <LightboxSlide
        key={slideSrc}
        src={slideSrc}
        alt={imageSlide.alt}
        boxStyle={boxStyle}
        aspect={slideSrc ? aspectRef.current[slideSrc] : undefined}
        onClose={() => controllerRef.current?.close()}
      />
    )
  }

  const hitPrev = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    controllerRef.current?.prev()
  }

  const hitNext = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    controllerRef.current?.next()
  }

  const hitClose = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    controllerRef.current?.close()
  }

  const handleOpenLightbox = () => {
    setLightboxOpen(true)
  }

  const handleCloseLightbox = () => {
    setLightboxOpen(false)
  }

  const rootStyle = { '--yarl__color_backdrop': 'var(--glass-glass-hard-primary)' }

  return (
    <div
      className={blockClassName}
      data-resolution={activeResolution}
      onClick={handleOpenLightbox}
      style={
        {
          '--case-media-width': WIDTH_BY_RESOLUTION[activeResolution],
          '--case-media-radius': RADIUS_BY_RESOLUTION[activeResolution],
          cursor: 'pointer',
        } as CSSProperties
      }
    >
      <img alt={alt} className="case-media__image" src={src} />

      <Lightbox
        open={lightboxOpen}
        close={handleCloseLightbox}
        index={index}
        slides={lightboxSlides}
        render={{
          slide: renderSlide,
          buttonPrev: () => (
            <div className="yarl-lightbox-hit yarl-lightbox-hit--prev" onClick={hitPrev}>
              <LightboxIconButton type="left" />
            </div>
          ),
          buttonNext: () => (
            <div className="yarl-lightbox-hit yarl-lightbox-hit--next" onClick={hitNext}>
              <LightboxIconButton type="right" />
            </div>
          ),
          buttonClose: () => (
            <div className="yarl-lightbox-hit yarl-lightbox-hit--close" onClick={hitClose}>
              <LightboxIconButton type="close" />
            </div>
          ),
        }}
        styles={{ root: rootStyle }}
        carousel={{ padding: 0 }}
        controller={{
          ref: controllerRef,
          closeOnBackdropClick: false,
          closeOnPullUp: true,
          closeOnPullDown: true,
        }}
        animation={{
          fade: 250,
          easing: { fade: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        }}
      />
    </div>
  )
}

export default CaseMediaContainer