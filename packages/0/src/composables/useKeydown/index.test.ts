import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useKeydown } from './index'

// Mock Vue's lifecycle hooks
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onMounted: vi.fn(),
    getCurrentScope: vi.fn(() => true),
    onScopeDispose: vi.fn(),
  }
})

describe('useKeydown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock document.addEventListener and removeEventListener
    vi.spyOn(document, 'addEventListener')
    vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('basic functionality', () => {
    it('should return isActive, start, and stop', () => {
      const handler = { key: 'Enter', handler: vi.fn() }
      const result = useKeydown(handler)

      expect(result).toHaveProperty('isActive')
      expect(result).toHaveProperty('start')
      expect(result).toHaveProperty('stop')
      expect(typeof result.isActive.value).toBe('boolean')
      expect(typeof result.start).toBe('function')
      expect(typeof result.stop).toBe('function')
    })

    it('should accept single handler', () => {
      const handler = { key: 'Enter', handler: vi.fn() }

      expect(() => useKeydown(handler)).not.toThrow()
    })

    it('should accept array of handlers', () => {
      const handlers = [
        { key: 'Enter', handler: vi.fn() },
        { key: 'Escape', handler: vi.fn() },
      ]

      expect(() => useKeydown(handlers)).not.toThrow()
    })
  })

  describe('event handling', () => {
    it('should call handler when matching key is pressed', () => {
      const mockHandler = vi.fn()
      const handler = { key: 'Enter', handler: mockHandler }
      useKeydown(handler)

      // Listener is auto-started, simulate keydown event
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(event)

      expect(mockHandler).toHaveBeenCalledWith(event)
    })

    it('should not call handler when non-matching key is pressed', () => {
      const mockHandler = vi.fn()
      const handler = { key: 'Enter', handler: mockHandler }
      useKeydown(handler)

      // Simulate keydown event with different key
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)

      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should prevent default when preventDefault is true', () => {
      const mockHandler = vi.fn()
      const handler = { key: 'Enter', handler: mockHandler, preventDefault: true }
      useKeydown(handler)

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      document.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should stop propagation when stopPropagation is true', () => {
      const mockHandler = vi.fn()
      const handler = { key: 'Enter', handler: mockHandler, stopPropagation: true }
      useKeydown(handler)

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation')
      document.dispatchEvent(event)

      expect(stopPropagationSpy).toHaveBeenCalled()
    })
  })

  describe('lifecycle management', () => {
    it('should auto-start listener on initialization', () => {
      const handler = { key: 'Enter', handler: vi.fn() }
      const { isActive } = useKeydown(handler)

      expect(isActive.value).toBe(true)
      expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), undefined)
    })

    it('should stop listener when stop is called', () => {
      const handler = { key: 'Enter', handler: vi.fn() }
      const { stop, isActive } = useKeydown(handler)

      stop()

      expect(isActive.value).toBe(false)
      expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), undefined)
    })

    it('should restart listener when start is called after stop', () => {
      const handler = { key: 'Enter', handler: vi.fn() }
      const { stop, start, isActive } = useKeydown(handler)

      stop()
      expect(isActive.value).toBe(false)

      start()
      expect(isActive.value).toBe(true)
      // addEventListener called twice: once on init, once on restart
      expect(document.addEventListener).toHaveBeenCalledTimes(2)
    })

    it('should not call handler when stopped', () => {
      const mockHandler = vi.fn()
      const handler = { key: 'Enter', handler: mockHandler }
      const { stop } = useKeydown(handler)

      stop()

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(event)

      expect(mockHandler).not.toHaveBeenCalled()
    })
  })
})
