/**
 * SSR-specific tests for useBreakpoints composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
  SUPPORTS_MATCH_MEDIA: false,
}))

import { useBreakpoints } from './index'

describe('useBreakpoints SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => useBreakpoints()).not.toThrow()
  })

  it('falls back to xs breakpoint with zero dimensions', () => {
    const ctx = useBreakpoints()

    expect(ctx.name.value).toBe('xs')
    expect(ctx.width.value).toBe(0)
    expect(ctx.height.value).toBe(0)
  })

  it('sets isMobile to true in SSR fallback', () => {
    const ctx = useBreakpoints()

    expect(ctx.isMobile.value).toBe(true)
  })

  it('only xs is true in fallback; larger breakpoints are false', () => {
    const ctx = useBreakpoints()

    expect(ctx.xs.value).toBe(true)
    expect(ctx.sm.value).toBe(false)
    expect(ctx.md.value).toBe(false)
    expect(ctx.lg.value).toBe(false)
    expect(ctx.xl.value).toBe(false)
    expect(ctx.xxl.value).toBe(false)
  })

  it('two calls without a provider return distinct fallback instances', () => {
    const first = useBreakpoints()
    const second = useBreakpoints()

    expect(first).not.toBe(second)
  })
})
