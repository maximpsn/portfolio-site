import { useEffect, useRef, useState } from 'react'
import IconCopy from './icons/IconCopy'
import IconSuccess from './icons/IconSuccess'
import useTouchPressState from './useTouchPressState'
import './EmailCopyButton.css'

const EMAIL_TO_COPY = 'pavlusenko.maksim@mail.ru'
const SUCCESS_TEXT = 'Email скопирован'
const SUCCESS_TIMEOUT_MS = 850
const CONTENT_FADE_MS = 150

type EmailCopyButtonResolution = 'large' | 'medium' | 'small' | 'xsmall'

type EmailCopyButtonLargeProps = {
  text?: string
}

const resolutionFromViewport = (): EmailCopyButtonResolution => {
  if (typeof window === 'undefined') {
    return 'large'
  }

  const width = window.innerWidth

  if (width >= 1300) {
    return 'large'
  }

  if (width >= 600) {
    return 'medium'
  }

  if (width >= 400) {
    return 'small'
  }

  return 'xsmall'
}

function EmailCopyButtonLarge({ text = EMAIL_TO_COPY }: EmailCopyButtonLargeProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [contentPhase, setContentPhase] = useState<'copy' | 'success'>('copy')
  const [contentVisible, setContentVisible] = useState(true)
  const [autoResolution, setAutoResolution] = useState(resolutionFromViewport)
  const resetTimeoutRef = useRef<number | null>(null)
  const contentFadeTimeoutRef = useRef<number | null>(null)
  const { isTouchPressed, handlers } = useTouchPressState()

  useEffect(() => {
    const handleResize = () => {
      setAutoResolution(resolutionFromViewport())
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)

      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current)
      }
      if (contentFadeTimeoutRef.current !== null) {
        window.clearTimeout(contentFadeTimeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_TO_COPY)

      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current)
      }
      if (contentFadeTimeoutRef.current !== null) {
        window.clearTimeout(contentFadeTimeoutRef.current)
      }

      setIsCopied(true)
      setContentVisible(false)
      contentFadeTimeoutRef.current = window.setTimeout(() => {
        setContentPhase('success')
        setContentVisible(true)
        contentFadeTimeoutRef.current = null
      }, CONTENT_FADE_MS)
      resetTimeoutRef.current = window.setTimeout(() => {
        setIsCopied(false)
        setContentVisible(false)
        contentFadeTimeoutRef.current = window.setTimeout(() => {
          setContentPhase('copy')
          setContentVisible(true)
          contentFadeTimeoutRef.current = null
        }, CONTENT_FADE_MS)
        resetTimeoutRef.current = null
      }, SUCCESS_TIMEOUT_MS)
    } catch {
      // No-op: if clipboard access is denied, keep the button in its current state.
    }
  }

  const visibleLabel = autoResolution === 'xsmall' ? 'email' : text

  return (
    <button
      className={`email-copy-button${isCopied ? ' email-copy-button--success' : ''}${isTouchPressed ? ' email-copy-button--pressed' : ''}`}
      onClick={handleCopy}
      {...handlers}
      type="button"
    >
      <span
        className={`email-copy-button__content${contentVisible ? ' email-copy-button__content--visible' : ''}`}
        aria-hidden={!contentVisible}
      >
        <span className="email-copy-button__icon">
          {contentPhase === 'success' ? (
            <IconSuccess className="email-copy-button__svg" />
          ) : (
            <IconCopy className="email-copy-button__svg" />
          )}
        </span>
        <span className="email-copy-button__label">
          {contentPhase === 'success' ? SUCCESS_TEXT : visibleLabel}
        </span>
      </span>
    </button>
  )
}

export default EmailCopyButtonLarge
