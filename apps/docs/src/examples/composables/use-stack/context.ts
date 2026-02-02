import { createContext } from '@vuetify/v0'
import type { StackContext } from '@vuetify/v0'
import type { ComputedRef, ShallowRef } from 'vue'

export interface Overlay {
  id: string
  title: string
  isOpen: ShallowRef<boolean>
  blocking?: boolean
}

export interface OverlayContext {
  overlays: Overlay[]
  stack: StackContext
  activeCount: ComputedRef<number>
  open: (id: string) => void
  close: (id: string) => void
  closeAll: () => void
}

export const [
  useOverlays,
  provideOverlays,
] = createContext<OverlayContext>('v0:overlays-example')
