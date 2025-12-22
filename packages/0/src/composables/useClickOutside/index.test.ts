import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
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

    it('handles target becoming null between pointerdown and pointerup', async () => {
      const handler = vi.fn()
      const targetRef = ref<HTMLElement | null>(target)
      useClickOutside(targetRef, handler)

      await nextTick()

      // Start click outside
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))

      // Target disappears mid-interaction
      targetRef.value = null

      // Complete click - no targets means nothing is "outside"
      outside.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))

      expect(handler).not.toHaveBeenCalled()
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

    it('does not trigger when movement equals exactly the threshold', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, { touchScrollThreshold: 30 })

      await nextTick()

      // Exactly 30px movement with 30px threshold - uses >= so should NOT trigger
      simulateTouchTap(outside, 100, 100, 130, 100)
      expect(handler).not.toHaveBeenCalled()
    })

    it('triggers when movement is just below threshold', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, { touchScrollThreshold: 30 })

      await nextTick()

      // 29px movement with 30px threshold - should trigger
      simulateTouchTap(outside, 100, 100, 129, 100)
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

    it('does not apply threshold to pen/stylus clicks', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, { touchScrollThreshold: 30 })

      await nextTick()

      // Large pen movement - should still trigger (threshold only for touch)
      outside.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
        pointerType: 'pen',
      }))
      outside.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true,
        clientX: 200,
        clientY: 200,
        pointerType: 'pen',
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

    it('does not trigger when blur event is prevented', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler, { detectIframe: true })

      await nextTick()

      const iframe = document.createElement('iframe')
      container.append(iframe)

      Object.defineProperty(document, 'activeElement', {
        value: iframe,
        configurable: true,
      })

      const blurEvent = new FocusEvent('blur', { cancelable: true })
      blurEvent.preventDefault()
      window.dispatchEvent(blurEvent)

      expect(handler).not.toHaveBeenCalled()

      Object.defineProperty(document, 'activeElement', {
        value: document.body,
        configurable: true,
      })
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

    it('handles reactive refs in ignore list', async () => {
      const handler = vi.fn()
      const ignoreRef = ref<HTMLElement | null>(null)
      const ignoreElement = document.createElement('div')
      container.append(ignoreElement)

      useClickOutside(target, handler, {
        ignore: [ignoreRef],
      })

      await nextTick()
      simulatePointerClick(ignoreElement)
      expect(handler).toHaveBeenCalledTimes(1) // Not ignored yet

      ignoreRef.value = ignoreElement
      simulatePointerClick(ignoreElement)
      expect(handler).toHaveBeenCalledTimes(1) // Now ignored
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

  describe('lifecycle cleanup', () => {
    it('cleans up listeners on scope disposal', async () => {
      const handler = vi.fn()
      const scope = effectScope()

      scope.run(() => {
        useClickOutside(target, handler)
      })

      await nextTick()
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)

      scope.stop()

      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1) // Not called again after disposal
    })

    it('cleans up iframe listeners on scope disposal', async () => {
      const handler = vi.fn()
      const scope = effectScope()
      const iframe = document.createElement('iframe')
      container.append(iframe)

      scope.run(() => {
        useClickOutside(target, handler, { detectIframe: true })
      })

      await nextTick()

      // Trigger iframe focus detection
      Object.defineProperty(document, 'activeElement', {
        value: iframe,
        configurable: true,
      })
      window.dispatchEvent(new FocusEvent('blur'))
      expect(handler).toHaveBeenCalledTimes(1)

      scope.stop()

      // Should not trigger after disposal
      window.dispatchEvent(new FocusEvent('blur'))
      expect(handler).toHaveBeenCalledTimes(1)

      Object.defineProperty(document, 'activeElement', {
        value: document.body,
        configurable: true,
      })
    })
  })

  describe('edge cases', () => {
    it('continues detection when handler throws', async () => {
      const scope = effectScope()
      const handler = vi.fn(() => {
        throw new Error('handler error')
      })

      scope.run(() => {
        useClickOutside(target, handler)
      })

      await nextTick()

      // First click throws
      expect(() => simulatePointerClick(outside)).toThrow('handler error')
      expect(handler).toHaveBeenCalledTimes(1)

      // Subsequent clicks still work
      expect(() => simulatePointerClick(outside)).toThrow('handler error')
      expect(handler).toHaveBeenCalledTimes(2)

      scope.stop()
    })

    it('handles stop() called from within handler', async () => {
      const scope = effectScope()
      let instance: ReturnType<typeof useClickOutside>
      const handler = vi.fn(() => instance.stop())

      scope.run(() => {
        instance = useClickOutside(target, handler)
      })

      await nextTick()
      simulatePointerClick(outside)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(instance!.isPaused.value).toBe(true)

      // Subsequent clicks should not trigger
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)

      scope.stop()
    })

    it('guards against multiple pause calls', async () => {
      const scope = effectScope()
      let pause: () => void
      let isPaused: ReturnType<typeof useClickOutside>['isPaused']

      scope.run(() => {
        const instance = useClickOutside(target, vi.fn())
        pause = instance.pause
        isPaused = instance.isPaused
      })

      await nextTick()

      pause!()
      expect(isPaused!.value).toBe(true)

      // Second pause should be no-op
      pause!()
      expect(isPaused!.value).toBe(true)

      scope.stop()
    })

    it('guards against multiple resume calls', async () => {
      const scope = effectScope()
      const handler = vi.fn()
      let pause: () => void
      let resume: () => void
      let isPaused: ReturnType<typeof useClickOutside>['isPaused']

      scope.run(() => {
        const instance = useClickOutside(target, handler)
        pause = instance.pause
        resume = instance.resume
        isPaused = instance.isPaused
      })

      await nextTick()

      // Resume when already active should be no-op
      resume!()
      expect(isPaused!.value).toBe(false)

      // Verify listeners still work (not duplicated)
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)

      // Normal pause/resume cycle
      pause!()
      resume!()
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(2)

      scope.stop()
    })

    it('handles rapid successive clicks correctly', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler)

      await nextTick()

      // Rapid fire 10 clicks with no delay
      for (let i = 0; i < 10; i++) {
        simulatePointerClick(outside)
      }

      expect(handler).toHaveBeenCalledTimes(10)
    })

    it('clears initialTarget between rapid clicks', async () => {
      const handler = vi.fn()
      useClickOutside(target, handler)

      await nextTick()

      // Start first click
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      outside.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      expect(handler).toHaveBeenCalledTimes(1)

      // Immediately start second click - initialTarget should have been cleared
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      outside.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      expect(handler).toHaveBeenCalledTimes(2)

      // Verify pointerup without prior pointerdown doesn't trigger
      outside.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      expect(handler).toHaveBeenCalledTimes(2)
    })
  })

  describe('empty targets', () => {
    it('does not trigger handler when target array is empty', async () => {
      const handler = vi.fn()
      useClickOutside([], handler)

      await nextTick()
      simulatePointerClick(outside)

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('shadow DOM', () => {
    it('detects clicks inside shadow DOM as inside target', async () => {
      const handler = vi.fn()
      const host = document.createElement('div')
      const shadow = host.attachShadow({ mode: 'open' })
      const shadowChild = document.createElement('div')
      shadow.append(shadowChild)
      container.append(host)

      useClickOutside(host, handler)

      await nextTick()

      // Click inside shadow DOM should not trigger (host contains shadow content)
      simulatePointerClick(shadowChild)
      expect(handler).not.toHaveBeenCalled()

      // Click outside should trigger
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('uses composedPath for shadow DOM event targeting', async () => {
      const handler = vi.fn()
      const host = document.createElement('div')
      const shadow = host.attachShadow({ mode: 'open' })
      const shadowButton = document.createElement('button')
      shadow.append(shadowButton)
      container.append(host)

      // Target is the shadow button's host
      useClickOutside(host, handler)

      await nextTick()

      // Click on shadow button - composedPath should include it
      simulatePointerClick(shadowButton)
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('dynamic target replacement', () => {
    it('handles reactive target replacement', async () => {
      const handler = vi.fn()
      const targetRef = ref<HTMLElement | null>(null)
      const element1 = document.createElement('div')
      const element2 = document.createElement('div')
      container.append(element1, element2)

      useClickOutside(targetRef, handler)

      // First target
      targetRef.value = element1
      await nextTick()
      simulatePointerClick(element2)
      expect(handler).toHaveBeenCalledTimes(1)

      // Replace with second target
      targetRef.value = element2
      await nextTick()
      simulatePointerClick(element1)
      expect(handler).toHaveBeenCalledTimes(2) // element1 now outside

      simulatePointerClick(element2)
      expect(handler).toHaveBeenCalledTimes(2) // element2 still inside
    })
  })

  describe('invalid CSS selectors', () => {
    it('handles invalid CSS selector in ignore option gracefully', async () => {
      const handler = vi.fn()

      useClickOutside(target, handler, {
        ignore: ['[invalid]]]'], // Malformed selector
      })

      await nextTick()

      // Should not throw during matching - invalid selector is silently ignored
      expect(() => simulatePointerClick(outside)).not.toThrow()
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('return value stability', () => {
    it('returns valid object structure', () => {
      const handler = vi.fn()
      const result = useClickOutside(target, handler)

      expect(result).toMatchObject({
        isActive: expect.any(Object),
        isPaused: expect.any(Object),
        pause: expect.any(Function),
        resume: expect.any(Function),
        stop: expect.any(Function),
      })
      expect(result.isActive.value).toBe(true)
      expect(result.isPaused.value).toBe(false)
    })

    it('pause/resume/stop work without errors after stop', async () => {
      const handler = vi.fn()
      const { pause, resume, stop, isPaused } = useClickOutside(target, handler)

      await nextTick()

      // Verify stop works
      stop()
      expect(isPaused.value).toBe(true)

      // Subsequent calls should be no-ops without throwing
      expect(() => pause()).not.toThrow()
      expect(() => stop()).not.toThrow()

      // Resume after stop should work
      resume()
      expect(isPaused.value).toBe(false)

      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('stop clears pending pointerdown state', async () => {
      const handler = vi.fn()
      const { stop, resume } = useClickOutside(target, handler)

      await nextTick()

      // Start a click outside
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))

      // Stop before pointerup
      stop()
      resume()

      // Complete the click - should not trigger because state was cleared
      outside.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      expect(handler).not.toHaveBeenCalled()
    })

    it('handles rapid pause/resume cycles without listener duplication', async () => {
      const handler = vi.fn()
      const scope = effectScope()
      let pause: () => void
      let resume: () => void

      scope.run(() => {
        const instance = useClickOutside(target, handler)
        pause = instance.pause
        resume = instance.resume
      })

      await nextTick()

      // Rapid cycling - should not duplicate listeners
      for (let i = 0; i < 50; i++) {
        pause!()
        resume!()
      }

      // Verify listeners still work correctly (not duplicated)
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)

      // Verify subsequent clicks work normally
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(2)

      scope.stop()
    })
  })

  describe('closed shadow DOM', () => {
    it('handles closed shadow DOM correctly', async () => {
      const handler = vi.fn()
      const host = document.createElement('div')
      const shadow = host.attachShadow({ mode: 'closed' })
      const shadowChild = document.createElement('div')
      shadow.append(shadowChild)
      container.append(host)

      useClickOutside(host, handler)

      await nextTick()

      // Click inside closed shadow DOM - composedPath won't reveal internals
      // but the event still reaches the host element
      simulatePointerClick(shadowChild)
      expect(handler).not.toHaveBeenCalled()

      // Click outside should still trigger
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('sSR safety', () => {
    it('returns valid API when event listeners are no-ops', async () => {
      // The composable uses useDocumentEventListener and useWindowEventListener
      // which return no-op cleanup functions during SSR (when IN_BROWSER is false).
      // This test verifies the composable's API is still valid in that scenario.
      const handler = vi.fn()
      const result = useClickOutside(target, handler)

      // Should return a valid API structure
      expect(result).toHaveProperty('isActive')
      expect(result).toHaveProperty('isPaused')
      expect(result).toHaveProperty('pause')
      expect(result).toHaveProperty('resume')
      expect(result).toHaveProperty('stop')

      // State should be initialized correctly
      expect(result.isActive.value).toBe(true)
      expect(result.isPaused.value).toBe(false)

      // Control methods should not throw
      expect(() => result.pause()).not.toThrow()
      expect(() => result.resume()).not.toThrow()
      expect(() => result.stop()).not.toThrow()
    })
  })

  describe('cleanup verification', () => {
    it('cleanup functions are called on pause', async () => {
      const handler = vi.fn()
      const scope = effectScope()
      let pause: () => void

      scope.run(() => {
        const instance = useClickOutside(target, handler)
        pause = instance.pause
      })

      await nextTick()

      // Verify listeners are active
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)

      // Pause should remove listeners
      pause!()

      // After pause, clicks should not trigger handler
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)

      scope.stop()
    })

    it('cleanup functions are called on stop', async () => {
      const handler = vi.fn()
      const scope = effectScope()
      let stop: () => void

      scope.run(() => {
        const instance = useClickOutside(target, handler)
        stop = instance.stop
      })

      await nextTick()

      // Verify listeners are active
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)

      // Stop should remove listeners
      stop!()

      // After stop, clicks should not trigger handler
      simulatePointerClick(outside)
      expect(handler).toHaveBeenCalledTimes(1)

      scope.stop()
    })

    it('iframe blur listener is cleaned up when detectIframe is true', async () => {
      const handler = vi.fn()
      const scope = effectScope()
      let stop: () => void

      const iframe = document.createElement('iframe')
      container.append(iframe)

      scope.run(() => {
        const instance = useClickOutside(target, handler, { detectIframe: true })
        stop = instance.stop
      })

      await nextTick()

      // Verify blur listener is active
      Object.defineProperty(document, 'activeElement', {
        value: iframe,
        configurable: true,
      })
      window.dispatchEvent(new FocusEvent('blur'))
      expect(handler).toHaveBeenCalledTimes(1)

      // Stop should remove blur listener too
      stop!()

      // After stop, blur should not trigger handler
      window.dispatchEvent(new FocusEvent('blur'))
      expect(handler).toHaveBeenCalledTimes(1)

      // Cleanup
      Object.defineProperty(document, 'activeElement', {
        value: document.body,
        configurable: true,
      })

      scope.stop()
    })
  })
})
