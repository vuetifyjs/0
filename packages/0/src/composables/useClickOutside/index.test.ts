import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useClickOutside } from './index'

/**
 * Helper to simulate a complete pointer interaction (down + up).
 */
function simulatePointerClick (
  element: HTMLElement,
  options: Partial<PointerEventInit> = {},
) {
  const baseOptions: PointerEventInit = {
    bubbles: true,
    clientX: 100,
    clientY: 100,
    pointerType: 'mouse',
    ...options,
  }

  element.dispatchEvent(new PointerEvent('pointerdown', baseOptions))
  element.dispatchEvent(new PointerEvent('pointerup', baseOptions))
}

/**
 * Helper to simulate a touch tap (pointerdown + pointerup with touch type).
 */
function simulateTouchTap (
  element: HTMLElement,
  startX = 100,
  startY = 100,
  endX = 100,
  endY = 100,
) {
  element.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: startX,
    clientY: startY,
    pointerType: 'touch',
  }))
  element.dispatchEvent(new PointerEvent('pointerup', {
    bubbles: true,
    clientX: endX,
    clientY: endY,
    pointerType: 'touch',
  }))
}

describe('useClickOutside', () => {
  let container: HTMLElement
  let target: HTMLElement
  let outside: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    target = document.createElement('div')
    outside = document.createElement('div')
    container.append(target, outside)
    document.body.append(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe('basic functionality', () => {
    it('calls handler when clicking outside target', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler)

      await nextTick()
      simulatePointerClick(outside)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('does not call handler when clicking inside target', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler)

      await nextTick()
      simulatePointerClick(target)

      expect(handler).not.toHaveBeenCalled()
    })

    it('does not call handler when clicking on target children', async () => {
      const handler = vi.fn()
      const child = document.createElement('span')
      target.append(child)
      useClickOutside(target, handler)

      await nextTick()
      simulatePointerClick(child)

      expect(handler).not.toHaveBeenCalled()
    })

    it('returns object with stop method that stops listening', async () => {
      const handler = vi.fn()
      const { stop } = useClickOutside(target, handler)

      await nextTick()
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)

      stop()
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1) // Still 1, not called again
    })

    it('returns isActive and isPaused state refs', () => {
      const handler = vi.fn()
      const { isActive, isPaused } = useClickOutside(target, handler)

      expect(isActive.value).toBe(true)
      expect(isPaused.value).toBe(false)
    })
  })

  describe('pause and resume', () => {
    it('pause stops detection', async () => {
      const handler = vi.fn()
      const { pause, isPaused } = useClickOutside(target, handler)

      await nextTick()
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)

      pause()
      expect(isPaused.value).toBe(true)

      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1) // Still 1
    })

    it('resume restarts detection after pause', async () => {
      const handler = vi.fn()
      const { pause, resume, isPaused } = useClickOutside(target, handler)

      await nextTick()

      pause()
      simulatePointerClick(outside)
      expect(handler).not.toHaveBeenCalled()

      resume()
      expect(isPaused.value).toBe(false)

      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('isActive reflects paused state', async () => {
      const handler = vi.fn()
      const { pause, resume, isActive } = useClickOutside(target, handler)

      expect(isActive.value).toBe(true)

      pause()
      expect(isActive.value).toBe(false)

      resume()
      expect(isActive.value).toBe(true)
    })

    it('pause clears pending pointerdown state', async () => {
      const handler = vi.fn()
      const { pause, resume } = useClickOutside(target, handler)

      await nextTick()

      // Start a click outside
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))

      // Pause before pointerup
      pause()
      resume()

      // Complete the click - should not trigger because state was cleared
      outside.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('reactive targets', () => {
    it('supports reactive target ref', async () => {
      const handler = vi.fn()
      const targetRef = ref<HTMLElement | null>(null)
      useClickOutside(targetRef, handler)

      await nextTick()
      simulatePointerClick(outside)
      expect(handler).not.toHaveBeenCalled() // No target yet

      targetRef.value = target
      await nextTick()
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('supports multiple targets', async () => {
      const handler = vi.fn()
      const target2 = document.createElement('div')
      container.append(target2)

      useClickOutside([() => target, () => target2], handler)

      await nextTick()

      // Click on first target - should not trigger
      simulatePointerClick(target)
      expect(handler).not.toHaveBeenCalled()

      // Click on second target - should not trigger
      simulatePointerClick(target2)
      expect(handler).not.toHaveBeenCalled()

      // Click outside both - should trigger
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('handles null/undefined targets gracefully', async () => {
      const handler = vi.fn()
      useClickOutside(null, handler)

      await nextTick()
      simulatePointerClick(outside)

      // Should not throw, handler not called since no valid targets
      expect(handler).not.toHaveBeenCalled()
    })

    it('filters out null values from target array', async () => {
      const handler = vi.fn()
      useClickOutside([() => target, () => null, () => undefined], handler)

      await nextTick()

      // Click on target - should not trigger
      simulatePointerClick(target)
      expect(handler).not.toHaveBeenCalled()

      // Click outside - should trigger
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('enabled option', () => {
    it('respects enabled option', async () => {
      const handler = vi.fn()
      const enabled = ref(false)
      useClickOutside(target, handler, { enabled })

      await nextTick()
      simulatePointerClick(outside)
      expect(handler).not.toHaveBeenCalled()

      enabled.value = true
      await nextTick()
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('supports enabled as getter function', async () => {
      const handler = vi.fn()
      let enabled = false
      useClickOutside(target, handler, { enabled: () => enabled })

      await nextTick()
      simulatePointerClick(outside)
      expect(handler).not.toHaveBeenCalled()

      enabled = true
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('two-phase detection', () => {
    it('requires both pointerdown and pointerup to trigger', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler)

      await nextTick()

      // Only pointerdown - should not trigger
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      expect(handler).not.toHaveBeenCalled()

      // Only pointerup without prior pointerdown on outside - should not trigger
      // (initialTarget is set from the previous pointerdown)
      target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      expect(handler).not.toHaveBeenCalled()
    })

    it('does not trigger when dragging from inside to outside', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler)

      await nextTick()

      // Start inside target
      target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      // End outside target
      outside.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))

      // Should not trigger because initial target was inside
      expect(handler).not.toHaveBeenCalled()
    })

    it('does not trigger when dragging from outside to inside', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler)

      await nextTick()

      // Start outside target
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      // End inside target
      target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))

      // Should not trigger because pointerup was inside
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('touch scroll threshold', () => {
    it('triggers for small touch movements (tap)', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, { touchScrollThreshold: 30 })

      await nextTick()

      // Small movement (5px) - should trigger
      simulateTouchTap(outside, 100, 100, 105, 105)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('does not trigger for large touch movements (scroll)', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, { touchScrollThreshold: 30 })

      await nextTick()

      // Large movement (50px) - should not trigger (it's a scroll)
      simulateTouchTap(outside, 100, 100, 150, 100)
      expect(handler).not.toHaveBeenCalled()
    })

    it('respects custom threshold', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, { touchScrollThreshold: 10 })

      await nextTick()

      // Movement of 15px exceeds threshold of 10
      simulateTouchTap(outside, 100, 100, 115, 100)
      expect(handler).not.toHaveBeenCalled()

      // Movement of 5px is within threshold
      simulateTouchTap(outside, 100, 100, 105, 100)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('does not apply threshold to mouse clicks', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, { touchScrollThreshold: 30 })

      await nextTick()

      // Large mouse movement - should still trigger (threshold only for touch)
      outside.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
        pointerType: 'mouse',
      }))
      outside.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true,
        clientX: 200,
        clientY: 200,
        pointerType: 'mouse',
      }))

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('defaultPrevented', () => {
    it('does not trigger when pointerdown is prevented', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler)

      await nextTick()

      const downEvent = new PointerEvent('pointerdown', { bubbles: true, cancelable: true })
      downEvent.preventDefault()
      outside.dispatchEvent(downEvent)
      outside.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))

      expect(handler).not.toHaveBeenCalled()
    })

    it('does not trigger when pointerup is prevented', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler)

      await nextTick()

      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      const upEvent = new PointerEvent('pointerup', { bubbles: true, cancelable: true })
      upEvent.preventDefault()
      outside.dispatchEvent(upEvent)

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('target validation', () => {
    it('does not trigger when target is removed from DOM before pointerup', async () => {
      const handler = vi.fn()
      const removableElement = document.createElement('div')
      container.append(removableElement)
      useClickOutside(target, handler)

      await nextTick()

      // Pointerdown on removable element (outside target)
      removableElement.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))

      // Remove element from DOM
      removableElement.remove()

      // Pointerup - should not trigger because element is no longer connected
      outside.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('capture phase', () => {
    it('uses capture phase by default', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, { capture: true })

      await nextTick()

      // Element that stops propagation
      const blocker = document.createElement('div')
      blocker.addEventListener('pointerdown', e => e.stopPropagation())
      blocker.addEventListener('pointerup', e => e.stopPropagation())
      container.append(blocker)

      // Click on blocker - should still trigger because of capture phase
      simulatePointerClick(blocker)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('respects capture: false option', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, { capture: false })

      await nextTick()

      // Element that stops propagation
      const blocker = document.createElement('div')
      blocker.addEventListener('pointerdown', e => e.stopPropagation())
      blocker.addEventListener('pointerup', e => e.stopPropagation())
      container.append(blocker)

      // Click on blocker - should not trigger because propagation stopped
      simulatePointerClick(blocker)
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('iframe detection', () => {
    it('does not detect iframe focus by default', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler)

      await nextTick()

      // Create iframe outside target
      const iframe = document.createElement('iframe')
      container.append(iframe)

      // Simulate focus moving to iframe
      Object.defineProperty(document, 'activeElement', {
        value: iframe,
        configurable: true,
      })
      window.dispatchEvent(new FocusEvent('blur'))

      expect(handler).not.toHaveBeenCalled()

      // Cleanup
      Object.defineProperty(document, 'activeElement', {
        value: document.body,
        configurable: true,
      })
    })

    it('detects iframe focus when detectIframe is true', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, { detectIframe: true })

      await nextTick()

      // Create iframe outside target
      const iframe = document.createElement('iframe')
      container.append(iframe)

      // Simulate focus moving to iframe
      Object.defineProperty(document, 'activeElement', {
        value: iframe,
        configurable: true,
      })
      window.dispatchEvent(new FocusEvent('blur'))

      expect(handler).toHaveBeenCalledTimes(1)

      // Cleanup
      Object.defineProperty(document, 'activeElement', {
        value: document.body,
        configurable: true,
      })
    })

    it('does not trigger when iframe is inside target', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, { detectIframe: true })

      await nextTick()

      // Create iframe inside target
      const iframe = document.createElement('iframe')
      target.append(iframe)

      // Simulate focus moving to iframe
      Object.defineProperty(document, 'activeElement', {
        value: iframe,
        configurable: true,
      })
      window.dispatchEvent(new FocusEvent('blur'))

      expect(handler).not.toHaveBeenCalled()

      // Cleanup
      Object.defineProperty(document, 'activeElement', {
        value: document.body,
        configurable: true,
      })
    })
  })

  describe('ignore option', () => {
    it('ignores clicks on elements matching CSS selector', async () => {
      const handler = vi.fn()
      const ignoreElement = document.createElement('div')
      ignoreElement.className = 'ignore-me'
      container.append(ignoreElement)

      useClickOutside(target, handler, {
        ignore: ['.ignore-me'],
      })

      await nextTick()
      simulatePointerClick(ignoreElement)

      expect(handler).not.toHaveBeenCalled()
    })

    it('ignores clicks on descendants of elements matching CSS selector', async () => {
      const handler = vi.fn()
      const ignoreParent = document.createElement('div')
      ignoreParent.className = 'menu'
      const ignoreChild = document.createElement('span')
      ignoreParent.append(ignoreChild)
      container.append(ignoreParent)

      useClickOutside(target, handler, {
        ignore: ['.menu'],
      })

      await nextTick()
      simulatePointerClick(ignoreChild)

      expect(handler).not.toHaveBeenCalled()
    })

    it('ignores clicks on elements passed as refs', async () => {
      const handler = vi.fn()
      const ignoreEl = document.createElement('div')
      container.append(ignoreEl)
      const ignoreRef = ref<HTMLElement | null>(ignoreEl)

      useClickOutside(target, handler, { ignore: [ignoreRef] })

      await nextTick()
      simulatePointerClick(ignoreEl)

      expect(handler).not.toHaveBeenCalled()
    })

    it('ignores clicks on descendants of elements passed as refs', async () => {
      const handler = vi.fn()
      const ignoreEl = document.createElement('div')
      const child = document.createElement('span')
      ignoreEl.append(child)
      container.append(ignoreEl)

      useClickOutside(target, handler, { ignore: [ignoreEl] })

      await nextTick()
      simulatePointerClick(child)

      expect(handler).not.toHaveBeenCalled()
    })

    it('supports multiple CSS selectors in ignore list', async () => {
      const handler = vi.fn()
      const ignoreA = document.createElement('div')
      ignoreA.dataset.menu = 'true'
      const ignoreB = document.createElement('div')
      ignoreB.className = 'toast'
      container.append(ignoreA, ignoreB)

      useClickOutside(target, handler, {
        ignore: ['[data-menu]', '.toast'],
      })

      await nextTick()

      simulatePointerClick(ignoreA)
      expect(handler).not.toHaveBeenCalled()

      simulatePointerClick(ignoreB)
      expect(handler).not.toHaveBeenCalled()

      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('supports mixing CSS selectors and element refs', async () => {
      const handler = vi.fn()
      const selectorEl = document.createElement('div')
      selectorEl.className = 'dialog'
      const refEl = document.createElement('div')
      container.append(selectorEl, refEl)

      useClickOutside(target, handler, {
        ignore: ['.dialog', refEl],
      })

      await nextTick()

      simulatePointerClick(selectorEl)
      expect(handler).not.toHaveBeenCalled()

      simulatePointerClick(refEl)
      expect(handler).not.toHaveBeenCalled()

      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('supports getter functions in ignore list', async () => {
      const handler = vi.fn()
      const ignoreEl = document.createElement('div')
      container.append(ignoreEl)

      useClickOutside(target, handler, {
        ignore: [() => ignoreEl],
      })

      await nextTick()
      simulatePointerClick(ignoreEl)

      expect(handler).not.toHaveBeenCalled()
    })

    it('respects reactive ignore list changes', async () => {
      const handler = vi.fn()
      const ignoreEl = document.createElement('div')
      ignoreEl.className = 'dynamic'
      container.append(ignoreEl)
      const ignoreList = ref<string[]>([])

      useClickOutside(target, handler, { ignore: ignoreList })

      await nextTick()

      // Not ignored yet
      simulatePointerClick(ignoreEl)
      expect(handler).toHaveBeenCalledTimes(1)

      // Add to ignore list
      ignoreList.value = ['.dynamic']

      simulatePointerClick(ignoreEl)
      expect(handler).toHaveBeenCalledTimes(1) // Still 1 - now ignored
    })

    it('still triggers for non-ignored outside clicks', async () => {
      const handler = vi.fn()
      const ignoreEl = document.createElement('div')
      ignoreEl.className = 'ignore'
      container.append(ignoreEl)

      useClickOutside(target, handler, {
        ignore: ['.ignore'],
      })

      await nextTick()
      simulatePointerClick(outside)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('ignores iframe focus via CSS selector when detectIframe is true', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, {
        detectIframe: true,
        ignore: ['iframe'],
      })

      await nextTick()

      const iframe = document.createElement('iframe')
      container.append(iframe)

      Object.defineProperty(document, 'activeElement', {
        value: iframe,
        configurable: true,
      })
      window.dispatchEvent(new FocusEvent('blur'))

      expect(handler).not.toHaveBeenCalled()

      Object.defineProperty(document, 'activeElement', {
        value: document.body,
        configurable: true,
      })
    })

    it('ignores iframe focus via ref when detectIframe is true', async () => {
      const handler = vi.fn()
      const iframe = document.createElement('iframe')
      container.append(iframe)
      const iframeRef = ref<HTMLIFrameElement | null>(iframe)

      useClickOutside(target, handler, {
        detectIframe: true,
        ignore: [iframeRef],
      })

      await nextTick()

      Object.defineProperty(document, 'activeElement', {
        value: iframe,
        configurable: true,
      })
      window.dispatchEvent(new FocusEvent('blur'))

      expect(handler).not.toHaveBeenCalled()

      Object.defineProperty(document, 'activeElement', {
        value: document.body,
        configurable: true,
      })
    })
  })
})
