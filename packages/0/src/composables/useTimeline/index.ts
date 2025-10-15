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

  const stack: Z[] = []
  const overflow: Z[] = []

  function register (item: Partial<Z>) {
    stack.length = 0

    if (registry.size < size) return registry.register({ ...item })

    const removing = registry.seek('first')!

    if (overflow.length === size) overflow.shift()
    overflow.push(removing)

    registry.unregister(removing.id)

    const ticket = registry.register({ ...item })
    registry.reindex()

    return ticket
  }

  function undo () {
    const item = registry.seek('last')
    if (!item) return undefined

    stack.push(item)

    registry.unregister(item.id)

    const restored = overflow.pop()
    if (restored) {
      const remaining = registry.values()
      registry.clear()
      registry.onboard([restored, ...remaining])
      registry.reindex()
    }

    return item
  }

  function redo () {
    if (stack.length === 0) return undefined

    const item = stack.pop()!

    const ticket = registry.register(item)
    registry.reindex()

    return ticket
  }

  return {
    ...registry,
    register,
    undo,
    redo,
    get size () {
      return registry.size
    },
  } as E
}
