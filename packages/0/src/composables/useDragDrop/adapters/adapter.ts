/**
 * @module useDragDrop/adapters/adapter
 *
 * @remarks
 * Adapter contract and abstract base for useDragDrop. Concrete adapters extend
 * `DragDropAdapter<Z>` to share the `cleanup` field, `dispose()` lifecycle, and
 * the `locate()` DOM-walk helper.
 */

// Utilities
import { isElement } from '#v0/utilities'

// Types
import type {
  DragDropContext,
  DragType,
  DraggableTicket,
  DragVia,
} from '../'

export interface DragDropAdapterEmit<Z extends DragType = DragType> {
  start: (
    source: DraggableTicket<Z>,
    origin: { x: number, y: number },
    via: DragVia,
  ) => void
  move: (point: { x: number, y: number }) => void
  drop: () => void
  cancel: () => void
}

export interface DragDropAdapterContext<Z extends DragType = DragType>
  extends DragDropContext<Z> {
  emit: DragDropAdapterEmit<Z>
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
export abstract class DragDropAdapter<Z extends DragType = DragType> {
  protected cleanup: (() => void) | null = null

  dispose (): void {
    this.cleanup?.()
    this.cleanup = null
  }

  protected locate (
    target: EventTarget | Element | null,
    context: DragDropAdapterContext<Z>,
  ): DraggableTicket<Z> | null {
    let element: Element | null = isElement(target) ? target : null
    while (element) {
      for (const ticket of context.draggables.values()) {
        if (ticket.el.value === element) return ticket
      }
      element = element.parentElement
    }
    return null
  }

  abstract setup (context: DragDropAdapterContext<Z>): void
}
