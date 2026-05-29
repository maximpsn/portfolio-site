import './CasePreviewCard.css'
import { useState } from 'react'
import { motion } from 'framer-motion'

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
  href = '#components',
  iconSrc = placeholderImage,
  coverSrc = placeholderImage,
  projectName = 'Project name',
  heading = 'Heading',
}: CasePreviewCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotationX = ((y - centerY) / rect.height) * 10
    const rotationY = ((centerX - x) / rect.width) * 10

    setRotateX(rotationX)
    setRotateY(rotationY)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
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
        <motion.img
          alt=""
          className="case-preview-card__cover-image"
          src={coverSrc}
          animate={{ rotateX, rotateY }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          style={{ perspective: 1000 }}
        />
      </div>
    </a>
  )
}

export default CasePreviewCard
