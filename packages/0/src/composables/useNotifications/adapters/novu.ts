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
 * import { NovuNotificationsAdapter } from '@vuetify/v0/notifications'
 *
 * const novu = new Novu({
 *   subscriberId: userId,
 *   applicationIdentifier: import.meta.env.VITE_NOVU_APP_ID,
 * })
 *
 * app.use(createNotificationsPlugin({
 *   adapter: new NovuNotificationsAdapter(novu),
 * }))
 * ```
 */

// Types
import type { NotificationInput, NotificationSeverity, NotificationTicket, NotificationsAdapterContext } from '../index'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Adapters
import { NotificationsAdapter } from './adapter'

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

export class NovuNotificationsAdapter extends NotificationsAdapter {
  private resolveSeverity: (s: string) => NotificationSeverity | undefined
  private ids = new Set<string>()
  private ctx: NotificationsAdapterContext | undefined
  private disposed = false
  private unsubscribers: Array<() => void> = []

  private onRead: ((data: unknown) => void) | undefined
  private onUnread: ((data: unknown) => void) | undefined
  private onSeen: ((data: unknown) => void) | undefined
  private onArchived: ((data: unknown) => void) | undefined
  private onUnarchived: ((data: unknown) => void) | undefined

  constructor (private novu: NovuClient, options: NovuAdapterOptions = {}) {
    super()
    this.resolveSeverity = options.severity ?? defaultSeverity
  }

  setup (_ctx: NotificationsAdapterContext) {
    this.ctx = _ctx
    this.disposed = false

    // Inbound: real-time new notifications -> ctx.send()
    const unsub = this.novu.on('notifications.notification_received', (data: unknown) => {
      const item = data as NovuNotification
      if (this.disposed || !item?.id || this.ids.has(item.id)) return
      this.ids.add(item.id)
      this.ctx!.send(mapItem(item, this.resolveSeverity))
    })

    this.unsubscribers.push(unsub)

    // Inbound: register into registry from initial fetch (no toast queue)
    if (IN_BROWSER) {
      this.novu.notifications.list({ limit: 30 }).then(({ data }) => {
        if (this.disposed) return
        for (const item of data?.notifications ?? []) {
          if (!item.id || this.ids.has(item.id)) continue
          this.ids.add(item.id)
          this.ctx!.register(mapItem(item, this.resolveSeverity))
        }
      }).catch(noop)
    }

    // Outbound: notification mutations -> Novu API
    this.onRead = (data: unknown) => {
      const id = String((data as NotificationTicket).id)
      if (this.ids.has(id)) this.novu.notifications.read({ notificationId: id }).catch(noop)
    }

    this.onUnread = (data: unknown) => {
      const id = String((data as NotificationTicket).id)
      if (this.ids.has(id)) this.novu.notifications.unread({ notificationId: id }).catch(noop)
    }

    this.onSeen = (data: unknown) => {
      const id = String((data as NotificationTicket).id)
      if (this.ids.has(id)) this.novu.notifications.seenAll({ notificationIds: [id] }).catch(noop)
    }

    this.onArchived = (data: unknown) => {
      const id = String((data as NotificationTicket).id)
      if (this.ids.has(id)) this.novu.notifications.archive({ notificationId: id }).catch(noop)
    }

    this.onUnarchived = (data: unknown) => {
      const id = String((data as NotificationTicket).id)
      if (this.ids.has(id)) this.novu.notifications.unarchive({ notificationId: id }).catch(noop)
    }

    this.ctx.on('notification:read', this.onRead)
    this.ctx.on('notification:unread', this.onUnread)
    this.ctx.on('notification:seen', this.onSeen)
    this.ctx.on('notification:archived', this.onArchived)
    this.ctx.on('notification:unarchived', this.onUnarchived)
  }

  dispose () {
    this.disposed = true
    for (const unsub of this.unsubscribers) unsub()
    this.unsubscribers.length = 0

    if (this.ctx) {
      if (this.onRead) this.ctx.off('notification:read', this.onRead)
      if (this.onUnread) this.ctx.off('notification:unread', this.onUnread)
      if (this.onSeen) this.ctx.off('notification:seen', this.onSeen)
      if (this.onArchived) this.ctx.off('notification:archived', this.onArchived)
      if (this.onUnarchived) this.ctx.off('notification:unarchived', this.onUnarchived)
    }

    this.ids.clear()
  }
}
