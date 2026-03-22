import './AnchorLink.css'

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
  const className = [
    'anchor-link',
    previewState === 'interactive' ? 'anchor-link--interactive-preview' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a className={className} href={href}>
      {text}
    </a>
  )
}

export default AnchorLink
