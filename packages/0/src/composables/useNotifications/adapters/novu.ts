/**
 * @module NovuNotificationsAdapter
 *
 * @remarks
 * Novu adapter for useNotifications.
 * Bridges a Novu client instance with the notification system.
 *
 * Inbound: Seeds registry from novu.notifications.list() on setup,
 *          then listens to notifications.notification_received for real-time updates.
 * Outbound: Listens to notification lifecycle events and calls the Novu API
 *           (read, unread, seen, archive, unarchive).
 *
 * @example
 * ```ts
 * import { Novu } from '@novu/js'
 * import { createNovuAdapter } from '@vuetify/v0/notifications'
 *
 * const novu = new Novu({
 *   subscriberId: userId,
 *   applicationIdentifier: import.meta.env.VITE_NOVU_APP_ID,
 * })
 *
 * app.use(createNotificationsPlugin({
 *   adapter: createNovuAdapter(novu),
 * }))
 * ```
 */

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { NotificationInput, NotificationSeverity, NotificationsAdapterContext, NotificationsAdapterInterface } from '../index'

/** Minimal Novu notification shape. Uses type-only imports to avoid bundling the SDK. */
export interface NovuNotification {
  [key: string]: unknown
  id?: string
  subject?: string
  body?: string
  data?: Record<string, unknown>
  severity?: string
  isRead?: boolean
  isSeen?: boolean
  isArchived?: boolean
  createdAt?: string
}

/** Minimal Novu client interface. */
export interface NovuClient {
  notifications: {
    list: (opts?: Record<string, unknown>) => Promise<{ data?: { notifications?: NovuNotification[] } | null }>
    read: (opts: { notificationId: string }) => Promise<unknown>
    unread: (opts: { notificationId: string }) => Promise<unknown>
    archive: (opts: { notificationId: string }) => Promise<unknown>
    unarchive: (opts: { notificationId: string }) => Promise<unknown>
    seenAll: (opts: { notificationIds: string[] }) => Promise<unknown>
  }
  on: (event: string, handler: (data: unknown) => void) => () => void
}

export interface NovuAdapterOptions {
  /** Map a Novu severity string to a NotificationSeverity. Defaults to critical/high→error, medium→warning, low→info. */
  severity?: (novuSeverity: string) => NotificationSeverity | undefined
}

const DEFAULT_SEVERITY_MAP: Record<string, NotificationSeverity> = {
  critical: 'error',
  high: 'error',
  medium: 'warning',
  low: 'info',
}

function defaultSeverity (s: string): NotificationSeverity | undefined {
  return DEFAULT_SEVERITY_MAP[s.toLowerCase()]
}

function noop () {}

function mapItem (item: NovuNotification, resolveSeverity: (s: string) => NotificationSeverity | undefined): NotificationInput {
  return {
    id: item.id,
    subject: item.subject,
    body: item.body,
    data: item.data,
    severity: item.severity ? resolveSeverity(item.severity) : undefined,
  }
}

export function createNovuAdapter (novu: NovuClient, options: NovuAdapterOptions = {}): NotificationsAdapterInterface {
  const resolveSeverity = options.severity ?? defaultSeverity
  const ids = new Set<string>()
  let ctx: NotificationsAdapterContext | undefined
  let disposed = false
  const unsubscribers: Array<() => void> = []

  let onRead: ((data: unknown) => void) | undefined
  let onUnread: ((data: unknown) => void) | undefined
  let onSeen: ((data: unknown) => void) | undefined
  let onArchived: ((data: unknown) => void) | undefined
  let onUnarchived: ((data: unknown) => void) | undefined

  return {
    setup (_ctx: NotificationsAdapterContext) {
      ctx = _ctx
      disposed = false

      // Inbound: real-time new notifications -> ctx.send()
      const unsub = novu.on('notifications.notification_received', (data: unknown) => {
        const item = data as NovuNotification
        if (disposed || !item?.id || ids.has(item.id)) return
        ids.add(item.id)
        ctx!.send(mapItem(item, resolveSeverity))
      })

      unsubscribers.push(unsub)

      // Inbound: register into registry from initial fetch (no toast queue)
      if (IN_BROWSER) {
        novu.notifications.list({ limit: 30 }).then(({ data }) => {
          if (disposed) return
          for (const item of data?.notifications ?? []) {
            if (!item.id || ids.has(item.id)) continue
            ids.add(item.id)
            ctx!.register(mapItem(item, resolveSeverity))
          }
        }).catch(noop)
      }

      // Outbound: notification mutations -> Novu API
      onRead = (data: unknown) => {
        const id = String(data)
        if (ids.has(id)) novu.notifications.read({ notificationId: id }).catch(noop)
      }

      onUnread = (data: unknown) => {
        const id = String(data)
        if (ids.has(id)) novu.notifications.unread({ notificationId: id }).catch(noop)
      }

      onSeen = (data: unknown) => {
        const id = String(data)
        if (ids.has(id)) novu.notifications.seenAll({ notificationIds: [id] }).catch(noop)
      }

      onArchived = (data: unknown) => {
        const id = String(data)
        if (ids.has(id)) novu.notifications.archive({ notificationId: id }).catch(noop)
      }

      onUnarchived = (data: unknown) => {
        const id = String(data)
        if (ids.has(id)) novu.notifications.unarchive({ notificationId: id }).catch(noop)
      }

      ctx.on('notification:read', onRead)
      ctx.on('notification:unread', onUnread)
      ctx.on('notification:seen', onSeen)
      ctx.on('notification:archived', onArchived)
      ctx.on('notification:unarchived', onUnarchived)
    },

    dispose () {
      disposed = true
      for (const unsub of unsubscribers) unsub()
      unsubscribers.length = 0

      if (ctx) {
        if (onRead) ctx.off('notification:read', onRead)
        if (onUnread) ctx.off('notification:unread', onUnread)
        if (onSeen) ctx.off('notification:seen', onSeen)
        if (onArchived) ctx.off('notification:archived', onArchived)
        if (onUnarchived) ctx.off('notification:unarchived', onUnarchived)
      }

      ids.clear()
    },
  }
}
