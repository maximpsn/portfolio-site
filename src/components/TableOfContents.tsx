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

function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')
  const rafRef = useRef<number | null>(null)

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

    pickActive()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
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