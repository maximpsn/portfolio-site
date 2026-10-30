import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Tilt } from '../../../components/motion-primitives/tilt'
import './Avatar.css'

import mainAva from '../../assets/avatar/main-ava.jpeg'

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

function Avatar({ className, resolution }: AvatarProps) {
  const [autoResolution, setAutoResolution] = useState(resolutionFromViewport)
  const [glowPosition, setGlowPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setAutoResolution(resolutionFromViewport())
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const activeResolution: AvatarResolution = resolution ?? autoResolution
  const size = SIZE_BY_RESOLUTION[activeResolution]
  const radius = RADIUS_BY_RESOLUTION[activeResolution]
  const label = LABEL_BY_RESOLUTION[activeResolution]
  const avatarClassName = className ? `avatar ${className}` : 'avatar'

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setGlowPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  const handlePointerLeave = () => {
    setGlowPosition(null)
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
        aria-label="Аватар"
        style={
          {
            '--avatar-size': size,
            '--avatar-radius': radius,
          } as CSSProperties
        }
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
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
        <picture className="avatar__picture">
          <img alt="" className="avatar__image" src={mainAva} />
        </picture>
      </button>
    </Tilt>
  )
}

export default Avatar