import { useEffect, useState } from 'react'
import ComponentsPage from './pages/ComponentsPage'
import './App.css'

type Page = 'home' | 'components'

function getPageFromHash(): Page {
  return window.location.hash === '#components' ? 'components' : 'home'
}

function App() {
  const [page, setPage] = useState<Page>(getPageFromHash)

  useEffect(() => {
    const handleHashChange = () => {
      setPage(getPageFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handlePageChange = (nextPage: Page) => {
    window.location.hash = nextPage === 'components' ? 'components' : ''
    setPage(nextPage)
  }

  if (page === 'components') {
    return <ComponentsPage />
  }

  return (
    <>
      <nav style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
        <button onClick={() => handlePageChange('home')} style={{ marginRight: '8px' }}>
          Home
        </button>
        <button onClick={() => handlePageChange('components')}>Components</button>
      </nav>

      <div style={{ padding: '40px' }}>
        <h1>Home Page</h1>
        <p>Главная страница портфолио (в разработке)</p>
      </div>
    </>
  )
}

export default App
