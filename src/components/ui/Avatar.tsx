import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Tilt } from '../../../components/motion-primitives/tilt'
import './Avatar.css'

import mainAva from '../../assets/avatar/main-ava.jpeg'
import firstAva from '../../assets/avatar/1c-ava.jpeg'
import shrekAva from '../../assets/avatar/shrek-ava.jpeg'
import smurfAva from '../../assets/avatar/smurf-ava.jpeg'

type AvatarProps = {
  className?: string
  resolution?: 'large' | 'medium' | 'small' | 'xsmall'
  /** Какая картинка показывается по ховеру: случайная из неосновных или всегда Шрэк. */
  hoverVariant?: 'random' | 'shrek'
}

type AvatarResolution = NonNullable<AvatarProps['resolution']>

const SIZE_BY_RESOLUTION = {
  large: '200px',
  medium: '150px',
  small: '120px',
  xsmall: '100px',
} as const

const RADIUS_BY_RESOLUTION = {
  large: 'var(--radius-48)',
  medium: 'var(--radius-36)',
  small: 'var(--radius-36)',
  xsmall: 'var(--radius-28)',
} as const

const LABEL_BY_RESOLUTION = {
  large: 'large',
  medium: 'medium',
  small: 'small',
  xsmall: 'xsmall',
} as const

const resolutionFromViewport = (): AvatarResolution => {
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

const SWITCH_BACK_DELAY_MS = 600

const RANDOM_HOVER_POOL = [firstAva, shrekAva, smurfAva]

function Avatar({ className, resolution, hoverVariant = 'random' }: AvatarProps) {
  const [autoResolution, setAutoResolution] = useState(resolutionFromViewport)
  const [showHoverImage, setShowHoverImage] = useState(false)
  const [glowPosition, setGlowPosition] = useState<{ x: number; y: number } | null>(null)
  const [hoverImage, setHoverImage] = useState<string>(RANDOM_HOVER_POOL[0])
  const resetTimerRef = useRef<number | null>(null)

  const clearResetTimer = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current)
      resetTimerRef.current = null
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setAutoResolution(resolutionFromViewport())
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearResetTimer()
    }
  }, [])

  const activeResolution: AvatarResolution = resolution ?? autoResolution
  const size = SIZE_BY_RESOLUTION[activeResolution]
  const radius = RADIUS_BY_RESOLUTION[activeResolution]
  const label = LABEL_BY_RESOLUTION[activeResolution]
  const avatarClassName = className ? `avatar ${className}` : 'avatar'

  const handlePointerEnter = () => {
    clearResetTimer()
    const chosen =
      hoverVariant === 'shrek'
        ? shrekAva
        : RANDOM_HOVER_POOL[Math.floor(Math.random() * RANDOM_HOVER_POOL.length)]
    setHoverImage(chosen)
    setShowHoverImage(true)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setGlowPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  const handlePointerLeave = () => {
    setGlowPosition(null)
    clearResetTimer()
    resetTimerRef.current = window.setTimeout(() => {
      setShowHoverImage(false)
      resetTimerRef.current = null
    }, SWITCH_BACK_DELAY_MS)
  }

  const handlePointerDown = () => {
    clearResetTimer()
    setShowHoverImage(true)
    resetTimerRef.current = window.setTimeout(() => {
      setShowHoverImage(false)
      resetTimerRef.current = null
    }, SWITCH_BACK_DELAY_MS)
  }

  return (
    <Tilt
      rotationFactor={10}
      springOptions={{ stiffness: 300, damping: 20 }}
      style={{ borderRadius: radius }}
    >
      <button
        type="button"
        className={avatarClassName}
        data-name={`Avatar ${label}`}
        data-resolution={resolution}
        aria-label="Показать альтернативную аватарку"
        style={
          {
            '--avatar-size': size,
            '--avatar-radius': radius,
          } as CSSProperties
        }
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        <span
          className="avatar__glow"
          aria-hidden="true"
          style={
            {
              '--mx': glowPosition ? `${glowPosition.x}px` : '50%',
              '--my': glowPosition ? `${glowPosition.y}px` : '50%',
              opacity: glowPosition ? 1 : 0,
            } as CSSProperties
          }
        />
        <picture className={`avatar__picture avatar__picture--default${showHoverImage ? ' avatar__picture--hidden' : ''}`}>
          <img alt="" className="avatar__image" src={mainAva} />
        </picture>
        <picture className={`avatar__picture avatar__picture--hover${showHoverImage ? ' avatar__picture--visible' : ''}`}>
          <img alt="" className="avatar__image" src={hoverImage} />
        </picture>
      </button>
    </Tilt>
  )
}

export default Avatar
