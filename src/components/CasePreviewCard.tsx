import './CasePreviewCard.css'

import placeholderImage from '/image-placeholder.svg'

type CasePreviewCardProps = {
  className?: string
  href?: string
  projectName?: string
  heading?: string
}

function CasePreviewCard({
  className,
  href = '#components',
  projectName = 'Project name',
  heading = 'Heading',
}: CasePreviewCardProps) {
  return (
    <a className={className || 'case-preview-card'} href={href}>
      <div className="case-preview-card__text">
        <div className="case-preview-card__title-row">
          <span className="case-preview-card__icon">
            <img alt="" className="case-preview-card__icon-image" src={placeholderImage} />
          </span>
          <p className="case-preview-card__project-name">{projectName}</p>
        </div>
        <p className="case-preview-card__heading">{heading}</p>
      </div>

      <div className="case-preview-card__cover">
        <img alt="" className="case-preview-card__cover-image" src={placeholderImage} />
      </div>
    </a>
  )
}

export default CasePreviewCard
