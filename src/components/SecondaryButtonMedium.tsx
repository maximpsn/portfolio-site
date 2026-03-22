import type { ReactNode } from 'react'
import './SecondaryButton.css'

type SecondaryButtonMediumPreviewState = 'default' | 'interactive'

type SecondaryButtonMediumProps = {
  text: string
  icon?: ReactNode
  previewState?: SecondaryButtonMediumPreviewState
}

function SecondaryButtonMedium({
  text,
  icon,
  previewState = 'default',
}: SecondaryButtonMediumProps) {
  const className = [
    'secondary-button',
    previewState === 'interactive' ? 'secondary-button--interactive-preview' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={className} type="button">
      {icon ? <span className="secondary-button__icon">{icon}</span> : null}
      <span className="secondary-button__label">{text}</span>
    </button>
  )
}

export default SecondaryButtonMedium
