/**
 * SSR-specific tests for useFocusTrap.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useFocusTrap } from './index'

describe('useFocusTrap SSR', () => {
  it('should not throw when constructed, activated, or handed a keydown', () => {
    const scope = effectScope()

    expect(() => {
      scope.run(() => {
        const trap = useFocusTrap(undefined, { active: true })

        trap.activate()
        trap.onKeydown(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }))
      })
    }).not.toThrow()

    scope.stop()
  })
})
