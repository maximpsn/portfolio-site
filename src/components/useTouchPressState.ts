import { useEffect, useRef, useState } from 'react'

type TouchPressHandlers = {
  onPointerDown: () => void
  onPointerUp: () => void
  onPointerLeave: () => void
  onPointerCancel: () => void
}

type UseTouchPressStateResult = {
  isTouchPressed: boolean
  handlers: TouchPressHandlers
}

const TOUCH_PRESS_ANIMATION_MS = 240

const isCoarsePointer = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(pointer: coarse)').matches
}

function useTouchPressState(): UseTouchPressStateResult {
  const [isTouchPressed, setIsTouchPressed] = useState(false)
  const pressStartedAtRef = useRef<number | null>(null)
  const isPointerDownRef = useRef(false)
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
      if (!isPointerDownRef.current) {
        setIsTouchPressed(false)
        pressStartedAtRef.current = null
      }

      releaseTimerRef.current = null
    }, remainingMs)
  }

  const handlePointerDown = () => {
    if (!isCoarsePointer()) {
      return
    }

    isPointerDownRef.current = true
    pressStartedAtRef.current = Date.now()
    setIsTouchPressed(true)
    clearReleaseTimer()
  }

  const handlePointerUp = () => {
    if (!isCoarsePointer()) {
      return
    }

    if (!isPointerDownRef.current && !isTouchPressed) {
      return
    }

    isPointerDownRef.current = false
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
