import './TableOfContents.css'

type TableOfContentsItem = {
  id: string
  label: string
}

type TableOfContentsProps = {
  items: TableOfContentsItem[]
  activeId: string
  onItemClick: (id: string) => void
}

function TableOfContents({ items, activeId, onItemClick }: TableOfContentsProps) {
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
                onClick={() => onItemClick(item.id)}
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