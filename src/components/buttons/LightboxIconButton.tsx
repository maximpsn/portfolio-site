import type { ReactNode } from 'react'
import IconChevronLeft from '../icons/IconChevronLeft'
import IconChevronRight from '../icons/IconChevronRight'
import IconCross from '../icons/IconCross'
import './LightboxIconButton.css'
import useTouchPressState from '../hooks/useTouchPressState'

type LightboxIconButtonType = 'left' | 'right' | 'close'
type LightboxIconButtonPreviewState = 'default' | 'interactive'

const ICONS: Record<LightboxIconButtonType, ReactNode> = {
  left: <IconChevronLeft />,
  right: <IconChevronRight />,
  close: <IconCross />,
}

const LABELS: Record<LightboxIconButtonType, string> = {
  left: 'Предыдущий',
  right: 'Следующий',
  close: 'Закрыть',
}

type LightboxIconButtonProps = {
  className?: string
  type?: LightboxIconButtonType
  ariaLabel?: string
  onClick?: () => void
  previewState?: LightboxIconButtonPreviewState
}

function LightboxIconButton({
  className,
  type = 'left',
  ariaLabel,
  onClick,
  previewState = 'default',
}: LightboxIconButtonProps) {
  const { isTouchPressed, handlers } = useTouchPressState()
  const buttonClassName = [
    'lightbox-icon-button',
    className ?? '',
    isTouchPressed ? 'lightbox-icon-button--touch-pressed' : '',
    previewState === 'interactive' ? 'lightbox-icon-button--interactive-preview' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={buttonClassName}
      aria-label={ariaLabel ?? LABELS[type]}
      onClick={onClick}
      {...handlers}
    >
      <span className="lightbox-icon-button__icon">{ICONS[type]}</span>
    </button>
  )
}

export default LightboxIconButton