import { describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

// Types
import type { NotificationsAdapterContext } from '../index'
import type { NovuClient } from './novu'

import { NovuNotificationsAdapter } from './novu'

import { createNotifications } from '../index'

function adapterContext (notifications: ReturnType<typeof createNotifications>): NotificationsAdapterContext {
  return {
    send: notifications.send,
    register: notifications.register,
    on: notifications.on,
    off: notifications.off,
  }
}

describe('novuNotificationsAdapter (SSR)', () => {
  it('should not invoke notifications.list on SSR', () => {
    const scope = effectScope()
    const novu: NovuClient = {
      notifications: {
        list: vi.fn().mockResolvedValue({ data: { notifications: [] } }),
        read: vi.fn().mockResolvedValue({}),
        unread: vi.fn().mockResolvedValue({}),
        archive: vi.fn().mockResolvedValue({}),
        unarchive: vi.fn().mockResolvedValue({}),
        seenAll: vi.fn().mockResolvedValue({}),
      },
      on: vi.fn(() => () => {}),
    }

    scope.run(() => {
      const adapter = new NovuNotificationsAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))
    })

    // SSR path skips initial fetch
    expect(novu.notifications.list).not.toHaveBeenCalled()

    scope.stop()
  })
})
