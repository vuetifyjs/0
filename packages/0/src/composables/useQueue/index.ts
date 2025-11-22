/**
 * @module useQueue
 *
 * @remarks
 * A queue composable for managing time-based collections with:
 * - Automatic timeout-based removal
 * - Pause/resume functionality
 * - FIFO (First In, First Out) ordering
 * - Manual dismissal support
 * - Queue progression management
 *
 * Built on top of useRegistry, the queue automatically manages timeouts for tickets,
 * ensuring only the first ticket in the queue is active at any time. When an ticket
 * expires or is removed, the next ticket in the queue automatically becomes active.
 */

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Utilities
import { onScopeDispose } from 'vue'
import { genId } from '#v0/utilities'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { App } from 'vue'

export interface QueueTicket extends RegistryTicket {
  /**
   * Timeout in milliseconds
   *
   * @remarks
   * - If `undefined`: Uses the default timeout from queue options (default: 3000ms)
   * - If `-1`: Ticket persists indefinitely until manually dismissed
   * - If a number: Ticket will be automatically removed after the specified milliseconds
   */
  timeout?: number
  /**
   * Whether the timeout is currently paused
   *
   * @remarks
   * - Set to `true` when the ticket is not the first in the queue or when manually paused
   * - When `true`, the timeout does not progress
   * - Automatically managed by the queue system
   */
  isPaused: boolean
  /**
   * Convenience method to dismiss this ticket from the queue
   *
   * @remarks
   * Equivalent to calling `queue.unregister(ticket.id)`
   */
  dismiss: () => void
}

export interface QueueContext<Z extends QueueTicket = QueueTicket> extends RegistryContext<Z> {
  /**
   * Register a new ticket in the queue
   *
   * @param ticket The partial ticket data to register
   * @remarks
   * - If no ID is provided, a unique ID will be generated automatically
   * - If no timeout is provided, uses the default timeout from queue options (3000ms)
   * - First ticket in queue starts its timeout immediately
   * - Subsequent tickets are paused until they become first in queue
   * - Each ticket receives a `dismiss()` method for convenience
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-queue#register
   *
   * @example
   * ```ts
   * import { useQueue } from '@vuetify/v0'
   *
   * const queue = useQueue()
   *
   * // Register with default timeout (3000ms)
   * const ticket1 = queue.register({ value: 'First' })
   *
   * // Register with custom timeout
   * const ticket2 = queue.register({ value: 'Second', timeout: 5000 })
   *
   * // Register persistent ticket (must be manually dismissed)
   * const ticket3 = queue.register({ value: 'Persistent', timeout: -1 })
   * ```
   */
  register: (ticket?: Partial<Z>) => Z
  /**
   * Unregister a ticket from the queue
   *
   * @param id The ID of the ticket to unregister. If not provided, the first ticket in the queue will be unregistered.
   * @remarks
   * - Removes the ticket from the queue and clears its timeout
   * - If the removed ticket was first in queue, automatically resumes the next ticket
   * - Returns the unregistered ticket or `undefined` if not found
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-queue#unregister
   *
   * @example
   * ```ts
   * import { useQueue } from '@vuetify/v0'
   *
   * const queue = useQueue()
   *
   * const ticket1 = queue.register({ value: 'First' })
   * const ticket2 = queue.register({ value: 'Second' })
   *
   * // Unregister specific ticket
   * queue.unregister(ticket2.id)
   *
   * // Unregister first ticket in queue
   * const removed = queue.unregister()
   * console.log(removed?.value) // 'First'
   * ```
   */
  unregister: (id?: ID) => Z | undefined
  /**
   * Pause the timeout of the first ticket in the queue
   *
   * @remarks
   * - Pauses the timeout for the first ticket if it exists and is not already paused
   * - Returns the paused ticket or `undefined` if no pausable ticket exists
   * - The timeout will not progress while paused
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-queue#pause
   *
   * @example
   * ```ts
   * import { useQueue } from '@vuetify/v0'
   *
   * const queue = useQueue({ timeout: 5000 })
   *
   * const ticket = queue.register({ value: 'Pausable ticket' })
   *
   * // Pause the first ticket's timeout
   * const paused = queue.pause()
   *
   * console.log(paused?.isPaused) // true
   * ```
   */
  pause: () => Z | undefined
  /**
   * Resume the timeout of the first paused ticket in the queue
   *
   * @remarks
   * - Resumes the timeout for the first ticket if it exists, is at index 0, and is currently paused
   * - Returns the resumed ticket or `undefined` if no resumable ticket exists
   * - The timeout will continue from its full duration (not from where it was paused)
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-queue#resume
   *
   * @example
   * ```ts
   * import { useQueue } from '@vuetify/v0'
   *
   * const queue = useQueue({ timeout: 5000 })
   *
   * const ticket = queue.register({ value: 'Ticket' })
   * queue.pause()
   *
   * // Later, resume the paused ticket
   * const resumed = queue.resume()
   *
   * console.log(resumed?.isPaused) // false
   * ```
   */
  resume: () => Z | undefined
  /**
   * Clear the entire queue
   *
   * @remarks
   * - Removes all tickets from the queue
   * - Clears all active timeouts
   * - Resets the queue to an empty state
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-queue#clear
   *
   * @example
   * ```ts
   * import { useQueue } from '@vuetify/v0'
   *
   * const queue = useQueue()
   *
   * queue.register({ value: 'First' })
   * queue.register({ value: 'Second' })
   *
   * console.log(queue.size) // 2
   *
   * queue.clear()
   *
   * console.log(queue.size) // 0
   * ```
   */
  clear: () => void
  /**
   * Dispose of the queue and clean up resources
   *
   * @remarks
   * - Clears all tickets and timeouts
   * - Removes all event listeners
   * - Should be called when the queue is no longer needed
   * - Automatically called on scope disposal
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-queue#dispose
   *
   * @example
   * ```ts
   * import { onScopeDispose } from 'vue'
   * import { useQueue } from '@vuetify/v0'
   *
   * const queue = useQueue()
   *
   * queue.register({ value: 'Ticket' })
   *
   * onScopeDispose(() => {
   *   queue.dispose()
   * })
   * ```
   */
  dispose: () => void
}

export interface QueueOptions extends RegistryOptions {
  /**
   * Default timeout in milliseconds for tickets without explicit timeout
   *
   * @default 3000
   * @remarks
   * - Applied to tickets that don't specify their own timeout
   * - Can be overridden per ticket during registration
   */
  timeout?: number
}

export interface QueueContextOptions extends QueueOptions {
  namespace: string
}

/**
 * Creates a new queue instance
 *
 * @param options The options for the queue instance
 * @template Z The type of queue ticket that extends QueueTicket. Use this to add custom properties to tickets.
 * @template E The type of queue context that extends QueueContext<Z>. Use this when extending the queue with additional methods.
 * @returns A new queue instance
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-queue
 *
 * @example
 * ```ts
 * import { useQueue } from '@vuetify/v0'
 *
 * const queue = useQueue()
 *
 * // Register an ticket with default timeout (3000ms)
 * const ticket1 = queue.register({ value: 'Ticket 1' })
 *
 * // Register an ticket with custom timeout
 * const ticket2 = queue.register({ value: 'Ticket 2', timeout: 5000 })
 *
 * // Register a persistent ticket that must be manually dismissed
 * const ticket3 = queue.register({ value: 'Ticket 3', timeout: -1 })
 *
 * // Dismiss an ticket using the convenience method
 * ticket3.dismiss()
 *
 * console.log(queue.size) // 2
 * ```
 */
export function createQueue<
  Z extends QueueTicket = QueueTicket,
  E extends QueueContext<Z> = QueueContext<Z>,
> (_options: QueueOptions = {}): E {
  const { timeout: _timeout = 3000, ...options } = _options
  const registry = useRegistry<Z, E>({ ...options, events: true })
  const timeouts = new Map<ID, ReturnType<typeof setTimeout>>()

  function startTimeout (ticket: Z) {
    if (ticket.timeout === undefined || ticket.timeout === -1 || ticket.isPaused) return

    const timeout = setTimeout(() => {
      timeouts.delete(ticket.id)
      registry.unregister(ticket.id)

      resume()
    }, ticket.timeout)

    timeouts.set(ticket.id, timeout)
  }

  function clearTimeout (id: ID) {
    const timeout = timeouts.get(id)
    if (timeout) {
      globalThis.clearTimeout(timeout)
      timeouts.delete(id)
    }
  }

  function register (registration: Partial<Z> = {}): Z {
    const id = registration.id ?? genId()
    const hasExplicitTimeout = Object.prototype.hasOwnProperty.call(registration, 'timeout')
    const timeout = hasExplicitTimeout ? registration.timeout : _timeout

    const ticket: Partial<Z> = {
      ...registration,
      id,
      timeout,
      isPaused: registry.size > 0,
      dismiss: () => unregister(id),
    }

    const registered = registry.register(ticket)

    startTimeout(registered)

    return registered
  }

  function unregister (id?: ID): Z | undefined {
    const ticket = id === undefined ? registry.seek('first') : registry.get(id)
    if (!ticket) return undefined

    const wasFirst = ticket.index === 0

    clearTimeout(ticket.id)
    registry.unregister(ticket.id)

    if (wasFirst) resume()

    return ticket
  }

  function offboard (ids: ID[]) {
    let hadFirst = false

    for (const id of ids) {
      const ticket = registry.get(id)
      if (!ticket) continue

      if (ticket.index === 0) hadFirst = true
      clearTimeout(ticket.id)
    }

    registry.offboard(ids)

    if (hadFirst) resume()
  }

  function pause (): Z | undefined {
    const ticket = registry.seek('first')
    if (!ticket || ticket.isPaused) return undefined

    clearTimeout(ticket.id)
    registry.upsert(ticket.id, { isPaused: true } as Partial<Z>)

    return ticket
  }

  function resume (): Z | undefined {
    const ticket = registry.seek('first')
    if (!ticket || ticket.index !== 0 || !ticket.isPaused) return undefined

    registry.upsert(ticket.id, { isPaused: false } as Partial<Z>)

    startTimeout(ticket)

    return ticket
  }

  function clear () {
    for (const id of timeouts.keys()) clearTimeout(id)
    registry.clear()
  }

  function dispose () {
    clear()
    registry.dispose()
  }

  onScopeDispose(dispose, true)

  return {
    ...registry,
    register,
    unregister,
    offboard,
    pause,
    resume,
    clear,
    dispose,
    get size () {
      return registry.size
    },
  } as E
}

/**
 * Creates a new queue context.
 *
 * @param namespace The namespace for the queue context.
 * @param options The options for the queue context.
 * @template Z The type of the queue ticket.
 * @template E The type of the queue context.
 * @returns A new queue context.
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-queue
 *
 * @example
 * ```ts
 * import { createQueueContext } from '@vuetify/v0'
 *
 * export const [useQueue, provideQueue] = createQueueContext('v0:queue', {
 *   timeout: 5000,
 * })
 * ```
 */
export function createQueueContext<
  Z extends QueueTicket = QueueTicket,
  E extends QueueContext<Z> = QueueContext<Z>,
> (_options: QueueContextOptions): ContextTrinity<E> {
  const { namespace, ...options } = _options
  const [useQueueContext, _provideQueueContext] = createContext<E>(namespace)
  const context = createQueue<Z, E>(options)

  function provideQueueContext (_context: E = context, app?: App): E {
    return _provideQueueContext(_context, app)
  }

  return createTrinity<E>(useQueueContext, provideQueueContext, context)
}

/**
 * Returns the current queue instance.
 *
 * @param namespace The namespace for the queue context. Defaults to `'v0:queue'`.
 * @returns The current queue instance.
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-queue
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useQueue } from '@vuetify/v0'
 *
 *   const queue = useQueue()
 * </script>
 * ```
 */
export function useQueue<
  Z extends QueueTicket = QueueTicket,
  E extends QueueContext<Z> = QueueContext<Z>,
> (namespace = 'v0:queue'): E {
  return useContext<E>(namespace)
}
