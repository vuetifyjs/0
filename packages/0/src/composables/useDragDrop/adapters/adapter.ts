/**
 * @module useDragDrop/adapters/adapter
 *
 * @remarks
 * Adapter contract and abstract base for useDragDrop. Concrete adapters extend
 * `DragDropAdapter<K>` to share the `cleanup` field, `dispose()` lifecycle, and
 * the `locate()` DOM-walk helper. Adapters that don't need shared logic can
 * implement `DragDropAdapterInterface<K>` directly.
 */

// Types
import type { Extensible } from '#v0/types'
import type {
  DragDropContext,
  DragType,
  DraggableTicket,
} from '../'

export interface DragDropAdapterEmit<K extends DragType = DragType> {
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

/**
 * Abstract base class for useDragDrop adapters. Provides a `cleanup` slot, a
 * `dispose()` lifecycle, and a `locate()` helper that walks the DOM to find the
 * draggable ticket whose `el` ancestors a given event target.
 *
 * @example
 * ```ts
 * import { DragDropAdapter, type DragDropAdapterContext } from '@vuetify/v0'
 *
 * class MyAdapter extends DragDropAdapter {
 *   setup (context: DragDropAdapterContext) {
 *     const stop = useEventListener(document, 'mousedown', event => {
 *       const ticket = this.locate(event.target, context)
 *       if (ticket) context.emit.start(ticket, { x: event.clientX, y: event.clientY }, 'pointer')
 *     })
 *     this.cleanup = () => stop()
 *   }
 * }
 * ```
 */
export abstract class DragDropAdapter<K extends DragType = DragType>
implements DragDropAdapterInterface<K> {
  protected cleanup: (() => void) | null = null

  dispose (): void {
    this.cleanup?.()
    this.cleanup = null
  }

  protected locate (
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
