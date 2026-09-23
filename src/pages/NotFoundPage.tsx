import PrimaryButtonMedium from '../components/PrimaryButtonMedium'
import './NotFoundPage.css'

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1 className="not-found-page__title">Страница не найдена</h1>
      <p className="not-found-page__text">
        Такой страницы нет — возможно, она переехала или была удалена.
      </p>
      <PrimaryButtonMedium text="На главную" href="/" />
    </div>
  )
}

export default NotFoundPage