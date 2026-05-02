// Types
import type { Extensible } from '#v0/types'
import type {
  DragDropContext,
  DragType,
  DraggableTicket,
} from '../'

export type DragDropAdapterEmit<K extends DragType = DragType> = {
  start: (
    source: DraggableTicket<K>,
    origin: { x: number, y: number },
    via: Extensible<'pointer' | 'keyboard'>,
  ) => void
  move: (point: { x: number, y: number }) => void
  drop: () => void
  cancel: () => void
}

export interface DragDropAdapter<K extends DragType = DragType> {
  install: (ctx: DragDropContext<K>, emit: DragDropAdapterEmit<K>) => void
  uninstall: () => void
}
