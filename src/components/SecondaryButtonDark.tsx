import type { ReactNode } from 'react'
import './SecondaryButtonDark.css'

type SecondaryButtonDarkPreviewState = 'default' | 'interactive'

type SecondaryButtonDarkProps = {
  text: string
  icon?: ReactNode
  previewState?: SecondaryButtonDarkPreviewState
}

function SecondaryButtonDark({
  text,
  icon,
  previewState = 'default',
}: SecondaryButtonDarkProps) {
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

export default SecondaryButtonDark
