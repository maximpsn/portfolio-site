import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import './CaseHead.css'

import CaseMediaContainer from './CaseMediaContainer'

import placeholderImage from '/image-placeholder.svg'

type CaseHeadResolution = 'large' | 'medium' | 'small' | 'xsmall'

type CaseLink = {
  label: string
  href: string
}

type CaseHeadProps = {
  className?: string
  resolution?: CaseHeadResolution
  avatarSrc?: string
  title?: string
  description?: string
  links?: CaseLink[]
  coverSrc?: string
  slides?: { src: string; alt?: string }[]
}

const resolutionFromViewport = (): CaseHeadResolution => {
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

const GAP_BY_RESOLUTION = {
  large: 'var(--spacing-6x)',
  medium: 'var(--spacing-5x)',
  small: 'var(--spacing-5x)',
  xsmall: 'var(--spacing-4x)',
} as const

const WIDTH_BY_RESOLUTION = {
  large: '700px',
  medium: '700px',
  small: '450px',
  xsmall: '450px',
} as const

const AVATAR_SIZE_BY_RESOLUTION = {
  large: 64,
  medium: 64,
  small: 48,
  xsmall: 48,
} as const

const AVATAR_RADIUS_BY_RESOLUTION = {
  large: 'var(--radius-20)',
  medium: 'var(--radius-20)',
  small: 'var(--radius-16)',
  xsmall: 'var(--radius-16)',
} as const

const TEXT_GAP_BY_RESOLUTION = {
  large: 'var(--spacing-3x)',
  medium: 'var(--spacing-3x)',
  small: 'var(--spacing-3x)',
  xsmall: 'var(--spacing-2x)',
} as const

function CaseHead({
  className,
  resolution,
  avatarSrc = placeholderImage,
  title = '',
  description = '',
  links = [],
  coverSrc = placeholderImage,
  slides,
}: CaseHeadProps) {
  const [autoResolution, setAutoResolution] = useState<CaseHeadResolution>(resolutionFromViewport)

  useEffect(() => {
    const handleResize = () => {
      setAutoResolution(resolutionFromViewport())
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const activeResolution: CaseHeadResolution = resolution ?? autoResolution
  const headClassName = className ? `case-head ${className}` : 'case-head'

  const lightboxSlides = slides && slides.length > 0
    ? slides
    : [{ src: coverSrc }]

  return (
    <div
      className={headClassName}
      data-resolution={activeResolution}
      style={
        {
          '--case-head-gap': GAP_BY_RESOLUTION[activeResolution],
          '--case-head-width': WIDTH_BY_RESOLUTION[activeResolution],
          '--case-head-avatar-size': `${AVATAR_SIZE_BY_RESOLUTION[activeResolution]}px`,
          '--case-head-avatar-radius': AVATAR_RADIUS_BY_RESOLUTION[activeResolution],
          '--case-head-text-gap': TEXT_GAP_BY_RESOLUTION[activeResolution],
        } as CSSProperties
      }
    >
      <div className="case-head__avatar">
        <img alt="" className="case-head__avatar-image" src={avatarSrc} />
      </div>

      <div className="case-head__description">
        {title ? <h1 className="case-head__title">{title}</h1> : null}
        {description ? <p className="case-head__text">{description}</p> : null}

        {links.length > 0 ? (
          <div className="case-head__links">
            {links.map((link) => (
              <a
                key={link.label}
                className="case-head__link"
                href={link.href}
                onClick={(event) => {
                  if (link.href.startsWith('#')) {
                    event.preventDefault()
                  }
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className="case-head__cover">
        <CaseMediaContainer src={coverSrc} resolution={activeResolution} slides={lightboxSlides} />
      </div>
    </div>
  )
}

export default CaseHead