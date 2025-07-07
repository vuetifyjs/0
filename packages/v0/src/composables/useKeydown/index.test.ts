import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
    it('should return startListening and stopListening functions', () => {
      const handler = { key: 'Enter', handler: vi.fn() }
      const result = useKeydown(handler)

      expect(result).toHaveProperty('startListening')
      expect(result).toHaveProperty('stopListening')
      expect(typeof result.startListening).toBe('function')
      expect(typeof result.stopListening).toBe('function')
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
      const { startListening } = useKeydown(handler)

      startListening()

      // Simulate keydown event
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(event)

      expect(mockHandler).toHaveBeenCalledWith(event)
    })

    it('should not call handler when non-matching key is pressed', () => {
      const mockHandler = vi.fn()
      const handler = { key: 'Enter', handler: mockHandler }
      const { startListening } = useKeydown(handler)

      startListening()

      // Simulate keydown event with different key
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)

      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should prevent default when preventDefault is true', () => {
      const mockHandler = vi.fn()
      const handler = { key: 'Enter', handler: mockHandler, preventDefault: true }
      const { startListening } = useKeydown(handler)

      startListening()

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      document.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should stop propagation when stopPropagation is true', () => {
      const mockHandler = vi.fn()
      const handler = { key: 'Enter', handler: mockHandler, stopPropagation: true }
      const { startListening } = useKeydown(handler)

      startListening()

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation')
      document.dispatchEvent(event)

      expect(stopPropagationSpy).toHaveBeenCalled()
    })
  })

  describe('lifecycle management', () => {
    it('should add event listener when startListening is called', () => {
      const handler = { key: 'Enter', handler: vi.fn() }
      const { startListening } = useKeydown(handler)

      startListening()

      expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('should remove event listener when stopListening is called', () => {
      const handler = { key: 'Enter', handler: vi.fn() }
      const { stopListening } = useKeydown(handler)

      stopListening()

      expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })
})
