/**
 * @module useTimeline
 *
 * @remarks
 * Bounded undo/redo system with overflow management.
 *
 * Key features:
 * - Fixed-size history (default: 10 items)
 * - Undo/redo stack management
 * - Overflow queue (preserves oldest items)
 * - Automatic reindexing after operations
 * - Perfect for command pattern, history tracking
 *
 * Extends useRegistry with temporal navigation capabilities.
 */

// Composables
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'
import { useRegistry } from '#v0/composables/useRegistry'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'
import type { App } from 'vue'

export interface TimelineContext<Z extends TimelineTicket> extends RegistryContext<Z> {
  /**
   * Removes the last registered ticket and stores it for redo
   *
   * @return The removed ticket, or undefined if there are no tickets to undo.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-timeline#undo
   *
   * @example
   * ```ts
   * import { useTimeline } from '@vuetify/v0'
   *
   * const timeline = useTimeline()
   *
   * timeline.register({ id: 'one' })
   * timeline.register({ id: 'two' })
   *
   * console.log(timeline.values()) // [{ id: 'one' }, { id: 'two' }]
   *
   * timeline.undo()
   * console.log(timeline.values()) // [{ id: 'one' }]
   * ```
   */
  undo: () => Z | undefined
  /**
   * Restores the last undone ticket
   *
   * @returns The restored ticket, or undefined if there are no tickets to redo.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-timeline#redo
   *
   * @example
   * ```ts
   * import { useTimeline } from '@vuetify/v0'
   *
   * const timeline = useTimeline()
   *
   * timeline.register({ id: 'one' })
   * timeline.register({ id: 'two' })
   *
   * console.log(timeline.values()) // [{ id: 'one' }, { id: 'two' }]
   *
   * timeline.undo()
   * console.log(timeline.values()) // [{ id: 'one' }]
   *
   * timeline.redo()
   * console.log(timeline.values()) // [{ id: 'one' }, { id: 'two' }]
   * ```
   */
  redo: () => Z | undefined
}

export interface TimelineTicket<V = unknown> extends RegistryTicket<V> {}

export interface TimelineOptions extends RegistryOptions {
  /**
   * The maximum size of the timeline.
   *
   * @default 10
   */
  size?: number
}

export interface TimelineContextOptions extends TimelineOptions {
  namespace?: string
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
export function createTimeline<
  Z extends TimelineTicket = TimelineTicket,
  E extends TimelineContext<Z> = TimelineContext<Z>,
> (_options: TimelineOptions = {}): E {
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

/**
 * Creates a new timeline context.
 *
 * @param options The options for the timeline context.
 * @template Z The type of the timeline ticket.
 * @template E The type of the timeline context.
 * @returns A new timeline context.
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-timeline
 *
 * @example
 * ```ts
 * import { createTimelineContext } from '@vuetify/v0'
 *
 * // With default namespace 'v0:timeline'
 * export const [useTimeline, provideTimeline, context] = createTimelineContext({ size: 5 })
 *
 * context.register({ id: 'example' })
 *
 * // In a parent component
 * provideTimeline()
 *
 * // In a child component
 * const timeline = useTimeline()
 *
 * console.log(timeline.values()) // [{ id: 'example' }]
 * ```
 */
export function createTimelineContext<
  Z extends TimelineTicket = TimelineTicket,
  E extends TimelineContext<Z> = TimelineContext<Z>,
> (_options: TimelineContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:timeline', ...options } = _options
  const [useTimelineContext, _provideTimelineContext] = createContext<E>(namespace)
  const context = createTimeline<Z, E>(options)

  function provideTimelineContext (_context: E = context, app?: App): E {
    return _provideTimelineContext(_context, app)
  }

  return createTrinity<E>(useTimelineContext, provideTimelineContext, context)
}

/**
 * Returns the current timeline instance.
 *
 * @param namespace The namespace for the timeline context. Defaults to `'v0:timeline'`.
 * @returns The current timeline instance.
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-timeline
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useTimeline } from '@vuetify/v0'
 *
 *   const timeline = useTimeline()
 * </script>
 * ```
 */
export function useTimeline<
  Z extends TimelineTicket = TimelineTicket,
  E extends TimelineContext<Z> = TimelineContext<Z>,
> (namespace = 'v0:timeline'): E {
  return useContext<E>(namespace)
}
