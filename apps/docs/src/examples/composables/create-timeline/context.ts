import { createContext } from '@vuetify/v0'
import type { ComputedRef, Ref } from 'vue'

export type Point = { x: number, y: number }
export type Stroke = Point[]

export interface CanvasContext {
  strokes: ComputedRef<Stroke[]>
  size: ComputedRef<number>
  canUndo: Ref<boolean>
  canRedo: Ref<boolean>
  add: (stroke: Stroke) => void
  undo: () => void
  redo: () => void
  clear: () => void
}

export const [useCanvas, provideCanvas] = createContext<CanvasContext>('demo:canvas')
