/**
 * @module KnockNotificationsAdapter
 *
 * @remarks
 * Knock adapter for useNotifications.
 * Bridges a Knock feed instance with the notification system.
 *
 * Inbound: Maps real-time feed events to ctx.send()
 * Outbound: Listens to notification:read and notification:archived
 *           events and calls feed.markAsRead/markAsArchived
 *
 * @example
 * ```ts
 * import Knock from '@knocklabs/client'
 * import { KnockNotificationsAdapter } from '#v0/composables/useNotifications/adapters/knock'
 *
 * const knock = new Knock(KNOCK_PUBLIC_API_KEY)
 * knock.authenticate(userId)
 * const feed = knock.feeds.initialize(KNOCK_FEED_CHANNEL_ID)
 *
 * app.use(createNotificationsPlugin({
 *   adapter: new KnockNotificationsAdapter(feed),
 * }))
 * ```
 */

// Types
import type { NotificationInput, NotificationsAdapterContext, NotificationTicket } from '../index'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Adapters
import { NotificationsAdapter } from './adapter'

/** Minimal Knock feed item shape. Uses type-only imports to avoid bundling the SDK. */
export interface KnockFeedItem {
  [key: string]: unknown
  id: string
  data?: Record<string, unknown>
  blocks?: Array<{
    type: string
    name: string
    content: string
    rendered: string
  }>
  inserted_at?: string
  read_at?: string | null
  seen_at?: string | null
  archived_at?: string | null
}

/** Minimal Knock feed instance interface. */
export interface KnockFeed {
  on: (event: string, handler: (data: unknown) => void) => void
  off: (event: string, handler: (data: unknown) => void) => void
  markAsRead: (item: KnockFeedItem) => Promise<unknown>
  markAsArchived: (item: KnockFeedItem) => Promise<unknown>
  fetch: (options?: Record<string, unknown>) => Promise<unknown>
  teardown: () => void
  listenForUpdates: () => void
}

function noop () {}

function mapItem (item: KnockFeedItem): NotificationInput {
  const subject = item.blocks?.find(b => b.name === 'subject')?.rendered
  const body = item.blocks?.find(b => b.name === 'body')?.rendered

  return {
    id: item.id,
    subject,
    body,
    data: item.data,
  }
}

export class KnockNotificationsAdapter extends NotificationsAdapter {
  private items = new Map<string, KnockFeedItem>()
  private ctx: NotificationsAdapterContext | undefined
  private onReceived: ((data: unknown) => void) | undefined
  private onPage: ((data: unknown) => void) | undefined
  private onRead: ((data: unknown) => void) | undefined
  private onArchived: ((data: unknown) => void) | undefined

  constructor (private feed: KnockFeed) {
    super()
  }

  setup (_ctx: NotificationsAdapterContext) {
    this.ctx = _ctx

    // Inbound: real-time → send (toast + registry)
    this.onReceived = (data: unknown) => {
      const payload = data as { items?: KnockFeedItem[] }
      if (!payload?.items) return
      for (const item of payload.items) {
        if (this.items.has(item.id)) continue
        this.items.set(item.id, item)
        this.ctx!.send(mapItem(item))
      }
    }

    // Inbound: page fetch → register (registry only, no toast)
    this.onPage = (data: unknown) => {
      const payload = data as { items?: KnockFeedItem[] }
      if (!payload?.items) return
      for (const item of payload.items) {
        if (this.items.has(item.id)) continue
        this.items.set(item.id, item)
        this.ctx!.register(mapItem(item))
      }
    }

    this.feed.on('items.received.realtime', this.onReceived)
    this.feed.on('items.received.page', this.onPage)

    if (IN_BROWSER) {
      this.feed.listenForUpdates()
      this.feed.fetch().catch(noop)
    }

    // Outbound: notification mutations -> Knock API
    this.onRead = (data: unknown) => {
      const item = this.items.get(String((data as NotificationTicket).id))
      if (item) this.feed.markAsRead(item).catch(noop)
    }

    this.onArchived = (data: unknown) => {
      const item = this.items.get(String((data as NotificationTicket).id))
      if (item) this.feed.markAsArchived(item).catch(noop)
    }

    this.ctx.on('notification:read', this.onRead)
    this.ctx.on('notification:archived', this.onArchived)
  }

  dispose () {
    if (!this.ctx) return
    this.feed.off('items.received.realtime', this.onReceived!)
    this.feed.off('items.received.page', this.onPage!)
    this.ctx.off('notification:read', this.onRead!)
    this.ctx.off('notification:archived', this.onArchived!)
    this.items.clear()
    this.feed.teardown()
  }
}
