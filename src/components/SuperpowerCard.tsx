import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import './SuperpowerCard.css'

import placeholderImage from '/image-placeholder.svg'

type SuperpowerCardResolution = 'large' | 'medium' | 'small' | 'xsmall'

type SuperpowerCardProps = {
  className?: string
  resolution?: SuperpowerCardResolution
}

const SIZE_BY_RESOLUTION = {
  large: '700px',
  medium: '650px',
  small: '450px',
  xsmall: '340px',
} as const

const GAP_BY_RESOLUTION = {
  large: 'var(--spacing-7x)',
  medium: 'var(--spacing-6x)',
  small: 'var(--spacing-5x)',
  xsmall: 'var(--spacing-5x)',
} as const

const IMAGE_RADIUS_BY_RESOLUTION = {
  large: 'var(--radius-24)',
  medium: 'var(--radius-24)',
  small: 'var(--radius-20)',
  xsmall: 'var(--radius-20)',
} as const

const TEXT_GAP_BY_RESOLUTION = {
  large: 'var(--spacing-3x)',
  medium: 'var(--spacing-3x)',
  small: 'var(--spacing-2x)',
  xsmall: 'var(--spacing-2x)',
} as const

const HEADING_FONT_BY_RESOLUTION = {
  large: 'var(--family-sans-large)',
  medium: 'var(--family-sans-medium)',
  small: 'var(--family-sans-small)',
  xsmall: 'var(--family-sans-xsmall)',
} as const

const HEADING_SIZE_BY_RESOLUTION = {
  large: 'var(--size-heading-lg-large)',
  medium: 'var(--size-heading-lg-medium)',
  small: 'var(--size-heading-lg-small)',
  xsmall: 'var(--size-heading-lg-xsmall)',
} as const

const HEADING_WEIGHT_BY_RESOLUTION = {
  large: 'var(--weight-semibold-large)',
  medium: 'var(--weight-semibold-medium)',
  small: 'var(--weight-semibold-small)',
  xsmall: 'var(--weight-semibold-xsmall)',
} as const

const HEADING_LINE_HEIGHT_BY_RESOLUTION = {
  large: 'var(--line-height-heading-lg-large)',
  medium: 'var(--line-height-heading-lg-medium)',
  small: 'var(--line-height-heading-lg-small)',
  xsmall: 'var(--line-height-heading-lg-xsmall)',
} as const

const HEADING_TRACKING_BY_RESOLUTION = {
  large: 'var(--tracking-heading-lg-large)',
  medium: 'var(--tracking-heading-lg-medium)',
  small: 'var(--tracking-heading-lg-small)',
  xsmall: 'var(--tracking-heading-lg-xsmall)',
} as const

const BODY_FONT_BY_RESOLUTION = {
  large: 'var(--family-sans-large)',
  medium: 'var(--family-sans-medium)',
  small: 'var(--family-sans-small)',
  xsmall: 'var(--family-sans-xsmall)',
} as const

const BODY_SIZE_BY_RESOLUTION = {
  large: 'var(--size-body-text-large)',
  medium: 'var(--size-body-text-medium)',
  small: 'var(--size-body-text-medium)',
  xsmall: 'var(--size-body-text-medium)',
} as const

const BODY_WEIGHT_BY_RESOLUTION = {
  large: 'var(--weight-regular-large)',
  medium: 'var(--weight-regular-medium)',
  small: 'var(--weight-regular-small)',
  xsmall: 'var(--weight-regular-xsmall)',
} as const

const BODY_LINE_HEIGHT_BY_RESOLUTION = {
  large: 'var(--line-height-body-text-large)',
  medium: 'var(--line-height-body-text-medium)',
  small: 'var(--line-height-body-text-medium)',
  xsmall: 'var(--line-height-body-text-medium)',
} as const

const BODY_TRACKING_BY_RESOLUTION = {
  large: 'var(--tracking-body-text-large)',
  medium: 'var(--tracking-body-text-medium)',
  small: 'var(--tracking-body-text-medium)',
  xsmall: 'var(--tracking-body-text-medium)',
} as const

const resolutionFromViewport = (): SuperpowerCardResolution => {
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

function SuperpowerCard({ className, resolution }: SuperpowerCardProps) {
  const [autoResolution, setAutoResolution] = useState(resolutionFromViewport)

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

  const activeResolution = resolution ?? autoResolution

  return (
    <article
      className={className || 'superpower-card'}
      data-name={`Superpower Card ${activeResolution}`}
      data-resolution={activeResolution}
      style={
        {
          '--superpower-card-width': SIZE_BY_RESOLUTION[activeResolution],
          '--superpower-card-gap': GAP_BY_RESOLUTION[activeResolution],
          '--superpower-card-image-radius': IMAGE_RADIUS_BY_RESOLUTION[activeResolution],
          '--superpower-card-text-gap': TEXT_GAP_BY_RESOLUTION[activeResolution],
          '--superpower-card-heading-font': HEADING_FONT_BY_RESOLUTION[activeResolution],
          '--superpower-card-heading-size': HEADING_SIZE_BY_RESOLUTION[activeResolution],
          '--superpower-card-heading-weight': HEADING_WEIGHT_BY_RESOLUTION[activeResolution],
          '--superpower-card-heading-line-height': HEADING_LINE_HEIGHT_BY_RESOLUTION[activeResolution],
          '--superpower-card-heading-tracking': HEADING_TRACKING_BY_RESOLUTION[activeResolution],
          '--superpower-card-body-font': BODY_FONT_BY_RESOLUTION[activeResolution],
          '--superpower-card-body-size': BODY_SIZE_BY_RESOLUTION[activeResolution],
          '--superpower-card-body-weight': BODY_WEIGHT_BY_RESOLUTION[activeResolution],
          '--superpower-card-body-line-height': BODY_LINE_HEIGHT_BY_RESOLUTION[activeResolution],
          '--superpower-card-body-tracking': BODY_TRACKING_BY_RESOLUTION[activeResolution],
        } as CSSProperties
      }
    >
      <div className="superpower-card__media">
        <img alt="" className="superpower-card__image" src={placeholderImage} />
      </div>

      <div className="superpower-card__content">
        <p className="superpower-card__heading">Сильные стороны: визуал и системность</p>
        <p className="superpower-card__text">
          Windscribe doesn’t offer a traditional free trial, but we do offer a completely free plan with up to 10GB of
          data per month (no credit card required). If you need more, you can upgrade to Windscribe Pro for as little
          as $3 USD per month. If you aren’t ready to upgrade, you can always get more data by referring a friend or
          posting about us on X.
        </p>
      </div>
    </article>
  )
}

export default SuperpowerCard
