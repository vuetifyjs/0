/**
 * SSR-specific tests for usePermissions composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { usePermissions } from './index'

describe('usePermissions SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => usePermissions()).not.toThrow()
  })

  it('can() returns false for all actions when no plugin is installed', () => {
    const ctx = usePermissions()

    expect(ctx.can('user-1', 'edit', 'posts')).toBe(false)
    expect(ctx.can('user-1', 'delete', 'posts')).toBe(false)
    expect(ctx.can('user-1', 'view', 'posts')).toBe(false)
  })

  it('two calls without a provider return distinct fallback instances', () => {
    const first = usePermissions()
    const second = usePermissions()

    expect(first).not.toBe(second)
  })
})
