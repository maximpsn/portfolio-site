import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import './CaseSubheadingText.css'

type CaseSubheadingTextResolution = 'large' | 'medium' | 'small' | 'xsmall'

type CaseSubheadingTextProps = {
  className?: string
  resolution?: CaseSubheadingTextResolution
  subheading?: string
  paragraph?: string
}

const resolutionFromViewport = (): CaseSubheadingTextResolution => {
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
  large: 'var(--spacing-3x)',
  medium: 'var(--spacing-3x)',
  small: 'var(--spacing-2x)',
  xsmall: 'var(--spacing-2x)',
} as const

const WIDTH_BY_RESOLUTION = {
  large: '700px',
  medium: '700px',
  small: '450px',
  xsmall: '450px',
} as const

function CaseSubheadingText({
  className,
  resolution,
  subheading = 'Subheading',
  paragraph = 'Paragraph description',
}: CaseSubheadingTextProps) {
  const [autoResolution, setAutoResolution] = useState<CaseSubheadingTextResolution>(resolutionFromViewport)

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

  const activeResolution: CaseSubheadingTextResolution = resolution ?? autoResolution
  const blockClassName = className ? `case-subheading ${className}` : 'case-subheading'

  return (
    <div
      className={blockClassName}
      data-resolution={activeResolution}
      style={
        {
          '--case-subheading-gap': GAP_BY_RESOLUTION[activeResolution],
          '--case-subheading-width': WIDTH_BY_RESOLUTION[activeResolution],
        } as CSSProperties
      }
    >
      <p className="case-subheading__label">{subheading}</p>
      <p className="case-subheading__text">{paragraph}</p>
    </div>
  )
}

export default CaseSubheadingText