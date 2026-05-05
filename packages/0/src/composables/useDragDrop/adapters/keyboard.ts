// Composables
import { useEventListener } from '#v0/composables/useEventListener'

// Utilities
import { isNull } from '#v0/utilities'

// Types
import type { DragType } from '../'
import type { DragDropAdapterContext } from './adapter'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Adapters
import { DragDropAdapter } from './adapter'

export interface KeyboardAdapterOptions {
  /** Activation keys (default [' ', 'Enter']). */
  activate?: string[]
  /** Step size in px for arrow-key moves (default 16). */
  step?: number
}

export class KeyboardAdapter<K extends DragType = DragType> extends DragDropAdapter<K> {
  private activate: string[]
  private step: number

  constructor (options: KeyboardAdapterOptions = {}) {
    super()
    this.activate = options.activate ?? [' ', 'Enter']
    this.step = options.step ?? 16
  }

  setup (context: DragDropAdapterContext<K>): void {
    if (!IN_BROWSER) return

    const onKeyDown = (event: KeyboardEvent) => {
      const focused = document.activeElement
      const ticket = this.locate(focused, context)
      const isActive = !isNull(context.active.value)

      if (this.activate.includes(event.key)) {
        event.preventDefault()
        if (isActive) {
          context.emit.drop()
        } else if (ticket) {
          const rect = ticket.el.value!.getBoundingClientRect()
          context.emit.start(ticket, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, 'keyboard')
        }
        return
      }

      if (event.key === 'Escape' && isActive) {
        event.preventDefault()
        context.emit.cancel()
        return
      }

      if (isActive && event.key.startsWith('Arrow')) {
        const current = context.active.value!.current
        let point = current
        switch (event.key) {
          case 'ArrowUp': {
            point = { x: current.x, y: current.y - this.step }
            break
          }
          case 'ArrowDown': {
            point = { x: current.x, y: current.y + this.step }
            break
          }
          case 'ArrowLeft': {
            point = { x: current.x - this.step, y: current.y }
            break
          }
          case 'ArrowRight': {
            point = { x: current.x + this.step, y: current.y }
            break
          }
        }
        event.preventDefault()
        context.emit.move(point)
      }
    }

    const stop = useEventListener(document, 'keydown', onKeyDown)
    this.cleanup = () => stop()
  }
}
