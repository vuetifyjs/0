/**
 * SSR-specific tests for useLogger composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
  __LOGGER_ENABLED__: true,
}))

import { useLogger } from './index'

describe('useLogger SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => useLogger()).not.toThrow()
  })

  it('warn() writes to console.warn in SSR', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const ctx = useLogger()
    ctx.warn('test message')

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('test message'))

    spy.mockRestore()
  })

  it('error() writes to console.error in SSR', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const ctx = useLogger()
    ctx.error('something failed')

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('something failed'))

    spy.mockRestore()
  })

  it('two calls without a provider return distinct fallback instances', () => {
    const first = useLogger()
    const second = useLogger()

    expect(first).not.toBe(second)
  })
})
