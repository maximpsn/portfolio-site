import './PrimaryButton.css'

type PrimaryButtonMediumPreviewState = 'default' | 'interactive'

type PrimaryButtonMediumProps = {
  text: string
  previewState?: PrimaryButtonMediumPreviewState
}

function PrimaryButtonMedium({
  text,
  previewState = 'default',
}: PrimaryButtonMediumProps) {
  const className = [
    'primary-button',
    'primary-button--m',
    previewState === 'interactive' ? 'primary-button--interactive-preview' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={className} type="button">
      <span className="primary-button__label">{text}</span>
    </button>
  )
}

export default PrimaryButtonMedium
