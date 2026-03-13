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
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createRegistry } from '#v0/composables/createRegistry'

// Utilities
import { isFunction, useId } from '#v0/utilities'
import { hasInjectionContext } from 'vue'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { App } from 'vue'

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

/**
 * Creates a notifications context triple for dependency injection.
 *
 * @param options Configuration options
 * @returns A readonly tuple: `[useNotifications, provideNotifications, context]`
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
 *
 * @example
 * ```ts
 * import { createNotificationsContext } from '@vuetify/v0'
 *
 * export const [useNotifications, provideNotifications, context] = createNotificationsContext()
 * ```
 */
export function createNotificationsContext<
  Z extends NotificationInput = NotificationInput,
  E extends NotificationTicket<Z> = NotificationTicket<Z>,
  R extends NotificationsContext<Z, E> = NotificationsContext<Z, E>,
> (
  _options: NotificationsPluginOptions = {},
): ContextTrinity<R> {
  const { namespace = 'v0:notifications', ...options } = _options
  const [useNotificationsContext, _provideNotificationsContext] = createContext<R>(namespace)
  const context = createNotifications<Z, E, R>(options)

  function provideNotificationsContext (_context: R = context, app?: App): R {
    return _provideNotificationsContext(_context, app)
  }

  return createTrinity<R>(useNotificationsContext, provideNotificationsContext, context)
}

/**
 * Creates a Vue plugin to provide notifications context at app level.
 *
 * @param options Configuration options including optional adapter
 * @returns Vue plugin instance
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createNotificationsPlugin } from '@vuetify/v0'
 *
 * const app = createApp(App)
 * app.use(createNotificationsPlugin())
 * app.mount('#app')
 * ```
 */
export function createNotificationsPlugin (_options: NotificationsPluginOptions = {}) {
  const { namespace = 'v0:notifications', adapter, ...options } = _options
  const [, provide, context] = createNotificationsContext({ ...options, namespace })

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provide(context, app)
    },
    setup: adapter
      ? (app: App) => {
          adapter.setup({
            notify: context.notify,
            on: context.on,
            off: context.off,
          })

          if (isFunction(adapter.dispose)) {
            app.onUnmount(() => adapter.dispose!())
          }
        }
      : undefined,
  })
}

// Fallback
function noop () {}

function createNotificationsFallback (): NotificationsContext {
  const stub = {} as NotificationTicket

  return {
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
  } as unknown as NotificationsContext
}

/**
 * Returns the current notifications context.
 *
 * @param namespace The namespace for the notifications context. Defaults to `'v0:notifications'`.
 * @returns The notifications context instance
 *
 * @remarks Falls back to a lightweight stub if no provider exists.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useNotifications } from '@vuetify/v0'
 *
 *   const notifications = useNotifications()
 *
 *   notifications.notify({
 *     subject: 'Changes saved',
 *     severity: 'success',
 *   })
 * </script>
 * ```
 */
export function useNotifications<
  Z extends NotificationInput = NotificationInput,
  E extends NotificationTicket<Z> = NotificationTicket<Z>,
  R extends NotificationsContext<Z, E> = NotificationsContext<Z, E>,
> (namespace = 'v0:notifications'): R {
  const fallback = createNotificationsFallback()

  if (!hasInjectionContext()) return fallback as unknown as R

  try {
    return useContext<R>(namespace)
  } catch {
    return fallback as unknown as R
  }
}
