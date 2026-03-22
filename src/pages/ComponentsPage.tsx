import PrimaryButtonMedium from '../components/PrimaryButtonMedium'
import PrimaryButtonLarge from '../components/PrimaryButtonLarge'
import SecondaryButtonMedium from '../components/SecondaryButtonMedium'
import SecondaryButtonDarkMedium from '../components/SecondaryButtonDarkMedium'
import EmailCopyButtonLarge from '../components/EmailCopyButtonLarge'
import AnchorLink from '../components/AnchorLink'
import Avatar from '../components/Avatar'
import CasePreviewCard from '../components/CasePreviewCard'
import SuperpowerCard from '../components/SuperpowerCard'
import IconCopy from '../components/icons/IconCopy'
import IconDownload from '../components/icons/IconDownload'
import IconSuccess from '../components/icons/IconSuccess'
import './ComponentsPage.css'

function ComponentsPage() {
  return (
    <main className="components-page">
      <section className="components-section">
        <div className="components-section__intro">
          <p className="components-section__eyebrow">Components</p>
          <h2 className="components-section__title">Avatar</h2>
          <p className="components-section__description">
            Аватарка по умолчанию показывает лицо. На компьютере меняется по hover, а на тач-экранах по нажатию
            переключается на альтернативную картинку и через 600 мс возвращается обратно.
          </p>
        </div>

        <Avatar />
      </section>

      <section className="components-section">
        <div className="components-section__intro">
          <p className="components-section__eyebrow">Components</p>
          <h2 className="components-section__title">Case Preview Card</h2>
          <p className="components-section__description">
            Карточка целиком кликабельна, картинка внутри при hover зумится на 105%, а размеры меняются по
            брейкпоинтам large, medium, small и xsmall.
          </p>
        </div>

        <CasePreviewCard />
      </section>

      <section className="components-section">
        <div className="components-section__intro">
          <p className="components-section__eyebrow">Components</p>
          <h2 className="components-section__title">Superpower Card</h2>
          <p className="components-section__description">
            Блок про сильные стороны: сверху картинка, ниже заголовок и текст. Размеры и скругления переключаются по
            тем же брейкпоинтам, что и у других адаптивных карточек.
          </p>
        </div>

        <SuperpowerCard />
      </section>

      <section className="components-section">
        <div className="components-section__intro">
          <p className="components-section__eyebrow">Components</p>
          <h2 className="components-section__title">Primary Button Medium</h2>
          <p className="components-section__description">
            Розовая кнопка среднего размера. На десктопе hover и pressed используют один активный вариант, а на
            touch-экранах этот же вариант включается только во время pressed.
          </p>
        </div>

        <div className="components-button-grid">
          <PrimaryButtonMedium text="Button" />
          <PrimaryButtonMedium text="Button" previewState="interactive" />
        </div>
      </section>

      <section className="components-section">
        <div className="components-section__intro">
          <p className="components-section__eyebrow">Components</p>
          <h2 className="components-section__title">Primary Button Large</h2>
          <p className="components-section__description">
            Розовая кнопка большого размера. Поведение такое же, как у medium: hover и pressed на десктопе, pressed
            на touch-экранах.
          </p>
        </div>

        <div className="components-button-grid components-button-grid--stacked">
          <PrimaryButtonLarge text="Button" />
          <PrimaryButtonLarge text="Button" previewState="interactive" />
        </div>
      </section>

      <section className="components-section">
        <div className="components-section__intro">
          <p className="components-section__eyebrow">Components</p>
          <h2 className="components-section__title">Secondary Button Medium</h2>
          <p className="components-section__description">
            Поведение такое же, как у primary: на десктопе hover и pressed используют один интерактивный вариант, а
            в pressed добавляется только визуальный scale. Иконка в компоненте передаётся снаружи и может быть любой.
          </p>
        </div>

        <div className="components-button-grid">
          <SecondaryButtonMedium text="Button" icon={<IconCopy className="components-icon" />} />
          <SecondaryButtonMedium
            text="Button"
            icon={<IconCopy className="components-icon" />}
            previewState="interactive"
          />
        </div>
      </section>

      <section className="components-section">
        <div className="components-section__intro">
          <p className="components-section__eyebrow">Components</p>
          <h2 className="components-section__title">Secondary Button Dark Medium</h2>
          <p className="components-section__description">
            Та же механика, что у secondary button, но для тёмной подложки. Для проверки я положил её на dark glass
            surface.
          </p>
        </div>

        <div className="components-section--dark">
          <div className="components-dark-grid">
            <SecondaryButtonDarkMedium text="Button" icon={<IconCopy className="components-icon" />} />
            <SecondaryButtonDarkMedium
              text="Button"
              icon={<IconCopy className="components-icon" />}
              previewState="interactive"
            />
          </div>
        </div>
      </section>

      <section className="components-section">
        <div className="components-section__intro">
          <p className="components-section__eyebrow">Components</p>
          <h2 className="components-section__title">Email Copy Button Large</h2>
          <p className="components-section__description">
            В default и hover это обычная secondary-кнопка. По нажатию копирует
            `pavlusenko.maksim@mail.ru` в буфер и показывает success-state с зелёной иконкой.
          </p>
        </div>

        <div className="components-email-grid">
          <EmailCopyButtonLarge />
        </div>
      </section>

      <section className="components-section">
        <div className="components-section__intro">
          <p className="components-section__eyebrow">Components</p>
          <h2 className="components-section__title">Anchor Link</h2>
          <p className="components-section__description">
            Десктопный якорный линк: в интерактивном состоянии меняет цвет на accent-primary и получает тот же
            pressed-scale, что и кнопка.
          </p>
        </div>

        <div className="components-anchor-grid">
          <AnchorLink href="#components" text="Anchor link" />
          <AnchorLink href="#components" text="Anchor link" previewState="interactive" />
        </div>
      </section>

      <section className="components-section">
        <div className="components-section__intro">
          <p className="components-section__eyebrow">Components</p>
          <h2 className="components-section__title">Icons</h2>
          <p className="components-section__description">
            Copy и download наследуют цвет текста родителя. Success всегда остаётся зелёной из семантической палитры.
          </p>
        </div>

        <div className="components-icons-grid">
          <div className="components-icon-card">
            <span className="components-icon-card__preview">
              <IconCopy className="components-icon" />
            </span>
            <span className="components-icon-card__label">IconCopy</span>
          </div>

          <div className="components-icon-card components-icon-card--accent">
            <span className="components-icon-card__preview">
              <IconDownload className="components-icon" />
            </span>
            <span className="components-icon-card__label">IconDownload</span>
          </div>

          <div className="components-icon-card components-icon-card--accent">
            <span className="components-icon-card__preview">
              <IconSuccess className="components-icon" />
            </span>
            <span className="components-icon-card__label">IconSuccess</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ComponentsPage
