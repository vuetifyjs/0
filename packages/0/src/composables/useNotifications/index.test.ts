import { describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { NotificationsAdapterContext } from './index'

import { createNotifications, useNotifications } from './index'

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
        notifications.send({ subject: 'A' })
        notifications.send({ subject: 'B' })
        notifications.send({ subject: 'C' })

        notifications.readAll()
        for (const ticket of notifications.values()) {
          expect(ticket.readAt).toBeInstanceOf(Date)
        }
      })
    })

    it('should archiveAll', () => {
      withScope(() => {
        const notifications = createNotifications()
        notifications.send({ subject: 'A' })
        notifications.send({ subject: 'B' })

        notifications.archiveAll()
        for (const ticket of notifications.values()) {
          expect(ticket.archivedAt).toBeInstanceOf(Date)
        }
      })
    })

    it('should dismiss from queue but keep in registry', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({ subject: 'Test' })
        expect(notifications.values().length).toBe(1)
        expect(notifications.queue.values().length).toBe(1)

        ticket.dismiss()
        expect(notifications.values().length).toBe(1)
        expect(notifications.queue.values().length).toBe(0)
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

    it('should emit notification:unread on unread', () => {
      withScope(() => {
        const notifications = createNotifications()
        const handler = vi.fn()
        notifications.on('notification:unread', handler)

        const ticket = notifications.send({ subject: 'Test' })
        notifications.read(ticket.id)
        notifications.unread(ticket.id)
        expect(handler).toHaveBeenCalledWith(ticket.id)
      })
    })

    it('should emit notification:seen on seen', () => {
      withScope(() => {
        const notifications = createNotifications()
        const handler = vi.fn()
        notifications.on('notification:seen', handler)

        const ticket = notifications.send({ subject: 'Test' })
        notifications.seen(ticket.id)
        expect(handler).toHaveBeenCalledWith(ticket.id)
      })
    })

    it('should emit notification:archived on archive', () => {
      withScope(() => {
        const notifications = createNotifications()
        const handler = vi.fn()
        notifications.on('notification:archived', handler)

        const ticket = notifications.send({ subject: 'Test' })
        notifications.archive(ticket.id)
        expect(handler).toHaveBeenCalledWith(ticket.id)
      })
    })

    it('should emit notification:unarchived on unarchive', () => {
      withScope(() => {
        const notifications = createNotifications()
        const handler = vi.fn()
        notifications.on('notification:unarchived', handler)

        const ticket = notifications.send({ subject: 'Test' })
        notifications.unarchive(ticket.id)
        expect(handler).toHaveBeenCalledWith(ticket.id)
      })
    })

    it('should emit notification:snoozed on snooze', () => {
      withScope(() => {
        const notifications = createNotifications()
        const handler = vi.fn()
        notifications.on('notification:snoozed', handler)

        const ticket = notifications.send({ subject: 'Test' })
        notifications.snooze(ticket.id, new Date(Date.now() + 60_000))
        expect(handler).toHaveBeenCalledWith(ticket.id)
      })
    })

    it('should emit notification:unsnoozed on wake', () => {
      withScope(() => {
        const notifications = createNotifications()
        const handler = vi.fn()
        notifications.on('notification:unsnoozed', handler)

        const ticket = notifications.send({ subject: 'Test' })
        notifications.snooze(ticket.id, new Date(Date.now() + 60_000))
        notifications.wake(ticket.id)
        expect(handler).toHaveBeenCalledWith(ticket.id)
      })
    })
  })

  describe('adapter', () => {
    function adapterContext (notifications: ReturnType<typeof createNotifications>): NotificationsAdapterContext {
      return {
        send: notifications.send,
        register: notifications.register,
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
    it('should remove from queue when dismissing first of two items', () => {
      withScope(() => {
        const notifications = createNotifications()
        const a = notifications.send({ subject: 'A' })
        notifications.send({ subject: 'B' })

        expect(notifications.queue.values()).toHaveLength(2)

        a.dismiss()

        expect(notifications.queue.values()).toHaveLength(1)
        expect(notifications.values()).toHaveLength(2)
      })
    })

    it('should remove from queue when dismissing second of two items', () => {
      withScope(() => {
        const notifications = createNotifications()
        notifications.send({ subject: 'A' })
        const b = notifications.send({ subject: 'B' })

        b.dismiss()

        expect(notifications.queue.values()).toHaveLength(1)
        expect(notifications.values()).toHaveLength(2)
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

        expect(notifications.queue.values()).toHaveLength(0)
        expect(notifications.values()).toHaveLength(3)
      })
    })
  })

  describe('queue', () => {
    it('should add to both registry and queue on send', () => {
      withScope(() => {
        const notifications = createNotifications()
        notifications.send({ subject: 'Test' })

        expect(notifications.values()).toHaveLength(1)
        expect(notifications.queue.values()).toHaveLength(1)
      })
    })

    it('should add to registry only on register', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.register({ subject: 'A' })

        expect(notifications.values()).toHaveLength(1)
        expect(notifications.queue.values()).toHaveLength(0)
        expect(ticket.subject).toBe('A')
        expect(ticket.createdAt).toBeInstanceOf(Date)
        expect(ticket.readAt).toBeNull()
      })
    })

    it('should remove from both on unregister', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({ subject: 'Test' })

        ticket.unregister()

        expect(notifications.values()).toHaveLength(0)
        expect(notifications.queue.values()).toHaveLength(0)
      })
    })

    it('should respect per-notification timeout override', () => {
      withScope(() => {
        const notifications = createNotifications({ timeout: 5000 })
        notifications.send({ subject: 'Custom', timeout: 1000 })

        const queued = notifications.queue.values()[0]!
        expect(queued.timeout).toBe(1000)
      })
    })

    it('should respect persistent timeout', () => {
      withScope(() => {
        vi.useFakeTimers()
        const notifications = createNotifications()
        notifications.send({ subject: 'Persistent', timeout: -1 })

        const queued = notifications.queue.values()[0]!
        expect(queued.timeout).toBe(-1)

        vi.advanceTimersByTime(10_000)

        expect(notifications.queue.values()).toHaveLength(1)
        vi.useRealTimers()
      })
    })

    it('should expose pause and resume', () => {
      withScope(() => {
        const notifications = createNotifications()
        notifications.send({ subject: 'Test' })

        const paused = notifications.queue.pause()
        expect(paused?.isPaused).toBe(true)

        const resumed = notifications.queue.resume()
        expect(resumed?.isPaused).toBe(false)
      })
    })

    it('should use default timeout from options', () => {
      withScope(() => {
        const notifications = createNotifications({ timeout: 7000 })
        notifications.send({ subject: 'Test' })

        const queued = notifications.queue.values()[0]!
        expect(queued.timeout).toBe(7000)
      })
    })

    it('should auto-dismiss from queue but keep in registry', () => {
      withScope(() => {
        vi.useFakeTimers()
        const notifications = createNotifications({ timeout: 1000 })
        notifications.send({ subject: 'Test' })

        expect(notifications.queue.values()).toHaveLength(1)
        expect(notifications.values()).toHaveLength(1)

        vi.advanceTimersByTime(1000)

        expect(notifications.queue.values()).toHaveLength(0)
        expect(notifications.values()).toHaveLength(1)
        vi.useRealTimers()
      })
    })
  })

  describe('onboard', () => {
    it('should hydrate multiple items into registry without queue', () => {
      withScope(() => {
        const notifications = createNotifications()
        const tickets = notifications.onboard([
          { subject: 'First' },
          { subject: 'Second' },
          { subject: 'Third' },
        ])

        expect(tickets).toHaveLength(3)
        expect(notifications.values()).toHaveLength(3)
        expect(notifications.queue.values()).toHaveLength(0)
      })
    })

    it('should return hydrated tickets with lifecycle methods', () => {
      withScope(() => {
        const notifications = createNotifications()
        const tickets = notifications.onboard([
          { id: 'ob-1', subject: 'Onboarded' },
        ])

        const ticket = tickets[0]!
        expect(ticket.id).toBe('ob-1')
        expect(ticket.subject).toBe('Onboarded')
        expect(ticket.createdAt).toBeInstanceOf(Date)
        expect(ticket.readAt).toBeNull()
        expect(ticket.seenAt).toBeNull()
        expect(ticket.archivedAt).toBeNull()
        expect(ticket.snoozedUntil).toBeNull()

        // Lifecycle methods work
        ticket.read()
        expect(notifications.get('ob-1')?.readAt).toBeInstanceOf(Date)

        ticket.archive()
        expect(notifications.get('ob-1')?.archivedAt).toBeInstanceOf(Date)
      })
    })

    it('should handle empty array', () => {
      withScope(() => {
        const notifications = createNotifications()
        const tickets = notifications.onboard([])

        expect(tickets).toHaveLength(0)
        expect(notifications.values()).toHaveLength(0)
      })
    })
  })

  describe('fallback', () => {
    it('should return a fallback context when called outside component instance', () => {
      const notifications = useNotifications()

      expect(notifications).toBeDefined()
      expect(notifications.collection).toBeInstanceOf(Map)
      expect(notifications.size).toBe(0)
    })

    it('should return a stub ticket from send', () => {
      const notifications = useNotifications()
      const ticket = notifications.send({ subject: 'Test' })

      expect(ticket).toBeDefined()
      expect(ticket.id).toBe('')
      expect(ticket.createdAt).toBeInstanceOf(Date)
      expect(ticket.readAt).toBeNull()
      expect(ticket.seenAt).toBeNull()
      expect(ticket.archivedAt).toBeNull()
      expect(ticket.snoozedUntil).toBeNull()
    })

    it('should have noop lifecycle methods', () => {
      const notifications = useNotifications()

      expect(() => {
        notifications.read('any')
        notifications.unread('any')
        notifications.seen('any')
        notifications.archive('any')
        notifications.unarchive('any')
        notifications.snooze('any', new Date())
        notifications.wake('any')
        notifications.readAll()
        notifications.archiveAll()
        notifications.clear()
      }).not.toThrow()
    })

    it('should have working stub methods on send ticket', () => {
      const notifications = useNotifications()
      const ticket = notifications.send({ subject: 'Test' })

      expect(() => {
        ticket.read()
        ticket.unread()
        ticket.seen()
        ticket.archive()
        ticket.unarchive()
        ticket.snooze(new Date())
        ticket.wake()
        ticket.dismiss()
        ticket.unregister()
      }).not.toThrow()
    })

    it('should return empty arrays from collection methods', () => {
      const notifications = useNotifications()

      expect(notifications.keys()).toEqual([])
      expect(notifications.values()).toEqual([])
      expect(notifications.entries()).toEqual([])
      expect(notifications.has('any')).toBe(false)
      expect(notifications.get('any')).toBeUndefined()
      expect(notifications.browse('any')).toBeUndefined()
      expect(notifications.lookup(0)).toBeUndefined()
    })

    it('should have working queue stubs', () => {
      const notifications = useNotifications()
      const { queue } = notifications

      expect(queue.collection).toBeInstanceOf(Map)
      expect(queue.size).toBe(0)
      expect(queue.has('any')).toBe(false)
      expect(queue.get('any')).toBeUndefined()
      expect(queue.keys()).toEqual([])
      expect(queue.values()).toEqual([])
      expect(queue.entries()).toEqual([])

      // Noop methods should not throw
      queue.dispose()
      queue.clear()
      queue.reindex()
      queue.offboard([])
    })

    it('should execute batch callback and return its result', () => {
      const notifications = useNotifications()
      const result = notifications.batch(() => 42)
      expect(result).toBe(42)

      const queueResult = notifications.queue.batch(() => 'ok')
      expect(queueResult).toBe('ok')
    })
  })
})
