// Types
import type { DragType, DraggableTicket } from '../'
import type { DragDropAdapter, DragDropAdapterEmit } from './adapter'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

export interface PointerAdapterOptions {
  /** Drag-activation distance in px (default 0 — start on pointerdown). */
  threshold?: number
}

export function pointerAdapter<K extends DragType = DragType> (
  options: PointerAdapterOptions = {},
): DragDropAdapter<K> {
  const { threshold = 0 } = options
  let cleanup: (() => void) | null = null

  return {
    install (ctx, emit: DragDropAdapterEmit<K>) {
      if (!IN_BROWSER) return

      let downSource: DraggableTicket<K> | null = null
      let downOrigin: { x: number, y: number } | null = null
      let started = false

      function findTicketForElement (target: EventTarget | null): DraggableTicket<K> | null {
        let el = target as Element | null
        while (el) {
          for (const ticket of ctx.draggables.values()) {
            if (ticket.el.value === el) return ticket
          }
          el = el.parentElement
        }
        return null
      }

      function onDown (event: PointerEvent) {
        const ticket = findTicketForElement(event.target)
        if (!ticket) return
        downSource = ticket
        downOrigin = { x: event.clientX, y: event.clientY }
        started = false
      }

      function onMove (event: PointerEvent) {
        if (!downSource || !downOrigin) return
        const point = { x: event.clientX, y: event.clientY }
        if (!started) {
          const dx = point.x - downOrigin.x
          const dy = point.y - downOrigin.y
          if (threshold > 0 && Math.hypot(dx, dy) < threshold) return
          emit.start(downSource, downOrigin, 'pointer')
          started = true
        }
        emit.move(point)
      }

      function onUp () {
        if (downSource && started) emit.drop()
        downSource = null
        downOrigin = null
        started = false
      }

      function onCancel () {
        if (downSource && started) emit.cancel()
        downSource = null
        downOrigin = null
        started = false
      }

      document.addEventListener('pointerdown', onDown)
      document.addEventListener('pointermove', onMove)
      document.addEventListener('pointerup', onUp)
      document.addEventListener('pointercancel', onCancel)

      cleanup = () => {
        document.removeEventListener('pointerdown', onDown)
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onUp)
        document.removeEventListener('pointercancel', onCancel)
      }
    },
    uninstall () {
      cleanup?.()
      cleanup = null
    },
  }
}
