/**
 * @module useNotifications
 * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
 *
 * @remarks
 * Notification management composable built on createRegistry.
 * Manages notification lifecycle with optional service adapters (FCM, OneSignal, Knock).
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
import { useProxyRegistry } from '#v0/composables/useProxyRegistry'

// Utilities
import { isFunction, useId } from '#v0/utilities'
import { hasInjectionContext } from 'vue'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ProxyRegistryContext } from '#v0/composables/useProxyRegistry'
import type { ID } from '#v0/types'
import type { App } from 'vue'

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success'

export interface NotificationInput extends RegistryTicketInput {
  subject?: string
  body?: string
  severity?: NotificationSeverity
  data?: Record<string, unknown>
}

export type NotificationTicket = RegistryTicket & NotificationInput & {
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

export interface NotificationsAdapterContext {
  notify: (input: NotificationInput) => NotificationTicket
  on: (event: string, handler: (data: unknown) => void) => void
  off: (event: string, handler: (data: unknown) => void) => void
}

export interface NotificationsAdapterInterface {
  setup: (context: NotificationsAdapterContext) => void
  dispose?: () => void
}

export interface NotificationsOptions extends RegistryOptions {}

export interface NotificationsContext extends Omit<
  RegistryContext<NotificationTicket>,
  'register' | 'onboard' | 'offboard'
> {
  notify: (input: NotificationInput) => NotificationTicket

  read: (id: ID) => void
  unread: (id: ID) => void
  seen: (id: ID) => void
  archive: (id: ID) => void
  unarchive: (id: ID) => void
  snooze: (id: ID, until: Date) => void
  wake: (id: ID) => void

  readAll: () => void
  archiveAll: () => void

  proxy: ProxyRegistryContext<NotificationTicket>
}

export function createNotifications (
  _options: NotificationsOptions = {},
): NotificationsContext {
  const registry = createRegistry<NotificationTicket>({
    ..._options,
    events: true,
    reactive: true,
  })

  const proxy = useProxyRegistry<NotificationTicket>(registry)

  function notify (input: NotificationInput): NotificationTicket {
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
    } as Partial<NotificationTicket>)

    registry.emit('notification:received', ticket)

    return ticket
  }

  function read (id: ID) {
    registry.upsert(id, { readAt: new Date() }, 'notification:read')
  }

  function unread (id: ID) {
    registry.upsert(id, { readAt: null }, 'notification:unread')
  }

  function seen (id: ID) {
    registry.upsert(id, { seenAt: new Date() }, 'notification:seen')
  }

  function archive (id: ID) {
    registry.upsert(id, { archivedAt: new Date() }, 'notification:archived')
  }

  function unarchive (id: ID) {
    registry.upsert(id, { archivedAt: null }, 'notification:unarchived')
  }

  function snooze (id: ID, until: Date) {
    registry.upsert(id, { snoozedUntil: until }, 'notification:snoozed')
  }

  function wake (id: ID) {
    registry.upsert(id, { snoozedUntil: null }, 'notification:unsnoozed')
  }

  function readAll () {
    const now = new Date()
    registry.batch(() => {
      for (const ticket of registry.values()) {
        if (!ticket.readAt) {
          registry.upsert(ticket.id, { readAt: now }, 'notification:read')
        }
      }
    })
  }

  function archiveAll () {
    const now = new Date()
    registry.batch(() => {
      for (const ticket of registry.values()) {
        if (!ticket.archivedAt) {
          registry.upsert(ticket.id, { archivedAt: now }, 'notification:archived')
        }
      }
    })
  }

  const { register: _, onboard: __, offboard: ___, ...ctx } = registry

  return {
    ...ctx,
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
    proxy,
  } as NotificationsContext
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
export function createNotificationsContext (
  _options: NotificationsPluginOptions = {},
): ContextTrinity<NotificationsContext> {
  const { namespace = 'v0:notifications', ...options } = _options
  const [useContext, _provide] = createContext<NotificationsContext>(namespace)
  const context = createNotifications(options)

  function provide (_context: NotificationsContext = context, app?: App): NotificationsContext {
    return _provide(_context, app)
  }

  return createTrinity<NotificationsContext>(useContext, provide, context)
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
    proxy: { keys: [], values: [], entries: [], size: 0 },
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
export function useNotifications (namespace = 'v0:notifications'): NotificationsContext {
  const fallback = createNotificationsFallback()

  if (!hasInjectionContext()) return fallback

  try {
    return useContext<NotificationsContext>(namespace)
  } catch {
    return fallback
  }
}
