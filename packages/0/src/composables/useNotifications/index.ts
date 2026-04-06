/**
 * @module useNotifications
 * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
 *
 * @remarks
 * Notification management composable built on createRegistry and createQueue.
 * Registry stores the full notification lifecycle (permanent record).
 * Queue manages the display surface (toasts) with FIFO ordering and auto-dismiss.
 *
 * Supports:
 * - Push notifications with severity levels and configurable timeouts
 * - State mutations: read, seen, archived, snoozed
 * - Bulk operations: readAll, archiveAll, clear
 * - Toast queue with pause/resume and auto-dismiss
 * - Adapter integration via event system
 * - Plugin installation via createNotificationsPlugin
 */

// Foundational
import { createPluginContext } from '#v0/composables/createPlugin'
// Composables
import { createQueue } from '#v0/composables/createQueue'
import { createRegistry } from '#v0/composables/createRegistry'

// Utilities
import { isFunction, isNull, isUndefined, useId } from '#v0/utilities'

// Types
import type { QueueContext } from '#v0/composables/createQueue'
import type { RegistryContext, RegistryOptions, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { Extensible, ID } from '#v0/types'

/** Notification urgency level. Maps to ARIA roles: `'error'`/`'warning'` → `role="alert"`, `'info'`/`'success'` → `role="status"`. Extensible — custom values like `'critical'` are allowed with autocomplete for defaults. */
export type NotificationSeverity = Extensible<'info' | 'warning' | 'error' | 'success'>

/** Input shape for creating a notification via {@link send} or {@link register}. */
export interface NotificationInput extends RegistryTicketInput {
  /** Notification headline. */
  subject?: string
  /** Extended message body. */
  body?: string
  /** Urgency level for styling and ARIA role selection. */
  severity?: NotificationSeverity
  /** Arbitrary payload for routing, filtering, or rendering. */
  data?: Record<string, unknown>
  /** Auto-dismiss duration in ms. Overrides the global default. `undefined` uses the global timeout. */
  timeout?: number
}

/**
 * Hydrated notification with lifecycle state and convenience methods.
 * Returned by {@link send}, {@link register}, and {@link onboard}.
 */
export type NotificationTicket<Z extends NotificationInput = NotificationInput> = RegistryTicket & Z & {
  /** When the notification was created. */
  createdAt: Date
  /** When the notification was marked as read, or `null` if unread. */
  readAt: Date | null
  /** When the notification was seen in the viewport, or `null` if unseen. */
  seenAt: Date | null
  /** When the notification was archived, or `null` if active. */
  archivedAt: Date | null
  /** Snooze expiry, or `null` if not snoozed. */
  snoozedUntil: Date | null
  /** Mark as read. Sets `readAt` to now. */
  read: () => void
  /** Mark as unread. Clears `readAt`. */
  unread: () => void
  /** Mark as seen. Sets `seenAt` to now. */
  seen: () => void
  /** Archive. Sets `archivedAt` to now. */
  archive: () => void
  /** Restore from archive. Clears `archivedAt`. */
  unarchive: () => void
  /** Snooze until the given time. */
  snooze: (until: Date) => void
  /** Cancel snooze. Clears `snoozedUntil`. */
  wake: () => void
  /** Remove from the display queue only. Registry entry is preserved for inbox/history. Use `ticket.unregister()` for full removal. */
  dismiss: () => void
}

/**
 * Context passed to adapter `setup()`. Provides methods for inbound
 * notification creation and event subscription for outbound sync.
 */
export interface NotificationsAdapterContext<
  Z extends NotificationInput = NotificationInput,
  E extends NotificationTicket<Z> = NotificationTicket<Z>,
> {
  /** Create a notification and enqueue for toast display. Use for real-time inbound items. */
  send: (input: Z) => E
  /** Create a notification in registry only (no toast). Use for initial/historical items. */
  register: (input: Z) => E
  /** Subscribe to notification lifecycle events (e.g., `'notification:read'`). */
  on: (event: string, handler: (data: unknown) => void) => void
  /** Unsubscribe from a lifecycle event. */
  off: (event: string, handler: (data: unknown) => void) => void
}

/**
 * Adapter interface for bridging external notification services.
 * Adapters receive an {@link NotificationsAdapterContext} on setup
 * and optionally clean up on dispose.
 */
export interface NotificationsAdapterInterface<
  Z extends NotificationInput = NotificationInput,
  E extends NotificationTicket<Z> = NotificationTicket<Z>,
> {
  /** Called once when the plugin installs. Wire inbound/outbound sync here. */
  setup: (context: NotificationsAdapterContext<Z, E>) => void
  /** Called on app unmount. Tear down listeners and connections. */
  dispose?: () => void
}

/** Options for {@link createNotifications}. */
export interface NotificationsOptions extends RegistryOptions {
  /** Default auto-dismiss timeout in ms for the toast queue. @default 3000 */
  timeout?: number
}

/** Full notification context returned by {@link createNotifications} and {@link useNotifications}. */
export interface NotificationsContext<
  Z extends NotificationInput = NotificationInput,
  E extends NotificationTicket<Z> = NotificationTicket<Z>,
> extends RegistryContext<E> {
  /** Create a notification and enqueue for toast display. */
  send: (input: Z) => E
  /** The toast display queue. Access `queue.values()`, `queue.pause()`, `queue.resume()`. */
  queue: QueueContext

  /** Mark as read. Emits `notification:read`. */
  read: (id: ID) => void
  /** Mark as unread. Emits `notification:unread`. */
  unread: (id: ID) => void
  /** Mark as seen. Emits `notification:seen`. */
  seen: (id: ID) => void
  /** Archive. Emits `notification:archived`. */
  archive: (id: ID) => void
  /** Restore from archive. Emits `notification:unarchived`. */
  unarchive: (id: ID) => void
  /** Snooze until the given time. Emits `notification:snoozed`. */
  snooze: (id: ID, until: Date) => void
  /** Cancel snooze. Emits `notification:unsnoozed`. */
  wake: (id: ID) => void

  /** Mark all unread notifications as read. */
  readAll: () => void
  /** Archive all unarchived notifications. */
  archiveAll: () => void
}

export function createNotifications (
  options: NotificationsOptions = {},
): NotificationsContext {
  const { timeout = 3000, ...registryOptions } = options

  const registry = createRegistry<NotificationTicket>({
    ...registryOptions,
    events: true,
    reactive: true,
  })

  const queue = createQueue({
    timeout,
    events: true,
    reactive: true,
  })

  // When a ticket is removed from registry, also remove from queue
  registry.on('unregister:ticket', (ticket: NotificationTicket) => {
    if (queue.has(ticket.id)) {
      queue.unregister(ticket.id)
    }
  })

  /**
   * Build a full {@link NotificationTicket} from raw input
   *
   * @param input The notification input to hydrate.
   * @returns A partial ticket with timestamps, lifecycle methods, and an ID.
   * @internal Used by {@link send}, {@link register}, and {@link onboard}.
   */
  function hydrate (input: NotificationInput): Partial<NotificationTicket> {
    const id = input.id ?? useId()
    const now = new Date()

    return {
      ...input,
      id,
      createdAt: now,
      readAt: null,
      seenAt: null,
      archivedAt: null,
      snoozedUntil: null,
      read: () => read(id),
      unread: () => unread(id),
      seen: () => seen(id),
      archive: () => archive(id),
      unarchive: () => unarchive(id),
      snooze: (until: Date) => snooze(id, until),
      wake: () => wake(id),
      dismiss: () => queue.unregister(id),
    } as unknown as Partial<NotificationTicket>
  }

  /**
   * Create a notification and enqueue it for toast display
   *
   * @param input The notification input to create.
   * @returns The hydrated notification ticket.
   * @remarks Hydrates the input with timestamps and lifecycle methods, registers
   * it in the registry, adds it to the display queue, and emits
   * `notification:received`. The ticket auto-dismisses after the configured
   * timeout unless paused.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
   *
   * @example
   * ```ts
   * import { useNotifications } from '@vuetify/v0'
   *
   * const notifications = useNotifications()
   *
   * // Basic toast
   * notifications.send({ subject: 'Changes saved', severity: 'success' })
   *
   * // With custom timeout
   * const ticket = notifications.send({ subject: 'Connection lost', severity: 'error', timeout: 10000 })
   *
   * console.log(ticket.id)        // 'generated-id'
   * console.log(ticket.createdAt) // Date
   * console.log(ticket.readAt)    // null
   *
   * // Ticket convenience methods
   * ticket.read()    // marks as read
   * ticket.dismiss() // removes from toast queue, keeps in registry
   * ```
   */
  function send (input: NotificationInput): NotificationTicket {
    const ticket = registry.register(hydrate(input))

    queue.register(isUndefined(input.timeout) ? { id: ticket.id } : { id: ticket.id, timeout: input.timeout })

    registry.emit('notification:received', ticket)

    return ticket
  }

  /**
   * Register a notification in the registry without adding it to the toast queue
   *
   * @param input The notification input to register.
   * @returns The hydrated notification ticket.
   * @remarks Overrides the base registry `register` to hydrate the input with
   * timestamps and lifecycle methods. Use for historical or pre-existing items
   * that should appear in an inbox but not pop up as toasts.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
   *
   * @example
   * ```ts
   * import { useNotifications } from '@vuetify/v0'
   *
   * const notifications = useNotifications()
   *
   * // Register a historical item (appears in inbox, not as toast)
   * const ticket = notifications.register({ id: 'old-1', subject: 'Deployed v2.1' })
   *
   * console.log(ticket.createdAt) // Date
   * console.log(ticket.readAt)    // null
   *
   * // Lifecycle methods work the same as send()
   * ticket.read()
   * ticket.archive()
   * ```
   */
  function register (input: NotificationInput): NotificationTicket {
    return registry.register(hydrate(input))
  }

  /**
   * Bulk version of {@link register}
   *
   * @param inputs Array of notification inputs to register.
   * @returns Array of hydrated notification tickets.
   * @remarks Registers multiple notifications into the registry without toast
   * display. Wraps all registrations in a single `registry.batch()` call so
   * reactive updates are deferred until the entire batch completes.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
   *
   * @example
   * ```ts
   * import { useNotifications } from '@vuetify/v0'
   *
   * const notifications = useNotifications()
   *
   * // Load historical items on mount
   * const tickets = notifications.onboard([
   *   { id: 'n1', subject: 'Welcome to the team' },
   *   { id: 'n2', subject: 'Setup complete', severity: 'success' },
   * ])
   *
   * console.log(tickets.length)              // 2
   * console.log(notifications.queue.values()) // [] (no toasts)
   * console.log(notifications.values().length) // 2 (in registry)
   * ```
   */
  function onboard (inputs: NotificationInput[]): NotificationTicket[] {
    return registry.batch(() => inputs.map(input => register(input)))
  }

  /**
   * Mark a notification as read
   *
   * @param id The ID of the notification to mark as read.
   * @remarks Sets `readAt` to the current time and emits `notification:read`.
   * Adapters listen to this event for outbound sync.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
   *
   * @example
   * ```ts
   * import { useNotifications } from '@vuetify/v0'
   *
   * const notifications = useNotifications()
   *
   * const ticket = notifications.send({ subject: 'New message' })
   *
   * notifications.read(ticket.id)
   * console.log(ticket.readAt) // Date
   *
   * // Or via ticket convenience method
   * ticket.read()
   * ```
   */
  function read (id: ID) {
    registry.upsert(id, { readAt: new Date() } as Partial<NotificationTicket>, 'notification:read')
  }

  /**
   * Mark a notification as unread
   *
   * @param id The ID of the notification to mark as unread.
   * @remarks Clears `readAt` and emits `notification:unread`.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
   *
   * @example
   * ```ts
   * import { useNotifications } from '@vuetify/v0'
   *
   * const notifications = useNotifications()
   *
   * notifications.unread('notif-1')
   * ```
   */
  function unread (id: ID) {
    registry.upsert(id, { readAt: null } as Partial<NotificationTicket>, 'notification:unread')
  }

  /**
   * Mark a notification as seen
   *
   * @param id The ID of the notification to mark as seen.
   * @remarks Sets `seenAt` to the current time and emits `notification:seen`.
   * Distinct from read — seen tracks whether the notification appeared in the
   * user's viewport, while read indicates the user actively engaged with it.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
   *
   * @example
   * ```ts
   * import { useNotifications } from '@vuetify/v0'
   *
   * const notifications = useNotifications()
   *
   * // Mark as seen when visible in inbox viewport
   * notifications.seen('notif-1')
   * ```
   */
  function seen (id: ID) {
    registry.upsert(id, { seenAt: new Date() } as Partial<NotificationTicket>, 'notification:seen')
  }

  /**
   * Archive a notification
   *
   * @param id The ID of the notification to archive.
   * @remarks Sets `archivedAt` to the current time and emits `notification:archived`.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
   *
   * @example
   * ```ts
   * import { useNotifications } from '@vuetify/v0'
   *
   * const notifications = useNotifications()
   *
   * notifications.archive('notif-1')
   * ```
   */
  function archive (id: ID) {
    registry.upsert(id, { archivedAt: new Date() } as Partial<NotificationTicket>, 'notification:archived')
  }

  /**
   * Restore an archived notification
   *
   * @param id The ID of the notification to unarchive.
   * @remarks Clears `archivedAt` and emits `notification:unarchived`.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
   *
   * @example
   * ```ts
   * import { useNotifications } from '@vuetify/v0'
   *
   * const notifications = useNotifications()
   *
   * notifications.unarchive('notif-1')
   * ```
   */
  function unarchive (id: ID) {
    registry.upsert(id, { archivedAt: null } as Partial<NotificationTicket>, 'notification:unarchived')
  }

  /**
   * Snooze a notification until a given time
   *
   * @param id The ID of the notification to snooze.
   * @param until The time at which the snooze expires.
   * @remarks Sets `snoozedUntil` and emits `notification:snoozed`. The composable
   * does not auto-wake — consumers are responsible for calling {@link wake} when
   * the snooze expires (e.g., via a timer or server push).
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
   *
   * @example
   * ```ts
   * import { useNotifications } from '@vuetify/v0'
   *
   * const notifications = useNotifications()
   *
   * const tomorrow = new Date(Date.now() + 86_400_000)
   * notifications.snooze('notif-1', tomorrow)
   * ```
   */
  function snooze (id: ID, until: Date) {
    registry.upsert(id, { snoozedUntil: until } as Partial<NotificationTicket>, 'notification:snoozed')
  }

  /**
   * Cancel a snooze
   *
   * @param id The ID of the notification to wake.
   * @remarks Clears `snoozedUntil` and emits `notification:unsnoozed`.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
   *
   * @example
   * ```ts
   * import { useNotifications } from '@vuetify/v0'
   *
   * const notifications = useNotifications()
   *
   * notifications.wake('notif-1')
   * ```
   */
  function wake (id: ID) {
    registry.upsert(id, { snoozedUntil: null } as Partial<NotificationTicket>, 'notification:unsnoozed')
  }

  /**
   * Mark all unread notifications as read
   *
   * @remarks Iterates all notifications and marks unread ones as read in a single
   * batch. Skips already-read notifications to preserve their original `readAt`
   * timestamp. Emits `notification:read` for each affected notification.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
   *
   * @example
   * ```ts
   * import { useNotifications } from '@vuetify/v0'
   *
   * const notifications = useNotifications()
   *
   * notifications.send({ subject: 'Message 1' })
   * notifications.send({ subject: 'Message 2' })
   *
   * notifications.readAll()
   *
   * console.log(notifications.values().every(t => t.readAt !== null)) // true
   * ```
   */
  function readAll () {
    const now = new Date()
    registry.batch(() => {
      for (const ticket of registry.values()) {
        if (isNull(ticket.readAt)) {
          registry.upsert(ticket.id, { readAt: now } as Partial<NotificationTicket>, 'notification:read')
        }
      }
    })
  }

  /**
   * Archive all unarchived notifications
   *
   * @remarks Iterates all notifications and archives unarchived ones in a single
   * batch. Skips already-archived notifications to preserve their original
   * `archivedAt` timestamp. Emits `notification:archived` for each affected notification.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
   *
   * @example
   * ```ts
   * import { useNotifications } from '@vuetify/v0'
   *
   * const notifications = useNotifications()
   *
   * notifications.send({ subject: 'Alert 1' })
   * notifications.send({ subject: 'Alert 2' })
   *
   * notifications.archiveAll()
   *
   * console.log(notifications.values().every(t => t.archivedAt !== null)) // true
   * ```
   */
  function archiveAll () {
    const now = new Date()
    registry.batch(() => {
      for (const ticket of registry.values()) {
        if (isNull(ticket.archivedAt)) {
          registry.upsert(ticket.id, { archivedAt: now } as Partial<NotificationTicket>, 'notification:archived')
        }
      }
    })
  }

  return {
    ...registry,
    send,
    register,
    onboard,
    queue,
    read,
    unread,
    seen,
    archive,
    unarchive,
    snooze,
    wake,
    readAll,
    archiveAll,
    get size () {
      return registry.size
    },
  } as unknown as NotificationsContext
}

export interface NotificationsPluginOptions extends NotificationsOptions {
  namespace?: string
  adapter?: NotificationsAdapterInterface
}

// Fallback
function noop () {}
const EMPTY: readonly never[] = []

function createNotificationsFallback (): NotificationsContext {
  const stub = {
    id: '',
    index: 0,
    value: 0,
    valueIsIndex: true,
    createdAt: new Date(0),
    readAt: null,
    seenAt: null,
    archivedAt: null,
    snoozedUntil: null,
    read: noop,
    unread: noop,
    seen: noop,
    archive: noop,
    unarchive: noop,
    snooze: noop,
    wake: noop,
    dismiss: noop,
    unregister: noop,
  } as unknown as NotificationTicket

  return {
    collection: new Map(),
    size: 0,
    send: () => stub,
    queue: {
      collection: new Map(),
      size: 0,
      register: () => ({}) as never,
      unregister: () => undefined,
      has: () => false,
      get: () => undefined,
      keys: () => EMPTY,
      values: () => EMPTY,
      entries: () => EMPTY,
      browse: () => undefined,
      lookup: () => undefined,
      upsert: () => ({}) as never,
      seek: () => undefined,
      move: () => undefined,
      on: noop,
      off: noop,
      emit: noop,
      dispose: noop,
      clear: noop,
      reindex: noop,
      batch: <R>(fn: () => R): R => fn(),
      onboard: () => EMPTY,
      offboard: noop,
      pause: () => undefined,
      resume: () => undefined,
    } as unknown as QueueContext,
    read: noop,
    unread: noop,
    seen: noop,
    archive: noop,
    unarchive: noop,
    snooze: noop,
    wake: noop,
    readAll: noop,
    archiveAll: noop,
    clear: noop,
    has: () => false,
    get: () => undefined,
    keys: () => EMPTY,
    values: () => EMPTY,
    entries: () => EMPTY,
    browse: () => undefined,
    lookup: () => undefined,
    upsert: () => stub,
    register: () => stub,
    unregister: noop,
    reindex: noop,
    move: () => undefined,
    seek: () => undefined,
    on: noop,
    off: noop,
    emit: noop,
    dispose: noop,
    batch: <R>(fn: () => R): R => fn(),
    onboard: () => EMPTY,
    offboard: noop,
  } as unknown as NotificationsContext
}

/**
 * Notification management with registry, event system, and optional adapters.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
 *
 * @example
 * ```ts
 * import { createNotificationsPlugin, useNotifications } from '@vuetify/v0'
 *
 * // Install as plugin
 * app.use(createNotificationsPlugin())
 *
 * // Use in components
 * const notifications = useNotifications()
 * notifications.send({ subject: 'Saved', severity: 'success' })
 * ```
 */
export const [createNotificationsContext, createNotificationsPlugin, useNotifications] =
  createPluginContext<NotificationsPluginOptions, NotificationsContext>(
    'v0:notifications',
    options => createNotifications(options),
    {
      fallback: () => createNotificationsFallback(),
      setup: (context, app, options) => {
        app.onUnmount(() => {
          context.dispose()
          context.queue.dispose()
        })

        const { adapter } = options
        if (!adapter) return

        adapter.setup({
          send: context.send,
          register: context.register,
          on: context.on,
          off: context.off,
        })

        if (isFunction(adapter.dispose)) {
          app.onUnmount(() => adapter.dispose!())
        }
      },
    },
  )
