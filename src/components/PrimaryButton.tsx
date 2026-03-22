import './PrimaryButton.css'

type PrimaryButtonSize = 'M' | 'L'
type PrimaryButtonPreviewState = 'default' | 'interactive'

type PrimaryButtonProps = {
  text: string
  size?: PrimaryButtonSize
  previewState?: PrimaryButtonPreviewState
}

function PrimaryButton({
  text,
  size = 'M',
  previewState = 'default',
}: PrimaryButtonProps) {
  const className = [
    'primary-button',
    `primary-button--${size.toLowerCase()}`,
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

export default PrimaryButton
