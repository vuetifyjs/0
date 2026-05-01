import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope, shallowRef } from 'vue'

import { usePopover } from './index'

describe('usePopover', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
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
})
