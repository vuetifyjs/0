/**
 * SSR-specific tests for useStack composable.
 *
 * Verifies that two no-provider useStack() calls in server context do not
 * share tickets — i.e. getStackFallback() returns a fresh ephemeral instance
 * per call rather than a module-level singleton.
 *
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useStack } from './index'

describe('useStack SSR', () => {
  it('two no-provider calls return distinct stack instances', () => {
    const first = useStack()
    const second = useStack()

    expect(first).not.toBe(second)
  })

  it('tickets registered in the first call do not appear in the second call', () => {
    const first = useStack()
    first.register()

    const second = useStack()

    expect(second.size).toBe(0)
  })

  it('does not throw when called outside component context under SSR', () => {
    expect(() => useStack()).not.toThrow()
  })
})
