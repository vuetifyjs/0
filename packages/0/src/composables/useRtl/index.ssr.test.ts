/**
 * SSR-specific tests for useRtl composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useRtl } from './index'

describe('useRtl SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => useRtl()).not.toThrow()
  })

  it('isRtl defaults to false in SSR fallback', () => {
    const ctx = useRtl()

    expect(ctx.isRtl.value).toBe(false)
  })

  it('two calls without a provider return distinct fallback instances', () => {
    const first = useRtl()
    const second = useRtl()

    expect(first).not.toBe(second)
  })
})
