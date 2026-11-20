import { Link } from 'react-router-dom'
import PrimaryButtonMedium from '../components/buttons/PrimaryButtonMedium'
import SecondaryButtonMedium from '../components/buttons/SecondaryButtonMedium'
import IconDownload from '../components/icons/IconDownload'
import MobileNavbar from '../components/nav/MobileNavbar'
import Image from '../components/ui/Image'
import './NotFoundPage.css'

import sideAvatar from '../assets/avatar/avatar-side_optimized.jpeg?img-small'
import shrekImage from '../assets/not-found/shrek-404.png?img'

function NotFoundPage() {
  const showBack = typeof window !== 'undefined' && window.history.state !== null

  return (
    <div className="not-found-page">
      {/* Десктоп: аватар слева и контакты справа, как на главной. Ниже 1300px их даёт нижний навбар. */}
      <Link className="not-found-page__avatar" to="/" aria-label="На главную">
        <Image
          source={sideAvatar}
          sizes="48px"
          priority
          shimmer={false}
          className="not-found-page__avatar-picture"
          imgClassName="not-found-page__avatar-image"
        />
      </Link>

      <div className="not-found-page__buttons">
        <SecondaryButtonMedium text="Резюме" icon={<IconDownload />} />
        <PrimaryButtonMedium href="https://t.me/velich00" text="Телеграм" target="_blank" rel="noreferrer" />
      </div>

      <MobileNavbar back={showBack} />

      <main className="not-found-page__block">
        <div className="not-found-page__content">
          <div className="not-found-page__hero" aria-hidden="true">
            <p className="not-found-page__code">404</p>
            <Image
              source={shrekImage}
              sizes="260px"
              priority
              shimmer={false}
              className="not-found-page__image-picture"
              imgClassName="not-found-page__image"
            />
          </div>

          <div className="not-found-page__texts">
            <h1 className="not-found-page__title">Страница не найдена</h1>
            <PrimaryButtonMedium text="На главную" href="/" />
          </div>
        </div>
      </main>
    </div>
  )
}

export default NotFoundPage
