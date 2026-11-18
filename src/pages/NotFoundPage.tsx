import { useNavigate } from 'react-router-dom'
import PrimaryButtonMedium from '../components/buttons/PrimaryButtonMedium'
import SecondaryButtonMedium from '../components/buttons/SecondaryButtonMedium'
import IconDownload from '../components/icons/IconDownload'
import SecondaryIconButtonMedium from '../components/buttons/SecondaryIconButtonMedium'
import MobileNavbar from '../components/nav/MobileNavbar'
import { markInAppNavigation } from '../lib/navIntent'
import './NotFoundPage.css'

function NotFoundPage() {
  const navigate = useNavigate()
  const showBack = typeof window !== 'undefined' && window.history.state !== null

  const goBack = () => {
    markInAppNavigation()
    navigate(-1)
  }

  return (
    <div className="not-found-page">
      {showBack ? (
        <div className="not-found-page__nav">
          <SecondaryIconButtonMedium ariaLabel="Назад" onClick={goBack} />
        </div>
      ) : null}

      {/* Десктоп: контакты в правом верхнем углу, как на главной. Ниже 1300px их даёт нижний навбар. */}
      <div className="not-found-page__buttons">
        <SecondaryButtonMedium text="Резюме" icon={<IconDownload />} />
        <PrimaryButtonMedium href="https://t.me/velich00" text="Телеграм" target="_blank" rel="noreferrer" />
      </div>

      <MobileNavbar back={showBack} />

      <div className="not-found-page__block">
        <div className="not-found-page__texts">
          <h1 className="not-found-page__title">Страница не найдена</h1>
          <p className="not-found-page__text">
            Такой страницы нет — возможно, она переехала или была удалена.
          </p>
        </div>
        <PrimaryButtonMedium text="На главную" href="/" />
      </div>
    </div>
  )
}

export default NotFoundPage