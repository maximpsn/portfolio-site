import { useEffect } from 'react'
import PageTransition from './components/router/PageTransition'
import { initClickSound } from './lib/uiSound'
import { preloadImages } from './lib/preloadImages'

import caseCover from './assets/case-thumbnails/Case cover image.jpg'
import votveteIcon from './assets/avatars-projects/votvete-icon.webp'

function App() {
  useEffect(() => {
    // Скролл при переходах контролирует PageTransition: браузер не должен его восстанавливать.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    initClickSound()

    const timeoutId = window.setTimeout(() => {
      preloadImages([caseCover, votveteIcon])
    }, 2000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  return <PageTransition />
}

export default App