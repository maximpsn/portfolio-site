import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

type TouchPressHandlers = {
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  onPointerUp: () => void
  onPointerLeave: () => void
  onPointerCancel: () => void
}

type UseTouchPressStateResult = {
  isTouchPressed: boolean
  handlers: TouchPressHandlers
}

const TOUCH_PRESS_ANIMATION_MS = 350

function useTouchPressState(): UseTouchPressStateResult {
  const [isTouchPressed, setIsTouchPressed] = useState(false)
  const pressStartedAtRef = useRef<number | null>(null)
  const lastPointerTypeRef = useRef<'mouse' | 'pen' | 'touch' | ''>('')
  const releaseTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (releaseTimerRef.current !== null) {
        window.clearTimeout(releaseTimerRef.current)
      }
    }
  }, [])

  const clearReleaseTimer = () => {
    if (releaseTimerRef.current !== null) {
      window.clearTimeout(releaseTimerRef.current)
      releaseTimerRef.current = null
    }
  }

  const scheduleRelease = () => {
    const startedAt = pressStartedAtRef.current ?? Date.now()
    const elapsedMs = Date.now() - startedAt
    const remainingMs = Math.max(0, TOUCH_PRESS_ANIMATION_MS - elapsedMs)

    clearReleaseTimer()
    releaseTimerRef.current = window.setTimeout(() => {
      setIsTouchPressed(false)
      pressStartedAtRef.current = null
      releaseTimerRef.current = null
    }, remainingMs)
  }

  const handlePointerDown = (event: ReactPointerEvent) => {
    lastPointerTypeRef.current = event.pointerType as 'mouse' | 'pen' | 'touch'

    if (event.pointerType === 'touch') {
      clearReleaseTimer()
      setIsTouchPressed(false)
      pressStartedAtRef.current = null
      return
    }

    pressStartedAtRef.current = Date.now()
    setIsTouchPressed(true)
    clearReleaseTimer()
  }

  const handlePointerUp = () => {
    if (lastPointerTypeRef.current === 'touch') {
      setIsTouchPressed(false)
      pressStartedAtRef.current = null
      clearReleaseTimer()
      return
    }

    scheduleRelease()
  }

  return {
    isTouchPressed,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
  }
}

export default useTouchPressState
