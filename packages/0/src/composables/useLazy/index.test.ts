import { describe, expect, it } from 'vitest'

// Utilities
import { nextTick, ref } from 'vue'

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
})
