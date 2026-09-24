import type { ReactNode } from 'react'
import IconChevronLeft from './icons/IconChevronLeft'
import './SecondaryIconButton.css'
import useTouchPressState from './useTouchPressState'

type SecondaryIconButtonPreviewState = 'default' | 'interactive'

type SecondaryIconButtonMediumProps = {
  icon?: ReactNode
  ariaLabel?: string
  onClick?: () => void
  previewState?: SecondaryIconButtonPreviewState
}

function SecondaryIconButtonMedium({
  icon = <IconChevronLeft />,
  ariaLabel = 'Назад',
  onClick,
  previewState = 'default',
}: SecondaryIconButtonMediumProps) {
  const { isTouchPressed, handlers } = useTouchPressState()
  const className = [
    'secondary-icon-button',
    isTouchPressed ? 'secondary-icon-button--touch-pressed' : '',
    previewState === 'interactive' ? 'secondary-icon-button--interactive-preview' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
      {...handlers}
    >
      <span className="secondary-icon-button__icon">{icon}</span>
    </button>
  )
}

export default SecondaryIconButtonMedium