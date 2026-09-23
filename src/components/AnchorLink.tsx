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

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith('#')) {
      return
    }

    event.preventDefault()

    const targetId = href.slice(1)
    const target = document.getElementById(targetId)

    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a className={className} href={href} onClick={handleClick} {...handlers}>
      {text}
    </a>
  )
}

export default AnchorLink
