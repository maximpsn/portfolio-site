import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
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

  if (page === 'components') {
    return <ComponentsPage />
  }

  return <HomePage />
}

export default App
