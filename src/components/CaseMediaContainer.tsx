import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import type { ControllerRef, RenderSlideProps } from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import './CaseMediaContainer.css'

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
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideSrcs])

  const handleOpenLightbox = () => {
    setLightboxOpen(true)
  }

  const handleCloseLightbox = () => {
    setLightboxOpen(false)
  }

  const lightboxRootStyle = { '--yarl__color_backdrop': 'rgba(0, 0, 0, 0.5)' }

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

    return (
      <div className="case-stage-slide">
        <div className="case-stage-slide__box" style={boxStyle}>
          <img src={imageSlide.src} alt={imageSlide.alt ?? ''} className="case-stage-slide__image" />
        </div>
      </div>
    )
  }

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
        render={{ slide: renderSlide }}
        styles={{ root: lightboxRootStyle }}
        carousel={{ padding: 0 }}
        controller={{
          ref: controllerRef,
          closeOnBackdropClick: true,
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