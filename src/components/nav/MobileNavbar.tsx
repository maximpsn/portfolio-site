import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import LightboxIconButton from '../buttons/LightboxIconButton'
import PrimaryButtonMedium from '../buttons/PrimaryButtonMedium'
import SecondaryButtonDarkMedium from '../buttons/SecondaryButtonDarkMedium'
import IconDownload from '../icons/IconDownload'
import './MobileNavbar.css'

const BACK_PILL_TWEEN = { type: 'tween' as const, duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }

function MobileNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const showBack = !isHome

  const [isXsmall, setIsXsmall] = useState<boolean>(
    typeof window !== 'undefined' && window.innerWidth <= 399,
  )

  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsXsmall(window.innerWidth <= 399)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const sentinels = document.querySelectorAll('[data-bottom-sentinel]')

    if (sentinels.length === 0) {
      setHidden(false)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setHidden(entries.some((entry) => entry.intersectionRatio >= 0.5))
      },
      { threshold: [0, 0.5, 1] },
    )

    sentinels.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [location.pathname])

  return (
    <nav
      aria-label="Навигация и действия"
      className={hidden ? 'mobile-navbar mobile-navbar--hidden' : 'mobile-navbar'}
    >
      <div className="mobile-navbar__blurs" aria-hidden="true">
        <span className="mobile-navbar__blur mobile-navbar__blur--1" />
        <span className="mobile-navbar__blur mobile-navbar__blur--2" />
        <span className="mobile-navbar__blur mobile-navbar__blur--3" />
        <span className="mobile-navbar__blur mobile-navbar__blur--4" />
        <span className="mobile-navbar__blur mobile-navbar__blur--5" />
        <span className="mobile-navbar__blur mobile-navbar__blur--6" />
        <span className="mobile-navbar__gradient" />
      </div>

      <div className="mobile-navbar__inner">
        <AnimatePresence>
          {showBack ? (
            <motion.div
              key="back-pill"
              className="mobile-navbar__pill mobile-navbar__back-pill"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={BACK_PILL_TWEEN}
            >
              <LightboxIconButton type="left" onClick={() => navigate(-1)} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mobile-navbar__pill">
          <PrimaryButtonMedium
            href="https://t.me/velich00"
            text="Телеграм"
            target="_blank"
            rel="noreferrer"
          />
          <SecondaryButtonDarkMedium
            text="Резюме"
            icon={isXsmall ? undefined : <IconDownload />}
          />
        </div>
      </div>
    </nav>
  )
}

export default MobileNavbar