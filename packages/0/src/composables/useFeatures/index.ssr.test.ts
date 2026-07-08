/**
 * SSR-specific tests for useFeatures composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useFeatures } from './index'

describe('useFeatures SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => useFeatures()).not.toThrow()
  })

  it('variation returns the provided fallback when no plugin is installed', () => {
    const ctx = useFeatures()

    expect(ctx.variation('my-flag', 'control')).toBe('control')
  })

  it('variation returns null by default when no fallback argument given', () => {
    const ctx = useFeatures()

    expect(ctx.variation('my-flag')).toBeNull()
  })

  it('two calls without a provider return distinct fallback instances', () => {
    const first = useFeatures()
    const second = useFeatures()

    expect(first).not.toBe(second)
  })
})
