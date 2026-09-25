# TODO — рефакторинг структуры & навигации

> Составлено по анализу репозитория. Приоритеты: high → medium → low.

## High
- [ ] Вынести навигацию в `src/router/`: `navigate()` + `useRouter()` + `<Link>` + таблица маршрутов
- [ ] Разгрузить `App.tsx`: композиция; роутер → `router.tsx`, переход → `pageTransition.tsx`, скролл → `scroll.ts`

## Medium
- [ ] Свести «маршрут → компонент» в один map (сейчас две точки свича: `getRouteFromPath` и `renderPage`)
- [ ] Вынести `DEV_REDIRECTS` (afrasuez → playground) из `getRouteFromPath` в отдельный конфиг/env
- [ ] Вынести `PageTransition` в отдельный компонент (фазы внутри, `onDone` наружу)
- [ ] Проверить SPA fallback для глубоких ссылок на проде (Layero)

## Low
- [ ] Централизовать/почистить работу с `BASE` и путями (`paths.ts`), убрать мёртвые ветки GitHub-Pages
- [ ] Удалить мёртвый `CasePlaceholderPage.tsx`
- [ ] Убрать дубль зависимостей `framer-motion`/`motion` — оставить один
- [ ] Унифицировать импорты ассетов (`public/` vs `src/assets`), проверить `/image-placeholder.svg`
- [ ] Общий базовый CSS для кнопок (убрать дублирование)

---

# План на будущее

1. Провести анализ репозитория на безопасность
2. Закастомить лайтбокс
3. Проверить работу на адаптивах (breakpoints)