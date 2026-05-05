/**
 * @module useDragDrop/adapters/keyboard
 *
 * @remarks
 * Default keyboard adapter for useDragDrop. Listens for `keydown` on the
 * document. Activation keys (default Space and Enter) start and drop drags;
 * arrow keys nudge the drag point by `step` px; Escape cancels.
 */

// Composables
import { useEventListener } from '#v0/composables/useEventListener'
import { useLogger } from '#v0/composables/useLogger'

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

/**
 * Default keyboard adapter. Listens for `keydown` on the document; activation
 * keys start/drop drags, arrow keys nudge the drag point, Escape cancels.
 *
 * @example
 * ```ts
 * import { KeyboardAdapter, useDragDrop } from '@vuetify/v0'
 *
 * useDragDrop({ adapters: [new KeyboardAdapter({ activate: ['x'], step: 32 })] })
 * ```
 */
export class KeyboardAdapter<K extends DragType = DragType> extends DragDropAdapter<K> {
  private activate: string[]
  private step: number

  constructor (options: KeyboardAdapterOptions = {}) {
    super()
    this.activate = options.activate ?? [' ', 'Enter']
    this.step = options.step ?? 16
  }

  setup (context: DragDropAdapterContext<K>): void {
    if (this.cleanup) {
      useLogger().warn('KeyboardAdapter setup called twice; previous registration will be replaced')
      this.dispose()
    }
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
          const el = ticket.el.value
          if (!el) {
            useLogger().warn('KeyboardAdapter: cannot start drag — element is not mounted')
            return
          }
          const rect = el.getBoundingClientRect()
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
