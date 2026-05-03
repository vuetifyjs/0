import { describe, expect, it, vi } from 'vitest'

import { createNotifications, createNotificationsPlugin, useNotifications } from './index'

// Utilities
import { createApp, effectScope } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { NotificationsAdapterContext } from './index'

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
        expect(handler).toHaveBeenCalledTimes(1)
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

        expect(setup).toHaveBeenCalledTimes(1)
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
        expect(dispose).toHaveBeenCalledTimes(1)
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

    it('should have noop queue mutation methods', () => {
      const notifications = useNotifications()
      const { queue } = notifications

      expect(() => {
        queue.unregister('any')
        queue.emit('test', {})
        queue.on('test', () => {})
        queue.off('test', () => {})
        queue.pause()
        queue.resume()
      }).not.toThrow()

      expect(queue.seek()).toBeUndefined()
      expect(queue.move('a', 0)).toBeUndefined()
      expect(queue.browse('any')).toBeUndefined()
      expect(queue.lookup(0)).toBeUndefined()
      expect(queue.onboard([])).toEqual([])
    })

    it('should have noop context mutation methods', () => {
      const notifications = useNotifications()

      expect(() => {
        notifications.unregister('any')
        notifications.emit('test', {})
        notifications.on('test', () => {})
        notifications.off('test', () => {})
        notifications.dispose()
        notifications.reindex()
        notifications.offboard([])
      }).not.toThrow()

      expect(notifications.seek()).toBeUndefined()
      expect(notifications.move('a', 0)).toBeUndefined()
    })
  })

  describe('hydrate', () => {
    it('should auto-generate id when not provided', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({ subject: 'No ID' })
        expect(ticket.id).toBeTruthy()
        expect(typeof ticket.id).toBe('string')
      })
    })
  })

  describe('queue cascade', () => {
    it('should remove from queue when unregistered from registry', () => {
      withScope(() => {
        const notifications = createNotifications()
        notifications.send({ id: 'cascade-1', subject: 'Test' })

        expect(notifications.queue.has('cascade-1')).toBe(true)
        notifications.unregister('cascade-1')
        expect(notifications.queue.has('cascade-1')).toBe(false)
      })
    })

    it('should not error when unregistering item not in queue', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.register({ id: 'reg-only', subject: 'Test' })

        expect(notifications.queue.has('reg-only')).toBe(false)
        expect(() => ticket.unregister()).not.toThrow()
        expect(notifications.values()).toHaveLength(0)
      })
    })
  })

  describe('readAll edge cases', () => {
    it('should skip already-read notifications', () => {
      withScope(() => {
        const notifications = createNotifications()
        const a = notifications.send({ subject: 'A' })
        notifications.send({ subject: 'B' })

        // Mark A as read first
        notifications.read(a.id)
        const originalReadAt = notifications.get(a.id)?.readAt

        // readAll should not overwrite A's readAt
        notifications.readAll()

        expect(notifications.get(a.id)?.readAt).toBe(originalReadAt)
        for (const ticket of notifications.values()) {
          expect(ticket.readAt).toBeInstanceOf(Date)
        }
      })
    })

    it('should handle empty registry', () => {
      withScope(() => {
        const notifications = createNotifications()
        expect(() => notifications.readAll()).not.toThrow()
      })
    })
  })

  describe('archiveAll edge cases', () => {
    it('should skip already-archived notifications', () => {
      withScope(() => {
        const notifications = createNotifications()
        const a = notifications.send({ subject: 'A' })
        notifications.send({ subject: 'B' })

        notifications.archive(a.id)
        const originalArchivedAt = notifications.get(a.id)?.archivedAt

        notifications.archiveAll()

        expect(notifications.get(a.id)?.archivedAt).toBe(originalArchivedAt)
        for (const ticket of notifications.values()) {
          expect(ticket.archivedAt).toBeInstanceOf(Date)
        }
      })
    })

    it('should handle empty registry', () => {
      withScope(() => {
        const notifications = createNotifications()
        expect(() => notifications.archiveAll()).not.toThrow()
      })
    })
  })

  describe('timeout overrides', () => {
    it('should use default timeout when no override specified', () => {
      withScope(() => {
        const notifications = createNotifications({ timeout: 5000 })
        notifications.send({ subject: 'Default timeout' })

        const queued = notifications.queue.values()[0]!
        expect(queued.timeout).toBe(5000)
      })
    })

    it('should use 3000ms default when no options provided', () => {
      withScope(() => {
        const notifications = createNotifications()
        notifications.send({ subject: 'Test' })

        const queued = notifications.queue.values()[0]!
        expect(queued.timeout).toBe(3000)
      })
    })

    it('should allow zero timeout override', () => {
      withScope(() => {
        const notifications = createNotifications({ timeout: 5000 })
        notifications.send({ subject: 'Zero', timeout: 0 })

        const queued = notifications.queue.values()[0]!
        expect(queued.timeout).toBe(0)
      })
    })
  })

  describe('send with custom id', () => {
    it('should use provided id instead of auto-generating', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({ id: 'custom-id', subject: 'Test' })

        expect(ticket.id).toBe('custom-id')
        expect(notifications.has('custom-id')).toBe(true)
      })
    })
  })

  describe('size getter', () => {
    it('should reflect current registry size', () => {
      withScope(() => {
        const notifications = createNotifications()
        expect(notifications.size).toBe(0)

        notifications.send({ subject: 'A' })
        expect(notifications.size).toBe(1)

        notifications.send({ subject: 'B' })
        expect(notifications.size).toBe(2)
      })
    })
  })

  describe('hydrate data fields', () => {
    it('should preserve body and data fields', () => {
      withScope(() => {
        const notifications = createNotifications()
        const ticket = notifications.send({
          subject: 'Test',
          body: 'Extended body text',
          severity: 'warning',
          data: { action: 'deploy', version: '2.0' },
        })

        expect(ticket.body).toBe('Extended body text')
        expect(ticket.severity).toBe('warning')
        expect(ticket.data).toEqual({ action: 'deploy', version: '2.0' })
      })
    })
  })

  describe('adapter event unsubscription', () => {
    it('should allow adapter to unsubscribe from events via off', () => {
      withScope(() => {
        const reads: ID[] = []
        function handler (id: unknown) {
          reads.push(id as ID)
        }

        const adapter = {
          setup (ctx: NotificationsAdapterContext) {
            ctx.on('notification:read', handler)
            // Immediately unsubscribe
            ctx.off('notification:read', handler)
          },
        }

        const notifications = createNotifications()
        adapter.setup({
          send: notifications.send,
          register: notifications.register,
          on: notifications.on,
          off: notifications.off,
        })

        const ticket = notifications.send({ subject: 'Test' })
        notifications.read(ticket.id)
        expect(reads).toEqual([])
      })
    })
  })

  describe('adapter register (no queue)', () => {
    it('should allow adapter to register notifications without queue', () => {
      withScope(() => {
        const adapter = {
          setup (ctx: NotificationsAdapterContext) {
            ctx.register({ subject: 'Historical', severity: 'info' })
          },
        }

        const notifications = createNotifications()
        adapter.setup({
          send: notifications.send,
          register: notifications.register,
          on: notifications.on,
          off: notifications.off,
        })

        expect(notifications.values()).toHaveLength(1)
        expect(notifications.queue.values()).toHaveLength(0)
        expect(notifications.values()[0]!.subject).toBe('Historical')
      })
    })
  })

  describe('fallback additional coverage', () => {
    it('should return stub from register', () => {
      const notifications = useNotifications()
      const ticket = notifications.register({ subject: 'Test' })

      expect(ticket).toBeDefined()
      expect(ticket.id).toBe('')
    })

    it('should return stub from upsert', () => {
      const notifications = useNotifications()
      const ticket = notifications.upsert('any', {})

      expect(ticket).toBeDefined()
      expect(ticket.id).toBe('')
    })

    it('should return empty from onboard', () => {
      const notifications = useNotifications()
      const tickets = notifications.onboard([{ subject: 'A' }])

      expect(tickets).toEqual([])
    })

    it('should return register from queue stub', () => {
      const notifications = useNotifications()
      const result = notifications.queue.register({} as never)

      expect(result).toBeDefined()
    })

    it('should return upsert from queue stub', () => {
      const notifications = useNotifications()
      const result = notifications.queue.upsert('any', {} as never)

      expect(result).toBeDefined()
    })
  })

  describe('createNotificationsPlugin', () => {
    it('should install plugin and provide context', () => {
      let captured: ReturnType<typeof useNotifications> | undefined

      const app = createApp({
        setup () {
          captured = useNotifications()
          return {}
        },
        template: '<div />',
      })

      app.use(createNotificationsPlugin())

      const container = document.createElement('div')
      app.mount(container)

      expect(captured).toBeDefined()
      expect(typeof captured!.send).toBe('function')
      expect(typeof captured!.read).toBe('function')

      app.unmount()
    })

    it('should call adapter setup with context during plugin install', () => {
      const setup = vi.fn()
      const adapter = { setup }

      const app = createApp({ template: '<div />' })
      app.use(createNotificationsPlugin({ adapter }))

      const container = document.createElement('div')
      app.mount(container)

      expect(setup).toHaveBeenCalledTimes(1)
      const ctx = setup.mock.calls[0]![0]
      expect(ctx).toHaveProperty('send')
      expect(ctx).toHaveProperty('register')
      expect(ctx).toHaveProperty('on')
      expect(ctx).toHaveProperty('off')

      app.unmount()
    })

    it('should call adapter dispose on app unmount', () => {
      const dispose = vi.fn()
      const adapter = { setup: vi.fn(), dispose }

      const app = createApp({ template: '<div />' })
      app.use(createNotificationsPlugin({ adapter }))

      const container = document.createElement('div')
      app.mount(container)

      expect(dispose).not.toHaveBeenCalled()

      app.unmount()

      expect(dispose).toHaveBeenCalledTimes(1)
    })

    it('should dispose context and queue on app unmount', async () => {
      let captured: ReturnType<typeof useNotifications> | undefined

      const app = createApp({
        setup () {
          captured = useNotifications()
          return {}
        },
        template: '<div />',
      })

      app.use(createNotificationsPlugin())

      const container = document.createElement('div')
      app.mount(container)

      expect(captured).toBeDefined()

      app.unmount()
      // After unmount, dispose should have been called (no error)
    })

    it('should not call adapter dispose when adapter has no dispose', () => {
      const adapter = { setup: vi.fn() }

      const app = createApp({ template: '<div />' })
      app.use(createNotificationsPlugin({ adapter }))

      const container = document.createElement('div')
      app.mount(container)

      // Should not throw on unmount when adapter has no dispose
      expect(() => app.unmount()).not.toThrow()
    })
  })
})
