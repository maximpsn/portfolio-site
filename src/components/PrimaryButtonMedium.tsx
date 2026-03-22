import './PrimaryButton.css'
import useTouchPressState from './useTouchPressState'

type PrimaryButtonMediumPreviewState = 'default' | 'interactive'

type PrimaryButtonMediumProps = {
  text: string
  previewState?: PrimaryButtonMediumPreviewState
}

function PrimaryButtonMedium({
  text,
  previewState = 'default',
}: PrimaryButtonMediumProps) {
  const { isTouchPressed, handlers } = useTouchPressState()
  const className = [
    'primary-button',
    'primary-button--m',
    isTouchPressed ? 'primary-button--touch-pressed' : '',
    previewState === 'interactive' ? 'primary-button--interactive-preview' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={className} type="button" {...handlers}>
      <span className="primary-button__label">{text}</span>
    </button>
  )
}

export default PrimaryButtonMedium
