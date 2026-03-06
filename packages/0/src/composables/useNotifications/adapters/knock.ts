/**
 * @module KnockNotificationsAdapter
 *
 * @remarks
 * Knock adapter for useNotifications.
 * Bridges a Knock feed instance with the notification system.
 *
 * Inbound: Maps real-time feed events to ctx.notify()
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
  on: (event: string, handler: (...args: unknown[]) => void) => void
  off: (event: string, handler: (...args: unknown[]) => void) => void
  markAsRead: (item: KnockFeedItem) => Promise<unknown>
  markAsArchived: (item: KnockFeedItem) => Promise<unknown>
  teardown: () => void
  listenForUpdates: () => void
}

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
  let onReceived: ((...args: unknown[]) => void) | undefined
  let onRead: ((...args: unknown[]) => void) | undefined
  let onArchived: ((...args: unknown[]) => void) | undefined

  return {
    setup (_ctx: NotificationsAdapterContext) {
      ctx = _ctx

      // Inbound: real-time feed events -> ctx.notify()
      onReceived = (...args: unknown[]) => {
        const data = args[0] as { items: KnockFeedItem[] }
        for (const item of data.items) {
          items.set(item.id, item)
          ctx!.notify(mapItem(item))
        }
      }

      feed.on('items.received.realtime', onReceived)
      feed.listenForUpdates()

      // Outbound: notification mutations -> Knock API
      onRead = (...args: unknown[]) => {
        const item = items.get(String(args[0]))
        if (item) feed.markAsRead(item)
      }

      onArchived = (...args: unknown[]) => {
        const item = items.get(String(args[0]))
        if (item) feed.markAsArchived(item)
      }

      ctx.on('notification:read', onRead)
      ctx.on('notification:archived', onArchived)
    },
    dispose () {
      if (onReceived) feed.off('items.received.realtime', onReceived)
      if (onRead && ctx) ctx.off('notification:read', onRead)
      if (onArchived && ctx) ctx.off('notification:archived', onArchived)
      feed.teardown()
    },
  }
}
