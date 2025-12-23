import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { computed, nextTick, ref, watch } from 'vue'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
}))

import { useDocumentEventListener, useEventListener, useWindowEventListener } from './index'

describe('useEventListener', () => {
  let mockElement: HTMLElement
  let mockDocument: Document
  let mockWindow: Window

  beforeEach(() => {
    // Create mock element
    mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any

    // Mock document
    mockDocument = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any

    // Mock window
    mockWindow = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      innerWidth: 1024,
      innerHeight: 768,
    } as any

    // Set global mocks
    globalThis.document = mockDocument
    globalThis.window = mockWindow as any
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('basic functionality', () => {
    it('should add event listeners on setup', () => {
      const handler = vi.fn()
      useEventListener(mockDocument, 'click', handler)

      expect(mockDocument.addEventListener).toHaveBeenCalledWith('click', handler, undefined)
    })

    it('should handle multiple events', () => {
      const handler = vi.fn()
      useEventListener(mockElement, ['click', 'mousedown'], handler)

      expect(mockElement.addEventListener).toHaveBeenCalledWith('click', handler, undefined)
      expect(mockElement.addEventListener).toHaveBeenCalledWith('mousedown', handler, undefined)
    })

    it('should handle reactive events', async () => {
      const handler = vi.fn()
      const event = ref('click')
      useEventListener(mockDocument, event, handler)

      expect(mockDocument.addEventListener).toHaveBeenCalledWith('click', handler, undefined)

      // Change event
      event.value = 'mousedown'
      await nextTick()
      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('click', handler, undefined)
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('mousedown', handler, undefined)
    })

    it('should handle multiple listeners', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      useEventListener(mockDocument, 'click', [handler1, handler2])

      expect(mockDocument.addEventListener).toHaveBeenCalledWith('click', handler1, undefined)
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('click', handler2, undefined)
    })

    it('should use custom target', () => {
      const handler = vi.fn()
      useEventListener(mockElement, 'click', handler)

      expect(mockElement.addEventListener).toHaveBeenCalledWith('click', handler, undefined)
      expect(mockDocument.addEventListener).not.toHaveBeenCalled()
    })

    it('should work with window target', () => {
      const handler = vi.fn()
      useEventListener(mockWindow, 'resize', handler)

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('resize', handler, undefined)
      expect(mockDocument.addEventListener).not.toHaveBeenCalled()
      expect(mockElement.addEventListener).not.toHaveBeenCalled()
    })

    it('should cleanup listeners when stop is called', () => {
      const handler = vi.fn()
      const stop = useEventListener(mockDocument, 'click', handler)

      stop()

      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('click', handler, undefined)
    })

    it('should handle array to string event change', async () => {
      const handler = vi.fn()
      const event = ref<string | string[]>(['click', 'mousedown'])
      useEventListener(mockDocument, event, handler)

      expect(mockDocument.addEventListener).toHaveBeenCalledWith('click', handler, undefined)
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('mousedown', handler, undefined)

      // Change to single event
      event.value = 'keydown'
      await nextTick()
      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('click', handler, undefined)
      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('mousedown', handler, undefined)
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('keydown', handler, undefined)
    })

    it('should handle options parameter', () => {
      const handler = vi.fn()
      const options = { passive: true }
      useEventListener(mockDocument, 'click', handler, options)

      expect(mockDocument.addEventListener).toHaveBeenCalledWith('click', handler, options)
    })

    it('should handle null target gracefully', () => {
      const handler = vi.fn()
      const target = ref<HTMLElement | null>(null)

      expect(() => {
        useEventListener(target, 'click', handler)
      }).not.toThrow()

      expect(mockDocument.addEventListener).not.toHaveBeenCalled()
    })
  })

  describe('convenience functions', () => {
    it('useWindowEventListener should work with window events', () => {
      const handler = vi.fn()
      useWindowEventListener('resize', handler)

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('resize', handler, undefined)
    })

    it('useDocumentEventListener should work with document events', () => {
      const handler = vi.fn()
      useDocumentEventListener('click', handler)

      expect(mockDocument.addEventListener).toHaveBeenCalledWith('click', handler, undefined)
    })

    it('useWindowEventListener should handle multiple events', () => {
      const handler = vi.fn()
      useWindowEventListener(['online', 'offline'], handler)

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('online', handler, undefined)
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('offline', handler, undefined)
    })

    it('useDocumentEventListener should handle options', () => {
      const handler = vi.fn()
      const options = { passive: true }
      useDocumentEventListener('keydown', handler, options)

      expect(mockDocument.addEventListener).toHaveBeenCalledWith('keydown', handler, options)
    })
  })

  describe('practical examples from documentation', () => {
    it('should handle window resize tracking', () => {
      const windowSize = ref({ width: 0, height: 0 })
      const resizeHandler = vi.fn(() => {
        windowSize.value = {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      })

      useWindowEventListener('resize', resizeHandler)

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('resize', resizeHandler, undefined)
    })

    it('should handle keyboard shortcuts', () => {
      const shortcutHandler = vi.fn((e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault()
        }
      })

      useDocumentEventListener('keydown', shortcutHandler)

      expect(mockDocument.addEventListener).toHaveBeenCalledWith('keydown', shortcutHandler, undefined)
    })

    it('should handle multiple events for form validation', () => {
      const validationHandler = vi.fn((evt: Event) => {
        if (evt.type === 'input') {
          // Real-time validation
        } else if (evt.type === 'blur') {
          // Final validation on blur
        }
      })

      useEventListener(mockElement, ['input', 'blur', 'focus'], validationHandler)

      expect(mockElement.addEventListener).toHaveBeenCalledWith('input', validationHandler, undefined)
      expect(mockElement.addEventListener).toHaveBeenCalledWith('blur', validationHandler, undefined)
      expect(mockElement.addEventListener).toHaveBeenCalledWith('focus', validationHandler, undefined)
    })

    it('should handle multiple handlers for analytics', () => {
      const trackClick = vi.fn()
      const updateUI = vi.fn()

      useEventListener(mockElement, 'click', [trackClick, updateUI])

      expect(mockElement.addEventListener).toHaveBeenCalledWith('click', trackClick, undefined)
      expect(mockElement.addEventListener).toHaveBeenCalledWith('click', updateUI, undefined)
    })

    it('should handle performance-optimized scroll with options', () => {
      const scrollHandler = vi.fn((evt: Event) => {
        const target = evt.target as HTMLElement
        const { scrollTop, scrollHeight, clientHeight } = target
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          // Load more items
        }
      })

      const options = { passive: true, capture: false }
      useEventListener(mockElement, 'scroll', scrollHandler, options)

      expect(mockElement.addEventListener).toHaveBeenCalledWith('scroll', scrollHandler, options)
    })

    it('should handle dynamic event switching', async () => {
      const isTouchDevice = ref(false)
      const eventType = computed(() =>
        isTouchDevice.value ? 'touchstart' : 'mousedown',
      )
      const handler = vi.fn()

      useEventListener(mockElement, eventType, handler)

      expect(mockElement.addEventListener).toHaveBeenCalledWith('mousedown', handler, undefined)

      // Switch to touch device
      isTouchDevice.value = true
      await nextTick()

      expect(mockElement.removeEventListener).toHaveBeenCalledWith('mousedown', handler, undefined)
      expect(mockElement.addEventListener).toHaveBeenCalledWith('touchstart', handler, undefined)
    })

    it('should handle conditional cleanup with modal', async () => {
      const isModalOpen = ref(false)
      const stopEscapeListener = ref<(() => void) | null>(null)
      const escapeHandler = vi.fn((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          isModalOpen.value = false
        }
      })

      // Simulate watch behavior
      watch(isModalOpen, open => {
        if (open) {
          stopEscapeListener.value = useDocumentEventListener('keydown', escapeHandler)
        } else {
          stopEscapeListener.value?.()
          stopEscapeListener.value = null
        }
      }, { immediate: true })

      // Open modal
      isModalOpen.value = true
      await nextTick()

      expect(mockDocument.addEventListener).toHaveBeenCalledWith('keydown', escapeHandler, undefined)

      // Close modal
      isModalOpen.value = false
      await nextTick()

      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('keydown', escapeHandler, undefined)
    })

    it('should handle online/offline status tracking', () => {
      const isOnline = ref(true)
      const statusHandler = vi.fn(() => {
        isOnline.value = navigator.onLine
      })

      useWindowEventListener(['online', 'offline'], statusHandler)

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('online', statusHandler, undefined)
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('offline', statusHandler, undefined)
    })

    it('should handle focus management for accessibility', () => {
      const lastFocusedElement = ref<Element | null>(null)
      const focusHandler = vi.fn((evt: FocusEvent) => {
        lastFocusedElement.value = evt.target as Element
      })

      useDocumentEventListener('focusin', focusHandler)

      expect(mockDocument.addEventListener).toHaveBeenCalledWith('focusin', focusHandler, undefined)
    })
  })
})

describe('useEventListener SSR', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('useWindowEventListener should return noop function during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { useWindowEventListener: useWindowSSR } = await import('./index')
    const handler = vi.fn()
    const stop = useWindowSSR('resize', handler)

    expect(stop).toBeTypeOf('function')
    expect(() => stop()).not.toThrow()
  })

  it('useDocumentEventListener should return noop function during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { useDocumentEventListener: useDocumentSSR } = await import('./index')
    const handler = vi.fn()
    const stop = useDocumentSSR('click', handler)

    expect(stop).toBeTypeOf('function')
    expect(() => stop()).not.toThrow()
  })

  it('useWindowEventListener should not access window during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const originalWindow = globalThis.window
    delete (globalThis as any).window

    const { useWindowEventListener: useWindowSSR } = await import('./index')

    expect(() => {
      useWindowSSR('resize', vi.fn() as () => void)
    }).not.toThrow()

    globalThis.window = originalWindow
  })

  it('useDocumentEventListener should not access document during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const originalDocument = globalThis.document
    delete (globalThis as any).document

    const { useDocumentEventListener: useDocumentSSR } = await import('./index')

    expect(() => {
      useDocumentSSR('click', vi.fn() as () => void)
    }).not.toThrow()

    globalThis.document = originalDocument
  })
})
