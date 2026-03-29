import './PrimaryButton.css'
import useTouchPressState from './useTouchPressState'

type PrimaryButtonMediumPreviewState = 'default' | 'interactive'

type PrimaryButtonMediumProps = {
  text: string
  previewState?: PrimaryButtonMediumPreviewState
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  rel?: string
}

function PrimaryButtonMedium({
  text,
  previewState = 'default',
  href,
  target,
  rel,
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

  if (href) {
    return (
      <a className={className} href={href} target={target} rel={rel} {...handlers}>
        <span className="primary-button__label">{text}</span>
      </a>
    )
  }

  return (
    <button className={className} type="button" {...handlers}>
      <span className="primary-button__label">{text}</span>
    </button>
  )
}

export default PrimaryButtonMedium
