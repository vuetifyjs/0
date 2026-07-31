/**
 * SSR-specific tests for useLocale composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useLocale } from './index'

describe('useLocale SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => useLocale()).not.toThrow()
  })

  it('t() returns the key when no locale plugin is installed', () => {
    const ctx = useLocale()

    expect(ctx.t('Component.label')).toBe('Component.label')
  })

  it('ti() returns undefined when no locale plugin is installed', () => {
    const ctx = useLocale()

    expect(ctx.ti('Component.label')).toBeUndefined()
  })

  it('two calls without a provider return distinct fallback instances', () => {
    const first = useLocale()
    const second = useLocale()

    expect(first).not.toBe(second)
  })
})
