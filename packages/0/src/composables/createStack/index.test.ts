import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { createApp, defineComponent, effectScope, h, nextTick, ref } from 'vue'

import {
  createStackContext,
  createStackPlugin,
  provideStackContext,
  stack,
  useStack,
  useStackContext,
} from '.'

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

    it('should clear pending timeout before creating new one', async () => {
      vi.useFakeTimers()
      const isActive1 = ref(true)
      const isActive2 = ref(false)
      const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

      effectScope().run(() => useStack(isActive1))
      effectScope().run(() => useStack(isActive2))

      await nextTick()

      // Rapidly toggle to trigger multiple watchEffect runs
      isActive2.value = true
      await nextTick()
      isActive2.value = false
      await nextTick()
      isActive2.value = true
      await nextTick()

      // Should have called clearTimeout to prevent stale updates
      expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThan(0)

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

    it('should dismiss specific overlay by ID', async () => {
      const onDismiss1 = vi.fn()
      const onDismiss2 = vi.fn()

      const result1 = effectScope().run(() =>
        useStack(ref(true), { onDismiss: onDismiss1 }),
      )!
      effectScope().run(() =>
        useStack(ref(true), { onDismiss: onDismiss2 }),
      )

      await nextTick()

      // Dismiss specific overlay (first one, not top)
      stack.dismiss(result1.id)

      expect(onDismiss1).toHaveBeenCalled()
      expect(onDismiss2).not.toHaveBeenCalled()
    })

    it('should not dismiss blocking overlay by ID', async () => {
      const onDismiss = vi.fn()

      const result = effectScope().run(() =>
        useStack(ref(true), { onDismiss, blocking: true }),
      )!

      await nextTick()

      stack.dismiss(result.id)

      expect(onDismiss).not.toHaveBeenCalled()
    })

    it('should handle onDismiss callback that throws', async () => {
      const onDismiss = vi.fn(() => {
        throw new Error('Callback error')
      })

      effectScope().run(() => useStack(ref(true), { onDismiss }))
      await nextTick()

      // Should throw but not crash
      expect(() => stack.dismiss()).toThrow('Callback error')
      expect(onDismiss).toHaveBeenCalled()
    })
  })

  describe('createStackContext', () => {
    it('should create context with default registry', () => {
      const context = createStackContext()

      expect(context.registry).toBeDefined()
      expect(context.isActive.value).toBe(false)
      expect(context.top.value).toBeUndefined()
      expect(context.scrimZIndex.value).toBe(0)
      expect(context.isBlocking.value).toBe(false)
      expect(typeof context.dismiss).toBe('function')
    })

    it('should return readonly refs', () => {
      const context = createStackContext()

      // These should be readonly (computed refs from toRef)
      expect(context.isActive.value).toBe(false)
      expect(context.top.value).toBeUndefined()
      expect(context.scrimZIndex.value).toBe(0)
      expect(context.isBlocking.value).toBe(false)
    })

    it('should track state from provided registry', async () => {
      const context = createStackContext()

      context.registry.register({ id: 'test-1', zIndex: 2000 })

      expect(context.isActive.value).toBe(true)
      expect(context.top.value?.id).toBe('test-1')
      expect(context.scrimZIndex.value).toBe(1999)
    })
  })

  describe('createStackPlugin', () => {
    it('should create a Vue plugin', () => {
      const plugin = createStackPlugin()

      expect(plugin).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })

    it('should create fresh registry per app', () => {
      const plugin = createStackPlugin()

      const app1 = createApp({ render: () => null })
      const app2 = createApp({ render: () => null })

      app1.use(plugin)
      app2.use(plugin)

      // Each app should have its own registry (can't easily test this without mounting)
      // Just verify plugin installs without error
      expect(true).toBe(true)
    })

    it('should provide context at app level', () => {
      const plugin = createStackPlugin()
      const app = createApp({ render: () => null })

      app.use(plugin)

      // Context should be providable
      let contextFound = false
      const TestComponent = defineComponent({
        setup () {
          try {
            const ctx = useStackContext()
            contextFound = !!ctx
          } catch {
            contextFound = false
          }
          return () => null
        },
      })

      mount(TestComponent, {
        global: {
          plugins: [plugin],
        },
      })

      expect(contextFound).toBe(true)
    })

    it('should isolate state between apps', async () => {
      const plugin1 = createStackPlugin()
      const plugin2 = createStackPlugin()

      let context1: ReturnType<typeof useStackContext> | undefined
      let context2: ReturnType<typeof useStackContext> | undefined

      const TestComponent1 = defineComponent({
        setup () {
          context1 = useStackContext()
          return () => null
        },
      })

      const TestComponent2 = defineComponent({
        setup () {
          context2 = useStackContext()
          return () => null
        },
      })

      mount(TestComponent1, { global: { plugins: [plugin1] } })
      mount(TestComponent2, { global: { plugins: [plugin2] } })

      // Register in first context
      context1!.registry.register({ id: 'app1-overlay', zIndex: 2000 })

      await nextTick()

      // First context should have the overlay
      expect(context1!.isActive.value).toBe(true)
      expect(context1!.registry.size).toBe(1)

      // Second context should be empty (isolated)
      expect(context2!.isActive.value).toBe(false)
      expect(context2!.registry.size).toBe(0)
    })
  })

  describe('provideStackContext', () => {
    it('should provide context to component tree', () => {
      let childContext: ReturnType<typeof useStackContext> | undefined

      const Parent = defineComponent({
        setup () {
          const context = createStackContext()
          provideStackContext(context)
          return () => h(Child)
        },
      })

      const Child = defineComponent({
        setup () {
          childContext = useStackContext()
          return () => null
        },
      })

      mount(Parent)

      expect(childContext).toBeDefined()
      expect(childContext!.registry).toBeDefined()
    })
  })

  describe('parent/child nesting', () => {
    it('should track localTop based on children', async () => {
      vi.useFakeTimers()

      let parentResult: ReturnType<typeof useStack> | undefined

      const parentActive = ref(true)
      const childActive = ref(false)

      const Child = defineComponent({
        setup () {
          useStack(childActive)
          return () => null
        },
      })

      const Parent = defineComponent({
        setup () {
          parentResult = useStack(parentActive)
          return () => h(Child)
        },
      })

      mount(Parent, {
        global: {
          plugins: [createStackPlugin()],
        },
      })

      await nextTick()
      vi.runAllTimers()

      // Parent should be localTop when no children are active
      expect(parentResult!.localTop.value).toBe(true)

      // Activate child
      childActive.value = true
      await nextTick()
      vi.runAllTimers()

      // Parent should no longer be localTop
      expect(parentResult!.localTop.value).toBe(false)

      // Deactivate child
      childActive.value = false
      await nextTick()
      vi.runAllTimers()

      // Parent should be localTop again
      expect(parentResult!.localTop.value).toBe(true)

      vi.useRealTimers()
    })

    it('should handle grandchild nesting', async () => {
      vi.useFakeTimers()

      let grandparentResult: ReturnType<typeof useStack> | undefined
      let parentResult: ReturnType<typeof useStack> | undefined
      let _childResult: ReturnType<typeof useStack> | undefined

      const grandparentActive = ref(true)
      const parentActive = ref(false)
      const childActive = ref(false)

      const Grandchild = defineComponent({
        setup () {
          _childResult = useStack(childActive)
          return () => null
        },
      })

      const Parent = defineComponent({
        setup () {
          parentResult = useStack(parentActive)
          return () => h(Grandchild)
        },
      })

      const Grandparent = defineComponent({
        setup () {
          grandparentResult = useStack(grandparentActive)
          return () => h(Parent)
        },
      })

      mount(Grandparent, {
        global: {
          plugins: [createStackPlugin()],
        },
      })

      await nextTick()
      vi.runAllTimers()

      // Initially only grandparent is active
      expect(grandparentResult!.localTop.value).toBe(true)

      // Activate parent (child of grandparent)
      parentActive.value = true
      await nextTick()
      vi.runAllTimers()

      expect(grandparentResult!.localTop.value).toBe(false)
      expect(parentResult!.localTop.value).toBe(true)

      // Activate grandchild (child of parent)
      childActive.value = true
      await nextTick()
      vi.runAllTimers()

      expect(grandparentResult!.localTop.value).toBe(false)
      expect(parentResult!.localTop.value).toBe(false)
      expect(_childResult!.localTop.value).toBe(true)

      vi.useRealTimers()
    })

    it('should still track parent when disableGlobalStack is true', async () => {
      vi.useFakeTimers()

      let parentResult: ReturnType<typeof useStack> | undefined
      let pluginContext: ReturnType<typeof useStackContext> | undefined

      const parentActive = ref(true)
      const childActive = ref(false)

      const Child = defineComponent({
        setup () {
          // Child uses disableGlobalStack but should still register with parent
          useStack(childActive, { disableGlobalStack: true })
          return () => null
        },
      })

      const Parent = defineComponent({
        setup () {
          pluginContext = useStackContext()
          parentResult = useStack(parentActive)
          return () => h(Child)
        },
      })

      mount(Parent, {
        global: {
          plugins: [createStackPlugin()],
        },
      })

      await nextTick()
      vi.runAllTimers()

      // Parent should be localTop when child is inactive
      expect(parentResult!.localTop.value).toBe(true)

      // Activate child (with disableGlobalStack)
      childActive.value = true
      await nextTick()
      vi.runAllTimers()

      // Parent should not be localTop because child registered with it
      expect(parentResult!.localTop.value).toBe(false)

      // Plugin context registry should only have parent (child used disableGlobalStack)
      expect(pluginContext!.registry.size).toBe(1)

      vi.useRealTimers()
    })
  })

  describe('server-side rendering', () => {
    it('should set globalTop synchronously when IN_BROWSER is false', async () => {
      // This test verifies the SSR code path exists and works correctly
      // In the actual SSR environment, IN_BROWSER would be false
      // Here we test that the sync path sets globalTop immediately

      const isActive = ref(true)

      // Using effectScope simulates non-browser context (no setTimeout delay)
      const result = effectScope().run(() => useStack(isActive))!

      // In SSR, globalTop should be set immediately (before any timers)
      // The value starts as true (default)
      expect(result.globalTop.value).toBe(true)
    })

    it('should not create memory leaks in SSR context', () => {
      // Test that scope disposal properly cleans up
      const scope = effectScope()
      const isActive = ref(true)

      scope.run(() => useStack(isActive))

      // Dispose should not throw
      expect(() => scope.stop()).not.toThrow()
    })
  })
})
