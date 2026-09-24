import PrimaryButtonMedium from '../components/PrimaryButtonMedium'
import SecondaryIconButtonMedium from '../components/SecondaryIconButtonMedium'
import { BASE } from '../config'
import './NotFoundPage.css'

function NotFoundPage() {
  const showBack = typeof window !== 'undefined' && window.history.state !== null

  const goBack = () => {
    window.history.back()
  }

  return (
    <div className="not-found-page">
      {showBack ? (
        <div className="not-found-page__nav">
          <SecondaryIconButtonMedium ariaLabel="Назад" onClick={goBack} />
        </div>
      ) : null}

      <div className="not-found-page__block">
        <h1 className="not-found-page__title">Страница не найдена</h1>
        <p className="not-found-page__text">
          Такой страницы нет — возможно, она переехала или была удалена.
        </p>
        <PrimaryButtonMedium text="На главную" href={BASE} />
      </div>
    </div>
  )
}

export default NotFoundPage