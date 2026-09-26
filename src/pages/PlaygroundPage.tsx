import { useNavigate } from 'react-router-dom'
import TableOfContents from '../components/nav/TableOfContents'
import type { TableOfContentsItem } from '../components/nav/TableOfContents'
import CaseHead from '../components/case/CaseHead'
import CaseSubheadingText from '../components/case/CaseSubheadingText'
import CaseHeadingText from '../components/case/CaseHeadingText'
import CaseMediaContainer from '../components/case/CaseMediaContainer'
import SecondaryIconButtonMedium from '../components/buttons/SecondaryIconButtonMedium'
import LightboxIconButton from '../components/buttons/LightboxIconButton'
import MobileNavbar from '../components/nav/MobileNavbar'
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
  { id: 'lightbox-buttons', label: 'Lightbox buttons' },
  { id: 'section-5', label: 'Label' },
]

function PlaygroundPage() {
  const navigate = useNavigate()
  const goHome = () => {
    navigate('/')
  }

  return (
    <div className="playground-page">
      <div className="playground-page__nav">
        <SecondaryIconButtonMedium ariaLabel="Назад" onClick={goHome} />
      </div>

      <MobileNavbar back />

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
          <section className="playground-page__section" id="lightbox-buttons">
            <div
              className="playground-page__lightbox-demo"
              style={{
                display: 'flex',
                gap: 'var(--spacing-3x)',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: 'var(--spacing-6x)',
                borderRadius: 'var(--radius-24)',
              }}
            >
              <LightboxIconButton type="left" />
              <LightboxIconButton type="right" />
              <LightboxIconButton type="close" />
            </div>
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