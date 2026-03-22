import './PrimaryButton.css'
import useTouchPressState from './useTouchPressState'

type PrimaryButtonLargePreviewState = 'default' | 'interactive'

type PrimaryButtonLargeProps = {
  text: string
  previewState?: PrimaryButtonLargePreviewState
}

function PrimaryButtonLarge({
  text,
  previewState = 'default',
}: PrimaryButtonLargeProps) {
  const { isTouchPressed, handlers } = useTouchPressState()
  const className = [
    'primary-button',
    'primary-button--l',
    'primary-button--l-soft-press',
    'primary-button--l-stretch',
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

export default PrimaryButtonLarge
