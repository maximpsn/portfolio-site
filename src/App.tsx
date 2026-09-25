import { useEffect } from 'react'
import PageTransition from './components/router/PageTransition'

function App() {
  useEffect(() => {
    if (document.querySelector('layero-badge')) {
      document.documentElement.classList.add('has-layero-footer')
    }
  }, [])

  return <PageTransition />
}

export default App