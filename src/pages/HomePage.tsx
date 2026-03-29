import { useEffect, useRef, useState } from 'react'
import AnchorLink from '../components/AnchorLink'
import Avatar from '../components/Avatar'
import PrimaryButtonLarge from '../components/PrimaryButtonLarge'
import PrimaryButtonMedium from '../components/PrimaryButtonMedium'
import SecondaryButtonMedium from '../components/SecondaryButtonMedium'
import SecondaryButtonDarkMedium from '../components/SecondaryButtonDarkMedium'
import EmailCopyButtonLarge from '../components/EmailCopyButtonLarge'
import SuperpowerCard from '../components/SuperpowerCard'
import CasePreviewCard from '../components/CasePreviewCard'
import CompanyCard from '../components/CompanyCard'
import IconDownload from '../components/icons/IconDownload'

import defaultAvatarWebp from '../assets/avatar/webp-avatar-default.webp'
import defaultAvatarJpeg from '../assets/avatar/jpeg-avatar-default.jpeg'
import elseCompanyAvatar from '../assets/avatars-companies/else-icon.webp'
import smartbookingCompanyAvatar from '../assets/avatars-companies/smartbooking-icon.webp'
import afrasuezProjectAvatar from '../assets/avatars-projects/afrasuez-icon.webp'
import regroVahtaProjectAvatar from '../assets/avatars-projects/regro-vahta-icon.webp'
import votveteProjectAvatar from '../assets/avatars-projects/votvete-icon.webp'
import caseThumbnailImage from '../assets/case-thumbnails/Case cover image.jpg'

import './HomePage.css'

const firstCompanyResponsibilities = [
  'Работал в командах из 5–7 человек: бизнес-аналитик, PM, frontend, mobile и backend-разработчики, QA.',
  'Анализировал конкурентов, прорабатывал пользовательские сценарии и дизайн-концепции, создавал интерфейсы и передавал макеты в разработку. Проводил дизайн-ревью реализованных интерфейсов.',
  'Презентовал дизайн-решения клиентам, защищал концепции и работал с фидбеком.',
  'Участвовал в планировании и оценке дизайн-задач на спринт совместно с менеджером и клиентом.',
  'На двух проектах выполнял роль старшего дизайнера: ревью работы дизайнеров, помощь в проработке концепций и пользовательских сценариев, участие во встречах с клиентом.',
  'На отдельных проектах привлекал 3D/motion-дизайнеров: готовил ТЗ, давал фидбек по промежуточным результатам и доводил решения до финального состояния перед интеграцией в проект.',
]

const firstCompanyAchievements = [
  'Запустили продукты с нуля до релиза. Моя роль: проработка пользовательских сценариев, дизайн-концепций, отрисовка макетов и передача их в разработку.',
  'Участвовал в пресейлах с клиентами: подготовка дизайн-концепций, презентации решений и обсуждения проектов. 4 клиента (конверсия ~40%).',
  'Помогал с наймом дизайнеров: оценка резюме и портфолио, ревью тестовых заданий, подготовка фидбека и участие в принятии решений. Наняли 3 дизайнеров, которые успешно работают на проектных командах.',
]

const secondCompanyResponsibilities = [
  'Работал в команде с менеджером и маркетологом. Передавал макеты сайтов и веб-платформ разработчикам.',
  'Дизайн-поддержка основного сайта и личного кабинета отельера: правки, новые разделы, визуальная консистентность.',
  'Отрисовка посадочных страниц под рекламные кампании.',
  'Маркетинговые материалы: презентации, КП, баннеры и креативы для Яндекс Директ, Facebook и Google Ads.',
  'Собрал визуальный стиль Instagram-профиля компании. Стиль используют до сих пор.',
]

const skills = [
  'Совместная работа с дизайн-командой и разработчиками',
  'Работа с дизайн-системой',
  'Создание нескольких вариаций дизайна с описанием их функциональности и преимуществ для выбора оптимального решения',
  'Презентация своих решений',
  'Участие в улучшении пользовательского опыта и оптимизации процессов взаимодействия с сервисами',
  'Участие в разработке MVP с дальнейшей проработкой недостающих фич',
  'Передача дизайна в разработку с подробными комментариями для разработчиков',
  'Проведение дизайн-ревью',
  'Рефакторинг разделов CMS',
]

function HomePage() {
  const skillsSectionRef = useRef<HTMLElement | null>(null)
  const [isBottomBarHidden, setIsBottomBarHidden] = useState(false)

  useEffect(() => {
    const skillsSection = skillsSectionRef.current

    if (!skillsSection) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsBottomBarHidden(entry.intersectionRatio >= 0.5)
      },
      {
        threshold: [0, 0.5, 1],
      },
    )

    observer.observe(skillsSection)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <main className={isBottomBarHidden ? 'home-page home-page--bottom-bar-hidden' : 'home-page'}>
      <aside className="home-page__anchors" aria-label="Навигация">
        <div className="home-page__avatar-wrap">
          <picture className="home-page__avatar-picture">
            <source srcSet={defaultAvatarWebp} type="image/webp" />
            <source srcSet={defaultAvatarJpeg} type="image/jpeg" />
            <img alt="" className="home-page__avatar-image" src={defaultAvatarJpeg} />
          </picture>
        </div>

        <div className="home-page__links">
          <AnchorLink href="#about" text="Обо мне" />
          <AnchorLink href="#projects" text="Проекты" />
          <AnchorLink href="#experience" text="Опыт работы" />
          <AnchorLink href="#skills" text="Навыки" />
          <AnchorLink href="#contact" text="Связаться" />
        </div>
      </aside>

      <div className="home-page__buttons">
        <SecondaryButtonMedium text="Резюме" icon={<IconDownload />} />
        <PrimaryButtonMedium href="https://t.me/velich00" text="Телеграм" target="_blank" rel="noreferrer" />
      </div>

      <div className="home-page__content">
        <section className="home-page__block home-page__block--about" id="about">
          <div className="home-page__section">
            <Avatar className="home-page__hero-avatar" />

            <div className="home-page__hero-copy">
              <h1 className="home-page__hero-name">Максим Павлусенко, Продуктовый дизайнер</h1>
              <p className="home-page__hero-text">
                В одном волшебном королевстве проживал могучий зелёный исполин по имени Шрэк, который ценил уединение в своём болотистом уголке лесной чащи. С этого момента начинаются приключения огромного огра.
              </p>
            </div>
          </div>

          <SuperpowerCard
            heading="Сильные стороны: визуал и системность"
            text="Windscribe doesn&apos;t offer a traditional free trial, but we do offer a completely free plan with up to 10GB of data per month (no credit card required). If you need more, you can upgrade to Windscribe Pro for as little as $3 USD per month. If you aren&apos;t ready to upgrade, you can always get more data by referring a friend or posting about us on X."
          />
        </section>

        <section className="home-page__block" id="projects">
          <div className="home-page__section home-page__section--stack">
            <CasePreviewCard
              iconSrc={afrasuezProjectAvatar}
              coverSrc={caseThumbnailImage}
              projectName="Afrasuez"
              heading="Веб-платформа для нефтяных трейдеров. Поиск инфраструктуры и специалистов, объявления о купле и продаже"
            />
            <CasePreviewCard
              iconSrc={regroVahtaProjectAvatar}
              projectName="Регро Вахта"
              heading="Приложение для вахтовиков. Устраивайся на работу, оформляй документы, получай билеты — всё в одном месте"
            />
            <CasePreviewCard
              iconSrc={votveteProjectAvatar}
              projectName="ВотВете"
              heading="Приложение для клиентов ветклиники. Записывай питомца к врачу, смотри результаты анализов, пополняй баланс для стационара"
            />
          </div>
        </section>

        <section className="home-page__block" id="experience">
          <div className="home-page__section home-page__section--stack">
            <CompanyCard
              avatarSrc={elseCompanyAvatar}
              companyName="Else Digital: UI/UX дизайнер"
              period={"Июль 2024 — сейчас (1 год и 9 месяцев)"}
              aboutCompany="IT-агентство c командой 35 человек. Разрабатываем веб-сервисы и мобильные приложения. Делали проекты в сфере медицины, промышленности, e-commerce, инвестиций, HoReCa, HR, образования, строительства, недвижимости."
              responsibilities={firstCompanyResponsibilities}
              achievements={firstCompanyAchievements}
            />
            <CompanyCard
              avatarSrc={smartbookingCompanyAvatar}
              companyName="Smartbooking: Веб, Коммуникационный дизайнер"
              period={"Август 2022 — Сентябрь 2023 (1 год и 2 месяца)"}
              aboutCompany="PMS-платформа для управления гостиницами: автоматизация бронирований, интеграция с 70+ OTA-каналами (Booking, Airbnb, Expedia и т. д.), аналитика, мобильное приложение и конструктор сайта отеля с прямым бронированием."
              responsibilities={secondCompanyResponsibilities}
              achievements={[]}
            />
          </div>
        </section>

        <section ref={skillsSectionRef} className="home-page__block" id="skills">
          <div className="home-page__section home-page__section--skills">
            <p className="home-page__section-title home-page__section-title--md">Навыки</p>
            <ul className="home-page__list">
              {skills.map((item) => (
                <li key={item} className="home-page__list-item">
                  <span className="home-page__list-dash" aria-hidden="true">
                    –
                  </span>
                  <span className="home-page__list-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="home-page__section" id="contact">
            <p className="home-page__section-title home-page__section-title--md">Связаться</p>
            <div className="home-page__contact-row">
              <div className="home-page__contact-action">
                <PrimaryButtonLarge
                  href="https://t.me/velich00"
                  text="Написать в телеграм"
                  target="_blank"
                  rel="noreferrer"
                />
              </div>
              <div className="home-page__contact-email">
                <EmailCopyButtonLarge text="pavlusenko.maksim@mail.ru" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="home-page__bottom-bar" aria-label="Навигация и действия">
        <div className="home-page__bottom-bar-blurs" aria-hidden="true">
          <span className="home-page__bottom-bar-blur home-page__bottom-bar-blur--1" />
          <span className="home-page__bottom-bar-blur home-page__bottom-bar-blur--2" />
          <span className="home-page__bottom-bar-blur home-page__bottom-bar-blur--3" />
          <span className="home-page__bottom-bar-blur home-page__bottom-bar-blur--4" />
          <span className="home-page__bottom-bar-blur home-page__bottom-bar-blur--5" />
          <span className="home-page__bottom-bar-blur home-page__bottom-bar-blur--6" />
          <span className="home-page__bottom-bar-gradient" />
        </div>
        <div className="home-page__bottom-bar-inner">
          <div className="home-page__bottom-bar-pill">
            <PrimaryButtonMedium
              href="https://t.me/velich00"
              text="Телеграм"
              target="_blank"
              rel="noreferrer"
            />
            <SecondaryButtonDarkMedium text="Резюме" icon={<IconDownload />} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default HomePage
