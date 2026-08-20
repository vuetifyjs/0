import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { usePopover } from './index'

// Utilities
import { effectScope, nextTick, shallowRef } from 'vue'

function createPopoverElement (options: { open?: boolean, connected?: boolean } = {}) {
  const state = {
    open: options.open ?? false,
    connected: options.connected ?? true,
  }

  const showPopover = vi.fn(() => {
    state.open = true
  })
  const hidePopover = vi.fn(() => {
    state.open = false
  })

  const element = {
    get isConnected () {
      return state.connected
    },
    set isConnected (value: boolean) {
      state.connected = value
    },
    showPopover,
    hidePopover,
    matches: vi.fn((selector: string) => selector === ':popover-open' && state.open),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  } as unknown as HTMLElement

  return { element, showPopover, hidePopover }
}

describe('usePopover', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should create with default options', () => {
      const popover = usePopover()

      expect(popover.isOpen.value).toBe(false)
      expect(popover.id).toBeDefined()
      expect(typeof popover.open).toBe('function')
      expect(typeof popover.close).toBe('function')
      expect(typeof popover.toggle).toBe('function')
      expect(typeof popover.attach).toBe('function')
    })

    it('should use provided id', () => {
      const popover = usePopover({ id: 'my-popover' })

      expect(popover.id).toBe('my-popover')
    })

    it('should use external isOpen ref', () => {
      const isOpen = shallowRef(true)
      const popover = usePopover({ isOpen })

      expect(popover.isOpen.value).toBe(true)
      expect(popover.isOpen).toBe(isOpen)
    })
  })

  describe('open/close/toggle', () => {
    it('should open', () => {
      const popover = usePopover()

      popover.open()
      expect(popover.isOpen.value).toBe(true)
    })

    it('should close', () => {
      const isOpen = shallowRef(true)
      const popover = usePopover({ isOpen })

      popover.close()
      expect(popover.isOpen.value).toBe(false)
    })

    it('should toggle open', () => {
      const popover = usePopover()

      popover.toggle()
      expect(popover.isOpen.value).toBe(true)

      popover.toggle()
      expect(popover.isOpen.value).toBe(false)
    })
  })

  describe('delay', () => {
    it('should delay opening with openDelay', () => {
      const popover = usePopover({ openDelay: 200 })

      popover.open()
      expect(popover.isOpen.value).toBe(false)

      vi.advanceTimersByTime(199)
      expect(popover.isOpen.value).toBe(false)

      vi.advanceTimersByTime(1)
      expect(popover.isOpen.value).toBe(true)
    })

    it('should delay closing with closeDelay', () => {
      const isOpen = shallowRef(true)
      const popover = usePopover({ isOpen, closeDelay: 300 })

      popover.close()
      expect(popover.isOpen.value).toBe(true)

      vi.advanceTimersByTime(299)
      expect(popover.isOpen.value).toBe(true)

      vi.advanceTimersByTime(1)
      expect(popover.isOpen.value).toBe(false)
    })

    it('should cancel pending open when closing', () => {
      const popover = usePopover({ openDelay: 200 })

      popover.open()
      vi.advanceTimersByTime(100)

      popover.close()
      vi.advanceTimersByTime(200)

      expect(popover.isOpen.value).toBe(false)
    })

    it('should cancel pending close when opening', () => {
      const isOpen = shallowRef(true)
      const popover = usePopover({ isOpen, closeDelay: 300 })

      popover.close()
      vi.advanceTimersByTime(100)

      popover.open()

      vi.advanceTimersByTime(300)
      expect(popover.isOpen.value).toBe(true)
    })
  })

  describe('cancel', () => {
    it('should cancel a pending open transition', () => {
      const scope = effectScope()
      scope.run(() => {
        const popover = usePopover({ openDelay: 500 })
        popover.open()
        popover.cancel()
        vi.advanceTimersByTime(500)
        expect(popover.isOpen.value).toBe(false)
      })
      scope.stop()
    })

    it('should cancel a pending close transition', () => {
      const scope = effectScope()
      scope.run(() => {
        const popover = usePopover({ closeDelay: 500 })
        popover.isOpen.value = true
        popover.close()
        popover.cancel()
        vi.advanceTimersByTime(500)
        expect(popover.isOpen.value).toBe(true)
      })
      scope.stop()
    })
  })

  describe('anchorStyles', () => {
    it('should generate anchor-name from id', () => {
      const popover = usePopover({ id: 'test' })

      expect(popover.anchorStyles.value).toEqual({
        anchorName: '--test',
      })
    })
  })

  describe('contentAttrs', () => {
    it('should return id and popover attribute', () => {
      const popover = usePopover({ id: 'test' })

      expect(popover.contentAttrs.value).toEqual({
        id: 'test',
        popover: '',
      })
    })
  })

  describe('contentStyles', () => {
    it('should use default position values', () => {
      const popover = usePopover({ id: 'test' })

      expect(popover.contentStyles.value).toEqual({
        'position': 'fixed',
        'margin': 'unset',
        'inset-area': 'bottom',
        'position-area': 'bottom',
        'position-anchor': '--test',
        'position-try-fallbacks': 'most-width bottom',
      })
    })

    it('should use custom position values', () => {
      const popover = usePopover({
        id: 'test',
        positionArea: 'top',
        positionTry: 'most-height top',
      })

      expect(popover.contentStyles.value['position-area']).toBe('top')
      expect(popover.contentStyles.value['position-try-fallbacks']).toBe('most-height top')
    })
  })

  describe('auto-cleanup', () => {
    it('should clean up timers on scope disposal', () => {
      const scope = effectScope()

      let popover: ReturnType<typeof usePopover>

      scope.run(() => {
        popover = usePopover({ openDelay: 200 })
        popover.open()
      })

      scope.stop()

      vi.advanceTimersByTime(500)
      expect(popover!.isOpen.value).toBe(false)
    })
  })

  describe('attach', () => {
    it('should hide when the same still-open node reappears after close while the getter is null', async () => {
      const scope = effectScope()
      const { element, showPopover, hidePopover } = createPopoverElement()
      const target = shallowRef<HTMLElement | null>(element)

      const popover = scope.run(() => {
        const instance = usePopover()
        instance.attach(() => target.value)
        return instance
      })!

      popover.isOpen.value = true
      await nextTick()
      expect(showPopover).toHaveBeenCalledTimes(1)

      target.value = null
      popover.isOpen.value = false
      await nextTick()

      target.value = element
      await nextTick()

      expect(hidePopover).toHaveBeenCalled()
      scope.stop()
    })

    it('should hide when isOpen becomes false while the element is disconnected', async () => {
      const scope = effectScope()
      const { element, showPopover, hidePopover } = createPopoverElement()
      const target = shallowRef<HTMLElement | null>(element)

      const popover = scope.run(() => {
        const instance = usePopover()
        instance.attach(() => target.value)
        return instance
      })!

      popover.isOpen.value = true
      await nextTick()
      expect(showPopover).toHaveBeenCalledTimes(1)

      Object.defineProperty(element, 'isConnected', { value: false, configurable: true })
      popover.isOpen.value = false
      await nextTick()

      expect(hidePopover).toHaveBeenCalled()
      scope.stop()
    })

    it('should hide the previous node when the getter swaps away from a still-open popover', async () => {
      const scope = effectScope()
      const previous = createPopoverElement()
      const next = createPopoverElement()
      const target = shallowRef<HTMLElement | null>(previous.element)

      const popover = scope.run(() => {
        const instance = usePopover()
        instance.attach(() => target.value)
        return instance
      })!

      popover.isOpen.value = true
      await nextTick()
      expect(previous.showPopover).toHaveBeenCalledTimes(1)

      target.value = next.element
      await nextTick()

      expect(previous.hidePopover).toHaveBeenCalled()
      scope.stop()
    })

    it('should show when attach is called while isOpen is already true', async () => {
      const scope = effectScope()
      const isOpen = shallowRef(true)
      const { element, showPopover } = createPopoverElement()
      const target = shallowRef<HTMLElement | null>(element)

      scope.run(() => {
        const instance = usePopover({ isOpen })
        instance.attach(() => target.value)
      })

      await nextTick()
      expect(showPopover).toHaveBeenCalledTimes(1)
      scope.stop()
    })

    it('should hide a still-open node on scope dispose', async () => {
      const scope = effectScope()
      const { element, showPopover, hidePopover } = createPopoverElement()
      const target = shallowRef<HTMLElement | null>(element)

      const popover = scope.run(() => {
        const instance = usePopover()
        instance.attach(() => target.value)
        return instance
      })!

      popover.isOpen.value = true
      await nextTick()
      expect(showPopover).toHaveBeenCalledTimes(1)

      scope.stop()

      expect(hidePopover).toHaveBeenCalled()
    })
  })
})
