import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, onScopeDispose, ref, watch } from 'vue'
import { useToggleScope } from './index'

describe('useToggleScope', () => {
  it('starts scope when source is initially true', async () => {
    const source = ref(true)
    const fn = vi.fn()

    effectScope().run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('does not start scope when source is initially false', async () => {
    const source = ref(false)
    const fn = vi.fn()

    effectScope().run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()
    expect(fn).not.toHaveBeenCalled()
  })

  it('starts scope when source changes from false to true', async () => {
    const source = ref(false)
    const fn = vi.fn()

    effectScope().run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()
    expect(fn).not.toHaveBeenCalled()

    source.value = true
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('stops scope when source changes from true to false', async () => {
    const source = ref(true)
    const cleanup = vi.fn()

    effectScope().run(() => {
      useToggleScope(source, () => {
        onScopeDispose(cleanup)
      })
    })

    await nextTick()
    expect(cleanup).not.toHaveBeenCalled()

    source.value = false
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  it('handles rapid toggling', async () => {
    const source = ref(false)
    const fn = vi.fn()
    const cleanup = vi.fn()

    effectScope().run(() => {
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
  })

  it('prevents duplicate scope creation when already active', async () => {
    const source = ref(true)
    const fn = vi.fn()

    effectScope().run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)

    // Toggle to true again (should not create new scope)
    source.value = true
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('cleans up when parent scope is disposed', async () => {
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

  it('provides controls when function expects parameter', async () => {
    const source = ref(true)
    const fn = vi.fn()
    let receivedControls: any

    effectScope().run(() => {
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

    // Call reset to restart the scope
    receivedControls.reset()
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('does not provide controls when function has no parameters', async () => {
    const source = ref(true)
    const fn = vi.fn()

    effectScope().run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith() // No arguments
  })

  it('returns control object with isActive', async () => {
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

  it('allows manual start and stop via controls', async () => {
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

  it('reset method stops and restarts scope', async () => {
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

  it('isActive is readonly', async () => {
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

  it('prevents duplicate start calls', async () => {
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

  it('handles deactivation when scope is undefined', async () => {
    const source = ref(false)
    const fn = vi.fn()

    effectScope().run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()

    // Deactivate when scope was never created
    source.value = false
    await nextTick()

    // Should not throw
    expect(fn).not.toHaveBeenCalled()
  })

  it('handles multiple activations after deactivation', async () => {
    const source = ref(false)
    const fn = vi.fn()
    const cleanup = vi.fn()

    effectScope().run(() => {
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
  })

  it('works with computed sources', async () => {
    const count = ref(0)
    function source () {
      return count.value > 0
    }
    const fn = vi.fn()

    effectScope().run(() => {
      useToggleScope(source, fn)
    })

    await nextTick()
    expect(fn).not.toHaveBeenCalled()

    count.value = 1
    await nextTick()
    expect(fn).toHaveBeenCalledTimes(1)

    count.value = 0
    await nextTick()
    // Cleanup should have run
  })

  it('cleans up reactive effects created inside scoped function', async () => {
    const source = ref(true)
    const effect = vi.fn()
    const inner = ref(0)

    effectScope().run(() => {
      useToggleScope(source, () => {
        // This watch should be cleaned up when scope stops
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
  })
})
