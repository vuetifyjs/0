import { describe, expect, it } from 'vitest'

// Utilities
import { effectScope, nextTick, ref } from 'vue'

// Types
import type { LazyContext } from './index'

import { useLazy } from './index'

describe('useLazy', () => {
  it('should not boot initially when inactive', () => {
    const active = ref(false)
    const { isBooted, hasContent } = useLazy(active)

    expect(isBooted.value).toBe(false)
    expect(hasContent.value).toBe(false)
  })

  it('should boot when active becomes true', async () => {
    const active = ref(false)
    const { isBooted, hasContent } = useLazy(active)

    active.value = true
    await nextTick()

    expect(isBooted.value).toBe(true)
    expect(hasContent.value).toBe(true)
  })

  it('should stay booted after deactivation', async () => {
    const active = ref(true)
    const { isBooted, hasContent } = useLazy(active)

    await nextTick()
    expect(isBooted.value).toBe(true)

    active.value = false
    await nextTick()

    expect(isBooted.value).toBe(true)
    expect(hasContent.value).toBe(true)
  })

  it('should reset on onAfterLeave when not eager', async () => {
    const active = ref(true)
    const { isBooted, hasContent, onAfterLeave } = useLazy(active)

    await nextTick()
    active.value = false
    onAfterLeave()

    expect(isBooted.value).toBe(false)
    expect(hasContent.value).toBe(false)
  })

  it('should not reset on onAfterLeave when eager', async () => {
    const active = ref(true)
    const { isBooted, onAfterLeave } = useLazy(active, { eager: true })

    await nextTick()
    active.value = false
    onAfterLeave()

    expect(isBooted.value).toBe(true)
  })

  it('should have content immediately when eager', () => {
    const active = ref(false)
    const { hasContent } = useLazy(active, { eager: true })

    expect(hasContent.value).toBe(true)
  })

  it('should support reactive eager option', async () => {
    const active = ref(false)
    const eager = ref(false)
    const { hasContent } = useLazy(active, { eager })

    expect(hasContent.value).toBe(false)

    eager.value = true
    await nextTick()

    expect(hasContent.value).toBe(true)
  })

  it('should allow manual reset', async () => {
    const active = ref(true)
    const { isBooted, reset } = useLazy(active)

    await nextTick()
    expect(isBooted.value).toBe(true)

    reset()
    expect(isBooted.value).toBe(false)
  })

  it('should boot immediately if active starts true', () => {
    const active = ref(true)
    const { isBooted, hasContent } = useLazy(active)

    expect(isBooted.value).toBe(true)
    expect(hasContent.value).toBe(true)
  })

  it('should stop watcher on scope disposal', async () => {
    const active = ref(false)
    let context: LazyContext

    const scope = effectScope()
    scope.run(() => {
      context = useLazy(active)
    })

    scope.stop()

    active.value = true
    await nextTick()

    expect(context!.isBooted.value).toBe(false)
  })

  it('should re-boot after reset when activated again', async () => {
    const active = ref(true)
    const { isBooted, reset } = useLazy(active)

    await nextTick()
    expect(isBooted.value).toBe(true)

    reset()
    expect(isBooted.value).toBe(false)

    active.value = false
    await nextTick()

    active.value = true
    await nextTick()

    expect(isBooted.value).toBe(true)
  })

  it('should accept plain boolean for active', () => {
    const { isBooted: booted1 } = useLazy(true)
    expect(booted1.value).toBe(true)

    const { isBooted: booted2 } = useLazy(false)
    expect(booted2.value).toBe(false)
  })

  it('should lose content when eager toggles from true to false while not booted', async () => {
    const active = ref(false)
    const eager = ref(true)
    const { hasContent, isBooted } = useLazy(active, { eager })

    expect(hasContent.value).toBe(true)
    expect(isBooted.value).toBe(false)

    eager.value = false
    await nextTick()

    expect(hasContent.value).toBe(false)
  })

  it('should handle rapid toggle sequences', async () => {
    const active = ref(false)
    const { isBooted } = useLazy(active)

    active.value = true
    await nextTick()
    expect(isBooted.value).toBe(true)

    active.value = false
    active.value = true
    active.value = false
    active.value = true
    await nextTick()

    expect(isBooted.value).toBe(true)
  })

  it('should accept getter function for active', async () => {
    const source = ref(false)
    const { isBooted, hasContent } = useLazy(() => source.value)

    expect(isBooted.value).toBe(false)
    expect(hasContent.value).toBe(false)

    source.value = true
    await nextTick()

    expect(isBooted.value).toBe(true)
    expect(hasContent.value).toBe(true)
  })

  it('should accept getter function for eager option', async () => {
    const active = ref(false)
    const eagerSource = ref(false)
    const { hasContent, onAfterLeave } = useLazy(active, { eager: () => eagerSource.value })

    expect(hasContent.value).toBe(false)

    eagerSource.value = true
    await nextTick()

    expect(hasContent.value).toBe(true)

    // onAfterLeave should not reset when eager getter returns true
    active.value = true
    await nextTick()
    active.value = false
    onAfterLeave()

    expect(hasContent.value).toBe(true)

    // onAfterLeave should reset when eager getter returns false
    eagerSource.value = false
    active.value = true
    await nextTick()
    active.value = false
    onAfterLeave()

    expect(hasContent.value).toBe(false)
  })
})
