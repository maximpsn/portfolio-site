import './CasePreviewCard.css'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Image from '../ui/Image'
import type { ImageSource } from '../../lib/responsiveImage'

import placeholderImage from '/image-placeholder.svg'

type CasePreviewCardProps = {
  className?: string
  href?: string
  iconSrc?: ImageSource
  coverSrc?: ImageSource
  /** Карточка на первом экране — обложка грузится сразу. */
  priority?: boolean
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
  priority = false,
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
    <Link className={className || 'case-preview-card'} to={href}>
      <div className="case-preview-card__text">
        <div className="case-preview-card__title-row">
          <span className="case-preview-card__icon">
            <Image
              source={iconSrc}
              sizes="32px"
              priority={priority}
              shimmer={false}
              className="case-preview-card__icon-picture"
              imgClassName="case-preview-card__icon-image"
            />
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
        <Image
          source={coverSrc}
          sizes="(max-width: 700px) 100vw, 700px"
          priority={priority}
          className="case-preview-card__cover-picture"
          imgClassName="case-preview-card__cover-image"
        />
      </div>
    </Link>
  )
}

export default CasePreviewCard
