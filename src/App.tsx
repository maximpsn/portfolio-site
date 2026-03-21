import { useState } from 'react'
import ComponentsPage from './pages/ComponentsPage'
import './App.css'

function App() {
  const [page, setPage] = useState<'home' | 'components'>('home')

  if (page === 'components') {
    return <ComponentsPage />
  }

  return (
    <>
      {/* Navigation for testing */}
      <nav style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
        <button onClick={() => setPage('home')} style={{ marginRight: '8px' }}>
          Home
        </button>
        <button onClick={() => setPage('components')}>
          Components
        </button>
      </nav>

      {/* Home Page (placeholder) */}
      <div style={{ padding: '40px' }}>
        <h1>Home Page</h1>
        <p>Главная страница портфолио (в разработке)</p>
      </div>
    </>
  )
}

export default App
