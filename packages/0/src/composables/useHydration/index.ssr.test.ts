/**
 * SSR-specific tests for useHydration composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useHydration } from './index'

describe('useHydration SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => useHydration()).not.toThrow()
  })

  it('fallback reports isHydrated as true (safe-passthrough in SSR)', () => {
    const ctx = useHydration()

    expect(ctx.isHydrated.value).toBe(true)
  })

  it('fallback reports isSettled as true', () => {
    const ctx = useHydration()

    expect(ctx.isSettled.value).toBe(true)
  })

  it('two calls without a provider return distinct fallback instances', () => {
    const first = useHydration()
    const second = useHydration()

    expect(first).not.toBe(second)
  })
})
