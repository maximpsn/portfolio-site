// Флаг «переход начат кнопкой внутри сайта». Нужен, чтобы отличить нашу кнопку «назад»
// (navigate(-1) → POP) от системного свайпа назад на iOS, где Safari уже показал свою анимацию.

const INTENT_TTL_MS = 1000

let markedAt = 0

export function markInAppNavigation() {
  markedAt = Date.now()
}

export function consumeInAppNavigation(): boolean {
  const fresh = Date.now() - markedAt < INTENT_TTL_MS
  markedAt = 0
  return fresh
}
