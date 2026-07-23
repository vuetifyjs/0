/**
 * SSR-specific tests for useNotifications composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useNotifications } from './index'

describe('useNotifications SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => useNotifications()).not.toThrow()
  })

  it('size is 0 in SSR fallback', () => {
    const ctx = useNotifications()

    expect(ctx.size).toBe(0)
  })

  it('send() returns a stub notification without crashing', () => {
    const ctx = useNotifications()

    expect(() => ctx.send({ subject: 'hello' })).not.toThrow()
  })

  it('two calls without a provider return distinct fallback instances', () => {
    const first = useNotifications()
    const second = useNotifications()

    expect(first).not.toBe(second)
  })
})
