import { describe, expect, it, vi } from 'vitest'

import { createKnockAdapter } from './knock'

// Utilities
import { effectScope } from 'vue'

// Types
import type { NotificationsAdapterContext } from '../index'
import type { KnockFeed, KnockFeedItem } from './knock'

import { createNotifications } from '../index'

function withScope<T> (fn: () => T): T {
  const scope = effectScope()
  return scope.run(fn)!
}

function mockFeed (): KnockFeed & { _emit: (event: string, data: unknown) => void } {
  const listeners = new Map<string, Set<(data: unknown) => void>>()

  return {
    on: vi.fn((event: string, handler: (data: unknown) => void) => {
      if (!listeners.has(event)) listeners.set(event, new Set())
      listeners.get(event)!.add(handler)
    }),
    off: vi.fn((event: string, handler: (data: unknown) => void) => {
      listeners.get(event)?.delete(handler)
    }),
    markAsRead: vi.fn().mockResolvedValue({}),
    markAsArchived: vi.fn().mockResolvedValue({}),
    fetch: vi.fn().mockResolvedValue({}),
    teardown: vi.fn(),
    listenForUpdates: vi.fn(),
    _emit (event: string, data: unknown) {
      for (const h of listeners.get(event) ?? []) h(data)
    },
  }
}

function adapterContext (notifications: ReturnType<typeof createNotifications>): NotificationsAdapterContext {
  return {
    send: notifications.send,
    register: notifications.register,
    on: notifications.on,
    off: notifications.off,
  }
}

function makeItem (id: string, overrides?: Partial<KnockFeedItem>): KnockFeedItem {
  return {
    id,
    blocks: [
      { type: 'text', name: 'subject', content: 'Hello', rendered: 'Hello' },
      { type: 'text', name: 'body', content: 'World', rendered: 'World' },
    ],
    data: { key: 'value' },
    ...overrides,
  }
}

describe('createKnockAdapter', () => {
  it('should call setup and subscribe to feed events', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()

      adapter.setup(adapterContext(notifications))

      expect(feed.on).toHaveBeenCalledWith('items.received.realtime', expect.any(Function))
      expect(feed.on).toHaveBeenCalledWith('items.received.page', expect.any(Function))
    })
  })

  it('should map inbound items via realtime event', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      feed._emit('items.received.realtime', { items: [makeItem('k1')] })

      expect(notifications.values()).toHaveLength(1)
      expect(notifications.values()[0]!.subject).toBe('Hello')
      expect(notifications.values()[0]!.body).toBe('World')
    })
  })

  it('should map inbound items via page event', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      feed._emit('items.received.page', { items: [makeItem('k1')] })

      expect(notifications.values()).toHaveLength(1)
    })
  })

  it('should extract subject and body from blocks', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      feed._emit('items.received.realtime', {
        items: [makeItem('k1', {
          blocks: [
            { type: 'text', name: 'subject', content: 'Sub', rendered: 'Rendered Sub' },
            { type: 'text', name: 'body', content: 'Bod', rendered: 'Rendered Bod' },
          ],
        })],
      })

      expect(notifications.values()[0]!.subject).toBe('Rendered Sub')
      expect(notifications.values()[0]!.body).toBe('Rendered Bod')
    })
  })

  it('should handle missing blocks gracefully', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      feed._emit('items.received.realtime', { items: [{ id: 'k1' }] })

      expect(notifications.values()).toHaveLength(1)
      expect(notifications.values()[0]!.subject).toBeUndefined()
      expect(notifications.values()[0]!.body).toBeUndefined()
    })
  })

  it('should forward data from feed items', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      feed._emit('items.received.realtime', {
        items: [makeItem('k1', { data: { action: 'deploy' } })],
      })

      expect(notifications.values()[0]!.data).toEqual({ action: 'deploy' })
    })
  })

  it('should deduplicate by id', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      const item = makeItem('k1')
      feed._emit('items.received.realtime', { items: [item] })
      feed._emit('items.received.realtime', { items: [item] })

      expect(notifications.values()).toHaveLength(1)
    })
  })

  it('should deduplicate across event types', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      const item = makeItem('k1')
      feed._emit('items.received.realtime', { items: [item] })
      feed._emit('items.received.page', { items: [item] })

      expect(notifications.values()).toHaveLength(1)
    })
  })

  it('should handle multiple items in a single event', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      feed._emit('items.received.realtime', {
        items: [makeItem('k1'), makeItem('k2'), makeItem('k3')],
      })

      expect(notifications.values()).toHaveLength(3)
    })
  })

  it('should ignore payloads without items', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      feed._emit('items.received.realtime', {})
      feed._emit('items.received.realtime', null)

      expect(notifications.values()).toHaveLength(0)
    })
  })

  it('should ignore page event with missing items', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      feed._emit('items.received.page', {})
      feed._emit('items.received.page', null)
      feed._emit('items.received.page', { items: undefined })

      expect(notifications.values()).toHaveLength(0)
    })
  })

  it('should sync read event outbound', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      const item = makeItem('k1')
      feed._emit('items.received.realtime', { items: [item] })
      notifications.read('k1')

      expect(feed.markAsRead).toHaveBeenCalledWith(item)
    })
  })

  it('should sync archive event outbound', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      const item = makeItem('k1')
      feed._emit('items.received.realtime', { items: [item] })
      notifications.archive('k1')

      expect(feed.markAsArchived).toHaveBeenCalledWith(item)
    })
  })

  it('should not call Knock API for unknown ids', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      // Send a local notification (not from Knock)
      notifications.send({ id: 'local-1', subject: 'Local' })
      notifications.read('local-1')

      expect(feed.markAsRead).not.toHaveBeenCalled()
    })
  })

  it('should clean up on dispose', () => {
    withScope(() => {
      const feed = mockFeed()
      const adapter = createKnockAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      adapter.dispose!()

      expect(feed.off).toHaveBeenCalledWith('items.received.realtime', expect.any(Function))
      expect(feed.off).toHaveBeenCalledWith('items.received.page', expect.any(Function))
      expect(feed.teardown).toHaveBeenCalled()

      // After dispose, new events should not create notifications
      feed._emit('items.received.realtime', { items: [makeItem('after-dispose')] })
      expect(notifications.values()).toHaveLength(0)
    })
  })
})
