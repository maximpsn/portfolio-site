import type { ReactNode } from 'react'
import './SecondaryButtonDark.css'

type SecondaryButtonDarkMediumPreviewState = 'default' | 'interactive'

type SecondaryButtonDarkMediumProps = {
  text: string
  icon?: ReactNode
  previewState?: SecondaryButtonDarkMediumPreviewState
}

function SecondaryButtonDarkMedium({
  text,
  icon,
  previewState = 'default',
}: SecondaryButtonDarkMediumProps) {
  const className = [
    'secondary-button-dark',
    previewState === 'interactive' ? 'secondary-button-dark--interactive-preview' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={className} type="button">
      {icon ? <span className="secondary-button-dark__icon">{icon}</span> : null}
      <span className="secondary-button-dark__label">{text}</span>
    </button>
  )
}

export default SecondaryButtonDarkMedium
