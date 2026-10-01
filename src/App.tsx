import { useEffect } from 'react'
import PageTransition from './components/router/PageTransition'
import { initClickSound } from './lib/uiSound'

function App() {
  useEffect(() => initClickSound(), [])

  return <PageTransition />
}

export default App