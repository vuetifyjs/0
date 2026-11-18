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

import { createLocale, useLocale } from './index'

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

  it('should format numbers for the selected locale the way the client does', () => {
    const locale = createLocale({ default: 'ar-EG', messages: { 'ar-EG': {} } })

    expect(locale.n(7)).toBe(new Intl.NumberFormat('ar-EG').format(7))
    expect(locale.n(7)).not.toBe('7')
    expect(locale.n(1234.5)).toBe(new Intl.NumberFormat('ar-EG').format(1234.5))
  })

  it('should fall back to the bare number for a locale id Intl rejects, and warn once', () => {
    // An id no other test uses: the warning is given once per id for the
    // life of the module.
    using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const locale = createLocale({ default: 'no_such_tag_ssr', messages: { no_such_tag_ssr: {} } })

    expect(locale.n(1234.5)).toBe('1234.5')
    expect(locale.n(7)).toBe('7')
    expect(createLocale({ default: 'no_such_tag_ssr', messages: { no_such_tag_ssr: {} } }).n(7)).toBe('7')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('no_such_tag_ssr'))
  })
})
