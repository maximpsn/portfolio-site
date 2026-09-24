import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './PrimaryButton.css'
import useTouchPressState from '../hooks/useTouchPressState'

type PrimaryButtonLargePreviewState = 'default' | 'interactive'

type PrimaryButtonLargeProps = {
  text: string
  icon?: ReactNode
  previewState?: PrimaryButtonLargePreviewState
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  rel?: string
}

function PrimaryButtonLarge({
  text,
  icon,
  previewState = 'default',
  href,
  target,
  rel,
}: PrimaryButtonLargeProps) {
  const { isTouchPressed, handlers } = useTouchPressState()
  const className = [
    'primary-button',
    'primary-button--l',
    icon ? 'primary-button--l-icon' : '',
    'primary-button--l-soft-press',
    'primary-button--l-stretch',
    isTouchPressed ? 'primary-button--touch-pressed' : '',
    previewState === 'interactive' ? 'primary-button--interactive-preview' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {icon ? <span className="primary-button__icon">{icon}</span> : null}
      <span className="primary-button__label">{text}</span>
    </>
  )

  if (href) {
    if (href.startsWith('/')) {
      return (
        <Link className={className} to={href} {...handlers}>
          {content}
        </Link>
      )
    }

    return (
      <a className={className} href={href} target={target} rel={rel} {...handlers}>
        {content}
      </a>
    )
  }

  return (
    <button className={className} type="button" {...handlers}>
      {content}
    </button>
  )
}

export default PrimaryButtonLarge
