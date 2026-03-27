import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// Composables
import { useScrollLock } from './useScrollLock'

// Utilities
import { effectScope, nextTick, ref } from 'vue'

// The module uses a module-level `lockCount` variable, so we need
// a fresh module for each test to reset the count.
// As an alternative, we rely on proper cleanup via scope disposal.

describe('useScrollLock', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('sets overflow to hidden when condition is true', async () => {
    const scope = effectScope()
    scope.run(() => {
      useScrollLock(true)
    })
    await nextTick()

    expect(document.body.style.overflow).toBe('hidden')
    scope.stop()
  })

  it('restores overflow when condition goes false', async () => {
    const scope = effectScope()
    const locked = ref(true)

    scope.run(() => {
      useScrollLock(locked)
    })
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    locked.value = false
    await nextTick()
    expect(document.body.style.overflow).toBe('')

    scope.stop()
  })

  it('reference counting: two locks active, first releases, still locked', async () => {
    const scope1 = effectScope()
    const scope2 = effectScope()
    const lock1 = ref(true)
    const lock2 = ref(true)

    scope1.run(() => {
      useScrollLock(lock1)
    })
    scope2.run(() => {
      useScrollLock(lock2)
    })
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    // Release first lock
    lock1.value = false
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    // Release second lock — now unlocked
    lock2.value = false
    await nextTick()
    expect(document.body.style.overflow).toBe('')

    scope1.stop()
    scope2.stop()
  })

  it('restores overflow when scope is disposed', async () => {
    const scope = effectScope()

    scope.run(() => {
      useScrollLock(true)
    })
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    scope.stop()
    await nextTick()
    expect(document.body.style.overflow).toBe('')
  })
})
