import './CasePreviewCard.css'
import { useState } from 'react'
import type { CSSProperties } from 'react'

import placeholderImage from '/image-placeholder.svg'

type CasePreviewCardProps = {
  className?: string
  href?: string
  iconSrc?: string
  coverSrc?: string
  projectName?: string
  heading?: string
}

function CasePreviewCard({
  className,
  href = '#projects',
  iconSrc = placeholderImage,
  coverSrc = placeholderImage,
  projectName = 'Project name',
  heading = 'Heading',
}: CasePreviewCardProps) {
  const [glow, setGlow] = useState<{ x: number; y: number } | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setGlow({ x, y })
  }

  const handleMouseLeave = () => {
    setGlow(null)
  }

  return (
    <a className={className || 'case-preview-card'} href={href}>
      <div className="case-preview-card__text">
        <div className="case-preview-card__title-row">
          <span className="case-preview-card__icon">
            <img alt="" className="case-preview-card__icon-image" src={iconSrc} />
          </span>
          <p className="case-preview-card__project-name">{projectName}</p>
        </div>
        <p className="case-preview-card__heading">{heading}</p>
      </div>

      <div
        className="case-preview-card__cover"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <span
          className="case-preview-card__glow"
          aria-hidden="true"
          style={
            {
              '--mx': glow ? `${glow.x}%` : '50%',
              '--my': glow ? `${glow.y}%` : '50%',
              opacity: glow ? 1 : 0,
            } as CSSProperties
          }
        />
        <img alt="" className="case-preview-card__cover-image" src={coverSrc} />
      </div>
    </a>
  )
}

export default CasePreviewCard
