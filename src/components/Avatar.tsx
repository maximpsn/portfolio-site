import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Tilt } from '../../components/motion-primitives/tilt'
import { Spotlight } from '../../components/motion-primitives/spotlight'
import './Avatar.css'

import defaultAvatarWebp from '../assets/avatar/webp-avatar-default.webp'
import defaultAvatarJpeg from '../assets/avatar/jpeg-avatar-default.jpeg'
import shrekAvatarWebp from '../assets/avatar/webp-avatar-shrek.webp'
import shrekAvatarJpeg from '../assets/avatar/jpeg-avatar-shrek.jpeg'

type AvatarProps = {
  className?: string
  resolution?: 'large' | 'medium' | 'small' | 'xsmall'
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

function Avatar({ className, resolution }: AvatarProps) {
  const [autoResolution, setAutoResolution] = useState(resolutionFromViewport)
  const [showHoverImage, setShowHoverImage] = useState(false)
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
    setShowHoverImage(true)
  }

  const handlePointerLeave = () => {
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
      springOptions={{ stiffness: 150, damping: 20 }}
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
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        <Spotlight
          className="z-10 rounded-[inherit] from-white/50 via-white/30 to-transparent"
          size={180}
          springOptions={{ bounce: 0 }}
        />
        <picture className={`avatar__picture avatar__picture--default${showHoverImage ? ' avatar__picture--hidden' : ''}`}>
          <source srcSet={defaultAvatarWebp} type="image/webp" />
          <source srcSet={defaultAvatarJpeg} type="image/jpeg" />
          <img alt="" className="avatar__image" src={defaultAvatarJpeg} />
        </picture>
        <picture className={`avatar__picture avatar__picture--hover${showHoverImage ? ' avatar__picture--visible' : ''}`}>
          <source srcSet={shrekAvatarWebp} type="image/webp" />
          <source srcSet={shrekAvatarJpeg} type="image/jpeg" />
          <img alt="" className="avatar__image" src={shrekAvatarJpeg} />
        </picture>
      </button>
    </Tilt>
  )
}

export default Avatar
