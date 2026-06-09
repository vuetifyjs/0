import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
  SUPPORTS_MATCH_MEDIA: true,
}))

// Adapters
import { V0ReducedMotionAdapter } from './adapters/v0'

// Utilities
import { computed, effectScope, hasInjectionContext, nextTick, shallowRef } from 'vue'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
    hasInjectionContext: vi.fn(),
  }
})

const mockHasInjectionContext = vi.mocked(hasInjectionContext)

import {
  createReducedMotion,
  createReducedMotionFallback,
  useReducedMotion,
} from './index'

// Mock matchMedia so tests run headlessly
function mockMatchMedia (matches: boolean) {
  const listeners = new Set<(e: { matches: boolean }) => void>()
  const mql = {
    matches,
    addEventListener: vi.fn((_: string, handler: (e: { matches: boolean }) => void) => {
      listeners.add(handler)
    }),
    removeEventListener: vi.fn((_: string, handler: (e: { matches: boolean }) => void) => {
      listeners.delete(handler)
    }),
    dispatchChange: (value: boolean) => {
      listeners.forEach(fn => fn({ matches: value }))
    },
  }
  window.matchMedia = vi.fn(() => mql as unknown as MediaQueryList)
  return mql
}

afterEach(() => {
  vi.restoreAllMocks()
  delete (document.body.dataset as Record<string, string | undefined>).reducedMotion
})

describe('createReducedMotion', () => {
  it('defaults mode to system', () => {
    const ctx = createReducedMotion()
    expect(ctx.mode.value).toBe('system')
  })

  it('respects initial default option', () => {
    const ctx = createReducedMotion({ default: 'always' })
    expect(ctx.mode.value).toBe('always')
  })

  it('reduced is true when mode is always', () => {
    const ctx = createReducedMotion({ default: 'always' })
    expect(ctx.reduced.value).toBe(true)
    expect(ctx.current.value).toBe('reduce')
  })

  it('reduced is false when mode is never', () => {
    const ctx = createReducedMotion({ default: 'never' })
    expect(ctx.reduced.value).toBe(false)
    expect(ctx.current.value).toBe('no-preference')
  })

  it('reduced follows system media query when mode is system', () => {
    mockMatchMedia(true)
    const ctx = createReducedMotion({ default: 'system' })
    expect(ctx.reduced.value).toBe(true)
  })

  it('reduced is false for system when media query does not match', () => {
    mockMatchMedia(false)
    const ctx = createReducedMotion({ default: 'system' })
    expect(ctx.reduced.value).toBe(false)
  })
})

describe('V0ReducedMotionAdapter', () => {
  it('sets body dataset on setup', () => {
    const mql = mockMatchMedia(false)
    const scope = effectScope()
    scope.run(() => {
      const adapter = new V0ReducedMotionAdapter()
      const ctx = createReducedMotion({ default: 'always' })
      adapter.setup({} as any, ctx)
      expect(document.body.dataset.reducedMotion).toBe('reduce')
    })
    scope.stop()
  })

  it('updates body dataset when reduced changes', async () => {
    mockMatchMedia(false)
    const scope = effectScope()
    await scope.run(async () => {
      const adapter = new V0ReducedMotionAdapter()
      const ctx = createReducedMotion({ default: 'never' })
      adapter.setup({} as any, ctx)
      expect(document.body.dataset.reducedMotion).toBe('no-preference')

      ctx.mode.value = 'always'
      await nextTick()
      expect(document.body.dataset.reducedMotion).toBe('reduce')
    })
    scope.stop()
  })

  it('reacts to system media query changes when mode is system', async () => {
    const mql = mockMatchMedia(false)
    const scope = effectScope()
    await scope.run(async () => {
      const adapter = new V0ReducedMotionAdapter()
      const ctx = createReducedMotion({ default: 'system' })
      adapter.setup({} as any, ctx)
      expect(document.body.dataset.reducedMotion).toBe('no-preference')

      mql.dispatchChange(true)
      await nextTick()
      expect(document.body.dataset.reducedMotion).toBe('reduce')
    })
    scope.stop()
  })
})

describe('createReducedMotionFallback', () => {
  it('always returns reduced = false', () => {
    const ctx = createReducedMotionFallback()
    expect(ctx.reduced.value).toBe(false)
    expect(ctx.current.value).toBe('no-preference')
  })
})

describe('useReducedMotion', () => {
  it('returns fallback when no injection context', () => {
    mockHasInjectionContext.mockReturnValue(false)
    const ctx = useReducedMotion()
    expect(ctx.reduced.value).toBe(false)
  })
})
