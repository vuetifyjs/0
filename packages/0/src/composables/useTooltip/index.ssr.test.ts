/**
 * SSR-specific tests for useTooltip composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useTooltip } from './index'

describe('useTooltip SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => useTooltip()).not.toThrow()
  })

  it('openDelay defaults to 700ms in SSR fallback', () => {
    const ctx = useTooltip()

    expect(ctx.openDelay.value).toBe(700)
  })

  it('isAnyOpen is false with no registered tooltips', () => {
    const ctx = useTooltip()

    expect(ctx.isAnyOpen.value).toBe(false)
  })

  it('two calls without a provider return distinct fallback instances', () => {
    const first = useTooltip()
    const second = useTooltip()

    expect(first).not.toBe(second)
  })
})
