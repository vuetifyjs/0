/**
 * SSR-specific tests for usePopover composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { usePopover } from './index'

describe('usePopover SSR', () => {
  it('should not throw when called without a provider', () => {
    expect(() => usePopover({ id: 'ssr-1' })).not.toThrow()
  })

  it('should use V0PopoverAdapter CSS output without a plugin', () => {
    const popover = usePopover({ id: 'ssr' })

    expect(popover.contentStyles.value['position-area']).toBe('bottom')
    expect(popover.contentStyles.value['position-try-fallbacks']).toBe('most-width bottom')
  })

  it('should default isOpen to false in SSR fallback', () => {
    const popover = usePopover({ id: 'ssr-2' })

    expect(popover.isOpen.value).toBe(false)
  })

  it('should return distinct instances on two calls without a provider', () => {
    const first = usePopover({ id: 'ssr-a' })
    const second = usePopover({ id: 'ssr-b' })

    expect(first).not.toBe(second)
  })
})
