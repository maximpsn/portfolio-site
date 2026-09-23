import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
import CasePlaceholderPage from './pages/CasePlaceholderPage'
import NotFoundPage from './pages/NotFoundPage'
import PlaygroundPage from './pages/PlaygroundPage'
import './App.css'

type Route =
  | { name: 'home' }
  | { name: 'case'; slug: string }
  | { name: 'playground' }
  | { name: 'notfound' }

const CASE_TITLES: Record<string, string> = {
  afrasuez: 'Afrasuez',
  'regro-vahta': 'Регро Вахта',
  votvete: 'ВотВете',
}

function getRouteFromPath(): Route {
  const { pathname } = window.location

  if (pathname === '/' || pathname === '') {
    return { name: 'home' }
  }

  if (pathname === '/playground') {
    return { name: 'playground' }
  }

  const match = pathname.match(/^\/cases\/([^/]+)\/?$/)

  if (match && CASE_TITLES[match[1]]) {
    return { name: 'case', slug: match[1] }
  }

  return { name: 'notfound' }
}

function App() {
  const [route, setRoute] = useState<Route>(getRouteFromPath)

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRouteFromPath())
    }

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a')

      if (!anchor) {
        return
      }

      const href = anchor.getAttribute('href')

      if (!href || href.startsWith('#') || href.startsWith('http')) {
        return
      }

      const url = new URL(anchor.href)

      if (url.origin !== window.location.origin) {
        return
      }

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      event.preventDefault()
      window.history.pushState({}, '', url.pathname + url.search)
      setRoute(getRouteFromPath())
      window.scrollTo(0, 0)
    }

    window.addEventListener('popstate', handlePopState)
    document.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  if (route.name === 'playground') {
    return <PlaygroundPage />
  }

  if (route.name === 'case') {
    return <CasePlaceholderPage title={CASE_TITLES[route.slug]} slug={route.slug} />
  }

  if (route.name === 'notfound') {
    return <NotFoundPage />
  }

  return <HomePage />
}

export default App