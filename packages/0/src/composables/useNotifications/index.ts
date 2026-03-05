/**
 * @module useNotifications
 *
 * @remarks
 * Notification management composable built on createQueue.
 * Manages notification lifecycle with optional service adapters (Knock, Novu, custom).
 *
 * Supports:
 * - Push notifications with severity, actions, and timeout
 * - State mutations: read, seen, archived, snoozed
 * - Bulk operations: readAll, archiveAll, clear
 * - Adapter integration via event system
 * - Plugin installation via createPluginContext
 */

// Foundational
import { createPluginContext } from '#v0/composables/createPlugin'

// Composables
import { createQueue } from '#v0/composables/createQueue'

// Utilities
import { useId } from '#v0/utilities'
import { computed, onScopeDispose, shallowRef, triggerRef } from 'vue'

// Types
import type { QueueContext, QueueOptions, QueueTicket, QueueTicketInput } from '#v0/composables/createQueue'
import type { ID } from '#v0/types'

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
  unsnooze: () => void
}

export interface NotificationsAdapterContext {
  notify: (input: NotificationInput) => NotificationTicket
  on: (event: string, handler: (...args: unknown[]) => void) => void
  off: (event: string, handler: (...args: unknown[]) => void) => void
}

export type NotificationsAdapter = (context: NotificationsAdapterContext) => void | (() => void)

export interface NotificationsOptions extends QueueOptions {
  adapter?: NotificationsAdapter
}

export interface NotificationsContext extends Omit<
  QueueContext<NotificationInput, NotificationTicket>,
  'register'
> {
  // Push
  notify: (input: NotificationInput) => NotificationTicket

  // Single mutations
  read: (id: ID) => void
  unread: (id: ID) => void
  seen: (id: ID) => void
  archive: (id: ID) => void
  unarchive: (id: ID) => void
  snooze: (id: ID, until: Date) => void
  unsnooze: (id: ID) => void

  // Bulk mutations
  readAll: () => void
  archiveAll: () => void

  // Reactive state
  items: ReturnType<typeof shallowRef<NotificationTicket[]>>
  unreadCount: ReturnType<typeof computed<number>>
  unseenCount: ReturnType<typeof computed<number>>
  total: ReturnType<typeof computed<number>>
}

export function createNotifications (
  _options: NotificationsOptions = {},
): NotificationsContext {
  const { adapter, timeout = -1, ...options } = _options
  const queue = createQueue<NotificationInput, NotificationTicket>({
    ...options,
    timeout,
    events: true,
  })

  const items = shallowRef<NotificationTicket[]>([])

  function sync () {
    items.value = [...queue.values()]
    triggerRef(items)
  }

  queue.on('register:ticket', sync)
  queue.on('unregister:ticket', sync)
  queue.on('update:ticket', sync)
  queue.on('clear:registry', sync)

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
      unsnooze: () => unsnooze(id),
    } as Partial<NotificationInput>)

    queue.emit('notification:received', ticket)

    return ticket
  }

  // Single mutations
  function mutate (id: ID, patch: Partial<NotificationTicket>, event: string) {
    const ticket = queue.get(id)
    if (!ticket) return

    queue.upsert(id, patch as Partial<NotificationTicket>)
    queue.emit(event, id)
    sync()
  }

  function read (id: ID) {
    mutate(id, { readAt: new Date() } as Partial<NotificationTicket>, 'notification:read')
  }

  function unread (id: ID) {
    mutate(id, { readAt: null } as Partial<NotificationTicket>, 'notification:unread')
  }

  function seen (id: ID) {
    mutate(id, { seenAt: new Date() } as Partial<NotificationTicket>, 'notification:seen')
  }

  function archive (id: ID) {
    mutate(id, { archivedAt: new Date() } as Partial<NotificationTicket>, 'notification:archived')
  }

  function unarchive (id: ID) {
    mutate(id, { archivedAt: null } as Partial<NotificationTicket>, 'notification:unarchived')
  }

  function snooze (id: ID, until: Date) {
    mutate(id, { snoozedUntil: until } as Partial<NotificationTicket>, 'notification:snoozed')
  }

  function unsnooze (id: ID) {
    mutate(id, { snoozedUntil: null } as Partial<NotificationTicket>, 'notification:unsnoozed')
  }

  // Bulk mutations
  function readAll () {
    const now = new Date()
    for (const ticket of queue.values()) {
      if (!ticket.readAt) {
        queue.upsert(ticket.id, { readAt: now } as Partial<NotificationTicket>)
      }
    }
    sync()
  }

  function archiveAll () {
    const now = new Date()
    for (const ticket of queue.values()) {
      if (!ticket.archivedAt) {
        queue.upsert(ticket.id, { archivedAt: now } as Partial<NotificationTicket>)
      }
    }
    sync()
  }

  // Reactive state
  const unreadCount = computed(() => items.value.filter(t => !t.readAt).length)
  const unseenCount = computed(() => items.value.filter(t => !t.seenAt).length)
  const total = computed(() => items.value.length)

  // Adapter
  let cleanup: (() => void) | undefined

  if (adapter) {
    const result = adapter({
      notify,
      on: queue.on.bind(queue),
      off: queue.off.bind(queue),
    })
    if (result) cleanup = result
  }

  // Override dispose to include adapter cleanup
  const baseDispose = queue.dispose
  function dispose () {
    cleanup?.()
    baseDispose()
  }

  onScopeDispose(dispose, true)

  return {
    ...queue,
    notify,
    read,
    unread,
    seen,
    archive,
    unarchive,
    snooze,
    unsnooze,
    readAll,
    archiveAll,
    items,
    unreadCount,
    unseenCount,
    total,
    dispose,
  } as unknown as NotificationsContext
}

export interface NotificationsPluginOptions extends NotificationsOptions {
  namespace?: string
}

export const [
  createNotificationsContext,
  createNotificationsPlugin,
  useNotifications,
] = createPluginContext<NotificationsPluginOptions, NotificationsContext>(
  'v0:notifications',
  options => createNotifications(options),
)
