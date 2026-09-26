import { readFileSync, writeFileSync } from 'node:fs'
import Typograf from 'typograf'

const SENTINEL = '\uE000'
const tp = new Typograf({ locale: ['ru'] })
tp.disableRule('*')
tp.enableRule('common/nbsp/afterShortWordByList')

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const SPACE = `[ \\t\\n\\r\\uE000]`
const spacePattern = (escaped) => escaped.replaceAll(' ', SPACE)

// o/c — открывающий/закрывающий разделитель лишенической строки.
// Для строк-атрибутов и массивов — одинарные/двойные кавычки; для JSX-текста — '>' и '<'.
const TARGETS = [
  // ---------- HomePage: firstCompanyResponsibilities -----
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Работал в командах из 5–7 человек: бизнес-аналитик, PM, frontend, mobile и backend-разработчики, QA.' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Анализировал конкурентов, прорабатывал пользовательские сценарии и дизайн-концепции, создавал интерфейсы и передавал макеты в разработку. Проводил дизайн-ревью реализованных интерфейсов.' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Презентовал дизайн-решения клиентам, защищал концепции и работал с фидбеком.' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Участвовал в планировании и оценке дизайн-задач на спринт совместно с менеджером и клиентом.' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'На двух проектах выполнял роль старшего дизайнера: ревью работы дизайнеров, помощь в проработке концепций и пользовательских сценариев, участие во встречах с клиентом.' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'На отдельных проектах привлекал 3D/motion-дизайнеров: готовил ТЗ, давал фидбек по промежуточным результатам и доводил решения до финального состояния перед интеграцией в проект.' },
  // ---------- HomePage: firstCompanyAchievements -----
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Запустили продукты с нуля до релиза. Моя роль: проработка пользовательских сценариев, дизайн-концепций, отрисовка макетов и передача их в разработку.' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Участвовал в пресейлах с клиентами: подготовка дизайн-концепций, презентации решений и обсуждения проектов. 4 клиента (конверсия ~40%).' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Помогал с наймом дизайнеров: оценка резюме и портфолио, ревью тестовых заданий, подготовка фидбека и участие в принятии решений. Наняли 3 дизайнеров, которые успешно работают на проектных командах.' },
  // ---------- HomePage: secondCompanyResponsibilities -----
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Работал в команде с менеджером и маркетологом. Передавал макеты сайтов и веб-платформ разработчикам.' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Дизайн-поддержка основного сайта и личного кабинета отельера: правки, новые разделы, визуальная консистентность.' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Отрисовка посадочных страниц под рекламные кампании.' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Маркетинговые материалы: презентации, КП, баннеры и креативы для Яндекс Директ, Facebook и Google Ads.' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Собрал визуальный стиль Instagram-профиля компании. Стиль используют до сих пор.' },
  // ---------- HomePage: skills -----
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Совместная работа с дизайн-командой и разработчиками' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Работа с дизайн-системой' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Создание нескольких вариаций дизайна с описанием их функциональности и преимуществ для выбора оптимального решения' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Презентация своих решений' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Участие в улучшении пользовательского опыта и оптимизации процессов взаимодействия с сервисами' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Участие в разработке MVP с дальнейшей проработкой недостающих фич' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Передача дизайна в разработку с подробными комментариями для разработчиков' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Проведение дизайн-ревью' },
  { file: 'src/pages/HomePage.tsx', o: "'", c: "'", s: 'Рефакторинг разделов CMS' },
  // ---------- HomePage: CompanyCard 1 -----
  { file: 'src/pages/HomePage.tsx', o: '"', c: '"', s: 'Else Digital: UI/UX дизайнер' },
  { file: 'src/pages/HomePage.tsx', o: '"', c: '"', s: 'Июль 2024 — сейчас (1 год и 9 месяцев)' },
  { file: 'src/pages/HomePage.tsx', o: '"', c: '"', s: 'IT-агентство c командой 35 человек. Разрабатываем веб-сервисы и мобильные приложения. Делали проекты в сфере медицины, промышленности, e-commerce, инвестиций, HoReCa, HR, образования, строительства, недвижимости.' },
  // ---------- HomePage: CompanyCard 2 -----
  { file: 'src/pages/HomePage.tsx', o: '"', c: '"', s: 'Smartbooking: Веб, Коммуникационный дизайнер' },
  { file: 'src/pages/HomePage.tsx', o: '"', c: '"', s: 'Август 2022 — Сентябрь 2023 (1 год и 2 месяца)' },
  { file: 'src/pages/HomePage.tsx', o: '"', c: '"', s: 'PMS-платформа для управления гостиницами: автоматизация бронирований, интеграция с 70+ OTA-каналами (Booking, Airbnb, Expedia и т. д.), аналитика, мобильное приложение и конструктор сайта отеля с прямым бронированием.' },
  // ---------- HomePage: SuperpowerCard -----
  { file: 'src/pages/HomePage.tsx', o: '"', c: '"', s: 'Сильные стороны: визуал и системность' },
  { file: 'src/pages/HomePage.tsx', o: '"', c: '"', s: "Windscribe doesn&apos;t offer a traditional free trial, but we do offer a completely free plan with up to 10GB of data per month (no credit card required). If you need more, you can upgrade to Windscribe Pro for as little as $3 USD per month. If you aren&apos;t ready to upgrade, you can always get more data by referring a friend or posting about us on X." },
  // ---------- HomePage: CasePreviewCard -----
  { file: 'src/pages/HomePage.tsx', o: '"', c: '"', s: 'Веб-платформа для нефтяных трейдеров. Поиск инфраструктуры и специалистов, объявления о купле и продаже' },
  { file: 'src/pages/HomePage.tsx', o: '"', c: '"', s: 'Приложение для вахтовиков. Устраивайся на работу, оформляй документы, получай билеты — всё в одном месте' },
  { file: 'src/pages/HomePage.tsx', o: '"', c: '"', s: 'Приложение для клиентов ветклиники. Записывай питомца к врачу, смотри результаты анализов, пополняй баланс для стационара' },
  // ---------- HomePage: JSX-текст (hero) -----
  { file: 'src/pages/HomePage.tsx', o: '>', c: '<', s: 'Максим Павлусенко, Продуктовый дизайнер' },
  { file: 'src/pages/HomePage.tsx', o: '>', c: '<', s: 'В одном волшебном королевстве проживал могучий зелёный исполин по имени Шрэк, который ценил уединение в своём болотистом уголке лесной чащи. С этого момента начинаются приключения огромного огра.' },
  // ---------- NotFoundPage: JSX-текст -----
  { file: 'src/pages/NotFoundPage.tsx', o: '>', c: '<', s: 'Страница не найдена' },
  { file: 'src/pages/NotFoundPage.tsx', o: '>', c: '<', s: 'Такой страницы нет — возможно, она переехала или была удалена.' },
  // ---------- PlaygroundPage: JSX-текст (описание) -----
  { file: 'src/pages/PlaygroundPage.tsx', o: '"', c: '"', s: '«Самокат» — это российский сервис экспресс-доставки, который через мобильное приложение за считанные минуты доставляет широкий ассортимент товаров, включая продукты питания, товары повседневного спроса, одежду, электронику и многое другое.' },
]

const byFile = new Map()
for (const t of TARGETS) {
  const list = byFile.get(t.file) || []
  list.push(t)
  byFile.set(t.file, list)
}

let totalReplaced = 0
for (const [file, list] of byFile) {
  let content = readFileSync(file, 'utf8').replace(/\u00A0/g, SENTINEL).replace(/\uFEFF/g, '')

  for (const t of list) {
    const pattern = new RegExp(
      `(${esc(t.o)}\\s*)(${spacePattern(esc(t.s))})(\\s*${esc(t.c)})`,
      'g',
    )
    let count = 0
    content = content.replace(pattern, (match, pre, body, post) => {
      count++
      const current = body.replaceAll(SENTINEL, '\u00A0')
      return pre + tp.execute(current) + post
    })
    totalReplaced += count
    if (count === 0) console.log(`!! НЕ НАЙДЕНО: ${file} :: ${t.s.slice(0, 50)}...`)
    else if (count > 1) console.log(`?? ДУБЛЬ(${count}): ${file} :: ${t.s.slice(0, 50)}...`)
  }

  writeFileSync(file, content)
}

console.log(`\nЗаменено строк: ${totalReplaced}`)