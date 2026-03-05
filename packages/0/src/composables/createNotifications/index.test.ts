import { describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { NotificationsAdapterContext } from './index'

import { createNotifications } from './index'

function withScope<T> (fn: () => T): T {
  const scope = effectScope()
  return scope.run(fn)!
}

describe('createNotifications', () => {
  describe('core lifecycle', () => {
    it('should create an empty notifications context', () => {
      withScope(() => {
        const notifications = createNotifications()
        expect(notifications.items.value).toEqual([])
        expect(notifications.total.value).toBe(0)
        expect(notifications.unreadCount.value).toBe(0)
        expect(notifications.unseenCount.value).toBe(0)
      })
    })

    it('should notify and add to items', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.notify({
          subject: 'Test',
          severity: 'info',
        })

        expect(ticket.subject).toBe('Test')
        expect(ticket.severity).toBe('info')
        expect(ticket.createdAt).toBeInstanceOf(Date)
        expect(ticket.readAt).toBeNull()
        expect(ticket.seenAt).toBeNull()
        expect(ticket.archivedAt).toBeNull()
        expect(ticket.snoozedUntil).toBeNull()
        expect(notifications.items.value).toHaveLength(1)
        expect(notifications.total.value).toBe(1)
      })
    })

    it('should default timeout to -1 (persistent)', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.notify({ subject: 'Persistent' })
        expect(ticket.timeout).toBe(-1)
      })
    })

    it('should use custom timeout', () => {
      withScope(() => {
        const notifications = createNotifications({ timeout: 5000 })
        const ticket = notifications.notify({ subject: 'Custom' })
        expect(ticket.timeout).toBe(5000)
      })
    })
  })

  describe('state mutations', () => {
    it('should read and unread', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.notify({ subject: 'Test' })

        notifications.read(ticket.id)
        expect(notifications.get(ticket.id)?.readAt).toBeInstanceOf(Date)
        expect(notifications.unreadCount.value).toBe(0)

        notifications.unread(ticket.id)
        expect(notifications.get(ticket.id)?.readAt).toBeNull()
        expect(notifications.unreadCount.value).toBe(1)
      })
    })

    it('should seen', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.notify({ subject: 'Test' })
        expect(notifications.unseenCount.value).toBe(1)

        notifications.seen(ticket.id)
        expect(notifications.get(ticket.id)?.seenAt).toBeInstanceOf(Date)
        expect(notifications.unseenCount.value).toBe(0)
      })
    })

    it('should archive and unarchive', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.notify({ subject: 'Test' })

        notifications.archive(ticket.id)
        expect(notifications.get(ticket.id)?.archivedAt).toBeInstanceOf(Date)

        notifications.unarchive(ticket.id)
        expect(notifications.get(ticket.id)?.archivedAt).toBeNull()
      })
    })

    it('should snooze and unsnooze', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.notify({ subject: 'Test' })
        const until = new Date(Date.now() + 60_000)

        notifications.snooze(ticket.id, until)
        expect(notifications.get(ticket.id)?.snoozedUntil).toEqual(until)

        notifications.unsnooze(ticket.id)
        expect(notifications.get(ticket.id)?.snoozedUntil).toBeNull()
      })
    })

    it('should readAll', () => {
      withScope(() => {
        const notifications = createNotifications()
        notifications.notify({ subject: 'A' })
        notifications.notify({ subject: 'B' })
        notifications.notify({ subject: 'C' })
        expect(notifications.unreadCount.value).toBe(3)

        notifications.readAll()
        expect(notifications.unreadCount.value).toBe(0)
      })
    })

    it('should archiveAll', () => {
      withScope(() => {
        const notifications = createNotifications()
        notifications.notify({ subject: 'A' })
        notifications.notify({ subject: 'B' })

        notifications.archiveAll()
        for (const ticket of notifications.items.value!) {
          expect(ticket.archivedAt).toBeInstanceOf(Date)
        }
      })
    })

    it('should dismiss via ticket.dismiss()', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.notify({ subject: 'Test' })
        expect(notifications.total.value).toBe(1)

        ticket.dismiss()
        expect(notifications.total.value).toBe(0)
      })
    })

    it('should use ticket convenience methods', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.notify({ subject: 'Test' })

        ticket.read()
        expect(notifications.get(ticket.id)?.readAt).toBeInstanceOf(Date)

        ticket.seen()
        expect(notifications.get(ticket.id)?.seenAt).toBeInstanceOf(Date)

        ticket.archive()
        expect(notifications.get(ticket.id)?.archivedAt).toBeInstanceOf(Date)

        ticket.unarchive()
        expect(notifications.get(ticket.id)?.archivedAt).toBeNull()

        const until = new Date(Date.now() + 60_000)
        ticket.snooze(until)
        expect(notifications.get(ticket.id)?.snoozedUntil).toEqual(until)

        ticket.unsnooze()
        expect(notifications.get(ticket.id)?.snoozedUntil).toBeNull()

        ticket.unread()
        expect(notifications.get(ticket.id)?.readAt).toBeNull()
      })
    })
  })

  describe('events', () => {
    it('should emit notification:received on notify', () => {
      withScope(() => {
        const notifications = createNotifications()
        const handler = vi.fn()
        notifications.on('notification:received', handler)

        notifications.notify({ subject: 'Test' })
        expect(handler).toHaveBeenCalledOnce()
      })
    })

    it('should emit notification:read on read', () => {
      withScope(() => {
        const notifications = createNotifications()
        const handler = vi.fn()
        notifications.on('notification:read', handler)

        const ticket = notifications.notify({ subject: 'Test' })
        notifications.read(ticket.id)
        expect(handler).toHaveBeenCalledWith(ticket.id)
      })
    })
  })

  describe('adapter', () => {
    it('should call adapter with context', () => {
      withScope(() => {
        const adapter = vi.fn()
        createNotifications({ adapter })
        expect(adapter).toHaveBeenCalledOnce()

        const ctx = adapter.mock.calls[0]![0]
        expect(ctx).toHaveProperty('notify')
        expect(ctx).toHaveProperty('on')
        expect(ctx).toHaveProperty('off')
      })
    })

    it('should call adapter cleanup on dispose', () => {
      withScope(() => {
        const cleanup = vi.fn()
        const adapter = vi.fn(() => cleanup)
        const notifications = createNotifications({ adapter })

        notifications.dispose()
        expect(cleanup).toHaveBeenCalledOnce()
      })
    })

    it('should allow adapter to push notifications', () => {
      withScope(() => {
        function adapter (ctx: NotificationsAdapterContext) {
          ctx.notify({ subject: 'From adapter', severity: 'info' })
        }
        const notifications = createNotifications({ adapter })
        expect(notifications.items.value).toHaveLength(1)
        expect(notifications.items.value![0]!.subject).toBe('From adapter')
      })
    })

    it('should allow adapter to listen to events', () => {
      withScope(() => {
        const reads: ID[] = []
        function adapter (ctx: NotificationsAdapterContext) {
          ctx.on('notification:read', (id: unknown) => reads.push(id as ID))
        }
        const notifications = createNotifications({ adapter })
        const ticket = notifications.notify({ subject: 'Test' })

        notifications.read(ticket.id)
        expect(reads).toEqual([ticket.id])
      })
    })
  })
})
