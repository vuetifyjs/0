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
        expect(notifications.values()).toEqual([])
        expect(notifications.values().length).toBe(0)
      })
    })

    it('should send and add to items', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({
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
        expect(notifications.values()).toHaveLength(1)
        expect(notifications.values().length).toBe(1)
      })
    })

    it('should assign dismiss to ticket', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({ subject: 'Test' })
        expect(ticket.dismiss).toBeTypeOf('function')
      })
    })
  })

  describe('state mutations', () => {
    it('should read and unread', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({ subject: 'Test' })

        notifications.read(ticket.id)
        expect(notifications.get(ticket.id)?.readAt).toBeInstanceOf(Date)

        notifications.unread(ticket.id)
        expect(notifications.get(ticket.id)?.readAt).toBeNull()
      })
    })

    it('should seen', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({ subject: 'Test' })
        expect(notifications.get(ticket.id)?.seenAt).toBeNull()

        notifications.seen(ticket.id)
        expect(notifications.get(ticket.id)?.seenAt).toBeInstanceOf(Date)
      })
    })

    it('should archive and unarchive', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({ subject: 'Test' })

        notifications.archive(ticket.id)
        expect(notifications.get(ticket.id)?.archivedAt).toBeInstanceOf(Date)

        notifications.unarchive(ticket.id)
        expect(notifications.get(ticket.id)?.archivedAt).toBeNull()
      })
    })

    it('should snooze and wake', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({ subject: 'Test' })
        const until = new Date(Date.now() + 60_000)

        notifications.snooze(ticket.id, until)
        expect(notifications.get(ticket.id)?.snoozedUntil).toEqual(until)

        notifications.wake(ticket.id)
        expect(notifications.get(ticket.id)?.snoozedUntil).toBeNull()
      })
    })

    it('should readAll', () => {
      withScope(() => {
        const notifications = createNotifications()
        notifications.send({ subject: 'A' }, { subject: 'B' }, { subject: 'C' })

        notifications.readAll()
        for (const ticket of notifications.values()) {
          expect(ticket.readAt).toBeInstanceOf(Date)
        }
      })
    })

    it('should archiveAll', () => {
      withScope(() => {
        const notifications = createNotifications()
        notifications.send({ subject: 'A' }, { subject: 'B' })

        notifications.archiveAll()
        for (const ticket of notifications.values()) {
          expect(ticket.archivedAt).toBeInstanceOf(Date)
        }
      })
    })

    it('should dismiss via ticket.dismiss()', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({ subject: 'Test' })
        expect(notifications.values().length).toBe(1)

        ticket.dismiss()
        expect(notifications.values().length).toBe(0)
      })
    })

    it('should use ticket convenience methods', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({ subject: 'Test' })

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

        ticket.wake()
        expect(notifications.get(ticket.id)?.snoozedUntil).toBeNull()

        ticket.unread()
        expect(notifications.get(ticket.id)?.readAt).toBeNull()
      })
    })
  })

  describe('events', () => {
    it('should emit notification:received on send', () => {
      withScope(() => {
        const notifications = createNotifications()
        const handler = vi.fn()
        notifications.on('notification:received', handler)

        notifications.send({ subject: 'Test' })
        expect(handler).toHaveBeenCalledOnce()
      })
    })

    it('should emit notification:read on read', () => {
      withScope(() => {
        const notifications = createNotifications()
        const handler = vi.fn()
        notifications.on('notification:read', handler)

        const ticket = notifications.send({ subject: 'Test' })
        notifications.read(ticket.id)
        expect(handler).toHaveBeenCalledWith(ticket.id)
      })
    })
  })

  describe('adapter', () => {
    function adapterContext (notifications: ReturnType<typeof createNotifications>): NotificationsAdapterContext {
      return {
        send: notifications.send,
        on: notifications.on,
        off: notifications.off,
      }
    }

    it('should call adapter setup with context', () => {
      withScope(() => {
        const setup = vi.fn()
        const adapter = { setup }
        const notifications = createNotifications()
        adapter.setup(adapterContext(notifications))

        expect(setup).toHaveBeenCalledOnce()
        const ctx = setup.mock.calls[0]![0]
        expect(ctx).toHaveProperty('send')
        expect(ctx).toHaveProperty('on')
        expect(ctx).toHaveProperty('off')
      })
    })

    it('should call adapter dispose on teardown', () => {
      withScope(() => {
        const dispose = vi.fn()
        const adapter = { setup: vi.fn(), dispose }
        const notifications = createNotifications()
        adapter.setup(adapterContext(notifications))

        adapter.dispose()
        expect(dispose).toHaveBeenCalledOnce()
      })
    })

    it('should allow adapter to send notifications', () => {
      withScope(() => {
        const adapter = {
          setup (ctx: NotificationsAdapterContext) {
            ctx.send({ subject: 'From adapter', severity: 'info' })
          },
        }
        const notifications = createNotifications()
        adapter.setup(adapterContext(notifications))

        expect(notifications.values()).toHaveLength(1)
        expect(notifications.values()[0]!.subject).toBe('From adapter')
      })
    })

    it('should allow adapter to listen to events', () => {
      withScope(() => {
        const reads: ID[] = []
        const adapter = {
          setup (ctx: NotificationsAdapterContext) {
            ctx.on('notification:read', (id: unknown) => reads.push(id as ID))
          },
        }
        const notifications = createNotifications()
        adapter.setup(adapterContext(notifications))

        const ticket = notifications.send({ subject: 'Test' })
        notifications.read(ticket.id)
        expect(reads).toEqual([ticket.id])
      })
    })
  })

  describe('dismissal', () => {
    it('should update values when dismissing first of two items', () => {
      withScope(() => {
        const notifications = createNotifications()
        const a = notifications.send({ subject: 'A' })
        notifications.send({ subject: 'B' })

        expect(notifications.values()).toHaveLength(2)

        a.dismiss()

        expect(notifications.values()).toHaveLength(1)
        expect(notifications.values()[0]!.subject).toBe('B')
      })
    })

    it('should update values when dismissing second of two items', () => {
      withScope(() => {
        const notifications = createNotifications()
        notifications.send({ subject: 'A' })
        const b = notifications.send({ subject: 'B' })

        b.dismiss()

        expect(notifications.values()).toHaveLength(1)
        expect(notifications.values()[0]!.subject).toBe('A')
      })
    })

    it('should handle rapid sequential dismissals', () => {
      withScope(() => {
        const notifications = createNotifications()
        const a = notifications.send({ subject: 'A' })
        const b = notifications.send({ subject: 'B' })
        const c = notifications.send({ subject: 'C' })

        a.dismiss()
        b.dismiss()
        c.dismiss()

        expect(notifications.values()).toHaveLength(0)
        expect(notifications.values().length).toBe(0)
      })
    })
  })
})
