import { useEffect, useRef, useState } from 'react'
import './TableOfContents.css'

type TableOfContentsItem = {
  id: string
  label: string
}

type TableOfContentsProps = {
  items: TableOfContentsItem[]
}

const FOCUS_LINE_RATIO = 0.4

// Активная секция живёт вне компонента: когда страница покидает и
// TOC пересоздаётся для фейдаута, он стартует с последней секции, а не с 1.
let savedActiveId: string | undefined

function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(savedActiveId ?? items[0]?.id ?? '')
  const rafRef = useRef<number | null>(null)
  const syncTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const pickActive = () => {
      const focusLine = window.innerHeight * FOCUS_LINE_RATIO
      let current = items[0]?.id ?? ''

      for (const item of items) {
        const element = document.getElementById(item.id)

        if (!element) {
          break
        }

        if (element.getBoundingClientRect().top <= focusLine) {
          current = item.id
        } else {
          break
        }
      }

      savedActiveId = current
      setActiveId(current)
    }

    const handleScroll = () => {
      if (rafRef.current !== null) {
        return
      }

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null
        pickActive()
      })
    }

    const handleTransitionEnd = () => {
      window.requestAnimationFrame(() => {
        pickActive()
      })

      if (syncTimeoutRef.current !== null) {
        window.clearTimeout(syncTimeoutRef.current)
      }

      syncTimeoutRef.current = window.setTimeout(() => {
        pickActive()
      }, 300)
    }

    // Синхронизируем после монтирования (async, чтобы не менять state синхронно в эффекте).
    const rafId = window.requestAnimationFrame(() => {
      pickActive()
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    window.addEventListener('page-transition-end', handleTransitionEnd)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.removeEventListener('page-transition-end', handleTransitionEnd)

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
      if (syncTimeoutRef.current !== null) {
        window.clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [items])

  const handleClick = (id: string) => {
    setActiveId(id)

    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="table-of-contents" aria-label="Оглавление">
      <ul className="table-of-contents__list">
        {items.map((item) => {
          const isActive = item.id === activeId

          return (
            <li key={item.id} className="table-of-contents__group">
              <button
                type="button"
                className={`table-of-contents__button${isActive ? ' table-of-contents__button--active' : ''}`}
                onClick={() => handleClick(item.id)}
              >
                <span
                  className={`table-of-contents__line${isActive ? ' table-of-contents__line--active' : ''}`}
                  aria-hidden="true"
                />
                <span className="table-of-contents__label">{item.label}</span>
              </button>
              {item !== items[items.length - 1] ? (
                <span className="table-of-contents__deco" aria-hidden="true" />
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export type { TableOfContentsItem }
export default TableOfContents