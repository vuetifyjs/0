/**
 * @module useNotifications
 * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
 *
 * @remarks
 * Notification management composable built on createRegistry.
 * Manages notification lifecycle with optional service adapters (Knock).
 *
 * Supports:
 * - Push notifications with severity levels
 * - State mutations: read, seen, archived, snoozed
 * - Bulk operations: readAll, archiveAll, clear
 * - Adapter integration via event system
 * - Plugin installation via createNotificationsPlugin
 */

// Foundational
import { createPluginContext } from '#v0/composables/createPlugin'

// Composables
import { createRegistry } from '#v0/composables/createRegistry'

// Utilities
import { isFunction, useId } from '#v0/utilities'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { ID } from '#v0/types'

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success'

export interface NotificationInput extends RegistryTicketInput {
  subject?: string
  body?: string
  severity?: NotificationSeverity
  data?: Record<string, unknown>
}

export type NotificationTicket<Z extends NotificationInput = NotificationInput> = RegistryTicket & Z & {
  createdAt: Date
  readAt: Date | null
  seenAt: Date | null
  archivedAt: Date | null
  snoozedUntil: Date | null
  read: () => void
  unread: () => void
  seen: () => void
  archive: () => void
  unarchive: () => void
  snooze: (until: Date) => void
  wake: () => void
  dismiss: () => void
}

export interface NotificationsAdapterContext<
  Z extends NotificationInput = NotificationInput,
  E extends NotificationTicket<Z> = NotificationTicket<Z>,
> {
  notify: (input: Z) => E
  on: (event: string, handler: (data: unknown) => void) => void
  off: (event: string, handler: (data: unknown) => void) => void
}

export interface NotificationsAdapterInterface<
  Z extends NotificationInput = NotificationInput,
  E extends NotificationTicket<Z> = NotificationTicket<Z>,
> {
  setup: (context: NotificationsAdapterContext<Z, E>) => void
  dispose?: () => void
}

export interface NotificationsOptions extends RegistryOptions {}

export interface NotificationsContext<
  Z extends NotificationInput = NotificationInput,
  E extends NotificationTicket<Z> = NotificationTicket<Z>,
> extends RegistryContext<E> {
  notify: (input: Z) => E

  read: (id: ID) => void
  unread: (id: ID) => void
  seen: (id: ID) => void
  archive: (id: ID) => void
  unarchive: (id: ID) => void
  snooze: (id: ID, until: Date) => void
  wake: (id: ID) => void

  readAll: () => void
  archiveAll: () => void
}

export function createNotifications<
  Z extends NotificationInput = NotificationInput,
  E extends NotificationTicket<Z> = NotificationTicket<Z>,
  R extends NotificationsContext<Z, E> = NotificationsContext<Z, E>,
> (
  options: NotificationsOptions = {},
): R {
  const registry = createRegistry<E>({
    ...options,
    events: true,
    reactive: true,
  })

  function notify (input: Z): E {
    const id = input.id ?? useId()
    const now = new Date()

    const ticket = registry.register({
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
      dismiss: () => registry.unregister(id),
    } as unknown as Partial<E>)

    registry.emit('notification:received', ticket)

    return ticket
  }

  function read (id: ID) {
    registry.upsert(id, { readAt: new Date() } as Partial<E>, 'notification:read')
  }

  function unread (id: ID) {
    registry.upsert(id, { readAt: null } as Partial<E>, 'notification:unread')
  }

  function seen (id: ID) {
    registry.upsert(id, { seenAt: new Date() } as Partial<E>, 'notification:seen')
  }

  function archive (id: ID) {
    registry.upsert(id, { archivedAt: new Date() } as Partial<E>, 'notification:archived')
  }

  function unarchive (id: ID) {
    registry.upsert(id, { archivedAt: null } as Partial<E>, 'notification:unarchived')
  }

  function snooze (id: ID, until: Date) {
    registry.upsert(id, { snoozedUntil: until } as Partial<E>, 'notification:snoozed')
  }

  function wake (id: ID) {
    registry.upsert(id, { snoozedUntil: null } as Partial<E>, 'notification:unsnoozed')
  }

  function readAll () {
    const now = new Date()
    registry.batch(() => {
      for (const ticket of registry.values()) {
        if (!ticket.readAt) {
          registry.upsert(ticket.id, { readAt: now } as Partial<E>, 'notification:read')
        }
      }
    })
  }

  function archiveAll () {
    const now = new Date()
    registry.batch(() => {
      for (const ticket of registry.values()) {
        if (!ticket.archivedAt) {
          registry.upsert(ticket.id, { archivedAt: now } as Partial<E>, 'notification:archived')
        }
      }
    })
  }

  return {
    ...registry,
    notify,
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
  } as R
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
  } as unknown as NotificationTicket

  return {
    collection: new Map(),
    size: 0,
    notify: () => stub,
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
    batch: (fn: () => unknown) => fn(),
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
 * notifications.notify({ subject: 'Saved', severity: 'success' })
 * ```
 */
export const [createNotificationsContext, createNotificationsPlugin, useNotifications] =
  createPluginContext<NotificationsPluginOptions, NotificationsContext>(
    'v0:notifications',
    options => createNotifications(options),
    {
      fallback: () => createNotificationsFallback(),
      setup: (context, app, options) => {
        const { adapter } = options
        if (!adapter) return

        adapter.setup({
          notify: context.notify,
          on: context.on,
          off: context.off,
        })

        if (isFunction(adapter.dispose)) {
          app.onUnmount(() => adapter.dispose!())
        }
      },
    },
  )
