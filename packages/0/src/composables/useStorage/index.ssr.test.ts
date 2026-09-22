/**
 * SSR-specific tests for useStorage composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 *
 * In SSR the fallback uses MemoryStorageAdapter instead of window.localStorage
 * so storage operations work without crashing.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useStorage } from './index'

describe('useStorage SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => useStorage()).not.toThrow()
  })

  it('uses an in-memory adapter in SSR (does not access window.localStorage)', () => {
    const ctx = useStorage()

    expect(() => {
      ctx.set('key', 'value')
      ctx.get('key')
    }).not.toThrow()
  })

  it('set/get round-trips through the memory adapter', () => {
    const ctx = useStorage()

    ctx.set('ssr-key', 'ssr-value')

    expect(ctx.get('ssr-key').value).toBe('ssr-value')
  })

  it('two calls without a provider return distinct fallback instances (no cross-request contamination)', () => {
    const first = useStorage()
    first.set('shared', 'from-first')

    const second = useStorage()

    expect(second.get('shared').value).toBeUndefined()
  })
})
