// Composables
import { createQueue } from './index'

// Utilities
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('createQueue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('timeout management', () => {
    it('should use default timeout when not specified', () => {
      const queue = createQueue({ timeout: 5000 })
      const ticket = queue.register({ value: 'test' })

      expect(ticket.timeout).toBe(5000)
    })

    it('should use custom timeout when specified', () => {
      const queue = createQueue({ timeout: 5000 })
      const ticket = queue.register({ value: 'test', timeout: 3000 })

      expect(ticket.timeout).toBe(3000)
    })

    it('should create persistent ticket with timeout -1', () => {
      const queue = createQueue()
      const ticket = queue.register({ value: 'persistent', timeout: -1 })

      expect(ticket.timeout).toBe(-1)
      expect(queue.size).toBe(1)

      // Advance time significantly - ticket should not be removed
      vi.advanceTimersByTime(10_000)

      expect(queue.size).toBe(1)
    })

    it('should automatically remove ticket after timeout', () => {
      const queue = createQueue({ timeout: 3000 })
      queue.register({ value: 'first' })

      expect(queue.size).toBe(1)

      // Advance time past the timeout
      vi.advanceTimersByTime(3000)

      expect(queue.size).toBe(0)
    })

    it('should not start timeout for paused tickets', () => {
      const queue = createQueue({ timeout: 3000 })
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })

      expect(ticket1.isPaused).toBe(false)
      expect(ticket2.isPaused).toBe(true)

      // Advance time past timeout
      vi.advanceTimersByTime(3000)

      // First should be removed, second should remain
      expect(queue.size).toBe(1)
      expect(queue.get(ticket2.id)).toBeDefined()
    })
  })

  describe('pause and resume', () => {
    it('should pause the first ticket', () => {
      const queue = createQueue({ timeout: 5000 })
      const ticket = queue.register({ value: 'test' })

      expect(ticket.isPaused).toBe(false)

      queue.pause()

      const updatedTicket = queue.get(ticket.id)
      expect(updatedTicket?.isPaused).toBe(true)
    })

    it('should return undefined when pausing already paused ticket', () => {
      const queue = createQueue()
      queue.register({ value: 'test' })
      queue.pause()

      const result = queue.pause()

      expect(result).toBeUndefined()
    })

    it('should return undefined when pausing empty queue', () => {
      const queue = createQueue()
      const result = queue.pause()

      expect(result).toBeUndefined()
    })

    it('should resume the first paused ticket', () => {
      const queue = createQueue({ timeout: 5000 })
      const ticket = queue.register({ value: 'test' })
      queue.pause()

      queue.resume()

      const updatedTicket = queue.get(ticket.id)
      expect(updatedTicket?.isPaused).toBe(false)
    })

    it('should return undefined when resuming non-paused ticket', () => {
      const queue = createQueue()
      queue.register({ value: 'test' })

      const result = queue.resume()

      expect(result).toBeUndefined()
    })

    it('should return undefined when resuming empty queue', () => {
      const queue = createQueue()
      const result = queue.resume()

      expect(result).toBeUndefined()
    })

    it('should allow pause and resume cycle', () => {
      const queue = createQueue({ timeout: 5000 })
      const ticket = queue.register({ value: 'test' })

      expect(ticket.isPaused).toBe(false)

      queue.pause()
      const pausedTicket = queue.get(ticket.id)
      expect(pausedTicket?.isPaused).toBe(true)

      queue.resume()
      const resumedTicket = queue.get(ticket.id)
      expect(resumedTicket?.isPaused).toBe(false)
    })
  })

  describe('queue progression', () => {
    it('should automatically resume next ticket when first is removed', () => {
      const queue = createQueue({ timeout: 3000 })
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })

      expect(ticket1.isPaused).toBe(false)
      expect(ticket2.isPaused).toBe(true)

      // Remove first ticket
      queue.unregister(ticket1.id)

      // Second ticket should now be active
      const updatedTicket2 = queue.get(ticket2.id)
      expect(updatedTicket2?.isPaused).toBe(false)
    })

    it('should remove first ticket automatically after timeout', async () => {
      const queue = createQueue({ timeout: 1000 })
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })

      expect(queue.size).toBe(2)
      expect(ticket1.isPaused).toBe(false)
      expect(ticket2.isPaused).toBe(true)

      await vi.advanceTimersByTimeAsync(1000)
      expect(queue.size).toBe(1)
      expect(queue.get(ticket1.id)).toBeUndefined()

      const updatedTicket2 = queue.get(ticket2.id)
      expect(updatedTicket2).toBeDefined()
      expect(updatedTicket2?.isPaused).toBe(false)
    })

    it('should handle tickets with different timeout values', async () => {
      const queue = createQueue({ timeout: 3000 })
      const ticket1 = queue.register({ value: 'quick', timeout: 1000 })
      const ticket2 = queue.register({ value: 'slow', timeout: 5000 })

      expect(queue.size).toBe(2)
      expect(ticket1.isPaused).toBe(false)
      expect(ticket2.isPaused).toBe(true)

      await vi.advanceTimersByTimeAsync(1000)
      expect(queue.size).toBe(1)
      expect(queue.get(ticket1.id)).toBeUndefined()

      const updatedTicket2 = queue.get(ticket2.id)
      expect(updatedTicket2?.isPaused).toBe(false)
    })
  })

  describe('unregister', () => {
    it('should unregister first ticket when no id provided', () => {
      const queue = createQueue()
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })

      const removed = queue.unregister()

      expect(removed?.id).toBe(ticket1.id)
      expect(queue.size).toBe(1)
      expect(queue.get(ticket2.id)).toBeDefined()
    })

    it('should unregister specific ticket by id', () => {
      const queue = createQueue()
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })

      const removed = queue.unregister(ticket2.id)

      expect(removed?.id).toBe(ticket2.id)
      expect(queue.size).toBe(1)
      expect(queue.get(ticket1.id)).toBeDefined()
    })

    it('should return undefined when unregistering non-existent ticket', () => {
      const queue = createQueue()
      const result = queue.unregister('non-existent')

      expect(result).toBeUndefined()
    })

    it('should return undefined when unregistering from empty queue', () => {
      const queue = createQueue()
      const result = queue.unregister()

      expect(result).toBeUndefined()
    })

    it('should clear timeout when unregistering', () => {
      const queue = createQueue({ timeout: 5000 })
      const ticket = queue.register({ value: 'test' })

      queue.unregister(ticket.id)

      // Advance time past timeout
      vi.advanceTimersByTime(6000)

      // Should remain at size 0, no resurrection
      expect(queue.size).toBe(0)
    })
  })

  describe('dismiss', () => {
    it('should allow ticket to dismiss itself', () => {
      const queue = createQueue()
      const ticket = queue.register({ value: 'test' })

      expect(queue.size).toBe(1)

      ticket.dismiss()

      expect(queue.size).toBe(0)
      expect(queue.get(ticket.id)).toBeUndefined()
    })

    it('should trigger next ticket when dismissed', () => {
      const queue = createQueue({ timeout: 3000 })
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })

      expect(ticket2.isPaused).toBe(true)

      ticket1.dismiss()

      const updatedTicket2 = queue.get(ticket2.id)
      expect(updatedTicket2?.isPaused).toBe(false)
    })
  })

  describe('clear and dispose', () => {
    it('should clear all tickets and timeouts', () => {
      const queue = createQueue({ timeout: 5000 })
      queue.register({ value: 'first' })
      queue.register({ value: 'second' })

      expect(queue.size).toBe(2)

      queue.clear()

      expect(queue.size).toBe(0)

      // Advance time - no tickets should reappear
      vi.advanceTimersByTime(6000)
      expect(queue.size).toBe(0)
    })

    it('should dispose queue and clean up resources', () => {
      const queue = createQueue({ timeout: 5000, events: true })
      queue.register({ value: 'test' })

      const callback = vi.fn()
      queue.on('register:ticket', callback)

      queue.dispose()

      expect(queue.size).toBe(0)

      // Try to register after disposal
      queue.register({ value: 'after-dispose' })

      // Callback should not be called since listeners are cleared
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('isPaused state', () => {
    it('should mark first ticket as not paused', () => {
      const queue = createQueue()
      const ticket = queue.register({ value: 'first' })

      expect(ticket.isPaused).toBe(false)
    })

    it('should mark subsequent tickets as paused', () => {
      const queue = createQueue()
      queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })
      const ticket3 = queue.register({ value: 'third' })

      expect(ticket2.isPaused).toBe(true)
      expect(ticket3.isPaused).toBe(true)
    })

    it('should update isPaused when ticket becomes first', () => {
      const queue = createQueue({ timeout: 1000 })
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })

      expect(ticket2.isPaused).toBe(true)

      queue.unregister(ticket1.id)

      const updatedTicket2 = queue.get(ticket2.id)
      expect(updatedTicket2?.isPaused).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should use default timeout when timeout is not provided', () => {
      const queue = createQueue({ timeout: 3000 })
      const ticket = queue.register({ value: 'test' })

      expect(ticket.timeout).toBe(3000)
    })

    it('should handle registering while queue is processing', () => {
      const queue = createQueue({ timeout: 1000 })
      const ticket1 = queue.register({ value: 'first' })

      vi.advanceTimersByTime(500)

      const ticket2 = queue.register({ value: 'second' })

      expect(ticket1.isPaused).toBe(false)
      expect(ticket2.isPaused).toBe(true)

      vi.advanceTimersByTime(500)

      expect(queue.size).toBe(1)
      expect(queue.get(ticket2.id)).toBeDefined()
    })

    it('should handle explicit undefined timeout as no timeout', () => {
      const queue = createQueue({ timeout: 3000 })
      const ticket = queue.register({ value: 'test', timeout: undefined })

      expect(ticket.timeout).toBeUndefined()

      vi.advanceTimersByTime(5000)

      expect(queue.size).toBe(1)
    })

    it('should handle explicit timeout of 0 as immediate dismissal', () => {
      const queue = createQueue({ timeout: 3000 })
      const ticket = queue.register({ value: 'test', timeout: 0 })

      expect(ticket.timeout).toBe(0)
      expect(queue.size).toBe(1)

      vi.advanceTimersByTime(0)

      expect(queue.size).toBe(0)
    })

    it('should clear all timeouts when queue is cleared mid-execution', () => {
      const queue = createQueue({ timeout: 1000 })
      queue.register({ value: 'first' })
      queue.register({ value: 'second' })
      queue.register({ value: 'third' })

      expect(queue.size).toBe(3)

      vi.advanceTimersByTime(500)

      queue.clear()

      expect(queue.size).toBe(0)

      vi.advanceTimersByTime(1000)

      expect(queue.size).toBe(0)
    })

    it('should handle multiple tickets with timeout -1', () => {
      const queue = createQueue({ timeout: -1 })
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })

      expect(ticket1.timeout).toBe(-1)
      expect(ticket2.timeout).toBe(-1)
      expect(ticket1.isPaused).toBe(false)
      expect(ticket2.isPaused).toBe(true)

      vi.advanceTimersByTime(10_000)

      expect(queue.size).toBe(2)
    })

    it('should not start timeout when pausing immediately after registration', () => {
      const queue = createQueue({ timeout: 1000 })
      const ticket = queue.register({ value: 'test' })

      expect(ticket.isPaused).toBe(false)

      queue.pause()

      vi.advanceTimersByTime(2000)

      expect(queue.size).toBe(1)
    })
  })
})
