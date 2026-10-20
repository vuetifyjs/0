/**
 * SSR paths for createVirtual.
 *
 * IN_BROWSER is file-wide, so the browser suite cannot reach the branches
 * that flush a resize without an animation frame.
 */
import { describe, expect, it, vi } from 'vitest'

// Utilities
import { nextTick, shallowRef } from 'vue'

vi.mock('#v0/composables/useHydration', () => ({
  useHydration: () => ({
    isHydrated: shallowRef(true),
    hydrate: vi.fn(),
  }),
}))

vi.mock('#v0/constants/globals', async () => ({
  ...await vi.importActual('#v0/constants/globals'),
  IN_BROWSER: false,
  SUPPORTS_OBSERVER: false,
}))

import { createVirtual } from './index'

describe('createVirtual SSR', () => {
  it('should flush a resize without an animation frame', async () => {
    const items = shallowRef(Array.from({ length: 10 }, (_, index) => index))
    const virtual = createVirtual(items, { itemHeight: 50, height: 500 })
    const el = {
      scrollTop: 0,
      scrollHeight: 10_000,
      clientHeight: 500,
      style: {},
    } as unknown as HTMLElement

    virtual.resize(0, 80)
    virtual.element.value = el
    await nextTick()

    virtual.scrollTo(1)
    expect(el.scrollTop).toBe(80)
  })

  it('should move the window when scroll runs on the server', async () => {
    const items = shallowRef(Array.from({ length: 20 }, (_, index) => index))
    const virtual = createVirtual(items, { itemHeight: 50, height: 500 })
    const el = {
      scrollTop: 0,
      scrollHeight: 10_000,
      clientHeight: 500,
      style: {},
    } as unknown as HTMLElement

    virtual.element.value = el
    await nextTick()

    el.scrollTop = 400
    virtual.scroll()

    expect(virtual.offset.value).toBe(150)
    expect(virtual.items.value[0]!.index).toBe(3)
  })
})
