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
 * import { createKnockAdapter } from '#v0/composables/useNotifications/adapters/knock'
 *
 * const knock = new Knock(KNOCK_PUBLIC_API_KEY)
 * knock.authenticate(userId)
 * const feed = knock.feeds.initialize(KNOCK_FEED_CHANNEL_ID)
 *
 * app.use(createNotificationsPlugin({
 *   adapter: createKnockAdapter(feed),
 * }))
 * ```
 */

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { NotificationInput, NotificationsAdapterContext, NotificationsAdapterInterface } from '../index'

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

export function createKnockAdapter (feed: KnockFeed): NotificationsAdapterInterface {
  const items = new Map<string, KnockFeedItem>()
  let ctx: NotificationsAdapterContext | undefined
  let onReceived: ((data: unknown) => void) | undefined
  let onPage: ((data: unknown) => void) | undefined
  let onRead: ((data: unknown) => void) | undefined
  let onArchived: ((data: unknown) => void) | undefined

  return {
    setup (_ctx: NotificationsAdapterContext) {
      ctx = _ctx

      // Inbound: real-time → send (toast + registry)
      onReceived = (data: unknown) => {
        const payload = data as { items?: KnockFeedItem[] }
        if (!payload?.items) return
        for (const item of payload.items) {
          if (items.has(item.id)) continue
          items.set(item.id, item)
          ctx!.send(mapItem(item))
        }
      }

      // Inbound: page fetch → register (registry only, no toast)
      onPage = (data: unknown) => {
        const payload = data as { items?: KnockFeedItem[] }
        if (!payload?.items) return
        for (const item of payload.items) {
          if (items.has(item.id)) continue
          items.set(item.id, item)
          ctx!.register(mapItem(item))
        }
      }

      feed.on('items.received.realtime', onReceived)
      feed.on('items.received.page', onPage)

      if (IN_BROWSER) {
        feed.listenForUpdates()
        feed.fetch().catch(noop)
      }

      // Outbound: notification mutations -> Knock API
      onRead = (data: unknown) => {
        const item = items.get(String(data))
        if (item) feed.markAsRead(item).catch(noop)
      }

      onArchived = (data: unknown) => {
        const item = items.get(String(data))
        if (item) feed.markAsArchived(item).catch(noop)
      }

      ctx.on('notification:read', onRead)
      ctx.on('notification:archived', onArchived)
    },
    dispose () {
      if (!ctx) return
      feed.off('items.received.realtime', onReceived!)
      feed.off('items.received.page', onPage!)
      ctx.off('notification:read', onRead!)
      ctx.off('notification:archived', onArchived!)
      items.clear()
      feed.teardown()
    },
  }
}
