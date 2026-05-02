// Types
import type { DragType, DraggableTicket } from '../'
import type { DragDropAdapter, DragDropAdapterEmit } from './adapter'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

export interface KeyboardAdapterOptions {
  /** Activation keys (default [' ', 'Enter']). */
  activate?: string[]
  /** Step size in px for arrow-key moves (default 16). */
  step?: number
}

export function keyboardAdapter<K extends DragType = DragType> (
  options: KeyboardAdapterOptions = {},
): DragDropAdapter<K> {
  const activate = options.activate ?? [' ', 'Enter']
  const step = options.step ?? 16
  let cleanup: (() => void) | null = null

  return {
    install (ctx, emit: DragDropAdapterEmit<K>) {
      if (!IN_BROWSER) return

      function findTicket (target: Element | null): DraggableTicket<K> | null {
        if (!target) return null
        for (const ticket of ctx.draggables.values()) {
          if (ticket.el.value === target) return ticket
        }
        return null
      }

      function onKeyDown (event: KeyboardEvent) {
        const focused = document.activeElement
        const ticket = findTicket(focused)
        const isActive = ctx.active.value !== null

        if (activate.includes(event.key)) {
          event.preventDefault()
          if (isActive) {
            emit.drop()
          } else if (ticket) {
            const rect = ticket.el.value!.getBoundingClientRect()
            emit.start(ticket, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, 'keyboard')
          }
          return
        }

        if (event.key === 'Escape' && isActive) {
          event.preventDefault()
          emit.cancel()
          return
        }

        if (isActive && event.key.startsWith('Arrow')) {
          const cur = ctx.active.value!.current
          let point = cur
          switch (event.key) {
            case 'ArrowUp': {
              point = { x: cur.x, y: cur.y - step }
              break
            }
            case 'ArrowDown': {
              point = { x: cur.x, y: cur.y + step }
              break
            }
            case 'ArrowLeft': {
              point = { x: cur.x - step, y: cur.y }
              break
            }
            case 'ArrowRight': {
              point = { x: cur.x + step, y: cur.y }
              break
            }
          }
          event.preventDefault()
          emit.move(point)
        }
      }

      document.addEventListener('keydown', onKeyDown)
      cleanup = () => document.removeEventListener('keydown', onKeyDown)
    },
    uninstall () {
      cleanup?.()
      cleanup = null
    },
  }
}
