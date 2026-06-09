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

import { createReducedMotionPlugin, useReducedMotion } from './index'

// Utilities
import { createApp } from 'vue'

afterEach(() => {
  delete (document.body.dataset as Record<string, unknown>).reducedMotion
})

describe('useReducedMotion SSR', () => {
  it('should not write document.body.dataset.reducedMotion in SSR', () => {
    delete (document.body.dataset as Record<string, unknown>).reducedMotion

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
    const push = vi.fn(() => ({ dispose }))

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
    const push = vi.fn(() => ({ dispose: vi.fn() }))

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
    const push = vi.fn(() => ({ dispose: vi.fn() }))

    const app = createApp({ setup: () => () => null })
    app.provide('head', { push })
    app.use(createReducedMotionPlugin({ mode: 'always' }))
    app.mount(document.createElement('div'))

    expect(push).toHaveBeenCalledTimes(1)

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
