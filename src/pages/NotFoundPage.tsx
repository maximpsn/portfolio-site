import { useNavigate } from 'react-router-dom'
import PrimaryButtonMedium from '../components/buttons/PrimaryButtonMedium'
import SecondaryIconButtonMedium from '../components/buttons/SecondaryIconButtonMedium'
import './NotFoundPage.css'

function NotFoundPage() {
  const navigate = useNavigate()
  const showBack = typeof window !== 'undefined' && window.history.state !== null

  const goBack = () => {
    navigate(-1)
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
        <PrimaryButtonMedium text="На главную" href="/" />
      </div>
    </div>
  )
}

export default NotFoundPage