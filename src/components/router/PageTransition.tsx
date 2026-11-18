import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { matchRoutes, useLocation, useNavigate, useNavigationType, type Location } from 'react-router-dom'
import AppRouter from './AppRouter'
import { consumeInAppNavigation } from '../../lib/navIntent'
import { RoutePath, routerConfig, AppRoutes } from '../../config/routeConfig'

const KNOWN_ROUTES = Object.values(routerConfig).map(({ path }) => ({ path }))

function isKnownPath(pathname: string): boolean {
  return matchRoutes(KNOWN_ROUTES, pathname) !== null
}
import './PageTransition.css'

const DURATION_MS = 450
const EASING = 'cubic-bezier(0.42, 0, 0.58, 1)'

// Тач-устройства: вместо выезда страницы — короткая белая шторка, прикрывающая смену.
// Выезд на мобилке портила динамическая панель браузера, которая дёргается при сбросе скролла.
const VEIL_MS = 100

type Veil = 'none' | 'covering' | 'revealing'

function isTouchDevice(): boolean {
  return window.matchMedia('(pointer: coarse)').matches
}

type LayerMode = 'static' | 'leaving' | 'entering'

type Layer = {
  id: number
  location: Location
  mode: LayerMode
  frozenY: number
}

function scrollToTopInstant() {
  const html = document.documentElement
  const previous = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  html.style.scrollBehavior = previous
}

function shouldSkipAnimation(navigationType: string): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true
  }

  const fromInAppButton = consumeInAppNavigation()

  // Свайп назад/вперёд на тач-устройстве: браузер уже анимировал переход сам.
  if (navigationType === 'POP' && !fromInAppButton && isTouchDevice()) {
    return true
  }

  return false
}

/**
 * Слои страниц живут под стабильными ключами, поэтому уходящая страница не перемонтируется
 * (раньше перемонтирование давало серое мигание картинок и сбрасывало состояние).
 *
 * В покое: один static-слой в обычном потоке, скроллится окно.
 * В переходе: уходящий слой становится fixed на весь вьюпорт, а его содержимое сдвинуто
 * на сохранённый scrollY через `top` — позиция визуально не меняется и ничего не подкручивается.
 * Распорка сохраняет высоту документа, поэтому scrollY во время анимации не трогается
 * (панель мобильного браузера не дёргается). Скролл в 0 — только в конце, при смене слоёв.
 * Fixed-потомки (навбар, кнопки, TOC) остаются на своих местах, т.к. контейнер для них —
 * внешний слой размером с вьюпорт. Новая страница выезжает снизу и всегда начинается с 0.
 */
function PageTransition() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const navigate = useNavigate()
  const nextIdRef = useRef(1)
  const [layers, setLayers] = useState<Layer[]>(() => [
    { id: 0, location, mode: 'static', frozenY: 0 },
  ])
  // Высота документа на старте перехода. Пока слои fixed, распорка держит прежнюю высоту,
  // и scrollY не меняется. Иначе документ сжимался до вьюпорта, скролл обнулялся,
  // и мобильные браузеры резко разворачивали свою динамическую панель посреди анимации.
  const [spacerHeight, setSpacerHeight] = useState(0)
  const [veil, setVeil] = useState<Veil>('none')
  const pendingLayerRef = useRef<Layer | null>(null)
  const veilRef = useRef<HTMLDivElement | null>(null)
  const elementsRef = useRef(new Map<number, HTMLDivElement>())
  const animationsRef = useRef(new Map<number, Animation[]>())

  const isTransitioning = layers.some((layer) => layer.mode !== 'static')

  // Старт перехода. Layout-эффект + синхронный setState: смена режима слоёв
  // коммитится до отрисовки, промежуточного кадра нет. Это намеренно.
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    if (isTransitioning || veil !== 'none') {
      // Дождёмся конца текущего перехода — эффект перезапустится, когда layers станут static.
      return
    }

    const current = layers[0]

    if (current.location.key === location.key) {
      return
    }

    // Смена только hash/search на той же странице — без анимации и без перемонтирования.
    if (current.location.pathname === location.pathname) {
      setLayers([{ ...current, location }])
      return
    }

    // Несуществующий адрес: сразу заменяем на /404 и анимируем уже переход к нему.
    // Иначе сначала выезжал пустой экран редиректа, а потом второй переход к 404.
    if (!isKnownPath(location.pathname)) {
      navigate(RoutePath[AppRoutes.NOT_FOUND], { replace: true })
      return
    }

    const id = nextIdRef.current++

    // Текущий слой — редирект с несуществующего адреса (прямой заход по битой ссылке):
    // показывать нечего, меняем мгновенно.
    if (!isKnownPath(current.location.pathname) || shouldSkipAnimation(navigationType)) {
      scrollToTopInstant()
      setLayers([{ id, location, mode: 'static', frozenY: 0 }])
      return
    }

    if (isTouchDevice()) {
      pendingLayerRef.current = { id, location, mode: 'static', frozenY: 0 }
      setVeil('covering')
      return
    }

    setSpacerHeight(document.documentElement.scrollHeight)
    setLayers([
      { ...current, mode: 'leaving', frozenY: window.scrollY },
      { id, location, mode: 'entering', frozenY: 0 },
    ])
  }, [location, navigationType, navigate, layers, isTransitioning, veil])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Шторка на тач-устройствах: 0→1 за VEIL_MS, под ней мгновенная смена страницы и скролл в 0,
  // затем 1→0 за VEIL_MS.
  useLayoutEffect(() => {
    const element = veilRef.current

    if (veil === 'none' || !element) {
      return undefined
    }

    if (veil === 'covering') {
      const cover = element.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: VEIL_MS,
        easing: 'linear',
        fill: 'forwards',
      })

      cover.finished
        .then(() => {
          const next = pendingLayerRef.current
          pendingLayerRef.current = null
          if (next) {
            setLayers([next])
          }
          setVeil('revealing')
        })
        .catch(() => {
          // Отменено размонтированием.
        })

      return () => {
        cover.cancel()
      }
    }

    // revealing: новая страница уже закоммичена под шторкой.
    scrollToTopInstant()

    const reveal = element.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: VEIL_MS,
      easing: 'linear',
      fill: 'forwards',
    })

    reveal.finished
      .then(() => {
        setVeil('none')
        window.dispatchEvent(new Event('page-transition-end'))
      })
      .catch(() => {
        // Отменено размонтированием.
      })

    return () => {
      reveal.cancel()
    }
  }, [veil])

  // Запуск анимаций и уборка.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('is-page-transitioning', isTransitioning)

    layers.forEach((layer) => {
      const element = elementsRef.current.get(layer.id)
      const running = animationsRef.current.get(layer.id)

      if (layer.mode === 'static') {
        // Снимаем fill-трансформ сразу после коммита static-режима, до отрисовки.
        running?.forEach((animation) => animation.cancel())
        animationsRef.current.delete(layer.id)
        return
      }

      if (!element || running) {
        return
      }

      if (layer.mode === 'leaving') {
        animationsRef.current.set(layer.id, [
          element.animate(
            [
              { transform: 'scale(1)', opacity: 1 },
              { transform: 'scale(0.9)', opacity: 0 },
            ],
            { duration: DURATION_MS, easing: EASING, fill: 'forwards' },
          ),
        ])
        return
      }

      const enter = element.animate(
        [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
        { duration: DURATION_MS, easing: EASING, fill: 'forwards' },
      )
      animationsRef.current.set(layer.id, [enter])

      enter.finished
        .then(() => {
          setLayers((previous) => {
            const entering = previous.find((item) => item.id === layer.id)
            return entering ? [{ ...entering, mode: 'static', frozenY: 0 }] : previous
          })
        })
        .catch(() => {
          // Анимацию отменили (размонтирование) — ничего не делаем.
        })
    })

    // Удаляем записи об анимациях слоёв, которых больше нет.
    animationsRef.current.forEach((animations, id) => {
      if (!layers.some((layer) => layer.id === id)) {
        animations.forEach((animation) => animation.cancel())
        animationsRef.current.delete(id)
      }
    })
  }, [layers, isTransitioning])

  // Конец перехода: страница в потоке, скролл с нуля, уведомляем подписчиков (TOC).
  const wasTransitioningRef = useRef(false)
  useLayoutEffect(() => {
    if (wasTransitioningRef.current && !isTransitioning) {
      scrollToTopInstant()
      window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event('page-transition-end'))
      })
    }
    wasTransitioningRef.current = isTransitioning
  }, [isTransitioning])

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('is-page-transitioning')
    }
  }, [])

  return (
    <div className={isTransitioning ? 'page-stack page-stack--transitioning' : 'page-stack'}>
      {layers.map((layer) => (
        <div
          key={layer.id}
          ref={(element) => {
            if (element) {
              elementsRef.current.set(layer.id, element)
            } else {
              elementsRef.current.delete(layer.id)
            }
          }}
          className={`page-layer page-layer--${layer.mode}`}
          style={
            layer.mode === 'leaving'
              ? { transformOrigin: '50% 50%' }
              : undefined
          }
        >
          <div
            className="page-layer__inner"
            style={layer.frozenY ? { top: -layer.frozenY } : undefined}
          >
            <AppRouter location={layer.location} />
          </div>
        </div>
      ))}

      {isTransitioning ? (
        <div className="page-stack__spacer" style={{ height: spacerHeight }} aria-hidden="true" />
      ) : null}

      {veil !== 'none' ? (
        <div
          ref={veilRef}
          className="page-veil"
          style={{ opacity: veil === 'revealing' ? 1 : 0 }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  )
}

export default PageTransition
