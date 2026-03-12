/**
 * @module useNotifications
 * @see https://0.vuetifyjs.com/composables/plugins/use-notifications
 *
 * @remarks
 * Notification management composable built on createQueue.
 * Manages notification lifecycle with optional service adapters (FCM, OneSignal, Knock).
 *
 * Supports:
 * - Push notifications with severity and timeout
 * - State mutations: read, seen, archived, snoozed
 * - Bulk operations: readAll, archiveAll, clear
 * - Adapter integration via event system
 * - Plugin installation via createPluginContext
 */

// Foundational
import { createPluginContext } from '#v0/composables/createPlugin'

// Composables
import { createQueue } from '#v0/composables/createQueue'
import { useProxyRegistry } from '#v0/composables/useProxyRegistry'

// Utilities
import { isFunction, useId } from '#v0/utilities'
import { computed } from 'vue'

// Types
import type { QueueContext, QueueOptions, QueueTicket, QueueTicketInput } from '#v0/composables/createQueue'
import type { ProxyRegistryContext } from '#v0/composables/useProxyRegistry'
import type { ID } from '#v0/types'
import type { ComputedRef } from 'vue'

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success'

export interface NotificationInput extends QueueTicketInput {
  subject?: string
  body?: string
  severity?: NotificationSeverity
  data?: Record<string, unknown>
}

export interface NotificationTicket extends QueueTicket<NotificationInput> {
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

export interface NotificationsOptions extends QueueOptions {}

export interface NotificationsContext extends Omit<
  QueueContext<NotificationInput, NotificationTicket>,
  'register' | 'onboard'
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
  unreadItems: ComputedRef<NotificationTicket[]>
  archivedItems: ComputedRef<NotificationTicket[]>
  snoozedItems: ComputedRef<NotificationTicket[]>
}

export function createNotifications (
  _options: NotificationsOptions = {},
): NotificationsContext {
  const { timeout = -1, ...options } = _options
  const queue = createQueue<NotificationInput, NotificationTicket>({
    ...options,
    timeout,
    events: true,
  })

  const proxy = useProxyRegistry<NotificationTicket>(queue)

  // Push
  function notify (input: NotificationInput): NotificationTicket {
    const id = input.id ?? useId()
    const now = new Date()

    const ticket = queue.register({
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
    } as Partial<NotificationTicket>)

    queue.emit('notification:received', ticket)

    return ticket
  }

  function mutate (id: ID, patch: Partial<NotificationTicket>, event: string) {
    const ticket = queue.get(id)
    if (!ticket) return

    queue.upsert(id, patch)
    queue.emit(event, id)
  }

  function read (id: ID) {
    mutate(id, { readAt: new Date() }, 'notification:read')
  }

  function unread (id: ID) {
    mutate(id, { readAt: null }, 'notification:unread')
  }

  function seen (id: ID) {
    mutate(id, { seenAt: new Date() }, 'notification:seen')
  }

  function archive (id: ID) {
    mutate(id, { archivedAt: new Date() }, 'notification:archived')
  }

  function unarchive (id: ID) {
    mutate(id, { archivedAt: null }, 'notification:unarchived')
  }

  function snooze (id: ID, until: Date) {
    mutate(id, { snoozedUntil: until }, 'notification:snoozed')
  }

  function wake (id: ID) {
    mutate(id, { snoozedUntil: null }, 'notification:unsnoozed')
  }

  // Bulk mutations
  function readAll () {
    const now = new Date()
    queue.batch(() => {
      for (const ticket of queue.values()) {
        if (!ticket.readAt) {
          queue.upsert(ticket.id, { readAt: now })
          queue.emit('notification:read', ticket.id)
        }
      }
    })
  }

  function archiveAll () {
    const now = new Date()
    queue.batch(() => {
      for (const ticket of queue.values()) {
        if (!ticket.archivedAt) {
          queue.upsert(ticket.id, { archivedAt: now })
          queue.emit('notification:archived', ticket.id)
        }
      }
    })
  }

  const unreadItems = computed(() => proxy.values.filter(t => !t.readAt))
  const archivedItems = computed(() => proxy.values.filter(t => !!t.archivedAt))
  const snoozedItems = computed(() => proxy.values.filter(t => !!t.snoozedUntil))

  const { register: _, onboard: __, ...ctx } = queue

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
    unreadItems,
    archivedItems,
    snoozedItems,
  } as NotificationsContext
}

export interface NotificationsPluginOptions extends NotificationsOptions {
  namespace?: string
  adapter?: NotificationsAdapterInterface
}

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
    unreadItems: computed(() => []),
    archivedItems: computed(() => []),
    snoozedItems: computed(() => []),
  } as unknown as NotificationsContext
}

export const [
  createNotificationsContext,
  createNotificationsPlugin,
  useNotifications,
] = createPluginContext<NotificationsPluginOptions, NotificationsContext>(
  'v0:notifications',
  options => createNotifications(options),
  {
    fallback: () => createNotificationsFallback(),
    setup: (context, app, { adapter }) => {
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
