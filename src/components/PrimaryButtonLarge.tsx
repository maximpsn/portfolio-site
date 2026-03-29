import './PrimaryButton.css'
import useTouchPressState from './useTouchPressState'

type PrimaryButtonLargePreviewState = 'default' | 'interactive'

type PrimaryButtonLargeProps = {
  text: string
  previewState?: PrimaryButtonLargePreviewState
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  rel?: string
}

function PrimaryButtonLarge({
  text,
  previewState = 'default',
  href,
  target,
  rel,
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

export default PrimaryButtonLarge
