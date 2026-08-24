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
  it('should not throw when called without a provider in SSR', () => {
    expect(() => usePopover()).not.toThrow()
  })

  it('should return a fresh instance per call in SSR', () => {
    const first = usePopover()
    const second = usePopover()

    expect(first).not.toBe(second)
  })

  it('should not share state across calls in SSR', () => {
    const first = usePopover()
    first.open()

    const second = usePopover()

    expect(first.isOpen.value).toBe(true)
    expect(second.isOpen.value).toBe(false)
  })

  it('should fall back to V0PopoverAdapter when plugin not installed in SSR', () => {
    const popover = usePopover()

    // V0PopoverAdapter.setup() emits distinctive keys: position-area, position-try-fallbacks, position-anchor
    expect(popover.contentStyles.value['position-area']).toBeDefined()
    expect(popover.contentStyles.value['position-try-fallbacks']).toBeDefined()
  })
})
