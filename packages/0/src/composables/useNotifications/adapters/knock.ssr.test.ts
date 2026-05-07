import { describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

// Types
import type { NotificationsAdapterContext } from '../index'

import { KnockNotificationsAdapter } from './knock'

import { createNotifications } from '../index'

function adapterContext (notifications: ReturnType<typeof createNotifications>): NotificationsAdapterContext {
  return {
    send: notifications.send,
    register: notifications.register,
    on: notifications.on,
    off: notifications.off,
  }
}

describe('knockNotificationsAdapter (SSR)', () => {
  it('should not start feed listeners or fetch on SSR', () => {
    const scope = effectScope()
    const feed: any = {
      on: vi.fn(),
      off: vi.fn(),
      fetch: vi.fn().mockResolvedValue({}),
      listenForUpdates: vi.fn(),
      teardown: vi.fn(),
      markAsRead: vi.fn(),
      markAsArchived: vi.fn(),
    }

    scope.run(() => {
      const adapter = new KnockNotificationsAdapter(feed)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))
    })

    // listenForUpdates and fetch are gated on IN_BROWSER — skipped on SSR
    expect(feed.listenForUpdates).not.toHaveBeenCalled()
    expect(feed.fetch).not.toHaveBeenCalled()

    scope.stop()
  })
})
