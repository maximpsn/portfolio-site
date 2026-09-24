import TableOfContents from '../components/TableOfContents'
import type { TableOfContentsItem } from '../components/TableOfContents'
import CaseHead from '../components/CaseHead'
import CaseSubheadingText from '../components/CaseSubheadingText'
import CaseHeadingText from '../components/CaseHeadingText'
import CaseMediaContainer from '../components/CaseMediaContainer'
import SecondaryIconButtonMedium from '../components/SecondaryIconButtonMedium'
import { BASE } from '../config'
import './PlaygroundPage.css'

import caseCover from '../assets/case-thumbnails/Case cover image.jpg'
import votveteIcon from '../assets/avatars-projects/votvete-icon.webp'

const SLIDES = [
  { src: caseCover },
  { src: votveteIcon },
]

const SECTIONS: TableOfContentsItem[] = [
  { id: 'case-head', label: 'Case head' },
  { id: 'case-subheading', label: 'Subheading text' },
  { id: 'case-heading', label: 'Heading text' },
  { id: 'case-media', label: 'Media container' },
  { id: 'icon-button', label: 'Icon button (back)' },
  { id: 'section-5', label: 'Label' },
]

function PlaygroundPage() {
  const goHome = () => {
    const path = BASE === '/' ? '/' : BASE
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="playground-page">
      <div className="playground-page__nav">
        <SecondaryIconButtonMedium ariaLabel="Назад" onClick={goHome} />
      </div>

      <TableOfContents items={SECTIONS} />

      <div className="playground-page__content">
        <div className="playground-page__block">
          <section className="playground-page__section" id="case-head">
            <CaseHead
              title="ВотВете"
              description="«Самокат» — это российский сервис экспресс-доставки, который через мобильное приложение за считанные минуты доставляет широкий ассортимент товаров, включая продукты питания, товары повседневного спроса, одежду, электронику и многое другое."
              coverSrc={SLIDES[0].src}
              slides={SLIDES}
              links={[
                { label: 'App Store', href: '#' },
                { label: 'Google Play', href: '#' },
              ]}
            />
          </section>
        </div>

        <div className="playground-page__block">
          <section className="playground-page__section" id="case-subheading">
            <CaseSubheadingText
              subheading="Subheading"
              paragraph="Paragraph description"
            />
          </section>
        </div>

        <div className="playground-page__block">
          <section className="playground-page__section" id="case-heading">
            <CaseHeadingText
              subheading="Subheading"
              paragraph="Paragraph description"
            />
          </section>
        </div>

        <div className="playground-page__block">
          <section className="playground-page__section" id="case-media">
            <CaseMediaContainer src={SLIDES[1].src} slides={SLIDES} index={1} />
          </section>
        </div>

        <div className="playground-page__block">
<section className="playground-page__section" id="icon-button">
                <SecondaryIconButtonMedium ariaLabel="Назад" />
              </section>
        </div>

        <div className="playground-page__block">
          <section className="playground-page__section" id="section-5">
            <h2 className="playground-page__section-title">Label</h2>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PlaygroundPage