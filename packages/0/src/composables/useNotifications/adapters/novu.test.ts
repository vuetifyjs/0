import { describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

// Types
import type { NotificationsAdapterContext } from '../index'
import type { NovuClient, NovuNotification } from './novu'

import { createNovuAdapter } from './novu'

import { createNotifications } from '../index'

function withScope<T> (fn: () => T): T {
  const scope = effectScope()
  return scope.run(fn)!
}

function mockNovu (): NovuClient {
  const listeners = new Map<string, Set<(data: unknown) => void>>()

  return {
    notifications: {
      list: vi.fn().mockResolvedValue({ data: { notifications: [] } }),
      read: vi.fn().mockResolvedValue({}),
      unread: vi.fn().mockResolvedValue({}),
      archive: vi.fn().mockResolvedValue({}),
      unarchive: vi.fn().mockResolvedValue({}),
      seenAll: vi.fn().mockResolvedValue({}),
    },
    on: vi.fn((event: string, handler: (data: unknown) => void) => {
      if (!listeners.has(event)) listeners.set(event, new Set())
      listeners.get(event)!.add(handler)
      return () => {
        listeners.get(event)?.delete(handler)
      }
    }),
    _emit (event: string, data: unknown) {
      for (const h of listeners.get(event) ?? []) h(data)
    },
  } as NovuClient & { _emit: (event: string, data: unknown) => void }
}

function adapterContext (notifications: ReturnType<typeof createNotifications>): NotificationsAdapterContext {
  return {
    send: notifications.send,
    on: notifications.on,
    off: notifications.off,
  }
}

describe('createNovuAdapter', () => {
  it('should call setup with context', () => {
    withScope(() => {
      const novu = mockNovu()
      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()

      adapter.setup(adapterContext(notifications))
      expect(novu.on).toHaveBeenCalled()
    })
  })

  it('should map inbound notifications via real-time event', () => {
    withScope(() => {
      const novu = mockNovu() as NovuClient & { _emit: (e: string, d: unknown) => void }
      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      const item: NovuNotification = { id: 'n1', subject: 'Hello', body: 'World' }
      novu._emit('notifications.notification_received', item)

      expect(notifications.values()).toHaveLength(1)
      expect(notifications.values()[0]!.subject).toBe('Hello')
    })
  })

  it('should deduplicate by id', () => {
    withScope(() => {
      const novu = mockNovu() as NovuClient & { _emit: (e: string, d: unknown) => void }
      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      const item: NovuNotification = { id: 'n1', subject: 'Hello' }
      novu._emit('notifications.notification_received', item)
      novu._emit('notifications.notification_received', item)

      expect(notifications.values()).toHaveLength(1)
    })
  })

  it('should map severity using default mapping', () => {
    withScope(() => {
      const novu = mockNovu() as NovuClient & { _emit: (e: string, d: unknown) => void }
      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      novu._emit('notifications.notification_received', { id: 'n1', severity: 'critical' })
      expect(notifications.values()[0]!.severity).toBe('error')

      novu._emit('notifications.notification_received', { id: 'n2', severity: 'medium' })
      expect(notifications.values()[1]!.severity).toBe('warning')
    })
  })

  it('should use custom severity mapping', () => {
    withScope(() => {
      const novu = mockNovu() as NovuClient & { _emit: (e: string, d: unknown) => void }
      const adapter = createNovuAdapter(novu, {
        severity: () => 'success',
      })
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      novu._emit('notifications.notification_received', { id: 'n1', severity: 'anything' })
      expect(notifications.values()[0]!.severity).toBe('success')
    })
  })

  it('should sync read event outbound', () => {
    withScope(() => {
      const novu = mockNovu() as NovuClient & { _emit: (e: string, d: unknown) => void }
      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      novu._emit('notifications.notification_received', { id: 'n1', subject: 'Test' })
      notifications.read('n1')

      expect(novu.notifications.read).toHaveBeenCalledWith({ notificationId: 'n1' })
    })
  })

  it('should sync archive event outbound', () => {
    withScope(() => {
      const novu = mockNovu() as NovuClient & { _emit: (e: string, d: unknown) => void }
      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      novu._emit('notifications.notification_received', { id: 'n1', subject: 'Test' })
      notifications.archive('n1')

      expect(novu.notifications.archive).toHaveBeenCalledWith({ notificationId: 'n1' })
    })
  })

  it('should clean up on dispose', () => {
    withScope(() => {
      const novu = mockNovu()
      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      adapter.dispose!()

      // After dispose, the on() unsubscribers should have been called
      // and ctx.off should have been called for all 5 outbound events
      // Verify by checking that sending a new event doesn't create a notification
      const novu2 = novu as NovuClient & { _emit: (e: string, d: unknown) => void }
      novu2._emit('notifications.notification_received', { id: 'after-dispose', subject: 'Test' })
      expect(notifications.values()).toHaveLength(0)
    })
  })
})
