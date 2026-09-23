import PrimaryButtonMedium from '../components/PrimaryButtonMedium'
import { BASE } from '../config'

type CasePlaceholderPageProps = {
  title: string
  slug: string
}

function CasePlaceholderPage({ title, slug }: CasePlaceholderPageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        background: '#ffffff',
        color: '#111111',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <PrimaryButtonMedium text="← На главную" href={BASE} />
      <h1 style={{ margin: 0, fontSize: '40px', fontWeight: 600 }}>{title}</h1>
      <p style={{ margin: 0, fontSize: '18px', color: '#666666' }}>
        Страница кейса «{slug}» — в разработке
      </p>
    </div>
  )
}

export default CasePlaceholderPage