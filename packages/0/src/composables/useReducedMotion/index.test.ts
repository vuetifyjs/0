import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createStoragePlugin, MemoryStorageAdapter, useStorage } from '#v0/composables/useStorage'

import { createReducedMotion, createReducedMotionPlugin, ReducedMotionAdapter, useReducedMotion } from './index'

// Utilities
import { createApp, effectScope, nextTick } from 'vue'

// Types
import type { ReducedMotionOptions } from './index'
import type { EffectScope } from 'vue'

let mediaQueryMatches = false
let lastFireCallback: ((matches: boolean) => void) | null = null

class TestMediaQueryList {
  matches: boolean
  private listeners: Array<(e: { matches: boolean }) => void> = []

  constructor (matches: boolean, fire: (cb: (matches: boolean) => void) => void) {
    this.matches = matches
    fire(m => {
      this.matches = m
      for (const listener of this.listeners) listener({ matches: m })
    })
  }

  addEventListener (_: string, cb: (e: { matches: boolean }) => void) {
    this.listeners.push(cb)
  }

  removeEventListener (_: string, cb: (e: { matches: boolean }) => void) {
    this.listeners = this.listeners.filter(listener => listener !== cb)
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
      return new TestMediaQueryList(mediaQueryMatches, cb => {
        lastFireCallback = cb
      })
    }
    return new TestMediaQueryList(false, () => {})
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  delete document.body.dataset.reducedMotion
})

describe('createReducedMotion', () => {
  let scope: EffectScope

  function setup (options: ReducedMotionOptions = {}) {
    let ctx: ReturnType<typeof createReducedMotion>
    scope = effectScope()
    scope.run(() => {
      ctx = createReducedMotion(options)
    })
    return ctx!
  }

  afterEach(() => {
    scope?.stop()
  })

  describe('mode: system', () => {
    it('should default to system mode', () => {
      const ctx = setup()
      expect(ctx.selectedMode.value).toBe('system')
    })

    it('should return false when OS prefers no reduction', () => {
      mediaQueryMatches = false
      const ctx = setup()
      expect(ctx.isReduced.value).toBe(false)
    })

    it('should return true when OS prefers reduction', () => {
      mediaQueryMatches = true
      const ctx = setup()
      expect(ctx.isReduced.value).toBe(true)
    })
  })

  describe('mode: always', () => {
    it('should force isReduced=true regardless of OS', () => {
      mediaQueryMatches = false
      const ctx = setup({ mode: 'always' })
      expect(ctx.isReduced.value).toBe(true)
    })
  })

  describe('mode: never', () => {
    it('should force isReduced=false regardless of OS', () => {
      mediaQueryMatches = true
      const ctx = setup({ mode: 'never' })
      expect(ctx.isReduced.value).toBe(false)
    })
  })

  describe('mode', () => {
    it('should update isReduced reactively when mode changes', async () => {
      mediaQueryMatches = true
      const ctx = setup({ mode: 'never' })
      expect(ctx.isReduced.value).toBe(false)

      ctx.select('system')
      await nextTick()
      expect(ctx.isReduced.value).toBe(true)
    })

    it('should switch from always to never', async () => {
      mediaQueryMatches = false
      const ctx = setup({ mode: 'always' })
      expect(ctx.isReduced.value).toBe(true)

      ctx.select('never')
      await nextTick()
      expect(ctx.isReduced.value).toBe(false)
    })

    it('should react to OS media query changes in system mode', async () => {
      mediaQueryMatches = false
      const ctx = setup({ mode: 'system' })
      expect(ctx.isReduced.value).toBe(false)

      lastFireCallback!(true)
      await nextTick()
      expect(ctx.isReduced.value).toBe(true)
    })
  })

  describe('lifecycle', () => {
    it('should remove the media listener when the owning scope stops', async () => {
      mediaQueryMatches = false
      const ctx = setup()
      expect(ctx.isReduced.value).toBe(false)

      scope.stop()

      lastFireCallback!(true)
      await nextTick()
      expect(ctx.isReduced.value).toBe(false)
    })

    it('should stop OS tracking when dispose is called', async () => {
      mediaQueryMatches = false
      const ctx = setup()

      ctx.dispose()

      lastFireCallback!(true)
      await nextTick()
      expect(ctx.isReduced.value).toBe(false)

      expect(() => ctx.dispose()).not.toThrow()
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
    expect(ctx!.isReduced.value).toBe(true)

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

    ctx!.select('always')
    await nextTick()
    expect(document.body.dataset.reducedMotion).toBe('reduce')

    app.unmount()
  })
})

describe('persist/restore', () => {
  it('should restore a persisted mode before setup', () => {
    const app = createApp({ render: () => null })
    app.use(createStoragePlugin({ adapter: new MemoryStorageAdapter() }))

    // Pre-seed storage with 'always' so restore() runs
    app.runWithContext(() => {
      const storage = useStorage()
      storage.set('reduced-motion', 'always')
    })

    app.use(createReducedMotionPlugin({ persist: true }))

    let ctx: ReturnType<typeof useReducedMotion> | undefined
    app.runWithContext(() => {
      ctx = useReducedMotion()
    })

    expect(ctx!.selectedMode.value).toBe('always')
    expect(ctx!.isReduced.value).toBe(true)
  })

  it('should auto-save the mode when it changes', async () => {
    const app = createApp({ render: () => null })
    app.use(createStoragePlugin({ adapter: new MemoryStorageAdapter() }))

    app.use(createReducedMotionPlugin({ persist: true }))
    app.mount(document.createElement('div'))

    app.runWithContext(() => {
      const ctx = useReducedMotion()
      ctx.select('never')
    })

    await nextTick()

    let stored: unknown
    app.runWithContext(() => {
      const storage = useStorage()
      stored = storage.get('reduced-motion').value
    })

    expect(stored).toBe('never')

    app.unmount()
  })

  it('should ignore an invalid string persisted mode', () => {
    const app = createApp({ render: () => null })
    app.use(createStoragePlugin({ adapter: new MemoryStorageAdapter() }))

    app.runWithContext(() => {
      const storage = useStorage()
      storage.set('reduced-motion', 'garbage')
    })

    let ctx: ReturnType<typeof useReducedMotion> | undefined
    expect(() => {
      app.use(createReducedMotionPlugin({ mode: 'always', persist: true }))
      app.runWithContext(() => {
        ctx = useReducedMotion()
      })
    }).not.toThrow()

    expect(ctx!.selectedMode.value).toBe('always')
  })

  it('should ignore a non-string persisted mode', () => {
    const app = createApp({ render: () => null })
    app.use(createStoragePlugin({ adapter: new MemoryStorageAdapter() }))

    app.runWithContext(() => {
      const storage = useStorage()
      storage.set('reduced-motion', 123)
    })

    let ctx: ReturnType<typeof useReducedMotion> | undefined
    expect(() => {
      app.use(createReducedMotionPlugin({ mode: 'always', persist: true }))
      app.runWithContext(() => {
        ctx = useReducedMotion()
      })
    }).not.toThrow()

    expect(ctx!.selectedMode.value).toBe('always')
  })

  it('should throw when persist is enabled without the storage plugin', () => {
    const app = createApp({ render: () => null })

    expect(() => app.use(createReducedMotionPlugin({ persist: true }))).toThrow('v0:storage')
  })

  it('should honor a custom namespace', () => {
    let ctx: ReturnType<typeof useReducedMotion> | undefined

    const app = createApp({
      setup () {
        ctx = useReducedMotion('v0:custom-motion')
        return () => null
      },
    })

    app.use(createReducedMotionPlugin({ namespace: 'v0:custom-motion', mode: 'always' }))
    app.mount(document.createElement('div'))

    expect(ctx).toBeDefined()
    expect(ctx!.isReduced.value).toBe(true)

    app.unmount()
  })
})

describe('useReducedMotion (fallback)', () => {
  it('should return fallback when no plugin is installed', () => {
    const ctx = useReducedMotion()
    expect(ctx.isReduced.value).toBe(false)
    expect(ctx.selectedMode.value).toBe('system')

    ctx.select('always')
    expect(ctx.selectedMode.value).toBe('system')

    expect(() => ctx.dispose()).not.toThrow()
  })
})

describe('adapters', () => {
  it('should use a custom adapter and dispose it on unmount', () => {
    const dispose = vi.fn()

    class SpyAdapter extends ReducedMotionAdapter {
      ran = false
      setup () {
        this.ran = true
        this.dispose = dispose
      }
    }

    const adapter = new SpyAdapter()
    const app = createApp({ setup: () => () => null })
    app.use(createReducedMotionPlugin({ adapter }))
    app.mount(document.createElement('div'))

    expect(adapter.ran).toBe(true)

    app.unmount()
    expect(dispose).toHaveBeenCalledTimes(1)
  })

  it('should stop the default adapter watch on unmount', async () => {
    mediaQueryMatches = false
    let ctx: ReturnType<typeof useReducedMotion> | undefined
    const app = createApp({
      setup () {
        ctx = useReducedMotion()
        return () => null
      },
    })
    app.use(createReducedMotionPlugin({ mode: 'system' }))
    app.mount(document.createElement('div'))

    await nextTick()
    expect(document.body.dataset.reducedMotion).toBe('no-preference')

    app.unmount()
    delete document.body.dataset.reducedMotion

    // Watch is disposed → a later mode change no longer writes the dataset.
    ctx!.select('always')
    await nextTick()
    expect(document.body.dataset.reducedMotion).toBeUndefined()
  })

  it('should stop reacting to OS changes after unmount', async () => {
    mediaQueryMatches = false
    let ctx: ReturnType<typeof useReducedMotion> | undefined
    const app = createApp({
      setup () {
        ctx = useReducedMotion()
        return () => null
      },
    })
    app.use(createReducedMotionPlugin({ mode: 'system' }))
    app.mount(document.createElement('div'))

    lastFireCallback!(true)
    await nextTick()
    expect(ctx!.isReduced.value).toBe(true)

    app.unmount()

    // Media-query listener removed → a later OS change does not flip isReduced.
    lastFireCallback!(false)
    await nextTick()
    expect(ctx!.isReduced.value).toBe(true)
  })
})
