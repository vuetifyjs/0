/**
 * SSR-specific tests for useReducedMotion composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
  SUPPORTS_MATCH_MEDIA: false,
}))

// Composables
import { createStoragePlugin, MemoryStorageAdapter, useStorage } from '#v0/composables/useStorage'

import { createReducedMotionPlugin, useReducedMotion } from './index'

// Utilities
import { createApp, nextTick } from 'vue'

afterEach(() => {
  delete document.body.dataset.reducedMotion
})

describe('useReducedMotion SSR', () => {
  it('should not write document.body.dataset.reducedMotion in SSR', () => {
    delete document.body.dataset.reducedMotion

    const app = createApp({ setup: () => () => null })
    app.use(createReducedMotionPlugin({ mode: 'always' }))
    app.mount(document.createElement('div'))

    expect(document.body.dataset.reducedMotion).toBeUndefined()

    app.unmount()
  })

  it('should resolve isReduced to false under SSR in system mode', () => {
    const app = createApp({ setup: () => () => null })
    app.use(createReducedMotionPlugin({ mode: 'system' }))

    let ctx: ReturnType<typeof useReducedMotion> | undefined
    app.runWithContext(() => {
      ctx = useReducedMotion()
    })

    expect(ctx!.isReduced.value).toBe(false)
  })

  it('should render data-reduced-motion via @unhead under SSR', () => {
    const dispose = vi.fn()
    const push = vi.fn(() => ({ dispose, patch: vi.fn() }))

    const app = createApp({ setup: () => () => null })
    app.provide('usehead', { push })
    app.use(createReducedMotionPlugin({ mode: 'always' }))
    app.mount(document.createElement('div'))

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith({
      bodyAttrs: { 'data-reduced-motion': 'reduce' },
    })
    expect(document.body.dataset.reducedMotion).toBeUndefined()

    app.unmount()
    expect(dispose).toHaveBeenCalledTimes(1)
  })

  it('should push no-preference via @unhead for non-reducing modes under SSR', () => {
    const push = vi.fn(() => ({ dispose: vi.fn(), patch: vi.fn() }))

    const app = createApp({ setup: () => () => null })
    app.provide('usehead', { push })
    app.use(createReducedMotionPlugin({ mode: 'never' }))
    app.mount(document.createElement('div'))

    expect(push).toHaveBeenCalledWith({
      bodyAttrs: { 'data-reduced-motion': 'no-preference' },
    })

    app.unmount()
  })

  it('should resolve @unhead via the head provide key too', () => {
    const push = vi.fn(() => ({ dispose: vi.fn(), patch: vi.fn() }))

    const app = createApp({ setup: () => () => null })
    app.provide('head', { push })
    app.use(createReducedMotionPlugin({ mode: 'always' }))
    app.mount(document.createElement('div'))

    expect(push).toHaveBeenCalledTimes(1)

    app.unmount()
  })

  it('should patch the @unhead entry when the mode changes during SSR', async () => {
    const patch = vi.fn()
    const push = vi.fn(() => ({ dispose: vi.fn(), patch }))

    const app = createApp({ setup: () => () => null })
    app.provide('usehead', { push })
    app.use(createReducedMotionPlugin({ mode: 'never' }))
    app.mount(document.createElement('div'))

    app.runWithContext(() => {
      const ctx = useReducedMotion()
      ctx.select('always')
    })

    await nextTick()

    expect(patch).toHaveBeenCalledWith({
      bodyAttrs: { 'data-reduced-motion': 'reduce' },
    })

    app.unmount()
  })

  it('should render a restored persisted mode in the initial @unhead push', () => {
    const push = vi.fn(() => ({ dispose: vi.fn(), patch: vi.fn() }))

    const app = createApp({ render: () => null })
    app.use(createStoragePlugin({ adapter: new MemoryStorageAdapter() }))

    // Pre-seed storage with 'always' so restore() runs before the adapter pushes
    app.runWithContext(() => {
      const storage = useStorage()
      storage.set('reduced-motion', 'always')
    })

    app.provide('usehead', { push })
    app.use(createReducedMotionPlugin({ persist: true }))
    app.mount(document.createElement('div'))

    expect(push).toHaveBeenCalledWith({
      bodyAttrs: { 'data-reduced-motion': 'reduce' },
    })

    app.unmount()
  })

  it('should not throw under SSR when @unhead is not installed', () => {
    const app = createApp({ setup: () => () => null })

    expect(() => {
      app.use(createReducedMotionPlugin({ mode: 'always' }))
      app.mount(document.createElement('div'))
      app.unmount()
    }).not.toThrow()

    expect(document.body.dataset.reducedMotion).toBeUndefined()
  })
})
