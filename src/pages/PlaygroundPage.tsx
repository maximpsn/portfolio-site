import { useState } from 'react'
import TableOfContents from '../components/TableOfContents'
import type { TableOfContentsItem } from '../components/TableOfContents'
import CaseHead from '../components/CaseHead'
import './PlaygroundPage.css'

const SECTIONS: TableOfContentsItem[] = [
  { id: 'case-head', label: 'Case head' },
  { id: 'section-2', label: 'Label' },
  { id: 'section-3', label: 'Label' },
]

function PlaygroundPage() {
  const [activeSection, setActiveSection] = useState('case-head')

  return (
    <div className="playground-page">
      <TableOfContents
        items={SECTIONS}
        activeId={activeSection}
        onItemClick={(id) => setActiveSection(id)}
      />

      <div className="playground-page__content">
        <div className="playground-page__block">
          <section className="playground-page__section" id="case-head">
            <CaseHead
              title="ВотВете"
              description="«Самокат» — это российский сервис экспресс-доставки, который через мобильное приложение за считанные минуты доставляет широкий ассортимент товаров, включая продукты питания, товары повседневного спроса, одежду, электронику и многое другое."
              avatarSrc="/image-placeholder.svg"
              coverSrc="/image-placeholder.svg"
              links={[
                { label: 'App Store', href: '#' },
                { label: 'Google Play', href: '#' },
              ]}
            />
          </section>
        </div>

        <div className="playground-page__block">
          <section className="playground-page__section" id="section-2">
            <h2 className="playground-page__section-title">Label</h2>
          </section>
        </div>

        <div className="playground-page__block">
          <section className="playground-page__section" id="section-3">
            <h2 className="playground-page__section-title">Label</h2>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PlaygroundPage