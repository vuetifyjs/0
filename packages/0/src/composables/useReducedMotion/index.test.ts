import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createReducedMotion, createReducedMotionPlugin, useReducedMotion } from './index'

// Utilities
import { createApp, nextTick } from 'vue'

let mediaQueryMatches = false
let lastFireCallback: ((matches: boolean) => void) | null = null

class TestMediaQueryList {
  matches: boolean
  private listeners: Array<(e: { matches: boolean }) => void> = []

  constructor (matches: boolean, fire: (cb: (matches: boolean) => void) => void) {
    this.matches = matches
    fire((m) => {
      this.matches = m
      for (const l of this.listeners) l({ matches: m })
    })
  }

  addEventListener (_: string, cb: (e: { matches: boolean }) => void) {
    this.listeners.push(cb)
  }

  removeEventListener (_: string, cb: (e: { matches: boolean }) => void) {
    this.listeners = this.listeners.filter(l => l !== cb)
  }
}

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
  SUPPORTS_MATCH_MEDIA: true,
}))

beforeEach(() => {
  mediaQueryMatches = false
  lastFireCallback = null
  vi.stubGlobal('matchMedia', (query: string) => {
    if (query === '(prefers-reduced-motion: reduce)') {
      return new TestMediaQueryList(mediaQueryMatches, cb => { lastFireCallback = cb })
    }
    return new TestMediaQueryList(false, () => {})
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  delete (document.body.dataset as Record<string, unknown>).reducedMotion
})

describe('createReducedMotion', () => {
  describe('mode: system', () => {
    it('should default to system mode', () => {
      const ctx = createReducedMotion()
      expect(ctx.mode.value).toBe('system')
    })

    it('should return false when OS prefers no reduction', () => {
      mediaQueryMatches = false
      const ctx = createReducedMotion()
      expect(ctx.reduced.value).toBe(false)
    })

    it('should return true when OS prefers reduction', () => {
      mediaQueryMatches = true
      const ctx = createReducedMotion()
      expect(ctx.reduced.value).toBe(true)
    })

    it('current reflects OS preference regardless of mode', () => {
      mediaQueryMatches = true
      const ctx = createReducedMotion({ mode: 'never' })
      expect(ctx.current.value).toBe(true)
      expect(ctx.reduced.value).toBe(false)
    })
  })

  describe('mode: always', () => {
    it('should force reduced=true regardless of OS', () => {
      mediaQueryMatches = false
      const ctx = createReducedMotion({ mode: 'always' })
      expect(ctx.reduced.value).toBe(true)
    })
  })

  describe('mode: never', () => {
    it('should force reduced=false regardless of OS', () => {
      mediaQueryMatches = true
      const ctx = createReducedMotion({ mode: 'never' })
      expect(ctx.reduced.value).toBe(false)
    })
  })

  describe('setMode', () => {
    it('should update reduced reactively when mode changes', async () => {
      mediaQueryMatches = true
      const ctx = createReducedMotion({ mode: 'never' })
      expect(ctx.reduced.value).toBe(false)

      ctx.setMode('system')
      await nextTick()
      expect(ctx.reduced.value).toBe(true)
    })

    it('should switch from always to never', async () => {
      mediaQueryMatches = false
      const ctx = createReducedMotion({ mode: 'always' })
      expect(ctx.reduced.value).toBe(true)

      ctx.setMode('never')
      await nextTick()
      expect(ctx.reduced.value).toBe(false)
    })

    it('should react to OS media query changes in system mode', async () => {
      mediaQueryMatches = false
      const ctx = createReducedMotion({ mode: 'system' })
      expect(ctx.reduced.value).toBe(false)

      lastFireCallback!(true)
      await nextTick()
      expect(ctx.reduced.value).toBe(true)
    })
  })
})

describe('createReducedMotionPlugin', () => {
  it('should provide context to app', () => {
    let ctx: ReturnType<typeof useReducedMotion> | undefined

    const app = createApp({
      setup () {
        ctx = useReducedMotion()
        return () => null
      },
    })

    app.use(createReducedMotionPlugin({ mode: 'always' }))
    app.mount(document.createElement('div'))

    expect(ctx).toBeDefined()
    expect(ctx!.reduced.value).toBe(true)

    app.unmount()
  })

  it('should set document.body.dataset.reducedMotion on install', async () => {
    mediaQueryMatches = false
    const app = createApp({ setup: () => () => null })
    app.use(createReducedMotionPlugin({ mode: 'always' }))
    app.mount(document.createElement('div'))

    await nextTick()
    expect(document.body.dataset.reducedMotion).toBe('reduce')

    app.unmount()
  })

  it('should set no-preference when mode is never', async () => {
    mediaQueryMatches = true
    const app = createApp({ setup: () => () => null })
    app.use(createReducedMotionPlugin({ mode: 'never' }))
    app.mount(document.createElement('div'))

    await nextTick()
    expect(document.body.dataset.reducedMotion).toBe('no-preference')

    app.unmount()
  })

  it('should update dataset when mode changes at runtime', async () => {
    mediaQueryMatches = false
    let ctx: ReturnType<typeof useReducedMotion> | undefined

    const app = createApp({
      setup () {
        ctx = useReducedMotion()
        return () => null
      },
    })

    app.use(createReducedMotionPlugin({ mode: 'never' }))
    app.mount(document.createElement('div'))

    await nextTick()
    expect(document.body.dataset.reducedMotion).toBe('no-preference')

    ctx!.setMode('always')
    await nextTick()
    expect(document.body.dataset.reducedMotion).toBe('reduce')

    app.unmount()
  })
})

describe('useReducedMotion (fallback)', () => {
  it('should return fallback when no plugin is installed', () => {
    const ctx = useReducedMotion()
    expect(ctx.reduced.value).toBe(false)
    expect(ctx.mode.value).toBe('system')
  })
})
