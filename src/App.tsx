import { useEffect, useRef, useState } from 'react'
import { motion, type Transition } from 'framer-motion'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PlaygroundPage from './pages/PlaygroundPage'
import { BASE } from './config'
import './App.css'

type Route =
  | { name: 'home' }
  | { name: 'playground' }
  | { name: 'notfound' }

const TWEEN: Transition = { type: 'tween', duration: 0.6, ease: [0.16, 1, 0.3, 1] }

function normalizePath(pathname: string): string {
  if (BASE === '/') {
    return pathname
  }

  if (pathname.startsWith(BASE)) {
    return pathname.slice(BASE.length - 1)
  }

  return pathname
}

function getRouteFromPath(): Route {
  const path = normalizePath(window.location.pathname)

  if (path === '/' || path === '') {
    return { name: 'home' }
  }

  if (path === '/playground' || path === '/cases/afrasuez') {
    return { name: 'playground' }
  }

  return { name: 'notfound' }
}

function renderPage(route: Route) {
  if (route.name === 'playground') {
    return <PlaygroundPage />
  }

  if (route.name === 'notfound') {
    return <NotFoundPage />
  }

  return <HomePage />
}

function scrollToTopInstant() {
  const html = document.documentElement
  const previous = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  html.style.scrollBehavior = previous
}

function App() {
  const [route, setRoute] = useState<Route>(getRouteFromPath)
  const [leaving, setLeaving] = useState<Route | null>(null)
  const [leaveY, setLeaveY] = useState(0)
  const routeRef = useRef(route)
  const busyRef = useRef(false)

  useEffect(() => {
    routeRef.current = route
  }, [route])

  const startTransition = (commit: () => void) => {
    if (busyRef.current) {
      return
    }

    busyRef.current = true
    setLeaveY(window.scrollY)
    setLeaving(routeRef.current)
    commit()
  }

  useEffect(() => {
    const handlePopState = () => {
      startTransition(() => {
        setRoute(getRouteFromPath())
      })
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
      const nextPath = url.pathname.startsWith(BASE) ? url.pathname + url.search : BASE.replace(/\/$/, '') + url.pathname + url.search

      startTransition(() => {
        window.history.pushState({}, '', nextPath)
        setRoute(getRouteFromPath())
      })
    }

    window.addEventListener('popstate', handlePopState)
    document.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  if (leaving) {
    return (
      <div className="app-root__transition">
        <motion.div
          className="transition-leave"
          initial={{ y: -leaveY, scale: 1, opacity: 1 }}
          animate={{ y: -leaveY, scale: 0.9, opacity: 0 }}
          style={{ transformOrigin: '50% 50%' }}
          transition={{ scale: TWEEN, opacity: TWEEN }}
        >
          {renderPage(leaving)}
        </motion.div>

        <motion.div
          className="transition-enter"
          initial={{ y: '100vh' }}
          animate={{ y: 0 }}
          style={{ transformOrigin: '50% 50%' }}
          transition={{ y: TWEEN }}
          onAnimationComplete={() => {
            scrollToTopInstant()
            setLeaving(null)
            busyRef.current = false
          }}
        >
          <div className="app-root__page">{renderPage(route)}</div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="app-root">
      <div className="app-root__page">{renderPage(route)}</div>
    </div>
  )
}

export default App