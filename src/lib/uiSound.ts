import { playUISound } from './ui-sounds'

const INTERACTIVE_SELECTOR = 'a, button, [role="button"]'

/**
 * Звук щелчка на клик по интерактивным элементам (ссылки, кнопки, карточки-ссылки).
 * Триггеры открытия изображений (лайтбокс) — это не кнопки/ссылки, поэтому звук
 * при открытии картинок не играет.
 */
export function initClickSound(): () => void {
  const handleClick = (event: MouseEvent) => {
    if (event.button !== 0) return

    const target = event.target as Element | null
    if (!target || typeof target.closest !== 'function') return

    if (target.closest(INTERACTIVE_SELECTOR)) {
      playUISound('hover')
    }
  }

  document.addEventListener('click', handleClick)
  return () => {
    document.removeEventListener('click', handleClick)
  }
}