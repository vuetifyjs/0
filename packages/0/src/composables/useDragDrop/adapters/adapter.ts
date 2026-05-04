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

export interface DragDropAdapterContext<K extends DragType = DragType>
  extends DragDropContext<K> {
  emit: DragDropAdapterEmit<K>
}

export interface DragDropAdapterInterface<K extends DragType = DragType> {
  setup: (context: DragDropAdapterContext<K>) => void
  dispose: () => void
}

export abstract class DragDropAdapter<K extends DragType = DragType>
implements DragDropAdapterInterface<K> {
  protected cleanup: (() => void) | null = null

  dispose (): void {
    this.cleanup?.()
    this.cleanup = null
  }

  protected findTicket (
    target: EventTarget | Element | null,
    context: DragDropAdapterContext<K>,
  ): DraggableTicket<K> | null {
    let element = target as Element | null
    while (element) {
      for (const ticket of context.draggables.values()) {
        if (ticket.el.value === element) return ticket
      }
      element = element.parentElement
    }
    return null
  }

  abstract setup (context: DragDropAdapterContext<K>): void
}
