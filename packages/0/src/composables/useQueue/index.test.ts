import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, provide } from 'vue'

import { createQueue, createQueueContext, useQueue } from './index'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
  }
})

const mockProvide = vi.mocked(provide)
const mockInject = vi.mocked(inject)

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

  describe('offboard', () => {
    it('should offboard multiple tickets at once', () => {
      const queue = createQueue({ timeout: 5000 })
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })
      const ticket3 = queue.register({ value: 'third' })

      expect(queue.size).toBe(3)

      queue.offboard([ticket1.id, ticket3.id])

      expect(queue.size).toBe(1)
      expect(queue.has(ticket1.id)).toBe(false)
      expect(queue.has(ticket2.id)).toBe(true)
      expect(queue.has(ticket3.id)).toBe(false)
    })

    it('should clear timeouts for offboarded tickets', () => {
      const queue = createQueue({ timeout: 3000 })
      const ticket1 = queue.register({ value: 'first' })
      queue.register({ value: 'second' })

      queue.offboard([ticket1.id])

      // Advance time - should not cause issues from cleared timeout
      vi.advanceTimersByTime(5000)

      // Second ticket should have been resumed and timed out
      expect(queue.size).toBe(0)
    })

    it('should skip non-existent ids when offboarding', () => {
      const queue = createQueue({ timeout: 5000 })
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })

      expect(queue.size).toBe(2)

      // Include non-existent id
      queue.offboard([ticket1.id, 'non-existent', ticket2.id])

      expect(queue.size).toBe(0)
    })

    it('should resume next ticket when first is offboarded', () => {
      const queue = createQueue({ timeout: 5000 })
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })

      expect(ticket1.isPaused).toBe(false)
      expect(ticket2.isPaused).toBe(true)

      queue.offboard([ticket1.id])

      const updatedTicket2 = queue.get(ticket2.id)
      expect(updatedTicket2?.isPaused).toBe(false)
    })

    it('should not resume if first ticket was not offboarded', () => {
      const queue = createQueue({ timeout: 5000 })
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })
      const ticket3 = queue.register({ value: 'third' })

      expect(ticket1.isPaused).toBe(false)

      // Only offboard non-first tickets
      queue.offboard([ticket2.id, ticket3.id])

      // First ticket should still be active
      const updatedTicket1 = queue.get(ticket1.id)
      expect(updatedTicket1?.isPaused).toBe(false)
      expect(queue.size).toBe(1)
    })

    it('should handle offboarding all tickets', () => {
      const queue = createQueue({ timeout: 5000 })
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })
      const ticket3 = queue.register({ value: 'third' })

      queue.offboard([ticket1.id, ticket2.id, ticket3.id])

      expect(queue.size).toBe(0)

      // Advance time - no timeouts should fire
      vi.advanceTimersByTime(10_000)

      expect(queue.size).toBe(0)
    })

    it('should handle empty offboard call', () => {
      const queue = createQueue({ timeout: 5000 })
      queue.register({ value: 'first' })

      expect(queue.size).toBe(1)

      queue.offboard([])

      expect(queue.size).toBe(1)
    })

    it('should clear timeout for first ticket before delegating to registry', () => {
      const queue = createQueue({ timeout: 2000 })
      const ticket1 = queue.register({ value: 'first' })
      const ticket2 = queue.register({ value: 'second' })

      // Advance partway through first ticket's timeout
      vi.advanceTimersByTime(1000)

      // Offboard first ticket
      queue.offboard([ticket1.id])

      // Second ticket should now be active and start its timeout
      const updatedTicket2 = queue.get(ticket2.id)
      expect(updatedTicket2?.isPaused).toBe(false)

      // Advance remaining time - second ticket should timeout
      vi.advanceTimersByTime(2000)

      expect(queue.size).toBe(0)
    })

    it('should handle offboarding tickets with different timeout states', () => {
      const queue = createQueue({ timeout: 5000 })
      const ticket1 = queue.register({ value: 'active', timeout: 3000 })
      const ticket2 = queue.register({ value: 'paused' })
      const ticket3 = queue.register({ value: 'persistent', timeout: -1 })

      expect(ticket1.isPaused).toBe(false)
      expect(ticket2.isPaused).toBe(true)
      expect(ticket3.timeout).toBe(-1)

      queue.offboard([ticket1.id, ticket3.id])

      expect(queue.size).toBe(1)
      expect(queue.has(ticket2.id)).toBe(true)

      // Second ticket should now be active
      const updatedTicket2 = queue.get(ticket2.id)
      expect(updatedTicket2?.isPaused).toBe(false)
    })
  })
})

describe('createQueueContext', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return a trinity tuple with 3 elements', () => {
    const result = createQueueContext()

    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function') // useContext
    expect(typeof result[1]).toBe('function') // provideContext
    expect(result[2]).toBeDefined() // default context
  })

  it('should create a queue context with default options', () => {
    const [, , context] = createQueueContext()

    expect(context).toHaveProperty('register')
    expect(context).toHaveProperty('unregister')
    expect(context).toHaveProperty('pause')
    expect(context).toHaveProperty('resume')
    expect(context).toHaveProperty('clear')
    expect(context).toHaveProperty('dispose')
    expect(context).toHaveProperty('offboard')
  })

  it('should pass timeout option to queue', () => {
    const [, , context] = createQueueContext({ timeout: 10_000 })

    const ticket = context.register({ value: 'test' })

    expect(ticket.timeout).toBe(10_000)
  })

  it('should use custom namespace', () => {
    const [useQueueContext] = createQueueContext({ namespace: 'custom:queue' })

    mockInject.mockReturnValue(undefined)

    expect(() => useQueueContext()).toThrow()
    expect(mockInject).toHaveBeenCalledWith('custom:queue', undefined)
  })

  it('should use default namespace v0:queue', () => {
    const [useQueueContext] = createQueueContext()

    mockInject.mockReturnValue(undefined)

    expect(() => useQueueContext()).toThrow()
    expect(mockInject).toHaveBeenCalledWith('v0:queue', undefined)
  })

  it('should provide context with provideContext', () => {
    const [, provideContext, context] = createQueueContext()

    provideContext()

    expect(mockProvide).toHaveBeenCalledWith('v0:queue', context)
  })

  it('should allow providing custom context', () => {
    const [, provideContext] = createQueueContext()
    const customContext = createQueue({ timeout: 1000 })

    provideContext(customContext as any)

    expect(mockProvide).toHaveBeenCalledWith('v0:queue', customContext)
  })

  it('should provide context at app level', () => {
    const [, provideContext, context] = createQueueContext()
    const mockApp = {
      provide: vi.fn(),
    } as any

    provideContext(undefined, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:queue', context)
  })

  it('should pass events option to underlying registry', () => {
    const [, , context] = createQueueContext({ events: true })

    const callback = vi.fn()
    context.on('register:ticket', callback)

    context.register({ value: 'test' })

    expect(callback).toHaveBeenCalledOnce()
  })
})

describe('useQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should retrieve queue context from default namespace', () => {
    const mockContext = createQueue()
    mockInject.mockReturnValue(mockContext)

    const result = useQueue()

    expect(mockInject).toHaveBeenCalledWith('v0:queue', undefined)
    expect(result).toBe(mockContext)
  })

  it('should retrieve queue context from custom namespace', () => {
    const mockContext = createQueue()
    mockInject.mockReturnValue(mockContext)

    const result = useQueue('custom:notification-queue')

    expect(mockInject).toHaveBeenCalledWith('custom:notification-queue', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useQueue()).toThrow()
  })
})
