import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LightboxIconButton from '../buttons/LightboxIconButton'
import PrimaryButtonMedium from '../buttons/PrimaryButtonMedium'
import SecondaryButtonDarkMedium from '../buttons/SecondaryButtonDarkMedium'
import IconDownload from '../icons/IconDownload'
import './MobileNavbar.css'

type MobileNavbarProps = {
  back?: boolean
}

function MobileNavbar({ back = false }: MobileNavbarProps) {
  const navigate = useNavigate()
  const [isXsmall, setIsXsmall] = useState<boolean>(
    typeof window !== 'undefined' && window.innerWidth <= 399,
  )

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

  return (
    <nav className="mobile-navbar" aria-label="Навигация и действия">
      <div className="mobile-navbar__inner">
        {back ? (
          <div className="mobile-navbar__pill">
            <LightboxIconButton type="left" onClick={() => navigate(-1)} />
          </div>
        ) : null}

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