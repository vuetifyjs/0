/**
 * SSR-specific tests for useStack composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useStack } from './index'

describe('useStack SSR', () => {
  it('should not throw when called without a provider in SSR', () => {
    expect(() => useStack()).not.toThrow()
  })

  it('should return a fresh ephemeral stack per call in SSR', () => {
    const first = useStack()
    const second = useStack()

    expect(first).not.toBe(second)
  })

  it('should not share registered tickets across calls in SSR', () => {
    const first = useStack()
    first.register()

    const second = useStack()

    expect(first.size).toBe(1)
    expect(second.size).toBe(0)
  })
})
