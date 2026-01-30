import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope, nextTick, ref } from 'vue'

import { stack, useStack } from '.'

describe('createStack', () => {
  // Reset global registry between tests using the shared context
  beforeEach(() => {
    stack.registry.clear()
  })

  describe('useStack', () => {
    it('should return initial state when inactive', () => {
      const isActive = ref(false)

      const result = effectScope().run(() => useStack(isActive))!

      expect(result.zIndex.value).toBe(2000)
      expect(result.globalTop.value).toBe(true)
      expect(result.localTop.value).toBe(true)
      expect(result.styles.value).toEqual({ zIndex: 2000 })
    })

    it('should use custom baseZIndex', () => {
      const isActive = ref(false)

      const result = effectScope().run(() => useStack(isActive, { baseZIndex: 1000 }))!

      expect(result.zIndex.value).toBe(1000)
      expect(result.styles.value).toEqual({ zIndex: 1000 })
    })

    it('should increment z-index for multiple overlays', async () => {
      const isActive1 = ref(true)
      const isActive2 = ref(false)

      const result1 = effectScope().run(() => useStack(isActive1))!
      const result2 = effectScope().run(() => useStack(isActive2))!

      await nextTick()

      expect(result1.zIndex.value).toBe(2000)
      expect(result2.zIndex.value).toBe(2000) // Not active yet

      isActive2.value = true
      await nextTick()

      expect(result2.zIndex.value).toBe(2010)
    })

    it('should use custom increment', async () => {
      const isActive1 = ref(true)
      const isActive2 = ref(true)

      const result1 = effectScope().run(() => useStack(isActive1, { increment: 5 }))!
      const result2 = effectScope().run(() => useStack(isActive2, { increment: 5 }))!

      await nextTick()

      expect(result1.zIndex.value).toBe(2000)
      expect(result2.zIndex.value).toBe(2005)
    })

    it('should update globalTop when stack changes', async () => {
      vi.useFakeTimers()
      const isActive1 = ref(true)
      const isActive2 = ref(false)

      const result1 = effectScope().run(() => useStack(isActive1))!
      const result2 = effectScope().run(() => useStack(isActive2))!

      await nextTick()
      vi.runAllTimers()

      expect(result1.globalTop.value).toBe(true)

      isActive2.value = true
      await nextTick()
      vi.runAllTimers()

      expect(result1.globalTop.value).toBe(false)
      expect(result2.globalTop.value).toBe(true)

      vi.useRealTimers()
    })

    it('should remove from stack when deactivated', async () => {
      const isActive1 = ref(true)
      const isActive2 = ref(true)

      effectScope().run(() => useStack(isActive1))!
      const result2 = effectScope().run(() => useStack(isActive2))!

      await nextTick()

      expect(result2.zIndex.value).toBe(2010)

      // Deactivate first overlay
      isActive1.value = false
      await nextTick()

      // Second overlay should still have same z-index
      expect(result2.zIndex.value).toBe(2010)
    })

    it('should generate unique ids', () => {
      const isActive = ref(false)

      const result1 = effectScope().run(() => useStack(isActive))!
      const result2 = effectScope().run(() => useStack(isActive))!

      expect(result1.id).not.toBe(result2.id)
    })

    it('should not register when disableGlobalStack is true', async () => {
      const isActive = ref(true)

      effectScope().run(() => useStack(isActive, { disableGlobalStack: true }))
      await nextTick()

      expect(stack.registry.size).toBe(0)
    })

    it('should clean up timeout on scope dispose', async () => {
      vi.useFakeTimers()
      const isActive = ref(true)
      const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

      const scope = effectScope()
      scope.run(() => useStack(isActive))

      await nextTick()

      scope.stop()

      // Should have called clearTimeout during cleanup
      expect(clearTimeoutSpy).toHaveBeenCalled()

      clearTimeoutSpy.mockRestore()
      vi.useRealTimers()
    })
  })

  describe('stack', () => {
    it('should track active state', async () => {
      const isActive = ref(false)

      expect(stack.isActive.value).toBe(false)

      effectScope().run(() => useStack(isActive))
      isActive.value = true
      await nextTick()

      expect(stack.isActive.value).toBe(true)
    })

    it('should provide scrim z-index below top overlay', async () => {
      const isActive = ref(true)

      effectScope().run(() => useStack(isActive))
      await nextTick()

      expect(stack.scrimZIndex.value).toBe(1999) // 2000 - 1
    })

    it('should return 0 for scrimZIndex when stack is empty', () => {
      expect(stack.scrimZIndex.value).toBe(0)
    })

    it('should track blocking state', async () => {
      const isActive = ref(true)

      expect(stack.isBlocking.value).toBe(false)

      effectScope().run(() => useStack(isActive, { blocking: true }))
      await nextTick()

      expect(stack.isBlocking.value).toBe(true)
    })

    it('should call onDismiss when dismiss is called', async () => {
      const isActive = ref(true)
      const onDismiss = vi.fn()

      effectScope().run(() => useStack(isActive, { onDismiss }))
      await nextTick()

      stack.dismiss()

      expect(onDismiss).toHaveBeenCalled()
    })

    it('should not call onDismiss when blocking', async () => {
      const isActive = ref(true)
      const onDismiss = vi.fn()

      effectScope().run(() => useStack(isActive, { onDismiss, blocking: true }))
      await nextTick()

      stack.dismiss()

      expect(onDismiss).not.toHaveBeenCalled()
    })

    it('should safely handle dismiss when stack is empty', () => {
      // Should not throw
      expect(() => stack.dismiss()).not.toThrow()
    })

    it('should return top overlay entry', async () => {
      const isActive1 = ref(true)
      const isActive2 = ref(true)

      effectScope().run(() => useStack(isActive1))
      const result2 = effectScope().run(() => useStack(isActive2))!

      await nextTick()

      expect(stack.top.value?.id).toBe(result2.id)
      expect(stack.top.value?.zIndex).toBe(2010)
    })

    it('should update when overlays close', async () => {
      const isActive1 = ref(true)
      const isActive2 = ref(true)

      const result1 = effectScope().run(() => useStack(isActive1))!

      effectScope().run(() => useStack(isActive2))
      await nextTick()

      expect(stack.registry.size).toBe(2)

      isActive2.value = false
      await nextTick()

      expect(stack.registry.size).toBe(1)
      expect(stack.top.value?.id).toBe(result1.id)
    })

    it('should provide registry access', async () => {
      const isActive = ref(true)

      const result = effectScope().run(() => useStack(isActive))!
      await nextTick()

      expect(stack.registry.has(result.id)).toBe(true)
      expect(stack.registry.get(result.id)?.zIndex).toBe(2000)
    })
  })
})
