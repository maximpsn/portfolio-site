import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import './CaseHeadingText.css'

type CaseHeadingTextResolution = 'large' | 'medium' | 'small' | 'xsmall'

type CaseHeadingTextProps = {
  className?: string
  resolution?: CaseHeadingTextResolution
  subheading?: string
  paragraph?: string
}

const resolutionFromViewport = (): CaseHeadingTextResolution => {
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

function CaseHeadingText({
  className,
  resolution,
  subheading = 'Subheading',
  paragraph = 'Paragraph description',
}: CaseHeadingTextProps) {
  const [autoResolution, setAutoResolution] = useState<CaseHeadingTextResolution>(resolutionFromViewport)

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

  const activeResolution: CaseHeadingTextResolution = resolution ?? autoResolution
  const blockClassName = className ? `case-heading ${className}` : 'case-heading'

  return (
    <div
      className={blockClassName}
      data-resolution={activeResolution}
      style={
        {
          '--case-heading-gap': GAP_BY_RESOLUTION[activeResolution],
          '--case-heading-width': WIDTH_BY_RESOLUTION[activeResolution],
        } as CSSProperties
      }
    >
      <p className="case-heading__title">{subheading}</p>
      <p className="case-heading__text">{paragraph}</p>
    </div>
  )
}

export default CaseHeadingText