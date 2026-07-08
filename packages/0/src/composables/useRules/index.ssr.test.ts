/**
 * SSR-specific tests for useRules composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useRules } from './index'

describe('useRules SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => useRules()).not.toThrow()
  })

  it('resolve() returns an array containing the raw function when no alias is registered', () => {
    const ctx = useRules()
    function rule (v: unknown) { return !!v || 'required' }

    expect(ctx.resolve([rule])).toEqual([rule])
  })

  it('aliases are empty when no plugin is installed', () => {
    const ctx = useRules()

    expect(Object.keys(ctx.aliases)).toHaveLength(0)
  })

  it('two calls without a provider return distinct fallback instances', () => {
    const first = useRules()
    const second = useRules()

    expect(first).not.toBe(second)
  })
})
