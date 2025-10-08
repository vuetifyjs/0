// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'

export interface TimelineContext<Z extends TimelineTicket> extends RegistryContext<Z> {
  /* Unapplies the last registered ticket */
  undo: () => void
  /* Reapplies the last undone ticket */
  redo: () => void
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
 * const timeline = useTimeline({ size: 3 } )
 *
 * timeline.onboard([{ id: 'one' },{ id: 'two' },{ id: 'three' }])
 * timeline.values() // [ { id: 'one' }, { id: 'two' }, { id: 'three' } ]
 *
 * timeline.undo()
 * timeline.values() // [ { id: 'one' }, { id: 'two' } ]
 *
 * timeline.redo()
 * timeline.values()// [ { id: 'one' }, { id: 'two' }, { id: 'three' } ]
 * ```
 **/
export function useTimeline<
  Z extends TimelineTicket = TimelineTicket,
  E extends TimelineContext<Z> = TimelineContext<Z>,
> (_options: TimelineOptions = {}) {
  const { size = 10, ...options } = _options
  const registry = useRegistry<Z, E>(options)

  const undoTimeline: Z[] = []
  const redoTimeline: Z[] = []

  function register (item: Partial<Z>) {
    if (registry.size < size) return registry.register({ ...item })

    const id = registry.lookup(0)!
    const removing = registry.get(id)!

    if (redoTimeline.length === size) redoTimeline.shift()
    redoTimeline.push(removing)

    registry.unregister(id)

    const ticket = registry.register({ ...item })
    registry.reindex()

    return ticket
  }

  function redo () {
    if (undoTimeline.length === 0) return

    registry.register(undoTimeline.pop())
    registry.reindex()
  }

  function undo () {
    const id = registry.lookup(registry.size - 1)
    if (!id) return

    undoTimeline.push(registry.get(id)!)

    registry.unregister(id!)

    restore()
  }

  function restore () {
    const value = redoTimeline.pop()
    const restored = value ? [value, ...registry.values()] : [...registry.values()]

    registry.clear()
    registry.onboard(restored)
    registry.reindex()
  }

  return {
    ...registry,
    register,
    undo,
    redo,
  } as E
}
