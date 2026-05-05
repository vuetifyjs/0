/**
 * @module useDragDrop/adapters/pointer
 *
 * @remarks
 * Default pointer adapter for useDragDrop. Listens for `pointerdown` /
 * `pointermove` / `pointerup` / `pointercancel` on the document and emits the
 * drag lifecycle. Activation distance is configurable via `threshold`.
 */

// Composables
import { useEventListener } from '#v0/composables/useEventListener'
import { useLogger } from '#v0/composables/useLogger'

// Types
import type { DragType, DraggableTicket } from '../'
import type { DragDropAdapterContext } from './adapter'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Adapters
import { DragDropAdapter } from './adapter'

export interface PointerAdapterOptions {
  /** Drag-activation distance in px (default 0 — start on pointerdown). */
  threshold?: number
}

/**
 * Default pointer adapter. Wires `pointerdown` / `pointermove` / `pointerup` /
 * `pointercancel` on the document and converts them into drag lifecycle calls.
 *
 * @example
 * ```ts
 * import { PointerAdapter, useDragDrop } from '@vuetify/v0'
 *
 * useDragDrop({ adapters: [new PointerAdapter({ threshold: 10 })] })
 * ```
 */
export class PointerAdapter<K extends DragType = DragType> extends DragDropAdapter<K> {
  private threshold: number

  constructor (options: PointerAdapterOptions = {}) {
    super()
    this.threshold = options.threshold ?? 0
  }

  setup (context: DragDropAdapterContext<K>): void {
    const logger = useLogger()

    if (this.cleanup) {
      logger.warn('PointerAdapter setup called twice; previous registration will be replaced')
      this.dispose()
    }
    if (!IN_BROWSER) return

    let downSource: DraggableTicket<K> | null = null
    let downOrigin: { x: number, y: number } | null = null
    let started = false

    const onDown = (event: PointerEvent) => {
      const ticket = this.locate(event.target, context)
      if (!ticket) return
      downSource = ticket
      downOrigin = { x: event.clientX, y: event.clientY }
      started = false
    }

    const onMove = (event: PointerEvent) => {
      if (!downSource || !downOrigin) return
      const point = { x: event.clientX, y: event.clientY }
      if (!started) {
        const dx = point.x - downOrigin.x
        const dy = point.y - downOrigin.y
        if (this.threshold > 0 && Math.hypot(dx, dy) < this.threshold) return
        context.emit.start(downSource, downOrigin, 'pointer')
        started = true
      }
      context.emit.move(point)
    }

    function onUp () {
      if (downSource && started) context.emit.drop()
      downSource = null
      downOrigin = null
      started = false
    }

    function onCancel () {
      if (downSource && started) context.emit.cancel()
      downSource = null
      downOrigin = null
      started = false
    }

    const stopDown = useEventListener(document, 'pointerdown', onDown)
    const stopMove = useEventListener(document, 'pointermove', onMove)
    const stopUp = useEventListener(document, 'pointerup', onUp)
    const stopCancel = useEventListener(document, 'pointercancel', onCancel)

    this.cleanup = () => {
      stopDown()
      stopMove()
      stopUp()
      stopCancel()
    }
  }
}
