import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import './CompanyCard.css'

const companyAvatar = 'https://www.figma.com/api/mcp/asset/48b8873a-e4c4-4c7e-bfce-469590379d3a'

type CompanyCardResolution = 'large' | 'medium' | 'small' | 'xsmall'

type CompanyCardProps = {
  className?: string
  resolution?: CompanyCardResolution
  companyName?: string
  period?: string
  aboutCompany?: string
  responsibilities?: string[]
  achievements?: string[]
}

const SIZE_BY_RESOLUTION = {
  large: '700px',
  medium: '700px',
  small: '450px',
  xsmall: '340px',
} as const

const AVATAR_SIZE_BY_RESOLUTION = {
  large: '48px',
  medium: '48px',
  small: '40px',
  xsmall: '40px',
} as const

const AVATAR_RADIUS_BY_RESOLUTION = {
  large: 'var(--radius-16)',
  medium: 'var(--radius-16)',
  small: 'var(--radius-12)',
  xsmall: 'var(--radius-12)',
} as const

const GAP_BY_RESOLUTION = {
  large: 'var(--spacing-5x)',
  medium: 'var(--spacing-5x)',
  small: 'var(--spacing-5x)',
  xsmall: 'var(--spacing-5x)',
} as const

const HEADER_GAP_BY_RESOLUTION = {
  large: 'var(--spacing-3x)',
  medium: 'var(--spacing-3x)',
  small: 'var(--spacing-3x)',
  xsmall: 'var(--spacing-3x)',
} as const

const MAIN_TEXT_GAP_BY_RESOLUTION = {
  large: '6px',
  medium: '6px',
  small: '6px',
  xsmall: '6px',
} as const

const SECTION_GAP_BY_RESOLUTION = {
  large: '8px',
  medium: '8px',
  small: '8px',
  xsmall: '8px',
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

const BODY_TITLE_FONT_BY_RESOLUTION = {
  large: 'var(--family-sans-large)',
  medium: 'var(--family-sans-medium)',
  small: 'var(--family-sans-small)',
  xsmall: 'var(--family-sans-xsmall)',
} as const

const BODY_TITLE_SIZE_BY_RESOLUTION = {
  large: 'var(--size-body-title-large)',
  medium: 'var(--size-body-title-medium)',
  small: 'var(--size-body-title-small)',
  xsmall: 'var(--size-body-title-xsmall)',
} as const

const BODY_TITLE_WEIGHT_BY_RESOLUTION = {
  large: 'var(--weight-semibold-large)',
  medium: 'var(--weight-semibold-medium)',
  small: 'var(--weight-semibold-small)',
  xsmall: 'var(--weight-semibold-xsmall)',
} as const

const BODY_TITLE_LINE_HEIGHT_BY_RESOLUTION = {
  large: 'var(--line-height-body-title-large)',
  medium: 'var(--line-height-body-title-medium)',
  small: 'var(--line-height-body-title-small)',
  xsmall: 'var(--line-height-body-title-xsmall)',
} as const

const BODY_TITLE_TRACKING_BY_RESOLUTION = {
  large: 'var(--tracking-body-title-large)',
  medium: 'var(--tracking-body-title-medium)',
  small: 'var(--tracking-body-title-small)',
  xsmall: 'var(--tracking-body-title-xsmall)',
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

const resolutionFromViewport = (): CompanyCardResolution => {
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

function CompanyCard({
  className,
  resolution,
  companyName = 'Company: Position',
  period = 'Date — Date (Time)',
  aboutCompany = 'About company',
  responsibilities = ['Text'],
  achievements = ['Text'],
}: CompanyCardProps) {
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
      className={className || 'company-card'}
      data-name={`Company Card ${activeResolution}`}
      data-resolution={activeResolution}
      style={
        {
          '--company-card-width': SIZE_BY_RESOLUTION[activeResolution],
          '--company-card-avatar-size': AVATAR_SIZE_BY_RESOLUTION[activeResolution],
          '--company-card-avatar-radius': AVATAR_RADIUS_BY_RESOLUTION[activeResolution],
          '--company-card-gap': GAP_BY_RESOLUTION[activeResolution],
          '--company-card-header-gap': HEADER_GAP_BY_RESOLUTION[activeResolution],
          '--company-card-main-text-gap': MAIN_TEXT_GAP_BY_RESOLUTION[activeResolution],
          '--company-card-section-gap': SECTION_GAP_BY_RESOLUTION[activeResolution],
          '--company-card-heading-font': HEADING_FONT_BY_RESOLUTION[activeResolution],
          '--company-card-heading-size': HEADING_SIZE_BY_RESOLUTION[activeResolution],
          '--company-card-heading-weight': HEADING_WEIGHT_BY_RESOLUTION[activeResolution],
          '--company-card-heading-line-height': HEADING_LINE_HEIGHT_BY_RESOLUTION[activeResolution],
          '--company-card-heading-tracking': HEADING_TRACKING_BY_RESOLUTION[activeResolution],
          '--company-card-body-title-font': BODY_TITLE_FONT_BY_RESOLUTION[activeResolution],
          '--company-card-body-title-size': BODY_TITLE_SIZE_BY_RESOLUTION[activeResolution],
          '--company-card-body-title-weight': BODY_TITLE_WEIGHT_BY_RESOLUTION[activeResolution],
          '--company-card-body-title-line-height': BODY_TITLE_LINE_HEIGHT_BY_RESOLUTION[activeResolution],
          '--company-card-body-title-tracking': BODY_TITLE_TRACKING_BY_RESOLUTION[activeResolution],
          '--company-card-body-font': BODY_FONT_BY_RESOLUTION[activeResolution],
          '--company-card-body-size': BODY_SIZE_BY_RESOLUTION[activeResolution],
          '--company-card-body-weight': BODY_WEIGHT_BY_RESOLUTION[activeResolution],
          '--company-card-body-line-height': BODY_LINE_HEIGHT_BY_RESOLUTION[activeResolution],
          '--company-card-body-tracking': BODY_TRACKING_BY_RESOLUTION[activeResolution],
        } as CSSProperties
      }
    >
      <div className="company-card__header">
        <div className="company-card__avatar">
          <img alt="" className="company-card__avatar-image" src={companyAvatar} />
        </div>

        <div className="company-card__main-text">
          <p className="company-card__company-name">{companyName}</p>
          <p className="company-card__period">{period}</p>
        </div>

        <p className="company-card__about">{aboutCompany}</p>
      </div>

      <div className="company-card__section">
        <p className="company-card__section-title">Чем занимался:</p>
        <ul className="company-card__list">
          {responsibilities.map((item) => (
            <li key={item} className="company-card__list-item">
              <span className="company-card__dash">–</span>
              <span className="company-card__list-text">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="company-card__section">
        <p className="company-card__section-title">Достижения:</p>
        <ul className="company-card__list">
          {achievements.map((item) => (
            <li key={item} className="company-card__list-item">
              <span className="company-card__dash">–</span>
              <span className="company-card__list-text">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default CompanyCard
