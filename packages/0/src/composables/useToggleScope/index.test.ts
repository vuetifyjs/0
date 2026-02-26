import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope, nextTick, onScopeDispose, ref, watch } from 'vue'

import { useToggleScope } from './index'

describe('useToggleScope', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should start scope when source is initially true', async () => {
    const source = ref(true)
    const fn = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)

    scope.stop()
  })

  it('should not start scope when source is initially false', async () => {
    const source = ref(false)
    const fn = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()
    expect(fn).not.toHaveBeenCalled()

    scope.stop()
  })

  it('should start scope when source changes from false to true', async () => {
    const source = ref(false)
    const fn = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()
    expect(fn).not.toHaveBeenCalled()

    source.value = true
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)

    scope.stop()
  })

  it('should stop scope when source changes from true to false', async () => {
    const source = ref(true)
    const cleanup = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      useToggleScope(source, () => {
        onScopeDispose(cleanup)
      })
    })

    await nextTick()
    expect(cleanup).not.toHaveBeenCalled()

    source.value = false
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)

    scope.stop()
  })

  it('should handle rapid toggling', async () => {
    const source = ref(false)
    const fn = vi.fn()
    const cleanup = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      useToggleScope(source, () => {
        fn()
        onScopeDispose(cleanup)
      })
    })

    source.value = true
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(cleanup).not.toHaveBeenCalled()

    source.value = false
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)

    source.value = true
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(2)
    expect(cleanup).toHaveBeenCalledTimes(1)

    source.value = false
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(2)

    scope.stop()
  })

  it('should prevent duplicate scope creation when already active', async () => {
    const source = ref(true)
    const fn = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)

    source.value = true
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)

    scope.stop()
  })

  it('should clean up when parent scope is disposed', async () => {
    const source = ref(true)
    const cleanup = vi.fn()
    const scope = effectScope()

    scope.run(() => {
      useToggleScope(source, () => {
        onScopeDispose(cleanup)
      })
    })

    await nextTick()
    expect(cleanup).not.toHaveBeenCalled()

    scope.stop()
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  it('should provide controls when function expects parameter', async () => {
    const source = ref(true)
    const fn = vi.fn()
    let receivedControls: ReturnType<typeof useToggleScope> | undefined

    const scope = effectScope()
    scope.run(() => {
      useToggleScope(source, controls => {
        receivedControls = controls
        fn()
      })
    })

    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(receivedControls).toBeDefined()
    expect(receivedControls).toHaveProperty('isActive')
    expect(receivedControls).toHaveProperty('reset')
    expect(receivedControls).toHaveProperty('start')
    expect(receivedControls).toHaveProperty('stop')

    receivedControls!.reset()
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(2)

    scope.stop()
  })

  it('should not provide controls when function has no parameters', async () => {
    const source = ref(true)
    const fn = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith()

    scope.stop()
  })

  it('should return control object with isActive', async () => {
    const source = ref(false)
    const fn = vi.fn()

    const controls = effectScope().run(() => {
      return useToggleScope(source, fn)
    })!

    expect(controls.isActive.value).toBe(false)

    source.value = true
    await nextTick()
    expect(controls.isActive.value).toBe(true)
    expect(fn).toHaveBeenCalledTimes(1)

    source.value = false
    await nextTick()
    expect(controls.isActive.value).toBe(false)
  })

  it('should allow manual start and stop via controls', async () => {
    const source = ref(false)
    const fn = vi.fn()

    const controls = effectScope().run(() => {
      return useToggleScope(source, fn)
    })!

    expect(controls.isActive.value).toBe(false)

    // Manual start
    controls.start()
    await nextTick()
    expect(controls.isActive.value).toBe(true)
    expect(fn).toHaveBeenCalledTimes(1)

    // Manual stop
    controls.stop()
    await nextTick()
    expect(controls.isActive.value).toBe(false)
  })

  it('should stop and restart scope with reset method', async () => {
    const source = ref(true)
    const fn = vi.fn()
    const cleanup = vi.fn()

    const controls = effectScope().run(() => {
      return useToggleScope(source, () => {
        fn()
        onScopeDispose(cleanup)
      })
    })!

    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(controls.isActive.value).toBe(true)

    controls.reset()
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(controls.isActive.value).toBe(true)
  })

  it('should have readonly isActive', async () => {
    const source = ref(true)

    const controls = effectScope().run(() => {
      return useToggleScope(source, () => {})
    })!

    await nextTick()
    expect(controls.isActive.value).toBe(true)

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Attempt to modify (should fail silently or throw in strict mode)
    // @ts-expect-error - isActive should be readonly
    controls.isActive.value = false

    // Value should remain unchanged
    expect(controls.isActive.value).toBe(true)

    warnSpy.mockRestore()
  })

  it('should prevent duplicate start calls', async () => {
    const source = ref(false)
    const fn = vi.fn()

    const controls = effectScope().run(() => {
      return useToggleScope(source, fn)
    })!

    controls.start()
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)

    // Second start should be ignored
    controls.start()
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should handle deactivation when scope is undefined', async () => {
    const source = ref(false)
    const fn = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()

    source.value = false
    await nextTick()

    expect(fn).not.toHaveBeenCalled()

    scope.stop()
  })

  it('should handle multiple activations after deactivation', async () => {
    const source = ref(false)
    const fn = vi.fn()
    const cleanup = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      useToggleScope(source, () => {
        fn()
        onScopeDispose(cleanup)
      })
    })

    // First activation
    source.value = true
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)

    // Deactivation
    source.value = false
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)

    // Second activation
    source.value = true
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(2)

    // Third activation after deactivation
    source.value = false
    await nextTick()
    source.value = true
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(3)
    expect(cleanup).toHaveBeenCalledTimes(2)

    scope.stop()
  })

  it('should work with computed sources', async () => {
    const count = ref(0)
    function source () {
      return count.value > 0
    }
    const fn = vi.fn()
    const cleanup = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      useToggleScope(source, () => {
        fn()
        onScopeDispose(cleanup)
      })
    })

    await nextTick()
    expect(fn).not.toHaveBeenCalled()

    count.value = 1
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)

    count.value = 0
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)

    scope.stop()
  })

  it('should clean up reactive effects created inside scoped function', async () => {
    const source = ref(true)
    const effect = vi.fn()
    const inner = ref(0)

    const scope = effectScope()
    scope.run(() => {
      useToggleScope(source, () => {
        watch(inner, effect)
      })
    })

    await nextTick()

    inner.value = 1
    await nextTick()
    expect(effect).toHaveBeenCalledTimes(1)

    // Stop the scope
    source.value = false
    await nextTick()

    // Watch should be cleaned up, so effect shouldn't run
    inner.value = 2
    await nextTick()
    expect(effect).toHaveBeenCalledTimes(1)

    scope.stop()
  })
})
