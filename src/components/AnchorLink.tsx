import './AnchorLink.css'
import useTouchPressState from './useTouchPressState'

type AnchorLinkPreviewState = 'default' | 'interactive'

type AnchorLinkProps = {
  href: string
  text: string
  previewState?: AnchorLinkPreviewState
}

function AnchorLink({
  href,
  text,
  previewState = 'default',
}: AnchorLinkProps) {
  const { isTouchPressed, handlers } = useTouchPressState()
  const className = [
    'anchor-link',
    isTouchPressed ? 'anchor-link--touch-pressed' : '',
    previewState === 'interactive' ? 'anchor-link--interactive-preview' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a className={className} href={href} {...handlers}>
      {text}
    </a>
  )
}

export default AnchorLink
