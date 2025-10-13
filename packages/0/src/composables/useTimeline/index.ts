// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'

export interface TimelineContext<Z extends TimelineTicket> extends RegistryContext<Z> {
  /* Removes the last registered ticket and stores it for redo */
  undo: () => Z | undefined
  /* Restores the last undone ticket */
  redo: () => Z | undefined
}

export interface TimelineTicket extends RegistryTicket {}

export interface TimelineOptions extends RegistryOptions {
  size?: number
}

/**
 * Creates a new timeline instance.
 *
 * @param _options The options for the timeline instance.
 * @template Z The type of the timeline ticket.
 * @template E The type of the timeline context.
 * @returns A new timeline instance.
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-timeline
 *
 * @example
 * ```ts
 * import { useTimeline } from '@vuetify/v0'
 *
 * const timeline = useTimeline({ size: 3 })
 *
 * timeline.onboard([{ id: 'one' }, { id: 'two' }, { id: 'three' }])
 *
 * console.log(timeline.values()) // [{ id: 'one' }, { id: 'two' }, { id: 'three' }]
 *
 * timeline.undo()
 * console.log(timeline.values()) // [{ id: 'one' }, { id: 'two' }]
 *
 * timeline.redo()
 * console.log(timeline.values()) // [{ id: 'one' }, { id: 'two' }, { id: 'three' }]
 * ```
 */
export function useTimeline<
  Z extends TimelineTicket = TimelineTicket,
  E extends TimelineContext<Z> = TimelineContext<Z>,
> (_options: TimelineOptions = {}) {
  const { size = 10, ...options } = _options
  const registry = useRegistry<Z, E>(options)

  const undoStack: Z[] = []
  const redoStack: Z[] = []
  const overflow: Z[] = []

  function register (item: Partial<Z>) {
    redoStack.length = 0

    if (registry.size < size) return registry.register({ ...item })

    const id = registry.lookup(0)!
    const removing = registry.get(id)!

    if (overflow.length === size) overflow.shift()
    overflow.push(removing)

    registry.unregister(id)

    const ticket = registry.register({ ...item })
    registry.reindex()

    return ticket
  }

  function undo () {
    const id = registry.lookup(registry.size - 1)
    if (!id) return undefined

    const item = registry.get(id)!
    undoStack.push(item)

    registry.unregister(id)

    const restored = overflow.pop()
    if (restored) {
      registry.clear()
      registry.onboard([restored, ...registry.values()])
      registry.reindex()
    }

    return item
  }

  function redo () {
    if (undoStack.length === 0) return undefined

    const item = undoStack.pop()!
    redoStack.push(item)

    const ticket = registry.register(item)
    registry.reindex()

    return ticket
  }

  return {
    ...registry,
    register,
    undo,
    redo,
  } as E
}
