import { createContext } from '@vuetify/v0'
import type { SliderContext } from '@vuetify/v0'
import type { Ref } from 'vue'

export interface ScrubberContext {
  slider: SliderContext
  scrubbing: Ref<boolean>
}

export const [useScrubber, provideScrubber] = createContext<ScrubberContext>('demo:scrubber')

export const DURATION = 217 // 3:37 in seconds

export function formatTime (seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
