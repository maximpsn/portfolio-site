export type UISoundPreset =
  | 'press'
  | 'click'
  | 'tap'
  | 'hover'
  | 'select'
  | 'toggle'
  | 'tick'

export function playUISound(name: UISoundPreset, intensity?: number): void
export function createNoiseLayer(
  context: AudioContext,
  startTime: number,
  frequency: number,
  options?: object,
): void
export const effects: Record<
  string,
  (context: AudioContext, time: number, intensity?: number) => void
>