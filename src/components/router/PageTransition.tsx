import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, type Transition } from 'framer-motion'
import { useLocation, type Location } from 'react-router-dom'
import AppRouter from './AppRouter'
import './PageTransition.css'

const TWEEN: Transition = { type: 'tween', duration: 0.45, ease: [0.42, 0, 0.58, 1] }

function scrollToTopInstant() {
  const html = document.documentElement
  const previous = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  html.style.scrollBehavior = previous
}

function collectFixedElements(root: HTMLElement): HTMLElement[] {
  const result: HTMLElement[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT)
  let node: Node | null = walker.nextNode()

  while (node !== null) {
    const element = node as HTMLElement
    if (getComputedStyle(element).position === 'fixed') {
      result.push(element)
    }
    node = walker.nextNode()
  }

  return result
}

function PageTransition() {
  const location = useLocation()
  const [displayedLoc, setDisplayedLoc] = useState<Location>(location)
  const [leaving, setLeaving] = useState(false)
  const [leaveY, setLeaveY] = useState(0)
  const leaveRef = useRef<HTMLDivElement | null>(null)
  const fixedRef = useRef<HTMLDivElement | null>(null)
  const busyRef = useRef(false)

  useEffect(() => {
    if (location.key === displayedLoc.key || busyRef.current) {
      return
    }

    if (location.pathname === displayedLoc.pathname) {
      const rafId = window.requestAnimationFrame(() => {
        setDisplayedLoc(location)
      })

      return () => {
        window.cancelAnimationFrame(rafId)
      }
    }

    busyRef.current = true

    const rafId = window.requestAnimationFrame(() => {
      setLeaveY(window.scrollY)
      setLeaving(true)
    })

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [location, displayedLoc.key, displayedLoc.pathname])

  const finishTransition = () => {
    if (fixedRef.current) {
      fixedRef.current.replaceChildren()
    }
    scrollToTopInstant()
    setLeaving(false)
    setDisplayedLoc(location)
    busyRef.current = false

    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event('page-transition-end'))
    })
  }

  useEffect(() => {
    document.documentElement.classList.toggle('is-page-transitioning', leaving)
  }, [leaving])

  useLayoutEffect(() => {
    const leaveEl = leaveRef.current
    const fixedEl = fixedRef.current

    if (!leaving || !leaveEl || !fixedEl) {
      return
    }

    const fixedElements = collectFixedElements(leaveEl)

    fixedElements.forEach((element) => {
      element.style.visibility = 'hidden'

      const clone = element.cloneNode(true) as HTMLElement
      clone.style.visibility = 'visible'
      fixedEl.appendChild(clone)
    })
  }, [leaving])

  if (leaving) {
    return (
      <div className="app-root__transition">
        <motion.div
          ref={leaveRef}
          className="transition-leave"
          initial={{ y: -leaveY, scale: 1, opacity: 1 }}
          animate={{ y: -leaveY, scale: 0.9, opacity: 0 }}
          style={{ transformOrigin: `50% calc(50% + ${leaveY}px)` }}
          transition={{ scale: TWEEN, y: TWEEN, opacity: TWEEN }}
        >
          <AppRouter location={displayedLoc} />
        </motion.div>

        <motion.div
          ref={fixedRef}
          className="transition-fixed"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 0.9, opacity: 0 }}
          style={{ transformOrigin: '50% 50%' }}
          transition={{ scale: TWEEN, opacity: TWEEN }}
        />

        <motion.div
          className="transition-enter"
          initial={{ y: '100vh' }}
          animate={{ y: 0 }}
          style={{ transformOrigin: '50% 50%' }}
          transition={{ y: TWEEN }}
          onAnimationComplete={finishTransition}
        >
          <div className="app-root__page">
            <AppRouter location={location} />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="app-root">
      <div className="app-root__page">
        <AppRouter location={displayedLoc} />
      </div>
    </div>
  )
}

export default PageTransition