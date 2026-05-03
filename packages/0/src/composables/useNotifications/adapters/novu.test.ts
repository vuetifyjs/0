import { describe, expect, it, vi } from 'vitest'

import { createNovuAdapter } from './novu'

// Utilities
import { effectScope } from 'vue'

// Types
import type { NotificationsAdapterContext } from '../index'
import type { NovuClient, NovuNotification } from './novu'

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
    register: notifications.register,
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

  it('should sync unread event outbound', () => {
    withScope(() => {
      const novu = mockNovu() as NovuClient & { _emit: (e: string, d: unknown) => void }
      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      novu._emit('notifications.notification_received', { id: 'n1', subject: 'Test' })
      notifications.unread('n1')

      expect(novu.notifications.unread).toHaveBeenCalledWith({ notificationId: 'n1' })
    })
  })

  it('should sync seen event outbound', () => {
    withScope(() => {
      const novu = mockNovu() as NovuClient & { _emit: (e: string, d: unknown) => void }
      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      novu._emit('notifications.notification_received', { id: 'n1', subject: 'Test' })
      notifications.seen('n1')

      expect(novu.notifications.seenAll).toHaveBeenCalledWith({ notificationIds: ['n1'] })
    })
  })

  it('should sync unarchive event outbound', () => {
    withScope(() => {
      const novu = mockNovu() as NovuClient & { _emit: (e: string, d: unknown) => void }
      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      novu._emit('notifications.notification_received', { id: 'n1', subject: 'Test' })
      notifications.unarchive('n1')

      expect(novu.notifications.unarchive).toHaveBeenCalledWith({ notificationId: 'n1' })
    })
  })

  it('should seed notifications from initial list call', async () => {
    await withScope(async () => {
      const items: NovuNotification[] = [
        { id: 'seed-1', subject: 'First' },
        { id: 'seed-2', subject: 'Second', severity: 'high' },
      ]
      const novu = mockNovu()
      vi.mocked(novu.notifications.list).mockResolvedValue({ data: { notifications: items } })

      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      await vi.waitFor(() => {
        expect(notifications.values()).toHaveLength(2)
      })

      expect(notifications.values()[0]!.subject).toBe('First')
      expect(notifications.values()[1]!.subject).toBe('Second')
      expect(notifications.values()[1]!.severity).toBe('error')
    })
  })

  it('should not register notifications if disposed before list resolves', async () => {
    await withScope(async () => {
      let resolve!: (value: { data: { notifications: NovuNotification[] } }) => void
      const deferred = new Promise<{ data: { notifications: NovuNotification[] } }>(r => {
        resolve = r
      })

      const novu = mockNovu()
      vi.mocked(novu.notifications.list).mockReturnValue(deferred)

      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      // Dispose before the list request resolves
      adapter.dispose!()

      // Now resolve with items
      resolve({ data: { notifications: [{ id: 'late-1', subject: 'Late' }] } })
      await deferred

      // Give microtasks a chance to flush
      await new Promise(r => setTimeout(r, 0))

      expect(notifications.values()).toHaveLength(0)
    })
  })

  it('should handle empty list response gracefully', async () => {
    await withScope(async () => {
      const novu = mockNovu()
      vi.mocked(novu.notifications.list).mockResolvedValue({ data: null })

      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      await vi.waitFor(() => {
        expect(novu.notifications.list).toHaveBeenCalled()
      })

      // Give microtasks a chance to flush
      await new Promise(r => setTimeout(r, 0))

      expect(notifications.values()).toHaveLength(0)
    })
  })

  it('should handle list response with missing notifications array', async () => {
    await withScope(async () => {
      const novu = mockNovu()
      vi.mocked(novu.notifications.list).mockResolvedValue({ data: { notifications: undefined } })

      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      await vi.waitFor(() => {
        expect(novu.notifications.list).toHaveBeenCalled()
      })

      await new Promise(r => setTimeout(r, 0))

      expect(notifications.values()).toHaveLength(0)
    })
  })

  it('should ignore realtime events after dispose via disposed flag', () => {
    withScope(() => {
      const listeners = new Map<string, Set<(data: unknown) => void>>()

      // Custom mock that does NOT remove listeners on unsubscribe
      // to verify the disposed flag is the guard
      const novu: NovuClient & { _emit: (e: string, d: unknown) => void } = {
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
          // Return a noop unsubscriber — handler stays registered
          return () => {}
        }),
        _emit (event: string, data: unknown) {
          for (const h of listeners.get(event) ?? []) h(data)
        },
      }

      const adapter = createNovuAdapter(novu)
      const notifications = createNotifications()
      adapter.setup(adapterContext(notifications))

      adapter.dispose!()

      // Handler still registered but disposed flag should guard
      novu._emit('notifications.notification_received', { id: 'post-dispose', subject: 'Ignored' })
      expect(notifications.values()).toHaveLength(0)
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
