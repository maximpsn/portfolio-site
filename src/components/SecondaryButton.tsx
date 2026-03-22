import type { ReactNode } from 'react'
import './SecondaryButton.css'

type SecondaryButtonPreviewState = 'default' | 'interactive'

type SecondaryButtonProps = {
  text: string
  icon?: ReactNode
  previewState?: SecondaryButtonPreviewState
}

function SecondaryButton({
  text,
  icon,
  previewState = 'default',
}: SecondaryButtonProps) {
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

export default SecondaryButton
