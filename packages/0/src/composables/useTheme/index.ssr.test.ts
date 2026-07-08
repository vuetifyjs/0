/**
 * SSR-specific tests for useTheme composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useTheme } from './index'

describe('useTheme SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => useTheme()).not.toThrow()
  })

  it('isDark defaults to false in SSR fallback', () => {
    const ctx = useTheme()

    expect(ctx.isDark.value).toBe(false)
  })

  it('colors returns an empty object in SSR fallback', () => {
    const ctx = useTheme()

    expect(ctx.colors.value).toEqual({})
  })

  it('two calls without a provider return distinct fallback instances', () => {
    const first = useTheme()
    const second = useTheme()

    expect(first).not.toBe(second)
  })
})
