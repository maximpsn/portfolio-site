import { useEffect } from 'react'
import PageTransition from './components/router/PageTransition'
import { initClickSound } from './lib/uiSound'
import { preloadImages } from './lib/preloadImages'

import caseCover from './assets/case-thumbnails/Case cover image.jpg?img'
import votveteIcon from './assets/avatars-projects/votvete-icon.webp?img'

// Тот же sizes, что у CaseMediaContainer на странице кейса.
const CASE_MEDIA_SIZES = '(max-width: 700px) 100vw, 700px'

function App() {
  useEffect(() => {
    // Скролл при переходах контролирует PageTransition: браузер не должен его восстанавливать.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    initClickSound()

    const timeoutId = window.setTimeout(() => {
      preloadImages([
        { source: caseCover, sizes: CASE_MEDIA_SIZES },
        { source: votveteIcon, sizes: CASE_MEDIA_SIZES },
      ])
    }, 2000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  return <PageTransition />
}

export default App